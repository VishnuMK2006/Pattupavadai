import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Divider,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
import {
  Close,
  DeleteOutline,
  ShoppingBagOutlined,
  LocalOffer,
  VerifiedUserOutlined,
} from '@mui/icons-material';

const luxuryColors = {
  maroon: '#4C0013',
  gold: '#B38B00',
  mustard: '#E3A018',
  ivory: '#FFFDF5',
  text: '#2A000A',
  goldLight: '#D4AF37'
};

export default function CartDrawer({ open, onClose, cartItems, onRemoveItem, onCheckout }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + 1500, 0);
  const savings = cartItems.length * 2000;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 450 },
          background: luxuryColors.ivory,
          borderLeft: '1px solid rgba(0,0,0,0.05)'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{
          p: 4,
          bgcolor: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif' }}>
              Your Bag
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(0,0,0,0.4)', fontWeight: 700, letterSpacing: '1px' }}>
              {cartItems.length} {cartItems.length === 1 ? 'PIECE' : 'PIECES'}
            </Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: luxuryColors.maroon }}>
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          {cartItems.length === 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80%',
              textAlign: 'center'
            }}>
              <ShoppingBagOutlined sx={{ fontSize: 60, color: 'rgba(76, 0, 19, 0.1)', mb: 3 }} />
              <Typography sx={{ fontSize: '20px', fontWeight: 800, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif', mb: 1 }}>
                Your bag is empty
              </Typography>
              <Button onClick={onClose} startIcon={<Close />} sx={{ color: luxuryColors.gold, fontWeight: 700 }}>CONTINUE SHOPPING</Button>
            </Box>
          ) : (
            <Stack spacing={3}>
              {cartItems.map((item, index) => (
                <Card
                  key={index}
                  elevation={0}
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '20px',
                    border: '1px solid rgba(0,0,0,0.03)',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {/* Product Image */}
                      <Box
                        sx={{
                          width: 100,
                          height: 120,
                          borderRadius: '12px',
                          overflow: 'hidden',
                          bgcolor: luxuryColors.ivory,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.preview_url || "https://placehold.co/100x120?text=Kuzhavi"}
                          alt={item.product_name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>

                      {/* Product Details */}
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 800, color: luxuryColors.text, fontSize: '15px', mb: 1, fontFamily: '"Playfair Display", serif' }}>
                          {item.product_name}
                        </Typography>

                        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                          <Chip label={item.fabric_type} size="small" sx={{ height: '20px', fontSize: '10px', bgcolor: luxuryColors.ivory, color: luxuryColors.maroon, fontWeight: 700 }} />
                          <Chip label={item.dress_type} size="small" sx={{ height: '20px', fontSize: '10px', bgcolor: luxuryColors.ivory, color: luxuryColors.maroon, fontWeight: 700 }} />
                        </Stack>

                        {/* Price */}
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography sx={{ fontSize: '18px', fontWeight: 800, color: luxuryColors.maroon }}>₹1,500</Typography>
                          <Typography sx={{ fontSize: '13px', color: '#BBB', textDecoration: 'line-through' }}>₹3,500</Typography>
                        </Box>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => onRemoveItem && onRemoveItem(index)}
                        sx={{ alignSelf: 'flex-start', color: '#DDD', '&:hover': { color: luxuryColors.maroon } }}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Box>

        {/* Checkout Section */}
        {cartItems.length > 0 && (
          <Box sx={{ bgcolor: 'white', p: 4, pt: 3, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
            <Stack spacing={2} sx={{ mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
                <Typography sx={{ fontSize: '14px' }}>Subtotal</Typography>
                <Typography sx={{ fontSize: '14px' }}>₹{totalAmount + savings}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', color: '#2ecc71' }}>
                <Typography sx={{ fontSize: '14px' }}>Artisan Discount</Typography>
                <Typography sx={{ fontSize: '14px' }}>−₹{savings}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 800 }}>Total</Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: 800, color: luxuryColors.maroon }}>₹{totalAmount}</Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              fullWidth
              onClick={onCheckout}
              sx={{
                py: 2.5,
                bgcolor: '#4C0013',
                borderRadius: '50px',
                fontWeight: 800,
                fontSize: '15px',
                textTransform: 'none',
                boxShadow: '0 10px 40px rgba(76, 0, 19, 0.2)',
                '&:hover': { bgcolor: '#1A0006' }
              }}
            >
              SECURE CHECKOUT
            </Button>

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.5 }}>
              <VerifiedUserOutlined sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px' }}>100% SECURE TRANSACTIONS</Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
