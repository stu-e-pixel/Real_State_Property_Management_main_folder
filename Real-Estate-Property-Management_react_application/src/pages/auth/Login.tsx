import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import { Box, Typography, Link, Divider, Button } from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { Login as LoginIcon } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";
import { loginSchema } from "../../utils/validations";
import { login, clearError } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { LoginFormValues } from "../../typescript/type/auth.types";
import { BriefcaseBusinessIcon, CheckCircle2Icon, HomeIcon } from "lucide-react";

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading, isAuthenticated } = useAppSelector((state) => state.auth);

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),

    defaultValues: {
      email: "",
      password: "",
    },
  });


  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

 
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);


  const onSubmit = async (data: LoginFormValues): Promise<void> => {
    const result = await dispatch(login(data)).unwrap();
    

    console.log("role", result.data.user?.role);

    if (result.data.user?.role === "admin") {
      navigate("/admin/dashboard");
    } else if (result.data.user?.role === "agent") {
      navigate("/agent/dashboard");
    } else if (result.data.user?.role === "owner") {
      navigate("/owner/dashboard");
    } else if (result.data.user?.role === "customer") {
      navigate("/user");
    } else {
      navigate("/");
    }
  };

  return (
    <Box
  sx={{
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    px: { xs: 2, sm: 3 },
    py: { xs: 4, md: 6 },
    background:
      "radial-gradient(circle at top left, #ccfbf1 0%, transparent 35%), linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)",
  }}
>
  <Box
    sx={{
      width: "100%",
      maxWidth: 1000,
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      overflow: "hidden",
      borderRadius: { xs: 4, md: 5 },
      bgcolor: "#ffffff",
      border: "1px solid #e2e8f0",
      boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
    }}
  >
   
    <Box
      sx={{
        width: { xs: "100%", md: "42%" },
        p: { xs: 3, sm: 4, md: 5 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 4,
        color: "#ffffff",
        background:
          "linear-gradient(145deg, #0f172a 0%, #134e4a 65%, #0f766e 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
     
      <Box
        sx={{
          position: "absolute",
          width: 240,
          height: 240,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.12)",
          top: -100,
          right: -100,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 170,
          height: 170,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.1)",
          top: -65,
          right: -65,
        }}
      />

      
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: { xs: 3, md: 7 },
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2.5,
              bgcolor: "#14b8a6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
            }}
          >
            <HomeIcon />
          </Box>

          <Typography
            component="span"
            sx={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "-0.7px",
            }}
          >
            RealEstate
          </Typography>
        </Box>

        <Typography
          component="h1"
          sx={{
            fontSize: { xs: 27, sm: 32, md: 36 },
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: "-1px",
            mb: 2,
          }}
        >
          Welcome home.
          <br />
          Your journey starts here.
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: 14,
            lineHeight: 1.9,
            color: "#cbd5e1",
            maxWidth: 320,
          }}
        >
          Sign in to explore properties, manage your favorites, and connect
          with real estate professionals.
        </Typography>
      </Box>

     
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {[
          "Explore properties that match your needs",
          "Keep track of your favorite listings",
          "Manage your property inquiries",
        ].map((benefit) => (
          <Box
            key={benefit}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.5,
              mb: 2,
            }}
          >
            <CheckCircle2Icon/>

            <Typography
              component="span"
              sx={{
                fontSize: 13,
                color: "#e2e8f0",
                lineHeight: 1.7,
              }}
            >
              {benefit}
            </Typography>
          </Box>
        ))}

        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <Typography
            component="p"
            sx={{
              fontSize: 12,
              color: "#99f6e4",
              fontWeight: 600,
              letterSpacing: 1,
            }}
          >
            FIND YOUR PLACE. FEEL AT HOME.
          </Typography>
        </Box>
      </Box>
    </Box>

    
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: { xs: 3, sm: 4, md: 6 },
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
     
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 1.5,
            py: 0.75,
            borderRadius: 10,
            bgcolor: "#ccfbf1",
            color: "#115e59",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: 1,
            mb: 2,
          }}
        >
          ACCOUNT ACCESS
        </Box>

        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 28, sm: 34 },
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.8px",
            mb: 1,
          }}
        >
          Welcome back!
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.8,
          }}
        >
          Enter your credentials to access your account.
        </Typography>
      </Box>

      {/* Login Form */}
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2.5,
              bgcolor: "#ffffff",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#5eead4",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#0f766e",
                borderWidth: 1.5,
              },
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#0f766e",
            },
          }}
        >
          <FormInput<LoginFormValues>
            name="email"
            control={control}
            label="Email Address"
            type="email"
          />

          <FormInput<LoginFormValues>
            name="password"
            control={control}
            label="Password"
            type="password"
          />

          
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: -1,
            }}
          >
            <Link
              component={RouterLink}
              to="/forgot-password"
              underline="none"
              sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#0f766e",
                "&:hover": {
                  color: "#115e59",
                  textDecoration: "underline",
                },
              }}
            >
              Forgot password?
            </Link>
          </Box>

          
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            startIcon={<LoginIcon />}
            sx={{
              mt: 1,
              py: 1.6,
              borderRadius: 2.5,
              textTransform: "none",
              fontSize: 15,
              fontWeight: 800,
              bgcolor: "#0f766e",
              color: "#ffffff",
              boxShadow: "0 8px 18px rgba(15,118,110,0.18)",
              "&:hover": {
                bgcolor: "#115e59",
                boxShadow: "0 10px 22px rgba(15,118,110,0.24)",
              },
              "&.Mui-disabled": {
                bgcolor: "#99c9c3",
                color: "#ffffff",
              },
            }}
          >
            Sign In to Your Account
          </LoadingButton>
        </Box>
      </Box>

      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          my: 3,
        }}
      >
        <Divider sx={{ flex: 1, borderColor: "#e2e8f0" }} />

        <Typography
          component="span"
          sx={{
            color: "#94a3b8",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          NEW HERE?
        </Typography>

        <Divider sx={{ flex: 1, borderColor: "#e2e8f0" }} />
      </Box>

      
      <Box
        sx={{
          p: 2,
          border: "1px solid #e2e8f0",
          borderRadius: 3,
          bgcolor: "#f8fafc",
          textAlign: "center",
        }}
      >
        <Typography
          component="p"
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: "#0f172a",
            mb: 0.75,
          }}
        >
          Don't have an account yet?
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: 12,
            color: "#64748b",
            mb: 1.5,
          }}
        >
          Create an account to get started.
        </Typography>

        <Button
          component={RouterLink}
          to="/register"
          fullWidth
          variant="outlined"
          sx={{
            py: 1.1,
            borderRadius: 2,
            borderColor: "#0f766e",
            color: "#0f766e",
            textTransform: "none",
            fontWeight: 800,
            "&:hover": {
              bgcolor: "#f0fdfa",
              borderColor: "#115e59",
            },
          }}
        >
          Create Customer Account
        </Button>
      </Box>

      
      <Box sx={{ mt: 3 }}>
        <Typography
          component="p"
          sx={{
            textAlign: "center",
            fontSize: 12,
            color: "#64748b",
            mb: 1.5,
          }}
        >
          Are you a property professional?
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          <Button
            component={RouterLink}
            to="/agent/register"
            size="small"
            startIcon={<BriefcaseBusinessIcon />}
            sx={{
              color: "#334155",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#f1f5f9",
                color: "#0f766e",
              },
            }}
          >
            Register as Agent
          </Button>

          <Button
            component={RouterLink}
            to="/owner/register"
            size="small"
            startIcon={<HomeIcon />}
            sx={{
              color: "#334155",
              textTransform: "none",
              fontWeight: 700,
              "&:hover": {
                bgcolor: "#f1f5f9",
                color: "#0f766e",
              },
            }}
          >
            Register as Owner
          </Button>
        </Box>
      </Box>

  
      <Typography
        component="p"
        sx={{
          mt: 4,
          textAlign: "center",
          color: "#94a3b8",
          fontSize: 11,
        }}
      >
        © {new Date().getFullYear()} RealEstate. All rights reserved.
      </Typography>
    </Box>
  </Box>
</Box>
  );
};

export default Login;
