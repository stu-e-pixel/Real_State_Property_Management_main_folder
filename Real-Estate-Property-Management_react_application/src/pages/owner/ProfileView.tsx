
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
  Button,
  Stack,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import {
  PhotoCamera,
  Save,
  Edit,
  Close,
  VerifiedUser,
} from "@mui/icons-material";

import type { ObjectSchema } from "yup";

import FormInput from "../../components/common/FormInput";
import Loader from "../../components/common/Loader";

/* =========================================================
   TYPES
========================================================= */

interface ProfileField<T extends object> {
  name: keyof T;
  label: string;
  type?: string;
}

interface ReadOnlyField<T extends object> {
  name: keyof T;
  label: string;
  icon?: React.ReactNode;
}

interface ProfileViewProps<T extends object> {
  /** The loaded profile object */
  profile: T | null;

  /** Loading state */
  loading: boolean;

  /** Yup schema for the update form */
  validationSchema: ObjectSchema<Record<string, unknown>>;

  /** Called when user submits the form */
  onSubmit: (data: T, imageFile: File | null) => void;

  /** Which fields are editable */
  editableFields?: ProfileField<T>[];

  /** Optional extra read-only information */
  readOnlyFields?: ReadOnlyField<T>[];

  /** Role label */
  roleLabel?: string;
}

/* =========================================================
   COMPONENT
========================================================= */

