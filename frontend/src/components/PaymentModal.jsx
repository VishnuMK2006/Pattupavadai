import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Divider,
  Collapse,
  IconButton,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  AccountBalanceWallet,
  CreditCard,
  Receipt,
  LocalAtm,
  CardGiftcard,
  Lock,
  ExpandMore,
  ExpandLess,
  CheckCircleOutline,
} from '@mui/icons-material';

export default function PaymentModal({ open, onClose, totalAmount, onSuccess }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [expandFees, setExpandFees] = useState(false);
  const [expandDiscounts, setExpandDiscounts] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const mrp = totalAmount + 3500; // Mock MRP
  const fees = 46;
  const discount = 3500;

  useEffect(() => {
    if (open) {
      setPaymentSuccess(false);
      setIsProcessing(false);
      setUpiId('');
      setSelectedMethod('upi');
    }
  }, [open]);

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    }, 2000);
  };

  if (paymentSuccess) {
    return (
      <Dialog 
        open={open} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogContent>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            py: 4,
            gap: 2,
          }}>
            <CheckCircleOutline sx={{ fontSize: 80, color: '#2ecc71' }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111111' }}>
              Payment Successful!
            </Typography>
            <Typography sx={{ fontSize: '14px', color: '#666666', textAlign: 'center' }}>
              Your order has been placed successfully
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        }
      }}
    >
      <DialogContent sx={{ p: 0, bgcolor: '#F2F2F2' }}>
        <Box sx={{ display: 'flex', height: '80vh' }}>
          {/* Left Side - Payment Methods */}
          <Box sx={{ flex: 1, bgcolor: '#FFFFFF', overflowY: 'auto' }}>
            {/* Header */}
            <Box sx={{ 
              p: 2, 
              borderBottom: '1px solid #E0E0E0',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              bgcolor: '#FFFFFF',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}>
              <IconButton onClick={onClose} sx={{ color: '#111111' }}>
                <ArrowBack />
              </IconButton>
              <Typography sx={{ fontSize: '18px', fontWeight: 700, color: '#111111' }}>
                Complete Payment
              </Typography>
              <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Lock sx={{ fontSize: 16, color: '#2ecc71' }} />
                <Typography sx={{ fontSize: '12px', color: '#2ecc71', fontWeight: 600 }}>
                  100% Secure
                </Typography>
              </Box>
            </Box>

            {/* Payment Methods */}
            <Box sx={{ p: 2 }}>
              <RadioGroup value={selectedMethod} onChange={(e) => setSelectedMethod(e.target.value)}>
                {/* UPI */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    mb: 1.5, 
                    border: selectedMethod === 'upi' ? '2px solid #2874F0' : '1px solid #E0E0E0',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  <FormControlLabel
                    value="upi"
                    control={<Radio sx={{ color: '#CCCCCC', '&.Mui-checked': { color: '#2874F0' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                        <AccountBalanceWallet sx={{ color: '#2874F0', fontSize: 24 }} />
                        <Box>
                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                            UPI
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                            Pay by any UPI app
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#2ecc71', fontWeight: 600 }}>
                            Get upto ₹20 cashback • 4 offers available
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ m: 0, p: 2, width: '100%' }}
                  />
                  
                  <Collapse in={selectedMethod === 'upi'}>
                    <Box sx={{ px: 2, pb: 2, borderTop: '1px solid #F2F2F2' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, mt: 2 }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                          Add new UPI ID
                        </Typography>
                        <Typography 
                          sx={{ 
                            fontSize: '12px', 
                            color: '#2874F0', 
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                          }}
                        >
                          How to find?
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        <TextField
                          placeholder="Enter your UPI ID"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          size="small"
                          fullWidth
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: '14px',
                              bgcolor: '#FFFFFF',
                            }
                          }}
                        />
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: '#2874F0',
                            color: '#FFFFFF',
                            textTransform: 'none',
                            fontSize: '14px',
                            fontWeight: 600,
                            px: 3,
                            boxShadow: 'none',
                            '&:hover': {
                              bgcolor: '#1e60c7',
                              boxShadow: 'none',
                            },
                          }}
                        >
                          Verify
                        </Button>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        disabled={!upiId || isProcessing}
                        onClick={handlePayment}
                        sx={{
                          bgcolor: '#666666',
                          color: '#FFFFFF',
                          textTransform: 'none',
                          fontSize: '14px',
                          fontWeight: 600,
                          py: 1.5,
                          boxShadow: 'none',
                          '&:hover': {
                            bgcolor: '#555555',
                            boxShadow: 'none',
                          },
                          '&:disabled': {
                            bgcolor: '#CCCCCC',
                            color: '#999999',
                          },
                        }}
                      >
                        {isProcessing ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString()}`}
                      </Button>
                    </Box>
                  </Collapse>
                </Paper>

                {/* Credit/Debit Card */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    mb: 1.5, 
                    border: selectedMethod === 'card' ? '2px solid #2874F0' : '1px solid #E0E0E0',
                    borderRadius: 1,
                  }}
                >
                  <FormControlLabel
                    value="card"
                    control={<Radio sx={{ color: '#CCCCCC', '&.Mui-checked': { color: '#2874F0' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                        <CreditCard sx={{ color: '#111111', fontSize: 24 }} />
                        <Box>
                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                            Credit / Debit / ATM Card
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                            Add and secure cards as per RBI guidelines
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#2ecc71', fontWeight: 600 }}>
                            Save upto ₹654 • 3 offers available
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ m: 0, p: 2, width: '100%' }}
                  />
                </Paper>

                {/* EMI */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    mb: 1.5, 
                    border: selectedMethod === 'emi' ? '2px solid #2874F0' : '1px solid #E0E0E0',
                    borderRadius: 1,
                  }}
                >
                  <FormControlLabel
                    value="emi"
                    control={<Radio sx={{ color: '#CCCCCC', '&.Mui-checked': { color: '#2874F0' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                        <Receipt sx={{ color: '#111111', fontSize: 24 }} />
                        <Box>
                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                            EMI
                          </Typography>
                          <Typography sx={{ fontSize: '12px', color: '#666666' }}>
                            Get Debit and Cardless EMIs on HDFC Bank
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ m: 0, p: 2, width: '100%' }}
                  />
                </Paper>

                {/* Cash on Delivery */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    mb: 1.5, 
                    border: selectedMethod === 'cod' ? '2px solid #2874F0' : '1px solid #E0E0E0',
                    borderRadius: 1,
                  }}
                >
                  <FormControlLabel
                    value="cod"
                    control={<Radio sx={{ color: '#CCCCCC', '&.Mui-checked': { color: '#2874F0' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                        <LocalAtm sx={{ color: '#111111', fontSize: 24 }} />
                        <Box>
                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                            Cash on Delivery
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ m: 0, p: 2, width: '100%' }}
                  />
                </Paper>

                {/* Gift Card */}
                <Paper 
                  elevation={0}
                  sx={{ 
                    mb: 1.5, 
                    border: selectedMethod === 'gift' ? '2px solid #2874F0' : '1px solid #E0E0E0',
                    borderRadius: 1,
                  }}
                >
                  <FormControlLabel
                    value="gift"
                    control={<Radio sx={{ color: '#CCCCCC', '&.Mui-checked': { color: '#2874F0' } }} />}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                        <CardGiftcard sx={{ color: '#FF9900', fontSize: 24 }} />
                        <Box>
                          <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                            Have a Gift Card?
                          </Typography>
                        </Box>
                      </Box>
                    }
                    sx={{ m: 0, p: 2, width: '100%' }}
                  />
                </Paper>
              </RadioGroup>
            </Box>
          </Box>

          {/* Right Side - Price Details */}
          <Box sx={{ width: 400, bgcolor: '#FAFAFA', borderLeft: '1px solid #E0E0E0', p: 3 }}>
            <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#666666', mb: 2 }}>
              MRP (Incl. of all taxes)
            </Typography>
            <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#111111', mb: 3 }}>
              ₹{mrp.toLocaleString()}
            </Typography>

            {/* Fees Section */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                mb: 1,
              }}
              onClick={() => setExpandFees(!expandFees)}
            >
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                Fees
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                  ₹{fees}
                </Typography>
                {expandFees ? <ExpandLess /> : <ExpandMore />}
              </Box>
            </Box>

            <Collapse in={expandFees}>
              <Box sx={{ pl: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '13px', color: '#666666' }}>
                    Protect Promise Fee
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#666666' }}>
                    ₹{fees}
                  </Typography>
                </Box>
              </Box>
            </Collapse>

            {/* Discounts Section */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                cursor: 'pointer',
                mb: 2,
              }}
              onClick={() => setExpandDiscounts(!expandDiscounts)}
            >
              <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#111111' }}>
                Discounts
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '14px', color: '#111111' }}>
                  −₹{discount.toLocaleString()}
                </Typography>
                {expandDiscounts ? <ExpandLess /> : <ExpandMore />}
              </Box>
            </Box>

            <Collapse in={expandDiscounts}>
              <Box sx={{ pl: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography sx={{ fontSize: '13px', color: '#666666' }}>
                    MRP Discount
                  </Typography>
                  <Typography sx={{ fontSize: '13px', color: '#2ecc71', fontWeight: 600 }}>
                    −₹{discount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Collapse>

            <Divider sx={{ my: 2 }} />

            {/* Total Amount */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography sx={{ fontSize: '16px', fontWeight: 600, color: '#2874F0' }}>
                Total Amount
              </Typography>
              <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#2874F0' }}>
                ₹{totalAmount.toLocaleString()}
              </Typography>
            </Box>

            {/* Discount Banner */}
            <Box sx={{ 
              bgcolor: '#E8F5E9',
              border: '1px solid #2ecc71',
              borderRadius: 1,
              p: 1.5,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}>
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontSize: '12px', color: '#2ecc71', fontWeight: 700 }}>
                  10% instant discount
                </Typography>
              </Box>
            </Box>
            <Typography sx={{ fontSize: '12px', color: '#2874F0', mt: 1, cursor: 'pointer' }}>
              Claim now with payment offers
            </Typography>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
