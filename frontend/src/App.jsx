import { useEffect, useMemo, useState } from 'react';
import './App.css';
import Scene from "./components/Scene";
import AuthForm from "./components/AuthForm";
import ProductSelect from "./components/ProductSelect";
import Preview from "./components/Preview";
import Sidebar from "./components/Sidebar";
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Logout,
  SwapHoriz,
} from '@mui/icons-material';

function App() {
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFabric, setSelectedFabric] = useState(null);
  const [selectedTopStyle, setSelectedTopStyle] = useState("t1");
  const [selectedBottomStyle, setSelectedBottomStyle] = useState("p1");

  // Restore login session on load
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pp_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.email && parsed?.token) {
          setUser(parsed);
        }
      }
    } catch (err) {
      console.warn("Failed to restore session", err);
    }
  }, []);

  const products = [
    { id: "pattu-paavadai", name: "Pattu Paavadai", blurb: "Handwoven silk skirt set crafted for festive shine.", accent: "#fbbf24" },
    { id: "ethnic-frock", name: "Ethnic Frock", blurb: "Lightweight frock with zari trims for celebrations.", accent: "#a855f7" },
    { id: "kurta-pyjama", name: "Kurta Pyjama", blurb: "Classic kurta with comfy pyjama for all-day wear.", accent: "#38bdf8" },
    { id: "kurta-pant", name: "Kurta Pant", blurb: "Structured kurta paired with modern slim pants.", accent: "#22c55e" },
  ];

  const fabrics = [
    { id: "banarasi-silk", name: "Banarasi Silk", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
    { id: "tissue-silk", name: "Tissue Silk", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
    { id: "kalamkari-kalyani", name: "Kalamkari Kalyani", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
    { id: "cotton", name: "Cotton", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
    { id: "organza", name: "Organza", modelTop: "/models/t1.glb", modelBottom: "/models/t1.glb", modelSleeves: "/models/t1.glb" },
  ];

  const topStyles = [
    { id: "t1", name: "Top 1", path: "/models/t1.glb" },
    { id: "t2", name: "Top 2", path: "/models/t2.glb" },
    { id: "t3", name: "Top 3", path: "/models/t3.glb" },
    { id: "t4", name: "Top 4", path: "/models/t4.glb" },
  ];

  const bottomStyles = [
    { id: "p1", name: "Bottom 1", path: "/models/p1.glb" },
    { id: "p2", name: "Bottom 2", path: "/models/p2.glb" },
    { id: "p3", name: "Bottom 3", path: "/models/p3.glb" },
    { id: "p4", name: "Bottom 4", path: "/models/p4.glb" },
  ];

  const handleSignOut = () => {
    setUser(null);
    setSelectedProduct(null);
    setSelectedFabric(null);
    setSelectedTopStyle("t1");
    setSelectedBottomStyle("p1");
    localStorage.removeItem("pp_user");
  };

  const activeProduct = products.find((p) => p.id === selectedProduct) || null;
  const activeFabric = useMemo(
    () => fabrics.find((f) => f.id === selectedFabric) || null,
    [selectedFabric]
  );

  const handleProductSelect = (product) => {
    setSelectedProduct(product.id);
    setSelectedFabric(null);
  };

  const handleChangeProduct = () => {
    setSelectedProduct(null);
    setSelectedFabric(null);
    setSelectedTopStyle("t1");
    setSelectedBottomStyle("p1");
  };

  const handleFabricSelect = (fabricId) => {
    setSelectedFabric(fabricId);
  };

  const handleTopStyleSelect = (styleId) => {
    setSelectedTopStyle(styleId);
  };

  const handleBottomStyleSelect = (styleId) => {
    setSelectedBottomStyle(styleId);
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem("pp_user", JSON.stringify(userData));
  };

  if (!user) {
    return (
          <AuthForm onAuthSuccess={handleAuthSuccess} />
    );
  }

  if (!selectedProduct) {
    return (
      <ProductSelect
        user={user}
        products={products}
        onSelect={handleProductSelect}
        onSignOut={handleSignOut}
      />
    );
  }

  const fabricModels = {
    top: activeFabric?.modelTop || `/models/${selectedTopStyle}.glb`,
    bottom: activeFabric?.modelBottom || `/models/${selectedBottomStyle}.glb`,
    sleeves: activeFabric?.modelSleeves || `/models/${selectedTopStyle}.glb`,
  };

  return (
    <div className="app-shell">
      <AppBar
        position="fixed"
        sx={{
          background: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.6)',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 600,
              }}
            >
              Pattupavadai
            </Typography>
            <Typography variant="h6" fontWeight={700} sx={{ color: 'white', fontSize: '18px' }}>
              3D Dresser
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {activeProduct && (
              <Paper
                elevation={0}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  px: 2,
                  py: 1,
                  background: 'rgba(255,255,255,0.05)',
                  border: `2px solid ${activeProduct.accent}`,
                  borderRadius: 3,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: activeProduct.accent,
                    boxShadow: `0 0 10px ${activeProduct.accent}`,
                  }}
                />
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: '10px',
                      display: 'block',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                    }}
                  >
                    Selected
                  </Typography>
                  <Typography variant="body2" fontWeight={600} sx={{ color: 'white', fontSize: '13px' }}>
                    {activeProduct.name}
                  </Typography>
                </Box>
                <Button
                  size="small"
                  startIcon={<SwapHoriz />}
                  onClick={handleChangeProduct}
                  sx={{
                    ml: 1,
                    color: 'white',
                    textTransform: 'none',
                    fontSize: '12px',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                    },
                  }}
                >
                  Change
                </Button>
              </Paper>
            )}

            <Paper
              elevation={0}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
                px: 2,
                py: 1,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 3,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  fontSize: '14px',
                  fontWeight: 700,
                }}
              >
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ color: 'white', fontSize: '13px' }}>
                  {user.name}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.6)',
                    fontSize: '11px',
                    display: 'block',
                  }}
                >
                  {user.email}
                </Typography>
              </Box>
              <IconButton
                size="small"
                onClick={handleSignOut}
                sx={{
                  ml: 1,
                  color: 'rgba(255,255,255,0.7)',
                  '&:hover': {
                    color: 'white',
                    background: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <Logout fontSize="small" />
              </IconButton>
            </Paper>
          </Box>
        </Toolbar>
      </AppBar>

      <div className="app-body">
        <Sidebar
          fabrics={fabrics}
          selectedFabric={selectedFabric}
          onFabricSelect={handleFabricSelect}
          topStyles={topStyles}
          selectedTopStyle={selectedTopStyle}
          onTopStyleSelect={handleTopStyleSelect}
          bottomStyles={bottomStyles}
          selectedBottomStyle={selectedBottomStyle}
          onBottomStyleSelect={handleBottomStyleSelect}
        />

        <div className="scene-panel">
          <Scene fabricModels={fabricModels} />
        </div>
      </div>

    </div>
  );
}

export default App;