import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import { Paper, Typography, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Lock } from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";

import { changePasswordSchema } from "../../utils/validations";
import { changePassword } from "../../features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { ChangePasswordFormValues } from "../../typescript/type/auth.types";

const AdminChangePassword: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector((state) => state.auth);

  const { control, handleSubmit, reset } = useForm<ChangePasswordFormValues>({
    resolver: yupResolver(changePasswordSchema),

    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormValues): Promise<void> => {
    const { ...rest } = data;

    const result = await dispatch(changePassword(rest));

    if (changePassword.fulfilled.match(result)) {
      reset();

      setTimeout(() => {
        sessionStorage.clear();
        navigate("/login");
      }, 1500);
    }
  };

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          maxWidth: 600,
          mx: "auto",
          borderRadius: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <Lock
            color="primary"
            sx={{
              fontSize: 32,
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            Change Password
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput<ChangePasswordFormValues>
            name="currentPassword"
            control={control}
            label="Current Password"
            type="password"
          />

          <FormInput<ChangePasswordFormValues>
            name="newPassword"
            control={control}
            label="New Password"
            type="password"
          />

          <FormInput<ChangePasswordFormValues>
            name="confirmPassword"
            control={control}
            label="Confirm New Password"
            type="password"
          />

          
          <LoadingButton
            type="submit"
            variant="contained"
            loading={loading}
            sx={{
              mt: 2,
            }}
          >
            Update Password
          </LoadingButton>
        </form>
      </Paper>
    </MainLayout>
  );
};

export default AdminChangePassword;
