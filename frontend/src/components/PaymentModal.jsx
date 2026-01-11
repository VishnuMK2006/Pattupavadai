import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  CircularProgress,
  Button
} from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';

export default function PaymentModal({ open, onClose, totalAmount, onSuccess }) {
  const [status, setStatus] = useState('waiting'); // waiting, success

  useEffect(() => {
    if (open) {
      setStatus('waiting');
      const timer = setTimeout(() => {
        setStatus('success');
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    if (status === 'success') {
      onSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold' }}>
        {status === 'waiting' ? 'Scan & Pay' : 'Payment Successful'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 3, gap: 3 }}>
          {status === 'waiting' ? (
            <>
              <Typography variant="body1" align="center">
                Please scan the QR code to pay <strong>₹{totalAmount}</strong>
              </Typography>
              
              {/* Dummy QR Code */}
              <Box
                sx={{
                  width: 250,
                  height: 250,
                  bgcolor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed #ccc',
                  borderRadius: 2
                }}
              >
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=DummyPayment" 
                  alt="Payment QR Code" 
                  style={{ width: '100%', height: '100%' }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} />
                <Typography variant="body2" color="text.secondary">
                  Waiting for payment confirmation...
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <CheckCircleOutline sx={{ fontSize: 80, color: '#2ecc71' }} />
              <Typography variant="h5" color="success.main" fontWeight="bold">
                Order Confirmed!
              </Typography>
              <Typography variant="body1" align="center" color="text.secondary">
                Payment received successfully. Your order has been placed.
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleClose}
                sx={{ 
                  mt: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                Close
              </Button>
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
