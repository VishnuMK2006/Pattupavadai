import {
  Box,
  Drawer,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
} from '@mui/material';
import {
  Style,
  Checkroom,
} from '@mui/icons-material';
import Preview from "./Preview";

const styles = {
  drawer: {
    '& .MuiDrawer-paper': {
      width: '50%',
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
  },
  sectionHeader: {
    display: 'flex', 
    alignItems: 'center', 
    gap: 1.5, 
    mb: 1
  },
  categoryTitleWrapper: {
    display: 'flex', 
    alignItems: 'center', 
    gap: 1, 
    mb: 2
  },
  categoryIcon: {
    color: '#667eea', 
    fontSize: 20 
  },
  categoryTitle: {
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: 'rgba(255,255,255,0.9)',
  },
  // Generic list button style (used for multiple lists)
  listButton: (isActive) => ({
    py: 1.5,
    px: 2.5,
    textTransform: 'none',
    fontSize: '15px',
    fontWeight: isActive ? 600 : 500,
    borderRadius: 2,
    justifyContent: 'flex-start',
    background: isActive
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'transparent',
    borderColor: isActive
      ? 'transparent'
      : 'rgba(255,255,255,0.2)',
    color: 'white',
    boxShadow: isActive
      ? '0 4px 12px rgba(102, 126, 234, 0.4)'
      : 'none',
    width: '100%',
    '&:hover': {
      background: isActive
        ? 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)'
        : 'rgba(255,255,255,0.08)',
      borderColor: isActive
        ? 'transparent'
        : 'rgba(255,255,255,0.3)',
    },
  }),
  scrollContainer: {
    display: 'flex',
    gap: 2,
    overflowX: 'auto',
    pb: 1,
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    msOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  styleCard: (isActive) => ({
    p: 1.5,
    cursor: 'pointer',
    minWidth: 130,
    flexShrink: 0,
    background: isActive
      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      : 'rgba(255,255,255,0.05)',
    border: isActive
      ? '2px solid #667eea'
      : '1px solid rgba(255,255,255,0.1)',
    borderRadius: 2,
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: isActive
        ? '0 8px 20px rgba(102, 126, 234, 0.5)'
        : '0 4px 12px rgba(0,0,0,0.3)',
      background: isActive
        ? 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)'
        : 'rgba(255,255,255,0.08)',
    },
  }),
  stylePreview: (isActive) => ({
    height: 120,
    bgcolor: isActive
      ? 'rgba(255,255,255,0.15)'
      : 'rgba(0,0,0,0.2)',
    borderRadius: 1.5,
    mb: 1,
    overflow: 'hidden',
  }),
  styleName: (isActive) => ({
    color: 'white', 
    fontSize: '13px',
    fontWeight: isActive ? 600 : 500
  }),
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 1.5,
  },
  colorContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 1.5,
  },
  colorCircle: (color, isActive) => ({
    width: 32,
    height: 32,
    borderRadius: '50%',
    bgcolor: color,
    cursor: 'pointer',
    border: isActive ? '3px solid white' : '1px solid rgba(255,255,255,0.2)',
    boxShadow: isActive ? '0 0 10px rgba(255,255,255,0.5)' : 'none',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  }),
  divider: {
    bgcolor: 'rgba(255,255,255,0.1)'
  }
};

// Data constants
const dressTypes = [
  { id: 'pattu-pavadai', name: 'Pattu Pavadai' },
  { id: 'frock', name: 'Frock' },
  { id: 'kurta', name: 'Kurta' },
  { id: 'gown', name: 'Gown' },
];

const sleeveTypes = [
  { id: 'short', name: 'Short Sleeve' },
  { id: 'long', name: 'Long Sleeve' },
  { id: 'sleeveless', name: 'Sleeveless' },
  { id: 'puff', name: 'Puff Sleeve' },
];

const neckDesigns = [
  { id: 'round', name: 'Round Neck' },
  { id: 'square', name: 'Square Neck' },
  { id: 'v-neck', name: 'V-Neck' },
  { id: 'boat', name: 'Boat Neck' },
];

const borderDesigns = [
  { id: 'gold-zari', name: 'Gold Zari' },
  { id: 'silver-zari', name: 'Silver Zari' },
  { id: 'thread-work', name: 'Thread Work' },
  { id: 'simple', name: 'Simple Border' },
];

const colorPalette = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef",
  "#f43f5e", "#ffffff", "#000000"
];

