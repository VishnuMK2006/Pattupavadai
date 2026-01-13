import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Popover,
  Divider,
  Badge,
} from '@mui/material';
import {
  KeyboardArrowDown,
  ShoppingCart,
} from '@mui/icons-material';

const styles = {
  filterBar: {
    position: 'fixed',
    top: 64,
    left: 0,
    right: 0,
    zIndex: 1000,
    bgcolor: '#FFFFFF',
    borderBottom: '1px solid #E0E0E0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
  },
  filterContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
    px: 3,
    py: 1.5,
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#F2F2F2',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#CCCCCC',
      borderRadius: '3px',
    },
  },
  filterButton: {
    textTransform: 'none',
    color: '#111111',
    fontSize: '14px',
    fontWeight: 500,
    fontFamily: 'Arial, sans-serif',
    px: 2,
    py: 1,
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    '&:hover': {
      bgcolor: '#F2F2F2',
    },
  },
  popoverPaper: {
    mt: 0.5,
    minWidth: 220,
    maxWidth: 320,
    border: '1px solid #E0E0E0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderRadius: '4px',
  },
  popoverTitle: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#111111',
    fontFamily: 'Arial, sans-serif',
    px: 2,
    py: 1.5,
    borderBottom: '1px solid #E0E0E0',
  },
  radioGroup: {
    px: 2,
    py: 1.5,
    maxHeight: 350,
    overflowY: 'auto',
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#F2F2F2',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#CCCCCC',
      borderRadius: '3px',
    },
  },
  radioLabel: {
    fontSize: '13px',
    color: '#333333',
    fontFamily: 'Arial, sans-serif',
  },
  colorPickerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 2,
    py: 1,
  },
  colorInput: {
    width: '50px',
    height: '28px',
    border: '1px solid #CCCCCC',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  actionButtons: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    bgcolor: '#FFFFFF',
    borderTop: '1px solid #E0E0E0',
    p: 2,
    display: 'flex',
    gap: 2,
    zIndex: 1001,
    boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
  },
  addToCartBtn: {
    flex: 1,
    bgcolor: '#FFCE00',
    color: '#111111',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 600,
    py: 1.5,
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: 'none',
    '&:hover': {
      bgcolor: '#F0BE00',
      boxShadow: 'none',
    },
  },
  buyNowBtn: {
    flex: 1,
    bgcolor: '#FF9900',
    color: '#111111',
    textTransform: 'none',
    fontSize: '14px',
    fontWeight: 600,
    py: 1.5,
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: 'none',
    '&:hover': {
      bgcolor: '#E88900',
      boxShadow: 'none',
    },
  },
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

const fabricTypesList = [
  { id: 'Banarasi Silk', name: 'Banarasi Silk' },
  { id: 'Tissue Silk', name: 'Tissue Silk' },
  { id: 'Kalamkari', name: 'Kalamkari' },
  { id: 'Kalyani Cotton', name: 'Kalyani Cotton' },
  { id: 'Organza', name: 'Organza' },
];

const topStylesData = [
  { id: 't1', name: 'Top Style 1' },
  { id: 't2', name: 'Top Style 2' },
  { id: 't3', name: 'Top Style 3' },
  { id: 't4', name: 'Top Style 4' },
];

const bottomStylesData = [
  { id: 'p1', name: 'Bottom Style 1' },
  { id: 'p2', name: 'Bottom Style 2' },
  { id: 'p3', name: 'Bottom Style 3' },
  { id: 'p4', name: 'Bottom Style 4' },
];

function FilterDropdown({ label, options, value, onChange, title }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        sx={styles.filterButton}
        endIcon={<KeyboardArrowDown sx={{ fontSize: 16 }} />}
        onMouseEnter={handleClick}
        onClick={handleClick}
      >
        {label}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: styles.popoverPaper,
            onMouseLeave: handleClose,
          },
        }}
      >
        <Typography sx={styles.popoverTitle}>{title}</Typography>
        <FormControl component="fieldset" sx={styles.radioGroup}>
          <RadioGroup value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map((option) => (
              <FormControlLabel
                key={option.id}
                value={option.id}
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: '#CCCCCC',
                      '&.Mui-checked': {
                        color: '#2874F0',
                      },
                    }}
                  />
                }
                label={<Typography sx={styles.radioLabel}>{option.name}</Typography>}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Popover>
    </>
  );
}

