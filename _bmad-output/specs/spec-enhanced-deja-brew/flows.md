# Flows & Diagrams — Enhanced Deja Brew

Diagrams live in a companion per the canon; SPEC.md holds prose only.

## Site Flow (after spec)

```mermaid
flowchart LR
  A[Main.html hero split<br/>#333 dark + #E8DAB2] --> B[Values ribbon<br/>Community/Quality/Craft]
  B --> C[Featured 3+3<br/>clickable cards]
  C --> D[#about anchor<br/>story + Coffeeshop.jpeg]
  D --> E[Unified MenuOrder<br/>All | Coffee | Pastry<br/>pill price + sensory + origin]
  E -->|Add to cart| F[Mini-cart drawer<br/>LocalStorage +/- count]
  F -->|Order Now| G[order-success.html<br/>well-formed + cross-sell<br/>shareable receipt]
  G -->|Reorder| E
  E -->|Mood picker<br/>Cozy/Bold| H[Recommendation<br/>pastry-first variant]
  H --> E
```

## Interaction States
- **Progress:** `scrollY / (documentHeight - viewport)` → width of `#f0a500` bar under sticky navbar.
- **Cart:** `localStorage key deja-brew-cart = [{id, qty}]`; navbar badge = sum qty; drawer renders from `menu-catalog.md` by ID.
- **Filters:** Tabs filter `type`; chips filter `tags`; text search filters `name` + `tasting` + `origin`.
- **Mood:** `Cozy` biases Latte/Croissant/Macaron; `Bold` biases Espresso/Americano/Kringle.

## Responsive
- `>768px`: hero split 48/48, menu-grid row; `≤768px`: `flex-direction: column; align-items: center; width 100%` per existing `style.css:205` switch — preserve behavior, upgrade surfaces.
