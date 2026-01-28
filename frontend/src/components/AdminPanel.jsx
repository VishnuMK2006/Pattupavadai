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

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

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
        <Box sx={{
            bgcolor: luxuryColors.ivory,
            minHeight: '100vh',
            backgroundImage: `radial-gradient(circle at 80% 0%, rgba(179, 139, 0, 0.05) 0%, transparent 50%), 
                             radial-gradient(circle at 0% 100%, rgba(76, 0, 19, 0.02) 0%, transparent 50%)`
        }}>
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
                                <Box sx={{ width: 44, height: 44, borderRadius: '14px', bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                                    <AutoGraph sx={{ color: luxuryColors.maroon, fontSize: 24 }} />
                                </Box>
                            </Box>
                            <Box>
                                <Typography sx={{ color: 'white', fontSize: '24px', fontWeight: 900, fontFamily: '"Playfair Display", serif', letterSpacing: '-0.5px' }}>
                                    Kuzhavi Admin
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                                    Boutique Operations
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
                                <MenuItem onClick={() => { handleProfileMenuClose(); onSignOut(); }} sx={{ color: '#d32f2f' }}>
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
                        border: '1px solid rgba(179, 139, 0, 0.1)',
                        borderRadius: '24px',
                        p: 4,
                        boxShadow: '0 10px 40px rgba(76, 0, 19, 0.02)',
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#1a1a1a', mb: 1 }}>
                                Knowledge Base Upload
                            </Typography>
                            <Typography sx={{ fontSize: '14px', color: '#666', mb: 3, lineHeight: 1.6 }}>
                                Upload product guides, styling tips, or fabric technical data to train the AI Assistant. Use <strong>New DB</strong> to reset or <strong>Append</strong> to expand existing knowledge.
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
                                        sx={{
                                            height: 8,
                                            borderRadius: 4,
                                            bgcolor: `${luxuryColors.gold}20`,
                                            '& .MuiLinearProgress-bar': { bgcolor: luxuryColors.gold }
                                        }}
                                    />
                                    <Typography sx={{ fontSize: '12px', color: luxuryColors.gold, fontWeight: 700, mt: 1.5, letterSpacing: '0.5px' }}>
                                        {knowledgeProgress > 0 ? `${knowledgeProgress}% INGESTED` : 'PROCESSING...'} · ELAPSED {formatDuration(knowledgeElapsed)}
                                        {knowledgeRemaining !== null && Number.isFinite(knowledgeRemaining) && knowledgeProgress < 100 && (
                                            <> · REMAINING {formatDuration(knowledgeRemaining)}</>
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
                                        border: `2px dashed ${luxuryColors.gold}40`,
                                        borderRadius: '20px',
                                        bgcolor: `${luxuryColors.gold}05`,
                                        p: 4,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            borderColor: luxuryColors.gold,
                                            bgcolor: `${luxuryColors.gold}10`,
                                            transform: 'translateY(-2px)'
                                        },
                                    }}
                                >
                                    <CloudUpload sx={{ fontSize: 48, color: luxuryColors.gold, mb: 1.5 }} />
                                    <Typography sx={{ fontSize: '15px', fontWeight: 800, color: luxuryColors.maroon, fontFamily: '"Outfit", sans-serif' }}>
                                        {knowledgeFile ? knowledgeFile.name : 'Select Knowledge PDF'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: '#888', mt: 0.5 }}>
                                        {knowledgeFile ? `${(knowledgeFile.size / 1024 / 1024).toFixed(2)} MB` : 'Upload product guides or fabric info'}
                                    </Typography>
                                </Box>
                            </label>

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
                                    py: 1.5,
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
                    </Box>
                </Paper>

                {/* Tabs */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: 4,
                        bgcolor: '#ffffff',
                        border: '1px solid rgba(179, 139, 0, 0.1)',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                    }}
                >
                    <Tabs
                        value={tabValue}
                        onChange={(e, v) => setTabValue(v)}
                        sx={{
                            px: 3,
                            '& .MuiTab-root': {
                                color: '#888',
                                fontWeight: 800,
                                py: 3,
                                fontSize: '13px',
                                letterSpacing: '1px',
                                transition: '0.3s'
                            },
                            '& .Mui-selected': { color: `${luxuryColors.maroon} !important` },
                            '& .MuiTabs-indicator': { backgroundColor: luxuryColors.gold, height: 3, borderRadius: '3px 3px 0 0' }
                        }}
                    >
                        <Tab icon={<AutoGraph sx={{ fontSize: 20 }} />} label="CURATION AI" iconPosition="start" />
                        <Tab icon={<ShoppingBag sx={{ fontSize: 20 }} />} label="ORDER REGISTRY" iconPosition="start" />
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
                                    <TableCell sx={{ fontWeight: 800, color: luxuryColors.maroon, fontSize: '12px', letterSpacing: '1px' }}>ORDER ID</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: luxuryColors.maroon, fontSize: '12px', letterSpacing: '1px' }}>CUSTOMER</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: luxuryColors.maroon, fontSize: '12px', letterSpacing: '1px' }}>TOTAL</TableCell>
                                    <TableCell sx={{ fontWeight: 800, color: luxuryColors.maroon, fontSize: '12px', letterSpacing: '1px' }}>ACTION</TableCell>
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