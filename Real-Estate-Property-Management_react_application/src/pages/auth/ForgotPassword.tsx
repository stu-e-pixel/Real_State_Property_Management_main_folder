import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { Box, Paper, Typography, Link } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Email } from "@mui/icons-material";

import FormInput from "../../components/common/FormInput";
import { forgotPasswordSchema } from "../../utils/validations";
import { forgotPassword } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type { ForgotPasswordFormValues } from "../../typescript/type/auth.types";

const ForgotPassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.auth);

  const { control, handleSubmit } = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues): Promise<void> => {
    const result = await dispatch(forgotPassword(data));

    if (forgotPassword.fulfilled.match(result)) {
      navigate("/login");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 450,
          width: "100%",
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >
          <Email
            sx={{
              fontSize: 60,
              color: "primary.main",
              mb: 1,
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            Forgot Password?
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Enter your email to receive a reset link
          </Typography>
        </Box>

       
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput<ForgotPasswordFormValues>
            name="email"
            control={control}
            label="Email Address"
            type="email"
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            loading={loading}
            sx={{
              py: 1.5,
              mb: 2,
            }}
          >
            Send Reset Link
          </LoadingButton>
        </form>

       
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
          }}
        >
          Remember your password?{" "}
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              fontWeight: 600,
            }}
          >
            Back to Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
