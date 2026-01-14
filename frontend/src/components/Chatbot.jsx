import { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Chip,
  Fade,
  Zoom,
  CircularProgress,
} from '@mui/material';
import {
  Chat,
  Close,
  Minimize,
  Send,
  SmartToy,
  Person,
} from '@mui/icons-material';

const FAQ_SUGGESTIONS = [
  "What fabrics are available?",
  "How do I track my order?",
  "What is your return policy?",
  "Do you offer Cash on Delivery?",
  "How long does delivery take?",
  "What payment methods do you accept?",
  "How do I customize my product?",
  "What sizes are available?",
];

const CHATBOT_RESPONSES = {
  "what fabrics are available?": "We offer premium fabrics including Banarasi Silk, Tissue Silk, Kalamkari Kalyani, Cotton, and Organza. Each fabric has unique characteristics perfect for traditional wear!",
  "how do i track my order?": "You can track your order by clicking 'My Orders' in the top menu. You'll see real-time updates on your order status, including processing, shipped, and delivered stages.",
  "what is your return policy?": "We offer a 10-day return policy from the date of delivery. Items must be unused, unwashed, and in original packaging with all tags intact. Return shipping is free!",
  "do you offer cash on delivery?": "Yes! Cash on Delivery (COD) is available for all orders. You can pay in cash when your order is delivered to your doorstep.",
  "how long does delivery take?": "Standard delivery takes 3-5 business days. Express delivery is available for major cities with delivery in 1-2 days. We'll provide tracking details once your order ships.",
  "what payment methods do you accept?": "We accept Credit/Debit Cards, Net Banking, UPI, Mobile Wallets (Paytm, PhonePe, Google Pay), and Cash on Delivery. All payments are 100% secure.",
  "how do i customize my product?": "On the product page, use the sidebar to select your preferred fabric type, dress type, sleeve type, neck design, border design, and colors. Click 'Apply Filters' to preview your custom design!",
  "what sizes are available?": "We offer sizes for ages 1-12 years. Custom sizing is also available - just mention your requirements in the order notes during checkout.",
  "default": "Thank you for your question! Our support team will get back to you shortly. You can also call us at 1800-123-4567 or email support@kuzhavi-kids.com for immediate assistance."
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history from session storage
  useEffect(() => {
    const savedMessages = sessionStorage.getItem('chatHistory');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Initial welcome message
      setMessages([
        {
          id: Date.now(),
          text: "Hi! 👋 Welcome to Kuzhavi Kids! How can I help you today?",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, []);

  // Save chat history to session storage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (messageText = inputValue) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/chatbot/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const botResponseText = data.response || data.answer || data.message || CHATBOT_RESPONSES.default;

      const botMessage = {
        id: Date.now() + 1,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      
      // Fallback to local responses on error
      const normalizedInput = messageText.toLowerCase().trim();
      const fallbackResponse = CHATBOT_RESPONSES[normalizedInput] || "I'm having trouble connecting right now. Please try again in a moment, or contact our support team at 1800-123-4567.";

      const botMessage = {
        id: Date.now() + 1,
        text: fallbackResponse,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFAQClick = (question) => {
    handleSendMessage(question);
  };

  const handleToggleChat = () => {
    if (isMinimized) {
      setIsMinimized(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    setIsMinimized(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    setIsMinimized(false);
  };

  return (
    <>
      {/* Chat Window */}
      <Zoom in={isOpen && !isMinimized}>
        <Paper
          elevation={8}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: 380,
            height: 550,
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 1300,
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: '#2874F0',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: '#FFFFFF',
                  color: '#2874F0',
                  width: 36,
                  height: 36,
                }}
              >
                <SmartToy sx={{ fontSize: 20 }} />
              </Avatar>
              <Box>
                <Typography sx={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.2 }}>
                  Kuzhavi Assistant
                </Typography>
                <Typography sx={{ fontSize: '11px', opacity: 0.9, lineHeight: 1.2 }}>
                  Online • Typically replies instantly
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                size="small"
                onClick={handleMinimize}
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <Minimize sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleClose}
                sx={{
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                <Close sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          {/* FAQ Suggestions */}
          {messages.length <= 1 && (
            <Box
              sx={{
                p: 2,
                bgcolor: '#F8F9FA',
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  color: '#666666',
                  mb: 1,
                  fontWeight: 600,
                }}
              >
                Quick Questions:
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.8,
                }}
              >
                {FAQ_SUGGESTIONS.slice(0, 4).map((faq, index) => (
                  <Chip
                    key={index}
                    label={faq}
                    onClick={() => handleFAQClick(faq)}
                    sx={{
                      bgcolor: '#FFFFFF',
                      fontSize: '11px',
                      height: '26px',
                      cursor: 'pointer',
                      border: '1px solid #E0E0E0',
                      '&:hover': {
                        bgcolor: '#2874F0',
                        color: 'white',
                        borderColor: '#2874F0',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              p: 2,
              bgcolor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            {messages.map((message) => (
              <Fade key={message.id} in timeout={300}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    alignItems: 'flex-start',
                    gap: 1,
                  }}
                >
                  {message.sender === 'bot' && (
                    <Avatar
                      sx={{
                        bgcolor: '#2874F0',
                        width: 28,
                        height: 28,
                        mt: 0.5,
                      }}
                    >
                      <SmartToy sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: message.sender === 'user' ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.5,
                        bgcolor: message.sender === 'user' ? '#2874F0' : '#F1F3F5',
                        color: message.sender === 'user' ? 'white' : '#111111',
                        borderRadius:
                          message.sender === 'user'
                            ? '12px 12px 2px 12px'
                            : '12px 12px 12px 2px',
                      }}
                    >
                      <Typography sx={{ fontSize: '13px', lineHeight: 1.5 }}>
                        {message.text}
                      </Typography>
                    </Paper>
                    <Typography
                      sx={{
                        fontSize: '10px',
                        color: '#999999',
                        mt: 0.3,
                        px: 0.5,
                      }}
                    >
                      {message.timestamp}
                    </Typography>
                  </Box>
                  {message.sender === 'user' && (
                    <Avatar
                      sx={{
                        bgcolor: '#FF9900',
                        width: 28,
                        height: 28,
                        mt: 0.5,
                      }}
                    >
                      <Person sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                </Box>
              </Fade>
            ))}

            {isTyping && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar
                  sx={{
                    bgcolor: '#2874F0',
                    width: 28,
                    height: 28,
                  }}
                >
                  <SmartToy sx={{ fontSize: 16 }} />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: '#F1F3F5',
                    borderRadius: '12px 12px 12px 2px',
                  }}
                >
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <CircularProgress size={6} sx={{ color: '#666666' }} />
                    <CircularProgress size={6} sx={{ color: '#666666' }} />
                    <CircularProgress size={6} sx={{ color: '#666666' }} />
                  </Box>
                </Paper>
              </Box>
            )}

            <div ref={messagesEndRef} />
          </Box>

          {/* Input Area */}
          <Box
            sx={{
              p: 2,
              bgcolor: '#FFFFFF',
              borderTop: '1px solid #E0E0E0',
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    bgcolor: '#F8F9FA',
                    fontSize: '13px',
                  },
                }}
              />
              <IconButton
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim()}
                sx={{
                  bgcolor: '#2874F0',
                  color: 'white',
                  width: 40,
                  height: 40,
                  '&:hover': {
                    bgcolor: '#1e5bb8',
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#E0E0E0',
                    color: '#999999',
                  },
                }}
              >
                <Send sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Zoom>

      {/* Floating Chat Button */}
      <Zoom in={!isOpen || isMinimized}>
        <Box
          onClick={handleToggleChat}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1300,
          }}
        >
          <IconButton
            sx={{
              width: 60,
              height: 60,
              bgcolor: '#2874F0',
              color: 'white',
              boxShadow: '0 4px 16px rgba(40, 116, 240, 0.4)',
              '&:hover': {
                bgcolor: '#1e5bb8',
                transform: 'scale(1.05)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Chat sx={{ fontSize: 28 }} />
          </IconButton>

          {/* Notification Badge (optional) */}
          {isMinimized && (
            <Box
              sx={{
                position: 'absolute',
                top: -4,
                right: -4,
                width: 20,
                height: 20,
                borderRadius: '50%',
                bgcolor: '#FF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
              }}
            >
              <Typography sx={{ fontSize: '10px', color: 'white', fontWeight: 700 }}>
                1
              </Typography>
            </Box>
          )}
        </Box>
      </Zoom>
    </>
  );
}
