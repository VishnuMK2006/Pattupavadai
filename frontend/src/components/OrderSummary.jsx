import React, { useState, useEffect } from 'react';
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
    KeyboardArrowUp,
    KeyboardArrowDown,
    LocalShipping,
    VolunteerActivism,
    LocationOn,
    PhoneIphone,
    Edit,
    CheckCircle,
    Security
} from '@mui/icons-material';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFBE6',
    text: '#212121',
    grey: '#878787',
    green: '#388e3c',
    blue: '#2874f0',
    background: '#FFFBE6' // Match website ivory
};

export default function OrderSummary({ user, item, cartItems = [], onBack, onContinue, onUpdateUser }) {
    // Determine if we are processing a single item or the whole cart
    const activeItems = item ? [item] : cartItems;

    // Toggle states for Price Details dropdowns
    const [showFees, setShowFees] = useState(false);
    const [showDiscounts, setShowDiscounts] = useState(false);
    const [donation, setDonation] = useState(0);
    const [isEditing, setIsEditing] = useState(false);

    // Initialize with empty if it's a placeholder
    const initialAddress = user?.shipping_address?.includes("Not provided") ? "" : (user?.shipping_address || '');
    const initialContact = user?.contact_details?.includes("Not provided") ? "" : (user?.contact_details || '');

    const [editAddress, setEditAddress] = useState(initialAddress);
    const [editContact, setEditContact] = useState(initialContact);
    const [addressError, setAddressError] = useState("");
    const [contactError, setContactError] = useState("");

    useEffect(() => {
        if (!isEditing) {
            setEditAddress(initialAddress);
            setEditContact(initialContact);
            setAddressError("");
            setContactError("");
        }
    }, [user, isEditing, initialAddress, initialContact]);

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

    const isAddressMissing = !user?.shipping_address || user?.shipping_address.includes("Not provided") || user?.shipping_address.trim() === "";
    const isContactMissing = !user?.contact_details || user?.contact_details.includes("Not provided") || user?.contact_details.trim() === "";
    const isReady = !isAddressMissing && !isContactMissing;

    const handleSaveDetails = async () => {
        setAddressError("");
        setContactError("");

        if (!editAddress.trim()) {
            setAddressError("Please provide a shipping address.");
            return;
        }

        if (!editContact.trim()) {
            setContactError("Enter the valid mobile number");
            return;
        }

        if (editAddress.includes("Not provided")) {
            setAddressError("Please provide a valid address.");
            return;
        }

        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(editContact.trim())) {
            setContactError("Enter the valid mobile number");
            return;
        }

        const API_BASE = "http://localhost:8000";
        try {
            const url = `${API_BASE}/auth/update-profile?email=${encodeURIComponent(user.email)}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: user.name, // Keep existing name
                    shipping_address: editAddress,
                    contact_details: editContact
                })
            });
            if (response.ok) {
                const data = await response.json();
                onUpdateUser(data.user);
                setIsEditing(false);
            }
        } catch (err) {
            console.error("Failed to update profile:", err);
        }
    };

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: luxuryColors.background,
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
                {/* Deliver To Section */}
                <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: '8px', border: `1px solid ${isReady ? 'rgba(76, 0, 19, 0.1)' : 'rgba(211, 47, 47, 0.2)'}`, bgcolor: 'white' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                        <Typography sx={{ fontSize: '11px', fontWeight: 900, color: luxuryColors.maroon, letterSpacing: '1px' }}>
                            DELIVER TO:
                        </Typography>
                        {!isEditing && (
                            <Button
                                size="small"
                                startIcon={<Edit sx={{ fontSize: 14 }} />}
                                onClick={() => setIsEditing(true)}
                                sx={{ color: luxuryColors.maroon, textTransform: 'none', fontWeight: 700 }}
                            >
                                Change
                            </Button>
                        )}
                    </Stack>

                    {!isEditing ? (
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                                <LocationOn sx={{ color: luxuryColors.gold, fontSize: 20, mt: 0.2 }} />
                                <Box>
                                    <Typography sx={{ fontWeight: 800, fontSize: '14px', color: '#111' }}>{user?.name}</Typography>
                                    <Typography sx={{ fontSize: '14px', color: isAddressMissing ? '#d32f2f' : '#444', lineHeight: 1.4 }}>
                                        {isAddressMissing ? "Please add shipping address" : user?.shipping_address}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PhoneIphone sx={{ color: luxuryColors.gold, fontSize: 18 }} />
                                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: isContactMissing ? '#d32f2f' : '#444' }}>
                                    {isContactMissing ? "Please add contact number" : user?.contact_details}
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Stack spacing={2.5}>
                            <TextField
                                label="Full Shipping Address"
                                multiline
                                rows={2}
                                fullWidth
                                value={editAddress}
                                onChange={(e) => {
                                    setEditAddress(e.target.value);
                                    if (addressError) setAddressError("");
                                }}
                                error={!!addressError}
                                helperText={addressError}
                                sx={{ '& .MuiInputBase-root': { fontSize: '14px' } }}
                            />
                            <TextField
                                label="Contact Number"
                                fullWidth
                                value={editContact}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setEditContact(val);
                                    if (contactError) setContactError("");
                                }}
                                error={!!contactError}
                                helperText={contactError}
                                placeholder="Enter 10-digit mobile number"
                                sx={{
                                    '& .MuiInputBase-root': { fontSize: '14px' },
                                    '& .MuiFormHelperText-root': { color: '#d32f2f', fontWeight: 700 }
                                }}
                            />
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button size="small" onClick={() => setIsEditing(false)} sx={{ color: '#666', textTransform: 'none' }}>Cancel</Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={handleSaveDetails}
                                    sx={{ bgcolor: luxuryColors.maroon, px: 3, fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#2a000a' } }}
                                >
                                    Save Details
                                </Button>
                            </Stack>
                        </Stack>
                    )}
                </Paper>
                <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: '8px', bgcolor: 'white' }}>
                    <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1.5, color: '#666' }}>
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
                <Paper elevation={0} sx={{ p: 2, mb: 2, borderRadius: '12px', bgcolor: 'rgba(179, 139, 0, 0.05)', border: `1px solid rgba(179, 139, 0, 0.1)` }}>
                    <Stack direction="row" alignItems="flex-start" spacing={2}>
                        <Box sx={{ bgcolor: luxuryColors.gold, p: 0.5, borderRadius: '6px', display: 'flex' }}>
                            <LocalShipping sx={{ color: 'white', fontSize: 20 }} />
                        </Box>
                        <Box>
                            <Typography sx={{ fontWeight: 800, fontSize: '14px', color: luxuryColors.maroon, fontFamily: '"Outfit", sans-serif' }}>
                                Rest assured with Open Box Delivery
                            </Typography>
                            <Typography sx={{ fontSize: '12px', color: '#666', mt: 0.5, lineHeight: 1.5 }}>
                                Delivery agent will open the package so you can check for correct product, damage or missing items.
                                <span style={{ color: luxuryColors.blue, fontWeight: 700, marginLeft: '6px', cursor: 'pointer' }}>Learn more</span>
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>



                {/* Price Details */}
                <Paper elevation={0} sx={{ borderRadius: '12px', bgcolor: 'white', overflow: 'hidden', border: '1px solid rgba(76, 0, 19, 0.05)' }}>
                    <Box sx={{ p: 2, borderBottom: '1px solid #f8f8f8', bgcolor: 'rgba(76, 0, 19, 0.02)' }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 800, color: luxuryColors.maroon, textTransform: 'uppercase', letterSpacing: '1px' }}>
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
                        <Stack spacing={1} alignItems="flex-end">
                            <Button
                                variant="contained"
                                disabled={!isReady || isEditing}
                                onClick={onContinue}
                                sx={{
                                    bgcolor: luxuryColors.gold,
                                    color: 'white',
                                    px: 6,
                                    py: 1.5,
                                    fontWeight: 800,
                                    fontSize: '16px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '1px',
                                    borderRadius: '50px',
                                    boxShadow: '0 8px 16px rgba(179, 139, 0, 0.2)',
                                    '&:hover': { bgcolor: '#C98D15', boxShadow: '0 10px 20px rgba(179, 139, 0, 0.3)' },
                                    '&:disabled': { bgcolor: '#ccc', color: '#fff' }
                                }}
                            >
                                {isReady ? 'Continue to Payment' : 'Fill Details to Continue'}
                            </Button>
                            {!isReady && !isEditing && (
                                <Typography sx={{ fontSize: '10px', color: '#d32f2f', fontWeight: 700 }}>
                                    * Please update your address and contact number
                                </Typography>
                            )}
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        </Box>
    );
}
