import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  ShoppingCartOutlined,
  Bolt,
  ViewInArOutlined,
  AutoFixHighOutlined,
  ArrowForwardIos
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const luxuryColors = {
  maroon: '#4C0013',
  gold: '#B38B00',
  ivory: '#FFFDF5',
  text: '#2A000A',
  goldLight: '#D4AF37'
};

const MotionBox = motion(Box);

const dressTypes = [
  { id: 'pattu-pavadai', name: 'Pattu Pavadai' },
  { id: 'frock', name: 'Ethnic Frock' },
  { id: 'kurta', name: 'Kurta Set' },
  { id: 'gown', name: 'Traditional Gown' },
];

const sleeveTypes = [
  { id: 'short', name: 'Short' },
  { id: 'long', name: 'Long' },
  { id: 'sleeveless', name: 'Sleeveless' },
  { id: 'puff', name: 'Puff Style' },
];

const neckDesigns = [
  { id: 'round', name: 'Classic Round' },
  { id: 'square', name: 'Royal Square' },
  { id: 'v-neck', name: 'V-Neck' },
  { id: 'boat', name: 'Boat Neck' },
];

const fabricTypesList = [
  { id: 'Banarasi Silk', name: 'Banarasi Silk' },
  { id: 'Tissue Silk', name: 'Tissue Silk' },
  { id: 'Kalamkari', name: 'Kalamkari' },
  { id: 'Organza', name: 'Organza' },
];

function DesignerControl({ label, options, value, onChange }) {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="overline"
        sx={{
          color: luxuryColors.gold,
          fontWeight: 800,
          letterSpacing: '2px',
          mb: 2,
          display: 'block'
        }}
      >
        {label}
      </Typography>
      <RadioGroup
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.id}
            value={opt.id}
            control={<Radio sx={{ display: 'none' }} />}
            label={
              <Box
                sx={{
                  px: 2,
                  py: 1.5,
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: value === opt.id ? luxuryColors.maroon : 'rgba(0,0,0,0.05)',
                  bgcolor: value === opt.id ? luxuryColors.maroon : 'white',
                  color: value === opt.id ? 'white' : luxuryColors.text,
                  textAlign: 'center',
                  fontSize: '13px',
                  fontWeight: 600,
                  transition: '0.3s',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: luxuryColors.gold,
                    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                  }
                }}
              >
                {opt.name}
              </Box>
            }
            sx={{ m: 0 }}
          />
        ))}
      </RadioGroup>
    </Box>
  );
}

export default function Sidebar({
  selectedDressType,
  onDressTypeSelect,
  selectedFabricType,
  onFabricTypeSelect,
  selectedSleeveType,
  onSleeveTypeSelect,
  selectedNeckDesign,
  onNeckDesignSelect,
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
}) {
  return (
    <Box
      className="sidebar"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-20px 0 60px rgba(0,0,0,0.02)'
      }}
    >
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" sx={{ color: luxuryColors.maroon, fontWeight: 800, mb: 1 }}>
          Custom Design
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.5)', italic: true }}>
          Hand-select every detail for your little one's masterpiece.
        </Typography>
      </Box>

      <DesignerControl
        label="DRESS SILHOUETTE"
        options={dressTypes}
        value={selectedDressType}
        onChange={onDressTypeSelect}
      />

      <DesignerControl
        label="FABRIC CHOICE"
        options={fabricTypesList}
        value={selectedFabricType}
        onChange={onFabricTypeSelect}
      />

      <DesignerControl
        label="SLEEVE STYLE"
        options={sleeveTypes}
        value={selectedSleeveType}
        onChange={onSleeveTypeSelect}
      />

      <DesignerControl
        label="NECKLINE"
        options={neckDesigns}
        value={selectedNeckDesign}
        onChange={onNeckDesignSelect}
      />

      <Box sx={{ mb: 6 }}>
        <Typography variant="overline" sx={{ color: luxuryColors.gold, fontWeight: 800, letterSpacing: '2px', display: 'block', mb: 2 }}>
          COLOR PALETTE
        </Typography>
        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>TOP</Typography>
            <input
              type="color"
              value={topColor}
              onChange={(e) => onTopColorChange(e.target.value)}
              style={{ width: '60px', height: '40px', border: '2px solid #EEE', borderRadius: '8px', cursor: 'pointer' }}
            />
          </Box>
          <Box>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, fontWeight: 700 }}>BOTTOM</Typography>
            <input
              type="color"
              value={bottomColor}
              onChange={(e) => onBottomColorChange(e.target.value)}
              style={{ width: '60px', height: '40px', border: '2px solid #EEE', borderRadius: '8px', cursor: 'pointer' }}
            />
          </Box>
        </Stack>
      </Box>

      <Box sx={{ mt: 'auto', pt: 4 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onApplyFilters}
          disabled={isGeneratingProductImage}
          startIcon={<AutoFixHighOutlined />}
          sx={{
            bgcolor: luxuryColors.maroon,
            color: 'white',
            py: 2.5,
            borderRadius: '20px',
            fontWeight: 800,
            fontSize: '15px',
            textTransform: 'none',
            mb: 2,
            boxShadow: '0 10px 30px rgba(76, 0, 19, 0.2)',
            '&:hover': { bgcolor: luxuryColors.dark }
          }}
        >
          {isGeneratingProductImage ? 'Crafting Image...' : 'Apply Design Details'}
        </Button>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={onToggle3DView}
            sx={{
              flex: 1,
              bgcolor: 'white',
              color: luxuryColors.maroon,
              border: '1px solid #DDD',
              py: 2,
              borderRadius: '15px',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: luxuryColors.ivory }
            }}
          >
            {show3DView ? 'Exit 3D' : 'Pre-visualize (3D)'}
          </Button>
          <Button
            onClick={onAddToCart}
            sx={{
              flex: 1,
              bgcolor: luxuryColors.gold,
              color: 'white',
              py: 2,
              borderRadius: '15px',
              fontWeight: 700,
              textTransform: 'none',
              '&:hover': { bgcolor: luxuryColors.goldLight }
            }}
          >
            Add to Bag
          </Button>
        </Stack>

        <Button
          fullWidth
          onClick={onBuyNow}
          sx={{
            mt: 2,
            color: luxuryColors.maroon,
            fontWeight: 900,
            fontSize: '13px',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}
        >
          Instant Checkout <ArrowForwardIos sx={{ fontSize: 12, ml: 1 }} />
        </Button>
      </Box>
    </Box>
  );
}
