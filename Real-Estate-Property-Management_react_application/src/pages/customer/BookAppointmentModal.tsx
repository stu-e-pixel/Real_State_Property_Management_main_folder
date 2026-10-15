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
import { Close, EventAvailable, Home } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import FormInput from "../../components/common/FormInput";
import { appointmentSchema } from "../../utils/validations";
import { createAppointment } from "../../features/appointment/appointmentSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type {
  AppointmentFormValues,
  CreateAppointmentData,
} from "../../typescript/type/appointment.types";
import type { Property } from "../../typescript/type/property.types";

interface BookAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  property: Property | null | undefined;
}


const defaultDateTime = (): string => {
  const d = new Date();

  d.setDate(d.getDate() + 1);
  d.setHours(10, 0, 0, 0);

  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate(),
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const BookAppointmentModal: React.FC<BookAppointmentModalProps> = ({
  open,
  onClose,
  property,
}) => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.appointment);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: yupResolver(appointmentSchema),
    defaultValues: {
      appointmentDate: defaultDateTime(),
      duration: 60,
      message: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      appointmentDate: defaultDateTime(),
      duration: 60,
      message: "",
    });
  }, [open, reset]);

  const onSubmit = async (data: AppointmentFormValues): Promise<void> => {
    if (!property?._id) return;

    const payload: CreateAppointmentData = {
      property: property._id,
      appointmentDate: new Date(data.appointmentDate).toISOString(),
      duration: data.duration,
      message: data.message,
    };

    const result = await dispatch(createAppointment(payload));

    if (createAppointment.fulfilled.match(result)) {
      reset();
      onClose();
    }
  };

  if (!property) return null;

  const firstImage = property.images?.[0]?.image ?? undefined;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
          },
        },
      }}
    >
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
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          Book Property Visit
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
            sx={{
              width: 56,
              height: 56,
            }}
          >
            <Home />
          </Avatar>

          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
              }}
              noWrap
            >
              {property.title}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              {property.propertyType} • {property.purpose}
            </Typography>
          </Box>
        </Box>

        <form id="book-appointment-form" onSubmit={handleSubmit(onSubmit)}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormInput<AppointmentFormValues>
              name="appointmentDate"
              control={control}
              label="Preferred Date & Time"
              type="datetime-local"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <FormInput<AppointmentFormValues>
              name="duration"
              control={control}
              label="Duration (minutes)"
              type="number"
            />

            <FormInput<AppointmentFormValues>
              name="message"
              control={control}
              label="Message (optional)"
              multiline
              rows={3}
              placeholder="Any specific requirements or questions..."
            />
          </Box>
        </form>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          gap: 1,
        }}
      >
        <Button onClick={onClose} disabled={loading || isSubmitting}>
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          form="book-appointment-form"
          variant="contained"
          startIcon={<EventAvailable />}
          loading={loading || isSubmitting}
        >
          Book Visit
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default BookAppointmentModal;
