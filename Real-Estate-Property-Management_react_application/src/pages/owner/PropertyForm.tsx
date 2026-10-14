/* eslint-disable react-hooks/set-state-in-effect */

import React, { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Avatar,
  Chip,
  InputAdornment,
  Divider,
} from "@mui/material";

import { LoadingButton } from "@mui/lab";

import {
  PhotoCamera,
  Save,
  ArrowBack,
  Add,
  Close,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";

import { propertySchema } from "../../utils/validations";

import {
  createProperty,
  updateProperty,
} from "../../features/property/propertySlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";

import type {
  PropertyFormValues,
  CreatePropertyData,
  UpdatePropertyData,
  Property,
} from "../../typescript/type/property.types";

interface PropertyFormProps {
  mode?: "create" | "update";
  initialData?: Property;
}

const PROPERTY_TYPES = [
  "Apartment",
  "House",
  "Villa",
  "Land",
  "Office",
  "Shop",
  "Warehouse",
].map((value) => ({
  value,
  label: value,
}));

const PURPOSES = [
  {
    value: "Sale",
    label: "Sale",
  },
  {
    value: "Rent",
    label: "Rent",
  },
];

const FURNISHING = [
  {
    value: "Furnished",
    label: "Furnished",
  },
  {
    value: "Semi-Furnished",
    label: "Semi-Furnished",
  },
  {
    value: "Unfurnished",
    label: "Unfurnished",
  },
];

const STATUSES = [
  "Available",
  "Sold",
  "Rented",
  "Unavailable",
].map((value) => ({
  value,
  label: value,
}));

const PropertyForm: React.FC<PropertyFormProps> = ({
  mode = "create",
  initialData,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading } = useAppSelector(
    (state) => state.property
  );

  // =====================================================
  // Local state
  // =====================================================

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

  const [removedExistingImages, setRemovedExistingImages] =
    useState<string[]>([]);

  const [amenities, setAmenities] = useState<string[]>([]);
  const [amenityInput, setAmenityInput] = useState<string>("");

  // =====================================================
  // Existing images
  // =====================================================

  const existingImages = useMemo(() => {
    return initialData?.images ?? [];
  }, [initialData]);

  // =====================================================
  // All image previews
  // =====================================================

  const imagePreviews = useMemo(() => {
    const existingPreviewImages = existingImages
      .filter(
        (img) => !removedExistingImages.includes(img.public_id)
      )
      .map((img) => img.image);

    return [...existingPreviewImages, ...newImagePreviews];
  }, [
    existingImages,
    removedExistingImages,
    newImagePreviews,
  ]);

  // =====================================================
  // React Hook Form
  // =====================================================

  const { control, handleSubmit, reset } =
    useForm<PropertyFormValues>({
      resolver: yupResolver(propertySchema),

      defaultValues: {
        title: "",
        description: "",
        propertyType: "Apartment",
        purpose: "Sale",
        price: 0,
        area: 0,
        bedrooms: 0,
        bathrooms: 0,
        furnishingStatus: "Unfurnished",
        amenities: "",
        status: "Available",
        agentId: "",
        longitude: 0,
        latitude: 0,
      },
    });

  // =====================================================
  // Prefill form when editing
  // =====================================================

  useEffect(() => {
    if (!initialData) {
      return;
    }

    reset({
      title: initialData.title,
      description: initialData.description,

      propertyType: initialData.propertyType,
      purpose: initialData.purpose,

      price: initialData.price,
      area: initialData.area,

      bedrooms: initialData.bedrooms,
      bathrooms: initialData.bathrooms,

      furnishingStatus: initialData.furnishingStatus,

      amenities: initialData.amenities.join(", "),

      status: initialData.status,

      agentId:
        typeof initialData.agentId === "string"
          ? initialData.agentId
          : initialData.agentId?._id ?? "",

      longitude:
        initialData.location?.coordinates?.[0] ?? 0,

      latitude:
        initialData.location?.coordinates?.[1] ?? 0,
    });

    setAmenities(initialData.amenities);
  }, [initialData, reset]);

  // =====================================================
  // Image change
  // =====================================================

  const handleImageChange = (
    e: ChangeEvent<HTMLInputElement>
  ): void => {
    const files = e.target.files;

    if (!files) {
      return;
    }

    const selectedFiles = Array.from(files);

    const currentImageCount =
      imagePreviews.length;

    const remainingSlots = 5 - currentImageCount;

    if (remainingSlots <= 0) {
      return;
    }

    const newFiles = selectedFiles.slice(
      0,
      remainingSlots
    );

    setImageFiles((prev) => [
      ...prev,
      ...newFiles,
    ]);

    newFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setNewImagePreviews((prev) => [
            ...prev,
            reader.result as string,
          ]);
        }
      };

      reader.readAsDataURL(file);
    });

    // Allow selecting the same file again
    e.target.value = "";
  };

  // =====================================================
  // Remove image
  // =====================================================

  const removeImage = (index: number): void => {
    const currentExistingImages = existingImages.filter(
      (img) =>
        !removedExistingImages.includes(img.public_id)
    );

    if (index < currentExistingImages.length) {
      const imageToRemove =
        currentExistingImages[index];

      setRemovedExistingImages((prev) => [
        ...prev,
        imageToRemove.public_id,
      ]);

      return;
    }

    const newImageIndex =
      index - currentExistingImages.length;

    setImageFiles((prev) =>
      prev.filter((_, i) => i !== newImageIndex)
    );

    setNewImagePreviews((prev) =>
      prev.filter((_, i) => i !== newImageIndex)
    );
  };

  // =====================================================
  // Add amenity
  // =====================================================

  const addAmenity = (): void => {
    const value = amenityInput.trim();

    if (!value) {
      return;
    }

    if (amenities.includes(value)) {
      setAmenityInput("");
      return;
    }

    setAmenities((prev) => [
      ...prev,
      value,
    ]);

    setAmenityInput("");
  };

  // =====================================================
  // Remove amenity
  // =====================================================

  const removeAmenity = (
    value: string
  ): void => {
    setAmenities((prev) =>
      prev.filter((amenity) => amenity !== value)
    );
  };

  // =====================================================
  // Submit
  // =====================================================

  const onSubmit = async (
    data: PropertyFormValues
  ): Promise<void> => {
    const payload: CreatePropertyData = {
      title: data.title,
      description: data.description,

      propertyType: data.propertyType,
      purpose: data.purpose,

      price: data.price,
      area: data.area,

      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,

      furnishingStatus: data.furnishingStatus,

      status: data.status,

      amenities,

      location: {
        type: "Point",
        coordinates: [
          data.longitude,
          data.latitude,
        ],
      },

      ...(data.agentId && {
        agentId: data.agentId,
      }),

      ...(imageFiles.length > 0 && {
        images: imageFiles,
      }),
    };

    // ===================================================
    // Create
    // ===================================================

    if (mode === "create") {
      const result = await dispatch(
        createProperty(payload)
      );

      if (
        createProperty.fulfilled.match(result)
      ) {
        navigate("/owner/properties");
      }

      return;
    }

    // ===================================================
    // Update
    // ===================================================

    if (mode === "update" && initialData) {
      const updatePayload: UpdatePropertyData = {
        ...payload,

        // Send removed existing images if your backend
        // supports removing individual images.
        ...(removedExistingImages.length > 0 && {
          removedImages: removedExistingImages,
        }),
      };

      const result = await dispatch(
        updateProperty({
          id: initialData._id,
          data: updatePayload,
        })
      );

      if (
        updateProperty.fulfilled.match(result)
      ) {
        navigate("/owner/properties");
      }
    }
  };

  // =====================================================
  // JSX
  // =====================================================

  return (
    <MainLayout>
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
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <IconButton
            onClick={() => navigate(-1)}
          >
            <ArrowBack />
          </IconButton>

          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              {mode === "create"
                ? "Create Property"
                : "Edit Property"}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              {mode === "create"
                ? "Add a new property to your portfolio"
                : "Update the property details below"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mb: 2,
            }}
          >
            Basic Information
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: "100%",
              }}
            >
              <FormInput<PropertyFormValues>
                name="title"
                control={control}
                label="Property Title"
              />
            </Box>

            <Box
              sx={{
                width: "100%",
              }}
            >
              <FormInput<PropertyFormValues>
                name="description"
                control={control}
                label="Description"
                multiline
                rows={4}
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="propertyType"
                control={control}
                label="Property Type"
                select
                options={PROPERTY_TYPES}
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="purpose"
                control={control}
                label="Purpose"
                select
                options={PURPOSES}
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="price"
                control={control}
                label="Price"
                type="number"
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="area"
                control={control}
                label="Area (sqft)"
                type="number"
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="bedrooms"
                control={control}
                label="Bedrooms"
                type="number"
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="bathrooms"
                control={control}
                label="Bathrooms"
                type="number"
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="furnishingStatus"
                control={control}
                label="Furnishing Status"
                select
                options={FURNISHING}
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="status"
                control={control}
                label="Status"
                select
                options={STATUSES}
              />
            </Box>

            <Box
              sx={{
                width: "100%",
              }}
            >
              <FormInput<PropertyFormValues>
                name="agentId"
                control={control}
                label="Agent ID (optional)"
              />
            </Box>
          </Box>

          {/* =================================================
              LOCATION
          ================================================= */}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: 4,
              mb: 2,
            }}
          >
            Location
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="longitude"
                control={control}
                label="Longitude"
                type="number"
              />
            </Box>

            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<PropertyFormValues>
                name="latitude"
                control={control}
                label="Latitude"
                type="number"
              />
            </Box>
          </Box>

          {/* =================================================
              AMENITIES
          ================================================= */}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: 4,
              mb: 2,
            }}
          >
            Amenities
          </Typography>

          <Box
            sx={{
              mb: 2,
            }}
          >
            <FormInput<PropertyFormValues>
              name="amenities"
              control={control}
              label="Type an amenity and click +"
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={addAmenity}
                        edge="end"
                      >
                        <Add />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              mb: 3,
            }}
          >
            {amenities.length === 0 && (
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                }}
              >
                No amenities added yet.
              </Typography>
            )}

            {amenities.map((amenity) => (
              <Chip
                key={amenity}
                label={amenity}
                onDelete={() =>
                  removeAmenity(amenity)
                }
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>

          {/* =================================================
              IMAGES
          ================================================= */}

          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 700,
              mt: 2,
              mb: 2,
            }}
          >
            Images ({imagePreviews.length}/5)
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
              mb: 2,
            }}
          >
            {imagePreviews.map(
              (src, index) => (
                <Box
                  key={`${src}-${index}`}
                  sx={{
                    position: "relative",
                  }}
                >
                  <Avatar
                    src={src}
                    variant="rounded"
                    sx={{
                      width: 110,
                      height: 110,
                    }}
                  />

                  <IconButton
                    size="small"
                    onClick={() =>
                      removeImage(index)
                    }
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "error.main",
                      color: "white",
                      "&:hover": {
                        bgcolor: "error.dark",
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Box>
              )
            )}

            {imagePreviews.length < 5 && (
              <>
                <input
                  accept="image/*"
                  id="property-images-upload"
                  type="file"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />

                <label htmlFor="property-images-upload">
                  <Box
                    sx={{
                      width: 110,
                      height: 110,
                      border: "2px dashed",
                      borderColor: "grey.400",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition:
                        "border-color 0.2s",
                      "&:hover": {
                        borderColor:
                          "primary.main",
                      },
                    }}
                  >
                    <PhotoCamera color="action" />
                  </Box>
                </label>
              </>
            )}
          </Box>

          <Typography
            variant="caption"
            sx={{
              color: "text.secondary",
              display: "block",
              mb: 2,
            }}
          >
            Uploading new images on update
            replaces all existing ones.
          </Typography>

          {/* =================================================
              ACTIONS
          ================================================= */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>

            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              startIcon={<Save />}
            >
              {mode === "create"
                ? "Create Property"
                : "Save Changes"}
            </LoadingButton>
          </Box>
        </form>
      </Paper>
    </MainLayout>
  );
};

export default PropertyForm;
