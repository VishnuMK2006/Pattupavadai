import { useState } from 'react';
import { Box, Button, Typography, Card, CardContent, CardMedia, Chip, Grid, Container } from '@mui/material';
import { Star, LocalOffer } from '@mui/icons-material';

// Import the available category thumbnails
import pattuImageUrl from '../assets/category/i1.png';
import ethnicFrockImageUrl from '../assets/category/i2.png';
import kurthaImageUrl from '../assets/category/i3.png';

const defaultProducts = [
  {
    id: "pattu-paavadai",
    name: "Pattu Paavadai",
    blurb: "Handwoven silk skirt set crafted for festive shine.",
    tag: "Traditional",
    price: "₹1,500",
    originalPrice: "₹3,999",
    discount: "50% off",
    rating: 4.5,
    reviews: 234,
    image: pattuImageUrl
  },
  {
    id: "ethnic-frock",
    name: "Ethnic Frock",
    blurb: "Lightweight frock with zari trims for celebrations.",
    tag: "Festive",
    price: "₹1,499",
    originalPrice: "₹2,999",
    discount: "50% off",
    rating: 4.3,
    reviews: 156,
    image: ethnicFrockImageUrl,
    comingSoon: true
  },
  {
    id: "kurta-pyjama",
    name: "Kurta Pyjama",
    blurb: "Classic kurta with comfy pyjama for all-day wear.",
    tag: "Casual",
    price: "₹1,799",
    originalPrice: "₹3,499",
    discount: "49% off",
    rating: 4.6,
    reviews: 189,
    image: kurthaImageUrl,
    comingSoon: true
  },
];

const FALLBACK_IMAGES = {
  'pattu-paavadai': pattuImageUrl,
  'ethnic-frock': ethnicFrockImageUrl,
  'kurta-pyjama': kurthaImageUrl
};