const ProfileView = <T extends object>({
  profile,
  loading,
  validationSchema,
  onSubmit,

  editableFields = [
    {
      name: "name" as keyof T,
      label: "Full Name",
    },
    {
      name: "phone" as keyof T,
      label: "Phone Number",
    },
  ],

  readOnlyFields = [],

  roleLabel,
}: ProfileViewProps<T>) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  /*
   * This state is ONLY for a newly selected image.
   *
   * We do NOT set it from useEffect.
   * The existing profile image is derived directly from profile.
   */
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);

  /* =======================================================
     REACT HOOK FORM
  ======================================================= */

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<Record<string, unknown>>({
    resolver: yupResolver(validationSchema),
    defaultValues: {},
  });

  /* =======================================================
     EXISTING PROFILE IMAGE
  ======================================================= */

  const profileImage =
    profile &&
    "image" in profile &&
    typeof profile.image === "string"
      ? profile.image
      : null;

  /*
   * If user selected a new image:
   *     show imagePreview
   *
   * Otherwise:
   *     show existing profile image
   */
  const displayedImage = imagePreview ?? profileImage;

  /* =======================================================
     PREFILL FORM WHEN PROFILE CHANGES
  ======================================================= */

  useEffect(() => {
    if (!profile) {
      return;
    }

    const defaults: Record<string, unknown> = {};

    editableFields.forEach((field) => {
      const fieldName = String(field.name);

      defaults[fieldName] =
        profile[field.name] ?? "";
    });

    reset(defaults);
  }, [profile, reset, editableFields]);

  /* =======================================================
     IMAGE CHANGE
  ======================================================= */

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImagePreview(reader.result);
      }
    };

    reader.readAsDataURL(file);

    /*
     * Allow selecting the same file again.
     */
    e.target.value = "";
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleFormSubmit = (
    data: Record<string, unknown>,
  ): void => {
    onSubmit(data as T, imageFile);

    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);
  };

  /* =======================================================
     CANCEL
  ======================================================= */

  const handleCancel = (): void => {
    setIsEditing(false);
    setImageFile(null);
    setImagePreview(null);

    if (!profile) {
      return;
    }

    const defaults: Record<string, unknown> = {};

    editableFields.forEach((field) => {
      const fieldName = String(field.name);

      defaults[fieldName] =
        profile[field.name] ?? "";
    });

    reset(defaults);
  };

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading && !profile) {
    return <Loader message="Loading profile..." />;
  }

  /* =======================================================
     NO PROFILE
  ======================================================= */

  if (!profile) {
    return (
      <Paper
        sx={{
          p: 6,
          borderRadius: 3,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "text.secondary",
          }}
        >
          No profile data available.
        </Typography>
      </Paper>
    );
  }

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        maxWidth: 1000,
        mx: "auto",
      }}
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
          }}
        >
          My Profile
        </Typography>

        {!isEditing ? (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
        ) : (
          <Stack
            direction="row"
            spacing={1}
          >
            <Button
              variant="outlined"
              startIcon={<Close />}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <LoadingButton
              variant="contained"
              startIcon={<Save />}
              loading={isSubmitting || loading}
              onClick={handleSubmit(handleFormSubmit)}
            >
              Save
            </LoadingButton>
          </Stack>
        )}
      </Box>

      <Divider
        sx={{
          mb: 4,
        }}
      />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {/* =================================================
            LEFT - AVATAR + PROFILE INFO
        ================================================= */}

        <Box
          sx={{
            width: {
              xs: "100%",
              md: "calc(33.333% - 16px)",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Avatar */}

            <Box
              sx={{
                position: "relative",
              }}
            >
              <Avatar
                src={displayedImage ?? undefined}
                sx={{
                  width: 160,
                  height: 160,
                  fontSize: 56,
                  border: "4px solid",
                  borderColor: "background.paper",
                  boxShadow: 2,
                }}
              >
                {String(
  "name" in profile ? profile.name : "?"
).charAt(0)}
              </Avatar>

              {isEditing && (
                <>
                  <input
                    accept="image/*"
                    id="profile-image-upload"
                    type="file"
                    hidden
                    onChange={handleImageChange}
                  />

                  <label htmlFor="profile-image-upload">
                    <IconButton
                      component="span"
                      size="small"
                      sx={{
                        position: "absolute",
                        bottom: 4,
                        right: 4,
                        bgcolor: "primary.main",
                        color: "white",
                        boxShadow: 2,
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      <PhotoCamera fontSize="small" />
                    </IconButton>
                  </label>
                </>
              )}
            </Box>

            {/* Name */}

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mt: 2,
              }}
            >
              {String(
  "name" in profile ? profile.name : ""
)}
            </Typography>

            {/* Email */}

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              {String(
  "email" in profile ? profile.email : ""
)}
            </Typography>

            {/* Status Chips */}

            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{
                mt: 2,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {roleLabel && (
                <Chip
                  label={roleLabel}
                  color="primary"
                  size="small"
                />
              )}

              {"status" in profile &&
                Boolean(profile.status) && (
                  <Chip
                    label={String(profile.status)}
                    color={
                      profile.status === "active"
                        ? "success"
                        : "default"
                    }
                    size="small"
                  />
                )}

              {"isEmailVerified" in profile &&
                Boolean(profile.isEmailVerified) && (
                  <Chip
                    icon={<VerifiedUser />}
                    label="Verified"
                    color="info"
                    size="small"
                  />
                )}
            </Stack>

            {/* =================================================
                READ ONLY FIELDS
            ================================================= */}

            {readOnlyFields.length > 0 && (
              <Box
                sx={{
                  mt: 4,
                  width: "100%",
                }}
              >
                <Divider
                  sx={{
                    mb: 2,
                  }}
                />

                <Stack
                  spacing={1.5}
                  sx={{
                    textAlign: "left",
                  }}
                >
                  {readOnlyFields.map((field) => (
                    <Box
                      key={String(field.name)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {field.icon}

                      <Box>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                            display: "block",
                          }}
                        >
                          {field.label}
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {String(
                            profile[field.name] ?? "—",
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Box>
        </Box>

        {/* =================================================
            RIGHT - FORM / DETAILS
        ================================================= */}

        <Box
          sx={{
            width: {
              xs: "100%",
              md: "calc(66.667% - 16px)",
            },
          }}
        >
          {isEditing ? (
            <form
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Editable Information
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                {editableFields.map((field) => (
                  <Box
                    key={String(field.name)}
                    sx={{
                      width: {
                        xs: "100%",
                        sm: "calc(50% - 8px)",
                      },
                    }}
                  >
                    <FormInput
                      name={String(field.name)}
                      control={control}
                      label={field.label}
                      type={field.type ?? "text"}
                    />
                  </Box>
                ))}
              </Box>
            </form>
          ) : (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Account Information
              </Typography>

              <Stack spacing={2.5}>
                {editableFields.map((field) => (
                  <Box key={String(field.name)}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                      }}
                    >
                      {field.label}
                    </Typography>

                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 600,
                      }}
                    >
                      {String(
                        profile[field.name] ?? "—",
                      )}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileView;