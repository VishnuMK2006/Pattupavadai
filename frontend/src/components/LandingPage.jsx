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
    Divider
} from '@mui/material';
import {
    FavoriteBorder,
    ShoppingBagOutlined,
    Person,
    AutoAwesome,
    HistoryEdu,
} from '@mui/icons-material';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import AuthForm from './AuthForm';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFDF5',
    dark: '#1A0006',
    goldLight: '#D4AF37'
};

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);

export default function LandingPage({ onAuthSuccess }) {
    const [currentImage, setCurrentImage] = useState(0);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % 5);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const slideVariants = {
        enter: { opacity: 0, scale: 1.1 },
        center: { opacity: 1, scale: 1, transition: { duration: 1.2, ease: "easeOut" } },
        exit: { opacity: 0, scale: 0.9, transition: { duration: 0.8 } }
    };

    const fadeInUp = {
        initial: { y: 60, opacity: 0 },
        animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <Box sx={{ flexGrow: 1, bgcolor: luxuryColors.ivory, minHeight: '100vh', scrollBehavior: 'smooth' }}>
            {/* Navigation Bar */}
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    bgcolor: 'rgba(255, 253, 245, 0.9)',
                    backdropFilter: 'blur(10px)',
                    color: luxuryColors.maroon,
                    borderBottom: `1px solid rgba(76, 0, 19, 0.05)`,
                    zIndex: (theme) => theme.zIndex.drawer + 1
                }}
            >
                <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 8 }, minHeight: '90px !important' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 900,
                                color: luxuryColors.maroon,
                                letterSpacing: '-1.5px',
                                cursor: 'pointer',
                                fontFamily: '"Playfair Display", serif'
                            }}
                        >
                            Kuzhavi<span style={{ color: luxuryColors.gold }}>_Kids</span>
                        </Typography>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
                            {['COLLECTIONS', 'HERITAGE', 'CRAFT', 'JOURNAL'].map((item) => (
                                <Typography
                                    key={item}
                                    sx={{
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        letterSpacing: '2px',
                                        color: luxuryColors.maroon,
                                        cursor: 'pointer',
                                        '&:hover': { color: luxuryColors.gold }
                                    }}
                                >
                                    {item}
                                </Typography>
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton sx={{ color: luxuryColors.maroon }}>
                            <FavoriteBorder />
                        </IconButton>
                        <IconButton
                            onClick={() => setIsLoginOpen(true)}
                            sx={{
                                color: luxuryColors.gold,
                                bgcolor: 'rgba(179, 139, 0, 0.1)',
                                border: `1.5px solid ${luxuryColors.gold}`,
                                borderRadius: '50%',
                                p: 1,
                                transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                '&:hover': {
                                    bgcolor: 'rgba(179, 139, 0, 0.2)',
                                    transform: 'scale(1.1) rotate(5deg)',
                                    boxShadow: '0 4px 12px rgba(179, 139, 0, 0.2)'
                                }
                            }}
                        >
                            <Person sx={{ fontSize: 24 }} />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>

            <Toolbar sx={{ minHeight: '90px' }} />

            {/* Hero Section */}
            <MotionBox
                style={{ opacity, scale }}
                sx={{ px: { xs: 2, md: 4 }, py: 4 }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        height: { xs: '500px', md: '800px' },
                        width: '100%',
                        overflow: 'hidden',
                        borderRadius: '40px',
                        bgcolor: luxuryColors.dark,
                        boxShadow: '0 40px 100px rgba(0,0,0,0.2)'
                    }}
                >
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentImage}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%'
                            }}
                        >
                            {/* Carousel Layer */}
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: `linear-gradient(rgba(26,0,6,0.3), rgba(26,0,6,0.7)), url('/images/placeholder_${currentImage}.jpg') center/cover`,
                                    color: 'white',
                                    textAlign: 'center',
                                    p: 6
                                }}
                            >
                                {/* Text Overlay */}
                                <Box component={motion.div} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
                                    <Typography
                                        variant="overline"
                                        sx={{
                                            letterSpacing: '6px',
                                            color: luxuryColors.gold,
                                            fontWeight: 700,
                                            fontSize: '14px'
                                        }}
                                    >
                                        PREMIUM ETHNIC COLLECTION
                                    </Typography>
                                    <Typography
                                        variant="h1"
                                        sx={{
                                            fontFamily: '"Playfair Display", serif',
                                            fontWeight: 800,
                                            fontSize: { xs: '3.5rem', md: '7rem' },
                                            lineHeight: 1,
                                            mb: 4,
                                            mt: 2,
                                            textShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                        }}
                                    >
                                        Regal Threads for <br /> <span style={{ fontStyle: 'italic', color: luxuryColors.goldLight }}>Little Royals</span>
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setIsLoginOpen(true)}
                                        sx={{
                                            borderColor: 'white',
                                            color: 'white',
                                            px: 6,
                                            py: 2,
                                            borderRadius: '50px',
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            letterSpacing: '2px',
                                            borderWidth: '2px',
                                            '&:hover': {
                                                bgcolor: 'white',
                                                color: luxuryColors.maroon,
                                                borderColor: 'white'
                                            }
                                        }}
                                    >
                                        EXPLORE COLLECTION
                                    </Button>
                                </Box>
                            </Box>
                        </motion.div>
                    </AnimatePresence>

                    {/* Carousel Dots */}
                    <Stack
                        direction="column"
                        spacing={2}
                        sx={{
                            position: 'absolute',
                            right: 40,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 10
                        }}
                    >
                        {[0, 1, 2, 3, 4].map((i) => (
                            <Box
                                key={i}
                                onClick={() => setCurrentImage(i)}
                                sx={{
                                    width: '4px',
                                    height: currentImage === i ? '40px' : '15px',
                                    bgcolor: currentImage === i ? luxuryColors.gold : 'rgba(255,255,255,0.3)',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    transition: '0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            />
                        ))}
                    </Stack>
                </Box>
            </MotionBox>

            {/* Heritage Section */}
            <Container maxWidth="lg" sx={{ py: 15 }}>
                <Grid container spacing={10} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <MotionBox whileInView="animate" initial="initial" variants={fadeInUp}>
                            <Typography
                                variant="h6"
                                sx={{
                                    color: luxuryColors.gold,
                                    fontFamily: '"Cormorant Garamond", serif',
                                    fontStyle: 'italic',
                                    fontSize: '28px'
                                }}
                            >
                                Our Heritage
                            </Typography>
                            <Typography
                                variant="h3"
                                sx={{
                                    fontFamily: '"Playfair Display", serif',
                                    color: luxuryColors.maroon,
                                    fontWeight: 800,
                                    mb: 4,
                                    mt: 1
                                }}
                            >
                                Preserving Handwoven <br /> Craftsmanship
                            </Typography>
                            <Typography
                                sx={{
                                    color: 'rgba(76, 0, 19, 0.7)',
                                    lineHeight: 2,
                                    fontSize: '18px',
                                    fontFamily: '"Cormorant Garamond", serif',
                                    mb: 4
                                }}
                            >
                                Every piece at Kuzhavi Kids is a labor of love. We work with master weavers across South India to bring you the finest Kanchipuram silk and Banarasi weaves, reimagined for the modern child. Our Pattupavadai sets are not just clothes; they are heirlooms.
                            </Typography>
                            <Button sx={{ color: luxuryColors.maroon, fontWeight: 900, fontSize: '12px', letterSpacing: '2px' }}>
                                LEARN MORE —
                            </Button>
                        </MotionBox>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: 'relative',
                                height: '600px',
                                width: '100%',
                                borderRadius: '300px 300px 0 0',
                                bgcolor: '#F0EAD6',
                                overflow: 'hidden',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.1)'
                            }}
                        >
                            <Box
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'linear-gradient(rgba(0,0,0,0.1), rgba(0,0,0,0.4)), url("/images/heritage_place.jpg") center/cover',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Typography sx={{ opacity: 0.3, fontWeight: 900 }}>THE CRAFT</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            {/* Categories / Collections Grid */}
            <Box sx={{ bgcolor: luxuryColors.maroon, py: 15, color: 'white' }}>
                <Container maxWidth="xl">
                    <Box sx={{ textAlign: 'center', mb: 10 }}>
                        <Typography variant="overline" sx={{ letterSpacing: '4px', opacity: 0.7 }}>CURATED COLLECTIONS</Typography>
                        <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', mt: 2 }}>Timeless Traditions</Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {[
                            { title: 'Pattu Pavadai', desc: 'Silk elegance for festivities' },
                            { title: 'Ethnic Frocks', desc: 'Contemporary twist on classics' },
                            { title: 'Kurta Sets', desc: 'Dapper looks for young gents' },
                            { title: 'New Arrivals', desc: 'Fresh from our artisans' }
                        ].map((cat, i) => (
                            <Grid item xs={12} sm={6} md={3} key={cat.title}>
                                <MotionBox
                                    whileHover={{ y: -20 }}
                                    sx={{
                                        height: '500px',
                                        bgcolor: 'rgba(255,255,255,0.05)',
                                        borderRadius: '24px',
                                        p: 4,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'flex-end',
                                        cursor: 'pointer',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        position: 'relative',
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 1 }}>{cat.title}</Typography>
                                    <Typography sx={{ opacity: 0.6, fontSize: '14px' }}>{cat.desc}</Typography>
                                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
                                    <Typography sx={{ fontWeight: 800, fontSize: '12px', letterSpacing: '2px' }}>DISCOVER</Typography>
                                </MotionBox>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Craftsmanship Section */}
            <Container maxWidth="lg" sx={{ py: 15 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                    <AutoAwesome sx={{ color: luxuryColors.gold, fontSize: 40, mb: 3 }} />
                    <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, mb: 4 }}>Why Kuzhavi Kids?</Typography>
                    <Grid container spacing={6} sx={{ mt: 4 }}>
                        {[
                            { icon: <HistoryEdu />, title: 'Authentic Weaves', text: '100% genuine silk sourced from hereditary weavers.' },
                            { icon: <ShoppingBagOutlined />, title: 'Custom Fit', text: 'Tailored dimensions to ensure comfort for your little ones.' },
                            { icon: <ShoppingBagOutlined />, title: 'Global Delivery', text: 'Preserving traditions, shipping happiness worldwide.' }
                        ].map((item, i) => (
                            <Grid item xs={12} md={4} key={item.title}>
                                <Box sx={{ p: 4 }}>
                                    <Box sx={{ color: luxuryColors.gold, mb: 2 }}>{item.icon}</Box>
                                    <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', mb: 2, color: luxuryColors.maroon }}>{item.title}</Typography>
                                    <Typography sx={{ color: 'rgba(0,0,0,0.6)', lineHeight: 1.8 }}>{item.text}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>

            {/* Login Popover */}
            <Dialog
                open={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                maxWidth="xs"
                fullWidth
                scroll="body"
                PaperProps={{
                    sx: {
                        borderRadius: '40px',
                        p: 0,
                        overflow: 'hidden',
                        boxShadow: '0 50px 100px rgba(0,0,0,0.5)',
                        bgcolor: '#FFFFFF'
                    }
                }}
            >
                <Box sx={{ p: 0 }}>
                    <AuthForm onAuthSuccess={(data) => {
                        setIsLoginOpen(false);
                        onAuthSuccess(data);
                    }} />
                </Box>
            </Dialog>

            {/* Footer (Minimal) */}
            <Box sx={{ py: 6, textAlign: 'center', borderTop: '1px solid #EEE' }}>
                <Typography sx={{ fontSize: '12px', letterSpacing: '2px', opacity: 0.5 }}>
                    © 2026 KUZHAVI KIDS. ALL RIGHTS RESERVED.
                </Typography>
            </Box>
        </Box>
    );
}
