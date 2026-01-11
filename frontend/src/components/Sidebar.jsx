import {
  Box,
  Drawer,
  Typography,
  Stack,
  Button,
  Divider,
  Paper,
} from '@mui/material';
import {
  Style,
  Checkroom,
} from '@mui/icons-material';
import Preview from "./Preview";

export default function Sidebar({
  fabrics,
  selectedFabric,
  onFabricSelect,
  topStyles,
  selectedTopStyle,
  onTopStyleSelect,
  bottomStyles,
  selectedBottomStyle,
  onBottomStyleSelect,
}) {
  return (
    <Drawer
      anchor="left"
      open={true}
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': {
          width: 320,
          background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
          color: 'white',
          boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
          marginTop: '64px',
          height: 'calc(100% - 64px)',
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255,255,255,0.05)',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '4px',
            '&:hover': {
              background: 'rgba(255,255,255,0.3)',
            },
          },
        },
      }}
    >
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            {/* <CheckroomOutlined sx={{ color: '#667eea', fontSize: 28 }} /> */}
            
          </Box>
          
        </Box>

        <Stack spacing={4}>
          {/* Fabric Types */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Style sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                Fabric Types
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {fabrics.map((fabric) => (
                <Button
                  key={fabric.id}
                  variant={selectedFabric === fabric.id ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => onFabricSelect(fabric.id)}
                  sx={{
                    py: 1.5,
                    px: 2.5,
                    textTransform: 'none',
                    fontSize: '15px',
                    fontWeight: selectedFabric === fabric.id ? 600 : 500,
                    borderRadius: 2,
                    justifyContent: 'flex-start',
                    background: selectedFabric === fabric.id
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    borderColor: selectedFabric === fabric.id
                      ? 'transparent'
                      : 'rgba(255,255,255,0.2)',
                    color: 'white',
                    boxShadow: selectedFabric === fabric.id
                      ? '0 4px 12px rgba(102, 126, 234, 0.4)'
                      : 'none',
                    '&:hover': {
                      background: selectedFabric === fabric.id
                        ? 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)'
                        : 'rgba(255,255,255,0.08)',
                      borderColor: selectedFabric === fabric.id
                        ? 'transparent'
                        : 'rgba(255,255,255,0.3)',
                    },
                  }}
                >
                  {fabric.name}
                </Button>
              ))}
            </Stack>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

          {/* Top Styles */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Checkroom sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                Top Styles
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {topStyles.map((style) => (
                <Paper
                  key={style.id}
                  elevation={selectedTopStyle === style.id ? 8 : 0}
                  onClick={() => onTopStyleSelect(style.id)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    minWidth: 130,
                    flexShrink: 0,
                    background: selectedTopStyle === style.id
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255,255,255,0.05)',
                    border: selectedTopStyle === style.id
                      ? '2px solid #667eea'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: selectedTopStyle === style.id
                        ? '0 8px 20px rgba(102, 126, 234, 0.5)'
                        : '0 4px 12px rgba(0,0,0,0.3)',
                      background: selectedTopStyle === style.id
                        ? 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)'
                        : 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      bgcolor: selectedTopStyle === style.id
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(0,0,0,0.2)',
                      borderRadius: 1.5,
                      mb: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Preview modelPath={style.path} />
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    fontWeight={selectedTopStyle === style.id ? 600 : 500}
                    sx={{ color: 'white', fontSize: '13px' }}
                  >
                    {style.name}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />

          {/* Bottom Styles */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Checkroom sx={{ color: '#667eea', fontSize: 20 }} />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                sx={{
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1.2px',
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                Bottom Styles
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
                overflowX: 'auto',
                pb: 1,
                '&::-webkit-scrollbar': {
                  display: 'none',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {bottomStyles.map((style) => (
                <Paper
                  key={style.id}
                  elevation={selectedBottomStyle === style.id ? 8 : 0}
                  onClick={() => onBottomStyleSelect(style.id)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    minWidth: 130,
                    flexShrink: 0,
                    background: selectedBottomStyle === style.id
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'rgba(255,255,255,0.05)',
                    border: selectedBottomStyle === style.id
                      ? '2px solid #667eea'
                      : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: selectedBottomStyle === style.id
                        ? '0 8px 20px rgba(102, 126, 234, 0.5)'
                        : '0 4px 12px rgba(0,0,0,0.3)',
                      background: selectedBottomStyle === style.id
                        ? 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)'
                        : 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 120,
                      bgcolor: selectedBottomStyle === style.id
                        ? 'rgba(255,255,255,0.15)'
                        : 'rgba(0,0,0,0.2)',
                      borderRadius: 1.5,
                      mb: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <Preview modelPath={style.path} />
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    fontWeight={selectedBottomStyle === style.id ? 600 : 500}
                    sx={{ color: 'white', fontSize: '13px' }}
                  >
                    {style.name}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}
