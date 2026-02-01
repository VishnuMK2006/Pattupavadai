import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Scene from "./components/Scene";
import AuthForm from "./components/AuthForm";
import LandingPage from "./components/LandingPage";
import Sidebar from "./components/Sidebar";
import AdminPanel from "./components/AdminPanel";
import PaymentModal from "./components/PaymentModal";
import CartDrawer from "./components/CartDrawer";
import Dashboard from "./components/Dashboard";
import Chatbot from "./components/Chatbot";
import AboutPattupavadai from "./components/AboutPattupavadai";
import Favorites from "./components/Favorites";
import CartPage from "./components/CartPage";
import OrderSummary from "./components/OrderSummary";
import CompleteProfileModal from "./components/CompleteProfileModal";
import UserProfileModal from "./components/UserProfileModal";
import ProductDetail from "./components/ProductDetail";
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Button,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Divider,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  InputAdornment,
  TextField,
  Badge,
  Stack,
  CircularProgress
} from '@mui/material';
import {
  Logout,
  SwapHoriz,
  ArrowBack,
  Person,
  ShoppingBag,
  Search,
  ShoppingBagOutlined,
  FavoriteBorder,
  CheckCircle
} from '@mui/icons-material';

// Import product images
const pattuImageUrl = '/images/pattupavadai.png';
const ethnicFrockImageUrl = '/images/ethnicfrock.jpg';
const kurthaImageUrl = '/images/kurtapyjama.jpg';
const kurtaPantImageUrl = '/images/kurtapant.jpg';

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
  const [view, setView] = useState("about");
  const [previousView, setPreviousView] = useState("about");

  const [show3DView, setShow3DView] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [buyingItem, setBuyingItem] = useState(null);
  const [isCompleteProfileOpen, setIsCompleteProfileOpen] = useState(false);
  const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

  // Generated product image state
  const [generatedProductImage, setGeneratedProductImage] = useState(null);
  const [isGeneratingProductImage, setIsGeneratingProductImage] = useState(false);
  const [showAddToCartSuccess, setShowAddToCartSuccess] = useState(false);
  const [cartSuccessMsg, setCartSuccessMsg] = useState("Added to cart successfully! 🎉");
  const [showAddToFavSuccess, setShowAddToFavSuccess] = useState(false);
  const [favSuccessMsg, setFavSuccessMsg] = useState('Added to Wishlist');
  const [anchorEl, setAnchorEl] = useState(null);
  const [liveProducts, setLiveProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setLiveProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchUserCart = async (email) => {
    try {
      const response = await fetch(`${API_BASE}/cart/${email}`);
      const data = await response.json();
      if (response.ok) setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const fetchUserFavorites = async (email) => {
    try {
      const response = await fetch(`${API_BASE}/favorites/${email}`);
      const data = await response.json();
      if (response.ok) setFavorites(data);
    } catch (err) {
      console.error("Error fetching favorites:", err);
    }
  };

  useEffect(() => {
    if (user && user.email !== "admin@gmail.com") {
      fetchUserCart(user.email);
      fetchUserFavorites(user.email);
    }
  }, [user]);

  const calculatePrice = (item) => {
    if (!item.price) return 1500;
    const priceStr = String(item.price).replace(/[^0-9.]/g, '');
    return Number(priceStr) || 1500;
  };

  const navigateToCart = () => {
    setPreviousView(view);
    setView('cart');
  };

  const navigateToFavorites = () => {
    setPreviousView(view);
    setView('favorites');
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem("pp_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email && parsed?.token) {
          setUser(parsed);
          // Check if admin and set appropriate view
          if (parsed.email === "admin@gmail.com") {
            setView('admin');
          } else {
            setView('about');
            // Check if profile needs completion
            if (parsed.shipping_address?.includes("Not provided") || parsed.contact_details?.includes("Not provided")) {
              setIsCompleteProfileOpen(true);
            }
          }
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

  const addToCart = async (productWithDesign = null) => {
    const productToUse = productWithDesign || activeProduct;
    if (!productToUse) return;

    // Only check design selection if it's the custom designable product
    if (!productWithDesign) {
      const error = validateSelection();
      if (error) {
        alert(error);
        return;
      }
    }

    const newItem = {
      user_email: user.email,
      product_id: productToUse.id || productToUse._id,
      product_name: productToUse.name,
      fabric_type: selectedFabricType || productToUse.fabric_type,
      top_style: selectedTopStyle || productToUse.top_style,
      bottom_style: selectedBottomStyle || productToUse.bottom_style,
      dress_type: selectedDressType || productToUse.dress_type,
      sleeve_type: selectedSleeveType || productToUse.sleeve_type,
      neck_design: selectedNeckDesign || productToUse.neck_design,
      border_design: selectedBorderDesign || productToUse.border_design,
      top_color: topColor || productToUse.top_color,
      bottom_color: bottomColor || productToUse.bottom_color,
      accent: productToUse.accent,
      preview_url: generatedProductImage || productToUse.image
    };

    const isAlreadyInCart = cart.some(cartItem => (cartItem.id || cartItem.product_id) === newItem.product_id);

    if (isAlreadyInCart) {
      return;
    }

    try {
      const resp = await fetch(`${API_BASE}/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (resp.ok) {
        setCart([...cart, newItem]);
      }
    } catch (err) {
      console.error("Cart sync error:", err);
    }
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

    // Instant Checkout logic
    setBuyingItem(newItem);
    setView('order-summary');
  };

  const addToFavorites = async (productWithDesign = null) => {
    const productToUse = productWithDesign || activeProduct;
    if (!productToUse) return;

    const newItem = {
      user_email: user.email,
      product_id: productToUse.id || productToUse._id,
      product_name: productToUse.name,
      fabric_type: selectedFabricType || productToUse.fabric_type,
      top_style: selectedTopStyle,
      bottom_style: selectedBottomStyle,
      dress_type: selectedDressType,
      sleeve_type: selectedSleeveType,
      neck_design: selectedNeckDesign,
      border_design: selectedBorderDesign,
      top_color: topColor,
      bottom_color: bottomColor,
      accent: productToUse.accent,
      preview_url: generatedProductImage || productToUse.image
    };

    try {
      const resp = await fetch(`${API_BASE}/favorites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      if (resp.ok) {
        setFavorites([...favorites, newItem]);
        setFavSuccessMsg('Added to Wishlist');
        setShowAddToFavSuccess(true);
        setTimeout(() => setShowAddToFavSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Fav sync error:", err);
    }
  };

  const handleMoveToBag = async (item, index) => {
    const productId = item.id || item.product_id;
    const isAlreadyInCart = cart.some(cartItem => (cartItem.id || cartItem.product_id) === productId);

    if (isAlreadyInCart) {
      alert("This item is already in your bag.");
      return;
    }

    await addToCart(item);
    await handleRemoveFavorite(productId);
    setIsCartOpen(true);
  };

  const handleAddToCartFromFav = async (item) => {
    await addToCart(item);
    return true;
  };

  const handleBuyNowFromFav = (item) => {
    setBuyingItem(item);
    setView('order-summary');
  };

  const handleRemoveFavorite = async (indexOrId) => {
    let productId;
    if (typeof indexOrId === 'number') {
      const item = favorites[indexOrId];
      productId = item.product_id || item.id;
    } else {
      productId = indexOrId;
    }

    try {
      const resp = await fetch(`${API_BASE}/favorites/${user.email}/${productId}`, {
        method: 'DELETE'
      });
      if (resp.ok) {
        setFavorites(prev => prev.filter(item => (item.id || item.product_id) !== productId));
        setFavSuccessMsg('Removed from the Wishlist');
        setShowAddToFavSuccess(true);
        setTimeout(() => setShowAddToFavSuccess(false), 2000);
      }
    } catch (err) {
      console.error("Remove fav sync error:", err);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const resp = await fetch(`${API_BASE}/cart/${user.email}/${productId}`, {
        method: 'DELETE'
      });
      if (resp.ok) {
        setCart(prev => prev.filter(item => (item.id || item.product_id) !== productId));
      }
    } catch (err) {
      console.error("Remove cart sync error:", err);
    }
  };

  const handlePaymentSuccess = async () => {
    if (!user) return;
    const itemsToBuy = buyingItem ? [buyingItem] : cart;

    // Calculate total including the ₹7 fee shown in OrderSummary
    const itemTotal = itemsToBuy.reduce((sum, item) => sum + calculatePrice(item), 0);
    const totalAmount = itemTotal + 7;

    // Ensure all items have product_id and product_name (backend requirements)
    const sanitizedItems = itemsToBuy.map(({ id, name, product_id, product_name, _id, ...rest }) => ({
      product_id: String(product_id || id || _id),
      product_name: String(product_name || name || "Pattupavadai Product"),
      image: rest.image || rest.preview_url,
      ...rest
    }));

    const orderPayload = {
      user_email: user.email.trim(),
      items: sanitizedItems,
      total_amount: totalAmount,
      order_date: new Date().toISOString()
    };

    console.log("Submitting order:", orderPayload);

    try {
      const response = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        if (buyingItem) {
          const itemId = buyingItem.id || buyingItem.product_id;
          handleRemoveFromCart(itemId);
        } else {
          // Clear cart in DB
          await fetch(`${API_BASE}/cart/clear/${user.email}`, { method: 'POST' });
          setCart([]);
        }
        setBuyingItem(null);
        setView("dashboard");
      } else {
        alert("Failed to create order");
      }
    } catch (err) {
      console.error(err);
      alert("Error processing order");
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

  const activeProduct = useMemo(() => {
    // Check hardcoded products first (designable ones)
    const hardcoded = products.find((p) => p.id === selectedProduct);
    if (hardcoded) return hardcoded;

    // Then check dynamic ones
    const dynamic = liveProducts.find((p) => p._id === selectedProduct);
    if (dynamic) {
      return {
        ...dynamic,
        id: dynamic._id,
        name: dynamic.name,
        blurb: dynamic.blurb,
        image: dynamic.card_image,
        price: dynamic.price?.toString().startsWith('₹') ? dynamic.price : `₹${dynamic.price}`,
        originalPrice: dynamic.original_price?.toString().startsWith('₹') ? dynamic.original_price : `₹${dynamic.original_price}`,
        accent: dynamic.accent_color,
        isDynamic: true
      };
    }
    return null;
  }, [selectedProduct, liveProducts]);

  const activeFabric = useMemo(
    () => fabrics.find((f) => f.id === selectedFabric) || null,
    [selectedFabric]
  );

  const handleProductSelect = (product) => {
    setSelectedProduct(product.id);
    setSelectedFabric(null);
    setIsPaymentOpen(false); // Reset payment modal
    setView('product-detail'); // Navigate to detail page first
  };

  const handleChangeProduct = () => {
    setSelectedProduct(null);
    setSelectedFabric(null);
    setSelectedTopStyle("t1");
    setSelectedBottomStyle("p1");
    setView('about');
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

    // Check if admin and route to admin panel
    if (userData.email === "admin@gmail.com") {
      setView('admin');
    } else {
      setView('about');
      // Check if profile needs completion (social login users)
      if (userData.shipping_address?.includes("Not provided") || userData.contact_details?.includes("Not provided")) {
        setIsCompleteProfileOpen(true);
      }
    }
  };

  const handleProfileComplete = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("pp_user", JSON.stringify(updatedUser));
    setIsCompleteProfileOpen(false);
  };

  const handleToggleFavorite = async (product) => {
    const isFav = favorites.find((p) => (p.id || p.product_id) === (product.id || product._id));
    const productId = product.id || product._id;

    if (isFav) {
      await handleRemoveFavorite(productId);
    } else {
      await addToFavorites(product);
    }
  };

  // --- VIEW RESOLUTION ---
  let mainContent = null;

  if (!user || view === 'landing') {
    mainContent = (
      <LandingPage
        user={user}
        onAuthSuccess={handleAuthSuccess}
        onGoToApp={() => setView('about')}
        products={liveProducts}
      />
    );
  } else if (user?.email === "admin@gmail.com" && view === 'admin') {
    return <AdminPanel onSignOut={handleSignOut} />; // No Chatbot here
  } else if (view === 'dashboard') {
    mainContent = <Dashboard user={user} onBack={() => setView('about')} />;
  } else if (view === 'favorites') {
    mainContent = (
      <Favorites
        favorites={favorites}
        onBack={() => setView(previousView)}
        onRemove={handleRemoveFavorite}
        onMoveToBag={handleMoveToBag}
        onAddToCart={handleAddToCartFromFav}
        onBuyNow={handleBuyNowFromFav}
        cart={cart}
      />
    );
  } else if (view === 'order-summary') {
    mainContent = (
      <>
        <OrderSummary
          user={user}
          item={buyingItem}
          cartItems={cart}
          onBack={() => setView(previousView || 'about')}
          onContinue={() => setIsPaymentOpen(true)}
          onUpdateUser={(updatedUser) => {
            setUser(updatedUser);
            localStorage.setItem("pp_user", JSON.stringify(updatedUser));
          }}
        />
        <PaymentModal
          open={isPaymentOpen}
          onClose={() => { setIsPaymentOpen(false); setBuyingItem(null); }}
          totalAmount={buyingItem ? calculatePrice(buyingItem) : cart.reduce((sum, item) => sum + calculatePrice(item), 0)}
          onSuccess={handlePaymentSuccess}
        />
      </>
    );
  } else if (view === 'cart') {
    mainContent = (
      <CartPage
        cartItems={cart}
        onBack={() => setView(previousView)}
        onRemove={(index) => {
          const item = cart[index];
          handleRemoveFromCart(item.product_id || item._id || item.id);
        }}
        onCheckout={() => {
          setBuyingItem(null);
          setView('order-summary');
        }}
        onBuyNow={(item) => {
          setBuyingItem(item);
          setView('order-summary');
        }}
      />
    );
  } else if (view === 'product-detail' && activeProduct) {
    mainContent = (
      <ProductDetail
        product={activeProduct}
        onBack={() => setView('about')}
        onAddToCart={handleAddToCartFromFav}
        onBuyNow={(item) => {
          setBuyingItem(item);
          setPreviousView('product-detail');
          setView('order-summary');
        }}
        onCustomize={() => setView('shop')}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onShowFavorites={() => { setPreviousView('product-detail'); setView('favorites'); }}
        onShowCart={() => { setPreviousView('product-detail'); setView('cart'); }}
        cart={cart}
        user={user}
        onSignOut={handleSignOut}
        onShowOrders={() => { setPreviousView('product-detail'); setView('dashboard'); }}
        onShowDetails={() => setIsUserDetailsOpen(true)}
      />
    );
  } else if (view === 'about' || !selectedProduct) {
    mainContent = (
      <AboutPattupavadai
        user={user}
        onBack={() => setView('landing')}
        onSelect={(product) => handleProductSelect(product)}
        onSignOut={handleSignOut}
        onShowFavorites={navigateToFavorites}
        onShowCart={navigateToCart}
        onShowOrders={() => setView('dashboard')}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCartFromFav}
        cart={cart}
        productsList={liveProducts}
        onUpdateUser={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem("pp_user", JSON.stringify(updatedUser));
        }}
      />
    );
  }

  if (mainContent) {
    return (
      <div className="app-container">
        {mainContent}
        <Chatbot />
        <CompleteProfileModal
          open={isCompleteProfileOpen}
          user={user}
          onComplete={handleProfileComplete}
          onSkip={() => setIsCompleteProfileOpen(false)}
        />

        {/* Global Snackbars placed here to be visible in all mainContent views */}
        <Snackbar
          open={showAddToCartSuccess}
          autoHideDuration={2000}
          onClose={() => setShowAddToCartSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ zIndex: 9999 }}
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
            }}
          >
            {cartSuccessMsg}
          </Alert>
        </Snackbar>

        <Snackbar
          open={showAddToFavSuccess}
          autoHideDuration={2000}
          onClose={() => setShowAddToFavSuccess(false)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ zIndex: 9999 }}
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
            {favSuccessMsg}
          </Alert>
        </Snackbar>
      </div>
    );
  }

  // --- SHOP / DESIGNER VIEW ---
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
                if (view === 'dashboard') setView('about');
                else {
                  setSelectedProduct(null);
                  setView('about');
                }
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
              onClick={() => { setSelectedProduct(null); setView('about'); }}
            />
            <Typography
              variant="h5"
              sx={{
                color: '#4C0013',
                fontWeight: 900,
                fontFamily: '"Playfair Display", serif',
                cursor: 'pointer',
              }}
              onClick={() => { setSelectedProduct(null); setView('about'); }}
            >
              Kuzhavi<span style={{ color: '#E3A018' }}>_Kids</span>
            </Typography>

            {activeProduct && (
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(76, 0, 19, 0.1)', height: '24px', alignSelf: 'center' }} />
                <Chip
                  label={activeProduct.name}
                  sx={{ bgcolor: 'rgba(76, 0, 19, 0.05)', color: '#4C0013', fontSize: '13px', fontWeight: 600, height: '28px' }}
                />
                <Button
                  size="small"
                  startIcon={<SwapHoriz sx={{ fontSize: 16 }} />}
                  onClick={handleChangeProduct}
                  sx={{ color: '#4C0013', textTransform: 'none', fontSize: '12px', fontWeight: 700, minWidth: 'auto', px: 1, '&:hover': { bgcolor: 'rgba(76, 0, 19, 0.05)' } }}
                >
                  Change
                </Button>
              </Box>
            )}
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {activeProduct && (
              <IconButton onClick={() => setView('favorites')} sx={{ color: '#4C0013', mr: 1, '&:hover': { bgcolor: 'rgba(76, 0, 19, 0.05)' } }}>
                <FavoriteBorder />
              </IconButton>
            )}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AnimatePresence>
                {showSearch ? (
                  <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 280, opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <TextField
                      autoFocus
                      placeholder="Search ethnic wear..."
                      variant="standard"
                      onBlur={() => setShowSearch(false)}
                      InputProps={{
                        disableUnderline: true,
                        startAdornment: <InputAdornment position="start"><Search sx={{ color: '#4C0013', opacity: 0.5 }} /></InputAdornment>,
                        sx: { bgcolor: 'rgba(76, 0, 19, 0.03)', px: 2, py: 1, borderRadius: '50px', fontSize: '13px', width: '100%', border: `1px solid rgba(76, 0, 19, 0.1)` }
                      }}
                    />
                  </motion.div>
                ) : (
                  <IconButton onClick={() => setShowSearch(true)}><Search sx={{ color: '#4C0013' }} /></IconButton>
                )}
              </AnimatePresence>
            </Box>

            <IconButton onClick={navigateToCart}>
              <Badge badgeContent={cart.length} color="error" sx={{ '& .MuiBadge-badge': { bgcolor: '#B38B00' } }}>
                <ShoppingBagOutlined sx={{ color: '#4C0013' }} />
              </Badge>
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(76, 0, 19, 0.1)', height: '32px', alignSelf: 'center' }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5, border: '2px solid rgba(179, 139, 0, 0.2)' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(179, 139, 0, 0.1)', color: '#B38B00', border: '1.5px solid #B38B00' }}><Person sx={{ fontSize: 20 }} /></Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                PaperProps={{ sx: { mt: 1.5, borderRadius: '16px', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', border: '1px solid rgba(0,0,0,0.05)', minWidth: 180 } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography sx={{ fontWeight: 800, color: '#4C0013', fontSize: '14px' }}>{user.name || user.email.split('@')[0]}</Typography>
                  <Typography sx={{ color: '#999', fontSize: '12px' }}>{user.email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { handleProfileMenuClose(); setView('dashboard'); }}>
                  <ShoppingBag sx={{ fontSize: 20, mr: 2, color: '#B38B00' }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>My Orders</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleProfileMenuClose(); setIsUserDetailsOpen(true); }}>
                  <Person sx={{ fontSize: 20, mr: 2, color: '#B38B00' }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>My Details</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleProfileMenuClose(); handleSignOut(); }} sx={{ color: '#d32f2f' }}>
                  <Logout sx={{ fontSize: 20, mr: 2 }} />
                  <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Sign Out</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar sx={{ minHeight: '80px !important' }} />

      <div className="app-body">
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

        <div className="details-pane">
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#111', mb: 1, fontFamily: '"Playfair Display", serif' }}>
            {activeProduct?.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Chip label="4.3 ★" size="small" sx={{ bgcolor: '#2ecc71', color: 'white', fontWeight: 700 }} />
            <Typography variant="body2" color="text.secondary">930 ratings & 54 reviews</Typography>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 800, color: '#4C0013', mb: 3 }}>
            ₹{activeProduct?.price || 499}
            {activeProduct?.original_price && (
              <span style={{ fontSize: '16px', color: '#999', textDecoration: 'line-through', marginLeft: '10px' }}>
                ₹{activeProduct.original_price}
              </span>
            )}
            {activeProduct?.discount && (
              <span style={{ fontSize: '16px', color: '#2ecc71', marginLeft: '10px' }}>{activeProduct.discount}</span>
            )}
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
              <Typography variant="body2"><strong>Freebie</strong> Free Silk Scrunchie on orders above ₹2000</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <CheckCircle sx={{ color: '#2ecc71', fontSize: 18 }} />
              <Typography variant="body2"><strong>Special Price</strong> Get extra ₹1500 off (price inclusive of cashback/coupon)</Typography>
            </Box>
          </Stack>

          {activeProduct?.isDynamic && (
            <>
              <Divider sx={{ mb: 4 }} />
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Playfair Display", serif' }}>Product Highlights</Typography>
              <ul style={{ paddingLeft: '20px', color: '#444', marginBottom: '24px' }}>
                {(activeProduct.highlights || []).map((h, i) => (
                  <li key={i} style={{ marginBottom: '8px', fontSize: '14px' }}>{h}</li>
                ))}
              </ul>

              <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, fontFamily: '"Playfair Display", serif' }}>Description</Typography>
              <Typography variant="body2" sx={{ color: '#666', lineHeight: 1.8, mb: 4 }}>
                {activeProduct.description}
              </Typography>
            </>
          )}

          <Divider sx={{ mb: 4 }} />
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
          setBuyingItem(null);
          setView('order-summary');
        }}
      />

      <PaymentModal
        open={isPaymentOpen}
        onClose={() => { setIsPaymentOpen(false); setBuyingItem(null); }}
        totalAmount={buyingItem ? calculatePrice(buyingItem) : cart.reduce((sum, item) => sum + calculatePrice(item), 0)}
        onSuccess={handlePaymentSuccess}
      />

      <Snackbar
        open={showAddToCartSuccess}
        autoHideDuration={2000}
        onClose={() => setShowAddToCartSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: 9999 }}
      >
        <Alert
          onClose={() => setShowAddToCartSuccess(false)}
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
          {cartSuccessMsg}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showAddToFavSuccess}
        autoHideDuration={2000}
        onClose={() => setShowAddToFavSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: 9999 }}
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
          {favSuccessMsg}
        </Alert>
      </Snackbar>

      <Chatbot />

      <CompleteProfileModal
        open={isCompleteProfileOpen}
        user={user}
        onComplete={handleProfileComplete}
        onSkip={() => setIsCompleteProfileOpen(false)}
      />

      <UserProfileModal
        open={isUserDetailsOpen}
        user={user}
        onUpdate={(updatedUser) => {
          setUser(updatedUser);
          localStorage.setItem("pp_user", JSON.stringify(updatedUser));
        }}
        onClose={() => setIsUserDetailsOpen(false)}
      />
    </div>
  );
}

export default App;