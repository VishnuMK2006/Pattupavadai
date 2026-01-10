import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Scene from "./components/Scene";
import AuthForm from "./components/AuthForm";
import ProductSelect from "./components/ProductSelect";
import Preview from "./components/Preview";

function App() {
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedTopStyle, setSelectedTopStyle] = useState("t1");
  const [selectedBottomStyle, setSelectedBottomStyle] = useState("p1");

  // Restore login session on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pp_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email && parsed?.token) {
          setUser(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to restore session", err);
    }
  }, []);

  const products = [
    { id: "pattu-paavadai", name: "Pattu Paavadai", blurb: "Handwoven silk skirt set crafted for festive shine.", accent: "#fbbf24" },
    { id: "ethnic-frock", name: "Ethnic Frock", blurb: "Lightweight frock with zari trims for celebrations.", accent: "#a855f7" },
    { id: "kurta-pyjama", name: "Kurta Pyjama", blurb: "Classic kurta with comfy pyjama for all-day wear.", accent: "#38bdf8" },
    { id: "kurta-pant", name: "Kurta Pant", blurb: "Structured kurta paired with modern slim pants.", accent: "#22c55e" },
  ];

  const fabrics = [
    { id: "banarasi-silk", name: "Banarasi Silk", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
    { id: "tissue-silk", name: "Tissue Silk", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
    { id: "kalamkari-kalyani", name: "Kalamkari Kalyani", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
    { id: "cotton", name: "Cotton", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
    { id: "organza", name: "Organza", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
  ];

  const topStyles = [
    { id: "t1", name: "Top 1", path: "/models/t1.glb" },
    { id: "t2", name: "Top 2", path: "/models/t2.glb" },
    { id: "t3", name: "Top 3", path: "/models/t3.glb" },
    { id: "t4", name: "Top 4", path: "/models/t4.glb" },
  ];

  const bottomStyles = [
    { id: "p1", name: "Bottom 1", path: "/models/p1.glb" },
    { id: "p2", name: "Bottom 2", path: "/models/p2.glb" },
    { id: "p3", name: "Bottom 3", path: "/models/p3.glb" },
    { id: "p4", name: "Bottom 4", path: "/models/p4.glb" },
  ];

  const handleSignOut = () => {
    setUser(null);
    setSelectedProduct(null);
    setSelectedFabric(null);
    setSelectedTopStyle("t1");
    setSelectedBottomStyle("p1");
    localStorage.removeItem("pp_user");
  };

  const activeProduct = products.find((p) => p.id === selectedProduct) || null;
  const activeFabric = useMemo(
    () => fabrics.find((f) => f.id === selectedFabric) || null,
    [selectedFabric]
  );

  const handleProductSelect = (product) => {
    setSelectedProduct(product.id);
    setSelectedFabric(null);
  };

  const handleChangeProduct = () => {
    setSelectedProduct(null);
    setSelectedFabric(null);
    setSelectedTopStyle("t1");
    setSelectedBottomStyle("p1");
  };

  const handleFabricSelect = (fabricId) => {
    setSelectedFabric(fabricId);
  };

  const handleTopStyleSelect = (styleId) => {
    setSelectedTopStyle(styleId);
  };

  const handleBottomStyleSelect = (styleId) => {
    setSelectedBottomStyle(styleId);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("pp_user", JSON.stringify(userData));
  };

  if (!user) {
    return (
      <div className="auth-shell">
        <div className="auth-panel">
          <div className="auth-hero">
            <p className="eyebrow">Pattupavadai</p>
            <h1>Login to explore</h1>
            <p className="muted">
              Sign in or create an account to save your outfits and shipping
              details before jumping into the 3D dresser.
            </p>
          </div>
          <AuthForm onAuthSuccess={handleAuthSuccess} />
        </div>
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <ProductSelect
        user={user}
        products={products}
        onSelect={handleProductSelect}
        onSignOut={handleSignOut}
      />
    );
  }

  const fabricModels = {
    top: activeFabric?.modelTop || `/models/${selectedTopStyle}.glb`,
    bottom: activeFabric?.modelBottom || `/models/${selectedBottomStyle}.glb`,
    sleeves: activeFabric?.modelSleeves || `/models/${selectedTopStyle}.glb`,
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Pattupavadai</p>
          <strong>3D Dresser</strong>
        </div>
        <div className="topbar-right">
          {activeProduct && (
            <div className="product-chip" style={{ borderColor: activeProduct.accent }}>
              <span className="product-dot" style={{ background: activeProduct.accent }}></span>
              <div>
                <span className="product-label">Selected</span>
                <span className="product-name">{activeProduct.name}</span>
              </div>
              <button className="ghost" onClick={handleChangeProduct}>Change</button>
            </div>
          )}
          <div className="user-chip">
            <div>
              <span className="user-name">{user.name}</span>
              <span className="user-email">{user.email}</span>
            </div>
            <button className="ghost" onClick={handleSignOut}>Sign out</button>
          </div>
        </div>
      </header>

      <div className="app-body">
        <div className="sidebar">
          <h2 className="sidebar-title">Choose fabric</h2>

          <div className="category">
            <h3 className="category-title">Fabric types</h3>
            <div className="fabric-list">
              {fabrics.map((fabric) => (
                <button
                  key={fabric.id}
                  className={`fabric-button ${selectedFabric === fabric.id ? 'active' : ''}`}
                  onClick={() => handleFabricSelect(fabric.id)}
                >
                  <span>{fabric.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="category">
            <h3 className="category-title">Top styles</h3>
            <div className="item-grid">
              {topStyles.map((style) => (
                <button
                  key={style.id}
                  className={`item-button ${selectedTopStyle === style.id ? 'active' : ''}`}
                  onClick={() => handleTopStyleSelect(style.id)}
                >
                  <div className="item-preview">
                    <Preview modelPath={style.path} />
                  </div>
                  <span className="item-name">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="category">
            <h3 className="category-title">Bottom styles</h3>
            <div className="item-grid">
              {bottomStyles.map((style) => (
                <button
                  key={style.id}
                  className={`item-button ${selectedBottomStyle === style.id ? 'active' : ''}`}
                  onClick={() => handleBottomStyleSelect(style.id)}
                >
                  <div className="item-preview">
                    <Preview modelPath={style.path} />
                  </div>
                  <span className="item-name">{style.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="scene-panel">
          <Scene fabricModels={fabricModels} />
        </div>
      </div>
    </div>
  );
}

export default App;