import React from 'react';
import { Box, Typography, Grid, IconButton, Button, Card, CardContent } from '@mui/material';
import { ArrowBack, DeleteOutline, ShoppingBagOutlined } from '@mui/icons-material';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFDF5',
};

export default function Favorites({ favorites, onBack, onRemove, onMoveToBag }) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: luxuryColors.ivory, p: { xs: 2, md: 8 }, pt: { xs: 12, md: 16 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 6 }}>
                <IconButton onClick={onBack} sx={{ mr: 2, color: luxuryColors.maroon, bgcolor: 'white' }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h3" sx={{ fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, fontWeight: 800 }}>
                    My Favourites
                </Typography>
            </Box>

            {favorites.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
                    <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon }}>
                        Your wishlist is empty.
                    </Typography>
                    <Button onClick={onBack} sx={{ mt: 2, color: luxuryColors.gold, fontWeight: 700 }}>
                        Start Designing
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={4}>
                    {favorites.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ borderRadius: '24px', overflow: 'hidden', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
                                <Box sx={{ height: 400, bgcolor: '#f5f5f5', position: 'relative' }}>
                                    <img
                                        src={item.preview_url}
                                        alt={item.product_name}
                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                    />
                                    <IconButton
                                        onClick={() => onRemove(index)}
                                        sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'white', color: '#d32f2f', '&:hover': { bgcolor: '#ffebee' } }}
                                    >
                                        <DeleteOutline />
                                    </IconButton>
                                </Box>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" sx={{ color: luxuryColors.maroon, fontWeight: 800, fontFamily: '"Playfair Display", serif' }}>
                                        {item.product_name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#888', display: 'block', mb: 2 }}>
                                        {item.fabric_type} • {item.dress_type}
                                    </Typography>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => onMoveToBag(item, index)}
                                        startIcon={<ShoppingBagOutlined />}
                                        sx={{
                                            bgcolor: luxuryColors.maroon,
                                            borderRadius: '50px',
                                            textTransform: 'none',
                                            fontWeight: 700,
                                            py: 1.5
                                        }}
                                    >
                                        Move to Bag
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
