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
import Chatbot from "./components/Chatbot";
import LandingPage from "./components/LandingPage";
import Favorites from "./components/Favorites";
import AboutPattupavadai from "./components/AboutPattupavadai";
import { motion, AnimatePresence } from 'framer-motion';

// Import product images
const pattuImageUrl = '/images/pattupavadai.png';
const ethnicFrockImageUrl = '/images/ethnicfrock.jpg';
const kurthaImageUrl = '/images/kurtapyjama.jpg';
const kurtaPantImageUrl = '/images/kurtapant.jpg';

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
  ArrowBack,
  Person,
  ShoppingBag,
  Search,
  ShoppingBagOutlined,
  FavoriteBorder
} from '@mui/icons-material';
import { Modal, Stack, CircularProgress, Menu, MenuItem, InputAdornment, TextField, Badge } from '@mui/material';

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
  const [favorites, setFavorites] = useState([]);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [view, setView] = useState("shop"); // 'shop' | 'dashboard'
  const [show3DView, setShow3DView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // New state for Add-to-Cart Preview
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Generated product image state
  const [generatedProductImage, setGeneratedProductImage] = useState(null);
  const [isGeneratingProductImage, setIsGeneratingProductImage] = useState(false);
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState(false);
  const [showAddToFavSuccess, setShowAddToFavSuccess] = useState(false);
  const [pendingImageName, setPendingImageName] = useState(null);
  const [genError, setGenError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

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

  const addToFavorites = () => {
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

    setFavorites([...favorites, newItem]);
    setShowAddToFavSuccess(true);
    setTimeout(() => setShowAddToFavSuccess(false), 2000);
  };

  const handleMoveToBag = (item, index) => {
    setCart([...cart, item]);
    const newFavs = [...favorites];
    newFavs.splice(index, 1);
    setFavorites(newFavs);
    setIsCartOpen(true);
  };

  const handleRemoveFavorite = (index) => {
    const newFavs = [...favorites];
    newFavs.splice(index, 1);
    setFavorites(newFavs);
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
    {
      id: "pattu-paavadai",
      name: "Pattu Paavadai",
      blurb: "Handwoven silk skirt set crafted for festive shine.",
      accent: "#fbbf24",
      image: pattuImageUrl,
      tag: "Traditional",
      price: "₹499",
      originalPrice: "₹3,999",
      discount: "50% off",
      rating: 4.5,
      reviews: 234
    },
    {
      id: "ethnic-frock",
      name: "Ethnic Frock",
      blurb: "Lightweight frock with zari trims for celebrations.",
      accent: "#a855f7",
      image: ethnicFrockImageUrl,
      comingSoon: true,
      tag: "Festive",
      price: "₹0",
      originalPrice: "₹2,999",
      discount: "50% off",
      rating: 4.3,
      reviews: 156
    },
    {
      id: "kurta-pyjama",
      name: "Kurta Pyjama",
      blurb: "Classic kurta with comfy pyjama for all-day wear.",
      accent: "#38bdf8",
      image: kurthaImageUrl,
      comingSoon: true,
      tag: "Casual",
      price: "₹0",
      originalPrice: "₹3,499",
      discount: "49% off",
      rating: 4.6,
      reviews: 189
    },
    {
      id: "kurta-pant",
      name: "Kurta Pant",
      blurb: "Structured kurta paired with modern slim pants.",
      accent: "#22c55e",
      image: kurtaPantImageUrl,
      comingSoon: true,
      tag: "Modern",
      price: "₹0",
      originalPrice: "₹3,199",
      discount: "50% off",
      rating: 4.4,
      reviews: 142
    },
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
      <LandingPage onAuthSuccess={handleAuthSuccess} />
    );
  }

  // Admin flow
  if (user.email === "admin@gmail.com") {
    return <AdminPanel onSignOut={handleSignOut} />;
  }

  if (view === 'about') {
    return <AboutPattupavadai onBack={() => setView('shop')} />;
  }

  if (view === 'dashboard') {
    return <Dashboard user={user} onBack={() => setView('shop')} />;
  }

  if (view === 'favorites') {
    return (
      <Favorites
        favorites={favorites}
        onBack={() => setView('shop')}
        onRemove={handleRemoveFavorite}
        onMoveToBag={handleMoveToBag}
      />
    );
  }

  if (!selectedProduct) {
    return (
      <ProductSelect
        user={user}
        products={products}
        onSelect={handleProductSelect}
        onSignOut={handleSignOut}
        onKnowMore={() => setView('about')}
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
          bgcolor: 'rgba(255, 253, 245, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(76, 0, 19, 0.05)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: '80px !important', px: { xs: 2, md: 8 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={() => {
                if (view === 'dashboard') setView('shop');
                else setSelectedProduct(null);
              }}
              sx={{
                color: '#4C0013',
                bgcolor: 'rgba(76, 0, 19, 0.05)',
                '&:hover': { bgcolor: 'rgba(76, 0, 19, 0.1)' }
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box
              component="img"
              src="/images/logo.jpg"
              sx={{ height: 40, width: 40, borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }}
              onClick={() => setSelectedProduct(null)}
            />

            <Typography
              variant="h5"
              sx={{
                color: '#4C0013',
                fontWeight: 900,
                fontFamily: '"Playfair Display", serif',
                cursor: 'pointer',
              }}
              onClick={() => setSelectedProduct(null)}
            >
              Kuzhavi<span style={{ color: '#E3A018' }}>_Kids</span>
            </Typography>

            {activeProduct && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Divider
                  orientation="vertical"
                  flexItem
                  sx={{
                    borderColor: 'rgba(76, 0, 19, 0.1)',
                    height: '24px',
                    alignSelf: 'center',
                  }}
                />
                <Chip
                  label={activeProduct.name}
                  sx={{
                    bgcolor: 'rgba(76, 0, 19, 0.05)',
                    color: '#4C0013',
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
                    color: '#4C0013',
                    textTransform: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    minWidth: 'auto',
                    px: 1,
                    '&:hover': {
                      bgcolor: 'rgba(76, 0, 19, 0.05)',
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
              <IconButton
                onClick={() => setView('favorites')}
                sx={{
                  color: '#4C0013',
                  mr: 1,
                  '&:hover': {
                    bgcolor: 'rgba(76, 0, 19, 0.05)',
                  }
                }}
              >
                <FavoriteBorder />
              </IconButton>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AnimatePresence>
                {showSearch ? (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 280, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TextField
                      autoFocus
                      placeholder="Search ethnic wear..."
                      variant="standard"
                      onBlur={() => setShowSearch(false)}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: '#4C0013', opacity: 0.5 }} />
                          </InputAdornment>
                        ),
                        sx: {
                          bgcolor: 'rgba(76, 0, 19, 0.03)',
                          px: 2,
                          py: 1,
                          borderRadius: '50px',
                          fontSize: '13px',
                          width: '100%',
                          border: `1px solid rgba(76, 0, 19, 0.1)`,
                        }
                      }}
                    />
                  </motion.div>
                ) : (
                  <IconButton onClick={() => setShowSearch(true)}>
                    <Search sx={{ color: '#4C0013' }} />
                  </IconButton>
                )}
              </AnimatePresence>
            </Box>

            <IconButton onClick={() => setIsCartOpen(true)}>
              <Badge badgeContent={cart.length} color="error" sx={{ '& .MuiBadge-badge': { bgcolor: '#B38B00' } }}>
                <ShoppingBagOutlined sx={{ color: '#4C0013' }} />
              </Badge>
            </IconButton>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                borderColor: 'rgba(76, 0, 19, 0.1)',
                height: '32px',
                alignSelf: 'center',
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton
                onClick={handleProfileMenuOpen}
                sx={{ p: 0.5, border: '2px solid rgba(179, 139, 0, 0.2)' }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: 'rgba(179, 139, 0, 0.1)',
                    color: '#B38B00',
                    border: '1.5px solid #B38B00',
                  }}
                >
                  <Person sx={{ fontSize: 20 }} />
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    borderRadius: '16px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    minWidth: 180,
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography sx={{ fontWeight: 800, color: '#4C0013', fontSize: '14px' }}>{user.name}</Typography>
                  <Typography sx={{ color: '#999', fontSize: '12px' }}>{user.email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { handleProfileMenuClose(); setView('dashboard'); }}>
                  <ShoppingBag sx={{ fontSize: 20, mr: 2, color: '#B38B00' }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>My Orders</Typography>
                </MenuItem>
                <MenuItem onClick={handleSignOut} sx={{ color: '#d32f2f' }}>
                  <Logout sx={{ fontSize: 20, mr: 2 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Sign Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: '80px !important' }} />

      {view === 'dashboard' ? (
        <Dashboard user={user} onBack={() => setView('shop')} />
      ) : view === 'favorites' ? (
        <Favorites
          favorites={favorites}
          onBack={() => setView('shop')}
          onRemove={handleRemoveFavorite}
          onMoveToBag={handleMoveToBag}
        />
      ) : (
        <div className="app-body">
          {/* Left: Image/Scene Area */}
          <div className="image-preview-pane">
            {!show3DView && (activeProduct?.image || generatedProductImage || isGeneratingProductImage) ? (
              <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
                {isGeneratingProductImage ? (
                  <Box sx={{ textAlign: 'center' }}>
                    <CircularProgress size={40} sx={{ color: '#4C0013', mb: 2 }} />
                    <Typography sx={{ fontSize: '12px', fontWeight: 800, color: '#4C0013' }}>CRAFTING YOUR MASTERPIECE...</Typography>
                  </Box>
                ) : (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={generatedProductImage || activeProduct.image}
                    alt={activeProduct.name}
                    style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', borderRadius: '12px' }}
                  />
                )}
              </Box>
            ) : null}

            {show3DView && (
              <Scene
                fabricModels={fabricModels}
                topColor={topColor}
                bottomColor={bottomColor}
                selectedTopStyle={selectedTopStyle}
                selectedBottomStyle={selectedBottomStyle}
                onTopStyleSelect={handleTopStyleSelect}
                onBottomStyleSelect={handleBottomStyleSelect}
              />
            )}
          </div>

          {/* Middle: Product Details */}
          <div className="details-pane">
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111', mb: 1, fontFamily: '"Playfair Display", serif' }}>
              {activeProduct?.name}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Chip label="4.3 ★" size="small" sx={{ bgcolor: '#2ecc71', color: 'white', fontWeight: 700 }} />
              <Typography variant="body2" color="text.secondary">930 ratings & 54 reviews</Typography>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, color: '#4C0013', mb: 3 }}>
              ₹499 <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through', marginLeft: '10px' }}>₹2,999</span>
              <span style={{ fontSize: '16px', color: '#2ecc71', marginLeft: '10px' }}>83% off</span>
            </Typography>

            <Divider sx={{ mb: 4 }} />

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Playfair Display", serif' }}>Available Offers</Typography>
            <Stack spacing={2} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CheckCircle sx={{ color: '#2ecc71', fontSize: 18 }} />
                <Typography variant="body2"><strong>Bank Offer</strong> 10% off on SBI Credit Card, up to ₹1750 on orders of ₹5000 and above</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CheckCircle sx={{ color: '#2ecc71', fontSize: 18 }} />
                <Typography variant="body2"><strong>Bank Offer</strong> Extra 5% Cashback on Axis Bank Credit Card</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <CheckCircle sx={{ color: '#2ecc71', fontSize: 18 }} />
                <Typography variant="body2"><strong>Special Price</strong> Get extra ₹1500 off (price inclusive of cashback/coupon)</Typography>
              </Box>
            </Stack>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Playfair Display", serif' }}>Product Description</Typography>
            <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.8, mb: 4 }}>
              This exquisite {activeProduct?.name} is a testament to traditional craftsmanship, tailored with premium fabrics to ensure your little one looks regal and feels comfortable at every celebration.
            </Typography>
          </div>

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
            onAddToFavorites={addToFavorites}
          />
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

      <Snackbar
        open={showAddToFavSuccess}
        autoHideDuration={2000}
        onClose={() => setShowAddToFavSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ mt: 8 }}
      >
        <Alert
          onClose={() => setShowAddToFavSuccess(false)}
          severity="success"
          variant="filled"
          sx={{
            bgcolor: '#B38B00',
            color: 'white',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(179, 139, 0, 0.4)',
            '& .MuiAlert-icon': { color: 'white' },
          }}
        >
          Saved to Favourites!
        </Alert>
      </Snackbar>

      {/* Chatbot - Only for customer view */}
      <Chatbot />

    </div >
  );
}

export default App;