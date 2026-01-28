
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
    FilterAltOutlined
} from '@mui/icons-material';
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

// Internal product data for the About page showcase
const showcaseProducts = [
    { id: "CPM_0379", name: "Majestic Off-White & Maroon Aari Pattu Pavadai", price: "₹1,849", originalPrice: "₹3,699", image: "/images/Untitled design (20).png", tag: "Best Seller", rating: 4.9, reviews: 120, blurb: "A majestic combination of off-white and maroon with intricate aari work.", accent: "#4C0013" },
    { id: "CPM_0324", name: "Red & Dark Blue Premium Peplum Aari Pattu Pavadai", price: "₹1,849", originalPrice: "₹3,699", image: "/images/Untitled design (21).png", tag: "Premium", rating: 4.8, reviews: 98, blurb: "Premium peplum style pattu pavadai in striking red and dark blue.", accent: "#B38B00" },
    { id: "CPM_0196", name: "Lavender & Purple Overcoat Kanchi Soft Silk", price: "₹1,399", originalPrice: "₹2,799", image: "/images/Untitled design (22).png", tag: "Soft Silk", rating: 4.7, reviews: 85, blurb: "Elegant lavender and purple soft silk pavadai with a stylish overcoat.", accent: "#a855f7" },
    { id: "CPM_0374", name: "Golden Red Premium Aari Work Peplum", price: "₹2,499", originalPrice: "₹4,999", image: "/images/Untitled design (23).png", tag: "Exclusive", rating: 5.0, reviews: 45, blurb: "Exquisite golden red peplum pattu pavadai with heavy aari work.", accent: "#ffeb3b" },
    { id: "CPM_0359", name: "Peach and Brown Aari Pattu Pavadai", price: "₹2,399", originalPrice: "₹4,799", image: "/images/Untitled design (24).png", tag: "New Arrival", rating: 4.6, reviews: 32, blurb: "Subtle peach and brown combination with delicate aari embroidery.", accent: "#d2691e" },
    { id: "CPM_0349", name: "Gold and Red Premium Banarasi Tissue Silk", price: "₹2,799", originalPrice: "₹5,599", image: "/images/Untitled design (25).png", tag: "Banarasi", rating: 4.9, reviews: 67, blurb: "Luxurious gold and red Banarasi tissue silk for grand occasions.", accent: "#ffd700" },
    { id: "CPM_0525", name: "Malligai - White & Green Semi Kanchi Silk", price: "₹2,599", originalPrice: "₹5,199", image: "/images/Untitled design (26).png", tag: "Traditional", rating: 4.8, reviews: 54, blurb: "Classic white and green semi Kanchi silk with peplum top.", accent: "#006400" },
    { id: "CPM_0308", name: "Green & Lavender Kanchi Silk Pattu Pavadai", price: "₹1,249", originalPrice: "₹2,499", image: "/images/Untitled design (27).png", tag: "Kanchi Silk", rating: 4.5, reviews: 112, blurb: "Vibrant green and lavender combination in authentic Kanchi silk.", accent: "#4C0013" },
    { id: "CPM_0508", name: "Bottle Green & Magenta Kanchi Soft Silk", price: "₹1,899", originalPrice: "₹3,799", image: "/images/Untitled design (28).png", tag: "Trending", rating: 4.7, reviews: 88, blurb: "Stunning bottle green and magenta soft silk set with aari work.", accent: "#8b008b" },
    { id: "CPM_0433", name: "Navy & Aqua - Lakshmi Devi Pendant Aari", price: "₹2,399", originalPrice: "₹4,799", image: "/images/Untitled design (29).png", tag: "Devine", rating: 4.9, reviews: 76, blurb: "Navy and aqua pavadai featuring a Lakshmi Devi pendant design.", accent: "#000080" },
    { id: "CPM_0311", name: "Muzhumathi - Purple & Lavender Aari Work", price: "₹2,199", originalPrice: "₹4,399", image: "/images/Untitled design (30).png", tag: "Artisan", rating: 4.8, reviews: 65, blurb: "Detailed purple and lavender aari work pattu pavadai.", accent: "#9370db" },
    { id: "CPM_0427", name: "Red & Navy Aari Work Pattu Pavadai Set", price: "₹2,199", originalPrice: "₹4,399", image: "/images/Untitled design (31).png", tag: "Classic", rating: 4.7, reviews: 93, blurb: "Traditional red and navy combination with intricate embroidery.", accent: "#b22222" },
    { id: "CPM_0380", name: "Pink & Green Aari Work Silk Pavadai", price: "₹1,999", originalPrice: "₹3,999", image: "/images/Untitled design (32).png", tag: "Festive", rating: 4.6, reviews: 104, blurb: "Vibrant pink and green silk pavadai perfect for festivals.", accent: "#ff69b4" },
    { id: "CPM_0381", name: "Yellow & Blue Banarasi Silk Pavadai", price: "₹2,099", originalPrice: "₹4,199", image: "/images/Untitled design (33).png", tag: "Banarasi", rating: 4.8, reviews: 77, blurb: "Bright yellow and blue Banarasi silk set for a royal look.", accent: "#ffd700" },
    { id: "CPM_0382", name: "Orange & Pink Tissue Silk Pavadai", price: "₹2,299", originalPrice: "₹4,599", image: "/images/Untitled design (34).png", tag: "Tissue Silk", rating: 4.7, reviews: 59, blurb: "Shimmering orange and pink tissue silk pattu pavadai.", accent: "#ffa500" },
    { id: "CPM_0383", name: "Blue & Magenta Kanchi Silk Pavadai", price: "₹1,799", originalPrice: "₹3,599", image: "/images/Untitled design (35).png", tag: "Kanchi", rating: 4.6, reviews: 121, blurb: "Deep blue and magenta Kanchi silk pavadai with golden border.", accent: "#0000cd" },
    { id: "CPM_0384", name: "Green & Red Traditional Silk Pavadai", price: "₹1,699", originalPrice: "₹3,399", image: "/images/Untitled design (36).png", tag: "Traditional", rating: 4.5, reviews: 145, blurb: "Classic green and red silk pavadai, a south Indian staple.", accent: "#006400" },
    { id: "CPM_0385", name: "Purple & Gold Designer Pavadai", price: "₹2,599", originalPrice: "₹5,199", image: "/images/Untitled design (37).png", tag: "Designer", rating: 4.9, reviews: 40, blurb: "Exclusive purple pavadai with heavy gold designer work.", accent: "#800080" },
    { id: "CPM_0386", name: "Teal & Pink Soft Silk Pavadai", price: "₹1,599", originalPrice: "₹3,199", image: "/images/Untitled design (38).png", tag: "Soft Silk", rating: 4.7, reviews: 82, blurb: "Comfortable teal and pink soft silk pavadai for kids.", accent: "#008080" },
    { id: "CPM_0387", name: "Maroon & Gold Wedding Series Pavadai", price: "₹2,999", originalPrice: "₹5,999", image: "/images/Untitled design (39).png", tag: "Wedding", rating: 5.0, reviews: 25, blurb: "Premium maroon and gold pavadai from our wedding collection.", accent: "#800000" },
    { id: "CPM_0388", name: "Black & Red Special Edition Pavadai", price: "₹2,199", originalPrice: "₹4,399", image: "/images/Untitled design (40).png", tag: "Special", rating: 4.8, reviews: 56, blurb: "Unique black and red combination for a standout look.", accent: "#000000" },
    { id: "CPM_0389", name: "Peacock Blue & Pink Aari Pavadai", price: "₹2,399", originalPrice: "₹4,799", image: "/images/Untitled design (41).png", tag: "Aari Work", rating: 4.9, reviews: 61, blurb: "Beautiful peacock blue and pink pavadai with detailed aari work.", accent: "#1e90ff" },
    { id: "CPM_0390", name: "Cream & Maroon Temple Border Pavadai", price: "₹1,999", originalPrice: "₹3,999", image: "/images/Untitled design (42).png", tag: "Temple", rating: 4.7, reviews: 99, blurb: "Traditional cream pavadai with a maroon temple border.", accent: "#f5deb3" },
    { id: "CPM_0391", name: "Grey & Pink Contemporary Pavadai", price: "₹1,899", originalPrice: "₹3,799", image: "/images/Untitled design (43).png", tag: "Modern", rating: 4.6, reviews: 72, blurb: "Contemporary grey and pink pavadai for a modern ethnic look.", accent: "#808080" }
];

const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

export default function AboutPattupavadai({ onBack, onSelect, user, onSignOut, onShowFavorites, onShowCart, onShowOrders, favorites = [], onToggleFavorite, onAddToCart, cart = [] }) {
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState('best-selling');
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    // Add timestamp for cache busting images
    const [imgTimestamp] = useState(Date.now());

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
        let items = [...showcaseProducts];

        // 1. Availability Filter (Mock logic since all showcase items are "in stock" effectively, but we can simulate)
        if (filterAvailability === "in-stock") {
            items = items.filter(item => !item.comingSoon); // Assuming comingSoon means effectively out of stock or pre-order
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
        const getPrice = (p) => parseInt(p.price.replace(/[^0-9]/g, ''));

        switch (sortBy) {
            case 'price-low':
                items.sort((a, b) => getPrice(a) - getPrice(b));
                break;
            case 'price-high':
                items.sort((a, b) => getPrice(b) - getPrice(a));
                break;
            case 'newest':
                // Mock "newest" by id descending or just random shuffle deterministically? 
                // Let's just reverse for now as a proxy
                items.reverse();
                break;
            default: // best-selling
                // Keep original order
                break;
        }

        return items;
    }, [filterAvailability, priceRange, sortBy]);


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
                                {user?.email?.split('@')[0]}
                            </Typography>
                            <Typography sx={{ color: '#999', fontSize: '12px' }}>{user?.email}</Typography>
                        </Box>
                        <Divider />
                        <MenuItem onClick={() => { handleProfileMenuClose(); onShowOrders(); }}>
                            <ShoppingBagOutlined sx={{ fontSize: 20, mr: 2, color: luxuryColors.gold }} />
                            <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>My Orders</Typography>
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
                                    <Box sx={{ position: 'relative', pt: '120%', overflow: 'hidden' }}>
                                        <CardMedia
                                            component="img"
                                            image={`${product.image}?t=${imgTimestamp}`}
                                            alt={product.name}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'transform 0.5s ease',
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
                                            '&:hover': { transform: 'scale(1.1)' },
                                            transition: '0.2s'
                                        }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onToggleFavorite) {
                                                    const isFav = favorites.some(f => f.id === product.id);
                                                    onToggleFavorite(product);
                                                    if (!isFav) setShowWishlistMsg(true);
                                                }
                                            }}
                                        >
                                            {favorites.some(f => f.id === product.id) ? (
                                                <Favorite sx={{ fontSize: 18, color: '#d32f2f' }} />
                                            ) : (
                                                <FavoriteBorder sx={{ fontSize: 18, color: '#c2c2c2' }} />
                                            )}
                                        </Box>
                                    </Box>

                                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 1.5, pb: '12px !important' }}>
                                        {/* Brand Name */}
                                        <Typography sx={{ fontSize: '12px', color: '#878787', fontWeight: 500, mb: 0.5 }}>
                                            Kuzhavi Kids
                                        </Typography>

                                        {/* Title */}
                                        <Typography
                                            sx={{
                                                fontSize: '14px',
                                                color: '#212121',
                                                lineHeight: 1.4,
                                                mb: 0.5,
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}
                                        >
                                            {product.name}
                                        </Typography>

                                        {/* Color/Pack Info mock */}
                                        <Typography sx={{ fontSize: '12px', color: '#878787', mb: 1 }}>
                                            {product.tag}, Pack of 1
                                        </Typography>

                                        {/* Assured/Premium Badge */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                            <Box sx={{ bgcolor: '#e0e0e0', borderRadius: '4px', px: 0.5 }}>
                                                <Typography sx={{ fontSize: '10px', color: '#555', fontWeight: 700 }}>
                                                    ✓ Premium
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Price Row */}
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#212121' }}>
                                                {product.price}
                                            </Typography>
                                            <Typography sx={{ fontSize: '12px', textDecoration: 'line-through', color: '#878787' }}>
                                                {product.originalPrice}
                                            </Typography>
                                            <Typography sx={{ fontSize: '13px', color: '#388e3c', fontWeight: 700 }}>
                                                50% off
                                            </Typography>
                                        </Stack>

                                        {/* Hot Deal */}
                                        <Box sx={{ mb: 1 }}>
                                            <Typography sx={{
                                                fontSize: '10px',
                                                color: '#1a4d2e',
                                                bgcolor: '#e8f5e9',
                                                display: 'inline-block',
                                                px: 0.8,
                                                py: 0.3,
                                                borderRadius: '2px',
                                                fontWeight: 600,
                                                textTransform: 'uppercase'
                                            }}>
                                                Hot Deal
                                            </Typography>
                                        </Box>

                                        {/* Sizes */}
                                        <Typography sx={{ fontSize: '12px', color: '#212121' }}>
                                            Size <span style={{ color: '#878787' }}>0-1Y, 1-2Y, 2-3Y... +5</span>
                                        </Typography>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onAddToCart) {
                                                    const success = onAddToCart(product);
                                                    if (success) {
                                                        setShowCartMsg(true);
                                                    } else {
                                                        setShowDuplicateMsg(true);
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
                                            Add to Bag
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
                <Container maxWidth="lg">
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

            {/* WhatsApp Float */}
            <IconButton
                sx={{
                    position: 'fixed',
                    bottom: 30,
                    right: 30,
                    bgcolor: '#25D366',
                    color: 'white',
                    width: 60,
                    height: 60,
                    boxShadow: '0 10px 30px rgba(37, 211, 102, 0.3)',
                    '&:hover': { bgcolor: '#128C7E', transform: 'scale(1.1)' },
                    transition: '0.3s',
                    zIndex: 1000
                }}
                onClick={() => window.open('https://wa.me/91XXXXXXXXXX')}
            >
                <WhatsApp sx={{ fontSize: 32 }} />
            </IconButton>

            {/* Wishlist Feedback Snackbar */}
            <Snackbar
                open={showWishlistMsg}
                autoHideDuration={2000}
                onClose={() => setShowWishlistMsg(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setShowWishlistMsg(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        bgcolor: luxuryColors.gold,
                        color: 'white',
                        fontWeight: 600
                    }}
                >
                    Added to Wishlist!
                </Alert>
            </Snackbar>

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
        </Box >
    );
}

// Helper for Footer Divider to avoid conflict with Grid Divider if any
function MuiDivider(props) {
    return <Divider {...props} />;
}
