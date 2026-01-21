import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
  Collapse,
  IconButton,
  Divider,
  Chip,
  Grid,
  Stack,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  LocalShipping,
  Star,
  ArrowBack,
} from '@mui/icons-material';

const luxuryColors = {
  maroon: '#4C0013',
  gold: '#B38B00',
  ivory: '#FFFDF5',
  text: '#2A000A',
  goldLight: '#D4AF37'
};

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  // Calculate delivery date (mock - 3 days from order date)
  const deliveryDate = new Date(order.order_date);
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 3,
        bgcolor: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.05)',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
      }}
    >
      {/* Order Header */}
      <Box sx={{
        bgcolor: luxuryColors.ivory,
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <Box sx={{ display: 'flex', gap: 6, flex: 1 }}>
          <Box>
            <Typography sx={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', mb: 0.5, letterSpacing: '1px', fontWeight: 800 }}>
              ORDER PLACED
            </Typography>
            <Typography sx={{ fontSize: '14px', color: luxuryColors.text, fontWeight: 700 }}>
              {formatDate(order.order_date)}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', mb: 0.5, letterSpacing: '1px', fontWeight: 800 }}>
              TOTAL
            </Typography>
            <Typography sx={{ fontSize: '14px', color: luxuryColors.text, fontWeight: 700 }}>
              ₹{order.total_amount.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ fontSize: '11px', color: 'rgba(0,0,0,0.5)', mb: 0.5, letterSpacing: '1px', fontWeight: 800 }}>
              RECIPIENT
            </Typography>
            <Typography sx={{ fontSize: '14px', color: luxuryColors.maroon, fontWeight: 700 }}>
              {order.user_email.split('@')[0].toUpperCase()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'right' }}>
          <Typography sx={{ fontSize: '11px', color: 'rgba(0,0,0,0.4)', mb: 1 }}>
            ID: {order._id.substring(0, 12).toUpperCase()}
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button size="small" sx={{ textTransform: 'none', color: luxuryColors.maroon, fontWeight: 700 }}>Invoice</Button>
            <Button size="small" sx={{ textTransform: 'none', color: luxuryColors.maroon, fontWeight: 700 }}>Details</Button>
          </Stack>
        </Box>
      </Box>

      {/* Order Items */}
      <Box sx={{ p: 3 }}>
        {order.items.map((item, index) => (
          <Box key={index} sx={{ mb: index < order.items.length - 1 ? 4 : 0 }}>
            {/* Delivery Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Chip
                icon={<LocalShipping sx={{ fontSize: 16, color: '#2ecc71' }} />}
                label={`Delivered ${formatDate(deliveryDate)}`}
                sx={{
                  bgcolor: 'rgba(46, 204, 113, 0.1)',
                  color: '#2ecc71',
                  fontSize: '12px',
                  fontWeight: 800,
                  height: 28,
                }}
              />
            </Box>

            {/* Product Details */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Box
                component="img"
                src={`/images/orders/${order._id}_${index}.png`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x300?text=Heirloom+Piece";
                }}
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '1px solid #F0F0F0',
                  bgcolor: luxuryColors.ivory,
                }}
              />

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: '18px',
                    color: luxuryColors.text,
                    fontWeight: 800,
                    fontFamily: '"Playfair Display", serif',
                    mb: 1,
                  }}
                >
                  {item.product_name}
                </Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6} md={3}>
                    <Typography sx={{ fontSize: '11px', color: '#AAA' }}>FABRIC</Typography>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{item.fabric_type}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography sx={{ fontSize: '11px', color: '#AAA' }}>DRESS</Typography>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{item.dress_type}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography sx={{ fontSize: '11px', color: '#AAA' }}>SLEEVE</Typography>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{item.sleeve_type}</Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Typography sx={{ fontSize: '11px', color: '#AAA' }}>NECK</Typography>
                    <Typography sx={{ fontSize: '13px', fontWeight: 600 }}>{item.neck_design}</Typography>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: luxuryColors.maroon,
                      color: 'white',
                      textTransform: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      px: 3,
                      borderRadius: '50px',
                      '&:hover': { bgcolor: luxuryColors.dark }
                    }}
                  >
                    Order Again
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Star sx={{ fontSize: 16 }} />}
                    sx={{
                      borderColor: '#DDD',
                      color: luxuryColors.text,
                      textTransform: 'none',
                      fontSize: '12px',
                      fontWeight: 700,
                      px: 3,
                      borderRadius: '50px',
                    }}
                  >
                    Write Review
                  </Button>
                </Stack>
              </Box>
            </Box>

            {index < order.items.length - 1 && <Divider sx={{ mt: 4 }} />}
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default function Dashboard({ user, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:8000/orders/${user.email}`)
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch orders", err);
          setLoading(false);
        });
    }
  }, [user]);

  return (
    <Box sx={{ bgcolor: luxuryColors.ivory, minHeight: '100vh', pb: 10 }}>
      {/* Header */}
      <Box sx={{
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 80,
        zIndex: 10,
      }}>
        <Box sx={{
          maxWidth: 1000,
          margin: '0 auto',
          px: 3,
          py: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}>
          <Typography variant="h3" sx={{ fontWeight: 800, color: luxuryColors.maroon, fontFamily: '"Playfair Display", serif' }}>
            My Orders
          </Typography>
          <Button
            startIcon={<ArrowBack />}
            onClick={onBack}
            sx={{
              color: luxuryColors.text,
              textTransform: 'uppercase',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '2px',
            }}
          >
            Store
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ maxWidth: 1000, margin: '0 auto', px: 3, py: 6 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: luxuryColors.maroon }} />
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', mb: 2 }}>Your wardrobe is waiting...</Typography>
            <Button variant="contained" onClick={onBack} sx={{ bgcolor: luxuryColors.gold, borderRadius: '50px', px: 4, py: 1.5 }}>
              Start Customizing
            </Button>
          </Box>
        ) : (
          <Box>
            <Typography sx={{ mb: 4, fontSize: '14px', fontWeight: 700, opacity: 0.6 }}>
              SHOWING {orders.length} PREVIOUS ORDERS
            </Typography>
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
}
