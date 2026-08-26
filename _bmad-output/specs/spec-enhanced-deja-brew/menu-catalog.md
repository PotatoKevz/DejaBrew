# Menu Catalog — Enhanced Deja Brew

Per-entity companion for SPEC-enhanced-deja-brew. Each row is load-bearing; implement caps against this table.

| ID | Name | Type | Price | Image (exact casing) | Sensory (≤8 words) | Origin | Roast | Tasting | Tags |
|---|---|---|---|---|---|---|---|---|---|
| M-C-01 | Espresso | coffee | ₱125.00 | espresso-coffee.png | Dark roast, brown sugar snap | Benguet | Dark | bittersweet, floral, sugar | Craft |
| M-C-02 | Americano | coffee | ₱101.00 | Americano-coffee.jpg | Smooth, clean, just right | Atok | Medium | citrus, clean, bright acidity | Quality |
| M-C-03 | Latte | coffee | ₱135.00 | Latte.jpeg | Creamy, steamed milk cradle | Sagada | Medium | floral, caramel, creamy body | Community |
| M-C-04 | Cappuccino | coffee | ₱143.73 | Cappuccino.jpg | Rich, foamy classic | Mt. Apo | Medium | cocoa, nutty finish | Craft |
| M-C-05 | Frappuccino | coffee | ₱143.73 | Frappuccino.jpg | Cool, creamy refreshment | — (blend) | Light | vanilla, berry, undertone | Quality |
| M-P-01 | Croissant | pastry | ₱85.00 | Kwasant.jpg | Flaky, buttery, fresh-baked | — | — | butter, crumb | Craft |
| M-P-02 | Muffin | pastry | ₱35.00 | Muffin.jpg | Soft, moist, flavor burst | — | — | berry, soft | Community |
| M-P-03 | Kringle | pastry | ₱180.00 | Kringle.jpg | Oval Danish, delicate layers | — | — | almond, flake | Craft |
| M-P-04 | Donut | pastry | ₱30.00 | Donut.jpg | Sweet, soft, coffee pair | — | — | sugar, glaze | Quality |
| M-P-05 | Macaron | pastry | ₱330.00 /box | Macaron.jpg | Delicate, colorful sweet | — | — | almond, sweet | Gluten Free |

## Rules
- Prices display as pill badge, never `<u>`; currency `₱`.
- Card order supports toggle: default Coffee-first; alternate Pastry-first (C-06 reversed) for the “reverse grid” test.
- Images must preserve exact filename casing; `Kwasant.jpg` is canonical for Croissant despite spelling.
- `Gluten Free` appears only on Macaron; its price suffix is ` /box`.
- Value tags map: `Craft` → pastry technique, `Quality` → sourcing/roast, `Community` → approachable/shareable items.
