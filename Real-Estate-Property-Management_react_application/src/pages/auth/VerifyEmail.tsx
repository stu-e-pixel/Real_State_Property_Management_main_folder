import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { useNavigate, useLocation } from "react-router-dom";

import { Box, Paper, Typography, Button, Divider } from "@mui/material";

import { LoadingButton } from "@mui/lab";

import { MarkEmailReadOutlined, Refresh, VerifiedUser } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";

import { verifyEmailSchema } from "../../utils/validations";

import {
  verifyEmail,
  resendOTP,
  clearError,
} from "../../features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { VerifyEmailFormValues } from "../../typescript/type/auth.types";

interface LocationState {
  email?: string;
}

const VerifyEmail: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading } = useAppSelector((state) => state.auth);

  const email = (location.state as LocationState | null)?.email || "";

  // React Hook Form
  const { control, handleSubmit, setValue } = useForm<VerifyEmailFormValues>({
    resolver: yupResolver(verifyEmailSchema),

    defaultValues: {
      email,
      otp: "",
    },
  });

  // Set email from navigation state
  useEffect(() => {
    if (email) {
      setValue("email", email);
    }
  }, [email, setValue]);

  // Clear auth error when leaving page
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Verify email
  const onSubmit = async (data: VerifyEmailFormValues): Promise<void> => {
    const result = await dispatch(verifyEmail(data));

    if (verifyEmail.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  // Resend OTP
  const handleResendOTP = (): void => {
    dispatch(
      resendOTP({
        email,
      }),
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
        boxSizing: "border-box",
        background:
          "radial-gradient(circle at top left, #e0eaff 0%, transparent 35%), radial-gradient(circle at bottom right, #e8e7ff 0%, transparent 35%), #f7f9fc",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          p: {
            xs: 3,
            sm: 4.5,
          },
          boxSizing: "border-box",
          borderRadius: 4,
          backgroundColor: "#ffffff",
          border: "1px solid #e8edf5",
          boxShadow: "0 20px 60px rgba(31, 55, 90, 0.10)",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 76,
              height: 76,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "24px",
              background:
                "linear-gradient(135deg, #e5efff 0%, #edf0ff 100%)",
              mb: 2.5,
            }}
          >
            <MarkEmailReadOutlined
              sx={{
                fontSize: 42,
                color: "#356df3",
              }}
            />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontSize: {
                xs: 25,
                sm: 30,
              },
              fontWeight: 800,
              letterSpacing: "-0.8px",
              color: "#172b4d",
              mb: 1,
            }}
          >
            Verify Your Email
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#74829a",
              lineHeight: 1.8,
              maxWidth: 310,
            }}
          >
            Enter the 6-digit verification code sent to your email address.
          </Typography>
        </Box>

        {/* Form */}
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {/* Email */}
          <Box sx={{ mb: 2.5 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#344563",
                mb: 1,
              }}
            >
              Email Address
            </Typography>

            <FormInput<VerifyEmailFormValues>
              name="email"
              control={control}
              label="Email"
              type="email"
              disabled={!!email}
            />
          </Box>

          {/* OTP */}
          <Box sx={{ mb: 3 }}>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: "#344563",
                mb: 1,
              }}
            >
              Verification Code
            </Typography>

            <FormInput<VerifyEmailFormValues>
              name="otp"
              control={control}
              label="Enter 6-digit OTP"
              slotProps={{
                htmlInput: {
                  maxLength: 6,
                  inputMode: "numeric",
                },
              }}
            />

            <Typography
              variant="caption"
              sx={{
                display: "block",
                mt: 1,
                color: "#8a96aa",
              }}
            >
              Please enter the 6-digit code to continue.
            </Typography>
          </Box>

          {/* Verify Button */}
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            startIcon={<VerifiedUser />}
            sx={{
              py: 1.6,
              borderRadius: 2.5,
              textTransform: "none",
              fontSize: 16,
              fontWeight: 700,
              background:
                "linear-gradient(135deg, #3478f6 0%, #5145e5 100%)",
              boxShadow: "0 8px 20px rgba(59, 102, 240, 0.22)",
              transition: "all 0.25s ease",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #2563eb 0%, #4338ca 100%)",
                boxShadow: "0 10px 25px rgba(59, 102, 240, 0.3)",
                transform: "translateY(-1px)",
              },
            }}
          >
            Verify Email
          </LoadingButton>
        </Box>

        {/* Divider */}
        <Divider
          sx={{
            my: 3,
            color: "#9aa6b8",
            fontSize: 12,
            "&::before, &::after": {
              borderColor: "#e8edf5",
            },
          }}
        >
          OR
        </Divider>

        {/* Resend OTP */}
        <Box
          sx={{
            textAlign: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#74829a",
              mb: 1.5,
            }}
          >
            Didn't receive the verification code?
          </Typography>

          <Button
            variant="text"
            onClick={handleResendOTP}
            startIcon={<Refresh />}
            sx={{
              px: 2.5,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              color: "#356df3",
              backgroundColor: "#f0f5ff",
              "&:hover": {
                backgroundColor: "#e3ecff",
              },
            }}
          >
            Resend OTP
          </Button>
        </Box>

        {/* Footer */}
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "center",
            mt: 4,
            color: "#9aa6b8",
          }}
        >
          <VerifiedUser
            sx={{
              fontSize: 14,
              verticalAlign: "middle",
              mr: 0.5,
            }}
          />
          Your account security matters to us.
        </Typography>
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
