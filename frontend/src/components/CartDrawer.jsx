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
  CardMedia,
} from '@mui/material';
import {
  Close,
  DeleteOutline,
  ShoppingCart,
  LocalOffer,
  CheckCircle,
} from '@mui/icons-material';

export default function CartDrawer({ open, onClose, cartItems, onRemoveItem, onCheckout }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + 1500, 0);
  const savings = cartItems.length * 2000; // Mock savings

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 480 },
          background: '#F2F2F2',
        }
      }}
    >
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#F2F2F2' }}>
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E0E0E0',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShoppingCart sx={{ color: '#2874F0', fontSize: 28 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#111111', fontSize: '18px' }}>
                My Cart
              </Typography>
              <Typography variant="caption" sx={{ color: '#666666' }}>
                {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: '#666666', '&:hover': { bgcolor: '#F2F2F2' } }}>
            <Close />
          </IconButton>
        </Box>

        {/* Cart Items */}
        <Box sx={{ 
          flex: 1, 
          overflowY: 'auto', 
          p: 2,
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}>
          {cartItems.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              bgcolor: '#FFFFFF',
              borderRadius: 2,
              p: 4,
            }}>
              <ShoppingCart sx={{ fontSize: 80, color: '#CCCCCC', mb: 2 }} />
              <Typography sx={{ fontSize: '18px', fontWeight: 600, color: '#111111', mb: 1 }}>
                Your cart is empty!
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#666666', textAlign: 'center' }}>
                Add items to get started
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              {cartItems.map((item, index) => (
                <Card 
                  key={index}
                  elevation={0}
                  sx={{ 
                    border: '1px solid #E0E0E0',
                    borderRadius: 1,
                    position: 'relative',
                    '&:hover': {
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {/* Product Image */}
                      {item.preview_url && (
                        <Box
                          sx={{
                            width: 80,
                            height: 80,
                            borderRadius: 1,
                            overflow: 'hidden',
                            border: '1px solid #E0E0E0',
                            flexShrink: 0,
                          }}
                        >
                          <img
                            src={item.preview_url}
                            alt={item.product_name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                          />
                        </Box>
                      )}

                      {/* Product Details */}
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600, 
                            color: '#111111',
                            mb: 0.5,
                            fontSize: '14px',
                          }}
                        >
                          {item.product_name}
                        </Typography>

                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ mb: 1 }}>
                          <Chip 
                            label={item.fabric_type} 
                            size="small" 
                            sx={{ 
                              height: '20px',
                              fontSize: '11px',
                              bgcolor: '#F2F2F2',
                              color: '#666666',
                              fontWeight: 500,
                            }} 
                          />
                          <Chip 
                            label={item.dress_type} 
                            size="small" 
                            sx={{ 
                              height: '20px',
                              fontSize: '11px',
                              bgcolor: '#F2F2F2',
                              color: '#666666',
                              fontWeight: 500,
                            }} 
                          />
                        </Stack>

                        {/* Colors */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box 
                              sx={{ 
                                width: 16, 
                                height: 16, 
                                borderRadius: '50%', 
                                bgcolor: item.top_color, 
                                border: '2px solid #E0E0E0' 
                              }} 
                            />
                            <Typography variant="caption" sx={{ color: '#666666', fontSize: '11px' }}>
                              Top
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box 
                              sx={{ 
                                width: 16, 
                                height: 16, 
                                borderRadius: '50%', 
                                bgcolor: item.bottom_color, 
                                border: '2px solid #E0E0E0' 
                              }} 
                            />
                            <Typography variant="caption" sx={{ color: '#666666', fontSize: '11px' }}>
                              Bottom
                            </Typography>
                          </Box>
                        </Box>

                        {/* Price */}
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                          <Typography 
                            sx={{ 
                              fontSize: '18px', 
                              fontWeight: 700, 
                              color: '#111111' 
                            }}
                          >
                            ₹1,500
                          </Typography>
                          <Typography 
                            sx={{ 
                              fontSize: '14px', 
                              color: '#666666',
                              textDecoration: 'line-through' 
                            }}
                          >
                            ₹3,500
                          </Typography>
                          <Typography 
                            sx={{ 
                              fontSize: '12px', 
                              color: '#2ecc71',
                              fontWeight: 600,
                            }}
                          >
                            57% off
                          </Typography>
                        </Box>
                      </Box>

                      {/* Delete Button */}
                      <IconButton 
                        size="small" 
                        onClick={() => onRemoveItem && onRemoveItem(index)}
                        sx={{ 
                          alignSelf: 'flex-start',
                          color: '#666666',
                          '&:hover': { 
                            color: '#FF0000',
                            bgcolor: 'rgba(255, 0, 0, 0.08)' 
                          }
                        }}
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

        {/* Price Details & Checkout */}
        {cartItems.length > 0 && (
          <Box sx={{ 
            bgcolor: '#FFFFFF',
            borderTop: '1px solid #E0E0E0',
            p: 2,
          }}>
            {/* Price Details */}
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#666666', mb: 1.5 }}>
              PRICE DETAILS
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                  Price ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                  ₹{totalAmount + savings}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                  Discount
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#2ecc71', fontWeight: 600 }}>
                  −₹{savings}
                </Typography>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                  Delivery Charges
                </Typography>
                <Typography sx={{ fontSize: '14px', color: '#2ecc71', fontWeight: 600 }}>
                  FREE
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#111111' }}>
                Total Amount
              </Typography>
              <Typography sx={{ fontSize: '16px', fontWeight: 700, color: '#111111' }}>
                ₹{totalAmount}
              </Typography>
            </Box>

            <Box sx={{ 
              bgcolor: '#2ecc71',
              color: '#FFFFFF',
              p: 1,
              borderRadius: 1,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}>
              <CheckCircle sx={{ fontSize: 16 }} />
              <Typography sx={{ fontSize: '12px', fontWeight: 600 }}>
                You will save ₹{savings} on this order
              </Typography>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={onCheckout}
              sx={{
                py: 1.5,
                bgcolor: '#FF9900',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 1,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#E88900',
                  boxShadow: 'none',
                },
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
