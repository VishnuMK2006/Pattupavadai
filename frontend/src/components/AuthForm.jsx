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
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { FcGoogle } from "react-icons/fc";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function AuthForm({ onAuthSuccess }) {
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
      if (!res.ok) throw new Error(data.detail || "Google authentication failed");

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
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
        throw new Error(data.detail || "Unable to authenticate. Please check your credentials.");
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
          }}
        >
          {/* Logo */}
          <Box
            sx={{
              mb: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontSize: 32,
                fontWeight: 700,
                color: "#111111",
                fontFamily: "Arial, sans-serif",
                letterSpacing: "-1px",
              }}
            >
              Kuzhavi_Kids
            </Typography>
            <Box
              component="span"
              sx={{
                fontSize: 28,
                color: "#FF9900",
                ml: 0.5,
                fontWeight: 400,
              }}
            >
              .in
            </Box>
          </Box>

          {/* Form Card */}
          <Box
            sx={{
              width: "100%",
              border: "1px solid #DDDDDD",
              borderRadius: "4px",
              p: "20px 26px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: "28px",
                fontWeight: 400,
                color: "#111111",
                mb: 2,
                fontFamily: "Arial, sans-serif",
              }}
            >
              Sign in or create account
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
                placeholder=""
                autoFocus
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    fontSize: "13px",
                    bgcolor: "#FFFFFF",
                    fontFamily: "Arial, sans-serif",
                    "& fieldset": {
                      borderColor: "#888C8C",
                      borderRadius: "4px",
                    },
                    "&:hover fieldset": {
                      borderColor: "#FF9900",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#FF9900",
                      borderWidth: "1px",
                      boxShadow: "0 0 0 3px rgba(255, 153, 0, 0.15)",
                    },
                  },
                  "& .MuiOutlinedInput-input": {
                    padding: "7px 10px",
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
                  bgcolor: "#FF9900",
                  color: "#111111",
                  textTransform: "none",
                  fontSize: "13px",
                  fontWeight: 400,
                  py: "6px",
                  borderRadius: "8px",
                  boxShadow: "none",
                  border: "1px solid #E77600",
                  fontFamily: "Arial, sans-serif",
                  "&:hover": {
                    bgcolor: "#F08804",
                    boxShadow: "none",
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
                  color: "#111111",
                  mt: 2,
                  lineHeight: 1.4,
                  fontFamily: "Arial, sans-serif",
                }}
              >
                By continuing, you agree to Kuzhavi_Kids's{" "}
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
            </Box>
          </Box>

          {/* New to Kuzhavi Kids? */}
          <Box
            sx={{
              width: "100%",
              mt: 3,
              textAlign: "center",
            }}
          >
            <Divider sx={{ mb: 2 }}>
              <Typography sx={{ fontSize: "12px", color: "#767676" }}>New to Kuzhavi Kids?</Typography>
            </Divider>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                setMode("signup");
                setStep(2);
                setError("");
              }}
              sx={{
                bgcolor: "#f0f2f2",
                color: "#111111",
                textTransform: "none",
                fontSize: "13px",
                fontWeight: 400,
                py: "6px",
                borderRadius: "8px",
                boxShadow: "none",
                border: "1px solid #D5D9D9",
                fontFamily: "Arial, sans-serif",
                "&:hover": {
                  bgcolor: "#e7e9e9",
                  borderColor: "#adb1b1",
                  boxShadow: "none",
                },
              }}
            >
              Create your Kuzhavi Kids account
            </Button>
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
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: 32,
              fontWeight: 700,
              color: "#111111",
              fontFamily: "Arial, sans-serif",
              letterSpacing: "-1px",
            }}
          >
            Kuzhavi_Kids
          </Typography>
          <Box
            component="span"
            sx={{
              fontSize: 28,
              color: "#FF9900",
              ml: 0.5,
              fontWeight: 400,
            }}
          >
            .in
          </Box>
        </Box>

        {/* Form Card */}
        <Box
          sx={{
            width: "100%",
            border: "1px solid #DDDDDD",
            borderRadius: "4px",
            p: "20px 26px",
            bgcolor: "#FFFFFF",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#111111",
              mb: 1,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </Typography>

          {mode === "login" && (
            <Typography sx={{ fontSize: '13px', color: '#666', mb: 2 }}>
              Logging in as: <strong>{form.email}</strong>
            </Typography>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#111111",
                    mb: "4px",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Your name
                </Typography>
                <TextField
                  fullWidth
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="First and last name"
                  required
                  sx={{
                    mb: 1.5,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      bgcolor: "#FFFFFF",
                      fontFamily: "Arial, sans-serif",
                      "& fieldset": { borderColor: "#888C8C", borderRadius: "4px" },
                      "&:hover fieldset": { borderColor: "#FF9900" },
                      "&.Mui-focused fieldset": { borderColor: "#FF9900", borderWidth: "1px", boxShadow: "0 0 0 3px rgba(255, 153, 0, 0.15)" },
                    },
                    "& .MuiOutlinedInput-input": { padding: "7px 10px" },
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#111111",
                    mb: "4px",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Email or mobile number
                </Typography>
                <TextField
                  fullWidth
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="Email or mobile phone number"
                  required
                  sx={{
                    mb: 1.5,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      bgcolor: "#FFFFFF",
                      fontFamily: "Arial, sans-serif",
                      "& fieldset": { borderColor: "#888C8C", borderRadius: "4px" },
                      "&:hover fieldset": { borderColor: "#FF9900" },
                      "&.Mui-focused fieldset": { borderColor: "#FF9900", borderWidth: "1px", boxShadow: "0 0 0 3px rgba(255, 153, 0, 0.15)" },
                    },
                    "& .MuiOutlinedInput-input": { padding: "7px 10px" },
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#111111",
                    mb: "4px",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Contact number
                </Typography>
                <TextField
                  fullWidth
                  value={form.contactDetails}
                  onChange={handleChange("contactDetails")}
                  placeholder="Alternative mobile number (optional)"
                  sx={{
                    mb: 1.5,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      bgcolor: "#FFFFFF",
                      fontFamily: "Arial, sans-serif",
                      "& fieldset": { borderColor: "#888C8C", borderRadius: "4px" },
                      "&:hover fieldset": { borderColor: "#FF9900" },
                      "&.Mui-focused fieldset": { borderColor: "#FF9900", borderWidth: "1px", boxShadow: "0 0 0 3px rgba(255, 153, 0, 0.15)" },
                    },
                    "& .MuiOutlinedInput-input": { padding: "7px 10px" },
                  }}
                />

                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#111111",
                    mb: "4px",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  Shipping address
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  value={form.shippingAddress}
                  onChange={handleChange("shippingAddress")}
                  placeholder="Enter your complete address for delivery"
                  required
                  sx={{
                    mb: 1.5,
                    "& .MuiOutlinedInput-root": {
                      fontSize: "13px",
                      bgcolor: "#FFFFFF",
                      fontFamily: "Arial, sans-serif",
                      "& fieldset": { borderColor: "#888C8C", borderRadius: "4px" },
                      "&:hover fieldset": { borderColor: "#FF9900" },
                      "&.Mui-focused fieldset": { borderColor: "#FF9900", borderWidth: "1px", boxShadow: "0 0 0 3px rgba(255, 153, 0, 0.15)" },
                    },
                    "& .MuiOutlinedInput-input": { padding: "7px 10px" },
                  }}
                />
              </>
            )}

            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#111111",
                mb: "4px",
                fontFamily: "Arial, sans-serif",
              }}
            >
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
                    >
                      {showPassword ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                    </MuiIconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 1,
                "& .MuiOutlinedInput-root": {
                  fontSize: "13px",
                  bgcolor: "#FFFFFF",
                  fontFamily: "Arial, sans-serif",
                  "& fieldset": {
                    borderColor: "#888C8C",
                    borderRadius: "4px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#FF9900",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#FF9900",
                    borderWidth: "1px",
                    boxShadow: "0 0 0 3px rgba(255, 153, 0, 0.15)",
                  },
                },
                "& .MuiOutlinedInput-input": {
                  padding: "7px 10px",
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
                bgcolor: "#FF9900",
                color: "#111111",
                textTransform: "none",
                fontSize: "13px",
                fontWeight: 400,
                py: "6px",
                mt: 1,
                borderRadius: "8px",
                boxShadow: "none",
                border: "1px solid #E77600",
                fontFamily: "Arial, sans-serif",
                "&:hover": {
                  bgcolor: "#F08804",
                  boxShadow: "none",
                },
                "&:disabled": {
                  bgcolor: "#F7CA00",
                  color: "#666666",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={16} sx={{ color: "#111111" }} />
              ) : mode === "login" ? (
                "Sign in"
              ) : (
                "Create your account"
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
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #E7E7E7" }}>
              <Link
                component="button"
                type="button"
                onClick={() => {
                  setMode("login");
                  setStep(1);
                  setError("");
                }}
                sx={{
                  fontSize: "13px",
                  color: "#146EB4",
                  textDecoration: "none",
                  fontFamily: "Arial, sans-serif",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  "&:hover": { color: "#FF9900", textDecoration: "underline" },
                }}
              >
                -Back
              </Link>
            </Box>
          )}

          {mode === "signup" && (
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #E7E7E7", textAlign: "center" }}>
              <Typography
                sx={{
                  fontSize: "13px",
                  color: "#111111",
                  fontFamily: "Arial, sans-serif",
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
                    color: "#146EB4",
                    textDecoration: "none",
                    cursor: "pointer",
                    fontFamily: "Arial, sans-serif",
                    background: "none",
                    border: "none",
                    "&:hover": { color: "#FF9900", textDecoration: "underline" },
                  }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box >
  );
}
