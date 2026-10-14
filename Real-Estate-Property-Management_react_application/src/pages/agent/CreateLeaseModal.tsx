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
  Alert,
} from "@mui/material";
import { Close, Gavel, Home, Person } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import FormInput from "../../components/common/FormInput";
import { leaseSchema } from "../../utils/validations";
import { createLease } from "../../features/lease/leaseSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  LeaseFormValues,
  CreateLeaseData,
} from "../../typescript/type/lease.types";
import type { RentalApplication } from "../../typescript/type/rental.types";
import type { Property } from "../../typescript/type/property.types";
import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";

interface CreateLeaseModalProps {
  open: boolean;
  onClose: () => void;
  application: RentalApplication | null | undefined;
}

const isPopulatedProperty = (
  val: Property | string | undefined
): val is Property =>
  !!val && typeof val === "object" && "title" in val;

const isPopulatedUser = (
  val: PopulatedUserLite | string | null | undefined
): val is PopulatedUserLite =>
  !!val && typeof val === "object" && "name" in val;

// Helpers for datetime-local
const pad = (n: number): string => String(n).padStart(2, "0");

const toLocalInput = (d: Date): string =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
    d.getDate()
  )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;

const defaultStart = (): string => toLocalInput(new Date());

const defaultEnd = (): string => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 1);

  return toLocalInput(d);
};

const CreateLeaseModal: React.FC<CreateLeaseModalProps> = ({
  open,
  onClose,
  application,
}) => {
  const dispatch = useAppDispatch();

  const { loading } = useAppSelector((state) => state.lease);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LeaseFormValues>({
    resolver: yupResolver(leaseSchema),
    defaultValues: {
      rentalApplication: "",
      startDate: defaultStart(),
      endDate: defaultEnd(),
      monthlyRent: 0,
      securityDeposit: 0,
      agreementDocument: "",
    },
  });

  useEffect(() => {
    if (!open || !application) return;

    const rent = isPopulatedProperty(application.property)
      ? application.property.price
      : 0;

    reset({
      rentalApplication: application._id,
      startDate: defaultStart(),
      endDate: defaultEnd(),
      monthlyRent: rent,
      securityDeposit: rent,
      agreementDocument: "",
    });
  }, [open, application, reset]);

  const onSubmit = async (data: LeaseFormValues): Promise<void> => {
    if (!application?._id) return;

    const payload: CreateLeaseData = {
      rentalApplication: application._id,
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      monthlyRent: Number(data.monthlyRent) || 0,
      securityDeposit: Number(data.securityDeposit) || 0,
      agreementDocument: data.agreementDocument || "",
    };

    const result = await dispatch(createLease(payload));

    if (createLease.fulfilled.match(result)) {
      reset();
      onClose();
    }
  };

  if (!application) return null;

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
            fontWeight: 600,
          }}
        >
          Create Lease
        </Typography>

        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {/* Application snapshot */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 2,
            mb: 3,
            bgcolor: "#f9fafb",
            borderRadius: 2,
          }}
        >
          {isPopulatedUser(application.applicant) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Person fontSize="small" color="action" />

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                }}
              >
                {application.applicant.name}
              </Typography>
            </Box>
          )}

          {isPopulatedProperty(application.property) && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Home fontSize="small" color="action" />

              <Typography
                variant="body2"
                sx={{
                  fontWeight: 600,
                }}
              >
                {application.property.title}
              </Typography>
            </Box>
          )}
        </Box>

        <Alert
          severity="info"
          sx={{
            mb: 2,
          }}
        >
          Once created, the property will be marked as Rented and cannot
          accept new applications.
        </Alert>

        <form
          id="create-lease-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormInput<LeaseFormValues>
              name="startDate"
              control={control}
              label="Start Date & Time"
              type="datetime-local"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <FormInput<LeaseFormValues>
              name="endDate"
              control={control}
              label="End Date & Time"
              type="datetime-local"
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <FormInput<LeaseFormValues>
              name="monthlyRent"
              control={control}
              label="Monthly Rent"
              type="number"
            />

            <FormInput<LeaseFormValues>
              name="securityDeposit"
              control={control}
              label="Security Deposit"
              type="number"
            />

            <FormInput<LeaseFormValues>
              name="agreementDocument"
              control={control}
              label="Agreement Document URL (optional)"
              placeholder="https://..."
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
        <Button
          onClick={onClose}
          disabled={loading || isSubmitting}
        >
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          form="create-lease-form"
          variant="contained"
          startIcon={<Gavel />}
          loading={loading || isSubmitting}
        >
          Create Lease
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLeaseModal;