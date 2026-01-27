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
  Search,
  Instagram,
  Facebook,
  Pinterest,
  WhatsApp,
  LocationOn,
  Email,
  Phone,
  ArrowForward,
  PlayCircleOutline,
  FavoriteBorder,
  ShoppingBagOutlined,
  FilterAltOutlined,
  Logout,
  ArrowBack,
  Person
} from '@mui/icons-material';
import { Menu, MenuItem, Divider as MuiDivider, InputAdornment, TextField, Badge } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Import the available category thumbnails
const pattuImageUrl = '/images/pattupavadai.png';
const ethnicFrockImageUrl = '/images/ethnicfrock.jpg';
const kurthaImageUrl = '/images/kurtapyjama.jpg';

const luxuryColors = {
  maroon: '#4C0013',
  gold: '#B38B00',
  mustard: '#E3A018',
  ivory: '#FFFBE6', // Warm Golden Ivory
  dark: '#1A0006',
  goldLight: '#D4AF37'
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

export default function ProductSelect({ onSelect, products = defaultProducts, user, onSignOut, onKnowMore, onShowFavorites, onShowCart, onShowOrders }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProductClick = (product) => {
    if (product.comingSoon) return;
    onSelect?.(product);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: luxuryColors.ivory,
        position: 'relative',
        overflowX: 'hidden',
        backgroundImage: `radial-gradient(circle at 80% 0%, rgba(227, 160, 24, 0.08) 0%, transparent 50%), 
                         radial-gradient(circle at 0% 100%, rgba(179, 139, 0, 0.08) 0%, transparent 50%)`
      }}
    >
      {/* Announcement Bar */}
      <Box sx={{ bgcolor: luxuryColors.maroon, py: 1, textAlign: 'center' }}>
        <Typography sx={{ color: 'white', fontSize: '11px', fontWeight: 700, letterSpacing: '2px' }}>
          FREE SHIPPING ON ALL DOMESTIC ORDERS ABOVE ₹5000 • SHOP NOW
        </Typography>
      </Box>

      {/* Premium Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          color: luxuryColors.maroon,
          zIndex: 1100
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 }, py: 1 }}>
          {/* Left: Logo */}
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
            <Box
              component="img"
              src="/images/logo.jpg"
              sx={{ height: 60, cursor: 'pointer' }}
              onClick={() => window.location.reload()}
            />
          </Box>

          {/* Right: Search & Actions */}
          <Stack direction="row" spacing={3} sx={{ flex: 2, justifyContent: 'flex-end', alignItems: 'center' }}>
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <TextField
                placeholder="Search ethnic wear..."
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: luxuryColors.maroon, opacity: 0.5 }} />
                    </InputAdornment>
                  ),
                  sx: {
                    bgcolor: 'rgba(76, 0, 19, 0.03)',
                    px: 2,
                    py: 1,
                    borderRadius: '50px',
                    fontSize: '13px',
                    width: '280px',
                    transition: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    border: '1px solid transparent',
                    '&:focus-within': {
                      bgcolor: 'white',
                      border: `1px solid rgba(76, 0, 19, 0.1)`,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                    }
                  }
                }}
              />
            </Box>

            {/* Action Icons */}
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton onClick={onShowFavorites}>
                <FavoriteBorder sx={{ color: luxuryColors.maroon }} />
              </IconButton>

              <IconButton onClick={onShowCart}>
                <Badge badgeContent={2} color="error" sx={{ '& .MuiBadge-badge': { bgcolor: luxuryColors.gold } }}>
                  <ShoppingBagOutlined sx={{ color: luxuryColors.maroon }} />
                </Badge>
              </IconButton>

              {/* Profile Menu Trigger */}
              <IconButton onClick={handleProfileMenuOpen} sx={{ ml: 1 }}>
                <Avatar sx={{
                  bgcolor: 'transparent',
                  color: luxuryColors.maroon,
                  width: 32,
                  height: 32,
                  border: `1.5px solid ${luxuryColors.maroon}`
                }}>
                  <Person sx={{ fontSize: 20 }} />
                </Avatar>
              </IconButton>
            </Stack>
          </Stack>

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
            <MenuItem onClick={() => { handleProfileMenuClose(); onShowOrders(); }}>
              <ShoppingBagOutlined sx={{ fontSize: 20, mr: 2, color: luxuryColors.gold }} />
              <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>My Orders</Typography>
            </MenuItem>
            <MenuItem onClick={onSignOut} sx={{ color: '#d32f2f' }}>
              <Logout sx={{ fontSize: 20, mr: 2 }} />
              <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>Sign Out</Typography>
            </MenuItem>
          </Menu>
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
              Find Your <span style={{ fontStyle: 'italic', fontWeight: 400 }}>Perfect Fit</span>
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
                    cursor: product.comingSoon ? 'default' : 'pointer',
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

                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        fullWidth
                        onClick={(e) => {
                          e.stopPropagation();
                          onKnowMore();
                        }}
                        disabled={product.comingSoon}
                        sx={{
                          border: `1px solid ${luxuryColors.maroon}`,
                          color: luxuryColors.maroon,
                          borderRadius: '50px',
                          textTransform: 'none',
                          fontWeight: 700,
                          '&:hover': { bgcolor: 'rgba(76, 0, 19, 0.05)' }
                        }}
                      >
                        See Collection
                      </Button>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => onSelect(product)}
                        disabled={product.comingSoon}
                        sx={{
                          bgcolor: luxuryColors.gold,
                          color: 'white',
                          borderRadius: '50px',
                          textTransform: 'none',
                          fontWeight: 700,
                          boxShadow: 'none',
                          '&:hover': {
                            bgcolor: luxuryColors.goldLight,
                            boxShadow: '0 5px 15px rgba(179, 139, 0, 0.2)'
                          }
                        }}
                      >
                        {product.comingSoon ? 'Design Now' : 'Design Now'}
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
              bgcolor: 'rgba(255,255,255,0.05)',
              border: `2px solid ${luxuryColors.mustard}`,
              opacity: 0.1
            }}
          />
        </Box>
      </Container>
      {/* WhatsApp Float */}
      <IconButton
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          bgcolor: '#25D366',
          color: 'white',
          width: 60,
          height: 60,
          boxShadow: '0 10px 30px rgba(37, 211, 102, 0.3)',
          '&:hover': { bgcolor: '#128C7E', transform: 'scale(1.1)' },
          transition: '0.3s',
          zIndex: 1000
        }}
        onClick={() => window.open('https://wa.me/91XXXXXXXXXX')}
      >
        <WhatsApp sx={{ fontSize: 32 }} />
      </IconButton>

      {/* Footer */}
      <Box sx={{ bgcolor: luxuryColors.maroon, pt: 6, pb: 4, color: 'white', mt: 10 }}>
        <Container maxWidth="lg">
          <Grid container spacing={8} sx={{ mb: 10 }}>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 900, mb: 3 }}>Kuzhavi_Kids</Typography>
              <Typography sx={{ opacity: 0.6, fontSize: '14px', lineHeight: 2, mb: 4 }}>
                Handcrafting memories for your little ones with the touch of tradition and the comfort of modern standards. Based in the heart of South India.
              </Typography>
              <Stack direction="row" spacing={3}>
                <Instagram
                  onClick={() => window.open('https://www.instagram.com/kuzhavi_kids_clothing/?hl=en', '_blank')}
                  sx={{ cursor: 'pointer', '&:hover': { color: luxuryColors.gold } }}
                />
                <Facebook
                  onClick={() => window.open('https://www.facebook.com/p/kuzhavi_kids_clothing-100083258953249/', '_blank')}
                  sx={{ cursor: 'pointer', '&:hover': { color: luxuryColors.gold } }}
                />
                <Pinterest
                  onClick={() => window.open('https://in.pinterest.com/kuzhavikidswear/', '_blank')}
                  sx={{ cursor: 'pointer', '&:hover': { color: luxuryColors.gold } }}
                />
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '12px', letterSpacing: '2px' }}>QUICK LINKS</Typography>
              <Stack spacing={2}>
                {['Collections', 'New Arrivals', 'Ready to dispatch', 'Gift Cards'].map(l => (
                  <Typography
                    key={l}
                    sx={{ opacity: 0.6, fontSize: '14px', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                  >
                    {l}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={6} md={2}>
              <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '12px', letterSpacing: '2px' }}>POLICIES</Typography>
              <Stack spacing={2}>
                {['Shipping', 'Returns', 'Privacy', 'Size Guide'].map(l => (
                  <Typography
                    key={l}
                    sx={{ opacity: 0.6, fontSize: '14px', cursor: 'pointer', '&:hover': { opacity: 1 } }}
                  >
                    {l}
                  </Typography>
                ))}
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography sx={{ fontWeight: 800, mb: 3, fontSize: '12px', letterSpacing: '2px' }}>STAY IN TOUCH</Typography>
              <Box sx={{ display: 'flex', bgcolor: 'rgba(255,255,255,0.05)', p: 1, borderRadius: '4px' }}>
                <TextField
                  variant="standard"
                  placeholder="Enter your email"
                  InputProps={{ disableUnderline: true, sx: { color: 'white', px: 2, fontSize: '14px' } }}
                  fullWidth
                />
                <Button sx={{ color: luxuryColors.maroon, bgcolor: luxuryColors.gold, fontWeight: 700 }}>JOIN</Button>
              </Box>
            </Grid>
          </Grid>

          <MuiDivider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 4 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>© 2024 Kuzhavi Kids Clothing. All rights reserved.</Typography>
            <Stack direction="row" spacing={3}>
              <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>Terms</Typography>
              <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>Privacy</Typography>
              <Typography sx={{ fontSize: '12px', opacity: 0.4 }}>Cookies</Typography>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
