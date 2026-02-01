import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  Link,
  Divider,
  InputAdornment,
  IconButton as MuiIconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Close } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function AuthForm({ onAuthSuccess, onClose }) {
  const [step, setStep] = useState(1); // 1: email, 2: password/signup details
  const [mode, setMode] = useState("login"); // "login" or "signup"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Google Auth Initialization
  useEffect(() => {
    const initGoogle = () => {
      /* global google */
      if (typeof google !== "undefined") {
        if (!GOOGLE_CLIENT_ID) {
          console.error("Google Client ID is missing.");
          return;
        }

        // Initialize only once
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        // Always try to render both, the function handles missing elements
        const renderBtns = () => {
          const btn1 = document.getElementById("google-signin-step1");
          if (btn1) {
            google.accounts.id.renderButton(btn1, { theme: "outline", size: "large", width: 350 });
          }
          const btn2 = document.getElementById("google-signin-step2");
          if (btn2) {
            google.accounts.id.renderButton(btn2, { theme: "outline", size: "large", width: 350 });
          }
        };

        // Small delay to ensure DOM is ready
        setTimeout(renderBtns, 100);
      }
    };

    const timer = setTimeout(initGoogle, 1000);
    return () => clearTimeout(timer);
  }, [step]);

  const handleGoogleResponse = async (response) => {
    setLoading(true);
    setError("");
    try {
      // Decode the credential (ID Token) to get user info locally
      const base64Url = response.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const googleUser = JSON.parse(jsonPayload);

      const res = await fetch(`${API_BASE}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: response.credential,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        let msg = "Google authentication failed";
        if (data.detail) {
          msg = typeof data.detail === 'string' ? data.detail : JSON.stringify(data.detail);
        }
        throw new Error(msg);
      }

      onAuthSuccess?.(data.user);
    } catch (err) {
      console.error("Google Auth Error:", err);
      setError("Google Login failed: " + (err.message || "Please check your network"));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    /* global google */
    if (typeof google !== "undefined") {
      google.accounts.id.prompt();
    } else {
      setError("Google Login script not loaded. Please check your internet connection.");
    }
  };

  const [form, setForm] = useState({
    email: "",
    name: "",
    lastName: "",
    shippingAddress: "",
    contactDetails: "",
    password: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleContinue = () => {
    if (!form.email.trim()) {
      setError("Please enter your email or mobile number");
      return;
    }
    setError("");
    setStep(2);
  };

  const validatePhone = (num) => {
    if (!num) return false;
    const digits = num.replace(/\D/g, "");
    const clean = (digits.startsWith("91") && digits.length === 12) ? digits.slice(2) : digits;
    const regex = /^[6-9]\d{9}$/;
    return regex.test(clean);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (mode === "signup" && !validatePhone(form.contactDetails)) {
      setError("Please enter a valid 10-digit Contact number");
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const endpoint = mode === "signup" ? "/auth/signup" : "/auth/login";
      const fullName = mode === "signup" ? `${form.name} ${form.lastName}`.trim() : form.name;
      const payload =
        mode === "signup"
          ? {
            email: form.email.trim(),
            name: fullName,
            shipping_address: form.shippingAddress.trim(),
            contact_details: form.contactDetails.trim(),
            password: form.password,
          }
          : {
            email: form.email.trim(),
            password: form.password,
          };

      console.log(`Attempting ${mode} via ${endpoint}...`);
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      console.log("Auth Response:", data);

      if (!response.ok) {
        let msg = "Unable to authenticate. Please check your credentials.";
        if (data.detail) {
          if (typeof data.detail === 'string') {
            msg = data.detail;
          } else if (Array.isArray(data.detail)) {
            msg = data.detail.map(err => err.msg).join(", ");
          } else {
            msg = JSON.stringify(data.detail);
          }
        }
        throw new Error(msg);
      }

      onAuthSuccess?.(data.user);
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.message || "Network error. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#FFFFFF",
          p: 3,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 350,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: 'relative'
          }}
        >
          {onClose && (
            <MuiIconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: -10,
                right: -20,
                color: '#4C0013',
                bgcolor: 'rgba(76, 0, 19, 0.05)',
                '&:hover': { bgcolor: 'rgba(76, 0, 19, 0.1)' }
              }}
            >
              <Close sx={{ fontSize: 20 }} />
            </MuiIconButton>
          )}

          {/* Logo */}
          <Box
            sx={{
              mb: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              component="img"
              src="/images/logo.jpg"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                mr: 2,
                boxShadow: '0 4px 10px rgba(76, 0, 19, 0.1)'
              }}
            />
            <Typography
              sx={{
                fontSize: 32,
                fontWeight: 900,
                color: "#4C0013",
                fontFamily: '"Playfair Display", serif',
                letterSpacing: "-1px",
              }}
            >
              Kuzhavi<span style={{ color: '#E3A018' }}>_Kids</span>
            </Typography>
          </Box>

          {/* Form Card */}
          <Box
            sx={{
              width: "100%",
              borderRadius: "32px",
              p: "40px 30px",
              bgcolor: "#FFFFFF",
              boxShadow: '0 20px 60px rgba(76, 0, 19, 0.05)',
              border: '1px solid rgba(76, 0, 19, 0.05)'
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#4C0013",
                mb: 3,
                fontFamily: '"Playfair Display", serif',
                textAlign: 'center'
              }}
            >
              Welcome Back
            </Typography>

            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "#111111",
                  mb: "4px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Enter mobile number or email
              </Typography>

              <TextField
                fullWidth
                type="text"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="Email or Mobile Number"
                autoFocus
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    fontSize: "14px",
                    bgcolor: "#FFFDF5",
                    fontFamily: '"Outfit", sans-serif',
                    "& fieldset": {
                      borderColor: "rgba(76, 0, 19, 0.1)",
                      borderRadius: "16px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#B38B00",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#B38B00",
                      borderWidth: "1.5px",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "12px 16px",
                  },
                }}
              />

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    mb: 2,
                    fontSize: "12px",
                    bgcolor: "#FFF4E5",
                    color: "#C40000",
                    border: "1px solid #F0C14B",
                    borderRadius: "4px",
                    "& .MuiAlert-icon": {
                      color: "#C40000",
                    }
                  }}
                >
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: "#4C0013",
                  color: "#FFFFFF",
                  textTransform: "none",
                  fontSize: "15px",
                  fontWeight: 700,
                  py: "12px",
                  borderRadius: "50px",
                  boxShadow: "0 10px 20px rgba(76, 0, 19, 0.2)",
                  fontFamily: '"Outfit", sans-serif',
                  "&:hover": {
                    bgcolor: "#1A0006",
                    boxShadow: "0 15px 30px rgba(76, 0, 19, 0.3)",
                  },
                }}
              >
                Continue
              </Button>

              <Box sx={{ my: 2 }}>
                <Divider sx={{ "&::before, &::after": { borderColor: "#E7E7E7" } }}>
                  <Typography sx={{ fontSize: "12px", color: "#666", px: 1 }}>or</Typography>
                </Divider>
              </Box>

              <Box id="google-signin-step1" sx={{
                mt: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                '& iframe': { margin: '0 auto' } // Center the actual iframe
              }} />

              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#666",
                  mt: 3,
                  textAlign: 'center',
                  fontFamily: '"Outfit", sans-serif',
                }}
              >
                Don't have an account?{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={() => {
                    const val = form.email.trim();
                    const isEmail = val.includes("@");
                    const isPhone = /^\d+$/.test(val.replace(/[\s\-\+]/g, ""));

                    setForm(prev => ({
                      ...prev,
                      email: isEmail ? val : "",
                      contactDetails: isPhone ? val : prev.contactDetails
                    }));

                    setMode("signup");
                    setStep(2);
                    setError("");
                  }}
                  sx={{
                    color: "#B38B00",
                    fontWeight: 800,
                    textDecoration: "none",
                    fontSize: "12px",
                    "&:hover": { textDecoration: "underline" },
                  }}
                >
                  SIGN UP NOW
                </Link>
              </Typography>

              <Typography
                sx={{
                  fontSize: "10px",
                  color: "rgba(0,0,0,0.4)",
                  mt: 4,
                  lineHeight: 1.4,
                  textAlign: 'center',
                  fontFamily: '"Outfit", sans-serif',
                }}
              >
                By continuing, you agree to Kuzhavi Kids's Conditions of Use and Privacy Notice.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  // Step 2: Password / Signup form

  // Step 2: Password / Signup form
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        bgcolor: "#FFFFFF",
        p: { xs: 2, md: 4 },
        maxHeight: '90vh',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' }
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 380,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: 'relative'
        }}
      >
        {onClose && (
          <MuiIconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: -10,
              right: -10,
              color: '#4C0013',
              bgcolor: 'rgba(76, 0, 19, 0.05)',
              '&:hover': { bgcolor: 'rgba(76, 0, 19, 0.1)' }
            }}
          >
            <Close sx={{ fontSize: 20 }} />
          </MuiIconButton>
        )}
        {/* Logo */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            component="img"
            src="/images/logo.jpg"
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              mr: 1.5,
              boxShadow: '0 4px 10px rgba(76, 0, 19, 0.1)'
            }}
          />
          <Typography
            sx={{
              fontSize: 28,
              fontWeight: 900,
              color: "#4C0013",
              fontFamily: '"Playfair Display", serif',
              letterSpacing: "-1px",
            }}
          >
            Kuzhavi<span style={{ color: '#E3A018' }}>_Kids</span>
          </Typography>
        </Box>

        {/* Form Card */}
        <Box
          sx={{
            width: "100%",
            borderRadius: "32px",
            p: "30px 25px",
            bgcolor: "#FFFFFF",
            boxShadow: '0 20px 60px rgba(76, 0, 19, 0.05)',
            border: '1px solid rgba(76, 0, 19, 0.05)'
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: "24px",
              fontWeight: 800,
              color: "#4C0013",
              mb: 3,
              fontFamily: '"Playfair Display", serif',
              textAlign: 'center'
            }}
          >
            {mode === "login" ? "Sign In" : "Create Account"}
          </Typography>

          {mode === "login" && (
            <Typography sx={{ fontSize: '13px', color: '#666', mb: 2 }}>
              Logging in as: <strong>{form.email}</strong>
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#4C0013", mb: "6px", fontFamily: '"Outfit", sans-serif' }}>
                  Your Name
                </Typography>
                <TextField
                  fullWidth
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="First and last name"
                  required
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      bgcolor: "#FFFDF5",
                      fontFamily: '"Outfit", sans-serif',
                      "& fieldset": { borderColor: "rgba(76, 0, 19, 0.1)", borderRadius: "16px" },
                      "&:hover fieldset": { borderColor: "#B38B00" },
                      "&.Mui-focused fieldset": { borderColor: "#B38B00", borderWidth: "1.5px" },
                    },
                    "& .MuiOutlinedInput-input": { padding: "12px 16px" },
                  }}
                />

                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#4C0013", mb: "6px", fontFamily: '"Outfit", sans-serif' }}>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  type="email"
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="name@example.com"
                  required
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      bgcolor: "#FFFDF5",
                      fontFamily: '"Outfit", sans-serif',
                      "& fieldset": { borderColor: "rgba(76, 0, 19, 0.1)", borderRadius: "16px" },
                      "&:hover fieldset": { borderColor: "#B38B00" },
                      "&.Mui-focused fieldset": { borderColor: "#B38B00", borderWidth: "1.5px" },
                    },
                    "& .MuiOutlinedInput-input": { padding: "12px 16px" },
                  }}
                />

                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#4C0013", mb: "6px", fontFamily: '"Outfit", sans-serif' }}>
                  Contact Number
                </Typography>
                <TextField
                  fullWidth
                  value={form.contactDetails}
                  onChange={handleChange("contactDetails")}
                  placeholder="10-digit mobile number"
                  required
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      bgcolor: "#FFFDF5",
                      fontFamily: '"Outfit", sans-serif',
                      "& fieldset": { borderColor: "rgba(76, 0, 19, 0.1)", borderRadius: "16px" },
                      "&:hover fieldset": { borderColor: "#B38B00" },
                      "&.Mui-focused fieldset": { borderColor: "#B38B00", borderWidth: "1.5px" },
                    },
                    "& .MuiOutlinedInput-input": { padding: "12px 16px" },
                  }}
                />

                <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#4C0013", mb: "6px", fontFamily: '"Outfit", sans-serif' }}>
                  Shipping Address
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={form.shippingAddress}
                  onChange={handleChange("shippingAddress")}
                  placeholder="Complete address for courier"
                  required
                  sx={{
                    mb: 2,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "14px",
                      bgcolor: "#FFFDF5",
                      fontFamily: '"Outfit", sans-serif',
                      "& fieldset": { borderColor: "rgba(76, 0, 19, 0.1)", borderRadius: "16px" },
                      "&:hover fieldset": { borderColor: "#B38B00" },
                      "&.Mui-focused fieldset": { borderColor: "#B38B00", borderWidth: "1.5px" },
                    },
                    "& .MuiOutlinedInput-input": { padding: "12px 16px" },
                  }}
                />
              </>
            )}

            <Typography sx={{ fontSize: "13px", fontWeight: 700, color: "#4C0013", mb: "6px", fontFamily: '"Outfit", sans-serif' }}>
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange("password")}
              placeholder={mode === "signup" ? "At least 6 characters" : ""}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <MuiIconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: '#4C0013' }}
                    >
                      {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                    </MuiIconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  fontSize: "14px",
                  bgcolor: "#FFFDF5",
                  fontFamily: '"Outfit", sans-serif',
                  "& fieldset": {
                    borderColor: "rgba(76, 0, 19, 0.1)",
                    borderRadius: "16px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#B38B00",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#B38B00",
                    borderWidth: "1.5px",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "12px 16px",
                },
              }}
            />

            {mode === "signup" && (
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#111111",
                  mb: 2,
                  lineHeight: 1.4,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                Passwords must be at least 6 characters.
              </Typography>
            )}

            {error && (
              <Alert
                severity="error"
                sx={{
                  mb: 2,
                  fontSize: "12px",
                  bgcolor: "#FFF4E5",
                  color: "#C40000",
                  border: "1px solid #F0C14B",
                  borderRadius: "4px",
                  "& .MuiAlert-icon": {
                    color: "#C40000",
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                bgcolor: "#4C0013",
                color: "#FFFFFF",
                textTransform: "none",
                fontSize: "15px",
                fontWeight: 700,
                py: "12px",
                mt: 1,
                borderRadius: "50px",
                boxShadow: "0 10px 20px rgba(76, 0, 19, 0.2)",
                fontFamily: '"Outfit", sans-serif',
                "&:hover": {
                  bgcolor: "#1A0006",
                  boxShadow: "0 15px 30px rgba(76, 0, 19, 0.3)",
                },
                "&:disabled": {
                  bgcolor: "rgba(76, 0, 19, 0.1)",
                  color: "#666666",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={16} sx={{ color: "#FFFFFF" }} />
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>

            <Box sx={{ my: 2 }}>
              <Divider sx={{ "&::before, &::after": { borderColor: "#E7E7E7" } }}>
                <Typography sx={{ fontSize: "12px", color: "#666", px: 1 }}>or</Typography>
              </Divider>
            </Box>

            <Box id="google-signin-step2" sx={{
              mt: 1,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              '& iframe': { margin: '0 auto' }
            }} />

            {mode === "signup" && (
              <Typography
                sx={{
                  fontSize: "11px",
                  color: "#111111",
                  mt: 2,
                  lineHeight: 1.4,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                By creating an account, you agree to Kuzhavi_Kids's{" "}
                <Link
                  href="#"
                  sx={{
                    color: "#146EB4",
                    textDecoration: "none",
                    "&:hover": { color: "#FF9900", textDecoration: "underline" },
                  }}
                >
                  Conditions of Use
                </Link>{" "}
                and{" "}
                <Link
                  href="#"
                  sx={{
                    color: "#146EB4",
                    textDecoration: "none",
                    "&:hover": { color: "#FF9900", textDecoration: "underline" },
                  }}
                >
                  Privacy Notice
                </Link>
                .
              </Typography>
            )}
          </Box>

          {mode === "login" && (
            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Link
                component="button"
                type="button"
                onClick={() => {
                  setMode("login");
                  setStep(1);
                  setError("");
                }}
                sx={{
                  fontSize: "12px",
                  color: "#B38B00",
                  fontWeight: 800,
                  textDecoration: "none",
                  fontFamily: '"Outfit", sans-serif',
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                ← BACK TO EMAIL
              </Link>
            </Box>
          )}

          {mode === "signup" && (
            <Typography
              sx={{
                fontSize: "11px",
                color: "#666",
                mt: 3,
                textAlign: 'center',
                fontFamily: '"Outfit", sans-serif',
              }}
            >
              Already have an account?{" "}
              <Link
                component="button"
                type="button"
                onClick={() => {
                  setMode("login");
                  setStep(1);
                  setError("");
                }}
                sx={{
                  color: "#B38B00",
                  fontWeight: 800,
                  textDecoration: "none",
                  fontSize: "12px",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                SIGN IN
              </Link>
            </Typography>
          )}
        </Box>
      </Box>
    </Box >
  );
}
