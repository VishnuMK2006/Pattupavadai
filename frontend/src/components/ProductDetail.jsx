
import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Typography,
    Button,
    Container,
    Stack,
    IconButton,
    Rating,
    Divider,
    Paper,
    Chip,
    Breadcrumbs,
    Link as MuiLink,
    AppBar,
    Toolbar,
    Avatar,
    Badge,
    TextField,
    InputAdornment,
    Snackbar,
    Alert
} from '@mui/material';
import {
    FavoriteBorder,
    Favorite,
    ShoppingCart,
    FlashOn,
    LocalOffer,
    NavigateNext,
    PlayCircleOutline,
    ArrowBack,
    Search,
    ShoppingBagOutlined,
    Person,
    Logout,
    Instagram,
    Facebook,
    Pinterest,
    Menu as MenuIcon,
    InfoOutlined,
    Add,
    Remove
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, MenuItem } from '@mui/material';

const MotionBox = motion(Box);

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFBE6',
    text: '#2A000A',
    bg: '#FFFBE6',
    gray: '#878787',
    green: '#388e3c',
    mustard: '#E3A018'
};

const ProductDetail = ({ product, onBack, onAddToCart, onBuyNow, onCustomize, favorites = [], onToggleFavorite, onShowFavorites, onShowCart, cart = [], user, onSignOut, onShowOrders, onShowDetails }) => {
    const gallery = product.gallery || product.gallery_images || [product.image];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedImage, setSelectedImage] = useState(gallery[0] || '');
    const [isVideoActive, setIsVideoActive] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [showHighlightsOverlay, setShowHighlightsOverlay] = useState(false);
    const isFavorite = favorites.some(f => (f.id || f.product_id) === (product?.id || product?._id));
    const [quantity, setQuantity] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sizeError, setSizeError] = useState(false); // Added sizeError state

    const isInCart = cart.some(item => (item.id || item.product_id) === product.id); // Added isInCart logic

    const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleProfileMenuClose = () => setAnchorEl(null);

    const handleBuyNowClick = () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        onBuyNow({ ...product, selectedSize, quantity });
    };

    const handleAddToCartClick = () => {
        if (!selectedSize) {
            setSizeError(true);
            return;
        }
        onAddToCart({ ...product, selectedSize, quantity });
    };

    useEffect(() => {
        if (selectedSize) setSizeError(false);
    }, [selectedSize]);

    useEffect(() => {
        if (product) {
            const newGallery = product.gallery || product.gallery_images || [product.image];
            setSelectedImage(newGallery[0]);
            setCurrentIndex(0);
        }
    }, [product]);

    const handleNextImage = () => {
        const nextIndex = (currentIndex + 1) % gallery.length;
        setCurrentIndex(nextIndex);
        setSelectedImage(gallery[nextIndex]);
        setIsVideoActive(false);
    };

    const handlePrevImage = () => {
        const prevIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        setCurrentIndex(prevIndex);
        setSelectedImage(gallery[prevIndex]);
        setIsVideoActive(false);
    };

    if (!product) return null;

    const hasVideo = product.video_url;

    const handleToggleFav = (e) => {
        e.stopPropagation();
        onToggleFavorite(product);
    };

    // const isFav = favorites.some(f => f.id === product.id); // Removed, using isFavorite directly

    return (
        <Box sx={{
            bgcolor: luxuryColors.bg,
            minHeight: '100vh',
            pb: 4,
            backgroundImage: `radial-gradient(circle at 80% 0%, rgba(227, 160, 24, 0.05) 0%, transparent 50%), 
                             radial-gradient(circle at 0% 100%, rgba(179, 139, 0, 0.05) 0%, transparent 50%)`
        }}>
            {/* Header / Navbar */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(255, 251, 230, 0.8)',
                    backdropFilter: 'blur(20px)',
                    borderBottom: '1px solid rgba(76, 0, 19, 0.05)',
                    color: luxuryColors.maroon,
                    zIndex: 1100,
                    mb: 0
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 4 }, py: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={onBack} sx={{ color: luxuryColors.maroon }}>
                            <ArrowBack />
                        </IconButton>
                        <Box
                            component="img"
                            src="/images/logo.jpg"
                            sx={{ height: 45, cursor: 'pointer', borderRadius: '50%' }}
                            onClick={onBack}
                        />
                        <Typography
                            variant="h6"
                            sx={{
                                color: luxuryColors.maroon,
                                fontWeight: 900,
                                fontFamily: '"Playfair Display", serif',
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center'
                            }}
                        >
                            Kuzhavi<span style={{ color: luxuryColors.gold }}>_Kids</span>
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1, mx: 4, maxWidth: 600, display: { xs: 'none', md: 'block' } }}>
                        <TextField
                            fullWidth
                            placeholder="Search for products, brands and more"
                            variant="outlined"
                            size="small"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search sx={{ color: luxuryColors.gray }} />
                                    </InputAdornment>
                                ),
                                sx: { bgcolor: 'rgba(76, 0, 19, 0.03)', border: 'none', '& fieldset': { border: 'none' }, borderRadius: '30px', px: 2 }
                            }}
                        />
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton onClick={onShowFavorites} sx={{ color: luxuryColors.maroon }}>
                            <Badge badgeContent={favorites.length} color="error" sx={{ '& .MuiBadge-badge': { bgcolor: luxuryColors.gold } }}>
                                <FavoriteBorder />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={onShowCart} sx={{ color: luxuryColors.maroon }}>
                            <Badge badgeContent={cart.length} color="error" sx={{ '& .MuiBadge-badge': { bgcolor: luxuryColors.gold } }}>
                                <ShoppingBagOutlined />
                            </Badge>
                        </IconButton>
                        <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
                            <Avatar sx={{ bgcolor: 'transparent', color: luxuryColors.maroon, border: `1.5px solid ${luxuryColors.maroon}`, width: 34, height: 34 }}>
                                <Person fontSize="small" />
                            </Avatar>
                        </IconButton>
                    </Stack>
                </Toolbar>
            </AppBar>

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
                    <Typography sx={{ fontWeight: 800, color: luxuryColors.maroon, fontSize: '14px' }}>
                        {user?.name || user?.email?.split('@')[0]}
                    </Typography>
                    <Typography sx={{ color: '#999', fontSize: '12px' }}>{user?.email}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => { handleProfileMenuClose(); onShowOrders(); }}>
                    <ShoppingBagOutlined sx={{ fontSize: 20, mr: 2, color: luxuryColors.gold }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>My Orders</Typography>
                </MenuItem>
                <MenuItem onClick={() => { handleProfileMenuClose(); onShowDetails(); }}>
                    <Person sx={{ fontSize: 20, mr: 2, color: luxuryColors.gold }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>My Details</Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => { handleProfileMenuClose(); onSignOut(); }} sx={{ color: '#d32f2f' }}>
                    <Logout sx={{ fontSize: 20, mr: 2 }} />
                    <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Sign Out</Typography>
                </MenuItem>
            </Menu>

            <Container maxWidth="xl" sx={{ pt: 4, pb: 8, px: { xs: 2, md: 6 } }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: '0.85fr 1.55fr' },
                    gap: 6,
                    alignItems: 'flex-start'
                }}>
                    {/* LEFT COLUMN: Images & Buttons */}
                    <Box>
                        <Box sx={{ position: 'sticky', top: 100 }}>
                            <Paper elevation={0} sx={{ p: 2, border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden', bgcolor: 'white' }}>
                                {/* Image Display */}
                                <Box sx={{ position: 'relative', width: '100%', pt: '110%', bgcolor: 'white', mb: 2, borderRadius: '4px', overflow: 'hidden' }}>
                                    <Box
                                        sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >
                                        {isVideoActive && hasVideo ? (
                                            <Box sx={{ width: '100%', height: '100%' }}>
                                                {product.video_url.includes('youtube.com') || product.video_url.includes('youtu.be') ? (
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={product.video_url.replace('watch?v=', 'embed/')}
                                                        title="Product Video"
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                    ></iframe>
                                                ) : (
                                                    <video
                                                        src={product.video_url}
                                                        controls
                                                        autoPlay
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                )}
                                            </Box>
                                        ) : (
                                            <motion.img
                                                key={selectedImage}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                src={selectedImage}
                                                alt={product.name}
                                                drag="x"
                                                dragConstraints={{ left: 0, right: 0 }}
                                                onDragEnd={(e, { offset, velocity }) => {
                                                    const swipe = offset.x;
                                                    if (swipe < -50) handleNextImage();
                                                    else if (swipe > 50) handlePrevImage();
                                                }}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    cursor: 'grab'
                                                }}
                                                whileTap={{ cursor: 'grabbing' }}
                                            />
                                        )}

                                        {/* Highlights Overlay (Mobile/Flipkart Style - Only on 2nd Image) */}
                                        <AnimatePresence>
                                            {!isVideoActive && currentIndex === 1 && (
                                                <MotionBox
                                                    initial={{ opacity: 0, x: -50 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -50 }}
                                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                                    sx={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        height: '100%',
                                                        width: '100%',
                                                        background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
                                                        p: 3,
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'flex-start',
                                                        zIndex: 2000,
                                                        pointerEvents: 'none'
                                                    }}
                                                >
                                                    <Typography sx={{ fontWeight: 700, fontSize: '24px', mb: 3, color: 'white', letterSpacing: '0.2px' }}>
                                                        Key Highlights
                                                    </Typography>

                                                    <Stack spacing={3.5} sx={{ alignItems: 'flex-start' }}>
                                                        {(product.highlights && product.highlights.filter(h => h && h.trim().length > 0).length > 0 ? product.highlights.filter(h => h && h.trim().length > 0) : [
                                                            'Sleeve Style: Regular Sleeves',
                                                            'Pattern: Floral Print',
                                                            'Neck: Mandarin Collar',
                                                            'Top Type: Regular Top',
                                                            'Fabric: Pure Cotton'
                                                        ]).map((h, i) => {
                                                            const parts = h.includes(':') ? h.split(':') : [null, h];
                                                            const label = parts[0]?.trim();
                                                            const value = (parts[1] || '').trim();

                                                            return (
                                                                <Box key={i} sx={{ textAlign: 'left' }}>
                                                                    {label && (
                                                                        <Typography sx={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', mb: 0.2, fontWeight: 400 }}>
                                                                            {label}
                                                                        </Typography>
                                                                    )}
                                                                    <Typography sx={{ fontWeight: 700, fontSize: '17px', color: 'white', lineHeight: 1.2 }}>
                                                                        {value}
                                                                    </Typography>
                                                                </Box>
                                                            );
                                                        })}
                                                    </Stack>
                                                </MotionBox>
                                            )}
                                        </AnimatePresence>
                                    </Box>

                                    {/* Pagination Indicators (Flipkart Style) */}
                                    {!isVideoActive && gallery.length > 1 && (
                                        <Stack
                                            direction="row"
                                            spacing={1}
                                            sx={{
                                                position: 'absolute',
                                                bottom: 20,
                                                left: '50%',
                                                transform: 'translateX(-50%)',
                                                zIndex: 3,
                                                bgcolor: 'rgba(0,0,0,0.15)',
                                                px: 1.5,
                                                py: 0.8,
                                                borderRadius: '20px',
                                                backdropFilter: 'blur(4px)'
                                            }}
                                        >
                                            {gallery.map((_, i) => (
                                                <Box
                                                    key={i}
                                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); setSelectedImage(gallery[i]); setIsVideoActive(false); }}
                                                    sx={{
                                                        width: currentIndex === i ? 20 : 6,
                                                        height: 6,
                                                        bgcolor: currentIndex === i ? 'white' : 'rgba(255,255,255,0.5)',
                                                        borderRadius: '3px',
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                        cursor: 'pointer',
                                                        '&:hover': { bgcolor: 'white' }
                                                    }}
                                                />
                                            ))}
                                        </Stack>
                                    )}

                                    {/* Favorite Overlay */}
                                    <IconButton
                                        onClick={handleToggleFav}
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            bgcolor: 'white',
                                            border: 'none',
                                            outline: 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                            '&:hover': {
                                                bgcolor: '#f5f5f5',
                                                transform: 'scale(1.1)',
                                                border: 'none',
                                                outline: 'none'
                                            },
                                            transition: 'all 0.2s ease',
                                            zIndex: 3
                                        }}
                                    >
                                        {isFavorite ? (
                                            <Favorite sx={{ color: '#ff0101', fontSize: 26 }} />
                                        ) : (
                                            <FavoriteBorder sx={{ color: '#888', fontSize: 26 }} />
                                        )}
                                    </IconButton>
                                </Box>

                                {/* Thumbnails */}
                                <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', pb: 1 }}>
                                    {gallery.map((img, i) => (
                                        <Box
                                            key={i}
                                            onClick={() => { setSelectedImage(img); setCurrentIndex(i); setIsVideoActive(false); }}
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                border: currentIndex === i && !isVideoActive ? `2px solid ${luxuryColors.maroon}` : '1px solid #f0f0f0',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                borderRadius: '2px',
                                                p: 0.5
                                            }}
                                        >
                                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Box>
                                    ))}
                                    {hasVideo && (
                                        <Box
                                            onClick={() => setIsVideoActive(true)}
                                            sx={{
                                                width: 64,
                                                height: 64,
                                                border: isVideoActive ? `2px solid ${luxuryColors.maroon}` : '1px solid #f0f0f0',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                borderRadius: '2px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                bgcolor: '#f9f9f9',
                                                position: 'relative'
                                            }}
                                        >
                                            <PlayCircleOutline sx={{ color: luxuryColors.maroon, zIndex: 1 }} />
                                            {gallery[0] && <img src={gallery[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3, position: 'absolute' }} />}
                                        </Box>
                                    )}
                                </Stack>
                            </Paper>

                        </Box>
                    </Box>

                    {/* RIGHT COLUMN: Product Info */}
                    <Box>
                        <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: '8px', border: '1px solid #f0f0f0', bgcolor: 'white' }}>
                            {/* Title & Reviews */}
                            <Typography sx={{ fontSize: '24px', color: luxuryColors.text, mb: 1.5, fontWeight: 700, fontFamily: '"Playfair Display", serif' }}>
                                {product.name}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                                <Box sx={{ bgcolor: luxuryColors.maroon, color: 'white', px: 1, py: 0.3, borderRadius: '4px', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{product.rating || 4.5}</Typography>
                                    <Star sx={{ fontSize: 13 }} />
                                </Box>
                                <Typography sx={{ fontSize: '14px', color: luxuryColors.gray, fontWeight: 500 }}>
                                    {product.reviews || 100} Ratings & 45 Reviews
                                </Typography>
                                <Chip label="Verified Premium" size="small" sx={{ ml: 2, bgcolor: 'rgba(179, 139, 0, 0.1)', color: luxuryColors.gold, fontWeight: 700, border: `1px solid ${luxuryColors.gold}` }} />
                            </Stack>

                            <Typography sx={{ color: luxuryColors.maroon, fontSize: '14px', fontWeight: 800, mb: 1, textTransform: 'uppercase', letterSpacing: '1px' }}>Special Price</Typography>
                            <Stack direction="row" spacing={2} alignItems="baseline" sx={{ mb: 1 }}>
                                <Typography sx={{ fontSize: '32px', fontWeight: 800, color: luxuryColors.text, fontFamily: '"Playfair Display", serif' }}>{product.price}</Typography>
                                <Typography sx={{ fontSize: '18px', textDecoration: 'line-through', color: luxuryColors.gray }}>{product.originalPrice}</Typography>
                                <Typography sx={{ fontSize: '18px', color: luxuryColors.gold, fontWeight: 700 }}>{product.discountText || '50% off'}</Typography>
                            </Stack>

                            {/* Offers Section */}
                            <Box sx={{ mb: 3 }}>
                                <Typography sx={{ fontSize: '15px', fontWeight: 800, mb: 1.5, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif' }}>Available offers</Typography>
                                <Stack spacing={1}>
                                    {(product.offers || [
                                        'Bank Offer: 5% Unlimited Cashback on Card Payments',
                                        'Special Price: Get extra ₹500 off on first purchase',
                                        'Partner Offer: Free shipping on orders above ₹2,999'
                                    ]).map((offer, i) => (
                                        <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <LocalOffer sx={{ color: luxuryColors.gold, fontSize: 14 }} />
                                            <Typography sx={{ fontSize: '13px', color: '#444' }}>{offer}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>

                            <Divider sx={{ my: 3 }} />



                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontSize: '14px', fontWeight: 800, mb: 1, color: luxuryColors.gray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Select Size
                                </Typography>
                                {sizeError && (
                                    <Typography sx={{ color: '#d32f2f', fontSize: '12px', mb: 1.5, fontWeight: 600 }}>
                                        Please select a size to proceed
                                    </Typography>
                                )}
                                <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                                    {(product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes : ['0-1Y', '1-2Y', '2-3Y', '3-4Y', '4-5Y']).map((size) => (
                                        <Box
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            sx={{
                                                width: 'auto',
                                                minWidth: 48,
                                                height: 48,
                                                px: 1.5,
                                                border: selectedSize === size ? `2px solid #2874f0` : '1px solid #e0e0e0',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                fontWeight: 700,
                                                fontSize: '14px',
                                                borderRadius: '2px',
                                                color: selectedSize === size ? '#2874f0' : '#212121',
                                                '&:hover': { border: `1px solid #2874f0` },
                                                borderColor: sizeError && !selectedSize ? '#d32f2f' : (selectedSize === size ? '#2874f0' : '#e0e0e0'),
                                                boxShadow: sizeError && !selectedSize ? '0 0 0 1px #d32f2f' : 'none'
                                            }}
                                        >
                                            {size}
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>

                            {/* Quantity Selector */}
                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontSize: '14px', fontWeight: 800, mb: 1, color: luxuryColors.gray, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    Quantity
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <IconButton
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1}
                                        sx={{
                                            border: `1px solid ${quantity <= 1 ? '#e0e0e0' : luxuryColors.maroon}`,
                                            color: luxuryColors.maroon,
                                            width: 36,
                                            height: 36,
                                            '&:hover': { bgcolor: quantity <= 1 ? 'transparent' : 'rgba(76, 0, 19, 0.05)' }
                                        }}
                                    >
                                        <Remove fontSize="small" />
                                    </IconButton>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 700, minWidth: 20, textAlign: 'center', color: luxuryColors.text }}>
                                        {quantity}
                                    </Typography>
                                    <IconButton
                                        onClick={() => setQuantity(quantity + 1)}
                                        sx={{
                                            border: `1px solid ${luxuryColors.maroon}`,
                                            color: luxuryColors.maroon,
                                            width: 36,
                                            height: 36,
                                            '&:hover': { bgcolor: 'rgba(76, 0, 19, 0.05)' }
                                        }}
                                    >
                                        <Add fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Box>

                            {/* Action Buttons */}
                            <Grid container spacing={2} sx={{ mb: 4 }}>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        startIcon={<ShoppingCart />}
                                        onClick={handleAddToCartClick}
                                        disabled={isInCart}
                                        sx={{
                                            bgcolor: isInCart ? '#ccc' : luxuryColors.gold,
                                            '&:hover': { bgcolor: isInCart ? '#ccc' : luxuryColors.mustard },
                                            height: 54,
                                            fontWeight: 800,
                                            fontSize: '15px',
                                            borderRadius: '50px',
                                            boxShadow: isInCart ? 'none' : '0 10px 20px rgba(179, 139, 0, 0.2)',
                                            color: 'white',
                                            textTransform: 'none'
                                        }}
                                    >
                                        {isInCart ? 'Already in Bag' : 'Add to Bag'}
                                    </Button>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        startIcon={<FlashOn />}
                                        onClick={handleBuyNowClick}
                                        sx={{
                                            bgcolor: luxuryColors.maroon,
                                            '&:hover': { bgcolor: '#2A000A' },
                                            height: 54,
                                            fontWeight: 800,
                                            fontSize: '15px',
                                            borderRadius: '50px',
                                            boxShadow: '0 10px 20px rgba(76, 0, 19, 0.2)',
                                            color: 'white',
                                            textTransform: 'none'
                                        }}
                                    >
                                        Buy Now
                                    </Button>
                                </Grid>
                            </Grid>

                            {/* Highlights */}
                            <Box sx={{ mb: 4 }}>
                                <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: 2, color: luxuryColors.gray }}>Highlights</Typography>
                                <Grid container spacing={1}>
                                    {(product.highlights && product.highlights.length > 0 ? product.highlights : ['Premium Silk Fabric', 'Handcrafted Embroidery', 'Gold Zari Work', 'Lining Provided', 'Traditional Aesthetic']).map((h, i) => (
                                        <Grid item xs={6} key={i}>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                                <Box sx={{ width: 4, height: 4, bgcolor: '#878787', borderRadius: '50%' }} />
                                                <Typography sx={{ fontSize: '14px' }}>{h}</Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Box>

                            {/* Description */}
                            <Box>
                                <Typography sx={{ fontSize: '14px', fontWeight: 700, mb: 2, color: luxuryColors.gray }}>Description</Typography>
                                <Typography sx={{ fontSize: '14px', lineHeight: 1.6, color: '#212121' }}>
                                    {product.description || 'This beautiful Pattu Pavadai for children is handcrafted with the highest quality silk. Perfect for festivals, weddings, and traditional ceremonies. The intricate zaric embroidery and vibrant colors make it a standout choice for your little one.'}
                                </Typography>
                            </Box>
                        </Paper>
                    </Box>
                </Box >
            </Container >

            {/* Footer */}
            < Box sx={{ bgcolor: luxuryColors.maroon, pt: 8, pb: 4, color: 'white', mt: 10 }}>
                <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
                    <Grid container spacing={8} sx={{ mb: 10 }}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, mb: 3 }}>Kuzhavi_Kids</Typography>
                            <Typography sx={{ opacity: 0.6, fontSize: '14px', lineHeight: 2, mb: 4 }}>
                                Handcrafting memories for your little ones with the touch of tradition and the comfort of modern standards. Based in the heart of South India.
                            </Typography>
                            <Stack direction="row" spacing={3}>
                                <Instagram sx={{ cursor: 'pointer', '&:hover': { color: luxuryColors.gold } }} />
                                <Facebook sx={{ cursor: 'pointer', '&:hover': { color: luxuryColors.gold } }} />
                                <Pinterest sx={{ cursor: 'pointer', '&:hover': { color: luxuryColors.gold } }} />
                            </Stack>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '12px', letterSpacing: '2px' }}>QUICK LINKS</Typography>
                            <Stack spacing={2}>
                                {['Collections', 'New Arrivals', 'Ready to dispatch', 'Gift Cards'].map(l => (
                                    <Typography key={l} sx={{ opacity: 0.6, fontSize: '14px', cursor: 'pointer', '&:hover': { opacity: 1 } }}>{l}</Typography>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={6} md={2}>
                            <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '12px', letterSpacing: '2px' }}>POLICIES</Typography>
                            <Stack spacing={2}>
                                {['Shipping', 'Returns', 'Privacy', 'Size Guide'].map(l => (
                                    <Typography key={l} sx={{ opacity: 0.6, fontSize: '14px', cursor: 'pointer', '&:hover': { opacity: 1 } }}>{l}</Typography>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '12px', letterSpacing: '2px' }}>STAY IN TOUCH</Typography>
                            <Box sx={{ display: 'flex', bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: '4px' }}>
                                <TextField
                                    variant="standard"
                                    placeholder="Enter your email"
                                    InputProps={{ disableUnderline: true, sx: { color: 'white', px: 2, fontSize: '14px' } }}
                                    fullWidth
                                />
                                <Button sx={{ color: luxuryColors.maroon, bgcolor: luxuryColors.gold, fontWeight: 700 }}>JOIN</Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>© 2024 Kuzhavi Kids Clothing. All rights reserved.</Typography>
                        <Stack direction="row" spacing={3}>
                            <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>Terms</Typography>
                            <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>Privacy</Typography>
                            <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>Cookies</Typography>
                        </Stack>
                    </Box>
                </Container>
            </Box >
        </Box >
    );
};

const Star = ({ sx }) => (
    <Box component="span" sx={{ ...sx }}>★</Box>
);

export default ProductDetail;
