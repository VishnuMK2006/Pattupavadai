import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import {
  Close,
  DeleteOutline,
  ShoppingBagOutlined,
  VerifiedUserOutlined,
  Security
} from '@mui/icons-material';

const luxuryColors = {
  maroon: '#4C0013',
  gold: '#B38B00',
  mustard: '#E3A018',
  ivory: '#FFFDF5',
  text: '#212121',
  blue: '#2874f0',
  grey: '#878787',
  green: '#388e3c'
};

export default function CartDrawer({ open, onClose, cartItems, onRemoveItem, onCheckout }) {
  // Use price from item if available, else default to 1500
  const calculatePrice = (item) => {
    // Remove symbols if present and parse
    if (!item.price) return 1500;
    const priceStr = String(item.price).replace(/[^0-9.]/g, '');
    return Number(priceStr) || 1500;
  };

  const calculateOriginalPrice = (item) => {
    if (!item.originalPrice) return 3999;
    const priceStr = String(item.originalPrice).replace(/[^0-9.]/g, '');
    return Number(priceStr) || 3999;
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + calculatePrice(item), 0);
  const totalOriginalPrice = cartItems.reduce((sum, item) => sum + calculateOriginalPrice(item), 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          background: '#f1f3f6', // Flipkart background color
          borderLeft: 'none'
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{
          p: 2,
          bgcolor: luxuryColors.blue,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <Close />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            My Cart ({cartItems.length})
          </Typography>
        </Box>

        {/* Cart Items */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.length === 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              bgcolor: 'white',
              boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
            }}>
              <img
                src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
                alt="Empty Cart"
                style={{ width: '200px', marginBottom: '20px' }}
              />
              <Typography sx={{ fontSize: '18px', fontWeight: 600, mb: 1 }}>Your cart is empty!</Typography>
              <Typography sx={{ fontSize: '14px', mb: 2 }}>Explore our wide selection and find something you like</Typography>
              <Button
                onClick={onClose}
                variant="contained"
                sx={{ bgcolor: luxuryColors.blue, textTransform: 'none' }}
              >
                Shop Now
              </Button>
            </Box>
          ) : (
            <Stack spacing={2}>
              {cartItems.map((item, index) => {
                const currentPrice = calculatePrice(item);
                const originalPrice = calculateOriginalPrice(item);
                const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);

                return (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <Box sx={{ display: 'flex', p: 2 }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          flexShrink: 0,
                          mr: 2
                        }}
                      >
                        <img
                          src={item.preview_url || item.image}
                          alt={item.product_name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </Box>

                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 500, color: luxuryColors.text, fontSize: '14px', mb: 0.5 }}>
                          {item.product_name || item.name}
                        </Typography>
                        <Typography sx={{ fontSize: '12px', color: '#878787', mb: 1 }}>
                          {item.fabric_type} {item.dress_type && `• ${item.dress_type}`}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography sx={{ fontSize: '12px', color: '#878787', textDecoration: 'line-through' }}>
                            ₹{originalPrice}
                          </Typography>
                          <Typography sx={{ fontSize: '16px', fontWeight: 600, color: luxuryColors.text }}>
                            ₹{currentPrice}
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: luxuryColors.green, fontWeight: 600 }}>
                            {discount}% Off
                          </Typography>
                        </Stack>
                      </Box>
                    </Box>
                    <Divider />
                    <Box sx={{ display: 'flex' }}>
                      <Button
                        fullWidth
                        onClick={() => onRemoveItem(index)}
                        startIcon={<DeleteOutline />}
                        sx={{ py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '14px', borderRadius: 0 }}
                      >
                        Remove
                      </Button>
                    </Box>
                  </Box>
                )
              })}
            </Stack>
          )}

          {/* Price Details - Positioned at bottom of scroll area if content is long, or just after items */}
          {cartItems.length > 0 && (
            <Box sx={{ bgcolor: 'white', p: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#878787', mb: 2, textTransform: 'uppercase' }}>
                Price Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '15px' }}>Price ({cartItems.length} items)</Typography>
                  <Typography sx={{ fontSize: '15px' }}>₹{totalOriginalPrice}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', color: luxuryColors.green }}>
                  <Typography sx={{ fontSize: '15px' }}>Discount</Typography>
                  <Typography sx={{ fontSize: '15px' }}>− ₹{totalDiscount}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography sx={{ fontSize: '15px' }}>Delivery Charges</Typography>
                  <Typography sx={{ fontSize: '15px', color: luxuryColors.green }}>FREE</Typography>
                </Box>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>Total Amount</Typography>
                <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>₹{totalPrice}</Typography>
              </Box>
              <Typography sx={{ fontSize: '14px', color: luxuryColors.green, fontWeight: 600 }}>
                You will save ₹{totalDiscount} on this order
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        {cartItems.length > 0 && (
          <Box sx={{ bgcolor: 'white', p: 2, borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>₹{totalPrice}</Typography>
              <Typography sx={{ fontSize: '12px', color: luxuryColors.blue, cursor: 'pointer', fontWeight: 600 }}>View price details</Typography>
            </Box>
            <Button
              variant="contained"
              onClick={onCheckout}
              sx={{
                bgcolor: '#fb641b', // Flipkart orange
                px: 4,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '2px',
                boxShadow: 'none',
                '&:hover': { bgcolor: '#f4511e', boxShadow: 'none' }
              }}
            >
              Place Order
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
