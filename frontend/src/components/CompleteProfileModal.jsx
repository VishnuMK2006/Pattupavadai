import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
    InputAdornment,
    Zoom,
    Box
} from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function CompleteProfileModal({ open, user, onComplete, onSkip }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showAlt, setShowAlt] = useState(false);
    const [form, setForm] = useState({
        shippingAddress: "",
        contactDetails: "",
        alternativeNumber: ""
    });

    // Indian Phone Validation: Supports +91XXXXXXXXXX, 0XXXXXXXXXX, or XXXXXXXXXX
    const validatePhone = (phone) => {
        const cleaned = phone.replace(/[\s\-()]/g, '');
        return /^(\+91|0)?[6-9]\d{9}$/.test(cleaned);
    };

    const isFormValid =
        form.shippingAddress.trim().length > 5 &&
        validatePhone(form.contactDetails) &&
        (!form.alternativeNumber || validatePhone(form.alternativeNumber));

    const handleSubmit = async () => {
        if (!isFormValid) {
            setError("Please provide a valid shipping address and an Indian contact number.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const finalContact = form.alternativeNumber.trim()
                ? `${form.contactDetails.trim()}, ${form.alternativeNumber.trim()}`
                : form.contactDetails.trim();

            const encodedEmail = encodeURIComponent(user.email);
            const tokenParam = user.token ? `&token=${user.token}` : "";

            const response = await fetch(`${API_BASE}/auth/update-profile?email=${encodedEmail}${tokenParam}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: user.name || "Valued Customer",
                    shipping_address: form.shippingAddress,
                    contact_details: finalContact
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                let msg = "Failed to update profile";
                if (data.detail) {
                    if (typeof data.detail === 'string') msg = data.detail;
                    else if (Array.isArray(data.detail)) msg = data.detail.map(e => e.msg).join(", ");
                    else msg = JSON.stringify(data.detail);
                }
                throw new Error(msg);
            }

            onComplete(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '24px',
                    p: 1,
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
                }
            }}
        >
            <DialogTitle sx={{
                fontFamily: '"Playfair Display", serif',
                fontSize: '20px',
                fontWeight: 900,
                color: '#4C0013',
                textAlign: 'center',
                pb: 1
            }}>
                Complete Your Profile
            </DialogTitle>
            <DialogContent sx={{ pb: 1 }}>
                <Typography sx={{ mb: 2, color: '#666', textAlign: 'center', fontSize: '13px', lineHeight: 1.4 }}>
                    Provide your shipping details for faster checkout later.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2, py: 0, fontSize: '12px' }}>{error}</Alert>}

                <Typography sx={{ fontSize: "13px", fontWeight: 700, mb: 0.5, color: '#4C0013' }}>Contact Number</Typography>
                {form.contactDetails.length > 0 && !validatePhone(form.contactDetails) && (
                    <Typography sx={{ color: '#d32f2f', fontSize: '11px', fontWeight: 600, mb: 0.5, display: 'flex', alignItems: 'center' }}>
                        ⚠ Please enter valid 10 digits
                    </Typography>
                )}
                <TextField
                    fullWidth
                    size="small"
                    error={form.contactDetails.length > 0 && !validatePhone(form.contactDetails)}
                    placeholder="e.g. 98765 43210"
                    value={form.contactDetails}
                    onChange={(e) => setForm({ ...form, contactDetails: e.target.value })}
                    sx={{
                        mb: 1,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: '10px',
                            bgcolor: '#fcfcfc',
                            fontSize: '14px'
                        }
                    }}
                />

                {validatePhone(form.contactDetails) && !showAlt && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: -0.5 }}>
                        <Tooltip
                            title="Click to add alternate Contact number"
                            arrow
                            placement="right"
                            TransitionComponent={Zoom}
                        >
                            <Box
                                onClick={() => setShowAlt(true)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    color: '#B38B00',
                                    transition: 'all 0.2s',
                                    '&:hover': { color: '#4C0013' },
                                    '&:focus': { outline: 'none' }
                                }}
                            >
                                <AddCircleOutline sx={{ fontSize: 18, mr: 0.5 }} />
                                <Typography sx={{ fontSize: '12px', fontWeight: 700 }}>Add alternate number</Typography>
                            </Box>
                        </Tooltip>
                    </Box>
                )}

                {showAlt && (
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: "12px", fontWeight: 700, mb: 0.5, color: '#4C0013', display: 'flex', justifyContent: 'space-between' }}>
                            <span>Alternative Number</span>
                            <Typography
                                onClick={() => { setShowAlt(false); setForm({ ...form, alternativeNumber: "" }); }}
                                sx={{ fontSize: '10px', color: '#666', cursor: 'pointer', '&:hover': { color: '#4C0013' } }}
                            >
                                Remove
                            </Typography>
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Optional second number"
                            value={form.alternativeNumber}
                            onChange={(e) => setForm({ ...form, alternativeNumber: e.target.value })}
                            error={form.alternativeNumber.length > 0 && !validatePhone(form.alternativeNumber)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: '10px',
                                    bgcolor: '#fcfcfc',
                                    fontSize: '14px'
                                }
                            }}
                        />
                        {form.alternativeNumber.length > 0 && !validatePhone(form.alternativeNumber) && (
                            <Typography sx={{ color: '#d32f2f', fontSize: '10px', fontWeight: 600, mt: 0.5 }}>
                                ⚠ Invalid alternate number
                            </Typography>
                        )}
                    </Box>
                )}

                <Typography sx={{ fontSize: "13px", fontWeight: 700, mb: 0.5, color: '#4C0013' }}>Shipping Address</Typography>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Complete delivery address"
                    multiline
                    rows={2}
                    value={form.shippingAddress}
                    onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                    sx={{
                        mb: 1,
                        "& .MuiOutlinedInput-root": {
                            borderRadius: '10px',
                            bgcolor: '#fcfcfc',
                            fontSize: '14px'
                        }
                    }}
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
                <Button
                    fullWidth
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || !isFormValid}
                    sx={{
                        bgcolor: '#4C0013',
                        color: 'white',
                        py: 1,
                        borderRadius: '50px',
                        fontWeight: 700,
                        textTransform: 'none',
                        fontSize: '14px',
                        '&:hover': { bgcolor: '#1A0006' },
                        '&:disabled': {
                            bgcolor: 'rgba(76, 0, 19, 0.1)',
                            color: 'rgba(0,0,0,0.3)'
                        }
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Save Details"}
                </Button>
                <Button
                    fullWidth
                    onClick={onSkip}
                    sx={{
                        color: '#666',
                        fontWeight: 600,
                        textTransform: 'none',
                        fontSize: '13px',
                        '&:hover': { color: '#4C0013', bgcolor: 'transparent' }
                    }}
                >
                    Skip for now
                </Button>
            </DialogActions>
        </Dialog>
    );
}
