import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
  Divider,
  Chip
} from '@mui/material';
import {
  Close,
  DeleteOutline,
  ShoppingBag
} from '@mui/icons-material';

export default function CartDrawer({ open, onClose, cartItems, onRemoveItem, onCheckout }) {
  const totalAmount = cartItems.reduce((sum, item) => sum + 1500, 0); // Assuming fixed price for now

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: 400 },
          background: '#0f172a',
          color: 'white',
          borderLeft: '1px solid rgba(255,255,255,0.1)'
        }
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ShoppingBag sx={{ color: '#60a5fa' }} />
            <Typography variant="h6" fontWeight={700}>Your Cart ({cartItems.length})</Typography>
          </Box>
          <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: 'white' } }}>
            <Close />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 3 }} />

        <Box sx={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {cartItems.length === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5 }}>
              <ShoppingBag sx={{ fontSize: 60, mb: 2 }} />
              <Typography>Your cart is empty</Typography>
            </Box>
          ) : (
            cartItems.map((item, index) => (
              <Box 
                key={index}
                sx={{ 
                  p: 2, 
                  background: 'rgba(255,255,255,0.03)', 
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative'
                }}
              >
                <IconButton 
                  size="small" 
                  onClick={() => onRemoveItem && onRemoveItem(index)}
                  sx={{ 
                    position: 'absolute', 
                    top: 8, 
                    right: 8, 
                    color: '#ef4444',
                    opacity: 0.6,
                    '&:hover': { opacity: 1, background: 'rgba(239, 68, 68, 0.1)' }
                  }}
                >
                  <DeleteOutline fontSize="small" />
                </IconButton>

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
                  {item.product_name}
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block', mb: 1.5 }}>
                  {item.fabric_name} • {item.fabric_type}
                </Typography>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                   <Chip label={item.dress_type} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: '10px' }} />
                   <Chip label={item.sleeve_type} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: '10px' }} />
                   <Chip label={item.neck_design} size="small" sx={{ background: 'rgba(255,255,255,0.05)', color: '#cbd5e1', fontSize: '10px' }} />
                </Stack>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: item.top_color, border: '1px solid rgba(255,255,255,0.3)' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Top</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: item.bottom_color, border: '1px solid rgba(255,255,255,0.3)' }} />
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>Bottom</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end'}}>
                   <Typography variant="subtitle2" fontWeight={700}>₹1,500</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ color: 'rgba(255,255,255,0.7)' }}>Total Amount</Typography>
            <Typography variant="h5" fontWeight={700} sx={{ color: '#2ecc71' }}>₹{totalAmount}</Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            size="large"
            disabled={cartItems.length === 0}
            onClick={onCheckout}
            sx={{
              py: 2,
              background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)',
            }}
          >
            Proceed to Payment
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
