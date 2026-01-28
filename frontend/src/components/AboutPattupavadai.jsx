import React from 'react';
import { Box, Typography, Button, Grid, Container, Paper, Divider } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const luxuryColors = {
    maroon: '#4C0013',
    gold: '#B38B00',
    ivory: '#FFFBE6',
    text: '#2A000A',
};

export default function AboutPattupavadai({ onBack }) {
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: luxuryColors.ivory, pt: 12, pb: 8, px: { xs: 2, md: 6 } }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 6 }}>
                    <Button
                        startIcon={<ArrowBack />}
                        onClick={onBack}
                        sx={{ color: luxuryColors.maroon, fontWeight: 700, mb: 4 }}
                    >
                        Back to Products
                    </Button>

                    <Typography variant="h2" sx={{ fontFamily: '"Playfair Display", serif', color: luxuryColors.maroon, fontWeight: 800, mb: 2 }}>
                        The Essence of <span style={{ fontStyle: 'italic', color: luxuryColors.gold }}>Pattu Pavadai</span>
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#555', maxWidth: '800px', lineHeight: 1.6 }}>
                        A timeless tradition of elegance, grace, and heritage for the little ones.
                    </Typography>
                </Box>

            </Container>
        </Box>
    );
}
