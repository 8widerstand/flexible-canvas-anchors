# Canvas Runtime Inspection

## Purpose

This technical spike investigates how Obsidian represents Canvas nodes and edges in the persisted `.canvas` file and in
the live application runtime.

The goal is to identify the smallest internal API boundary required to implement flexible edge anchor points without
coupling the complete plugin to undocumented Obsidian internals.

## Test Environment

- Obsidian Desktop: `1.13.7`
- Operating system: Windows
- Plugin version: `0.1.0`
- Branch: `spike/canvas-runtime-inspection`
- Inspection date: `2026-09-02`

The tests were performed in a dedicated development vault.

## Controlled Canvas Fixture

The test Canvas contains two text nodes and one native edge:

```text
Source ───────────────► Target
 right                  left
```

The Source node was deliberately resized to a height of `500` Canvas units to make the native midpoint behavior easy to
observe.

Observed runtime geometry:

| Element |      x |      y | Width | Height |
|---------|-------:|-------:|------:|-------:|
| Source  | `-200` | `-400` | `127` |  `500` |
| Target  |    `7` | `-180` | `140` |   `60` |

## Persisted Canvas Findings

The public JSON Canvas format stores nodes and edges in top-level arrays:

```json
{
  "nodes": [],
  "edges": []
}
```

A native edge stores the source and target node identifiers and optionally one of four sides:

```json
{
  "fromNode": "source-node-id",
  "fromSide": "right",
  "toNode": "target-node-id",
  "toSide": "left"
}
```

The supported sides are:

```text
top
right
bottom
left
```

The standard format does not provide an offset, ratio, or exact coordinate along a side.

The controlled tests showed that:

- Resizing a node changes its position and dimensions but does not add edge anchor coordinates.
- Reconnecting an endpoint to another side changes only `fromSide` or `toSide`.
- No hidden native property records a position along the selected side.
- Additional custom properties are permitted by the Obsidian Canvas TypeScript definitions.

## Public API Boundary

Obsidian publicly exposes the persisted Canvas data types, including:

- `CanvasData`
- `CanvasNodeData`
- `CanvasEdgeData`
- `NodeSide`

Obsidian does not publicly expose types for the live Canvas view, live nodes, live edges, or their rendering lifecycle.

The plugin must therefore distinguish between:

```text
Public and stable
└── persisted Canvas data

Internal and unstable
└── live Canvas runtime and DOM
```

## Runtime Access Path

The active Canvas runtime was reached through the following path:

```text
Plugin
└── app
    └── workspace
        └── active TextFileView
            └── getViewType() === "canvas"
                └── internal view.canvas
```

`TextFileView` and `getViewType()` belong to the public Obsidian API. The `canvas` property on the view is internal and
must remain isolated behind a local adapter.

The diagnostic command does not mutate the Canvas. It reads the runtime and writes a snapshot to `console.debug`.

## Canvas Runtime Findings

The live Canvas object exposes, among other internal properties:

```text
canvas
├── nodes: Map
├── edges: Map
├── getData()
├── selection: Set
├── wrapperEl
├── canvasEl
├── edgeContainerEl
├── pointer
└── viewport state
```

For the controlled fixture:

```text
nodes.size = 2
edges.size = 1
```

The runtime uses `Map` collections keyed by the same identifiers stored in the `.canvas` file. This provides a direct
relationship between persisted data and live objects.

Minified constructor names such as `e` and `t` were visible during inspection. The plugin must never depend on these
names because they are implementation details and may change between Obsidian releases.

## Node Runtime Findings

A live text node exposes state including:

```text
id
x
y
width
height
nodeEl
containerEl
contentEl
placeholderEl
canvas
text
```

The `nodeEl` property references the outer `div.canvas-node` element. DevTools confirmed that its dimensions match the
node dimensions and that hovering this element highlights the corresponding Canvas card.

`nodeEl` is therefore a possible host for visual anchor controls. It is still an internal DOM element and must only be
accessed through the runtime adapter.

The node prototype chain exposes behavior including:

```text
getData()
setData()
setText()
moveAndResize()
render()
focus()
blur()
destroy()
unloadChild()
```

These methods confirm that Canvas nodes have an internal rendering and lifecycle model. Anchor elements must be
re-creatable and removable because nodes or their content may be rendered, unloaded, or destroyed.

The inspection spike uses read-only members. Mutation methods such as `setData()`, `setText()`, and `moveAndResize()`
are outside its scope.

## Edge Runtime Findings

A live edge contains endpoint descriptors:

```text
from
├── node
├── side
└── end

to
├── node
├── side
└── end
```

It also contains calculated rendering data:

```text
bbox

bezier
├── from
├── to
├── cp1
├── cp2
└── path

path
├── interaction
└── display
```

The edge DOM is rendered with SVG elements such as `lineGroupEl`, `lineEndGroupEl`, and SVG paths.

The `from` and `to` descriptors contain a node and a side but no ratio or offset along that side. The `bezier` values
are calculated rendering geometry and are not persisted anchor metadata.

