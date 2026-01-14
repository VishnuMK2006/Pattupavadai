import { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Container,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Stack,
} from '@mui/material';
import {
  Star,
  LocalOffer,
  FavoriteBorder,
  ShoppingBagOutlined,
  FilterAltOutlined,
  Logout,
  ArrowBack,
  Person,
} from '@mui/icons-material';
import { Menu, MenuItem, Divider as MuiDivider } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Import the available category thumbnails
import pattuImageUrl from '../assets/category/i1.png';
import ethnicFrockImageUrl from '../assets/category/i2.png';
import kurthaImageUrl from '../assets/category/i3.png';

const luxuryColors = {
  maroon: '#4C0013',
  gold: '#B38B00',
  ivory: '#FFFDF5',
  dark: '#1A0006',
  goldLight: '#D4AF37',
  textHeader: '#333'
};

const defaultProducts = [
  {
    id: "pattu-paavadai",
    name: "Classic Pattu Paavadai",
    blurb: "Handwoven Kanchipuram silk skirt set with intricate zari work.",
    tag: "Artisan Choice",
    price: "₹1,500",
    originalPrice: "₹3,999",
    discount: "62% off",
    rating: 4.8,
    reviews: 234,
    image: pattuImageUrl
  },
  {
    id: "ethnic-frock",
    name: "Golden Zari Frock",
    blurb: "A contemporary ethnic frock with traditional South Indian motifs.",
    tag: "Festive Edit",
    price: "₹1,499",
    originalPrice: "₹2,999",
    discount: "50% off",
    rating: 4.5,
    reviews: 156,
    image: ethnicFrockImageUrl,
    comingSoon: true
  },
  {
    id: "kurta-pyjama",
    name: "Royal Kurta Set",
    blurb: "Elegant Raw Silk Kurta with matching pajamas for the young prince.",
    tag: "Signature",
    price: "₹1,799",
    originalPrice: "₹3,499",
    discount: "49% off",
    rating: 4.7,
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

const MotionCard = motion(Card);

export default function ProductSelect({ onSelect, products = defaultProducts, user, onSignOut }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProductClick = (product) => {
    onSelect?.(product);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: luxuryColors.ivory,
        pb: 10,
      }}
    >
      {/* Premium Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          color: luxuryColors.maroon,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 8 }, py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              onClick={onSignOut}
              sx={{
                color: luxuryColors.maroon,
                bgcolor: 'rgba(76, 0, 19, 0.05)',
                '&:hover': { bgcolor: 'rgba(76, 0, 19, 0.1)' }
              }}
            >
              <ArrowBack />
            </IconButton>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 900,
                fontFamily: '"Playfair Display", serif',
                color: luxuryColors.maroon,
                cursor: 'pointer'
              }}
              onClick={onSignOut}
            >
              Kuzhavi<span style={{ color: luxuryColors.gold }}>_Kids</span>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
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
                <Typography sx={{ fontWeight: 800, color: luxuryColors.maroon, fontSize: '14px' }}>
                  {user?.email?.split('@')[0]}
                </Typography>
                <Typography sx={{ color: '#999', fontSize: '12px' }}>{user?.email}</Typography>
              </Box>
              <MuiDivider />
              <MenuItem onClick={onSignOut} sx={{ color: '#d32f2f' }}>
                <Logout sx={{ fontSize: 20, mr: 2 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Sign Out</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6 }}>
          <Box>
            <Typography
              variant="overline"
              sx={{
                color: luxuryColors.gold,
                fontWeight: 700,
                letterSpacing: '3px'
              }}
            >
              BROWSE COLLECTIONS
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontFamily: '"Playfair Display", serif',
                fontWeight: 800,
                color: luxuryColors.maroon,
                mt: 1
              }}
            >
              Find Their <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Perfect Fit</span>
            </Typography>
          </Box>
          <Button
            startIcon={<FilterAltOutlined />}
            sx={{
              color: luxuryColors.maroon,
              fontWeight: 600,
              border: '1px solid #DDD',
              borderRadius: '50px',
              px: 4
            }}
          >
            FILTERS
          </Button>
        </Box>

        {/* Product Grid */}
        <Grid container spacing={5}>
          {products.map((product, index) => {
            const productImage = product.image ?? FALLBACK_IMAGES[product.id] ?? pattuImageUrl;
            return (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <MotionCard
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: 'white',
                    borderRadius: '24px',
                    transition: '0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    boxShadow: hoveredProduct === product.id
                      ? '0 30px 60px rgba(76, 0, 19, 0.1)'
                      : '0 10px 30px rgba(0,0,0,0.03)',
                    border: hoveredProduct === product.id ? `1px solid ${luxuryColors.gold}` : '1px solid transparent',
                    overflow: 'hidden'
                  }}
                  onClick={() => handleProductClick(product)}
                >
                  {/* Product Image Section */}
                  <Box sx={{ position: 'relative', height: 450, overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      image={productImage}
                      alt={product.name}
                      sx={{
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'scale 0.8s ease',
                        scale: hoveredProduct === product.id ? 1.05 : 1,
                        filter: product.comingSoon ? 'grayscale(100%) blur(2px)' : 'none',
                      }}
                    />

                    {/* Overlay Badges */}
                    <Box sx={{ position: 'absolute', top: 20, left: 20, right: 20, display: 'flex', justifyContent: 'space-between' }}>
                      <Chip
                        label={product.tag}
                        sx={{
                          bgcolor: 'white',
                          color: luxuryColors.maroon,
                          fontWeight: 600,
                          fontSize: '11px',
                          textTransform: 'uppercase',
                          letterSpacing: '1px'
                        }}
                      />
                      <IconButton sx={{ bgcolor: 'white', '&:hover': { bgcolor: luxuryColors.maroon, color: 'white' } }}>
                        <FavoriteBorder sx={{ fontSize: 20 }} />
                      </IconButton>
                    </Box>

                    {product.comingSoon && (
                      <Box sx={{
                        position: 'absolute',
                        inset: 0,
                        bgcolor: 'rgba(26,0,6,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Typography sx={{ color: 'white', fontWeight: 800, letterSpacing: '4px', border: '2px solid white', px: 3, py: 1 }}>
                          COMING SOON
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <CardContent sx={{ p: 4 }}>
                    <Typography
                      sx={{
                        fontSize: '20px',
                        fontWeight: 700,
                        color: luxuryColors.maroon,
                        mb: 1,
                        fontFamily: '"Playfair Display", serif',
                      }}
                    >
                      {product.name}
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: '14px',
                        color: 'rgba(0,0,0,0.5)',
                        mb: 3,
                        minHeight: '42px',
                        lineHeight: 1.5
                      }}
                    >
                      {product.blurb}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography sx={{ fontSize: '12px', color: luxuryColors.gold, fontWeight: 700 }}>
                          PRICE
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography sx={{ fontSize: '24px', fontWeight: 800, color: luxuryColors.maroon }}>
                            {product.price}
                          </Typography>
                          <Typography sx={{ fontSize: '14px', color: '#AAA', textDecoration: 'line-through' }}>
                            {product.originalPrice}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        variant="outlined"
                        disabled={product.comingSoon}
                        sx={{
                          borderColor: luxuryColors.gold,
                          color: luxuryColors.gold,
                          borderRadius: '50px',
                          px: 3,
                          textTransform: 'none',
                          fontWeight: 700,
                          '&:hover': {
                            bgcolor: luxuryColors.gold,
                            color: 'white',
                            borderColor: luxuryColors.gold
                          }
                        }}
                      >
                        {product.comingSoon ? 'Private' : 'Design Now'}
                      </Button>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            );
          })}
        </Grid>

        {/* Luxury Banner */}
        <Box
          sx={{
            mt: 10,
            p: 8,
            bgcolor: luxuryColors.maroon,
            borderRadius: '40px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>Handcrafted with Love</Typography>
            <Typography sx={{ opacity: 0.7, maxWidth: '600px', mx: 'auto', mb: 4 }}>
              Join thousand of parents who trust Kuzhavi Kids for their children's special moments. Premium fabrics, ethical sourcing, and timeless designs.
            </Typography>
            <Stack direction="row" spacing={4} justifyContent="center">
              <Typography sx={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px' }}>✓ GLOBAL SHIPPING</Typography>
              <Typography sx={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px' }}>✓ CUSTOM TAILORING</Typography>
              <Typography sx={{ fontSize: '13px', fontWeight: 700, letterSpacing: '2px' }}>✓ SECURE PAYMENT</Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              position: 'absolute',
              top: -100,
              right: -100,
              width: '300px',
              height: '300px',
              borderRadius: '50%',
              bgcolor: 'rgba(255,255,255,0.05)'
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
