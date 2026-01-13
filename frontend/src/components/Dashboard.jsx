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
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  LocalShipping,
  Star,
  ArrowBack,
  Download,
  Help,
} from '@mui/icons-material';

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
        mb: 2,
        bgcolor: '#FFFFFF',
        border: '1px solid #E0E0E0',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* Order Header */}
      <Box sx={{ 
        bgcolor: '#F2F2F2', 
        p: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #E0E0E0',
      }}>
        <Box sx={{ display: 'flex', gap: 4, flex: 1 }}>
          <Box>
            <Typography sx={{ fontSize: '11px', color: '#666666', mb: 0.5 }}>
              ORDER PLACED
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#111111', fontWeight: 600 }}>
              {formatDate(order.order_date)}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '11px', color: '#666666', mb: 0.5 }}>
              TOTAL
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#111111', fontWeight: 600 }}>
              ₹{order.total_amount.toLocaleString()}
            </Typography>
          </Box>
          <Box>
            <Typography sx={{ fontSize: '11px', color: '#666666', mb: 0.5 }}>
              SHIP TO
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#2874F0', fontWeight: 600 }}>
              {order.user_email.split('@')[0]} ▾
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography sx={{ fontSize: '11px', color: '#666666' }}>
            ORDER # {order._id.substring(0, 12).toUpperCase()}
          </Typography>
          <Button
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '12px',
              color: '#2874F0',
              minWidth: 'auto',
              p: 0.5,
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            View Order Details
          </Button>
          <Button
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '12px',
              color: '#2874F0',
              minWidth: 'auto',
              p: 0.5,
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            Invoice
          </Button>
        </Box>
      </Box>

      {/* Order Items */}
      <Box sx={{ p: 2 }}>
        {order.items.map((item, index) => (
          <Box key={index} sx={{ mb: index < order.items.length - 1 ? 3 : 0 }}>
            {/* Delivery Status */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Chip
                icon={<LocalShipping sx={{ fontSize: 16, color: '#2ecc71' }} />}
                label={`Delivered ${formatDate(deliveryDate)}`}
                sx={{
                  bgcolor: '#E8F5E9',
                  color: '#2ecc71',
                  fontSize: '13px',
                  fontWeight: 600,
                  height: 28,
                  '& .MuiChip-icon': {
                    ml: 0.5,
                  }
                }}
              />
            </Box>

            {/* Product Details */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                component="img"
                src={`/images/orders/${order._id}_${index}.png`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/150x150?text=Product";
                }}
                sx={{
                  width: 140,
                  height: 140,
                  borderRadius: 1,
                  objectFit: 'cover',
                  border: '1px solid #E0E0E0',
                  bgcolor: '#F2F2F2',
                }}
              />
              
              <Box sx={{ flex: 1 }}>
                <Typography 
                  sx={{ 
                    fontSize: '14px', 
                    color: '#2874F0',
                    fontWeight: 600,
                    mb: 0.5,
                    cursor: 'pointer',
                    '&:hover': { color: '#FF9900', textDecoration: 'underline' }
                  }}
                >
                  {item.product_name}
                </Typography>
                <Typography sx={{ fontSize: '13px', color: '#666666', mb: 1 }}>
                  Fabric: {item.fabric_type}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 1.5 }}>
                  <Typography sx={{ fontSize: '12px', color: '#111111' }}>
                    <strong>Dress Type:</strong> {item.dress_type}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#111111' }}>
                    <strong>Sleeve:</strong> {item.sleeve_type}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#111111' }}>
                    <strong>Neck:</strong> {item.neck_design}
                  </Typography>
                  <Typography sx={{ fontSize: '12px', color: '#111111' }}>
                    <strong>Border:</strong> {item.border_design}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: '#FF9900',
                      color: '#111111',
                      textTransform: 'none',
                      fontSize: '13px',
                      fontWeight: 600,
                      px: 2,
                      py: 0.75,
                      borderRadius: 20,
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#FFCE00',
                        boxShadow: 'none',
                      }
                    }}
                  >
                    Buy it again
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      borderColor: '#CCCCCC',
                      color: '#111111',
                      textTransform: 'none',
                      fontSize: '13px',
                      px: 2,
                      py: 0.75,
                      borderRadius: 20,
                      '&:hover': {
                        borderColor: '#999999',
                        bgcolor: '#F2F2F2',
                      }
                    }}
                  >
                    View your item
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Star sx={{ fontSize: 16 }} />}
                    sx={{
                      color: '#2874F0',
                      textTransform: 'none',
                      fontSize: '13px',
                      px: 1.5,
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline',
                      }
                    }}
                  >
                    Write a product review
                  </Button>
                </Box>
              </Box>
            </Box>

            {index < order.items.length - 1 && (
              <Divider sx={{ mt: 3 }} />
            )}
          </Box>
        ))}

        {/* Order Summary Toggle */}
        {order.items.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box
              onClick={() => setExpanded(!expanded)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                py: 1,
                '&:hover': {
                  bgcolor: '#F2F2F2',
                }
              }}
            >
              <Typography sx={{ fontSize: '13px', color: '#2874F0', fontWeight: 600 }}>
                Order Summary
              </Typography>
              <IconButton size="small" sx={{ color: '#2874F0' }}>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            
            <Collapse in={expanded}>
              <Box sx={{ bgcolor: '#F2F2F2', p: 2, borderRadius: 1, mt: 1 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '12px', color: '#666666', mb: 0.5 }}>
                      Order Total:
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 600 }}>
                      ₹{order.total_amount.toLocaleString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '12px', color: '#666666', mb: 0.5 }}>
                      Payment Method:
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 600 }}>
                      UPI
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '12px', color: '#666666', mb: 0.5 }}>
                      Items:
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#111111', fontWeight: 600 }}>
                      {order.items.length}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography sx={{ fontSize: '12px', color: '#666666', mb: 0.5 }}>
                      Status:
                    </Typography>
                    <Chip 
                      label="Delivered" 
                      size="small" 
                      sx={{ 
                        bgcolor: '#E8F5E9', 
                        color: '#2ecc71',
                        fontSize: '12px',
                        fontWeight: 600,
                        height: 24,
                      }} 
                    />
                  </Grid>
                </Grid>
              </Box>
            </Collapse>
          </>
        )}
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
    <Box sx={{ bgcolor: '#F2F2F2', minHeight: '100vh', pb: 4 }}>
      {/* Header */}
      <Box sx={{ 
        bgcolor: '#FFFFFF', 
        borderBottom: '1px solid #E0E0E0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Box sx={{ 
          maxWidth: 1200, 
          margin: '0 auto', 
          px: 3,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography sx={{ fontSize: '24px', fontWeight: 700, color: '#111111' }}>
            Your Orders
          </Typography>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={onBack}
            sx={{ 
              color: '#666666',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 600,
              '&:hover': { 
                color: '#2874F0',
                bgcolor: 'transparent',
              }
            }}
          >
            Back to Shop
          </Button>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ maxWidth: 1200, margin: '0 auto', px: 3, py: 3 }}>
        {/* Filter Bar */}
        <Paper
          elevation={0}
          sx={{
            mb: 2,
            bgcolor: '#FFFFFF',
            border: '1px solid #E0E0E0',
            borderRadius: 1,
            p: 2,
            display: 'flex',
            gap: 2,
            alignItems: 'center',
          }}
        >
          <Typography sx={{ fontSize: '13px', color: '#111111', fontWeight: 600 }}>
            {orders.length} order{orders.length !== 1 ? 's' : ''} placed
          </Typography>
          <Divider orientation="vertical" flexItem />
          <Button
            size="small"
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              color: '#2874F0',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
            }}
          >
            Past 3 months
          </Button>
        </Paper>

        {/* Orders List */}
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            py: 10,
            bgcolor: '#FFFFFF',
            borderRadius: 1,
          }}>
            <CircularProgress sx={{ color: '#2874F0' }} />
          </Box>
        ) : orders.length === 0 ? (
          <Paper 
            elevation={0}
            sx={{ 
              p: 6, 
              textAlign: 'center', 
              bgcolor: '#FFFFFF',
              border: '1px solid #E0E0E0',
              borderRadius: 1,
            }}
          >
            <Typography sx={{ fontSize: '18px', color: '#111111', fontWeight: 600, mb: 1 }}>
              No orders yet
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#666666', mb: 3 }}>
              Looks like you haven't placed any orders.
            </Typography>
            <Button
              variant="contained"
              onClick={onBack}
              sx={{
                bgcolor: '#FF9900',
                color: '#111111',
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 600,
                px: 3,
                py: 1,
                borderRadius: 20,
                boxShadow: 'none',
                '&:hover': {
                  bgcolor: '#FFCE00',
                  boxShadow: 'none',
                }
              }}
            >
              Start Shopping
            </Button>
          </Paper>
        ) : (
          orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </Box>
    </Box>
  );
}
