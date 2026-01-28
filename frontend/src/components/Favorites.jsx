import React from 'react';
import {
    Box,
    Typography,
    IconButton,
    Container,
    Divider,
    Rating,
    Stack,
    Button
} from '@mui/material';
import {
    ArrowBack,
    DeleteOutline,
    Star
} from '@mui/icons-material';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFBE6', // Updated to match ProductSelect
    text: '#212121',
    grey: '#878787',
    green: '#388e3c'
};

export default function Favorites({ favorites, onBack, onRemove, onAddToCart, onBuyNow, cart = [] }) {
    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: luxuryColors.ivory,
            pb: 4,
            backgroundImage: `radial-gradient(circle at 80% 0%, rgba(227, 160, 24, 0.08) 0%, transparent 50%), 
                             radial-gradient(circle at 0% 100%, rgba(179, 139, 0, 0.08) 0%, transparent 50%)`
        }}>
            {/* Header */}
            <Box sx={{
                bgcolor: 'white',
                borderBottom: '1px solid rgba(76, 0, 19, 0.1)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <Container maxWidth="lg" sx={{ py: 2, display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={onBack} sx={{ mr: 2, color: luxuryColors.maroon }}>
                        <ArrowBack />
                    </IconButton>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif' }}>
                        My Wishlist ({favorites.length})
                    </Typography>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ mt: 3 }}>
                {favorites.length === 0 ? (
                    <Box sx={{
                        bgcolor: 'white',
                        minHeight: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
                        borderRadius: '16px',
                        p: 4
                    }}>
                        <img
                            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png"
                            alt="Empty Wishlist"
                            style={{ width: '200px', marginBottom: '20px', opacity: 0.8 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif' }}>Your Wishlist is Empty</Typography>
                        <Typography sx={{ color: luxuryColors.grey, mb: 3 }}>Explore our collections and save your favourites here!</Typography>
                        <Button
                            variant="outlined"
                            onClick={onBack}
                            sx={{
                                color: luxuryColors.maroon,
                                borderColor: luxuryColors.maroon,
                                borderRadius: '50px',
                                px: 4,
                                textTransform: 'none',
                                fontWeight: 700,
                                '&:hover': {
                                    bgcolor: 'rgba(76, 0, 19, 0.05)',
                                    borderColor: luxuryColors.maroon
                                }
                            }}
                        >
                            Explore Collection
                        </Button>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {favorites.map((item, index) => {
                            // Normalize data
                            const image = item.preview_url || item.image;
                            const title = item.product_name || item.name;
                            const price = item.price || (item.estimated_price ? `₹${item.estimated_price}` : 'Price on Request');
                            const originalPrice = item.originalPrice || '₹3,999';
                            const discount = item.discount || '50% off';
                            const rating = item.rating || 4.2;
                            const reviews = item.reviews || 120;

                            const itemId = item.id || item.product_id;
                            const isInCart = cart.some(c => (c.id || c.product_id) === itemId);

                            return (
                                <Box key={index} sx={{
                                    bgcolor: 'white',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    position: 'relative',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid transparent',
                                    '&:hover': {
                                        boxShadow: '0 10px 30px rgba(76, 0, 19, 0.08)',
                                        borderColor: 'rgba(179, 139, 0, 0.3)',
                                        transform: 'translateY(-2px)'
                                    }
                                }}>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onRemove(index);
                                        }}
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            right: 12,
                                            color: '#999',
                                            '&:hover': { color: '#d32f2f', bgcolor: 'rgba(211, 47, 47, 0.05)' }
                                        }}
                                    >
                                        <DeleteOutline />
                                    </IconButton>

                                    {/* Image Section */}
                                    <Box sx={{
                                        width: 140,
                                        height: 160,
                                        flexShrink: 0,
                                        mr: 4,
                                        mb: { xs: 2, sm: 0 },
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        bgcolor: '#f8f8f8'
                                    }}>
                                        <img
                                            src={image}
                                            alt={title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </Box>

                                    {/* Content Section */}
                                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <Typography sx={{
                                            fontSize: '18px',
                                            fontWeight: 700,
                                            color: luxuryColors.maroon,
                                            mb: 1,
                                            fontFamily: '"Playfair Display", serif',
                                            width: '90%',
                                        }}>
                                            {title}
                                        </Typography>

                                        {/* Rating Badge */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                            <Box sx={{
                                                bgcolor: luxuryColors.gold,
                                                color: 'white',
                                                px: 0.8,
                                                py: 0.2,
                                                borderRadius: '4px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                fontSize: '11px',
                                                fontWeight: 800
                                            }}>
                                                {rating} <Star sx={{ fontSize: 10 }} />
                                            </Box>
                                            <Typography sx={{ color: luxuryColors.grey, fontSize: '13px', fontWeight: 500 }}>
                                                ({reviews} Reviews)
                                            </Typography>
                                        </Box>

                                        {/* Price Section */}
                                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                                            <Typography sx={{ fontSize: '20px', fontWeight: 800, color: luxuryColors.text }}>
                                                {price}
                                            </Typography>
                                            <Typography sx={{ fontSize: '14px', textDecoration: 'line-through', color: luxuryColors.grey }}>
                                                {originalPrice}
                                            </Typography>
                                            <Typography sx={{ fontSize: '14px', color: luxuryColors.green, fontWeight: 700, bgcolor: 'rgba(56, 142, 60, 0.1)', px: 1, borderRadius: '4px' }}>
                                                {discount}
                                            </Typography>
                                        </Stack>

                                        {/* Action Buttons */}
                                        <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                                            <Button
                                                variant="contained"
                                                onClick={(e) => { e.stopPropagation(); onBuyNow(item); }}
                                                sx={{
                                                    bgcolor: luxuryColors.maroon,
                                                    fontWeight: 700,
                                                    boxShadow: '0 4px 10px rgba(76, 0, 19, 0.2)',
                                                    textTransform: 'none',
                                                    px: 4,
                                                    borderRadius: '50px',
                                                    '&:hover': { bgcolor: '#2a000a', boxShadow: '0 6px 15px rgba(76, 0, 19, 0.3)' }
                                                }}
                                            >
                                                Buy Now
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                disabled={isInCart}
                                                onClick={(e) => { e.stopPropagation(); onAddToCart(item); }}
                                                sx={{
                                                    borderColor: luxuryColors.maroon,
                                                    color: luxuryColors.maroon,
                                                    fontWeight: 700,
                                                    textTransform: 'none',
                                                    px: 3,
                                                    borderRadius: '50px',
                                                    '&:hover': { borderColor: luxuryColors.maroon, bgcolor: 'rgba(76, 0, 19, 0.05)' },
                                                    '&.Mui-disabled': {
                                                        borderColor: '#eee',
                                                        color: '#999',
                                                        bgcolor: '#f5f5f5'
                                                    }
                                                }}
                                            >
                                                {isInCart ? "In Bag" : "Add to Bag"}
                                            </Button>
                                        </Stack>

                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}
            </Container>
        </Box>
    );
}
