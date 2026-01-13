import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Scene from "./components/Scene";
import AuthForm from "./components/AuthForm";
import ProductSelect from "./components/ProductSelect";
import Preview from "./components/Preview";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import PaymentModal from "./components/PaymentModal";
import CartDrawer from "./components/CartDrawer";
import Dashboard from "./components/Dashboard";

// Import product images
import pattuImageUrl from './assets/category/i1.png';
import ethnicFrockImageUrl from './assets/category/i2.png';
import kurthaImageUrl from './assets/category/i3.png';

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
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Logout,
  SwapHoriz,
  Close,
  CheckCircle,
} from '@mui/icons-material';
import { Modal, Stack, CircularProgress } from '@mui/material';

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
  const [view, setView] = useState("shop"); // 'shop' | 'dashboard'
  const [show3DView, setShow3DView] = useState(false);
  
  // New state for Add-to-Cart Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // Generated product image state
  const [generatedProductImage, setGeneratedProductImage] = useState(null);
  const [isGeneratingProductImage, setIsGeneratingProductImage] = useState(false);
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState(false);
  const [pendingImageName, setPendingImageName] = useState(null);
  const [genError, setGenError] = useState(null);

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

  const handleApplyFilters = async () => {
    if (!activeProduct) return;

    const error = validateSelection();
    if (error) {
      alert(error);
      return;
    }

    setIsGeneratingProductImage(true);
    setGeneratedProductImage(null);

    const payload = {
      product_name: activeProduct.name,
      fabric_type: selectedFabricType,
      top_style: selectedTopStyle,
      bottom_style: selectedBottomStyle,
      dress_type: selectedDressType,
      sleeve_type: selectedSleeveType,
      neck_design: selectedNeckDesign,
      border_design: selectedBorderDesign,
      top_color: topColor,
      bottom_color: bottomColor,
      accent: activeProduct.accent,
      user_email: user.email
    };

    try {
      const response = await fetch("http://localhost:8000/preview-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Failed to generate");
      
      setGeneratedProductImage(`data:image/png;base64,${data.image_base64}`);
    } catch (err) {
      console.error(err);
      alert(`Failed to generate image: ${err.message}`);
    } finally {
      setIsGeneratingProductImage(false);
    }
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
      fabric_type: selectedFabricType,
      top_style: selectedTopStyle,
      bottom_style: selectedBottomStyle,
      dress_type: selectedDressType,
      sleeve_type: selectedSleeveType,
      neck_design: selectedNeckDesign,
      border_design: selectedBorderDesign,
      top_color: topColor,
      bottom_color: bottomColor,
      accent: activeProduct.accent,
      preview_url: generatedProductImage || activeProduct.image
    };

    setCart([...cart, newItem]);
    
    // Show success animation
    setShowAddToCartSuccess(true);
    setTimeout(() => setShowAddToCartSuccess(false), 2000);
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

    const sanitizedItems = cart.map(({ preview_url, ...rest }) => rest);

    const orderPayload = {
      user_email: user.email,
      items: sanitizedItems,
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
        setView("dashboard");
      } else {
        alert("Failed to save order");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error saving order");
    }
  };

  const products = [
    { id: "pattu-paavadai", name: "Pattu Paavadai", blurb: "Handwoven silk skirt set crafted for festive shine.", accent: "#fbbf24", image: pattuImageUrl },
    { id: "ethnic-frock", name: "Ethnic Frock", blurb: "Lightweight frock with zari trims for celebrations.", accent: "#a855f7", image: ethnicFrockImageUrl },
    { id: "kurta-pyjama", name: "Kurta Pyjama", blurb: "Classic kurta with comfy pyjama for all-day wear.", accent: "#38bdf8", image: kurthaImageUrl },
    { id: "kurta-pant", name: "Kurta Pant", blurb: "Structured kurta paired with modern slim pants.", accent: "#22c55e", image: pattuImageUrl },
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

  // Admin flow
  if (user.email === "admin@gmail.com") {
    return <AdminPanel onSignOut={handleSignOut} />;
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
        elevation={0}
        sx={{
          bgcolor: '#2874F0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '56px !important', px: 3 }}>
          {/* Left Section - Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: 700,
                fontStyle: 'italic',
                letterSpacing: '-0.5px',
                cursor: 'pointer',
                '&:hover': {
                  opacity: 0.9,
                }
              }}
            >
              Kuzhavi_kids
            </Typography>

            {activeProduct && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Divider 
                  orientation="vertical" 
                  flexItem 
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.2)',
                    height: '24px',
                    alignSelf: 'center',
                  }} 
                />
                <Chip
                  label={activeProduct.name}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.15)',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 600,
                    height: '28px',
                    '& .MuiChip-label': {
                      px: 1.5,
                    }
                  }}
                />
                <Button
                  size="small"
                  startIcon={<SwapHoriz sx={{ fontSize: 16 }} />}
                  onClick={handleChangeProduct}
                  sx={{
                    color: '#FFFFFF',
                    textTransform: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    minWidth: 'auto',
                    px: 1,
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Change
                </Button>
              </Box>
            )}
          </Box>

          {/* Right Section - Actions and User */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {activeProduct && (
              <Button 
                onClick={() => setView(view === 'shop' ? 'dashboard' : 'shop')}
                sx={{ 
                  color: '#FFFFFF',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '14px',
                  px: 2,
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.1)',
                  }
                }}
              >
                {view === 'shop' ? 'My Orders' : 'Back to Shop'}
              </Button>
            )}

            <Divider 
              orientation="vertical" 
              flexItem 
              sx={{ 
                borderColor: 'rgba(255,255,255,0.2)',
                height: '32px',
                alignSelf: 'center',
              }} 
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#FFFFFF',
                  color: '#2874F0',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography 
                  sx={{ 
                    color: '#FFFFFF', 
                    fontSize: '13px',
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {user.name}
                </Typography>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '11px',
                    lineHeight: 1.2,
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={handleSignOut}
                sx={{
                  color: '#FFFFFF',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Logout sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {view === 'dashboard' ? (
        <Dashboard user={user} onBack={() => setView('shop')} />
      ) : (
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
          show3DView={show3DView}
          onToggle3DView={() => setShow3DView(!show3DView)}
          onApplyFilters={handleApplyFilters}
          isGeneratingProductImage={isGeneratingProductImage}
          cartCount={cart.length}
        />

        <div className="scene-panel">
          {/* Left side - Product Image or 3D Model */}
          {!show3DView && (activeProduct?.image || generatedProductImage || isGeneratingProductImage) ? (
            <Box
              sx={{
                position: 'fixed',
                top: 115,
                left: 0,
                width: '400px',
                bottom: 80,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#FFFFFF',
                borderRight: '1px solid #E0E0E0',
                p: 2,
                overflowY: 'auto',
              }}
            >
              {isGeneratingProductImage ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#F2F2F2',
                    borderRadius: '8px',
                    border: '1px solid #E0E0E0',
                  }}
                >
                  <CircularProgress size={60} sx={{ color: '#2874F0', mb: 2 }} />
                  <Typography sx={{ fontSize: '14px', color: '#666666' }}>
                    Generating your custom design...
                  </Typography>
                </Box>
              ) : (
                <img
                  src={generatedProductImage || activeProduct.image}
                  alt={activeProduct.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '8px',
                    border: '1px solid #E0E0E0',
                    objectFit: 'cover',
                  }}
                />
              )}
            </Box>
          ) : null}

          {show3DView ? (
            <Scene 
              fabricModels={fabricModels}
              topColor={topColor}
              bottomColor={bottomColor}
              selectedTopStyle={selectedTopStyle}
              selectedBottomStyle={selectedBottomStyle}
              onTopStyleSelect={handleTopStyleSelect}
              onBottomStyleSelect={handleBottomStyleSelect}
            />
          ) : null}
          
          {/* Right side content area for product details */}
          <Box
            sx={{
              position: 'fixed',
              top: 115,
              left: show3DView || activeProduct?.image || generatedProductImage || isGeneratingProductImage ? '400px' : 0,
              right: 0,
              bottom: 80,
              bgcolor: '#FFFFFF',
              overflowY: 'auto',
            }}
          >
            {/* Product Details Section */}
            <Box sx={{ p: 3 }}>
              <Typography
                sx={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: '#111111',
                  mb: 1,
                  fontFamily: 'Arial, sans-serif',
                }}
              >
                {activeProduct?.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Chip
                  label="4.3★"
                  size="small"
                  sx={{
                    bgcolor: '#2ecc71',
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontSize: '12px',
                  }}
                />
                <Typography sx={{ fontSize: '14px', color: '#666666' }}>
                  930 ratings and 54 reviews
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontSize: '14px',
                  color: '#2ecc71',
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                Special price
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5, mb: 2 }}>
                <Typography
                  sx={{
                    fontSize: '28px',
                    fontWeight: 700,
                    color: '#111111',
                  }}
                >
                  ₹499
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    color: '#666666',
                    textDecoration: 'line-through',
                  }}
                >
                  ₹2,999
                </Typography>
                <Typography
                  sx={{
                    fontSize: '16px',
                    color: '#2ecc71',
                    fontWeight: 600,
                  }}
                >
                  83% off
                </Typography>
              </Box>

              {/* Available Offers */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  sx={{
                    fontSize: '16px',
                    fontWeight: 600,
                    color: '#111111',
                    mb: 2,
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  Available offers
                </Typography>
                
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        bgcolor: '#2ecc71',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      <Typography sx={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 700 }}>₹</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                      <strong>Bank Offer</strong> Flat ₹50 off on EMI Card. Min Booking Amount: ₹2,500{' '}
                      <Typography component="span" sx={{ color: '#2874F0', cursor: 'pointer', fontSize: '14px' }}>
                        T&C
                      </Typography>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        bgcolor: '#2ecc71',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      <Typography sx={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 700 }}>₹</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                      <strong>Bank Offer</strong> 10% off up to ₹1,500 on BOBCARD EMI Transactions, Min Txn Value: ₹5,000{' '}
                      <Typography component="span" sx={{ color: '#2874F0', cursor: 'pointer', fontSize: '14px' }}>
                        T&C
                      </Typography>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        bgcolor: '#2ecc71',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      <Typography sx={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 700 }}>₹</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                      <strong>Bank Offer</strong> 5% cashback on Debit Card up to ₹750{' '}
                      <Typography component="span" sx={{ color: '#2874F0', cursor: 'pointer', fontSize: '14px' }}>
                        T&C
                      </Typography>
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        bgcolor: '#2ecc71',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        mt: 0.2,
                      }}
                    >
                      <Typography sx={{ fontSize: '12px', color: '#FFFFFF', fontWeight: 700 }}>%</Typography>
                    </Box>
                    <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                      <strong>Special Price</strong> Get extra 53% off{' '}
                      <Typography component="span" sx={{ color: '#2874F0', cursor: 'pointer', fontSize: '14px' }}>
                        T&C
                      </Typography>
                    </Typography>
                  </Box>

                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#2874F0',
                      fontWeight: 600,
                      cursor: 'pointer',
                      ml: 3.5,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    +8 more offers
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Delivery & Services */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Box
                        sx={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          bgcolor: '#2874F0',
                        }}
                      />
                      <Typography sx={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>
                        Deliver to
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                      <input
                        type="text"
                        placeholder="Enter delivery pincode"
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          background:'white',
                          fontSize: '14px',
                          border: '1px solid #CCCCCC',
                          borderRadius: '4px',
                          fontFamily: 'Arial, sans-serif',
                        }}
                      />
                      <Button
                        variant="outlined"
                        sx={{
                          textTransform: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#2874F0',
                          borderColor: '#CCCCCC',
                          px: 3,
                          '&:hover': {
                            borderColor: '#2874F0',
                            bgcolor: 'rgba(40, 116, 240, 0.04)',
                          },
                        }}
                      >
                        Check
                      </Button>
                    </Box>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500, mb: 0.5 }}>
                      Delivery by 16 Jan, Friday
                    </Typography>
                    <Typography sx={{ fontSize: '12px', color: '#666666', mb: 1 }}>
                      if ordered before 6:59 AM
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: '#2874F0',
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' },
                      }}
                    >
                      View Details
                    </Typography>
                  </Box>

                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                      <Typography sx={{ fontSize: '14px', color: '#666666', fontWeight: 500 }}>
                        Services
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        sx={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '50%',
                          bgcolor: '#2874F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography sx={{ fontSize: '10px', color: '#FFFFFF', fontWeight: 700 }}>₹</Typography>
                      </Box>
                      <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                        Cash on Delivery available
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Seller Info */}
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  <Typography sx={{ fontSize: '14px', color: '#666666' }}>Seller</Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      color: '#2874F0',
                      fontWeight: 600,
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    SOMVATISAREE
                  </Typography>
                  <Chip
                    label="4.3★"
                    size="small"
                    sx={{
                      bgcolor: '#2874F0',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      fontSize: '11px',
                      height: '20px',
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Box
                    sx={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      bgcolor: '#CCCCCC',
                    }}
                  />
                  <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                    10 days return policy
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: '#2874F0',
                    fontWeight: 600,
                    cursor: 'pointer',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  See other sellers
                </Typography>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Product Details */}
              <Box>
                <Typography
                  sx={{
                    fontSize: '18px',
                    fontWeight: 600,
                    color: '#111111',
                    mb: 2,
                    fontFamily: 'Arial, sans-serif',
                  }}
                >
                  Product Details
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Brand
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      tapovan fashion
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Fabric Type
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      {selectedFabricType}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Dress Type
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      {selectedDressType}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Sleeve Type
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      {selectedSleeveType}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Neck Design
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      {selectedNeckDesign}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Border Design
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      {selectedBorderDesign}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Pattern
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      Solid/Plain
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Occasion
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      Party, Festive
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Type of Embroidery
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      Sequin Work
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Typography sx={{ fontSize: '14px', color: '#666666', minWidth: '150px' }}>
                      Decorative Material
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 500 }}>
                      Sequins, Cotton Thread
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Ratings & Reviews Section */}
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: 600,
                        color: '#111111',
                        fontFamily: 'Arial, sans-serif',
                      }}
                    >
                      Ratings & Reviews
                    </Typography>
                    <Chip
                      label="4.1★"
                      size="small"
                      sx={{
                        bgcolor: '#2ecc71',
                        color: '#FFFFFF',
                        fontWeight: 600,
                      }}
                    />
                    <Typography sx={{ fontSize: '14px', color: '#666666' }}>
                      930 ratings and 54 reviews
                    </Typography>
                  </Box>
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    bgcolor: '#F2F2F2',
                    borderRadius: 2,
                    mb: 2,
                  }}
                >
                  <Typography sx={{ fontSize: '13px', color: '#666666', mb: 1 }}>
                    What our customers felt:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip label="Light weight" size="small" sx={{ bgcolor: '#FFFFFF' }} />
                    <Chip label="Quality of material" size="small" sx={{ bgcolor: '#FFFFFF' }} />
                    <Chip label="Value for Money" size="small" sx={{ bgcolor: '#FFFFFF' }} />
                    <Chip label="Comfort" size="small" sx={{ bgcolor: '#FFFFFF' }} />
                    <Chip label="Opacity" size="small" sx={{ bgcolor: '#FFFFFF' }} />
                  </Box>
                </Paper>
              </Box>
            </Box>
          </Box>
        </div>
      </div>
      )}

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

      <Snackbar
        open={showAddToCartSuccess}
        autoHideDuration={2000}
        onClose={() => setShowAddToCartSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={() => setShowAddToCartSuccess(false)}
          severity="success"
          variant="filled"
          sx={{
            bgcolor: '#2ecc71',
            color: '#FFFFFF',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(46, 204, 113, 0.4)',
            '& .MuiAlert-icon': {
              color: '#FFFFFF',
            },
          }}
        >
          Added to cart successfully! 🎉
        </Alert>
      </Snackbar>

    </div>
  );
}

export default App;