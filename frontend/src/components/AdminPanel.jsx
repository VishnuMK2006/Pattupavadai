import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Stack,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Chip,
    Grid,
    AppBar,
    Toolbar,
    Container,
    Alert,
} from '@mui/material';
import { 
    CloudUpload, 
    AutoGraph, 
    Logout, 
    Dashboard as DashboardIcon,
    ShoppingBag,
    TrendingUp,
    CheckCircle,
    Image as ImageIcon,
} from '@mui/icons-material';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AdminPanel = ({ onSignOut }) => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
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
        <Box sx={{ bgcolor: '#F2F2F2', minHeight: '100vh', fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
            {/* Navigation Bar */}
            <AppBar 
                position="sticky" 
                elevation={1}
                sx={{ 
                    bgcolor: '#2874F0',
                    borderBottom: '1px solid rgba(0,0,0,0.1)',
                }}
            >
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ 
                                width: 40, 
                                height: 40, 
                                borderRadius: 2, 
                                bgcolor: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <DashboardIcon sx={{ color: '#2874F0', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography sx={{ 
                                    color: '#FFFFFF', 
                                    fontSize: '20px', 
                                    fontWeight: 700,
                                    letterSpacing: '-0.5px',
                                    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                                }}>
                                    Kuzhavi_kids
                                </Typography>
                                <Typography sx={{ 
                                    color: 'rgba(255,255,255,0.8)', 
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                                }}>
                                    Make Everythings perfect
                                </Typography>
                            </Box>
                        </Box>
                        <Button
                            startIcon={<Logout />}
                            onClick={onSignOut}
                            sx={{
                                color: '#FFFFFF',
                                textTransform: 'none',
                                fontSize: '14px',
                                fontWeight: 600,
                                fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
                                px: 3,
                                py: 1,
                                borderRadius: 2,
                                border: '1px solid rgba(255,255,255,0.2)',
                                '&:hover': { 
                                    bgcolor: 'rgba(255,255,255,0.1)',
                                    borderColor: 'rgba(255,255,255,0.3)',
                                }
                            }}
                        >
                            Sign Out
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>

                {/* Tabs */}
                <Paper 
                    elevation={0}
                    sx={{ 
                        mb: 3,
                        bgcolor: '#ffffff',
                        border: '1px solid #e8eaed',
                        borderRadius: 3,
                        overflow: 'hidden',
                    }}
                >
                    <Tabs 
                        value={tabValue} 
                        onChange={(e, v) => setTabValue(v)} 
                        sx={{ 
                            px: 2,
                            '& .MuiTab-root': { 
                                color: '#6c757d', 
                                fontWeight: 600,
                                textTransform: 'none',
                                fontSize: '15px',
                                minHeight: '64px',
                                px: 3,
                            },
                            '& .Mui-selected': { color: '#2874F0 !important' },
                            '& .MuiTabs-indicator': { 
                                backgroundColor: '#2874F0', 
                                height: 3,
                                borderRadius: '3px 3px 0 0',
                            }
                        }}
                    >
                        <Tab icon={<AutoGraph />} label="Image Analysis" iconPosition="start" />
                        <Tab icon={<DashboardIcon />} label="Orders Dashboard" iconPosition="start" />
                    </Tabs>
                </Paper>

                {tabValue === 0 && (
                    <Grid container spacing={3} justifyContent="center">
                        {/* Upload Section */}
                        <Grid item xs={12} lg={5}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    bgcolor: '#ffffff',
                                    border: '1px solid #e8eaed',
                                    borderRadius: 3,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    mx: 'auto',
                                    maxWidth: 600,
                                }}
                            >
                                <Typography sx={{ 
                                    fontSize: '20px', 
                                    fontWeight: 700, 
                                    color: '#1a1a1a', 
                                    mb: 3,
                                    letterSpacing: '-0.5px',
                                }}>
                                    Upload Image
                                </Typography>

                                <Box
                                    sx={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '2px dashed #d0d5dd',
                                        borderRadius: 3,
                                        bgcolor: '#f5f7fa',
                                        minHeight: 400,
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            bgcolor: '#ffffff',
                                            borderColor: '#2874F0',
                                        }
                                    }}
                                >
                                    <input
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        id="dress-upload"
                                        type="file"
                                        onChange={handleImageChange}
                                    />
                                    {!previewUrl ? (
                                        <label htmlFor="dress-upload" style={{ cursor: 'pointer', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Box sx={{ textAlign: 'center', p: 4 }}>
                                                <Box sx={{ 
                                                    width: 80, 
                                                    height: 80, 
                                                    borderRadius: 3,
                                                    bgcolor: '#e3f2fd',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    margin: '0 auto',
                                                    mb: 3,
                                                }}>
                                                    <ImageIcon sx={{ fontSize: 40, color: '#2874F0' }} />
                                                </Box>
                                                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                                                    Click to upload or drag and drop
                                                </Typography>
                                                <Typography sx={{ fontSize: '13px', color: '#6c757d', mb: 3 }}>
                                                    SVG, PNG, JPG or GIF (MAX. 10MB)
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    component="span"
                                                    startIcon={<CloudUpload />}
                                                    sx={{
                                                        bgcolor: '#2874F0',
                                                        color: '#ffffff',
                                                        py: 1.5,
                                                        px: 4,
                                                        borderRadius: 2,
                                                        fontWeight: 600,
                                                        fontSize: '14px',
                                                        textTransform: 'none',
                                                        boxShadow: 'none',
                                                        '&:hover': { 
                                                            bgcolor: '#1565c0',
                                                            boxShadow: '0 4px 12px rgba(40,116,240,0.3)',
                                                        }
                                                    }}
                                                >
                                                    Choose File
                                                </Button>
                                            </Box>
                                        </label>
                                    ) : (
                                        <Box sx={{ p: 3, width: '100%', textAlign: 'center' }}>
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                style={{
                                                    maxWidth: '100%',
                                                    maxHeight: '350px',
                                                    borderRadius: '12px',
                                                    objectFit: 'contain',
                                                }}
                                            />
                                            <label htmlFor="dress-upload">
                                                <Button
                                                    component="span"
                                                    size="small"
                                                    sx={{ 
                                                        color: '#2874F0', 
                                                        mt: 2, 
                                                        textTransform: 'none', 
                                                        fontWeight: 600,
                                                        fontSize: '14px',
                                                    }}
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
                                        startIcon={analyzing ? <CircularProgress size={20} sx={{ color: '#ffffff' }} /> : <AutoGraph />}
                                        sx={{
                                            mt: 3,
                                            py: 1.5,
                                            borderRadius: 2,
                                            bgcolor: '#2874F0',
                                            color: '#ffffff',
                                            fontWeight: 600,
                                            fontSize: '15px',
                                            textTransform: 'none',
                                            boxShadow: 'none',
                                            '&:hover': { 
                                                bgcolor: '#1565c0',
                                                boxShadow: '0 4px 12px rgba(40,116,240,0.3)',
                                            },
                                            '&:disabled': {
                                                bgcolor: '#e8eaed',
                                                color: '#6c757d',
                                            }
                                        }}
                                    >
                                        {analyzing ? 'Analyzing...' : 'Analyze Dress Features'}
                                    </Button>
                                )}

                                {error && (
                                    <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                                        {error}
                                    </Alert>
                                )}
                            </Paper>
                        </Grid>

                        {/* Results Section */}
                        <Grid item xs={12} lg={7}>
                            {results ? (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 4,
                                        bgcolor: '#ffffff',
                                        border: '1px solid #e8eaed',
                                        borderRadius: 3,
                                        height: '100%',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography sx={{ 
                                            fontSize: '20px', 
                                            fontWeight: 700, 
                                            color: '#1a1a1a',
                                            letterSpacing: '-0.5px',
                                        }}>
                                            Analysis Results
                                        </Typography>
                                        <Chip 
                                            label="Completed" 
                                            icon={<CheckCircle />}
                                            sx={{ 
                                                bgcolor: '#e8f5e9',
                                                color: '#4CAF50',
                                                fontWeight: 600,
                                                fontSize: '13px',
                                                height: 32,
                                                '& .MuiChip-icon': {
                                                    color: '#4CAF50',
                                                    fontSize: 18,
                                                }
                                            }} 
                                        />
                                    </Box>

                                    <Grid container spacing={2}>
                                        {Object.entries(results).map(([key, value]) => (
                                            <Grid item xs={12} sm={6} key={key}>
                                                <Box 
                                                    sx={{
                                                        p: 2.5,
                                                        bgcolor: '#f5f7fa',
                                                        borderRadius: 2,
                                                        border: '1px solid #e8eaed',
                                                        height: '100%',
                                                    }}
                                                >
                                                    <Typography sx={{ 
                                                        fontSize: '11px', 
                                                        textTransform: 'uppercase', 
                                                        letterSpacing: '1px',
                                                        color: '#6c757d', 
                                                        fontWeight: 700,
                                                        mb: 1,
                                                    }}>
                                                        {key.replace(/_/g, ' ')}
                                                    </Typography>
                                                    <Typography sx={{ 
                                                        fontSize: '15px', 
                                                        fontWeight: 600, 
                                                        color: '#1a1a1a',
                                                        wordBreak: 'break-word',
                                                    }}>
                                                        {value || 'N/A'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Paper>
                            ) : (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 6,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        minHeight: 500,
                                        bgcolor: '#f5f7fa',
                                        border: '2px dashed #d0d5dd',
                                        borderRadius: 3,
                                    }}
                                >
                                    <Box sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        borderRadius: 3,
                                        bgcolor: '#ffffff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mb: 3,
                                    }}>
                                        <AutoGraph sx={{ fontSize: 40, color: '#9C27B0' }} />
                                    </Box>
                                    <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a', mb: 1 }}>
                                        No Analysis Yet
                                    </Typography>
                                    <Typography sx={{ fontSize: '14px', textAlign: 'center', maxWidth: 360, color: '#6c757d' }}>
                                        Upload an image and click analyze to see detailed dress feature extraction results here
                                    </Typography>
                                </Paper>
                            )}
                        </Grid>
                    </Grid>
                )}

                {tabValue === 1 && (
                    <Paper 
                        elevation={0}
                        sx={{ 
                            bgcolor: '#ffffff',
                            border: '1px solid #e8eaed',
                            borderRadius: 3,
                            overflow: 'hidden',
                        }}
                    >
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                                        <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Order ID</TableCell>
                                        <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</TableCell>
                                        <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer</TableCell>
                                        <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items</TableCell>
                                        <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount</TableCell>
                                        <TableCell sx={{ color: '#1a1a1a', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.5px' }} align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {loadingOrders ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                                                <CircularProgress sx={{ color: '#2874F0' }} />
                                                <Typography sx={{ mt: 2, fontSize: '14px', color: '#6c757d', fontWeight: 500 }}>
                                                    Loading orders...
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : orders.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                                                <ShoppingBag sx={{ fontSize: 60, color: '#d0d5dd', mb: 2 }} />
                                                <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a', mb: 0.5 }}>
                                                    No Orders Yet
                                                </Typography>
                                                <Typography sx={{ fontSize: '14px', color: '#6c757d' }}>
                                                    Orders will appear here once customers make purchases
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        orders.map((order, orderIndex) => (
                                            <TableRow 
                                                key={order._id} 
                                                sx={{ 
                                                    '&:hover': { bgcolor: '#f5f7fa' },
                                                    borderBottom: orderIndex === orders.length - 1 ? 'none' : '1px solid #e8eaed',
                                                }}
                                            >
                                                <TableCell sx={{ color: '#2874F0', fontWeight: 700, fontSize: '14px' }}>
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </TableCell>
                                                <TableCell sx={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 500 }}>
                                                    {new Date(order.order_date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </TableCell>
                                                <TableCell sx={{ color: '#1a1a1a', fontSize: '14px', fontWeight: 500 }}>
                                                    {order.user_email}
                                                </TableCell>
                                                <TableCell>
                                                    <Stack spacing={2}>
                                                        {order.items.map((item, idx) => (
                                                            <Box 
                                                                key={idx} 
                                                                sx={{ 
                                                                    p: 2,
                                                                    bgcolor: '#f5f7fa',
                                                                    borderRadius: 2,
                                                                    border: '1px solid #e8eaed',
                                                                    display: 'flex',
                                                                    gap: 2,
                                                                }}
                                                            >
                                                                <Box
                                                                    component="img"
                                                                    src={`/images/orders/${order._id}_${idx}.png`}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = "https://placehold.co/100x100?text=Product";
                                                                    }}
                                                                    sx={{
                                                                        width: 100,
                                                                        height: 100,
                                                                        borderRadius: 2,
                                                                        objectFit: 'cover',
                                                                        border: '1px solid #e8eaed',
                                                                        bgcolor: '#ffffff',
                                                                        flexShrink: 0,
                                                                    }}
                                                                />
                                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                    <Typography sx={{ fontSize: '14px', fontWeight: 700, color: '#2874F0', mb: 1 }}>
                                                                        {item.product_name}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '13px', color: '#6c757d', mb: 0.5 }}>
                                                                        <strong>Fabric:</strong> {item.fabric_type}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '13px', color: '#6c757d', mb: 0.5 }}>
                                                                        <strong>Style:</strong> {item.top_style} / {item.bottom_style}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '13px', color: '#6c757d', mb: 0.5 }}>
                                                                        <strong>Colors:</strong> {item.top_color} / {item.bottom_color}
                                                                    </Typography>
                                                                    <Typography sx={{ fontSize: '13px', color: '#6c757d' }}>
                                                                        <strong>Details:</strong> {item.sleeve_type} sleeve, {item.neck_design} neck, {item.border_design} border
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                </TableCell>
                                                <TableCell sx={{ color: '#4CAF50', fontWeight: 700, fontSize: '16px' }}>
                                                    ₹{order.total_amount.toLocaleString()}
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Stack spacing={1.5}>
                                                        {order.items.map((item, idx) => (
                                                            <Button
                                                                key={idx}
                                                                size="small"
                                                                variant="contained"
                                                                startIcon={<AutoGraph sx={{ fontSize: 16 }} />}
                                                                onClick={() => handleOrderAnalysis(order._id, idx, item.image_name)}
                                                                disabled={analyzing}
                                                                sx={{
                                                                    bgcolor: '#2874F0',
                                                                    color: '#ffffff',
                                                                    textTransform: 'none',
                                                                    fontSize: '13px',
                                                                    fontWeight: 600,
                                                                    borderRadius: 2,
                                                                    px: 2,
                                                                    py: 1,
                                                                    boxShadow: 'none',
                                                                    '&:hover': { 
                                                                        bgcolor: '#1565c0',
                                                                        boxShadow: 'none',
                                                                    },
                                                                    '&:disabled': {
                                                                        bgcolor: '#e8eaed',
                                                                        color: '#6c757d',
                                                                    }
                                                                }}
                                                            >
                                                                Analyze Item {idx + 1}
                                                            </Button>
                                                        ))}
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Container>
        </Box>
    );
};

export default AdminPanel;