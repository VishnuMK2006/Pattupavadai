import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Container,
    Divider,
    Stack,
    Button,
    Card,
    Grid
} from '@mui/material';
import {
    ArrowBack,
    DeleteOutline,
    Security
} from '@mui/icons-material';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFBE6', // Updated to match ProductSelect
    text: '#212121',
    grey: '#878787',
    green: '#388e3c',
    blue: '#2874f0'
};

export default function CartPage({ cartItems = [], onBack, onRemove, onCheckout, onBuyNow }) {
    // Helper to calculate prices safely
    const calculatePrice = (item) => {
        if (!item.price) return 1500;
        const priceStr = String(item.price).replace(/[^0-9.]/g, '');
        return Number(priceStr) || 1500;
    };

    const calculateOriginalPrice = (item) => {
        if (!item.originalPrice) return 3999;
        const priceStr = String(item.originalPrice).replace(/[^0-9.]/g, '');
        return Number(priceStr) || 3999;
    };

    // Format price with commas for Indian locale
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + calculatePrice(item), 0);
    const totalOriginalPrice = cartItems.reduce((sum, item) => sum + calculateOriginalPrice(item), 0);
    const totalDiscount = totalOriginalPrice - totalPrice;

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: luxuryColors.ivory,
            pb: 4,
            backgroundImage: `radial-gradient(circle at 80% 0%, rgba(227, 160, 24, 0.08) 0%, transparent 50%), 
                             radial-gradient(circle at 0% 100%, rgba(179, 139, 0, 0.08) 0%, transparent 50%)`
        }}>
            {/* Header */}
            <Box sx={{
                bgcolor: 'white',
                borderBottom: '1px solid rgba(76, 0, 19, 0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <Container maxWidth="lg" sx={{ py: 2, display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={onBack} sx={{ mr: 2, color: luxuryColors.maroon }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif' }}>
                        My Shopping Bag ({cartItems.length})
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                    {/* Left Side: Cart Items */}
                    <Grid item xs={12} md={8}>
                        {cartItems.length === 0 ? (
                            <Box sx={{
                                bgcolor: 'white',
                                minHeight: '400px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                                borderRadius: '16px',
                                p: 4
                            }}>
                                <img
                                    src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
                                    alt="Empty Bag"
                                    style={{ width: '200px', marginBottom: '20px', opacity: 0.8 }}
                                />
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif' }}>Your bag is empty!</Typography>
                                <Typography sx={{ color: luxuryColors.grey, mb: 3 }}>Add items to it now.</Typography>
                                <Button
                                    variant="outlined"
                                    onClick={onBack}
                                    sx={{
                                        color: luxuryColors.maroon,
                                        borderColor: luxuryColors.maroon,
                                        borderRadius: '50px',
                                        px: 4,
                                        textTransform: 'none',
                                        fontWeight: 700,
                                        '&:hover': {
                                            bgcolor: 'rgba(76, 0, 19, 0.05)',
                                            borderColor: luxuryColors.maroon
                                        }
                                    }}
                                >
                                    Shop Now
                                </Button>
                            </Box>
                        ) : (
                            <Stack spacing={2}>
                                {cartItems.map((item, index) => {
                                    const currentPrice = calculatePrice(item);
                                    const originalPrice = calculateOriginalPrice(item);
                                    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

                                    return (
                                        <Box key={index} sx={{
                                            bgcolor: 'white',
                                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                            borderRadius: '16px',
                                            p: 3,
                                            border: '1px solid transparent',
                                            transition: 'transform 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                borderColor: 'rgba(179, 139, 0, 0.3)'
                                            }
                                        }}>
                                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                                <Box sx={{
                                                    width: 120,
                                                    height: 140,
                                                    flexShrink: 0,
                                                    alignSelf: 'center',
                                                    bgcolor: '#f8f8f8',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden'
                                                }}>
                                                    <img
                                                        src={item.preview_url || item.image || item.item?.image}
                                                        alt={item.product_name || item.name}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </Box>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography sx={{ fontWeight: 700, fontSize: '18px', mb: 0.5, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif' }}>
                                                        {item.product_name || item.name}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: '14px', color: '#878787', mb: 2 }}>
                                                        Size: {item.size || '3-4Y'}
                                                    </Typography>
                                                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                                                        <Typography sx={{ fontSize: '14px', textDecoration: 'line-through', color: '#878787', fontFamily: 'sans-serif' }}>
                                                            {formatPrice(originalPrice)}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '20px', fontWeight: 700, color: luxuryColors.text, fontFamily: 'sans-serif' }}>
                                                            {formatPrice(currentPrice)}
                                                        </Typography>
                                                        <Typography sx={{ fontSize: '14px', color: luxuryColors.green, fontWeight: 700, bgcolor: 'rgba(56, 142, 60, 0.1)', px: 1, borderRadius: '4px' }}>
                                                            {discount}% Off
                                                        </Typography>
                                                    </Stack>
                                                    <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                                                        <Button
                                                            startIcon={<DeleteOutline />}
                                                            onClick={() => onRemove(index)}
                                                            sx={{
                                                                color: '#999',
                                                                fontWeight: 600,
                                                                textTransform: 'none',
                                                                fontSize: '14px',
                                                                '&:hover': { color: '#d32f2f' }
                                                            }}
                                                        >
                                                            Remove
                                                        </Button>
                                                        <Button
                                                            variant="contained"
                                                            onClick={() => onBuyNow(item)}
                                                            sx={{
                                                                bgcolor: luxuryColors.maroon,
                                                                boxShadow: '0 4px 10px rgba(76, 0, 19, 0.2)',
                                                                textTransform: 'none',
                                                                fontWeight: 700,
                                                                fontSize: '14px',
                                                                px: 3,
                                                                borderRadius: '50px',
                                                                '&:hover': { bgcolor: '#2a000a', boxShadow: '0 6px 15px rgba(76, 0, 19, 0.3)' }
                                                            }}
                                                        >
                                                            Buy Now
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                        </Box>
                                    )
                                })}
                                <Box sx={{
                                    bgcolor: 'white',
                                    p: 3,
                                    boxShadow: '0 -10px 40px rgba(0,0,0,0.05)',
                                    position: 'sticky',
                                    bottom: 0,
                                    borderRadius: '16px 16px 0 0',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}>
                                    <Stack direction="row" justifyContent="flex-end">
                                        <Button
                                            variant="contained"
                                            onClick={onCheckout}
                                            sx={{
                                                bgcolor: luxuryColors.gold,
                                                color: 'white',
                                                px: 6,
                                                py: 1.5,
                                                fontWeight: 800,
                                                fontSize: '16px',
                                                textTransform: 'none',
                                                borderRadius: '50px',
                                                boxShadow: '0 10px 20px rgba(179, 139, 0, 0.2)',
                                                '&:hover': { bgcolor: '#C98D15', boxShadow: '0 15px 30px rgba(179, 139, 0, 0.3)' }
                                            }}
                                        >
                                            PLACE ORDER
                                        </Button>
                                    </Stack>
                                </Box>
                            </Stack>
                        )}
                    </Grid>

                    {/* Right Side: Price Details */}
                    {cartItems.length > 0 && (
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                bgcolor: 'white',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                                borderRadius: '16px',
                                overflow: 'hidden'
                            }}>
                                <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.05)', bgcolor: 'rgba(76, 0, 19, 0.02)' }}>
                                    <Typography sx={{ fontSize: '16px', fontWeight: 700, color: luxuryColors.maroon, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        Price Details
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 3 }}>
                                    <Stack spacing={2} sx={{ mb: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ fontSize: '15px', color: '#666', fontWeight: 500 }}>Price ({cartItems.length} items)</Typography>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 600, fontFamily: 'sans-serif' }}>{formatPrice(totalOriginalPrice)}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: luxuryColors.green }}>
                                            <Typography sx={{ fontSize: '15px', fontWeight: 500 }}>Discount</Typography>
                                            <Typography sx={{ fontSize: '16px', fontWeight: 600, fontFamily: 'sans-serif' }}>− {formatPrice(totalDiscount)}</Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography sx={{ fontSize: '15px', color: '#666', fontWeight: 500 }}>Delivery Charges</Typography>
                                            <Typography sx={{ fontSize: '15px', color: luxuryColors.green, fontWeight: 700 }}>FREE</Typography>
                                        </Box>
                                    </Stack>
                                    <Divider sx={{ borderStyle: 'dashed', mb: 3, borderColor: '#eee' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                        <Typography sx={{ fontSize: '18px', fontWeight: 700, color: luxuryColors.text, fontFamily: '"Playfair Display", serif' }}>Total Amount</Typography>
                                        <Typography sx={{ fontSize: '22px', fontWeight: 700, color: luxuryColors.maroon, fontFamily: 'sans-serif' }}>{formatPrice(totalPrice)}</Typography>
                                    </Box>
                                    <Typography sx={{ fontSize: '14px', color: luxuryColors.green, fontWeight: 600, bgcolor: 'rgba(56, 142, 60, 0.1)', p: 1.5, borderRadius: '8px', textAlign: 'center' }}>
                                        You will save {formatPrice(totalDiscount)} on this order
                                    </Typography>
                                </Box>
                                <Box sx={{ p: 2, bgcolor: '#fafafa', borderTop: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 1.5, color: '#666' }}>
                                    <Security fontSize="small" sx={{ color: luxuryColors.gold }} />
                                    <Typography sx={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                        Safe and Secure Payments. 100% Authentic products.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Container>
        </Box>
    );
}
