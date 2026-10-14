
import React from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  useNavigate,
  useParams,
  Link as RouterLink,
} from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Link,
  Divider,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { Lock } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";

import {
  resetPasswordSchema,
} from "../../utils/validations";

import {
  resetPassword,
} from "../../features/auth/authSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";

import type {
  ResetPasswordFormValues,
} from "../../typescript/type/auth.types";

const ResetPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { id, token } = useParams<{
    id: string;
    token: string;
  }>();

  const { loading } = useAppSelector(
    (state) => state.auth
  );

  // React Hook Form
  const {
    control,
    handleSubmit,
  } = useForm<ResetPasswordFormValues>({
    resolver: yupResolver(resetPasswordSchema),

    defaultValues: {
      password: "",
      confirm_password: "",
    },
  });

  // Submit
  const onSubmit = async (
    data: ResetPasswordFormValues
  ): Promise<void> => {
    if (!id || !token) {
      return;
    }

    const result = await dispatch(
      resetPassword({
        id,
        token,
        data,
      })
    );

    if (resetPassword.fulfilled.match(result)) {
      navigate("/login");
    }
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
        <Lock
          sx={{
            fontSize: 40,
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
        Reset Password
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#74829a",
          lineHeight: 1.8,
          maxWidth: 310,
        }}
      >
        Create a strong new password to keep your account secure.
      </Typography>
    </Box>

    {/* Reset Password Form */}
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* New Password */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: "#344563",
            mb: 1,
          }}
        >
          New Password
        </Typography>

        <FormInput<ResetPasswordFormValues>
          name="password"
          control={control}
          label="Enter new password"
          type="password"
        />
      </Box>

      {/* Confirm Password */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 700,
            color: "#344563",
            mb: 1,
          }}
        >
          Confirm New Password
        </Typography>

        <FormInput<ResetPasswordFormValues>
          name="confirm_password"
          control={control}
          label="Re-enter new password"
          type="password"
        />

        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 1,
            color: "#8a96aa",
          }}
        >
          Make sure both passwords match.
        </Typography>
      </Box>

      {/* Reset Button */}
      <LoadingButton
        type="submit"
        fullWidth
        variant="contained"
        size="large"
        loading={loading}
        startIcon={<Lock />}
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
        Reset Password
      </LoadingButton>
    </Box>

    {/* Divider */}
    <Divider
      sx={{
        my: 3,
        borderColor: "#e8edf5",
      }}
    />

    {/* Back to Login */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 0.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "#74829a",
        }}
      >
        Remember your password?
      </Typography>

      <Link
        component={RouterLink}
        to="/login"
        underline="none"
        sx={{
          fontSize: 14,
          fontWeight: 700,
          color: "#356df3",
          "&:hover": {
            color: "#244fcb",
            textDecoration: "underline",
          },
        }}
      >
        Back to Login
      </Link>
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
      <Lock
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

export default ResetPassword;