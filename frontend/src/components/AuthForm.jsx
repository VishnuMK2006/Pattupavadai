import { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  TextField,
  Link,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  CheckroomOutlined,
  ArrowBack,
  Visibility,
  VisibilityOff,
  Facebook,
  Google,
} from "@mui/icons-material";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AuthForm({ onAuthSuccess }) {
  const [mode, setMode] = useState("signup"); // "login" or "signup"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
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

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Unable to authenticate. Please try again.");
      }

      onAuthSuccess?.(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        overflow: "hidden",
      }}
    >
      {/* Left Side - Hero Image */}
      <Box
        sx={{
          flex: 1,
          background: "linear-gradient(135deg, #0f1419 0%, #1a2332 100%)",
          position: "relative",
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            position: "absolute",
            top: 40,
            left: 40,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <CheckroomOutlined sx={{ fontSize: 32, color: "white" }} />
        </Box>

        {/* Center Content - Decorative Glow */}
        <Box
          sx={{
            width: "70%",
            height: "70%",
            background:
              "radial-gradient(ellipse at center, rgba(255,100,150,0.3) 0%, rgba(100,150,255,0.2) 50%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            animation: "pulse 4s ease-in-out infinite",
            "@keyframes pulse": {
              "0%, 100%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.1)" },
            },
          }}
        />

        {/* Brand Name */}
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            bottom: 40,
            left: 40,
            color: "rgba(255,255,255,0.7)",
            fontWeight: 300,
            letterSpacing: "0.5px",
          }}
        >
          Pattupavadai
        </Typography>
      </Box>

      {/* Right Side - Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 3,
          }}
        >
          <IconButton
            onClick={() => {
              /* Add back navigation if needed */
            }}
            sx={{ color: "#666" }}
          >
            <ArrowBack />
          </IconButton>

          <Typography variant="body2" sx={{ color: "#666" }}>
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
            <Link
              component="button"
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              sx={{
                color: "#000",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              {mode === "login" ? "Sign Up" : "Log In"}
            </Link>
          </Typography>
        </Box>

        {/* Form Container */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 3, sm: 6, md: 8 },
            py: 4,
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 480 }}>
            {/* Title */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: "#000",
                mb: 4,
              }}
            >
              {mode === "signup" ? "Create an Account" : "Welcome Back"}
            </Typography>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                {mode === "signup" && (
                  <>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "#000",
                            mb: 1,
                          }}
                        >
                          First Name
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="John"
                          value={form.name}
                          onChange={handleChange("name")}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              bgcolor: "#f5f5f5",
                              "& fieldset": {
                                borderColor: "transparent",
                              },
                              "&:hover fieldset": {
                                borderColor: "#e0e0e0",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#000",
                                borderWidth: "1px",
                              },
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 500,
                            color: "#000",
                            mb: 1,
                          }}
                        >
                          Last Name
                        </Typography>
                        <TextField
                          fullWidth
                          placeholder="Doe"
                          value={form.lastName}
                          onChange={handleChange("lastName")}
                          required
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "12px",
                              bgcolor: "#f5f5f5",
                              "& fieldset": {
                                borderColor: "transparent",
                              },
                              "&:hover fieldset": {
                                borderColor: "#e0e0e0",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#000",
                                borderWidth: "1px",
                              },
                            },
                          }}
                        />
                      </Grid>
                    </Grid>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#000",
                          mb: 1,
                        }}
                      >
                        Shipping Address
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="Enter your complete address"
                        value={form.shippingAddress}
                        onChange={handleChange("shippingAddress")}
                        required
                        multiline
                        rows={2}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            bgcolor: "#f5f5f5",
                            "& fieldset": {
                              borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                              borderColor: "#e0e0e0",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#000",
                              borderWidth: "1px",
                            },
                          },
                        }}
                      />
                    </Box>

                    <Box>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 500,
                          color: "#000",
                          mb: 1,
                        }}
                      >
                        Contact Details
                      </Typography>
                      <TextField
                        fullWidth
                        placeholder="+91 90000 00000"
                        value={form.contactDetails}
                        onChange={handleChange("contactDetails")}
                        required
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            bgcolor: "#f5f5f5",
                            "& fieldset": {
                              borderColor: "transparent",
                            },
                            "&:hover fieldset": {
                              borderColor: "#e0e0e0",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#000",
                              borderWidth: "1px",
                            },
                          },
                        }}
                      />
                    </Box>
                  </>
                )}

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "#000",
                      mb: 1,
                    }}
                  >
                    Email Address
                  </Typography>
                  <TextField
                    fullWidth
                    type="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f5f5f5",
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: "#e0e0e0",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#000",
                          borderWidth: "1px",
                        },
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: "#000",
                      mb: 1,
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange("password")}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                        bgcolor: "#f5f5f5",
                        "& fieldset": {
                          borderColor: "transparent",
                        },
                        "&:hover fieldset": {
                          borderColor: "#e0e0e0",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#000",
                          borderWidth: "1px",
                        },
                      },
                    }}
                  />
                </Box>

                {error && (
                  <Alert severity="error" onClose={() => setError("")} sx={{ borderRadius: 2 }}>
                    {error}
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    bgcolor: "#000",
                    color: "white",
                    textTransform: "none",
                    fontSize: "15px",
                    fontWeight: 600,
                    py: 1.8,
                    borderRadius: "50px",
                    boxShadow: "none",
                    mt: 1,
                    "&:hover": {
                      bgcolor: "#333",
                      boxShadow: "none",
                    },
                    "&:disabled": {
                      bgcolor: "#e0e0e0",
                      color: "#999",
                    },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={20} sx={{ color: "#999" }} />
                  ) : mode === "login" ? (
                    "Log In"
                  ) : (
                    "Create Account"
                  )}
                </Button>

                {mode === "signup" && (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="body2" sx={{ fontSize: "13px", color: "#666" }}>
                        I agree to the{" "}
                        <Link href="#" sx={{ color: "#000", fontWeight: 500 }}>
                          Terms & Condition
                        </Link>
                      </Typography>
                    }
                  />
                )}
              </Box>
            </form>

            {/* Divider */}
            <Box sx={{ display: "flex", alignItems: "center", my: 3 }}>
              <Divider sx={{ flex: 1 }} />
              <Typography
                variant="body2"
                sx={{
                  px: 2,
                  color: "#999",
                  fontSize: "13px",
                }}
              >
                or
              </Typography>
              <Divider sx={{ flex: 1 }} />
            </Box>

            {/* Social Login Buttons */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook sx={{ color: "#1877f2" }} />}
                sx={{
                  textTransform: "none",
                  color: "#000",
                  borderColor: "#e0e0e0",
                  bgcolor: "white",
                  py: 1.3,
                  borderRadius: "12px",
                  fontWeight: 500,
                  fontSize: "14px",
                  "&:hover": {
                    borderColor: "#ccc",
                    bgcolor: "#f9f9f9",
                  },
                }}
              >
                Continue with Facebook
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <Box
                    component="img"
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' width='20px' height='20px'%3E%3Cpath fill='%234285F4' d='M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z'/%3E%3Cpath fill='%2334A853' d='M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z'/%3E%3Cpath fill='%23FBBC05' d='M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z'/%3E%3Cpath fill='%23EA4335' d='M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z'/%3E%3C/svg%3E"
                    sx={{ width: 20, height: 20 }}
                  />
                }
                sx={{
                  textTransform: "none",
                  color: "#000",
                  borderColor: "#e0e0e0",
                  bgcolor: "white",
                  py: 1.3,
                  borderRadius: "12px",
                  fontWeight: 500,
                  fontSize: "14px",
                  "&:hover": {
                    borderColor: "#ccc",
                    bgcolor: "#f9f9f9",
                  },
                }}
              >
                Continue with Google
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
