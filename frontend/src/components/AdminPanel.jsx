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
} from '@mui/icons-material';
import { Menu, MenuItem, Divider as MuiDivider, Avatar } from '@mui/material';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFDF5',
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

    return (
        <Box sx={{ bgcolor: luxuryColors.ivory, minHeight: '100vh' }}>
            <AppBar position="sticky" elevation={0} sx={{ bgcolor: luxuryColors.maroon, zIndex: 1201 }}>
                <Container maxWidth="xl">
                    <Toolbar sx={{ justifyContent: 'space-between', py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                                <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <AutoGraph sx={{ color: luxuryColors.maroon, fontSize: 24 }} />
                                </Box>
                            </Box>
                            <Box>
                                <Typography sx={{ color: 'white', fontSize: '22px', fontWeight: 900, fontFamily: '"Playfair Display", serif' }}>
                                    Kuzhavi Admin
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', letterSpacing: '1px' }}>
                                    BOUTIQUE MANAGEMENT CONSOLE
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                                <MuiDivider />
                                <MenuItem onClick={onSignOut} sx={{ color: '#d32f2f' }}>
                                    <Logout sx={{ fontSize: 20, mr: 2 }} />
                                    <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Sign Out</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container maxWidth="xl" sx={{ py: 4 }}>

                <Paper
                    elevation={0}
                    sx={{
                        mb: 3,
                        bgcolor: '#ffffff',
                        border: '1px solid #e8eaed',
                        borderRadius: 3,
                        p: 3,
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
                                Knowledge Base Upload
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: '#6c757d', mb: 2 }}>
                                Upload a PDF to refresh the chatbot knowledge store. Use <strong>New DB</strong> to rebuild the
                                collection or <strong>Append</strong> to add to the existing vectors.
                            </Typography>
                            {knowledgeStatus && (
                                <Alert severity={knowledgeStatus.type} sx={{ fontSize: '13px', mt: 1 }}>
                                    {knowledgeStatus.message}
                                </Alert>
                            )}
                            {knowledgeUploading && (
                                <Box sx={{ mt: 2 }}>
                                    <LinearProgress
                                        variant={knowledgeProgress > 0 ? 'determinate' : 'indeterminate'}
                                        value={knowledgeProgress > 0 ? knowledgeProgress : undefined}
                                    />
                                    <Typography sx={{ fontSize: '12px', color: '#6c757d', mt: 1 }}>
                                        {knowledgeProgress > 0 ? `${knowledgeProgress}% uploaded` : 'Uploading...'} · Elapsed {formatDuration(knowledgeElapsed)}
                                        {knowledgeRemaining !== null && Number.isFinite(knowledgeRemaining) && knowledgeProgress < 100 && (
                                            <> · Remaining {formatDuration(knowledgeRemaining)}</>
                                        )}
                                    </Typography>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <input
                                id="knowledge-upload"
                                type="file"
                                accept="application/pdf"
                                style={{ display: 'none' }}
                                onChange={handleKnowledgeFileChange}
                            />
                            <label htmlFor="knowledge-upload" style={{ width: '100%' }}>
                                <Box
                                    sx={{
                                        border: '2px dashed #d0d5dd',
                                        borderRadius: 2,
                                        bgcolor: '#f8f9fa',
                                        p: 2,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s ease',
                                        '&:hover': { borderColor: '#2874F0' },
                                    }}
                                >
                                    <CloudUpload sx={{ fontSize: 36, color: '#2874F0', mb: 1 }} />
                                    <Typography sx={{ fontSize: '13px', fontWeight: 600, color: '#1a1a1a' }}>
                                        {knowledgeFile ? knowledgeFile.name : 'Click to choose a PDF'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: '#6c757d' }}>
                                        {knowledgeFile ? `${(knowledgeFile.size / 1024 / 1024).toFixed(2)} MB` : 'Max 10 MB'}
                                    </Typography>
                                </Box>
                            </label>

                            <RadioGroup
                                row
                                value={knowledgeMode}
                                onChange={(e) => setKnowledgeMode(e.target.value)}
                            >
                                <FormControlLabel value="new" control={<Radio />} label="New DB" />
                                <FormControlLabel value="append" control={<Radio />} label="Append" />
                            </RadioGroup>

                            <Button
                                variant="contained"
                                onClick={handleKnowledgeUpload}
                                disabled={knowledgeUploading}
                                sx={{
                                    bgcolor: '#2874F0',
                                    color: '#FFFFFF',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    py: 1.25,
                                    borderRadius: 2,
                                    boxShadow: 'none',
                                    '&:hover': { bgcolor: '#1565c0', boxShadow: 'none' },
                                }}
                            >
                                {knowledgeUploading ? 'Processing...' : 'Process PDF'}
                            </Button>
                        </Box>
                    </Box>
                </Paper>

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
                            px: 3,
                            '& .MuiTab-root': { color: '#AAA', fontWeight: 700, py: 2.5 },
                            '& .Mui-selected': { color: `${luxuryColors.maroon} !important` },
                            '& .MuiTabs-indicator': { backgroundColor: luxuryColors.gold, height: 4 }
                        }}
                    >
                        <Tab icon={<AutoGraph />} label="CURATION AI" iconPosition="start" />
                        <Tab icon={<ShoppingBag />} label="ORDER REGISTRY" iconPosition="start" />
                    </Tabs>
                </Paper>

                {tabValue === 0 && (
                    <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                        {/* SIDEBAR: Image Curation */}
                        <Box sx={{ width: 360, flexShrink: 0, position: 'sticky', top: 100 }}>
                            <Paper sx={{ p: 4, borderRadius: '24px', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon }}>
                                    Image Curation
                                </Typography>
                                <Box sx={{ border: '2px dashed #EEE', borderRadius: '20px', minHeight: 350, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', bgcolor: '#FAFAFA' }}>
                                    <input accept="image/*" style={{ display: 'none' }} id="admin-upload" type="file" onChange={handleImageChange} />
                                    {!previewUrl ? (
                                        <label htmlFor="admin-upload" style={{ cursor: 'pointer', textAlign: 'center', width: '100%' }}>
                                            <CloudUpload sx={{ fontSize: 60, color: luxuryColors.gold, mb: 2, opacity: 0.5 }} />
                                            <Typography sx={{ fontSize: '14px', fontWeight: 800, color: '#999', letterSpacing: '1px' }}>UPLOAD DESIGN</Typography>
                                        </label>
                                    ) : (
                                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '350px', objectFit: 'contain' }} />
                                    )}
                                </Box>
                                <Stack spacing={2} sx={{ mt: 3 }}>
                                    <Button component="label" htmlFor="admin-upload" fullWidth variant="outlined" sx={{ py: 1.5, borderRadius: '12px', color: luxuryColors.maroon, borderColor: luxuryColors.maroon, fontWeight: 700 }}>
                                        REPLACE IMAGE
                                    </Button>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => handleAnalyze()}
                                        disabled={analyzing || !previewUrl}
                                        sx={{
                                            py: 2,
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
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                        <Typography variant="h4" sx={{ fontWeight: 900, fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon }}>
                                            Analysis Results
                                        </Typography>
                                        <Chip label="AI CURATED" sx={{ bgcolor: luxuryColors.gold, color: 'white', fontWeight: 800, fontSize: '10px' }} />
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
                                <Paper sx={{ p: 10, borderRadius: '24px', textAlign: 'center', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.05)', opacity: 0.8, minHeight: 600, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                    <AutoGraph sx={{ fontSize: 80, color: luxuryColors.gold, mb: 3, opacity: 0.3 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon }}>
                                        Ready for AI Curation
                                    </Typography>
                                    <Typography sx={{ color: '#666', maxWidth: 400, mx: 'auto' }}>
                                        Upload a design image to see analysis results appear right here on the side.
                                    </Typography>
                                </Paper>
                            )}
                        </Box>
                    </Box>
                )}

                {tabValue === 1 && (
                    <TableContainer component={Paper} sx={{ borderRadius: '20px', border: '1px solid rgba(0,0,0,0.05)' }}>
                        <Table>
                            <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>ORDER ID</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>CUSTOMER</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>TOTAL</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>ACTION</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loadingOrders ? (
                                    <TableRow><TableCell colSpan={4} align="center" sx={{ py: 10 }}><CircularProgress /></TableCell></TableRow>
                                ) : orders.map(order => (
                                    <TableRow key={order._id}>
                                        <TableCell sx={{ fontWeight: 700, color: luxuryColors.maroon }}>#{order._id.slice(-8).toUpperCase()}</TableCell>
                                        <TableCell>{order.user_email}</TableCell>
                                        <TableCell sx={{ fontWeight: 800 }}>₹{order.total_amount}</TableCell>
                                        <TableCell>
                                            <Button size="small" variant="outlined" sx={{ borderRadius: '50px', color: luxuryColors.gold, borderColor: luxuryColors.gold }} onClick={() => handleOrderAnalysis(order._id, 0)}>ANALYZE</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Container>
        </Box>
    );
};

export default AdminPanel;