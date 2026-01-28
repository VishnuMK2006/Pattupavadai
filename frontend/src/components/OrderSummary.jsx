import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Container,
    Divider,
    Stack,
    IconButton,
    Chip,
    Paper,
    InputAdornment,
    TextField,
    Collapse
} from '@mui/material';
import {
    ArrowBack,
    Security,
    InfoOutlined,
    KeyboardArrowDown,
    KeyboardArrowUp,
    LocalShipping,
    VolunteerActivism
} from '@mui/icons-material';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFBE6',
    text: '#212121',
    grey: '#878787',
    green: '#388e3c',
    blue: '#2874f0',
    background: '#F5F5F5' // Slightly grey for contract like the image
};

export default function OrderSummary({ item, cartItems = [], onBack, onContinue }) {
    // Determine if we are processing a single item or the whole cart
    const activeItems = item ? [item] : cartItems;

    // Toggle states for Price Details dropdowns
    const [showFees, setShowFees] = useState(false);
    const [showDiscounts, setShowDiscounts] = useState(false);
    const [donation, setDonation] = useState(0);

    // Helpers
    const calculatePrice = (itm) => {
        if (!itm.price) return 1500;
        const priceStr = String(itm.price).replace(/[^0-9.]/g, '');
        return Number(priceStr) || 1500;
    };

    const calculateOriginalPrice = (itm) => {
        if (!itm.originalPrice) return 3999;
        const priceStr = String(itm.originalPrice).replace(/[^0-9.]/g, '');
        return Number(priceStr) || 3999;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    const totalPrice = activeItems.reduce((sum, i) => sum + calculatePrice(i), 0);
    const totalOriginalPrice = activeItems.reduce((sum, i) => sum + calculateOriginalPrice(i), 0);
    const totalDiscount = totalOriginalPrice - totalPrice;

    // Mock fees
    const fees = 7;
    const finalAmount = totalPrice + fees + donation;

    // Dates
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 5);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const deliveryDateStr = deliveryDate.toLocaleDateString('en-US', options);

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#F1F3F6', // Matching the greyish background from image
            pb: 8
        }}>
            {/* Header */}
            <Box sx={{
                bgcolor: 'white',
                boxShadow: '0 1px 1px rgba(0,0,0,0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <Container maxWidth="md" sx={{ py: 1.5, display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={onBack} sx={{ mr: 2, color: luxuryColors.maroon }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif' }}>
                        Order Summary
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="md" sx={{ mt: 2 }}>

                {/* Delivery Section */}
                <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 0 }}>
                    <Typography sx={{ fontSize: '16px', fontWeight: 600, mb: 0.5 }}>
                        Delivery by {deliveryDateStr}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {activeItems.slice(0, 3).map((itm, idx) => (
                            <Box key={idx}
                                component="img"
                                src={itm.preview_url || itm.image}
                                sx={{ width: 48, height: 48, objectFit: 'cover', borderRadius: '4px', border: '1px solid #eee' }}
                            />
                        ))}
                        {activeItems.length > 3 && (
                            <Box sx={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f0f0f0', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                +{activeItems.length - 3}
                            </Box>
                        )}
                    </Box>
                </Paper>

                {/* Open Box Delivery Banner */}
                <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: 0, bgcolor: '#FFFBE6' }}>
                    <Stack direction="row" alignItems="flex-start" spacing={2}>
                        <Box sx={{ bgcolor: '#FFC107', p: 0.5, borderRadius: '4px', display: 'flex' }}>
                            <LocalShipping sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '14px', color: '#B38B00' }}>
                                Rest assured with Open Box Delivery
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: '#666', mt: 0.5, lineHeight: 1.4 }}>
                                Delivery agent will open the package so you can check for correct product, damage or missing items. Share OTP to accept the delivery.
                                <span style={{ color: '#2874F0', fontWeight: 600, marginLeft: '4px', cursor: 'pointer' }}>Why?</span>
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>



                {/* Price Details */}
                <Paper elevation={0} sx={{ borderRadius: 0 }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid #f0f0f0' }}>
                        <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#878787', textTransform: 'uppercase' }}>
                            Price Details
                        </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ fontSize: '14px' }}>MRP</Typography>
                                <Typography sx={{ fontSize: '14px' }}>{formatPrice(totalOriginalPrice)}</Typography>
                            </Box>

                            {/* Fees Dropdown */}
                            <Box sx={{ cursor: 'pointer' }} onClick={() => setShowFees(!showFees)}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '14px' }}>Fees</Typography>
                                        {showFees ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                                    </Box>
                                    <Typography sx={{ fontSize: '14px' }}>{formatPrice(fees)}</Typography>
                                </Box>
                                <Collapse in={showFees}>
                                    <Typography sx={{ fontSize: '12px', color: '#878787', ml: 1, mt: 0.5 }}>
                                        Platform Fee: {formatPrice(fees)}
                                    </Typography>
                                </Collapse>
                            </Box>

                            {/* Discounts Dropdown */}
                            <Box sx={{ cursor: 'pointer' }} onClick={() => setShowDiscounts(!showDiscounts)}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: luxuryColors.green }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Typography sx={{ fontSize: '14px' }}>Discounts</Typography>
                                        {showDiscounts ? <KeyboardArrowUp fontSize="small" /> : <KeyboardArrowDown fontSize="small" />}
                                    </Box>
                                    <Typography sx={{ fontSize: '14px' }}>-{formatPrice(totalDiscount)}</Typography>
                                </Box>
                                <Collapse in={showDiscounts}>
                                    <Typography sx={{ fontSize: '12px', color: luxuryColors.green, ml: 1, mt: 0.5 }}>
                                        Product Discount: -{formatPrice(totalDiscount)}
                                    </Typography>
                                </Collapse>
                            </Box>

                            {donation > 0 && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: '14px' }}>Donation</Typography>
                                    <Typography sx={{ fontSize: '14px' }}>{formatPrice(donation)}</Typography>
                                </Box>
                            )}
                        </Stack>

                        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>Total Amount</Typography>
                            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>{formatPrice(finalAmount)}</Typography>
                        </Box>

                        <Box sx={{ bgcolor: 'rgba(56, 142, 60, 0.1)', p: 1.5, mt: 2, borderRadius: '4px' }}>
                            <Typography sx={{ fontSize: '14px', color: luxuryColors.green, fontWeight: 700, textAlign: 'center' }}>
                                You'll save {formatPrice(totalDiscount)} on this order!
                            </Typography>
                        </Box>
                    </Box>
                </Paper>

                <Typography sx={{ fontSize: '12px', color: '#878787', mt: 3, mb: 10, px: 2, lineHeight: 1.5, textAlign: 'center' }}>
                    By continuing with the order, you confirm that you are above 18 years of age, and you agree to the Kuzhavi's Terms of Use and Privacy Policy.
                </Typography>
            </Container>

            {/* Bottom Bar */}
            <Box sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                bgcolor: 'white',
                boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
                p: 2,
                zIndex: 100
            }}>
                <Container maxWidth="md">
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography sx={{ fontSize: '20px', fontWeight: 700 }}>{formatPrice(finalAmount)}</Typography>
                            <Typography sx={{ fontSize: '12px', color: luxuryColors.blue, fontWeight: 600, cursor: 'pointer' }}>View Price Details</Typography>
                        </Box>
                        <Button
                            variant="contained"
                            onClick={onContinue}
                            sx={{
                                bgcolor: '#FFC200',
                                color: 'black',
                                px: 6,
                                py: 1.5,
                                fontWeight: 600,
                                fontSize: '16px',
                                textTransform: 'none',
                                borderRadius: '2px', // Square-ish like the image
                                width: { xs: '50%', sm: 'auto' },
                                boxShadow: 'none',
                                '&:hover': { bgcolor: '#FFD54F' }
                            }}
                        >
                            Continue
                        </Button>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
