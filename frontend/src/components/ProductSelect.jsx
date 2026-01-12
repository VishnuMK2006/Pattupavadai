import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import Carousel from './Carousel';

// Import the available category thumbnails
import pattuImageUrl from '../assets/category/i1.png';
import ethnicFrockImageUrl from '../assets/category/i2.png';
import kurthaImageUrl from '../assets/category/i3.png';

const defaultProducts = [
  {
    id: "pattu-paavadai",
    name: "Pattu Paavadai",
    blurb: "Handwoven silk skirt set crafted for festive shine.",
    tag: "Traditional",
    image: pattuImageUrl
  },
  {
    id: "ethnic-frock",
    name: "Ethnic Frock",
    blurb: "Lightweight frock with zari trims for celebrations.",
    tag: "Festive",
    image: ethnicFrockImageUrl
  },
  {
    id: "kurta-pyjama",
    name: "Kurta Pyjama",
    blurb: "Classic kurta with comfy pyjama for all-day wear.",
    tag: "Casual",
    image: kurthaImageUrl
  },
];

const FALLBACK_IMAGES = {
  'pattu-paavadai': pattuImageUrl,
  'ethnic-frock': ethnicFrockImageUrl,
  'kurta-pyjama': kurthaImageUrl
};

export default function ProductSelect({ onSelect, products = defaultProducts, user, onSignOut }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const carouselItems = products.map(product => ({
    id: product.id,
    title: product.name,
    description: product.blurb,
    image: product.image ?? FALLBACK_IMAGES[product.id] ?? pattuImageUrl,
    product: product
  }));

  const handleSelectFromCarousel = (item) => {
    if (item?.product) {
      onSelect?.(item.product);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // background: 'linear-gradient(135deg, #0f141900 0%, #1a233200 100%)',
        padding: 3,
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="overline"
          sx={{
            color: '#999',
            letterSpacing: '2px',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          Pick a Collection
        </Typography>
        
      </Box>

      {/* Carousel */}
      <Box
        sx={{
          height: '600px',
          width: '100%',
          maxWidth: '450px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <Carousel
          items={carouselItems}
          baseWidth={400}
          autoplay
          pauseOnHover
          loop
          onSelectItem={handleSelectFromCarousel}
        />
      </Box>

      {/* Remove the old Select Button */}

      {/* Footer */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 20,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 4,
        }}
      >
        {user && (
          <Typography variant="body2" sx={{ color: '#999' }}>
            Logged in as {user.email}
          </Typography>
        )}
        <Box sx={{ flex: 1 }} />
        {onSignOut && (
          <Button
            variant="text"
            onClick={onSignOut}
            sx={{
              color: '#999',
              textTransform: 'none',
              '&:hover': {
                color: '#fff',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            Sign out
          </Button>
        )}
      </Box>
    </Box>
  );
}
