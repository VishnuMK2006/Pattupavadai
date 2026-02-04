import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Stack,
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
    RadioGroup,
    FormControlLabel,
    Radio,
    LinearProgress,
    IconButton,
    Divider,
} from '@mui/material';
import {
    CloudUpload,
    AutoGraph,
    Logout,
    Dashboard as DashboardIcon,
    ShoppingBag,
    Image as ImageIcon,
    ArrowBack,
    Person,
    Inventory,
    AddBox,
    Delete,
    Edit,
    Save,
    Close,
    Add,
    Group,
    Visibility,
    History
} from '@mui/icons-material';
import { Menu, MenuItem, Avatar } from '@mui/material';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFBE6',
    text: '#2A000A',
    goldLight: '#D4AF37'
};

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
    const [knowledgeFile, setKnowledgeFile] = useState(null);
    const [knowledgeMode, setKnowledgeMode] = useState('new');
    const [knowledgeStatus, setKnowledgeStatus] = useState(null);
    const [knowledgeUploading, setKnowledgeUploading] = useState(false);
    const [knowledgeProgress, setKnowledgeProgress] = useState(0);
    const [knowledgeElapsed, setKnowledgeElapsed] = useState(0);
    const [knowledgeRemaining, setKnowledgeRemaining] = useState(null);
    const uploadStartRef = useRef(null);
    const [anchorEl, setAnchorEl] = useState(null);

    // --- Product Management State ---
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [isProductFormOpen, setIsProductFormOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [productFormData, setProductFormData] = useState({
        name: '',
        blurb: '',
        description: '',
        price: '',
        original_price: '',
        discount: '',
        tag: '',
        rating: 4.5,
        reviews_count: 120,
        card_image: '',
        gallery_images: [],
        video_url: '',
        available_sizes: ['0-1Y', '1-2Y', '2-3Y'],
        highlights: ['Premium Silk Fabric', 'Handcrafted Embroidery', 'Gold Zari Work'],
        accent_color: '#4C0013',
        category: 'Pattu Pavadai',
        in_stock: true
    });
    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [selectedUserInsights, setSelectedUserInsights] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [viewMode, setViewMode] = useState('orders'); // 'orders' or 'customer'
    const [customerSearch, setCustomerSearch] = useState('');
    const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'week', 'month'

    const productFormRef = useRef(null);

    // Auto-scroll to product form when it opens or product changes
    useEffect(() => {
        if (isProductFormOpen && productFormRef.current) {
            productFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, [isProductFormOpen, editingProduct]);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        if (tabValue === 0) {
            fetchProducts();
        } else if (tabValue === 2) {
            fetchOrders();
            fetchUsers();
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

    const formatDuration = (seconds) => {
        if (seconds === null || !Number.isFinite(seconds)) return '—';
        const s = Math.max(0, seconds);
        if (s < 1) return '<1s';
        if (s < 60) return `${s < 10 ? s.toFixed(1) : Math.round(s)}s`;
        const minutes = Math.floor(s / 60);
        const remSeconds = Math.round(s % 60);
        if (minutes < 60) return `${minutes}m ${remSeconds}s`;
        const hours = Math.floor(minutes / 60);
        const remMinutes = minutes % 60;
        return `${hours}h ${remMinutes}m`;
    };

    const handleKnowledgeFileChange = (event) => {
        const file = event.target.files?.[0];
        setKnowledgeFile(file || null);
        setKnowledgeStatus(null);
    };

    const resetUploadMetrics = () => {
        setKnowledgeProgress(0);
        setKnowledgeElapsed(0);
        setKnowledgeRemaining(null);
        uploadStartRef.current = null;
    };

    const handleKnowledgeUpload = async () => {
        if (!knowledgeFile) {
            setKnowledgeStatus({ type: 'error', message: 'Select a PDF before uploading.' });
            return;
        }
        const formData = new FormData();
        formData.append('mode', knowledgeMode);
        formData.append('file', knowledgeFile);

        setKnowledgeUploading(true);
        setKnowledgeStatus(null);
        resetUploadMetrics();
        uploadStartRef.current = performance.now();

        try {
            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open('POST', `${API_BASE}/admin/knowledge/upload`);

                xhr.upload.onprogress = (event) => {
                    if (!event.lengthComputable) {
                        setKnowledgeProgress(0);
                        setKnowledgeRemaining(null);
                        return;
                    }
                    const percent = Math.round((event.loaded / event.total) * 100);
                    const elapsedMs = performance.now() - (uploadStartRef.current || performance.now());
                    const elapsedSec = Math.max(elapsedMs / 1000, 0.001);
                    setKnowledgeProgress(percent);
                    setKnowledgeElapsed(elapsedSec);

                    const bytesPerSec = event.loaded / elapsedSec;
                    const remainingBytes = Math.max(event.total - event.loaded, 0);
                    const remainingSec = remainingBytes / Math.max(bytesPerSec, 0.001);
                    setKnowledgeRemaining(remainingSec);
                };

                xhr.onload = () => {
                    try {
                        const data = JSON.parse(xhr.responseText || '{}');
                        if (xhr.status >= 200 && xhr.status < 300) {
                            setKnowledgeProgress(100);
                            setKnowledgeRemaining(0);
                            setKnowledgeStatus({
                                type: 'success',
                                message: `Ingested ${data.chunks} chunks (${data.mode === 'new' ? 'New DB' : 'Append'})`,
                            });
                            setKnowledgeFile(null);
                            resolve(null);
                        } else {
                            throw new Error(data.detail || 'Ingestion failed');
                        }
                    } catch (err) {
                        reject(err);
                    }
                };

                xhr.onerror = () => {
                    reject(new Error('Network error while uploading PDF'));
                };

                xhr.send(formData);
            });
        } catch (err) {
            setKnowledgeStatus({ type: 'error', message: err.message });
        } finally {
            setKnowledgeUploading(false);
            resetUploadMetrics();
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
        if (!targetImage) {
            setError("Please upload or select an image first.");
            return;
        }

        setAnalyzing(true);
        setResults(null);
        setError(null);

        try {
            const response = await fetch(`${API_BASE}/analyze-dress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: targetImage }),
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.detail || `Server error: ${response.status}`);
            }

            const data = await response.json();
            if (data.analysis) {
                let content = data.analysis;
                if (content.includes('```json')) {
                    content = content.split('```json')[1].split('```')[0];
                } else if (content.includes('```')) {
                    content = content.split('```')[1].split('```')[0];
                }
                setResults(typeof content === 'string' ? JSON.parse(content.trim()) : content);
            }
        } catch (error) {
            console.error("Analysis Error:", error);
            setError(error.message);
        } finally {
            setAnalyzing(false);
        }
    };

    const handleOrderAnalysis = async (orderId, itemIndex) => {
        const imageUrl = `/images/orders/${orderId}_${itemIndex}.png`;
        setTabValue(0);
        setResults(null);
        setError(null);
        setPreviewUrl(null);

        try {
            setAnalyzing(true);
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error(`Image not found at ${imageUrl}`);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64data = reader.result;
                setPreviewUrl(base64data);
                handleAnalyze(base64data);
            };
            reader.readAsDataURL(blob);
        } catch (err) {
            setError(err.message);
            setAnalyzing(false);
        }
    };

    const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
            const response = await fetch(`${API_BASE}/admin/users`);
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingUsers(false);
        }
    };

    const fetchUserInsights = async (email) => {
        setLoadingInsights(true);
        setSelectedUserInsights(null);
        try {
            const response = await fetch(`${API_BASE}/admin/user-insights/${email}`);
            if (!response.ok) throw new Error('Failed to fetch user insights');
            const data = await response.json();
            setSelectedUserInsights(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingInsights(false);
        }
    };

    const getFilteredUsers = () => {
        return users.filter(user => {
            const matchesSearch = !customerSearch || (user.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
                user.email?.toLowerCase().includes(customerSearch.toLowerCase()));

            if (!matchesSearch) return false;
            if (timeFilter === 'all') return true;

            const registrationDate = user.created_at ? new Date(user.created_at) : new Date();
            const now = new Date();
            const diffDays = (now - registrationDate) / (1000 * 60 * 60 * 24);

            if (timeFilter === 'week') return diffDays <= 7;
            if (timeFilter === 'month') return diffDays <= 30;
            return true;
        });
    };

    const getFilteredOrders = () => {
        return orders.filter(order => {
            const matchesSearch = !customerSearch || order.user_email?.toLowerCase().includes(customerSearch.toLowerCase());

            if (!matchesSearch) return false;
            if (timeFilter === 'all') return true;

            const orderDate = order.order_date ? new Date(order.order_date) : new Date();
            const now = new Date();
            const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);

            if (timeFilter === 'week') return diffDays <= 7;
            if (timeFilter === 'month') return diffDays <= 30;
            return true;
        });
    };

    const filteredUsers = getFilteredUsers();
    const filteredOrders = getFilteredOrders();

    // --- Product Management Logic ---
    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await fetch(`${API_BASE}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleProductVideoUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Basic check for video size (optional but recommended for base64)
        if (file.size > 10 * 1024 * 1024) { // 10MB limit for base64
            alert("Video file is too large. Please upload a video under 10MB or use a URL.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setProductFormData(prev => ({ ...prev, video_url: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProduct = async () => {
        try {
            setLoadingProducts(true);
            const method = editingProduct ? 'PUT' : 'POST';
            const url = editingProduct
                ? `${API_BASE}/admin/products/${editingProduct._id}`
                : `${API_BASE}/admin/products`;

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...productFormData,
                    price: parseFloat(productFormData.price),
                    original_price: parseFloat(productFormData.original_price),
                    rating: parseFloat(productFormData.rating),
                    reviews_count: parseInt(productFormData.reviews_count)
                })
            });

            if (!response.ok) throw new Error('Failed to save product');

            setIsProductFormOpen(false);
            setEditingProduct(null);
            resetProductForm();
            fetchProducts();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const response = await fetch(`${API_BASE}/admin/products/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Failed to delete product');
            fetchProducts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleProductImageUpload = (e, type, index = null) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            if (type === 'card') {
                setProductFormData(prev => ({ ...prev, card_image: reader.result }));
            } else if (type === 'gallery') {
                const newGallery = [...productFormData.gallery_images];
                if (index !== null) newGallery[index] = reader.result;
                else newGallery.push(reader.result);
                setProductFormData(prev => ({ ...prev, gallery_images: newGallery }));
            }
        };
        reader.readAsDataURL(file);
    };

    const resetProductForm = () => {
        setProductFormData({
            name: '',
            blurb: '',
            description: '',
            price: '',
            original_price: '',
            discount: '',
            tag: '',
            rating: 4.5,
            reviews_count: 120,
            card_image: '',
            gallery_images: [],
            video_url: '',
            available_sizes: ['0-1Y', '1-2Y', '2-3Y'],
            highlights: ['Premium Silk Fabric', 'Handcrafted Embroidery', 'Gold Zari Work'],
            accent_color: '#4C0013',
            category: 'Pattu Pavadai',
            in_stock: true
        });
    };

    const openEditForm = (product) => {
        setEditingProduct(product);
        setProductFormData({ ...product });
        setIsProductFormOpen(true);
    };

    return (
        <Box sx={{
            bgcolor: luxuryColors.ivory,
            minHeight: '100vh',
            backgroundImage: `radial-gradient(circle at 80% 0%, rgba(179, 139, 0, 0.05) 0%, transparent 50%), 
                             radial-gradient(circle at 0% 100%, rgba(76, 0, 19, 0.02) 0%, transparent 50%)`,
            overflowY: 'scroll', // Force scrollbar to prevent horizontal jumps
            width: '100%'
        }}>
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: luxuryColors.maroon, zIndex: 1201 }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1, px: { xs: 1, md: 0 } }}>
                        {/* Left Section - Back Button and Brand */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <IconButton
                                onClick={onSignOut}
                                sx={{
                                    color: luxuryColors.maroon,
                                    bgcolor: 'white',
                                    '&:hover': { bgcolor: '#f0f0f0' }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Box>
                                <Typography sx={{ color: luxuryColors.gold, fontSize: '18px', fontWeight: 900, fontFamily: '"Playfair Display", serif', letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                                    Kuzhavi_kids
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    Admin Panel
                                </Typography>
                            </Box>
                        </Box>

                        {/* Center Section - Navigation Buttons */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <Button
                                startIcon={<Inventory />}
                                onClick={() => setTabValue(0)}
                                sx={{
                                    color: tabValue === 0 ? luxuryColors.maroon : luxuryColors.maroon,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    px: 2,
                                    py: 0.5,
                                    fontSize: '12px',
                                    borderRadius: '8px',
                                    bgcolor: tabValue === 0 ? 'white' : 'rgba(255, 255, 255, 0.25)',
                                    border: 'none',
                                    outline: 'none',
                                    '&:hover': {
                                        bgcolor: tabValue === 0 ? 'white' : 'rgba(255, 255, 255, 0.4)'
                                    },
                                    '&:focus': {
                                        outline: 'none'
                                    }
                                }}
                            >
                                Collections
                            </Button>
                            <Button
                                startIcon={<AutoGraph />}
                                onClick={() => setTabValue(1)}
                                sx={{
                                    color: tabValue === 1 ? luxuryColors.maroon : luxuryColors.maroon,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    px: 2,
                                    py: 0.5,
                                    fontSize: '12px',
                                    borderRadius: '8px',
                                    bgcolor: tabValue === 1 ? 'white' : 'rgba(255, 255, 255, 0.25)',
                                    border: 'none',
                                    outline: 'none',
                                    '&:hover': {
                                        bgcolor: tabValue === 1 ? 'white' : 'rgba(255, 255, 255, 0.4)'
                                    },
                                    '&:focus': {
                                        outline: 'none'
                                    }
                                }}
                            >
                                Image Curation
                            </Button>
                            <Button
                                startIcon={<ShoppingBag />}
                                onClick={() => { setTabValue(2); setViewMode('orders'); }}
                                sx={{
                                    color: tabValue === 2 ? luxuryColors.maroon : luxuryColors.maroon,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    px: 2,
                                    py: 0.5,
                                    fontSize: '12px',
                                    borderRadius: '8px',
                                    bgcolor: tabValue === 2 ? 'white' : 'rgba(255, 255, 255, 0.25)',
                                    border: 'none',
                                    outline: 'none',
                                    '&:hover': {
                                        bgcolor: tabValue === 2 ? 'white' : 'rgba(255, 255, 255, 0.4)'
                                    },
                                    '&:focus': {
                                        outline: 'none'
                                    }
                                }}
                            >
                                Sales & Customers
                            </Button>
                            <Button
                                startIcon={<DashboardIcon />}
                                onClick={() => setTabValue(3)}
                                sx={{
                                    color: luxuryColors.maroon,
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    px: 2,
                                    py: 0.5,
                                    fontSize: '12px',
                                    borderRadius: '8px',
                                    bgcolor: tabValue === 3 ? 'white' : 'rgba(255, 255, 255, 0.25)',
                                    '&:hover': {
                                        bgcolor: tabValue === 3 ? 'white' : 'rgba(255, 255, 255, 0.4)'
                                    }
                                }}
                            >
                                ChatBot
                            </Button>
                        </Box>

                        {/* Right Section - Profile */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                                onClick={handleProfileMenuOpen}
                                sx={{ p: 0.5 }}
                            >
                                <Avatar sx={{
                                    bgcolor: 'rgba(179, 139, 0, 0.1)',
                                    color: luxuryColors.gold,
                                    width: 32,
                                    height: 32,
                                    border: `1.5px solid ${luxuryColors.gold}`
                                }}>
                                    <Person sx={{ fontSize: 20 }} />
                                </Avatar>
                            </IconButton>
                        </Box>

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
                                <Typography sx={{ fontWeight: 800, color: luxuryColors.maroon, fontSize: '14px' }}>Administrator</Typography>
                                <Typography sx={{ color: '#999', fontSize: '12px' }}>admin@gmail.com</Typography>
                            </Box>
                            <Divider />
                            <MenuItem onClick={() => { handleProfileMenuClose(); onSignOut(); }} sx={{ color: '#d32f2f' }}>
                                <Logout sx={{ fontSize: 20, mr: 2 }} />
                                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Sign Out</Typography>
                            </MenuItem>
                        </Menu>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Tab 3: ChatBot (Knowledge Base Upload) */}
                {tabValue === 3 && (
                    <Paper
                        elevation={0}
                        sx={{
                            mb: 3,
                            bgcolor: '#ffffff',
                            border: '1px solid rgba(179, 139, 0, 0.1)',
                            borderRadius: '24px',
                            p: 3,
                            boxShadow: '0 10px 40px rgba(76, 0, 19, 0.02)',
                            maxWidth: 700,
                            mx: 'auto'
                        }}
                    >
                        <Typography sx={{ fontWeight: 900, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif', mb: 1, fontSize: '18px' }}>
                            Knowledge Base Management
                        </Typography>
                        <Typography sx={{ color: '#666', mb: 2, fontSize: '13px' }}>
                            Upload PDF documents to train the chatbot with product knowledge and customer service information.
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ border: '2px dashed rgba(179, 139, 0, 0.3)', borderRadius: '16px', p: 2, textAlign: 'center', bgcolor: 'rgba(179, 139, 0, 0.02)' }}>
                                <input
                                    accept="application/pdf"
                                    style={{ display: 'none' }}
                                    id="knowledge-pdf-upload"
                                    type="file"
                                    onChange={handleKnowledgeFileChange}
                                />
                                <label htmlFor="knowledge-pdf-upload" style={{ cursor: 'pointer' }}>
                                    <CloudUpload sx={{ fontSize: 32, color: luxuryColors.gold, mb: 1, opacity: 0.7 }} />
                                    <Typography sx={{ fontWeight: 700, color: luxuryColors.maroon, mb: 0.5, fontSize: '14px' }}>
                                        {knowledgeFile ? knowledgeFile.name : 'Click to upload PDF'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '11px', color: '#999' }}>
                                        Supported format: PDF
                                    </Typography>
                                </label>
                            </Box>

                            {knowledgeUploading && (
                                <Box>
                                    <LinearProgress
                                        variant="determinate"
                                        value={knowledgeProgress}
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: 'rgba(179, 139, 0, 0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                bgcolor: luxuryColors.gold,
                                            }
                                        }}
                                    />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography sx={{ fontSize: '12px', color: '#666' }}>
                                            {knowledgeProgress}% • Elapsed: {formatDuration(knowledgeElapsed)}
                                        </Typography>
                                        <Typography sx={{ fontSize: '12px', color: '#666' }}>
                                            Remaining: {formatDuration(knowledgeRemaining)}
                                        </Typography>
                                    </Box>
                                </Box>
                            )}

                            {knowledgeStatus && (
                                <Alert severity={knowledgeStatus.type} sx={{ borderRadius: '12px' }}>
                                    {knowledgeStatus.message}
                                </Alert>
                            )}

                            <RadioGroup
                                row
                                value={knowledgeMode}
                                onChange={(e) => setKnowledgeMode(e.target.value)}
                                sx={{ mb: 1 }}
                            >
                                <FormControlLabel
                                    value="new"
                                    control={<Radio sx={{ color: luxuryColors.gold, '&.Mui-checked': { color: luxuryColors.gold } }} />}
                                    label={<Typography sx={{ fontSize: '14px', fontWeight: 600, color: luxuryColors.text }}>New DB</Typography>}
                                />
                                <FormControlLabel
                                    value="append"
                                    control={<Radio sx={{ color: luxuryColors.gold, '&.Mui-checked': { color: luxuryColors.gold } }} />}
                                    label={<Typography sx={{ fontSize: '14px', fontWeight: 600, color: luxuryColors.text }}>Append</Typography>}
                                />
                            </RadioGroup>

                            <Button
                                variant="contained"
                                onClick={handleKnowledgeUpload}
                                disabled={knowledgeUploading}
                                sx={{
                                    bgcolor: luxuryColors.gold,
                                    color: '#FFFFFF',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    py: 1,
                                    fontSize: '14px',
                                    borderRadius: '50px',
                                    boxShadow: '0 8px 20px rgba(179, 139, 0, 0.2)',
                                    fontFamily: '"Outfit", sans-serif',
                                    '&:hover': {
                                        bgcolor: '#9a7700',
                                        boxShadow: '0 12px 25px rgba(179, 139, 0, 0.3)',
                                    },
                                    '&:disabled': {
                                        bgcolor: 'rgba(179, 139, 0, 0.3)',
                                    }
                                }}
                            >
                                {knowledgeUploading ? 'Processing...' : 'Process PDF Document'}
                            </Button>
                        </Box>
                    </Paper>
                )}

                {/* Tab 0: Collections (Product Management) */}
                {tabValue === 0 && (
                    <Paper elevation={0} sx={{ bgcolor: 'white', borderRadius: '24px', p: 3, border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography sx={{ fontWeight: 900, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif', fontSize: '18px' }}>
                                Product Inventory
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddBox sx={{ fontSize: 18 }} />}
                                onClick={() => { setEditingProduct(null); resetProductForm(); setIsProductFormOpen(true); }}
                                sx={{
                                    bgcolor: luxuryColors.gold,
                                    color: 'white',
                                    borderRadius: '50px',
                                    fontWeight: 700,
                                    px: 2.5,
                                    py: 0.75,
                                    fontSize: '13px',
                                    '&:hover': {
                                        bgcolor: '#9a7700'
                                    }
                                }}
                            >
                                Add New Product
                            </Button>
                        </Box>

                        {isProductFormOpen ? (
                            <Paper ref={productFormRef} sx={{ p: 2.5, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: '15px' }}>
                                        {editingProduct ? 'Edit Product' : 'Add New Product'}
                                    </Typography>
                                    <IconButton size="small" onClick={() => setIsProductFormOpen(false)}><Close sx={{ fontSize: 18 }} /></IconButton>
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: luxuryColors.maroon, mb: 0.5 }}>Product Name</Typography>
                                                <input
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAEAEA', fontSize: '13px', backgroundColor: '#FAFAFA', color: luxuryColors.text, outline: 'none', transition: 'all 0.2s' }}
                                                    placeholder="Royal Maroon Silk Pattu"
                                                    value={productFormData.name}
                                                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                                                    onFocus={(e) => e.target.style.borderColor = luxuryColors.maroon}
                                                    onBlur={(e) => e.target.style.borderColor = '#EAEAEA'}
                                                />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: luxuryColors.maroon, mb: 0.5 }}>Category / Fabric</Typography>
                                                <input
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAEAEA', fontSize: '13px', backgroundColor: '#FAFAFA', color: luxuryColors.text, outline: 'none' }}
                                                    placeholder="e.g. Traditional Banarasi Silk"
                                                    value={productFormData.blurb}
                                                    onChange={(e) => setProductFormData({ ...productFormData, blurb: e.target.value })}
                                                />
                                            </Box>
                                            <Box>
                                                <Typography sx={{ fontSize: '12px', fontWeight: 700, color: luxuryColors.maroon, mb: 0.5 }}>Description</Typography>
                                                <textarea
                                                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAEAEA', fontSize: '13px', backgroundColor: '#FAFAFA', color: luxuryColors.text, minHeight: '80px', fontFamily: 'inherit', outline: 'none' }}
                                                    placeholder="Enter detailed product description..."
                                                    value={productFormData.description}
                                                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                                                />
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: luxuryColors.maroon, mb: 0.5 }}>Price (₹)</Typography>
                                                    <input
                                                        type="number"
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAEAEA', fontSize: '13px', backgroundColor: '#FAFAFA', color: luxuryColors.text, outline: 'none' }}
                                                        placeholder="1500"
                                                        value={productFormData.price}
                                                        onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: luxuryColors.maroon, mb: 0.5 }}>Old Price (₹)</Typography>
                                                    <input
                                                        type="number"
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAEAEA', fontSize: '13px', backgroundColor: '#FAFAFA', color: luxuryColors.text, outline: 'none' }}
                                                        placeholder="2000"
                                                        value={productFormData.original_price}
                                                        onChange={(e) => setProductFormData({ ...productFormData, original_price: e.target.value })}
                                                    />
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: 'flex', gap: 1.5 }}>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: luxuryColors.maroon, mb: 0.5 }}>Tag</Typography>
                                                    <input
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAEAEA', fontSize: '13px', backgroundColor: '#FAFAFA', color: luxuryColors.text, outline: 'none' }}
                                                        placeholder="e.g. Hot Deal"
                                                        value={productFormData.tag}
                                                        onChange={(e) => setProductFormData({ ...productFormData, tag: e.target.value })}
                                                    />
                                                </Box>
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography sx={{ fontSize: '12px', fontWeight: 700, color: luxuryColors.maroon, mb: 0.5 }}>Discount %</Typography>
                                                    <input
                                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAEAEA', fontSize: '13px', backgroundColor: '#FAFAFA', color: luxuryColors.text, outline: 'none' }}
                                                        placeholder="e.g. 50% OFF"
                                                        value={productFormData.discount}
                                                        onChange={(e) => setProductFormData({ ...productFormData, discount: e.target.value })}
                                                    />
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '13px', color: luxuryColors.maroon }}>Main Product Image</Typography>
                                            <Box sx={{ position: 'relative', width: '100%', height: 160, bgcolor: '#FAFAFA', borderRadius: '15px', overflow: 'hidden', border: '2px dashed #EEE', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', '&:hover': { borderColor: luxuryColors.gold } }}>
                                                {productFormData.card_image ? (
                                                    <img src={productFormData.card_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                ) : (
                                                    <CloudUpload sx={{ color: luxuryColors.gold, fontSize: 32, opacity: 0.5 }} />
                                                )}
                                                <input type="file" accept="image/*" onChange={(e) => handleProductImageUpload(e, 'card')} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '13px', color: luxuryColors.maroon }}>Gallery Images (Add 3-4)</Typography>
                                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                                {productFormData.gallery_images.map((img, i) => (
                                                    <Box key={i} sx={{ width: 60, height: 60, borderRadius: '10px', overflow: 'hidden', position: 'relative', border: '1px solid #EEE' }}>
                                                        <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                        <IconButton
                                                            size="small"
                                                            sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'rgba(255,255,255,0.9)', color: 'red', p: 0.2, '&:hover': { bgcolor: 'white' } }}
                                                            onClick={() => {
                                                                const newGallery = productFormData.gallery_images.filter((_, idx) => idx !== i);
                                                                setProductFormData({ ...productFormData, gallery_images: newGallery });
                                                            }}
                                                        >
                                                            <Close sx={{ fontSize: 10 }} />
                                                        </IconButton>
                                                    </Box>
                                                ))}
                                                <Box sx={{ width: 60, height: 60, borderRadius: '10px', bgcolor: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #EEE', position: 'relative', cursor: 'pointer', '&:hover': { borderColor: luxuryColors.gold } }}>
                                                    <Add sx={{ color: luxuryColors.gold, fontSize: 20, opacity: 0.5 }} />
                                                    <input type="file" accept="image/*" onChange={(e) => handleProductImageUpload(e, 'gallery')} style={{ position: 'absolute', opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }} />
                                                </Box>
                                            </Box>
                                        </Box>

                                        <Box sx={{ mb: 2 }}>
                                            <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '13px', color: luxuryColors.maroon }}>Product Video (Local or URL)</Typography>
                                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}>
                                                <input
                                                    style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAEAEA', fontSize: '12px', backgroundColor: '#FAFAFA', color: luxuryColors.text, outline: 'none' }}
                                                    placeholder="Paste Video URL or click icon to upload..."
                                                    value={productFormData.video_url}
                                                    onChange={(e) => setProductFormData({ ...productFormData, video_url: e.target.value })}
                                                />
                                                <IconButton
                                                    component="label"
                                                    sx={{ bgcolor: 'rgba(179, 139, 0, 0.1)', color: luxuryColors.gold }}
                                                >
                                                    <CloudUpload sx={{ fontSize: 20 }} />
                                                    <input type="file" accept="video/*" hidden onChange={handleProductVideoUpload} />
                                                </IconButton>
                                            </Box>
                                            {productFormData.video_url && (
                                                <Typography sx={{ fontSize: '10px', color: 'green', fontWeight: 600 }}>Video source present ✓</Typography>
                                            )}
                                        </Box>

                                        <Typography sx={{ fontWeight: 700, mb: 1, fontSize: '13px', color: luxuryColors.maroon }}>Product Highlights</Typography>
                                        <textarea
                                            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #EAEAEA', fontSize: '12px', backgroundColor: '#FAFAFA', color: luxuryColors.text, minHeight: '65px', fontFamily: 'inherit', outline: 'none' }}
                                            placeholder="Sleeve Style: Regular Sleeves&#10;Pattern: Floral Print&#10;Neck: Mandarin Collar..."
                                            value={productFormData.highlights.join('\n')}
                                            onChange={(e) => setProductFormData({ ...productFormData, highlights: e.target.value.split('\n') })}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 1 }}>
                                            <Button variant="outlined" size="small" onClick={() => setIsProductFormOpen(false)} sx={{ borderRadius: '50px', fontSize: '12px' }}>Cancel</Button>
                                            <Button variant="contained" size="small" onClick={handleSaveProduct} sx={{ bgcolor: luxuryColors.maroon, color: 'white', borderRadius: '50px', px: 3, fontSize: '12px' }}>
                                                {editingProduct ? 'Update Product' : 'Save Product'}
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        ) : null}

                        <Grid container spacing={2}>
                            {products.map(product => (
                                <Grid item xs={12} sm={6} md={4} key={product._id}>
                                    <Paper sx={{ p: 1.5, borderRadius: '20px', display: 'flex', gap: 1.5, alignItems: 'center', border: '1px solid rgba(0,0,0,0.05)' }}>
                                        <img src={product.card_image} style={{ width: 60, height: 60, borderRadius: '12px', objectFit: 'cover' }} />
                                        <Box sx={{ flex: 1 }}>
                                            <Typography sx={{ fontWeight: 800, fontSize: '13px', color: luxuryColors.maroon }}>{product.name}</Typography>
                                            <Typography sx={{ fontSize: '11px', color: '#666' }}>₹{product.price}</Typography>
                                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                                <IconButton size="small" onClick={() => openEditForm(product)} sx={{ bgcolor: 'rgba(179, 139, 0, 0.1)', color: luxuryColors.gold, p: 0.5 }}><Edit sx={{ fontSize: 14 }} /></IconButton>
                                                <IconButton size="small" onClick={() => handleDeleteProduct(product._id)} sx={{ bgcolor: 'rgba(211, 47, 47, 0.1)', color: '#d32f2f', p: 0.5 }}><Delete sx={{ fontSize: 14 }} /></IconButton>
                                            </Box>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                )}

                {/* Tab 1: Image Curation (AI Analysis) */}
                {tabValue === 1 && (
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'flex-start', maxWidth: 1100, mx: 'auto' }}>
                        {/* SIDEBAR: Image Curation */}
                        <Box sx={{ width: 280, flexShrink: 0, position: 'sticky', top: 100 }}>
                            <Paper sx={{ p: 2.5, borderRadius: '24px', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                                <Typography sx={{ fontWeight: 800, mb: 2, fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, fontSize: '15px' }}>
                                    Image Curation
                                </Typography>
                                <Box sx={{ border: '2px dashed #EEE', borderRadius: '20px', minHeight: 280, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', bgcolor: '#FAFAFA' }}>
                                    <input accept="image/*" style={{ display: 'none' }} id="admin-upload" type="file" onChange={handleImageChange} />
                                    {!previewUrl ? (
                                        <label htmlFor="admin-upload" style={{ cursor: 'pointer', textAlign: 'center', width: '100%' }}>
                                            <CloudUpload sx={{ fontSize: 40, color: luxuryColors.gold, mb: 1, opacity: 0.5 }} />
                                            <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#999', letterSpacing: '1px' }}>UPLOAD DESIGN</Typography>
                                        </label>
                                    ) : (
                                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '280px', objectFit: 'contain' }} />
                                    )}
                                </Box>
                                <Stack spacing={1.5} sx={{ mt: 2.5 }}>
                                    <Button component="label" htmlFor="admin-upload" fullWidth variant="outlined" sx={{ py: 1, fontSize: '12px', borderRadius: '12px', color: luxuryColors.maroon, borderColor: luxuryColors.maroon, fontWeight: 700 }}>
                                        REPLACE IMAGE
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => handleAnalyze()}
                                        disabled={analyzing || !previewUrl}
                                        sx={{
                                            py: 1.25,
                                            fontSize: '13px',
                                            bgcolor: luxuryColors.gold,
                                            borderRadius: '12px',
                                            fontWeight: 800,
                                            boxShadow: '0 8px 20px rgba(179, 139, 0, 0.2)',
                                            '&:hover': { bgcolor: '#9a7700' }
                                        }}
                                    >
                                        {analyzing ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'START AI ANALYSIS'}
                                    </Button>
                                </Stack>
                            </Paper>
                        </Box>

                        {/* MAIN: Analysis Results (Locked to the side) */}
                        <Box sx={{ flexGrow: 1 }}>
                            {error && (
                                <Alert severity="error" sx={{ mb: 3, borderRadius: '15px' }}>{error}</Alert>
                            )}

                            {results ? (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography sx={{ fontWeight: 900, fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, fontSize: '22px' }}>
                                            Analysis Results
                                        </Typography>
                                        <Chip label="AI CURATED" sx={{ bgcolor: luxuryColors.gold, color: 'white', fontWeight: 800, fontSize: '9px', height: 20 }} />
                                    </Box>

                                    <Grid container spacing={2}>
                                        {Object.entries(results).map(([category, details]) => (
                                            <Grid item xs={12} sm={6} key={category}>
                                                <Paper sx={{ p: 3, borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', bgcolor: 'white', height: '100%' }}>
                                                    <Typography variant="overline" sx={{ color: luxuryColors.gold, fontWeight: 900, letterSpacing: '1px', mb: 1.5, display: 'block' }}>
                                                        {category.replace(/_/g, ' ').toUpperCase()}
                                                    </Typography>

                                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                        {typeof details === 'object' && details !== null ? (
                                                            Object.entries(details).map(([key, value]) => (
                                                                <Box key={key} sx={{ borderBottom: '1px solid #FAF9F6', pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                                    <Typography sx={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'capitalize' }}>
                                                                        {key.replace(/_/g, ' ')}
                                                                    </Typography>
                                                                    <Typography sx={{ fontWeight: 700, color: luxuryColors.maroon, fontSize: '13px' }}>
                                                                        {value?.toString() || '—'}
                                                                    </Typography>
                                                                </Box>
                                                            ))
                                                        ) : (
                                                            <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{details?.toString()}</Typography>
                                                        )}
                                                    </Box>
                                                </Paper>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            ) : (
                                <Paper sx={{ p: 5, borderRadius: '24px', textAlign: 'center', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)', opacity: 0.8, minHeight: 450, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <AutoGraph sx={{ fontSize: 48, color: luxuryColors.gold, mb: 2, opacity: 0.3 }} />
                                    <Typography sx={{ fontWeight: 800, mb: 0.5, fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, fontSize: '18px' }}>
                                        Ready for AI Curation
                                    </Typography>
                                    <Typography sx={{ color: '#666', maxWidth: 350, mx: 'auto', fontSize: '13px' }}>
                                        Upload a design image to see analysis results appear right here on the side.
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    </Box>
                )}

                {/* Tab 2: Sales & Customers (Merged Registry & Insights) */}
                {tabValue === 2 && (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                                <Typography sx={{ fontWeight: 900, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif', mb: 2, fontSize: '18px' }}>
                                    Sales & CRM
                                </Typography>

                                <Box sx={{ mb: 2.5 }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#999', mb: 1, letterSpacing: '0.5px' }}>SEARCH CUSTOMERS</Typography>
                                    <input
                                        style={{
                                            width: '100%',
                                            padding: '10px 14px',
                                            borderRadius: '12px',
                                            border: '1px solid #EAEAEA',
                                            fontSize: '13px',
                                            backgroundColor: '#FAFAFA',
                                            color: luxuryColors.text,
                                            outline: 'none'
                                        }}
                                        placeholder="Name or email..."
                                        value={customerSearch}
                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                    />
                                </Box>

                                <Box sx={{ mb: 3 }}>
                                    <Typography sx={{ fontSize: '11px', fontWeight: 800, color: '#999', mb: 1, letterSpacing: '0.5px' }}>REGISTRATION PERIOD</Typography>
                                    <Stack direction="row" spacing={0.5}>
                                        {['all', 'week', 'month'].map((f) => (
                                            <Button
                                                key={f}
                                                size="small"
                                                onClick={() => setTimeFilter(f)}
                                                sx={{
                                                    fontSize: '10px',
                                                    px: 1.5,
                                                    borderRadius: '50px',
                                                    textTransform: 'uppercase',
                                                    fontWeight: 700,
                                                    bgcolor: timeFilter === f ? luxuryColors.gold : 'transparent',
                                                    color: timeFilter === f ? 'white' : '#666',
                                                    border: timeFilter === f ? 'none' : '1px solid #EEE',
                                                    '&:hover': {
                                                        bgcolor: timeFilter === f ? luxuryColors.gold : '#F5F5F5'
                                                    }
                                                }}
                                            >
                                                {f === 'all' ? 'All Time' : f === 'week' ? 'Last Week' : 'Last Month'}
                                            </Button>
                                        ))}
                                    </Stack>
                                </Box>

                                <Divider sx={{ mb: 2, opacity: 0.5 }} />

                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => setViewMode('orders')}
                                    startIcon={<History />}
                                    sx={{
                                        mb: 3,
                                        py: 1.25,
                                        borderRadius: '12px',
                                        bgcolor: viewMode === 'orders' ? luxuryColors.maroon : 'rgba(76, 0, 19, 0.04)',
                                        color: viewMode === 'orders' ? 'white' : luxuryColors.maroon,
                                        boxShadow: 'none',
                                        fontWeight: 800,
                                        fontSize: '12px',
                                        textTransform: 'none',
                                        '&:hover': {
                                            bgcolor: viewMode === 'orders' ? '#3d0010' : 'rgba(76, 0, 19, 0.08)',
                                            boxShadow: 'none'
                                        }
                                    }}
                                >
                                    Global Sales Registry
                                </Button>

                                <Typography sx={{ fontSize: '11px', fontWeight: 900, color: luxuryColors.gold, letterSpacing: '1px', mb: 2 }}>CUSTOMER REGISTRY</Typography>

                                {loadingUsers ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}><CircularProgress /></Box>
                                ) : (
                                    <Stack spacing={1}>
                                        {filteredUsers.map(u => (
                                            <Paper
                                                key={u.email}
                                                onClick={() => {
                                                    fetchUserInsights(u.email);
                                                    setViewMode('customer');
                                                }}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: '16px',
                                                    cursor: 'pointer',
                                                    bgcolor: (viewMode === 'customer' && selectedUserInsights?.user?.email === u.email) ? 'rgba(76, 0, 19, 0.05)' : 'white',
                                                    border: '1px solid',
                                                    borderColor: (viewMode === 'customer' && selectedUserInsights?.user?.email === u.email) ? luxuryColors.maroon : 'rgba(0,0,0,0.05)',
                                                    transition: '0.2s',
                                                    '&:hover': { bgcolor: 'rgba(76, 0, 19, 0.02)' }
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: luxuryColors.gold, color: 'white', width: 32, height: 32, fontSize: '14px' }}>
                                                        {u.name?.[0]?.toUpperCase() || 'U'}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>{u.name}</Typography>
                                                        <Typography sx={{ fontSize: '11px', color: '#888' }}>{u.email}</Typography>
                                                    </Box>
                                                </Box>
                                            </Paper>
                                        ))}
                                    </Stack>
                                )}
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={8}>
                            {viewMode === 'orders' && (
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography sx={{ fontWeight: 900, fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, fontSize: '20px' }}>
                                            {timeFilter === 'all' ? 'Full Order Registry' : `Orders: ${timeFilter === 'week' ? 'Last Week' : 'Last Month'}`}
                                        </Typography>
                                        <Chip label={`${filteredOrders.length} MATCHING ORDERS`} sx={{ bgcolor: luxuryColors.gold, color: 'white', fontWeight: 800, fontSize: '10px' }} />
                                    </Box>
                                    <TableContainer component={Paper} sx={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                                        <Table size="small">
                                            <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 900, color: luxuryColors.maroon, fontSize: '10px', letterSpacing: '1px' }}>ORDER ID</TableCell>
                                                    <TableCell sx={{ fontWeight: 900, color: luxuryColors.maroon, fontSize: '10px', letterSpacing: '1px' }}>CUSTOMER</TableCell>
                                                    <TableCell sx={{ fontWeight: 900, color: luxuryColors.maroon, fontSize: '10px', letterSpacing: '1px' }}>TOTAL</TableCell>
                                                    <TableCell sx={{ fontWeight: 900, color: luxuryColors.maroon, fontSize: '10px', letterSpacing: '1px' }}>ACTION</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {loadingOrders ? (
                                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6 }}><CircularProgress size={24} /></TableCell></TableRow>
                                                ) : filteredOrders.map(order => (
                                                    <TableRow key={order._id}>
                                                        <TableCell sx={{ fontWeight: 700, color: luxuryColors.maroon, fontSize: '13px' }}>#{order._id.slice(-8).toUpperCase()}</TableCell>
                                                        <TableCell sx={{ fontSize: '13px' }}>{order.user_email}</TableCell>
                                                        <TableCell sx={{ fontWeight: 800, fontSize: '13px' }}>₹{order.total_amount}</TableCell>
                                                        <TableCell>
                                                            <Button size="small" variant="outlined" sx={{ borderRadius: '50px', color: luxuryColors.gold, borderColor: luxuryColors.gold, py: 0.25, fontSize: '11px', minWidth: '80px' }} onClick={() => handleOrderAnalysis(order._id, 0)}>ANALYZE</Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                                {filteredOrders.length === 0 && !loadingOrders && (
                                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6, color: '#999' }}>No matching orders found</TableCell></TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </Box>
                            )}

                            {viewMode === 'customer' && (
                                <Box>
                                    {loadingInsights ? (
                                        <Paper sx={{ p: 5, borderRadius: '24px', textAlign: 'center', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <CircularProgress />
                                        </Paper>
                                    ) : selectedUserInsights ? (
                                        <Stack spacing={3}>
                                            {/* User Summary Card */}
                                            <Paper elevation={0} sx={{ p: 3, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)', bgcolor: 'white' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                                    <Avatar sx={{ bgcolor: luxuryColors.maroon, color: 'white' }}>{selectedUserInsights.user.name?.[0]}</Avatar>
                                                    <Box>
                                                        <Typography sx={{ fontWeight: 900, fontSize: '18px', color: luxuryColors.maroon }}>{selectedUserInsights.user.name}</Typography>
                                                        <Typography sx={{ fontSize: '12px', color: '#666' }}>{selectedUserInsights.user.email}</Typography>
                                                    </Box>
                                                </Box>
                                                <Divider sx={{ mb: 2, opacity: 0.5 }} />
                                                <Grid container spacing={3}>
                                                    <Grid item xs={6} md={3}>
                                                        <Typography sx={{ fontSize: '11px', color: '#999', mb: 0.5 }}>SHIPPING ADDRESS</Typography>
                                                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{selectedUserInsights.user.shipping_address || 'Not provided'}</Typography>
                                                    </Grid>
                                                    <Grid item xs={6} md={3}>
                                                        <Typography sx={{ fontSize: '11px', color: '#999', mb: 0.5 }}>CONTACT</Typography>
                                                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{selectedUserInsights.user.contact_details || 'Not provided'}</Typography>
                                                    </Grid>
                                                    <Grid item xs={6} md={3}>
                                                        <Typography sx={{ fontSize: '11px', color: '#999', mb: 0.5 }}>BAG ITEMS</Typography>
                                                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{selectedUserInsights.cart.length} items</Typography>
                                                    </Grid>
                                                    <Grid item xs={6} md={3}>
                                                        <Typography sx={{ fontSize: '11px', color: '#999', mb: 0.5 }}>WISHLIST</Typography>
                                                        <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{selectedUserInsights.favorites.length} items</Typography>
                                                    </Grid>
                                                </Grid>
                                            </Paper>

                                            {/* Shopping Bag & Wishlist Grid */}
                                            <Grid container spacing={3}>
                                                <Grid item xs={12} md={6}>
                                                    <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                        <Typography sx={{ fontWeight: 800, fontSize: '14px', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <ShoppingBag sx={{ fontSize: 18, color: luxuryColors.maroon }} /> Active Bag
                                                        </Typography>
                                                        <Stack spacing={1.5}>
                                                            {selectedUserInsights.cart.length === 0 ? (
                                                                <Typography sx={{ fontSize: '12px', color: '#999', textAlign: 'center', py: 2 }}>Bag is empty</Typography>
                                                            ) : selectedUserInsights.cart.map((item, i) => (
                                                                <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', pb: 1, borderBottom: '1px solid #f5f5f5' }}>
                                                                    <Box component="img" src={item.preview_url} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }} />
                                                                    <Box>
                                                                        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{item.product_name}</Typography>
                                                                        <Typography sx={{ fontSize: '10px', color: '#888' }}>{item.fabric_type} • {item.dress_type}</Typography>
                                                                    </Box>
                                                                </Box>
                                                            ))}
                                                        </Stack>
                                                    </Paper>
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                        <Typography sx={{ fontWeight: 800, fontSize: '14px', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                            <Visibility sx={{ fontSize: 18, color: luxuryColors.gold }} /> Wishlist
                                                        </Typography>
                                                        <Stack spacing={1.5}>
                                                            {selectedUserInsights.favorites.length === 0 ? (
                                                                <Typography sx={{ fontSize: '12px', color: '#999', textAlign: 'center', py: 2 }}>Wishlist is empty</Typography>
                                                            ) : selectedUserInsights.favorites.map((item, i) => (
                                                                <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center', pb: 1, borderBottom: '1px solid #f5f5f5' }}>
                                                                    <Box component="img" src={item.preview_url || item.image} sx={{ width: 40, height: 40, borderRadius: '8px', objectFit: 'cover' }} />
                                                                    <Box>
                                                                        <Typography sx={{ fontSize: '13px', fontWeight: 700 }}>{item.product_name || item.name}</Typography>
                                                                        <Typography sx={{ fontSize: '10px', color: '#888' }}>Interested in: {item.tag || 'Traditional'}</Typography>
                                                                    </Box>
                                                                </Box>
                                                            ))}
                                                        </Stack>
                                                    </Paper>
                                                </Grid>
                                            </Grid>

                                            {/* Recent Orders */}
                                            <Paper sx={{ p: 3, borderRadius: '24px', border: '1px solid rgba(0,0,0,0.05)' }}>
                                                <Typography sx={{ fontWeight: 800, fontSize: '14px', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <History sx={{ fontSize: 18, color: '#388e3c' }} /> Order History
                                                </Typography>
                                                <TableContainer>
                                                    <Table size="small">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell sx={{ fontSize: '11px', fontWeight: 800 }}>DATE</TableCell>
                                                                <TableCell sx={{ fontSize: '11px', fontWeight: 800 }}>ID</TableCell>
                                                                <TableCell sx={{ fontSize: '11px', fontWeight: 800 }}>ITEMS</TableCell>
                                                                <TableCell sx={{ fontSize: '11px', fontWeight: 800 }}>TOTAL</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {selectedUserInsights.orders.map(o => (
                                                                <TableRow key={o._id}>
                                                                    <TableCell sx={{ fontSize: '12px' }}>{new Date(o.order_date).toLocaleDateString()}</TableCell>
                                                                    <TableCell sx={{ fontSize: '12px', fontWeight: 600 }}>#{o._id.slice(-6).toUpperCase()}</TableCell>
                                                                    <TableCell sx={{ fontSize: '12px' }}>{o.items.length} items</TableCell>
                                                                    <TableCell sx={{ fontSize: '12px', fontWeight: 700 }}>₹{o.total_amount}</TableCell>
                                                                </TableRow>
                                                            ))}
                                                            {selectedUserInsights.orders.length === 0 && (
                                                                <TableRow><TableCell colSpan={4} align="center" sx={{ py: 2, color: '#999', fontSize: '12px' }}>No orders yet</TableCell></TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </Paper>
                                        </Stack>
                                    ) : (
                                        <Paper sx={{ p: 5, borderRadius: '24px', textAlign: 'center', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)', opacity: 0.8, minHeight: 450, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                            <Person sx={{ fontSize: 48, color: luxuryColors.gold, mb: 2, opacity: 0.3 }} />
                                            <Typography sx={{ fontWeight: 800, mb: 0.5, fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, fontSize: '18px' }}>
                                                Customer Explorer
                                            </Typography>
                                            <Typography sx={{ color: '#666', maxWidth: 350, mx: 'auto', fontSize: '13px' }}>
                                                Select a customer from the registry to view their shopping bag, wishlist and personal order history.
                                            </Typography>
                                        </Paper>
                                    )}
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                )}
            </Container>
        </Box >
    );
};

export default AdminPanel;