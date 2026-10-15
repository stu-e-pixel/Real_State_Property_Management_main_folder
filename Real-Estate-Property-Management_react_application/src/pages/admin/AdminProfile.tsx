import React, { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Chip,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";
import { PhotoCamera, Save } from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";
import Loader from "../../components/common/Loader";

import { updateProfileSchema } from "../../utils/validations";
import { getProfile, updateProfile } from "../../features/auth/authSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  UpdateProfileFormValues,
  UpdateProfileData,
} from "../../typescript/type/auth.types";

const AdminProfile: React.FC = () => {
  const dispatch = useAppDispatch();

  const { profile, user, loading } = useAppSelector((state) => state.auth);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const { control, handleSubmit, reset } = useForm<UpdateProfileFormValues>({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;

    reset({
      name: profile.name || "",
      phone: profile.phone || "",
    });
  }, [profile, reset]);

  const imagePreview = imageFile
    ? URL.createObjectURL(imageFile)
    : profile?.image || undefined;

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
    }
  };

  const onSubmit = (data: UpdateProfileFormValues): void => {
    const payload: UpdateProfileData = {
      ...data,
    };

    if (imageFile) {
      payload.image = [imageFile];
    }

    dispatch(updateProfile(payload));
  };

  if (loading && !profile) {
    return (
      <MainLayout>
        <Loader message="Loading profile..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          My Profile
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              md: "row",
            },
            gap: 4,
          }}
        >
          <Box
            sx={{
              width: {
                xs: "100%",
                md: "33.33%",
              },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={imagePreview}
              sx={{
                width: 150,
                height: 150,
                mb: 2,
                fontSize: 48,
              }}
            >
              {profile?.name?.charAt(0)}
            </Avatar>

            <input
              accept="image/*"
              style={{ display: "none" }}
              id="profile-image-upload"
              type="file"
              onChange={handleImageChange}
            />

            <label htmlFor="profile-image-upload">
              <IconButton color="primary" component="span">
                <PhotoCamera />
              </IconButton>
            </label>

            <Typography
              variant="h6"
              sx={{
                mt: 2,
              }}
            >
              {profile?.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              {profile?.email}
            </Typography>

            <Box
              sx={{
                mt: 2,
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Chip
                label={profile?.role || user?.role}
                color="primary"
                size="small"
              />

              <Chip
                label={profile?.status}
                color={profile?.status === "active" ? "success" : "default"}
                size="small"
              />

              {profile?.isEmailVerified && (
                <Chip label="Verified" color="info" size="small" />
              )}
            </Box>
          </Box>

          <Box
            sx={{
              width: {
                xs: "100%",
                md: "66.67%",
              },
            }}
          >
            <Divider
              sx={{
                mb: 3,
              }}
            />

            <form onSubmit={handleSubmit(onSubmit)}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "50%",
                    },
                  }}
                >
                  <FormInput<UpdateProfileFormValues>
                    name="name"
                    control={control}
                    label="Full Name"
                  />
                </Box>

                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "50%",
                    },
                  }}
                >
                  <FormInput<UpdateProfileFormValues>
                    name="phone"
                    control={control}
                    label="Phone"
                  />
                </Box>
              </Box>

              <LoadingButton
                type="submit"
                variant="contained"
                loading={loading}
                startIcon={<Save />}
                sx={{
                  mt: 2,
                }}
              >
                Save Changes
              </LoadingButton>
            </form>
          </Box>
        </Box>
      </Paper>
    </MainLayout>
  );
};

export default AdminProfile;
