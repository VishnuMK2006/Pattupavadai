const defaultProducts = [
  {
    id: "pattu-paavadai",
    name: "Pattu Paavadai",
    blurb: "Classic silk set with rich colors and zari borders.",
    tag: "Traditional",
  },
  {
    id: "ethnic-frock",
    name: "Ethnic Frock",
    blurb: "Lightweight festive frock for playful comfort.",
    tag: "Festive",
  },
  {
    id: "kurta-pyjama",
    name: "Kurta Pyjama",
    blurb: "Simple kurta with comfy pyjama for everyday elegance.",
    tag: "Casual",
  },
  {
    id: "kurta-pant",
    name: "Kurta Pant",
    blurb: "Structured kurta paired with tailored pants.",
    tag: "Modern",
  },
];

export default function ProductSelect({ onSelect, products = defaultProducts, user, onSignOut }) {
  return (
    <div className="product-page">
      <div className="product-hero">
        <p className="eyebrow">Pick a collection</p>
        <h1>Select a product to style</h1>
        <p className="muted">
          Choose what you want to preview. You can switch products anytime.
        </p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <button
            key={product.id}
            className="product-card"
            type="button"
            onClick={() => onSelect?.(product)}
          >
            <div className="product-head">
              <span className="product-name">{product.name}</span>
              <span className="product-tag">{product.tag}</span>
            </div>
            <p className="muted">{product.blurb}</p>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
        {user && (
          <span className="muted">Logged in as {user.email}</span>
        )}
        {onSignOut && (
          <button className="ghost" type="button" onClick={onSignOut}>
            Sign out
          </button>
        )}
      </div>
    </div>
  );
}
