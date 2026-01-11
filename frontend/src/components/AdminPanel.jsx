import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
    Stack,
    Card,
    Divider,
} from '@mui/material';
import { CloudUpload, AutoGraph, Logout } from '@mui/icons-material';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AdminPanel = ({ onSignOut }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

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

    const handleAnalyze = async () => {
        if (!previewUrl) return;
        setAnalyzing(true);
        try {
            setError(null);
            const response = await fetch(`${API_BASE}/analyze-dress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: previewUrl }),
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

    return (
        <Box className="app-shell" sx={{ minHeight: '100vh', p: 4, overflowY: 'auto' }}>
            <Box sx={{ maxWidth: 1400, margin: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6, mt: 2 }}>
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
                            Image <span style={{ color: '#60a5fa' }}>Analysis</span>
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

                <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
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
                                onClick={handleAnalyze}
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
            </Box>
        </Box>
    );
};

export default AdminPanel;
