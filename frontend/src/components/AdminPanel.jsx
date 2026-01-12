import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Stack,
    Card,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    IconButton,
} from '@mui/material';
import { CloudUpload, AutoGraph, Logout, Visibility, Dashboard as DashboardIcon } from '@mui/icons-material';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AdminPanel = ({ onSignOut }) => {
    const [tabValue, setTabValue] = useState(0); // 0: Analysis, 1: Orders
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    // Orders State
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        if (tabValue === 1) {
            fetchOrders();
        }
    }, [tabValue]);

    const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
            const response = await fetch(`${API_BASE}/admin/orders`);
            if (!response.ok) throw new Error('Failed to fetch orders');
            const data = await response.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoadingOrders(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
                setResults(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async (imageToAnalyze = null) => {
        const targetImage = imageToAnalyze || previewUrl;
        if (!targetImage) return;

        setAnalyzing(true);
        try {
            setError(null);
            const response = await fetch(`${API_BASE}/analyze-dress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: targetImage }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || 'Analysis failed');
            }

            const data = await response.json();
            if (data.analysis) {
                const parsed = typeof data.analysis === 'string' ? JSON.parse(data.analysis) : data.analysis;
                setResults(parsed);
            }
        } catch (error) {
            console.error("Analysis failed", error);
            setError(error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleOrderAnalysis = async (orderId, itemIndex, imageName) => {
        // Use relative path so it fetches from the frontend origin where public/images is served
        const imageUrl = `/images/orders/${orderId}_${itemIndex}.png`;
        console.log("Analyzing order image:", imageUrl);
        
        setTabValue(0); 
        setResults(null); 
        setError(null);
        setPreviewUrl(null); 
        
        try {
            setAnalyzing(true);
            const response = await fetch(imageUrl);
            
            if (!response.ok) {
                console.error("Failed to fetch image from:", imageUrl);
                throw new Error(`Image not found at ${imageUrl}. Please check if the file exists in frontend/public/images/orders/`);
            }
            
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result;
                setPreviewUrl(base64data);
                handleAnalyze(base64data);
            };
            reader.readAsDataURL(blob);
        } catch (err) {
            console.error("Order analysis error:", err);
            setError(err.message);
            setAnalyzing(false);
        }
    };

    return (
        <Box className="app-shell" sx={{ height: '100vh', p: 4, overflowY: 'auto' }}>
            <Box sx={{ maxWidth: 1400, margin: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, mt: 2 }}>
                    <Box>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'rgba(255,255,255,0.5)',
                                textTransform: 'uppercase',
                                letterSpacing: 2,
                                fontWeight: 700
                            }}
                        >
                            System Administrator
                        </Typography>
                        <Typography variant="h3" fontWeight={800} sx={{ color: 'white', letterSpacing: -1 }}>
                            Admin <span style={{ color: '#60a5fa' }}>Portal</span>
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<Logout />}
                        onClick={onSignOut}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.2)',
                            borderRadius: '12px',
                            px: 3,
                            '&:hover': { borderColor: '#f87171', color: '#f87171', background: 'rgba(248, 113, 113, 0.05)' }
                        }}
                    >
                        Sign Out
                    </Button>
                </Box>

                <Tabs 
                    value={tabValue} 
                    onChange={(e, v) => setTabValue(v)} 
                    sx={{ 
                        mb: 4,
                        '& .MuiTab-root': { color: 'rgba(255,255,255,0.6)', fontWeight: 700 },
                        '& .Mui-selected': { color: '#60a5fa !important' },
                        '& .MuiTabs-indicator': { backgroundColor: '#60a5fa' }
                    }}
                >
                    <Tab icon={<AutoGraph />} label="Image Analysis" iconPosition="start" />
                    <Tab icon={<DashboardIcon />} label="Orders Dashboard" iconPosition="start" />
                </Tabs>

                {tabValue === 0 && (
                    <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', animation: 'fadeIn 0.5s ease-out' }}>
                        {/* Left Side: Upload and Image Preview */}
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 4,
                                background: 'rgba(30, 41, 59, 0.4)',
                                backdropFilter: 'blur(20px)',
                                color: 'white',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '24px',
                                minHeight: '500px'
                            }}
                        >
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Upload Dress</Typography>

                            <Box
                                sx={{
                                    textAlign: 'center',
                                    border: '2px dashed rgba(255,255,255,0.1)',
                                    py: previewUrl ? 2 : 10,
                                    borderRadius: '16px',
                                    background: 'rgba(255,255,255,0.02)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': { background: 'rgba(255,255,255,0.04)', borderColor: '#60a5fa' }
                                }}
                            >
                                <input
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    id="dress-upload"
                                    type="file"
                                    onChange={handleImageChange}
                                />
                                {!previewUrl && (
                                    <label htmlFor="dress-upload">
                                        <Button
                                            variant="soft"
                                            component="span"
                                            sx={{
                                                background: 'rgba(96, 165, 250, 0.1)',
                                                color: '#60a5fa',
                                                py: 2, px: 4,
                                                borderRadius: '12px',
                                                fontWeight: 700,
                                                '&:hover': { background: 'rgba(96, 165, 250, 0.2)' }
                                            }}
                                        >
                                            Browse Files
                                        </Button>
                                        <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255,255,255,0.4)' }}>
                                            JPG, PNG or WEBP (Max 10MB)
                                        </Typography>
                                    </label>
                                )}

                                {previewUrl && (
                                    <Box sx={{ p: 2, position: 'relative' }}>
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            style={{
                                                maxWidth: '100%',
                                                maxHeight: '600px',
                                                borderRadius: '12px',
                                                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                                            }}
                                        />
                                        <label htmlFor="dress-upload">
                                            <Button
                                                variant="text"
                                                component="span"
                                                size="small"
                                                sx={{ color: '#60a5fa', mt: 2, textTransform: 'none', fontWeight: 600 }}
                                            >
                                                Change Image
                                            </Button>
                                        </label>
                                    </Box>
                                )}
                            </Box>

                            {previewUrl && (
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => handleAnalyze()}
                                    disabled={analyzing}
                                    sx={{
                                        mt: 4,
                                        py: 2,
                                        borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #60a5fa, #38bdf8)',
                                        color: '#0f172a',
                                        fontWeight: 800,
                                        fontSize: '1rem',
                                        textTransform: 'none',
                                        '&:hover': { transform: 'scale(1.02)' }
                                    }}
                                >
                                    {analyzing ? (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <CircularProgress size={20} color="inherit" />
                                            <span>Processing with AI...</span>
                                        </Box>
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AutoGraph />
                                            <span>Analyse Dress Features</span>
                                        </Box>
                                    )}
                                </Button>
                            )}

                            {error && (
                                <Box
                                    sx={{
                                        mt: 2,
                                        p: 2,
                                        borderRadius: '12px',
                                        background: 'rgba(248, 113, 113, 0.1)',
                                        border: '1px solid rgba(248, 113, 113, 0.2)',
                                        color: '#f87171'
                                    }}
                                >
                                    <Typography variant="body2" fontWeight={600}>Error: {error}</Typography>
                                </Box>
                            )}
                        </Paper>

                        {/* Right Side: Results Panel */}
                        <Box sx={{ width: '450px' }}>
                            {results ? (
                                <Stack spacing={3}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 4,
                                            background: 'rgba(30, 41, 59, 0.4)',
                                            backdropFilter: 'blur(20px)',
                                            color: 'white',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: '24px'
                                        }}
                                    >
                                        <Typography variant="h5" fontWeight={700} sx={{ mb: 4, color: '#38bdf8' }}>Analysis Results</Typography>

                                        <Stack spacing={2.5}>
                                            {Object.entries(results).map(([key, value]) => (
                                                <Card key={key} sx={{
                                                    p: 2.5,
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid rgba(255,255,255,0.05)',
                                                    borderRadius: '16px',
                                                    transition: 'all 0.2s ease',
                                                    '&:hover': { background: 'rgba(255,255,255,0.06)' }
                                                }}>
                                                    <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: 1.5, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
                                                        {key.replace(/_/g, ' ')}
                                                    </Typography>
                                                    <Typography variant="body1" sx={{ mt: 1, fontWeight: 500, color: 'white', fontSize: '1.1rem' }}>
                                                        {value || 'N/A'}
                                                    </Typography>
                                                </Card>
                                            ))}
                                        </Stack>
                                    </Paper>

                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: '16px',
                                            background: 'rgba(34, 197, 94, 0.05)',
                                            border: '1px solid rgba(34, 197, 94, 0.1)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2
                                        }}
                                    >
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                                        <Typography variant="body2" sx={{ color: '#22c55e', fontWeight: 600 }}>
                                            Analysis complete
                                        </Typography>
                                    </Box>
                                </Stack>
                            ) : (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: '500px',
                                        background: 'rgba(30, 41, 59, 0.2)',
                                        border: '2px dashed rgba(255,255,255,0.05)',
                                        borderRadius: '24px',
                                        color: 'rgba(255,255,255,0.2)'
                                    }}
                                >
                                    <AutoGraph sx={{ fontSize: 60, mb: 2, opacity: 0.1 }} />
                                    <Typography variant="h6" fontWeight={500}>Waiting for Analysis</Typography>
                                    <Typography variant="body2" sx={{ textAlign: 'center', maxWidth: 300, mt: 1 }}>
                                        The extracted features will appear here after you click the analyse button.
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    </Box>
                )}

                {tabValue === 1 && (
                    <Box sx={{ animation: 'fadeIn 0.5s ease-out' }}>
                        <TableContainer component={Paper} sx={{ 
                            background: 'rgba(30, 41, 59, 0.4)', 
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '24px',
                            overflow: 'hidden'
                        }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ background: 'rgba(255,255,255,0.05)' }}>
                                    <TableRow>
                                        <TableCell sx={{ color: '#60a5fa', fontWeight: 700 }}>Order ID</TableCell>
                                        <TableCell sx={{ color: '#60a5fa', fontWeight: 700 }}>Date</TableCell>
                                        <TableCell sx={{ color: '#60a5fa', fontWeight: 700 }}>Customer</TableCell>
                                        <TableCell sx={{ color: '#60a5fa', fontWeight: 700 }}>Items / Design Details</TableCell>
                                        <TableCell sx={{ color: '#60a5fa', fontWeight: 700 }}>Amount</TableCell>
                                        <TableCell sx={{ color: '#60a5fa', fontWeight: 700 }} align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loadingOrders ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                                <CircularProgress sx={{ color: '#60a5fa' }} />
                                                <Typography sx={{ mt: 2, color: 'rgba(255,255,255,0.5)' }}>Loading orders...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                                <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No orders found.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.map((order) => (
                                            <TableRow key={order._id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.02)' } }}>
                                                <TableCell sx={{ color: 'white', fontWeight: 500 }}>
                                                    #{order._id.slice(-6).toUpperCase()}
                                                </TableCell>
                                                <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                                    {new Date(order.order_date).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white' }}>
                                                    {order.user_email}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white' }}>
                                                    {order.items.map((item, idx) => (
                                                        <Box key={idx} sx={{ mb: 2, p: 2, background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                            <Typography variant="body2" fontWeight={700} color="#38bdf8">{item.product_name}</Typography>
                                                            <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.5)' }}>
                                                                Fabric: {item.fabric_type} | Top: {item.top_style} | Bottom: {item.bottom_style}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.5)' }}>
                                                                Colors: {item.top_color} / {item.bottom_color}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.5)' }}>
                                                                Sleeve: {item.sleeve_type} | Neck: {item.neck_design} | Border: {item.border_design}
                                                            </Typography>
                                                        </Box>
                                                    ))}
                                                </TableCell>
                                                <TableCell sx={{ color: '#22c55e', fontWeight: 700 }}>
                                                    ₹{order.total_amount}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {order.items.map((item, idx) => (
                                                        <Button
                                                            key={idx}
                                                            size="small"
                                                            variant="soft"
                                                            startIcon={<AutoGraph />}
                                                            onClick={() => handleOrderAnalysis(order._id, idx, item.image_name)}
                                                            disabled={analyzing}
                                                            sx={{
                                                                mb: 1,
                                                                background: 'rgba(96, 165, 250, 0.1)',
                                                                color: '#60a5fa',
                                                                textTransform: 'none',
                                                                fontWeight: 700,
                                                                '&:hover': { background: 'rgba(96, 165, 250, 0.2)' }
                                                            }}
                                                        >
                                                            Analyze Design {idx + 1}
                                                        </Button>
                                                    ))}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default AdminPanel;
