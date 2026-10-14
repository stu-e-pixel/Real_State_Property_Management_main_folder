import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Box,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Tabs,
  Tab,
  Skeleton,
  Alert,
} from "@mui/material";

import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";

import {
  LocalOffer,
  Close,
  Home,
  Visibility,
  Cancel,
  Delete,
  CheckCircle,
} from "@mui/icons-material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";
import { respondSaleOfferSchema } from "../../utils/validations";
import {
  getMySaleOffers,
  withdrawSaleOffer,
  deleteSaleOffer,
  respondToSaleOffer,
} from "../../features/saleOffer/saleOfferSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  SaleOffer,
  RespondSaleOfferFormValues,
} from "../../typescript/type/saleOffer.types";
import type { Property } from "../../typescript/type/property.types";

const STATUS_COLORS: Record<
  string,
  "default" | "warning" | "info" | "success" | "error"
> = {
  pending: "warning",
  countered: "info",
  accepted: "success",
  rejected: "error",
  withdrawn: "default",
  expired: "default",
};

const isPopulatedProperty = (
  val: Property | string | undefined
): val is Property => !!val && typeof val === "object" && "title" in val;

const MySaleOffers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { saleOffers, loading } = useAppSelector((state) => state.saleOffer);

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [viewTarget, setViewTarget] = useState<SaleOffer | null>(null);
  const [respondOpen, setRespondOpen] = useState<boolean>(false);
  const [respondTarget, setRespondTarget] = useState<SaleOffer | null>(null);

  const respondForm = useForm<RespondSaleOfferFormValues>({
    resolver: yupResolver(respondSaleOfferSchema),
    defaultValues: {
      action: "accept",
      counterOfferPrice: 0,
      message: "",
    },
  });

  useEffect(() => {
    dispatch(getMySaleOffers());
  }, [dispatch]);

  const openView = (offer: SaleOffer): void => {
    setViewTarget(offer);
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    setViewTarget(null);
  };

  const openRespond = (offer: SaleOffer): void => {
    setRespondTarget(offer);

    respondForm.reset({
      action: "accept",
      counterOfferPrice: offer.currentOfferPrice,
      message: "",
    });

    setRespondOpen(true);
  };

  const closeRespond = (): void => {
    setRespondOpen(false);
    setRespondTarget(null);
    respondForm.reset({
      action: "accept",
      counterOfferPrice: 0,
      message: "",
    });
  };

  const submitRespond = async (
    data: RespondSaleOfferFormValues
  ): Promise<void> => {
    if (!respondTarget) return;

    const result = await dispatch(
      respondToSaleOffer({
        id: respondTarget._id,
        action: data.action,
        counterOfferPrice:
          data.action === "counter" ? data.counterOfferPrice : undefined,
        message: data.message,
      })
    );

    if (respondToSaleOffer.fulfilled.match(result)) {
      closeRespond();
    }
  };

  const handleWithdraw = (id: string): void => {
    if (window.confirm("Withdraw this offer?")) {
      dispatch(withdrawSaleOffer(id));
    }
  };

  const handleDelete = (id: string): void => {
    if (window.confirm("Delete this offer permanently?")) {
      dispatch(deleteSaleOffer(id));
    }
  };

  const filtered =
    tab === "all"
      ? saleOffers
      : saleOffers.filter((offer) => offer.status === tab);

  const counts = {
    all: saleOffers.length,
    pending: saleOffers.filter((offer) => offer.status === "pending").length,
    countered: saleOffers.filter((offer) => offer.status === "countered").length,
    accepted: saleOffers.filter((offer) => offer.status === "accepted").length,
    rejected: saleOffers.filter((offer) => offer.status === "rejected").length,
    withdrawn: saleOffers.filter((offer) => offer.status === "withdrawn").length,
  };

  const canWithdraw = (status: string): boolean =>
    ["pending", "countered"].includes(status);

  const canDelete = (status: string): boolean =>
    ["pending", "countered", "rejected", "withdrawn", "expired"].includes(
      status
    );

  const canRespond = (offer: SaleOffer): boolean =>
    offer.status === "countered";

  return (
    <MainLayout>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              My Offers
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Purchase offers you've made on properties
            </Typography>
          </Box>

          <Chip
            label={`${saleOffers.length} Total`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        <Tabs
          value={tab}
          onChange={(_event, value: string) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab value="all" label={`All (${counts.all})`} />
          <Tab value="pending" label={`Pending (${counts.pending})`} />
          <Tab value="countered" label={`Countered (${counts.countered})`} />
          <Tab value="accepted" label={`Accepted (${counts.accepted})`} />
          <Tab value="rejected" label={`Rejected (${counts.rejected})`} />
          <Tab value="withdrawn" label={`Withdrawn (${counts.withdrawn})`} />
        </Tabs>

        {loading && saleOffers.length === 0 ? (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {[1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{ width: { xs: "100%", md: "calc(50% - 12px)" } }}
              >
                <Skeleton
                  variant="rounded"
                  height={280}
                  sx={{ borderRadius: 3 }}
                />
              </Box>
            ))}
          </Box>
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <LocalOffer
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography color="text.secondary">
              No offers in this category.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
            {filtered.map((offer) => (
              <Box
                key={offer._id}
                sx={{ width: { xs: "100%", md: "calc(50% - 12px)" } }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                        gap: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1.5,
                          alignItems: "center",
                          minWidth: 0,
                        }}
                      >
                        <Avatar
                          src={
                            isPopulatedProperty(offer.property)
                              ? offer.property.images?.[0]?.image
                              : undefined
                          }
                          variant="rounded"
                          sx={{ width: 44, height: 44 }}
                        >
                          <Home />
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                            noWrap
                          >
                            {isPopulatedProperty(offer.property)
                              ? offer.property.title
                              : "Property"}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {isPopulatedProperty(offer.property) &&
                              `${offer.property.propertyType} • ${offer.property.purpose}`}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={offer.status}
                        color={STATUS_COLORS[offer.status] ?? "default"}
                        size="small"
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Your original offer:
                        </Typography>

                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ₹{offer.offerPrice.toLocaleString()}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          Current offer:
                        </Typography>

                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700 }}
                          color="primary"
                        >
                          ₹{offer.currentOfferPrice.toLocaleString()}
                        </Typography>
                      </Box>

                      {offer.message && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {offer.message}
                        </Typography>
                      )}
                    </Box>

                    {offer.offerHistory.length > 0 && (
                      <Alert severity="info" sx={{ mt: 1.5, py: 0.5 }}>
                        <Typography variant="caption">
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {offer.offerHistory.length}
                          </Box>{" "}
                          counter offer
                          {offer.offerHistory.length !== 1 ? "s" : ""} on this
                          offer
                        </Typography>
                      </Alert>
                    )}

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mt: 1,
                      }}
                    >
                      {new Date(offer.createdAt).toLocaleString()}
                    </Typography>
                  </CardContent>

                  <Divider />

                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    <Tooltip title="View details">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => openView(offer)}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                    </Tooltip>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      {canRespond(offer) && (
                        <Button
                          size="small"
                          variant="contained"
                          color="info"
                          startIcon={<CheckCircle />}
                          onClick={() => openRespond(offer)}
                        >
                          Respond
                        </Button>
                      )}

                      {canWithdraw(offer.status) && (
                        <Tooltip title="Withdraw">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() => handleWithdraw(offer._id)}
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}

                      {canDelete(offer.status) && (
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(offer._id)}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* View offer dialog */}
      <Dialog
        open={viewOpen}
        onClose={closeView}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
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
            Offer Details
          </Typography>

          <IconButton onClick={closeView} size="small" aria-label="Close">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {viewTarget && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Property
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {isPopulatedProperty(viewTarget.property)
                    ? viewTarget.property.title
                    : "Property"}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Original Offer
                  </Typography>

                  <Typography variant="body1">
                    ₹{viewTarget.offerPrice.toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Current Offer
                  </Typography>

                  <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    ₹{viewTarget.currentOfferPrice.toLocaleString()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Status
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={viewTarget.status}
                      color={STATUS_COLORS[viewTarget.status] ?? "default"}
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              {viewTarget.message && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Your Message
                  </Typography>

                  <Alert severity="info" sx={{ mt: 0.5 }}>
                    {viewTarget.message}
                  </Alert>
                </Box>
              )}

              {viewTarget.offerHistory.length > 0 && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700 }}
                    gutterBottom
                  >
                    Offer History
                  </Typography>

                  <Timeline position="right">
                    <TimelineItem>
                      <TimelineOppositeContent
                        sx={{ color: "text.secondary" }}
                      >
                        {new Date(viewTarget.createdAt).toLocaleString()}
                      </TimelineOppositeContent>

                      <TimelineSeparator>
                        <TimelineDot color="primary" />
                        <TimelineConnector />
                      </TimelineSeparator>

                      <TimelineContent>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          You offered ₹
                          {viewTarget.offerPrice.toLocaleString()}
                        </Typography>

                        {viewTarget.message && (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {viewTarget.message}
                          </Typography>
                        )}
                      </TimelineContent>
                    </TimelineItem>

                    {viewTarget.offerHistory.map((history) => (
                      <TimelineItem key={history._id}>
                        <TimelineOppositeContent
                          sx={{ color: "text.secondary" }}
                        >
                          {new Date(history.createdAt).toLocaleString()}
                        </TimelineOppositeContent>

                        <TimelineSeparator>
                          <TimelineDot color="secondary" />
                          <TimelineConnector />
                        </TimelineSeparator>

                        <TimelineContent>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {history.offeredByModel} countered at ₹
                            {history.amount.toLocaleString()}
                          </Typography>

                          {history.message && (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {history.message}
                            </Typography>
                          )}
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Respond to counteroffer dialog */}
      <Dialog
        open={respondOpen}
        onClose={closeRespond}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle>
          <Typography component="span" sx={{ fontWeight: 600 }}>
            Respond to Counteroffer
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {respondTarget && (
              <Alert severity="info" sx={{ mb: 2 }}>
                The owner/agent countered at{" "}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  ₹{respondTarget.currentOfferPrice.toLocaleString()}
                </Box>
                .
              </Alert>
            )}

            <Box
              component="form"
              id="respond-sale-offer-form"
              onSubmit={respondForm.handleSubmit(submitRespond)}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <FormInput<RespondSaleOfferFormValues>
                name="action"
                control={respondForm.control}
                label="Action"
                select
                options={[
                  { value: "accept", label: "Accept counter" },
                  { value: "reject", label: "Reject counter" },
                ]}
              />

              <FormInput<RespondSaleOfferFormValues>
                name="message"
                control={respondForm.control}
                label="Message (optional)"
                multiline
                rows={3}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={closeRespond} disabled={loading}>
            Cancel
          </Button>

          <Button
            variant="contained"
            type="submit"
            form="respond-sale-offer-form"
            disabled={loading}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default MySaleOffers;