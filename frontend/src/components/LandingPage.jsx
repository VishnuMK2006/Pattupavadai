import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Container,
    Dialog,
    Stack,
    Button,
    Grid,
    Paper,
    Divider,
    TextField,
    InputAdornment,
    Badge,
    Avatar
} from '@mui/material';
import {
    FavoriteBorder,
    ShoppingBagOutlined,
    Person,
    Search,
    WhatsApp,
    Star,
    PlayCircleOutline,
    ArrowForwardIos,
    Instagram,
    Facebook,
    Pinterest,
    LocalOfferOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import AuthForm from './AuthForm';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    mustard: '#E3A018',
    ivory: '#FFFBE6', // Warm Golden Ivory
    dark: '#1A0006',
    goldLight: '#D4AF37'
};

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function LandingPage({ onAuthSuccess, user, onGoToApp, products = [] }) {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const navOpacity = useTransform(scrollYProgress, [0, 100], [1, 0.95]);

    const handleProtectedAction = (e) => {
        if (e) e.preventDefault();
        if (user) {
            onGoToApp?.();
        } else {
            setIsLoginOpen(true);
        }
    };

    const categories = [
        'Pattu Pavadai', 'Ethnic Gowns', 'Aari Work', 'Party Frocks', 'Budget Friendly', 'Ready to Dispatch'
    ];

    const bestSellers = products && products.length > 0 ? products.slice(0, 4).map(p => ({
        id: p._id,
        title: p.name,
        price: `₹${p.price}`,
        img: p.card_image
    })) : [];

    const videoShorts = [
        { id: 1, src: '/short_videos/v1.mp4', title: 'Silk Glow' },
        { id: 2, src: '/short_videos/v2.mp4', title: 'Designer Fit' },
        { id: 3, src: '/short_videos/v3.mp4', title: 'Zari Details' },
        { id: 4, src: '/short_videos/v6.mp4', title: 'Festive Joy' }
    ];

    return (
        <Box sx={{
            flexGrow: 1,
            bgcolor: luxuryColors.ivory,
            minHeight: '100vh',
            overflowX: 'hidden',
            backgroundImage: `radial-gradient(circle at 80% 0%, rgba(227, 160, 24, 0.08) 0%, transparent 50%), 
                             radial-gradient(circle at 0% 100%, rgba(179, 139, 0, 0.08) 0%, transparent 50%)`
        }}>
            {/* Announcement Bar */}
            <Box sx={{ bgcolor: luxuryColors.maroon, py: 1, textAlign: 'center' }}>
                <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 700, letterSpacing: '2px' }}>
                    FREE SHIPPING ON ALL DOMESTIC ORDERS ABOVE ₹5000 • SHOP NOW
                </Typography>
            </Box>

            {/* Main Header */}
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: 'white',
                    color: luxuryColors.maroon,
                    borderBottom: `1px solid rgba(76, 0, 19, 0.05)`,
                    zIndex: 1100
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 }, py: 1 }}>
                    {/* Left: Logo */}
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
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
                                placeholder="Search ethnic wear..."
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
                        <Button
                            onClick={handleProtectedAction}
                            sx={{
                                color: luxuryColors.maroon,
                                fontWeight: 800,
                                fontSize: '13px',
                                letterSpacing: '1px',
                                border: `1.5px solid ${luxuryColors.maroon}`,
                                px: 3,
                                borderRadius: '50px',
                                '&:hover': {
                                    bgcolor: luxuryColors.maroon,
                                    color: 'white'
                                }
                            }}
                        >
                            {user ? 'ENTER APP' : 'SIGN IN'}
                        </Button>
                    </Stack>
                </Toolbar>

                {/* Category Bar */}
                <Box sx={{
                    display: { xs: 'none', md: 'flex' },
                    justifyContent: 'center',
                    gap: 6,
                    py: 1.5,
                    borderTop: '1px solid rgba(0,0,0,0.03)'
                }}>
                    {categories.map((cat) => (
                        <Typography
                            key={cat}
                            onClick={handleProtectedAction}
                            sx={{
                                fontSize: '12px',
                                fontWeight: 700,
                                letterSpacing: '1px',
                                color: luxuryColors.maroon,
                                cursor: 'pointer',
                                position: 'relative',
                                '&:hover': { color: luxuryColors.gold },
                                '&:after': {
                                    content: '""',
                                    position: 'absolute',
                                    bottom: -4,
                                    left: 0,
                                    width: 0,
                                    height: '1.5px',
                                    bgcolor: luxuryColors.gold,
                                    transition: '0.3s'
                                },
                                '&:hover:after': { width: '100%' }
                            }}
                        >
                            {cat.toUpperCase()}
                        </Typography>
                    ))}
                </Box>
            </AppBar>

            {/* Hero Banner Section */}
            <Box sx={{ position: 'relative', height: '85vh', overflow: 'hidden' }}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                >
                    <source src="/short_videos/v4.mp4" type="video/mp4" />
                </video>
                <Box sx={{
                    position: 'absolute',
                    inset: 0,
                    bgcolor: 'rgba(26, 0, 6, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: 'white',
                    p: 4
                }}>
                    <MotionTypography
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        variant="h1"
                        sx={{
                            fontFamily: '"Playfair Display", serif',
                            fontSize: { xs: '3rem', md: '6rem' },
                            fontWeight: 900,
                            mb: 2
                        }}
                    >
                        Little Heirlooms,<br />Infinite Love.
                    </MotionTypography>
                    <Typography sx={{ fontSize: '18px', mb: 4, letterSpacing: '3px', fontWeight: 300 }}>
                        TRADITIONAL CRAFT REIMAGINED FOR TOMORROW
                    </Typography>

                </Box>
                {/* Decorative Scroll Down Indication */}
                <MotionBox
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', color: 'white', opacity: 0.6 }}
                >
                    <Typography sx={{ fontSize: '10px', letterSpacing: '4px', fontWeight: 800 }}>SCROLL</Typography>
                </MotionBox>
            </Box>

            {/* Horizontal Scroll Featured Collections */}
            <Container maxWidth={false} sx={{ mt: -6, position: 'relative', zIndex: 10, px: { xs: 2, md: 10 } }}>
                <Grid container spacing={8} sx={{ display: 'flex' }}>
                    {[
                        { title: 'New Arrivals', img: '/images/Untitled design (28).png' },
                        { title: 'Bestsellers', img: '/images/Untitled design (43).png' },
                        { title: 'Artisan Picks', img: '/images/Untitled design (40).png' },
                        { title: 'Heritage Edit', img: '/images/Untitled design (39).png' }
                    ].map((item, idx) => (
                        <Grid item xs={6} sx={{ display: 'flex', width: { md: '20%' }, flex: { md: '0 0 20%' } }} key={idx}>
                            <Paper
                                elevation={0}
                                onClick={handleProtectedAction}
                                sx={{
                                    height: '300px',
                                    width: '100%',
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    boxShadow: '0 30px 60px rgba(76, 0, 19, 0.08)',
                                    transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                    '&:hover': {
                                        transform: 'translateY(-12px)',
                                        boxShadow: '0 40px 80px rgba(76, 0, 19, 0.15)'
                                    },
                                    '&:hover .collection-img': {
                                        transform: 'scale(1.1)',
                                    }
                                }}
                            >
                                <Box
                                    component="img"
                                    src={item.img}
                                    className="collection-img"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: '1s cubic-bezier(0.4, 0, 0.2, 1)'
                                    }}
                                />
                                <Box sx={{
                                    position: 'absolute',
                                    inset: 0,
                                    background: 'linear-gradient(to top, rgba(26, 0, 6, 0.8), transparent 60%)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'flex-end',
                                    p: 4,
                                    color: 'white'
                                }}>
                                    <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 800 }}>{item.title}</Typography>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', opacity: 0.8 }}>EXPLORE COLLECTION —</Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Best Sellers Section */}
            {bestSellers.length > 0 && (
                <Container maxWidth="xl" sx={{ pt: 12, pb: 5, px: { xs: 2, md: 6 } }}>
                    <Box sx={{ mb: 8, textAlign: 'center' }}>
                        <Typography variant="overline" sx={{ color: luxuryColors.gold, fontWeight: 800, letterSpacing: '6px' }}>TRUSTED FAVORITES</Typography>
                        <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, fontWeight: 900, mt: 1 }}>The Best Sellers</Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {bestSellers.map((product) => (
                            <Grid item xs={6} sm={6} md={3} key={product.id}>
                                <Box onClick={handleProtectedAction} sx={{ cursor: 'pointer', height: '100%' }}>
                                    <Box sx={{
                                        height: 280, // Absolute fixed height
                                        width: '100%',
                                        borderRadius: '20px',
                                        overflow: 'hidden',
                                        mb: 2,
                                        position: 'relative',
                                        bgcolor: '#F8F8F8',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        '&:hover .quick-add': { opacity: 1, y: 0 },
                                        '&:hover img': { transform: 'scale(1.05)' }
                                    }}>
                                        <Box
                                            component="img"
                                            src={product.img}
                                            sx={{
                                                maxWidth: '100%',
                                                maxHeight: '100%',
                                                width: 'auto',
                                                height: 'auto',
                                                objectFit: 'contain',
                                                transition: '0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                                            }}
                                        />
                                        <Box className="quick-add" sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            bgcolor: 'rgba(255,255,255,0.95)',
                                            backdropFilter: 'blur(5px)',
                                            p: 2,
                                            opacity: 0,
                                            transform: 'translateY(100%)',
                                            transition: '0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }}>
                                            <Button fullWidth sx={{ color: luxuryColors.maroon, fontWeight: 800, fontSize: '12px' }}>QUICK ADD +</Button>
                                        </Box>
                                    </Box>
                                    <Box sx={{ height: 40, overflow: 'hidden', mb: 0.5 }}>
                                        <Typography sx={{ fontWeight: 700, fontSize: '15px', lineHeight: 1.3 }}>{product.title}</Typography>
                                    </Box>
                                    <Typography sx={{ color: luxuryColors.gold, fontWeight: 800 }}>{product.price}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            )}

            {/* Shop by Video Section */}
            <Box sx={{ pt: 12, pb: 2 }}>
                <Container maxWidth={false} sx={{ px: { xs: 2, md: 10 } }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
                        <Box>
                            <Typography variant="overline" sx={{ color: luxuryColors.maroon, fontWeight: 800 }}>EXPERIENCE THE FALL</Typography>
                            <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, fontWeight: 800 }}>Shop by Video</Typography>
                        </Box>
                        <Button
                            onClick={handleProtectedAction}
                            endIcon={<PlayCircleOutline />}
                            sx={{ color: luxuryColors.maroon, fontWeight: 800 }}
                        >
                            VIEW ALL VIDEOS
                        </Button>
                    </Stack>
                    <Grid container spacing={5} sx={{ display: 'flex', flexWrap: 'nowrap', overflowX: 'auto', pb: 2, '&::-webkit-scrollbar': { display: 'none' } }}>
                        {videoShorts.map((video) => (
                            <Grid item xs={8} sm={4} md={3} key={video.id} sx={{ flexShrink: 0 }}>
                                <Box sx={{
                                    height: '400px', // Slightly reduced height
                                    borderRadius: '24px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    cursor: 'pointer'
                                }}>
                                    <video autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                                        <source src={video.src} type="video/mp4" />
                                    </video>
                                    <Box sx={{
                                        position: 'absolute',
                                        bottom: 0,
                                        left: 0,
                                        right: 0,
                                        p: 2,
                                        background: 'linear-gradient(transparent, rgba(0,0,0,0.6))',
                                        color: 'white'
                                    }}>
                                        <Typography sx={{ fontWeight: 800, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>{video.title}</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Testimonials - Book View */}
            <Container maxWidth="lg" sx={{ pt: 12, pb: 20, textAlign: 'center' }}>
                <MotionBox
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: luxuryColors.gold,
                            letterSpacing: '5px',
                            fontSize: '12px',
                            fontWeight: 800,
                            mb: 2
                        }}
                    >
                        THE KUZHAVI EXPERIENCE
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontFamily: '"Playfair Display", serif',
                            color: luxuryColors.maroon,
                            mb: 8,
                            fontWeight: 900
                        }}
                    >
                        Voices from Our Tribe
                    </Typography>
                </MotionBox>
                <Grid container spacing={0} sx={{ justifyContent: 'center' }}>
                    {[
                        { name: "Ananya Iyer", text: "The pattu pavadai exceeded my expectations. The zari is so subtle yet rich. My daughter looked like a little queen on her first birthday!" },
                        { name: "Meera Krishnan", text: "Quality is unmatched. The silk feels so pure and the stitching is perfect for children's sensitive skin. Highly recommend!" },
                    ].map((item, i) => (
                        <Grid item xs={12} md={5} key={i}>
                            <MotionBox
                                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                sx={{
                                    p: 6,
                                    bgcolor: '#FFFDF9', // Parchment color
                                    border: `1.5px solid rgba(179, 139, 0, 0.3)`,
                                    borderLeft: i % 2 === 0 ? `4px solid ${luxuryColors.mustard}` : '1.5px solid rgba(179, 139, 0, 0.3)',
                                    borderRight: i % 2 !== 0 ? `4px solid ${luxuryColors.mustard}` : '1.5px solid rgba(179, 139, 0, 0.3)',
                                    borderRadius: i % 2 === 0 ? '40px 0 0 40px' : '0 40px 40px 0', // Book spread shape
                                    boxShadow: i % 2 === 0
                                        ? `-15px 15px 35px ${luxuryColors.mustard}15, -5px 5px 10px rgba(0,0,0,0.02)`
                                        : `15px 15px 35px ${luxuryColors.mustard}15, 5px 5px 10px rgba(0,0,0,0.02)`,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    textAlign: i % 2 === 0 ? 'right' : 'left',
                                    px: 8
                                }}
                            >
                                <Stack direction="row" spacing={1} justifyContent={i % 2 === 0 ? "flex-end" : "flex-start"} sx={{ mb: 3, color: luxuryColors.gold }}>
                                    {[1, 2, 3, 4, 5].map(s => <Star key={s} sx={{ fontSize: 14 }} />)}
                                </Stack>
                                <Typography sx={{
                                    fontStyle: 'italic',
                                    color: luxuryColors.maroon,
                                    mb: 3,
                                    lineHeight: 1.8,
                                    fontSize: '18px',
                                    fontFamily: '"Cormorant Garamond", serif',
                                    opacity: 0.8
                                }}>
                                    "{item.text}"
                                </Typography>
                                <Typography sx={{
                                    fontWeight: 900,
                                    fontSize: '11px',
                                    letterSpacing: '3px',
                                    color: luxuryColors.gold,
                                    textTransform: 'uppercase'
                                }}>
                                    — {item.name}
                                </Typography>
                            </MotionBox>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            {/* Heritage Banner - High Luxury */}
            <Box sx={{
                bgcolor: luxuryColors.dark,
                pt: 12,
                pb: 10,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Box sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(179, 139, 0, 0.1) 0%, transparent 70%)',
                }} />
                <Container maxWidth="md">
                    <MotionBox
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.5 }}
                    >
                        <Typography sx={{ color: luxuryColors.gold, fontStyle: 'italic', fontFamily: '"Cormorant Garamond", serif', fontSize: '32px', mb: 3 }}>
                            Tradition is not the worship of ashes,
                        </Typography>
                        <Typography variant="h2" sx={{ color: 'white', fontFamily: '"Playfair Display", serif', fontWeight: 900, mb: 4 }}>
                            But the preservation of fire.
                        </Typography>
                        <Divider sx={{ width: '60px', bgcolor: luxuryColors.gold, height: '2px', mx: 'auto', mb: 4, border: 'none' }} />
                        <Typography sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', fontSize: '13px', fontWeight: 700 }}>
                            ESTABLISHED 2026 • SOUTH INDIA
                        </Typography>
                    </MotionBox>
                </Container>
            </Box>



            {/* Footer */}
            <Box sx={{ bgcolor: luxuryColors.maroon, pt: 6, pb: 4, color: 'white' }}>
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
                                        onClick={handleProtectedAction}
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
                                        onClick={handleProtectedAction}
                                        sx={{ opacity: 0.6, fontSize: '14px', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                                    >
                                        {l}
                                    </Typography>
                                ))}
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '12px', letterSpacing: '2px' }}>NEWSLETTER</Typography>
                            <Typography sx={{ opacity: 0.6, fontSize: '14px', mb: 3 }}>Join our tribe for exclusive access and ethnic styling tips.</Typography>
                            <TextField
                                fullWidth
                                placeholder="Your Email"
                                variant="standard"
                                InputProps={{
                                    disableUnderline: false,
                                    sx: { color: 'white', '&:after': { borderColor: luxuryColors.gold } },
                                    endAdornment: <Button sx={{ color: luxuryColors.gold, fontWeight: 900 }}>JOIN</Button>
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mb: 4 }} />
                    <Typography sx={{ fontSize: '11px', textAlign: 'center', opacity: 0.4, letterSpacing: '2px' }}>
                        © 2026 KUZHAVI KIDS. CRAFTED BY TRADITION.
                    </Typography>
                </Container>
            </Box>

            {/* Login Dialog */}
            <Dialog
                open={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                maxWidth="sm"
                fullWidth={false}
                PaperProps={{
                    sx: {
                        borderRadius: '40px',
                        overflowY: 'auto',
                        maxHeight: '94vh',
                        bgcolor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        boxShadow: '0 40px 100px rgba(76, 0, 19, 0.15)',
                        border: '1px solid rgba(76, 0, 19, 0.1)',
                        m: 2
                    }
                }}
                sx={{
                    '& .MuiBackdrop-root': {
                        bgcolor: 'rgba(26, 0, 6, 0.4)',
                        backdropFilter: 'blur(8px)'
                    }
                }}
            >
                <AuthForm
                    onAuthSuccess={(data) => { setIsLoginOpen(false); onAuthSuccess(data); }}
                    onClose={() => setIsLoginOpen(false)}
                />
            </Dialog>
        </Box>
    );
}
