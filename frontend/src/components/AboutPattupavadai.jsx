
import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Container,
    Card,
    CardMedia,
    CardContent,
    Stack,
    IconButton,
    Select,
    MenuItem,
    Chip,
    Pagination,
    Divider,
    AppBar,
    Toolbar,
    Avatar,
    Menu,
    TextField,
    InputAdornment,
    Badge,
    Slider,
    Snackbar,
    Alert
} from '@mui/material';
import {
    ArrowBack,
    FavoriteBorder,
    Favorite,
    ShoppingBagOutlined,
    Star,
    Search,
    Person,
    Logout,
    Instagram,
    Facebook,
    Pinterest,
    WhatsApp,
    FilterAltOutlined,
    PersonOutline
} from '@mui/icons-material';
import UserProfileModal from './UserProfileModal';
import { motion } from 'framer-motion';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFBE6', // Updated to match Home Page
    text: '#2A000A',
    bg: '#FFFBE6', // Updated to match Home Page
    cardBg: '#FFFFFF',
    mustard: '#E3A018',
};

// Product data is now fetched dynamically from the database via props.

const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function AboutPattupavadai({ onBack, onSelect, user, onSignOut, onShowFavorites, onShowCart, onShowOrders, favorites = [], onToggleFavorite, onAddToCart, cart = [], productsList = [], onUpdateUser }) {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('best-selling');
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    // Add timestamp for cache busting images
    const [imgTimestamp] = useState(Date.now());
    const [isUserDetailsOpen, setIsUserDetailsOpen] = useState(false);

    // Merge static and dynamic products
    const allProducts = useMemo(() => {
        const dynamic = productsList.map(p => ({
            id: p._id,
            name: p.name,
            blurb: p.blurb,
            description: p.description,
            price: `₹${p.price}`,
            originalPrice: `₹${p.original_price}`,
            image: p.card_image,
            tag: p.tag,
            rating: p.rating || 4.5,
            reviews: p.reviews_count || 100,
            accent: p.accent_color || luxuryColors.maroon,
            highlights: p.highlights,
            gallery: p.gallery_images,
            availableSizes: p.available_sizes || [],
            discountText: p.discount || '',
            isDynamic: true
        }));

        // Show dynamic products only
        return dynamic;
    }, [productsList]);

    // Snackbar state
    const [showWishlistMsg, setShowWishlistMsg] = useState(false);
    const [showCartMsg, setShowCartMsg] = useState(false);
    const [showDuplicateMsg, setShowDuplicateMsg] = useState(false);

    // Filter States
    const [availabilityAnchor, setAvailabilityAnchor] = useState(null);
    const [priceAnchor, setPriceAnchor] = useState(null);
    const [filterAvailability, setFilterAvailability] = useState("all"); // all, in-stock, out-of-stock
    const [priceRange, setPriceRange] = useState(null); // null or {min, max}

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    // Filter & Sort Logic
    // -------------------
    const processedProducts = useMemo(() => {
        let items = [...allProducts];

        // 1. Availability Filter
        if (filterAvailability === "in-stock") {
            items = items.filter(item => !item.comingSoon);
        } else if (filterAvailability === "out-of-stock") {
            items = items.filter(item => item.comingSoon);
        }

        // 2. Price Filter
        if (priceRange) {
            items = items.filter(item => {
                const p = parseInt(item.price.replace(/[^0-9]/g, ''));
                return p >= priceRange.min && (priceRange.max === null || p <= priceRange.max);
            });
        }

        // 3. Sorting
        const getPriceNumeric = (p) => parseInt(p.price.replace(/[^0-9]/g, ''));

        switch (sortBy) {
            case 'price-low':
                items.sort((a, b) => getPriceNumeric(a) - getPriceNumeric(b));
                break;
            case 'price-high':
                items.sort((a, b) => getPriceNumeric(b) - getPriceNumeric(a));
                break;
            case 'newest':
                items.reverse();
                break;
            default: // best-selling
                break;
        }

        return items;
    }, [allProducts, filterAvailability, priceRange, sortBy]);


    // Pagination logic
    const itemsPerPage = 8;
    const pageCount = Math.ceil(processedProducts.length / itemsPerPage);
    // Reset page if filtered results are fewer than current page view
    if (page > pageCount && pageCount > 0) setPage(1);

    const displayedProducts = processedProducts.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants = {
        hidden: { y: 50, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 20,
                stiffness: 100
            }
        },
        hover: {
            y: -8,
            transition: {
                type: "spring",
                stiffness: 300
            }
        }
    };

    // Handlers for Filters
    const handleAvailabilityClick = (event) => setAvailabilityAnchor(event.currentTarget);
    const handlePriceClick = (event) => setPriceAnchor(event.currentTarget);

    const applyAvailability = (status) => {
        setFilterAvailability(status);
        setAvailabilityAnchor(null);
        setPage(1);
    };

    const applyPriceFilter = (min, max) => {
        setPriceRange(min === null && max === null ? null : { min, max });
        setPriceAnchor(null);
        setPage(1);
    };

    return (
        <>
            <Box sx={{
                minHeight: '100vh',
                bgcolor: luxuryColors.bg,
                backgroundImage: `radial-gradient(circle at 80% 0%, rgba(227, 160, 24, 0.08) 0%, transparent 50%), 
                             radial-gradient(circle at 0% 100%, rgba(179, 139, 0, 0.08) 0%, transparent 50%)`
            }}>

                {/* Navbar */}
                <AppBar
                    position="sticky"
                    elevation={0}
                    sx={{
                        bgcolor: 'white',
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        color: luxuryColors.maroon,
                        zIndex: 1100
                    }}
                >
                    <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 }, py: 1 }}>
                        {/* Left: Logo and Back */}
                        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center', gap: 2 }}>
                            <Button
                                startIcon={<ArrowBack />}
                                onClick={onBack}
                                sx={{
                                    color: luxuryColors.maroon,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    mr: 2,
                                    display: { xs: 'none', sm: 'flex' }
                                }}
                            >
                                Back
                            </Button>
                            <Box
                                component="img"
                                src="/images/logo.jpg"
                                sx={{ height: 60, cursor: 'pointer' }}
                                onClick={() => window.location.reload()}
                            />
                        </Box>

                        {/* Right: Search & Actions */}
                        <Stack direction="row" spacing={3} sx={{ flex: 2, justifyContent: 'flex-end', alignItems: 'center' }}>
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <TextField
                                    placeholder="Search collection..."
                                    variant="standard"
                                    InputProps={{
                                        disableUnderline: true,
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search sx={{ color: luxuryColors.maroon, opacity: 0.5 }} />
                                            </InputAdornment>
                                        ),
                                        sx: {
                                            bgcolor: 'rgba(76, 0, 19, 0.03)',
                                            px: 2,
                                            py: 1,
                                            borderRadius: '50px',
                                            fontSize: '13px',
                                            width: '280px',
                                            transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                            border: '1px solid transparent',
                                            '&:focus-within': {
                                                bgcolor: 'white',
                                                border: `1px solid rgba(76, 0, 19, 0.1)`,
                                                boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                                            }
                                        }
                                    }}
                                />
                            </Box>

                            {/* Action Icons */}
                            <Stack direction="row" spacing={1} alignItems="center">
                                <IconButton onClick={onShowFavorites}>
                                    <Badge badgeContent={favorites.length} color="error" invisible={favorites.length === 0} sx={{ '& .MuiBadge-badge': { bgcolor: luxuryColors.gold } }}>
                                        <FavoriteBorder sx={{ color: luxuryColors.maroon }} />
                                    </Badge>
                                </IconButton>

                                <IconButton onClick={onShowCart}>
                                    <Badge badgeContent={cart.length} color="error" invisible={cart.length === 0} sx={{ '& .MuiBadge-badge': { bgcolor: luxuryColors.gold } }}>
                                        <ShoppingBagOutlined sx={{ color: luxuryColors.maroon }} />
                                    </Badge>
                                </IconButton>

                                {/* Profile Menu Trigger */}
                                <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
                                    <Avatar sx={{
                                        bgcolor: 'transparent',
                                        color: luxuryColors.maroon,
                                        width: 32,
                                        height: 32,
                                        border: `1.5px solid ${luxuryColors.maroon}`
                                    }}>
                                        <Person sx={{ fontSize: 20 }} />
                                    </Avatar>
                                </IconButton>
                            </Stack>
                        </Stack>

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
                            <MenuItem onClick={() => { handleProfileMenuClose(); setIsUserDetailsOpen(true); }}>
                                <Person sx={{ fontSize: 20, mr: 2, color: luxuryColors.gold }} />
                                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>My Details</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => { handleProfileMenuClose(); onSignOut(); }} sx={{ color: '#d32f2f' }}>
                                <Logout sx={{ fontSize: 20, mr: 2 }} />
                                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Sign Out</Typography>
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>

                <Container maxWidth="xl" sx={{ pt: 4, pb: 8, px: { xs: 2, md: 6 } }}>
                    {/* Reference-style Header Section */}
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{
                            fontFamily: '"Playfair Display", serif',
                            color: luxuryColors.maroon,
                            fontWeight: 700,
                            mb: 4
                        }}>
                            Pattu Pavadai
                        </Typography>

                        {/* Filter and Sort Bar */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E0E0E0', pb: 2 }}>
                            <Stack direction="row" spacing={4} alignItems="center">
                                <Typography sx={{ fontSize: '14px', color: '#555', fontWeight: 600 }}>Filter:</Typography>

                                {/* Availability Filter */}
                                <Box
                                    onClick={handleAvailabilityClick}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                >
                                    <Typography sx={{ fontSize: '13px', color: filterAvailability !== 'all' ? luxuryColors.maroon : '#555', fontWeight: filterAvailability !== 'all' ? 700 : 400 }}>
                                        Availability {filterAvailability !== 'all' ? `(${filterAvailability})` : ''}
                                    </Typography>
                                    <Typography sx={{ fontSize: '10px', color: '#555' }}>▼</Typography>
                                </Box>
                                <Menu
                                    anchorEl={availabilityAnchor}
                                    open={Boolean(availabilityAnchor)}
                                    onClose={() => setAvailabilityAnchor(null)}
                                >
                                    <MenuItem onClick={() => applyAvailability('all')}>All</MenuItem>
                                    <MenuItem onClick={() => applyAvailability('in-stock')}>In Stock</MenuItem>
                                    <MenuItem onClick={() => applyAvailability('out-of-stock')}>Out of Stock</MenuItem>
                                </Menu>

                                {/* Price Filter */}
                                <Box
                                    onClick={handlePriceClick}
                                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
                                >
                                    <Typography sx={{ fontSize: '13px', color: priceRange ? luxuryColors.maroon : '#555', fontWeight: priceRange ? 700 : 400 }}>
                                        Price {priceRange ? '(Active)' : ''}
                                    </Typography>
                                    <Typography sx={{ fontSize: '10px', color: '#555' }}>▼</Typography>
                                </Box>
                                <Menu
                                    anchorEl={priceAnchor}
                                    open={Boolean(priceAnchor)}
                                    onClose={() => setPriceAnchor(null)}
                                >
                                    <MenuItem onClick={() => applyPriceFilter(null, null)}>Reset</MenuItem>
                                    <MenuItem onClick={() => applyPriceFilter(0, 1500)}>Under ₹1,500</MenuItem>
                                    <MenuItem onClick={() => applyPriceFilter(1500, 2000)}>₹1,500 - ₹2,000</MenuItem>
                                    <MenuItem onClick={() => applyPriceFilter(2000, 2500)}>₹2,000 - ₹2,500</MenuItem>
                                    <MenuItem onClick={() => applyPriceFilter(2500, 100000)}>Above ₹2,500</MenuItem>
                                </Menu>
                            </Stack>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Typography sx={{ fontSize: '13px', color: '#555' }}>Sort by:</Typography>
                                <Select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    variant="standard"
                                    disableUnderline
                                    sx={{
                                        fontSize: '13px',
                                        minWidth: 100,
                                        color: '#555'
                                    }}
                                >
                                    <MenuItem value="best-selling">Best selling</MenuItem>
                                    <MenuItem value="price-low">Price: Low to High</MenuItem>
                                    <MenuItem value="price-high">Price: High to Low</MenuItem>
                                    <MenuItem value="newest">Newest First</MenuItem>
                                </Select>
                                <Typography sx={{ fontSize: '13px', color: '#999', ml: 2 }}>
                                    {processedProducts.length} products
                                </Typography>
                            </Stack>
                        </Box>
                    </Box>

                    {/* Products Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <Grid container spacing={2}>
                            {displayedProducts.map((product) => (
                                <Grid item xs={6} sm={4} md={3} key={product.id} sx={{ display: 'flex' }}>
                                    <MotionCard
                                        variants={cardVariants}
                                        whileHover="hover"
                                        onMouseEnter={() => setHoveredProduct(product.id)}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                        sx={{
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            bgcolor: 'white',
                                            border: '1px solid #f0f0f0',
                                            boxShadow: 'none',
                                            height: '100%',
                                            width: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            cursor: 'pointer',
                                            position: 'relative',
                                            '&:hover': {
                                                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
                                                borderColor: '#FFD700'
                                            }
                                        }}
                                        onClick={() => onSelect && onSelect(product)}
                                    >
                                        <Box sx={{
                                            position: 'relative',
                                            height: 280, // Absolute fixed height
                                            width: '100%',
                                            overflow: 'hidden',
                                            bgcolor: '#F8F8F8', // Light neutral background for 'contain' 
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderBottom: '1px solid rgba(0,0,0,0.05)'
                                        }}>
                                            <CardMedia
                                                component="img"
                                                image={product.image && (product.image.startsWith('data:') || product.image.startsWith('http'))
                                                    ? product.image
                                                    : `${product.image}?t=${imgTimestamp}`}
                                                alt={product.name}
                                                sx={{
                                                    maxWidth: '100%',
                                                    maxHeight: '100%',
                                                    width: 'auto',
                                                    height: 'auto',
                                                    objectFit: 'contain', // Fits the whole image without cropping
                                                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    transform: hoveredProduct === product.id ? 'scale(1.05)' : 'scale(1)'
                                                }}
                                            />

                                            {/* Heart Icon Overlay */}
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                bgcolor: 'white',
                                                borderRadius: '50%',
                                                width: 32,
                                                height: 32,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                                zIndex: 2,
                                                cursor: 'pointer',
                                                transition: '0.2s',
                                                '&:hover': { transform: 'scale(1.1)' }
                                            }}
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    if (onToggleFavorite) {
                                                        await onToggleFavorite(product);
                                                    }
                                                }}
                                            >
                                                {favorites.some(f => (f.id || f.product_id) === (product.id || product._id)) ? (
                                                    <Favorite sx={{ fontSize: 18, color: '#d32f2f' }} />
                                                ) : (
                                                    <FavoriteBorder sx={{ fontSize: 18, color: '#c2c2c2' }} />
                                                )}
                                            </Box>
                                        </Box>

                                        <CardContent sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            p: 2,
                                            gap: 0,
                                            pb: '16px !important'
                                        }}>
                                            {/* Brand Name */}
                                            <Typography sx={{ fontSize: '11px', color: '#999', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', mb: 0.5 }}>
                                                Kuzhavi Kids
                                            </Typography>

                                            {/* Title - Fixed Height for 2 lines */}
                                            <Box sx={{ height: 40, overflow: 'hidden', mb: 0.5 }}>
                                                <Typography
                                                    sx={{
                                                        fontSize: '14px',
                                                        color: '#212121',
                                                        lineHeight: 1.4,
                                                        fontWeight: 600,
                                                        display: '-webkit-box',
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: 'vertical',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis'
                                                    }}
                                                >
                                                    {product.name}
                                                </Typography>
                                            </Box>

                                            {/* Subtitle/Tag - Fixed Height */}
                                            <Typography sx={{ fontSize: '12px', color: '#878787', height: 18, overflow: 'hidden', mb: 0.5 }}>
                                                {product.blurb || `${product.tag || 'Traditional'}, Pack of 1`}
                                            </Typography>

                                            {/* Badge Row - Fixed Height */}
                                            <Box sx={{ height: 24, display: 'flex', alignItems: 'center', mb: 1 }}>
                                                <Box sx={{ bgcolor: '#F0F0F0', borderRadius: '4px', px: 0.8, py: 0.2 }}>
                                                    <Typography sx={{ fontSize: '10px', color: '#666', fontWeight: 800 }}>
                                                        ✓ PREMIUM
                                                    </Typography>
                                                </Box>
                                            </Box>

                                            {/* Price Row - Fixed Height */}
                                            <Stack direction="row" alignItems="baseline" spacing={1} sx={{ mb: 1, height: 24 }}>
                                                <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#212121' }}>
                                                    {product.price && product.price.toString().startsWith('₹') ? product.price : `₹${product.price}`}
                                                </Typography>
                                                <Typography sx={{ fontSize: '12px', textDecoration: 'line-through', color: '#999' }}>
                                                    {product.originalPrice || `₹${parseInt(product.price || 0) * 2}`}
                                                </Typography>
                                                <Typography sx={{ fontSize: '12px', color: '#388e3c', fontWeight: 800 }}>
                                                    {product.discountText ? (product.discountText.includes('%') ? product.discountText : `${product.discountText}% off`) : '50% off'}
                                                </Typography>
                                            </Stack>

                                            {/* Secondary Tags - Fixed Height */}
                                            <Box sx={{ height: 22, mb: 1 }}>
                                                {product.tag && (
                                                    <Typography sx={{
                                                        fontSize: '9px',
                                                        color: luxuryColors.maroon,
                                                        bgcolor: 'rgba(76, 0, 19, 0.05)',
                                                        display: 'inline-block',
                                                        px: 1,
                                                        py: 0.4,
                                                        borderRadius: '4px',
                                                        fontWeight: 800,
                                                        textTransform: 'uppercase',
                                                        letterSpacing: '0.5px'
                                                    }}>
                                                        {product.tag}
                                                    </Typography>
                                                )}
                                            </Box>

                                            {/* Sizes - Fixed Height */}
                                            <Box sx={{ height: 18, overflow: 'hidden', mb: 2 }}>
                                                <Typography sx={{ fontSize: '11px', color: '#212121', whiteSpace: 'nowrap' }}>
                                                    Size <span style={{ color: '#878787' }}>{product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes.join(', ') : '0-1Y, 1-2Y, 2-3Y'}</span>
                                                </Typography>
                                            </Box>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                onClick={async (e) => {
                                                    e.stopPropagation();
                                                    const isInCart = cart.some(item => (item.id || item.product_id) === (product.id || product._id));
                                                    if (isInCart) {
                                                        onShowCart && onShowCart();
                                                        return;
                                                    }

                                                    if (onAddToCart) {
                                                        const success = await onAddToCart(product);
                                                        if (success) {
                                                            setShowCartMsg(true);
                                                        }
                                                    }
                                                }}
                                                sx={{
                                                    mt: 'auto',
                                                    borderColor: luxuryColors.maroon,
                                                    color: luxuryColors.maroon,
                                                    borderRadius: '4px',
                                                    textTransform: 'none',
                                                    fontSize: '13px',
                                                    fontWeight: 600,
                                                    height: '36px',
                                                    '&:hover': {
                                                        borderColor: luxuryColors.maroon,
                                                        bgcolor: 'rgba(76, 0, 19, 0.04)'
                                                    }
                                                }}
                                            >
                                                {cart.some(item => (item.id || item.product_id) === (product.id || product._id)) ? "Check Bag" : "Add to Bag"}
                                            </Button>
                                        </CardContent>
                                    </MotionCard>
                                </Grid>
                            ))}
                        </Grid>
                        {displayedProducts.length === 0 && (
                            <Box sx={{ textAlign: 'center', py: 10 }}>
                                <Typography sx={{ color: '#999' }}>No products match your filters.</Typography>
                            </Box>
                        )}
                    </motion.div>

                    {/* Pagination */}
                    {displayedProducts.length > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                            <Pagination
                                count={pageCount}
                                page={page}
                                onChange={(e, v) => setPage(v)}
                                shape="rounded"
                                sx={{
                                    '& .Mui-selected': {
                                        bgcolor: luxuryColors.maroon + ' !important',
                                        color: 'white'
                                    }
                                }}
                            />
                        </Box>
                    )}
                </Container>

                {/* Footer */}
                <Box sx={{ bgcolor: luxuryColors.maroon, pt: 6, pb: 4, color: 'white', mt: 10 }}>
                    <Container maxWidth="xl" sx={{ px: { xs: 2, md: 6 } }}>
                        <Grid container spacing={8} sx={{ mb: 10 }}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, mb: 3 }}>Kuzhavi_Kids</Typography>
                                <Typography sx={{ opacity: 0.6, fontSize: '14px', lineHeight: 2, mb: 4 }}>
                                    Handcrafting memories for your little ones with the touch of tradition and the comfort of modern standards. Based in the heart of South India.
                                </Typography>
                                <Stack direction="row" spacing={3}>
                                    <Instagram
                                        onClick={() => window.open('https://www.instagram.com/kuzhavi_kids_clothing/?hl=en', '_blank')}
                                        sx={{ cursor: 'pointer', '&:hover': { color: luxuryColors.gold } }}
                                    />
                                    <Facebook
                                        onClick={() => window.open('https://www.facebook.com/p/kuzhavi_kids_clothing-100083258953249/', '_blank')}
                                        sx={{ cursor: 'pointer', '&:hover': { color: luxuryColors.gold } }}
                                    />
                                    <Pinterest
                                        onClick={() => window.open('https://in.pinterest.com/kuzhavikidswear/', '_blank')}
                                        sx={{ cursor: 'pointer', '&:hover': { color: luxuryColors.gold } }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '12px', letterSpacing: '2px' }}>QUICK LINKS</Typography>
                                <Stack spacing={2}>
                                    {['Collections', 'New Arrivals', 'Ready to dispatch', 'Gift Cards'].map(l => (
                                        <Typography
                                            key={l}
                                            sx={{ opacity: 0.6, fontSize: '14px', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                                        >
                                            {l}
                                        </Typography>
                                    ))}
                                </Stack>
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '12px', letterSpacing: '2px' }}>POLICIES</Typography>
                                <Stack spacing={2}>
                                    {['Shipping', 'Returns', 'Privacy', 'Size Guide'].map(l => (
                                        <Typography
                                            key={l}
                                            sx={{ opacity: 0.6, fontSize: '14px', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                                        >
                                            {l}
                                        </Typography>
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

                        <MuiDivider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                            <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>© 2024 Kuzhavi Kids Clothing. All rights reserved.</Typography>
                            <Stack direction="row" spacing={3}>
                                <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>Terms</Typography>
                                <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>Privacy</Typography>
                                <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>Cookies</Typography>
                            </Stack>
                        </Box>
                    </Container>
                </Box>




                {/* Cart Feedback Snackbar */}
                <Snackbar
                    open={showCartMsg}
                    autoHideDuration={2000}
                    onClose={() => setShowCartMsg(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setShowCartMsg(false)}
                        severity="success"
                        variant="filled"
                        sx={{
                            bgcolor: luxuryColors.gold,
                            color: 'white',
                            fontWeight: 600
                        }}
                    >
                        Added to Bag!
                    </Alert>
                </Snackbar>

                {/* Duplicate Item Snackbar */}
                <Snackbar
                    open={showDuplicateMsg}
                    autoHideDuration={2000}
                    onClose={() => setShowDuplicateMsg(false)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        onClose={() => setShowDuplicateMsg(false)}
                        severity="warning"
                        variant="filled"
                        sx={{
                            bgcolor: '#ff9800', // Warning Orange
                            color: 'white',
                            fontWeight: 600
                        }}
                    >
                        Item already in Bag!
                    </Alert>
                </Snackbar>
                {user && (
                    <UserProfileModal
                        open={isUserDetailsOpen}
                        user={user}
                        onUpdate={(updated) => {
                            onUpdateUser?.(updated);
                        }}
                        onClose={() => setIsUserDetailsOpen(false)}
                    />
                )}
            </Box>
        </>
    );
}

// Helper for Footer Divider to avoid conflict with Grid Divider if any
function MuiDivider(props) {
    return <Divider {...props} />;
}
