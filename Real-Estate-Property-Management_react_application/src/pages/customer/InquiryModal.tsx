import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  IconButton,
  Avatar,
} from "@mui/material";

import { Close, Send, Home } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import FormInput from "../../components/common/FormInput";
import { inquirySchema } from "../../utils/validations";
import { createInquiry } from "../../features/inquiry/inquirySlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";

import type {
  InquiryFormValues,
  CreateInquiryData,
} from "../../typescript/type/inquiry.types";

import type { Property } from "../../typescript/type/property.types";

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  property: Property;
}

const InquiryModal: React.FC<InquiryModalProps> = ({
  open,
  onClose,
  property,
}) => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.inquiry);

  const user = useAppSelector((state) => state.auth.user);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<InquiryFormValues>({
    resolver: yupResolver(inquirySchema),

    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      message: "",
    },
  });

  // =====================================================
  // PREFILL FORM FROM LOGGED-IN USER
  // =====================================================

  useEffect(() => {
    if (open) {
      reset({
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        message: "",
      });
    }
  }, [open, user, reset]);

  // =====================================================
  // SUBMIT INQUIRY
  // =====================================================

  const onSubmit = async (
    data: InquiryFormValues
  ): Promise<void> => {
    const payload: CreateInquiryData = {
      propertyId: property._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    };

    const result = await dispatch(createInquiry(payload));

    if (createInquiry.fulfilled.match(result)) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      {/* =====================================================
          DIALOG TITLE
      ===================================================== */}

      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          component="span"
          sx={{
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          Send Inquiry
        </Typography>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="close"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* =====================================================
          DIALOG CONTENT
      ===================================================== */}

      <DialogContent>
        {/* =====================================================
            PROPERTY SNAPSHOT
        ===================================================== */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            bgcolor: "#f9fafb",
            borderRadius: 2,
            mb: 3,
          }}
        >
          {/* Property Image */}
          <Avatar
            src={property.images?.[0]?.image}
            variant="rounded"
            sx={{
              width: 64,
              height: 64,
              flexShrink: 0,
            }}
          >
            <Home />
          </Avatar>

          {/* Property Information */}
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {property.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: "text.secondary",
              }}
            >
              {property.propertyType} • {property.purpose}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "success.main",
                fontWeight: 700,
                mt: 0.5,
              }}
            >
              ₹{property.price.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {/* =====================================================
            INQUIRY FORM
        ===================================================== */}

        <Box
          component="form"
          id="inquiry-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Name + Email */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Name */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<InquiryFormValues>
                name="name"
                control={control}
                label="Your Name"
              />
            </Box>

            {/* Email */}
            <Box
              sx={{
                width: {
                  xs: "100%",
                  sm: "calc(50% - 8px)",
                },
              }}
            >
              <FormInput<InquiryFormValues>
                name="email"
                control={control}
                label="Email"
                type="email"
              />
            </Box>
          </Box>

          {/* Phone */}
          <Box>
            <FormInput<InquiryFormValues>
              name="phone"
              control={control}
              label="Phone"
            />
          </Box>

          {/* Message */}
          <Box>
            <FormInput<InquiryFormValues>
              name="message"
              control={control}
              label="Message"
              multiline
              rows={4}
              placeholder="I'm interested in this property. Please contact me..."
            />
          </Box>
        </Box>
      </DialogContent>

      {/* =====================================================
          DIALOG ACTIONS
      ===================================================== */}

      <DialogActions
        sx={{
          p: 2,
        }}
      >
        <Button
          onClick={onClose}
          disabled={loading || isSubmitting}
        >
          Cancel
        </Button>

        <LoadingButton
          variant="contained"
          startIcon={<Send />}
          loading={loading || isSubmitting}
          onClick={handleSubmit(onSubmit)}
        >
          Send Inquiry
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default InquiryModal;