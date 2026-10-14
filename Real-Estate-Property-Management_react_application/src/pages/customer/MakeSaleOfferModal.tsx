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
  Alert,
} from "@mui/material";
import { Close, Home, LocalOffer } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

import FormInput from "../../components/common/FormInput";
import { saleOfferSchema } from "../../utils/validations";
import { createSaleOffer } from "../../features/saleOffer/saleOfferSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type {
  SaleOfferFormValues,
  CreateSaleOfferData,
} from "../../typescript/type/saleOffer.types";
import type { Property } from "../../typescript/type/property.types";

interface MakeSaleOfferModalProps {
  open: boolean;
  onClose: () => void;
  property: Property | null | undefined;
}

const MakeSaleOfferModal: React.FC<MakeSaleOfferModalProps> = ({
  open,
  onClose,
  property,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.saleOffer);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SaleOfferFormValues>({
    resolver: yupResolver(saleOfferSchema),
    defaultValues: {
      offerPrice: 0,
      message: "",
    },
  });

  useEffect(() => {
    if (!open) return;

    reset({
      offerPrice: property?.price ?? 0,
      message: "",
    });
  }, [open, property, reset]);

  const closeModal = (): void => {
    if (loading || isSubmitting) return;

    reset({
      offerPrice: property?.price ?? 0,
      message: "",
    });

    onClose();
  };

  const onSubmit = async (data: SaleOfferFormValues): Promise<void> => {
    if (!property?._id) return;

    const payload: CreateSaleOfferData = {
      propertyId: property._id,
      offerPrice: Number(data.offerPrice),
      message: data.message,
    };

    const result = await dispatch(createSaleOffer(payload));

    if (createSaleOffer.fulfilled.match(result)) {
      reset({
        offerPrice: property.price,
        message: "",
      });
      onClose();
    }
  };

  if (!property) return null;

  const firstImage = property.images?.[0]?.image ?? undefined;

  return (
    <Dialog
      open={open}
      onClose={closeModal}
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
        <Typography component="span" sx={{ fontWeight: 600 }}>
          Make an Offer
        </Typography>

        <IconButton
          onClick={closeModal}
          size="small"
          disabled={loading || isSubmitting}
          aria-label="Close sale offer dialog"
        >
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
            bgcolor: "background.default",
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
            <Typography sx={{}} noWrap>
              {property.title}
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Asking price: ₹{property.price.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        <Alert severity="info" sx={{ mb: 2 }}>
          Your offer will be sent to the owner
          {property.agentId ? " or their assigned agent" : ""}. They can
          accept, reject, or send a counteroffer.
        </Alert>

        <Box
          component="form"
          id="make-sale-offer-form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormInput<SaleOfferFormValues>
              name="offerPrice"
              control={control}
              label="Your Offer Price"
              type="number"
            />

            <FormInput<SaleOfferFormValues>
              name="message"
              control={control}
              label="Message (optional)"
              multiline
              rows={3}
              placeholder="Add a note to the owner..."
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          gap: 1,
        }}
      >
        <Button
          onClick={closeModal}
          disabled={loading || isSubmitting}
        >
          Cancel
        </Button>

        <LoadingButton
          type="submit"
          form="make-sale-offer-form"
          variant="contained"
          startIcon={<LocalOffer />}
          loading={loading || isSubmitting}
        >
          Submit Offer
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default MakeSaleOfferModal;