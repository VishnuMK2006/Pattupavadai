import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  Collapse,
  IconButton
} from '@mui/material';
import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  ShoppingBag,
  ArrowBack
} from '@mui/icons-material';

function Row({ order }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            sx={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ color: 'white' }}>
          {order._id.substring(0, 8)}...
        </TableCell>
        <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {new Date(order.order_date).toLocaleDateString()}
        </TableCell>
        <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
          {order.items.length} items
        </TableCell>
        <TableCell sx={{ color: '#60a5fa', fontWeight: 600 }}>
          ₹{order.total_amount}
        </TableCell>
        <TableCell>
          <Chip 
            label="Paid" 
            size="small" 
            sx={{ 
              bgcolor: 'rgba(46, 204, 113, 0.2)', 
              color: '#2ecc71',
              border: '1px solid rgba(46, 204, 113, 0.3)'
            }} 
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                Order Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#94a3b8' }}>Product</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>Fabric</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>Dress Type</TableCell>
                    <TableCell sx={{ color: '#94a3b8' }}>Customization</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                        {item.product_name}
                      </TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{item.fabric_type}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>{item.dress_type}</TableCell>
                      <TableCell sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        {item.sleeve_type} • {item.neck_design}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
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
    <Box sx={{ p: 4, pt: 10, maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShoppingBag sx={{ fontSize: 32, color: '#60a5fa' }} />
          <Typography variant="h4" fontWeight={700} sx={{ color: 'white' }}>
             My Orders
          </Typography>
        </Box>
        <Button 
          startIcon={<ArrowBack />} 
          onClick={onBack}
          sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
        >
          Back to Shop
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : orders.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            background: 'rgba(30, 41, 59, 0.6)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)' 
          }}
        >
          <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>No orders found.</Typography>
        </Paper>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            background: 'rgba(30, 41, 59, 0.6)', 
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}
        >
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow sx={{ background: 'rgba(255,255,255,0.03)' }}>
                <TableCell />
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Summary</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ color: '#94a3b8', fontWeight: 600 }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <Row key={order._id} order={order} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
