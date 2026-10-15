import React, { useState } from "react";
import type { ChangeEvent } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Box,
  Typography,
  Link,
  Avatar,
  IconButton,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { PhotoCamera, PersonAdd, CheckCircle, Home } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";
import { registerSchema } from "../../utils/validations";
import { register } from "../../features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  AuthFormValues,
  RegisterData,
} from "../../typescript/type/auth.types";

const Register: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.auth);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  
  const { control, handleSubmit } = useForm<AuthFormValues>({
    resolver: yupResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);

      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };


  const onSubmit = async (data: AuthFormValues): Promise<void> => {
    const registerData: RegisterData = {
      ...data,

      ...(imageFile && {
        image: [imageFile],
      }),
    };

    const result = await dispatch(register(registerData));

    if (register.fulfilled.match(result)) {
      navigate("/verify-email", {
        state: {
          email: data.email,
        },
      });
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
      border: "1px solid rgba(226,232,240,0.9)",
      boxShadow: "0 24px 70px rgba(15,23,42,0.12)",
    }}
  >
    {/* LEFT BRAND PANEL */}
    <Box
      sx={{
        width: { xs: "100%", md: "38%" },
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
          width: 230,
          height: 230,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.12)",
          top: -100,
          right: -90,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          width: 170,
          height: 170,
          borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.10)",
          top: -65,
          right: -60,
        }}
      />

      
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            mb: { xs: 3, md: 6 },
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
            <Home sx={{ fontSize: 26 }} />
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
          Your next chapter starts here.
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: 14,
            lineHeight: 1.9,
            color: "#cbd5e1",
            maxWidth: 300,
          }}
        >
          Create your account and discover a simpler way to find, explore,
          and manage your ideal property.
        </Typography>
      </Box>

     
      <Box sx={{ position: "relative", zIndex: 1 }}>
        {[
          "Explore properties that fit your needs",
          "Save your favorite property listings",
          "Connect with property professionals",
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
            <CheckCircle
              sx={{
                color: "#5eead4",
                fontSize: 19,
                mt: 0.2,
                flexShrink: 0,
              }}
            />

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
            }}
          >
            YOUR PROPERTY JOURNEY, SIMPLIFIED
          </Typography>
        </Box>
      </Box>
    </Box>

    
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: { xs: 3, sm: 4, md: 5 },
      }}
    >
     
      <Box sx={{ mb: 3 }}>
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
          CUSTOMER REGISTRATION
        </Box>

        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 27, sm: 32 },
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.8px",
            mb: 1,
          }}
        >
          Create your account
        </Typography>

        <Typography
          component="p"
          sx={{
            fontSize: 14,
            color: "#64748b",
            lineHeight: 1.7,
          }}
        >
          Enter your details below to get started.
        </Typography>
      </Box>

      
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          p: 2,
          mb: 3,
          borderRadius: 3,
          bgcolor: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        <Box sx={{ position: "relative", flexShrink: 0 }}>
          <Avatar
            src={imagePreview ?? undefined}
            alt="Profile preview"
            sx={{
              width: 76,
              height: 76,
              bgcolor: "#ccfbf1",
              color: "#0f766e",
              border: "3px solid #ffffff",
              boxShadow: "0 0 0 1px #cbd5e1",
            }}
          >
            <PersonAdd sx={{ fontSize: 32 }} />
          </Avatar>

          <IconButton
            component="label"
            htmlFor="image-upload"
            aria-label="Upload profile image"
            size="small"
            sx={{
              position: "absolute",
              right: -4,
              bottom: -2,
              bgcolor: "#0f766e",
              color: "#ffffff",
              width: 30,
              height: 30,
              border: "2px solid #ffffff",
              "&:hover": {
                bgcolor: "#115e59",
              },
            }}
          >
            <PhotoCamera sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            component="p"
            sx={{
              fontSize: 14,
              fontWeight: 700,
              color: "#0f172a",
              mb: 0.5,
            }}
          >
            Profile photo
          </Typography>

          <Typography
            component="p"
            sx={{
              fontSize: 12,
              color: "#64748b",
              lineHeight: 1.6,
            }}
          >
            Upload a photo to personalize your account.
          </Typography>

          <input
            accept="image/*"
            id="image-upload"
            type="file"
            hidden
            onChange={handleImageChange}
          />
        </Box>
      </Box>

      
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.2,
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
          <FormInput<AuthFormValues>
            name="name"
            control={control}
            label="Full Name"
          />

          <FormInput<AuthFormValues>
            name="email"
            control={control}
            label="Email Address"
            type="email"
          />

          <FormInput<AuthFormValues>
            name="phone"
            control={control}
            label="Phone Number"
          />

          <FormInput<AuthFormValues>
            name="password"
            control={control}
            label="Password"
            type="password"
          />

          <FormInput<AuthFormValues>
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            type="password"
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            startIcon={<PersonAdd />}
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
            Create Account
          </LoadingButton>
        </Box>
      </Box>

    
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 0.5,
          mt: 3,
        }}
      >
        <Typography
          component="span"
          sx={{ fontSize: 13, color: "#64748b" }}
        >
          Already have an account?
        </Typography>

        <Link
          component={RouterLink}
          to="/login"
          underline="none"
          sx={{
            fontSize: 13,
            fontWeight: 800,
            color: "#0f766e",
            "&:hover": {
              color: "#115e59",
              textDecoration: "underline",
            },
          }}
        >
          Sign in
        </Link>
      </Box>

      <Typography
        component="p"
        sx={{
          mt: 4,
          textAlign: "center",
          color: "#94a3b8",
          fontSize: 11,
          lineHeight: 1.7,
        }}
      >
        By creating an account, you agree to our Terms of Service and Privacy
        Policy.
      </Typography>
    </Box>
  </Box>
</Box>
  );
};

export default Register;
