import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Scene from "./components/Scene";
import AuthForm from "./components/AuthForm";
import ProductSelect from "./components/ProductSelect";
import Preview from "./components/Preview";
import Sidebar from "./components/Sidebar";
import PaymentModal from "./components/PaymentModal";
import CartDrawer from "./components/CartDrawer";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Logout,
  SwapHoriz,
} from '@mui/icons-material';

function App() {
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedTopStyle, setSelectedTopStyle] = useState("t1");
  const [selectedBottomStyle, setSelectedBottomStyle] = useState("p1");
  const [selectedDressType, setSelectedDressType] = useState("pattu-pavadai");
  const [selectedFabricType, setSelectedFabricType] = useState("Banarasi Silk");
  const [selectedSleeveType, setSelectedSleeveType] = useState("short");
  const [selectedNeckDesign, setSelectedNeckDesign] = useState("round");
  const [selectedBorderDesign, setSelectedBorderDesign] = useState("gold-zari");
  const [topColor, setTopColor] = useState("#ff6600");
  const [bottomColor, setBottomColor] = useState("#2ecc71");
  const [cart, setCart] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const validateSelection = () => {
    if (!selectedFabricType) return "Please select a Fabric Type.";
    if (!selectedDressType) return "Please select a Dress Type.";
    if (!selectedSleeveType) return "Please select a Sleeve Type.";
    if (!selectedNeckDesign) return "Please select a Neck Design.";
    if (!selectedBorderDesign) return "Please select a Border Design.";
    return null;
  };

  const addToCart = () => {
    if (!activeProduct) return;

    const error = validateSelection();
    if (error) {
      alert(error);
      return;
    }

    const newItem = {
      product_id: activeProduct.id,
      product_name: activeProduct.name,
      fabric_type: selectedFabricType, // Use the new fabric type state
      top_style: selectedTopStyle,
      bottom_style: selectedBottomStyle,
      dress_type: selectedDressType,
      sleeve_type: selectedSleeveType,
      neck_design: selectedNeckDesign,
      border_design: selectedBorderDesign,
      top_color: topColor,
      bottom_color: bottomColor,
      accent: activeProduct.accent,
    };

    setCart([...cart, newItem]);
    // Optionally open the summary or show a snackbar here instead of alert
    // alert("Item added to cart!");
  };

  const handleBuyNow = () => {
    if (!activeProduct) return;

    const error = validateSelection();
    if (error) {
      alert(error);
      return;
    }

    const newItem = {
      product_id: activeProduct.id,
      product_name: activeProduct.name,
      fabric_type: selectedFabricType, // Use the new fabric type state
      top_style: selectedTopStyle,
      bottom_style: selectedBottomStyle,
      dress_type: selectedDressType,
      sleeve_type: selectedSleeveType,
      neck_design: selectedNeckDesign,
      border_design: selectedBorderDesign,
      top_color: topColor,
      bottom_color: bottomColor,
      accent: activeProduct.accent
    };

    setCart([...cart, newItem]);
    setIsCartOpen(true);
  };

  const handlePaymentSuccess = async () => {
    if (!user) return;

    const orderPayload = {
      user_email: user.email,
      items: cart,
      total_amount: cart.length * 1500, // Dummy fixed price
      order_date: new Date().toISOString()
    };

    try {
      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        setCart([]); // Clear cart
        setIsPaymentOpen(false);
      } else {
        alert("Failed to save order");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error saving order");
    }
  };

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
          <AuthForm onAuthSuccess={handleAuthSuccess} />
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
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 600,
              }}
            >
              Pattupavadai
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'white', fontSize: '18px' }}>
              3D Dresser
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {activeProduct && (
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: `2px solid ${activeProduct.accent}`,
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: activeProduct.accent,
                    boxShadow: `0 0 10px ${activeProduct.accent}`,
                  }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '10px',
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    Selected
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: 'white', fontSize: '13px' }}>
                    {activeProduct.name}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<SwapHoriz />}
                  onClick={handleChangeProduct}
                  sx={{
                    ml: 1,
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Change
                </Button>
              </Paper>
            )}

            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ color: 'white', fontSize: '13px' }}>
                  {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    display: 'block',
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={handleSignOut}
                sx={{
                  ml: 1,
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Paper>
          </Box>
        </Toolbar>
      </AppBar>

      <div className="app-body">
        <Sidebar
          fabrics={fabrics}
          selectedFabric={selectedFabric}
          onFabricSelect={handleFabricSelect}
          topStyles={topStyles}
          selectedTopStyle={selectedTopStyle}
          onTopStyleSelect={handleTopStyleSelect}
          bottomStyles={bottomStyles}
          selectedBottomStyle={selectedBottomStyle}
          onBottomStyleSelect={handleBottomStyleSelect}
          selectedDressType={selectedDressType}
          onDressTypeSelect={setSelectedDressType}
          selectedFabricType={selectedFabricType}
          onFabricTypeSelect={setSelectedFabricType}
          selectedSleeveType={selectedSleeveType}
          onSleeveTypeSelect={setSelectedSleeveType}
          selectedNeckDesign={selectedNeckDesign}
          onNeckDesignSelect={setSelectedNeckDesign}
          selectedBorderDesign={selectedBorderDesign}
          onBorderDesignSelect={setSelectedBorderDesign}
          topColor={topColor}
          onTopColorChange={setTopColor}
          bottomColor={bottomColor}
          onBottomColorChange={setBottomColor}
          onAddToCart={addToCart}
          onBuyNow={handleBuyNow}
        />

        <div className="scene-panel">
          <Scene 
            fabricModels={fabricModels}
            topColor={topColor}
            bottomColor={bottomColor}
          />
          {cart.length > 0 && (
            <Paper
              elevation={4}
              sx={{
                position: 'absolute',
                bottom: 24,
                right: 24,
                p: 2,
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>Cart ({cart.length})</Typography>
                <Typography variant="caption">Total: ₹{cart.length * 1500}</Typography>
              </Box>
              <Button 
                variant="contained" 
                onClick={() => setIsCartOpen(true)}
                sx={{ background: '#2ecc71' }}
              >
                Checkout
              </Button>
            </Paper>
          )}
        </div>
      </div>

      <CartDrawer
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onRemoveItem={(index) => {
          const newCart = [...cart];
          newCart.splice(index, 1);
          setCart(newCart);
        }}
        onCheckout={() => {
          setIsCartOpen(false);
          setIsPaymentOpen(true);
        }}
      />

      <PaymentModal
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        totalAmount={cart.length * 1500}
        onSuccess={handlePaymentSuccess}
      />

    </div>
  );
}

export default App;