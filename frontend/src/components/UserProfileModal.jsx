import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Typography,
    Box,
    IconButton,
    CircularProgress,
    Alert,
    InputAdornment,
    Stack,
    Grid
} from "@mui/material";
import { Close, Person, Home, Phone, AddCircleOutline, Info } from "@mui/icons-material";
import { validateAddress } from "../utils/addressValidation";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function UserProfileModal({ open, user, onUpdate, onClose }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [form, setForm] = useState({
        name: user?.name || "",
        shippingAddress: user?.shipping_address || "",
        contactDetails: user?.contact_details?.split(',')[0] || "",
        alternativeNumber: user?.contact_details?.split(',')[1] || ""
    });

    useEffect(() => {
        if (open && user) {
            const clean = (val) => (!val || String(val).toLowerCase().includes("not provided") ? "" : val);

            const contact = clean(user.contact_details);
            const address = clean(user.shipping_address);

            const numbers = contact.split(',');

            setForm({
                name: user.name || "",
                shippingAddress: address || "",
                contactDetails: numbers[0]?.trim() || "",
                alternativeNumber: numbers[1]?.trim() || ""
            });
            setError("");
            setSuccess("");
        }
    }, [open, user]);

    const validatePhone = (num) => {
        if (!num) return true; // Optional field
        // Strip everything except digits
        const digits = num.replace(/\D/g, "");
        // If it starts with 91 and is 12 digits, strip 91
        const clean = (digits.startsWith("91") && digits.length === 12) ? digits.slice(2) : digits;
        // Check if exactly 10 digits and starts with 6,7,8,9
        const regex = /^[6-9]\d{9}$/;
        return regex.test(clean);
    };

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.shippingAddress.trim() || !form.contactDetails.trim()) {
            setError("All fields are required");
            return;
        }

        const adrVal = validateAddress(form.shippingAddress);
        if (adrVal !== "Valid Address") {
            setError(adrVal);
            return;
        }

        if (!validatePhone(form.contactDetails)) {
            setError("Contact Number must be in valid 10-digits");
            return;
        }

        if (form.alternativeNumber && !validatePhone(form.alternativeNumber)) {
            setError("Contact Number must be in valid 10-digits");
            return;
        }

        setLoading(true);
        setError("");
        setSuccess("");

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
                    name: form.name.trim(),
                    shipping_address: form.shippingAddress.trim(),
                    contact_details: finalContact
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Failed to update profile");

            setSuccess("Profile updated successfully! ✨");
            onUpdate(data.user);
            setTimeout(onClose, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: { borderRadius: '24px', p: 1 }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', position: 'relative', pt: 3 }}>
                <Typography sx={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '24px',
                    fontWeight: 900,
                    color: '#4C0013'
                }}>
                    My Details
                </Typography>
                <IconButton
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8, color: '#999' }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Typography sx={{ mb: 3, color: '#666', textAlign: 'center', fontSize: '13px' }}>
                    Manage your account and delivery information.
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '12px' }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2, borderRadius: '12px' }}>{success}</Alert>}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Box sx={{ bgcolor: 'rgba(76, 0, 19, 0.02)', p: 2, borderRadius: '16px', border: '1px solid rgba(76, 0, 19, 0.05)' }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 800, mb: 1.5, color: '#4C0013', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ fontSize: 20 }} /> Personal Information
                        </Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            placeholder="Your full name"
                            sx={inputSx}
                        />
                    </Box>

                    <Box sx={{ bgcolor: 'rgba(179, 139, 0, 0.02)', p: 2, borderRadius: '16px', border: '1px solid rgba(179, 139, 0, 0.1)' }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 800, mb: 1.5, color: '#4C0013', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Phone sx={{ fontSize: 20 }} /> Contact Management
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#999', mb: 0.5, ml: 1 }}>PRIMARY MOBILE</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={form.contactDetails}
                                    onChange={(e) => setForm({ ...form, contactDetails: e.target.value })}
                                    placeholder="9876543210"
                                    sx={inputSx}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#999', mb: 0.5, ml: 1 }}>WHATSAPP / ALT</Typography>
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={form.alternativeNumber}
                                    onChange={(e) => setForm({ ...form, alternativeNumber: e.target.value })}
                                    placeholder="Optional"
                                    sx={inputSx}
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)', p: 2, borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Typography sx={{ fontSize: "14px", fontWeight: 800, mb: 1.5, color: '#4C0013', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Home sx={{ fontSize: 20 }} /> Delivery Address
                        </Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={form.shippingAddress}
                            onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })}
                            placeholder="House No, Street, Landmark, City..."
                            sx={inputSx}
                        />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, pt: 1 }}>
                <Button
                    fullWidth
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        bgcolor: '#4C0013',
                        color: 'white',
                        py: 1.5,
                        borderRadius: '50px',
                        fontWeight: 700,
                        textTransform: 'none',
                        boxShadow: '0 10px 25px rgba(76, 0, 19, 0.2)',
                        '&:hover': { bgcolor: '#1A0006', boxShadow: '0 15px 30px rgba(76, 0, 19, 0.3)' },
                        '&:disabled': { bgcolor: 'rgba(76, 0, 19, 0.1)', color: 'rgba(0,0,0,0.3)' }
                    }}
                >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Save Changes"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: '12px',
        bgcolor: '#fcfcfc',
        fontSize: '14px',
        fontFamily: '"Outfit", sans-serif',
        transition: 'all 0.2s',
        "&:hover fieldset": { borderColor: 'rgba(76, 0, 19, 0.4)' },
        "&.Mui-focused fieldset": { borderColor: '#4C0013', borderWidth: '1.5px' }
    }
};