export default function ProductSelect({ onSelect, products = defaultProducts, user, onSignOut }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const handleProductClick = (product) => {
    onSelect?.(product);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#FFFFFF',
        pb: 4,
      }}
    >
      {/* Header Bar */}
      <Box
        sx={{
          bgcolor: '#2874F0',
          color: 'white',
          py: 1.5,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Typography
          sx={{
            fontSize: 24,
            fontWeight: 700,
            fontFamily: 'Arial, sans-serif',
            fontStyle: 'italic',
          }}
        >
          Kuzhavi_kids
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {user && (
            <Typography
              sx={{
                fontSize: 14,
                color: 'white',
                fontFamily: 'Arial, sans-serif',
              }}
            >
              Hello, {user.email?.split('@')[0]}
            </Typography>
          )}
          {onSignOut && (
            <Button
              onClick={onSignOut}
              sx={{
                color: 'white',
                textTransform: 'none',
                fontSize: 14,
                fontFamily: 'Arial, sans-serif',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Sign Out
            </Button>
          )}
        </Box>
      </Box>

      {/* Breadcrumb & Title Section */}
      <Container maxWidth="xl" sx={{ mt: 3 }}>
        <Typography
          sx={{
            fontSize: 12,
            color: '#666666',
            mb: 1,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          Home › Clothing › Ethnic Wear
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: 22,
              fontWeight: 500,
              color: '#111111',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Select your category
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontSize: 22,
              fontWeight: 500,
              color: '#111111',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Traditional Wear
          </Typography>
        </Box>

        <Typography
          sx={{
            fontSize: 13,
            color: '#666666',
            mb: 3,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {products.length} Products
        </Typography>

        {/* Sort Options */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 3,
            pb: 2,
            borderBottom: '1px solid #E0E0E0',
          }}
        >
          <Typography
            sx={{
              fontSize: 13,
              color: '#111111',
              fontWeight: 600,
              fontFamily: 'Arial, sans-serif',
            }}
          >
            Sort By:
          </Typography>
          {['Relevance', 'Popularity', 'Price -- Low to High', 'Newest First'].map((option, idx) => (
            <Button
              key={option}
              sx={{
                textTransform: 'none',
                fontSize: 13,
                color: idx === 0 ? '#2874F0' : '#666666',
                fontWeight: idx === 0 ? 600 : 400,
                minWidth: 'auto',
                px: 1,
                fontFamily: 'Arial, sans-serif',
                '&:hover': {
                  bgcolor: 'transparent',
                  color: '#2874F0',
                },
              }}
            >
              {option}
            </Button>
          ))}
        </Box>

        {/* Product Grid */}
        <Grid container spacing={2}>
          {products.map((product) => {
            const productImage = product.image ?? FALLBACK_IMAGES[product.id] ?? pattuImageUrl;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid #E0E0E0',
                    borderRadius: '4px',
                    transition: 'all 0.2s ease',
                    boxShadow: hoveredProduct === product.id 
                      ? '0 4px 12px rgba(0,0,0,0.15)' 
                      : '0 2px 4px rgba(0,0,0,0.08)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image */}
                  <Box sx={{ position: 'relative', bgcolor: '#FAFAFA' }}>
                    <CardMedia
                      component="img"
                      image={productImage}
                      alt={product.name}
                      sx={{
                        height: 280,
                        objectFit: 'contain',
                        p: 2,
                        filter: product.comingSoon ? 'grayscale(100%)' : 'none',
                        opacity: product.comingSoon ? 0.6 : 1,
                      }}
                    />
                    
                    {/* Discount Badge */}
                    {product.discount && (
                      <Chip
                        icon={<LocalOffer sx={{ fontSize: 14, color: 'white !important' }} />}
                        label={product.discount}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          bgcolor: '#FF9900',
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 600,
                          height: 24,
                          fontFamily: 'Arial, sans-serif',
                          '& .MuiChip-icon': {
                            color: 'white',
                          },
                        }}
                      />
                    )}

                    {/* Tag Badge or Coming Soon */}
                    {product.comingSoon ? (
                      <Chip
                        label="Coming Soon"
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: '#666666',
                          color: 'white',
                          fontSize: 11,
                          fontWeight: 600,
                          height: 22,
                          fontFamily: 'Arial, sans-serif',
                        }}
                      />
                    ) : product.tag && (
                      <Chip
                        label={product.tag}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: '#2874F0',
                          color: 'white',
                          fontSize: 11,
                          fontWeight: 500,
                          height: 22,
                          fontFamily: 'Arial, sans-serif',
                        }}
                      />
                    )}
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    {/* Product Name */}
                    <Typography
                      sx={{
                        fontSize: 15,
                        fontWeight: 500,
                        color: '#111111',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontFamily: 'Arial, sans-serif',
                        lineHeight: 1.4,
                      }}
                    >
                      {product.name}
                    </Typography>

                    {/* Product Description */}
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: '#666666',
                        mb: 1.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        fontFamily: 'Arial, sans-serif',
                        lineHeight: 1.3,
                      }}
                    >
                      {product.blurb}
                    </Typography>

                    {/* Rating */}
                    {product.rating && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.3,
                            bgcolor: '#388E3C',
                            color: 'white',
                            px: 0.8,
                            py: 0.2,
                            borderRadius: '4px',
                          }}
                        >
                          <Typography sx={{ fontSize: 12, fontWeight: 600, fontFamily: 'Arial, sans-serif' }}>
                            {product.rating}
                          </Typography>
                          <Star sx={{ fontSize: 12 }} />
                        </Box>
                        <Typography sx={{ fontSize: 12, color: '#666666', fontFamily: 'Arial, sans-serif' }}>
                          ({product.reviews?.toLocaleString() || 0})
                        </Typography>
                      </Box>
                    )}

                    {/* Price */}
                    <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1.5 }}>
                      <Typography
                        sx={{
                          fontSize: 20,
                          fontWeight: 600,
                          color: '#111111',
                          fontFamily: 'Arial, sans-serif',
                        }}
                      >
                        {product.price || '₹1,999'}
                      </Typography>
                      {product.originalPrice && (
                        <Typography
                          sx={{
                            fontSize: 14,
                            color: '#666666',
                            textDecoration: 'line-through',
                            fontFamily: 'Arial, sans-serif',
                          }}
                        >
                          {product.originalPrice}
                        </Typography>
                      )}
                      {product.discount && (
                        <Typography
                          sx={{
                            fontSize: 13,
                            color: '#388E3C',
                            fontWeight: 600,
                            fontFamily: 'Arial, sans-serif',
                          }}
                        >
                          {product.discount}
                        </Typography>
                      )}
                    </Box>

                    {/* Add to Cart Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      disabled={product.comingSoon}
                      sx={{
                        bgcolor: product.comingSoon ? '#E0E0E0' : '#FF9900',
                        color: product.comingSoon ? '#999999' : '#111111',
                        textTransform: 'none',
                        fontSize: 14,
                        fontWeight: 500,
                        py: 1,
                        borderRadius: '4px',
                        boxShadow: 'none',
                        fontFamily: 'Arial, sans-serif',
                        '&:hover': {
                          bgcolor: product.comingSoon ? '#E0E0E0' : '#E88900',
                          boxShadow: 'none',
                        },
                        '&.Mui-disabled': {
                          bgcolor: '#E0E0E0',
                          color: '#999999',
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!product.comingSoon) {
                          handleProductClick(product);
                        }
                      }}
                    >
                      {product.comingSoon ? 'Coming Soon' : 'Select & Customize'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Free Delivery Banner */}
        <Box
          sx={{
            mt: 4,
            p: 2,
            bgcolor: '#F2F2F2',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              color: '#111111',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            ✓ Free Delivery on orders above ₹500 | ✓ Cash on Delivery available
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