function ColorPickerDropdown({ label, topColor, bottomColor, onTopChange, onBottomChange }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Button
        sx={styles.filterButton}
        endIcon={<KeyboardArrowDown sx={{ fontSize: 16 }} />}
        onMouseEnter={handleClick}
        onClick={handleClick}
      >
        {label}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: styles.popoverPaper,
            onMouseLeave: handleClose,
          },
        }}
      >
        <Typography sx={styles.popoverTitle}>Choose Colors</Typography>
        <Box sx={{ p: 2 }}>
          <Box sx={styles.colorPickerRow}>
            <Typography sx={styles.radioLabel}>Top Color</Typography>
            <input
              type="color"
              value={topColor}
              onChange={(e) => onTopChange(e.target.value)}
              style={styles.colorInput}
            />
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Box sx={styles.colorPickerRow}>
            <Typography sx={styles.radioLabel}>Bottom Color</Typography>
            <input
              type="color"
              value={bottomColor}
              onChange={(e) => onBottomChange(e.target.value)}
              style={styles.colorInput}
            />
          </Box>
        </Box>
      </Popover>
    </>
  );
}

export default function Sidebar({
  selectedTopStyle,
  selectedBottomStyle,
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
  show3DView,
  onToggle3DView,
  onApplyFilters,
  isGeneratingProductImage,
  cartCount = 0,
}) {
  return (
    <>
      {/* Top Filter Bar */}
      <Box sx={styles.filterBar}>
        <Box sx={styles.filterContainer}>
          <Typography
            sx={{
              fontSize: '13px',
              fontWeight: 600,
              color: '#111111',
              fontFamily: 'Arial, sans-serif',
              mr: 2,
            }}
          >
            Filters:
          </Typography>

          <FilterDropdown
            label="Dress Type"
            title="Select Dress Type"
            options={dressTypes}
            value={selectedDressType}
            onChange={onDressTypeSelect}
          />

          <FilterDropdown
            label="Fabric"
            title="Select Fabric Type"
            options={fabricTypesList}
            value={selectedFabricType}
            onChange={onFabricTypeSelect}
          />

          <FilterDropdown
            label="Sleeve"
            title="Select Sleeve Type"
            options={sleeveTypes}
            value={selectedSleeveType}
            onChange={onSleeveTypeSelect}
          />

          <FilterDropdown
            label="Neck Design"
            title="Select Neck Design"
            options={neckDesigns}
            value={selectedNeckDesign}
            onChange={onNeckDesignSelect}
          />

          <FilterDropdown
            label="Border"
            title="Select Border Design"
            options={borderDesigns}
            value={selectedBorderDesign}
            onChange={onBorderDesignSelect}
          />

          <FilterDropdown
            label="Top Style"
            title="Select Top Style"
            options={topStylesData}
            value={selectedTopStyle}
            onChange={onTopStyleSelect}
          />

          <FilterDropdown
            label="Bottom Style"
            title="Select Bottom Style"
            options={bottomStylesData}
            value={selectedBottomStyle}
            onChange={onBottomStyleSelect}
          />

          <ColorPickerDropdown
            label="Colors"
            topColor={topColor}
            bottomColor={bottomColor}
            onTopChange={onTopColorChange}
            onBottomChange={onBottomColorChange}
          />

          <Button
            variant="contained"
            onClick={onApplyFilters}
            disabled={isGeneratingProductImage}
            sx={{
              bgcolor: '#2874F0',
              color: '#FFFFFF',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 600,
              px: 3,
              py: 1,
              borderRadius: '4px',
              ml: 2,
              fontFamily: 'Arial, sans-serif',
              boxShadow: 'none',
              '&:hover': {
                bgcolor: '#1e60c7',
                boxShadow: 'none',
              },
              '&:disabled': {
                bgcolor: '#CCCCCC',
                color: '#666666',
              },
            }}
          >
            {isGeneratingProductImage ? 'Generating...' : 'Apply'}
          </Button>
        </Box>
      </Box>

      {/* Bottom Action Buttons */}
      <Box sx={styles.actionButtons}>
        <Button
          variant="outlined"
          onClick={onToggle3DView}
          sx={{
            flex: 1,
            borderColor: show3DView ? '#2874F0' : '#CCCCCC',
            color: show3DView ? '#2874F0' : '#666666',
            bgcolor: show3DView ? 'rgba(40, 116, 240, 0.08)' : '#FFFFFF',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 600,
            py: 1.5,
            borderRadius: '8px',
            fontFamily: 'Arial, sans-serif',
            '&:hover': {
              borderColor: '#2874F0',
              bgcolor: 'rgba(40, 116, 240, 0.08)',
            },
          }}
        >
          {show3DView ? 'Hide 3D' : 'View 3D'}
        </Button>
        
        <Button
          variant="contained"
          onClick={onAddToCart}
          sx={{
            ...styles.addToCartBtn,
            position: 'relative',
          }}
        >
          <ShoppingCart sx={{ mr: 1 }} />
          Add to Cart
          {cartCount > 0 && (
            <Box
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                bgcolor: '#FF0000',
                color: '#FFFFFF',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
                border: '2px solid #FFFFFF',
              }}
            >
              {cartCount}
            </Box>
          )}
        </Button>

        <Button
          variant="contained"
          onClick={onBuyNow}
          sx={styles.buyNowBtn}
        >
          Buy Now
        </Button>
      </Box>
    </>
  );
}