## Native Midpoint Geometry

For a node with bounds:

```text
x
y
width
height
```

The native midpoint of the right side is:

```text
anchorX = x + width
anchorY = y + height / 2
```

For the Source node:

```text
anchorX = -200 + 127
        = -73

anchorY = -400 + 500 / 2
        = -150
```

The inspected edge bounding box reported the same point:

```text
minX = -73
minY = -150
```

For the Target node, the midpoint of the left side is:

```text
anchorX = x
        = 7

anchorY = y + height / 2
        = -180 + 60 / 2
        = -150
```

The inspected edge bounding box also reported:

```text
maxX = 7
maxY = -150
```

This confirms that native Canvas edges use the center of the selected side.

The rendered Bézier endpoints were offset by approximately seven units from the node boundaries. This appears to be a
visual rendering margin. It is an observation, not a stable constant, and must not be hard-coded without further
validation.

## Flexible Anchor Model

A flexible anchor can be represented by a normalized ratio in the inclusive range `0..1`.

For a vertical side:

```text
anchorY = node.y + node.height * ratio
```

For the resized Source node:

| Ratio | Calculation        | Anchor y |
|------:|--------------------|---------:|
| `0.2` | `-400 + 500 × 0.2` |   `-300` |
| `0.5` | `-400 + 500 × 0.5` |   `-150` |
| `0.8` | `-400 + 500 × 0.8` |      `0` |

The MVP will expose `20%`, `50%`, and `80%` anchor choices. The underlying model should use a normalized ratio so that
additional anchor positions can be supported later without changing the geometry model.

## Proposed Architecture

Internal runtime access must be isolated:

```text
Obsidian internal Canvas runtime
            │
            ▼
Canvas runtime adapter
            │
            ├── node bounds
            ├── edge endpoints
            └── node host elements
            │
            ▼
Pure anchor geometry
            │
            ▼
Anchor UI renderer
```

Responsibilities:

### Canvas runtime adapter

- Locate the active Canvas.
- Validate the expected runtime shape.
- Read live nodes and edges.
- Expose only the minimal information required by the plugin.
- Contain all casts to undocumented internal types.

### Geometry layer

- Use plain data without Obsidian runtime objects.
- Calculate an anchor point from node bounds, side, and ratio.
- Remain independently unit-testable.

### UI renderer

- Render plugin-owned anchor elements.
- Attach and remove those elements safely.
- Handle node rendering and destruction.
- Avoid leaking event listeners or DOM elements.

### Persistence layer

- Preserve the standard `fromNode`, `fromSide`, `toNode`, and `toSide` properties.
- Store plugin-specific anchor metadata in a namespaced and versioned structure.
- Allow Obsidian to display a valid native fallback when the plugin is disabled.

The exact custom metadata schema is not fixed by this spike.

## Risks and Open Questions

- Internal Canvas properties may change between Obsidian versions.
- Nodes may be rendered, unloaded, or replaced during viewport changes.
- The correct lifecycle hooks for adding and removing anchor elements still need to be identified.
- The safest way to influence native edge path calculation still needs to be determined.
- Custom metadata may interact with other Canvas plugins.
- Mobile behavior has not been evaluated.
- Runtime validation and graceful failure behavior must be designed before production use.

## Spike Conclusion

The spike confirms that the plugin concept is technically plausible.

The persisted format provides stable node bounds and edge sides but does not support positions along a side. The live
runtime provides node objects, edge objects, calculated geometry, and DOM/SVG elements required for a desktop
implementation.

Because the live runtime is undocumented, the plugin must use a narrow adapter and keep geometry and persistence logic
independent from Obsidian internals.

No flexible anchor functionality was implemented during this spike.

## Next Steps

1. Clean up the diagnostic implementation and local runtime types.
2. Add a short spike summary and documentation link to the README.
3. Validate TypeScript, ESLint, and the production build.
4. Commit and merge the runtime inspection spike.
5. Create a new branch for the pure anchor geometry layer.
6. Define the anchor value objects and side/ratio validation.
7. Implement unit-tested anchor point calculations.
8. Start a separate UI spike for rendering read-only anchor markers.

## References

- [JSON Canvas 1.0 specification](https://jsoncanvas.org/spec/1.0/)
- [Official Obsidian Canvas type definitions](https://github.com/obsidianmd/obsidian-api/blob/master/canvas.d.ts)
- [Official Obsidian API type definitions](https://github.com/obsidianmd/obsidian-api/blob/master/obsidian.d.ts)
- [Advanced Canvas runtime access example](https://github.com/Developer-Mike/obsidian-advanced-canvas/blob/main/src/main.ts)
- [Advanced Canvas floating edge implementation](https://github.com/Developer-Mike/obsidian-advanced-canvas/blob/main/src/canvas-extensions/floating-edge-canvas-extension.ts)

Advanced Canvas is licensed under GPL-3.0. It was inspected as a behavioral reference only. No implementation code was
copied into this MIT-licensed project.
