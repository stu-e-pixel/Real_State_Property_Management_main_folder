import React from "react";
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
  Alert,
} from "@mui/material";
import { Close, Send, Home } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import FormInput from "../../components/common/FormInput";
import { rentalApplicationSchema } from "../../utils/validations";
import { createRentalApplication } from "../../features/rental/rentalSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type {
  RentalApplicationFormValues,
  CreateRentalApplicationData,
} from "../../typescript/type/rental.types";
import type { Property } from "../../typescript/type/property.types";

interface RentalApplicationModalProps {
  open: boolean;
  onClose: () => void;
  property: Property | null | undefined;
}

const RentalApplicationModal: React.FC<RentalApplicationModalProps> = ({
  open,
  onClose,
  property,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.rental);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RentalApplicationFormValues>({
    resolver: yupResolver(rentalApplicationSchema),
    defaultValues: {
      monthlyIncome: 0,
      employmentStatus: "",
      occupation: "",
      message: "",
    },
    mode: "onChange",     
  });

  

  const onSubmit = async (
    data: RentalApplicationFormValues
  ): Promise<void> => {
    console.log("🟢 onSubmit data:", data);
    if (!property?._id) return;

    const payload: CreateRentalApplicationData = {
      property: property._id,
      monthlyIncome: Number(data.monthlyIncome) || 0,
      employmentStatus: data.employmentStatus ?? "",
      occupation: data.occupation ?? "",
      message: data.message ?? "",
    };

    console.log("🟢 payload:", payload);

    const result = await dispatch(createRentalApplication(payload));
    if (createRentalApplication.fulfilled.match(result)) {
      reset();
      onClose();
    }
  };

  if (!property) return null;

  const firstImage = property.images?.[0]?.image ?? undefined;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography component="span" sx={{ fontWeight: 600 }}>
          Apply for Rental
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            mb: 3,
            bgcolor: "#f9fafb",
            borderRadius: 2,
          }}
        >
          <Avatar
            src={firstImage}
            variant="rounded"
            sx={{ width: 56, height: 56 }}
          >
            <Home />
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{fontWeight:700}}noWrap>
              {property.title}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {property.propertyType} • For Rent
            </Typography>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          Your application will be reviewed by the owner or the assigned agent.
        </Alert>

        <form id="rental-application-form" onSubmit={handleSubmit(onSubmit)}>
          <FormInput<RentalApplicationFormValues>
            name="monthlyIncome"
            control={control}
            label="Monthly Income"
            type="number"
          />

          <FormInput<RentalApplicationFormValues>
            name="employmentStatus"
            control={control}
            label="Employment Status"
            placeholder="Employed / Self-employed / Student"
          />

          <FormInput<RentalApplicationFormValues>
            name="occupation"
            control={control}
            label="Occupation"
            placeholder="Engineer, Teacher, etc."
          />

          <FormInput<RentalApplicationFormValues>
            name="message"
            control={control}
            label="Message (optional)"
            multiline
            rows={4}
          />
        </form>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button onClick={onClose} disabled={loading || isSubmitting}>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          form="rental-application-form"
          variant="contained"
          startIcon={<Send />}
          loading={loading || isSubmitting}
        >
          Submit Application
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default RentalApplicationModal;