const fabricTypesList = [
  { id: 'Banarasi Silk', name: 'Banarasi Silk' },
  { id: 'Tissue Silk', name: 'Tissue Silk' },
  { id: 'Kalamkari', name: 'Kalamkari' },
  { id: 'Kalyani Cotton', name: 'Kalyani Cotton' },
  { id: 'Organza', name: 'Organza' },
];

export default function Sidebar({
  fabrics,
  topStyles,
  bottomStyles,
  selectedFabric,
  selectedTopStyle,
  selectedBottomStyle,
  onSelectFabric,
  onTopStyleSelect,
  onBottomStyleSelect,
  selectedDressType,
  onDressTypeSelect,
  selectedFabricType,
  onFabricTypeSelect,
  selectedSleeveType,
  onSleeveTypeSelect,
  selectedNeckDesign,
  onNeckDesignSelect,
  selectedBorderDesign,
  onBorderDesignSelect,
  topColor,
  onTopColorChange,
  bottomColor,
  onBottomColorChange,
  onAddToCart,
  onBuyNow,
}) {
  return (
    <Drawer
      anchor="left"
      open={true}
      variant="permanent"
      sx={styles.drawer}
    >
      <Box sx={{ p: 3 }}>
        <Stack spacing={4}>
          
          {/* 1. Dress Type */}
          <Box>
            <Box sx={styles.categoryTitleWrapper}>
              <Style sx={styles.categoryIcon} />
              <Typography variant="subtitle1" fontWeight={600} sx={styles.categoryTitle}>
                Dress Type
              </Typography>
            </Box>
            <Box sx={styles.gridContainer}>
              {dressTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedDressType === type.id ? 'contained' : 'outlined'}
                  onClick={() => onDressTypeSelect(type.id)}
                  sx={styles.listButton(selectedDressType === type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </Box>
          </Box>

          <Divider sx={styles.divider} />

          {/* 2. Fabric Types */}
          {/* <Box>
            <Box sx={styles.categoryTitleWrapper}>
              <Style sx={styles.categoryIcon} />
              <Typography variant="subtitle1" fontWeight={600} sx={styles.categoryTitle}>
                Fabric Types
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {fabrics.map((fabric) => (
                <Button
                  key={fabric.id}
                  variant={selectedFabric === fabric.id ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => onSelectFabric(fabric.id)}
                  sx={styles.listButton(selectedFabric === fabric.id)}
                >
                  {fabric.name}
                </Button>
              ))}
            </Stack>
          </Box> */}

          {/* New Fabric Types List */}
          <Box>
            <Box sx={styles.categoryTitleWrapper}>
              <Style sx={styles.categoryIcon} />
              <Typography variant="subtitle1" fontWeight={600} sx={styles.categoryTitle}>
                Fabric Types
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {fabricTypesList.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedFabricType === type.id ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => onFabricTypeSelect(type.id)}
                  sx={styles.listButton(selectedFabricType === type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </Stack>
          </Box>

          <Divider sx={styles.divider} />

          {/* 3. Sleeve Type */}
          <Box>
            <Box sx={styles.categoryTitleWrapper}>
              <Checkroom sx={styles.categoryIcon} />
              <Typography variant="subtitle1" fontWeight={600} sx={styles.categoryTitle}>
                Sleeve Type
              </Typography>
            </Box>
            <Box sx={styles.gridContainer}>
              {sleeveTypes.map((type) => (
                 <Button
                  key={type.id}
                  variant={selectedSleeveType === type.id ? 'contained' : 'outlined'}
                  onClick={() => onSleeveTypeSelect(type.id)}
                  sx={styles.listButton(selectedSleeveType === type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </Box>
          </Box>

          <Divider sx={styles.divider} />

          {/* 4. Neck Design */}
          <Box>
            <Box sx={styles.categoryTitleWrapper}>
              <Style sx={styles.categoryIcon} />
              <Typography variant="subtitle1" fontWeight={600} sx={styles.categoryTitle}>
                Neck Design
              </Typography>
            </Box>
            <Box sx={styles.gridContainer}>
              {neckDesigns.map((type) => (
                 <Button
                  key={type.id}
                  variant={selectedNeckDesign === type.id ? 'contained' : 'outlined'}
                  onClick={() => onNeckDesignSelect(type.id)}
                  sx={styles.listButton(selectedNeckDesign === type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </Box>
          </Box>

          <Divider sx={styles.divider} />

          {/* 5. Border Design */}
          <Box>
            <Box sx={styles.categoryTitleWrapper}>
              <Style sx={styles.categoryIcon} />
              <Typography variant="subtitle1" fontWeight={600} sx={styles.categoryTitle}>
                Border Design
              </Typography>
            </Box>
            <Stack spacing={1.5}>
              {borderDesigns.map((type) => (
                 <Button
                  key={type.id}
                  variant={selectedBorderDesign === type.id ? 'contained' : 'outlined'}
                  fullWidth
                  onClick={() => onBorderDesignSelect(type.id)}
                  sx={styles.listButton(selectedBorderDesign === type.id)}
                >
                  {type.name}
                </Button>
              ))}
            </Stack>
          </Box>

          <Divider sx={styles.divider} />

          {/* 6. Color Palette */}
          <Box>
            <Box sx={styles.categoryTitleWrapper}>
              <Style sx={styles.categoryIcon} />
              <Typography variant="subtitle1" fontWeight={600} sx={styles.categoryTitle}>
                Color Palette
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Top Color Picker */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Top Color</Typography>
                <input
                  type="color"
                  value={topColor}
                  onChange={(e) => onTopColorChange(e.target.value)}
                  style={{
                    width: '60px',
                    height: '30px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: 'transparent'
                  }}
                />
              </Box>

              {/* Bottom Color Picker */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>Bottom Color</Typography>
                <input
                  type="color"
                  value={bottomColor}
                  onChange={(e) => onBottomColorChange(e.target.value)}
                  style={{
                    width: '60px',
                    height: '30px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: 'transparent'
                  }}
                />
              </Box>
            </Box>
          </Box>

          <Divider sx={styles.divider} />

          {/* 7. Top Styles */}
          <Box>
            <Box sx={styles.categoryTitleWrapper}>
              <Checkroom sx={styles.categoryIcon} />
              <Typography variant="subtitle1" fontWeight={600} sx={styles.categoryTitle}>
                Top Styles
              </Typography>
            </Box>
            <Box sx={styles.scrollContainer}>
              {topStyles.map((style) => (
                <Paper
                  key={style.id}
                  elevation={selectedTopStyle === style.id ? 8 : 0}
                  onClick={() => onTopStyleSelect(style.id)}
                  sx={styles.styleCard(selectedTopStyle === style.id)}
                >
                  <Box sx={styles.stylePreview(selectedTopStyle === style.id)}>
                    <Preview modelPath={style.path} />
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={styles.styleName(selectedTopStyle === style.id)}
                  >
                    {style.name}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          <Divider sx={styles.divider} />

          {/* 8. Bottom Styles */}
          <Box>
            <Box sx={styles.categoryTitleWrapper}>
              <Checkroom sx={styles.categoryIcon} />
              <Typography variant="subtitle1" fontWeight={600} sx={styles.categoryTitle}>
                Bottom Styles
              </Typography>
            </Box>
            <Box sx={styles.scrollContainer}>
              {bottomStyles.map((style) => (
                <Paper
                  key={style.id}
                  elevation={selectedBottomStyle === style.id ? 8 : 0}
                  onClick={() => onBottomStyleSelect(style.id)}
                  sx={styles.styleCard(selectedBottomStyle === style.id)}
                >
                  <Box sx={styles.stylePreview(selectedBottomStyle === style.id)}>
                    <Preview modelPath={style.path} />
                  </Box>
                  <Typography
                    variant="body2"
                    align="center"
                    sx={styles.styleName(selectedBottomStyle === style.id)}
                  >
                    {style.name}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>
          <Divider sx={styles.divider} />
          
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={onAddToCart}
              sx={{
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                boxShadow: '0 4px 15px rgba(255, 215, 0, 0.4)',
                fontWeight: 700,
                color: '#0f1419',
                '&:hover': {
                    background: 'linear-gradient(135deg, #FFC700 0%, #FF9500 100%)',
                    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.6)',
                }
              }}
            >
              Add to Cart
            </Button>
            
            <Button
              variant="contained"
              fullWidth
              onClick={onBuyNow}
              sx={{
                py: 1.5,
                background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4)',
                fontWeight: 700,
                color: 'white',
                '&:hover': {
                    background: 'linear-gradient(135deg, #27ae60 0%, #219150 100%)',
                    boxShadow: '0 6px 20px rgba(46, 204, 113, 0.6)',
                }
              }}
            >
              Buy Now
            </Button>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}
