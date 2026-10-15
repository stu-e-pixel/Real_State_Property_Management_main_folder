import React, { useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  Link,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { PhotoCamera, Home } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";
import { ownerRegisterSchema } from "../../utils/validations";
import { createOwner } from "../../features/owner/ownerSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  OwnerRegisterFormValues,
  OwnerRegisterData,
} from "../../typescript/type/owner.types";

const OwnerRegister: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.owner);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const { control, handleSubmit } = useForm<OwnerRegisterFormValues>({
    resolver: yupResolver(ownerRegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",

      address: {
        street: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
      },
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

  const onSubmit = async (data: OwnerRegisterFormValues): Promise<void> => {
    const { ...rest } = data;

    const ownerData: OwnerRegisterData = {
      ...rest,
      ...(imageFile && { image: [imageFile] }),
    };

    const result = await dispatch(createOwner(ownerData));

    if (createOwner.fulfilled.match(result)) {
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
    background:
      "linear-gradient(135deg, #ecfdf5 0%, #f8fafc 50%, #e0f2fe 100%)",
    p: { xs: 1.5, sm: 3 },
  }}
>
  <Paper
    elevation={0}
    sx={{
      width: "100%",
      maxWidth: 850,
      overflow: "hidden",
      borderRadius: { xs: 3, sm: 4 },
      border: "1px solid #dbe7e4",
      boxShadow: "0 24px 70px rgba(15, 23, 42, 0.12)",
      bgcolor: "#ffffff",
    }}
  >
 
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(120deg, #0f172a 0%, #134e4a 65%, #0f766e 100%)",
        color: "#ffffff",
        px: { xs: 3, sm: 5 },
        py: { xs: 4, sm: 5 },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: 200,
          height: 200,
          borderRadius: "50%",
          bgcolor: "rgba(255,255,255,0.05)",
          right: -50,
          top: -100,
        }}
      />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ maxWidth: 560 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 0.7,
              mb: 2,
              borderRadius: 10,
              border: "1px solid rgba(167,243,208,0.3)",
              bgcolor: "rgba(16,185,129,0.12)",
              color: "#a7f3d0",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                bgcolor: "#34d399",
              }}
            />
            Property Owner Portal
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.8px",
              fontSize: { xs: "1.8rem", sm: "2.4rem" },
              lineHeight: 1.2,
            }}
          >
            Owner Registration
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#cbd5e1",
              mt: 1.5,
              lineHeight: 1.8,
            }}
          >
            Create your owner account and take the first step
            toward managing and listing your properties.
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: "none", sm: "flex" },
            width: 76,
            height: 76,
            flexShrink: 0,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.2)",
            bgcolor: "rgba(255,255,255,0.08)",
            color: "#a7f3d0",
          }}
        >
          <Home sx={{ fontSize: 40 }} />
        </Box>
      </Box>
    </Box>

    
    <Box sx={{ p: { xs: 2.5, sm: 5 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            width: 4,
            height: 44,
            borderRadius: 2,
            bgcolor: "#0f766e",
          }}
        />

        <Box>
          <Typography
            variant="h6"
            sx={{ color: "#0f172a", fontWeight: 800 }}
          >
            Create Your Owner Profile
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "#64748b", mt: 0.5 }}
          >
            Fill in your details to get started.
          </Typography>
        </Box>
      </Box>

      <form onSubmit={handleSubmit(onSubmit)}>
        
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            p: 2,
            mb: 4,
            borderRadius: 3,
            border: "1px dashed #a7d9cd",
            bgcolor: "#f0fdf9",
          }}
        >
          <Box sx={{ position: "relative", flexShrink: 0 }}>
            <Avatar
              src={imagePreview ?? undefined}
              sx={{
                width: 84,
                height: 84,
                bgcolor: "#ccfbf1",
                color: "#0f766e",
                border: "3px solid #ffffff",
                boxShadow: "0 0 0 1px #99f6e4",
              }}
            />

            <Box
              component="label"
              htmlFor="owner-image-upload"
              sx={{
                position: "absolute",
                right: -3,
                bottom: -3,
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                bgcolor: "#0f766e",
                color: "#ffffff",
                border: "2px solid #ffffff",
                cursor: "pointer",
                transition: "0.2s",
                "&:hover": { bgcolor: "#115e59" },
              }}
            >
              <PhotoCamera sx={{ fontSize: 17 }} />
            </Box>

            <Box
              component="input"
              id="owner-image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              sx={{ display: "none" }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                color: "#0f172a",
                fontWeight: 700,
                mb: 0.5,
              }}
            >
              Profile Photograph
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "#64748b", lineHeight: 1.6 }}
            >
              Upload a clear photograph for your owner profile.
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "#0f766e", fontWeight: 600 }}
            >
              Use a supported image format
            </Typography>
          </Box>
        </Box>

      
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#0f172a", fontWeight: 800, mb: 2 }}
          >
            Personal Information
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#ffffff",
                "& fieldset": { borderColor: "#dbe4e8" },
                "&:hover fieldset": { borderColor: "#5eead4" },
                "&.Mui-focused fieldset": {
                  borderColor: "#0f766e",
                  borderWidth: 1.5,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0f766e",
              },
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="name"
                control={control}
                label="Full Name"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="email"
                control={control}
                label="Email Address"
                type="email"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="phone"
                control={control}
                label="Phone Number"
              />
            </Box>
          </Box>
        </Box>

       
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#0f172a", fontWeight: 800, mb: 2 }}
          >
            Property Owner Address
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#ffffff",
                "& fieldset": { borderColor: "#dbe4e8" },
                "&:hover fieldset": { borderColor: "#5eead4" },
                "&.Mui-focused fieldset": {
                  borderColor: "#0f766e",
                  borderWidth: 1.5,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0f766e",
              },
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="address.street"
                control={control}
                label="Street"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="address.city"
                control={control}
                label="City"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="address.state"
                control={control}
                label="State"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="address.country"
                control={control}
                label="Country"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="address.pincode"
                control={control}
                label="Pincode"
              />
            </Box>
          </Box>
        </Box>

       
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="subtitle1"
            sx={{ color: "#0f172a", fontWeight: 800, mb: 2 }}
          >
            Account Security
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "#ffffff",
                "& fieldset": { borderColor: "#dbe4e8" },
                "&:hover fieldset": { borderColor: "#5eead4" },
                "&.Mui-focused fieldset": {
                  borderColor: "#0f766e",
                  borderWidth: 1.5,
                },
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#0f766e",
              },
            }}
          >
            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="password"
                control={control}
                label="Password"
                type="password"
              />
            </Box>

            <Box sx={{ width: { xs: "100%", sm: "calc(50% - 8px)" } }}>
              <FormInput<OwnerRegisterFormValues>
                name="confirmPassword"
                control={control}
                label="Confirm Password"
                type="password"
              />
            </Box>
          </Box>
        </Box>

      
        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          loading={loading}
          startIcon={<Home />}
          sx={{
            py: 1.6,
            mt: 1,
            mb: 2.5,
            borderRadius: 2.5,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 800,
            letterSpacing: 0.2,
            bgcolor: "#0f766e",
            boxShadow: "0 8px 20px rgba(15, 118, 110, 0.2)",
            transition: "all 0.25s ease",
            "&:hover": {
              bgcolor: "#115e59",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 25px rgba(15, 118, 110, 0.28)",
            },
          }}
        >
          Register as Owner
        </LoadingButton>
      </form>

   
      <Box
        sx={{
          textAlign: "center",
          pt: 2.5,
          borderTop: "1px solid #e2e8f0",
        }}
      >
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Already have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            underline="none"
            sx={{
              fontWeight: 800,
              color: "#0f766e",
              "&:hover": {
                color: "#134e4a",
                textDecoration: "underline",
              },
            }}
          >
            Sign in
          </Link>
        </Typography>
      </Box>
    </Box>
  </Paper>
</Box>
  );
};

export default OwnerRegister;
