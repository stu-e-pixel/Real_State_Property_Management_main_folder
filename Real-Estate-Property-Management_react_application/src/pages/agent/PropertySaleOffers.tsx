/* eslint-disable react-hooks/incompatible-library */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

import { LocalOffer, Visibility, ArrowBack, Close } from "@mui/icons-material";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";
import { respondSaleOfferSchema } from "../../utils/validations";
import {
  getPropertySaleOffers,
  respondToSaleOffer,
} from "../../features/saleOffer/saleOfferSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type {
  SaleOffer,
  RespondSaleOfferFormValues,
} from "../../typescript/type/saleOffer.types";
import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";
import type { Property } from "../../typescript/type/property.types";
import { createSaleTransaction } from "../../features/saleTransaction/saleTransactionSlice";
import { Receipt } from "@mui/icons-material";

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
  val: Property | string | undefined,
): val is Property => !!val && typeof val === "object" && "title" in val;

const isPopulatedUser = (
  val: PopulatedUserLite | string | null | undefined,
): val is PopulatedUserLite =>
  !!val && typeof val === "object" && "name" in val;

const PropertySaleOffers: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { saleOffers, loading } = useAppSelector((state) => state.saleOffer);

  const [tab, setTab] = useState<string>("all");

  // Kept as requested; currently not used for displaying a view dialog.
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
    console.log("🔍 useEffect — propertyId:", propertyId);
    if (propertyId) {
      dispatch(getPropertySaleOffers(propertyId)).then((result) => {
        console.log("🔍 Dispatch result:", result);
      });
    } else {
      console.warn("⚠️ propertyId is missing!");
    }
  }, [dispatch, propertyId]);

  const openView = (offer: SaleOffer): void => {
    setViewTarget(offer);
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    setViewTarget(null);
  };

  const openRespond = (
    offer: SaleOffer,
    action: "accept" | "reject" | "counter",
  ): void => {
    setRespondTarget(offer);

    respondForm.reset({
      action,
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
    data: RespondSaleOfferFormValues,
  ): Promise<void> => {
    if (!respondTarget) return;

    const result = await dispatch(
      respondToSaleOffer({
        id: respondTarget._id,
        action: data.action,
        counterOfferPrice:
          data.action === "counter" ? data.counterOfferPrice : undefined,
        message: data.message,
      }),
    );

    if (respondToSaleOffer.fulfilled.match(result)) {
      closeRespond();
    }
  };

  const filtered =
    tab === "all"
      ? saleOffers
      : saleOffers.filter((offer) => offer.status === tab);

  const counts = {
    all: saleOffers.length,
    pending: saleOffers.filter((offer) => offer.status === "pending").length,
    countered: saleOffers.filter((offer) => offer.status === "countered")
      .length,
    accepted: saleOffers.filter((offer) => offer.status === "accepted").length,
    rejected: saleOffers.filter((offer) => offer.status === "rejected").length,
  };

  const canRespond = (status: string): boolean =>
    ["pending", "countered"].includes(status);

  const propertyTitle =
    saleOffers.length > 0 && isPopulatedProperty(saleOffers[0].property)
      ? saleOffers[0].property.title
      : "Property Offers";

  return (
    <MainLayout>
      <Paper sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <IconButton onClick={() => navigate(-1)} aria-label="Go back">
            <ArrowBack />
          </IconButton>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {propertyTitle}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              All offers on this property
            </Typography>
          </Box>

          <Chip
            label={`${saleOffers.length} Offers`}
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
                  height={300}
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
                    {isPopulatedUser(offer.buyer) && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          src={offer.buyer.image}
                          sx={{ width: 40, height: 40 }}
                        >
                          {offer.buyer.name?.charAt(0)}
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700 }}
                          >
                            {offer.buyer.name}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ display: "block", overflowWrap: "anywhere" }}
                          >
                            {offer.buyer.email}
                          </Typography>
                        </Box>

                        <Chip
                          label={offer.status}
                          color={STATUS_COLORS[offer.status] ?? "default"}
                          size="small"
                        />
                      </Box>
                    )}

                    {!isPopulatedUser(offer.buyer) && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          mb: 2,
                        }}
                      >
                        <Chip
                          label={offer.status}
                          color={STATUS_COLORS[offer.status] ?? "default"}
                          size="small"
                        />
                      </Box>
                    )}

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Original Offer
                        </Typography>

                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          ₹{offer.offerPrice.toLocaleString()}
                        </Typography>
                      </Box>

                      {offer.currentOfferPrice !== offer.offerPrice && (
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Current Offer
                          </Typography>

                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 700 }}
                            color="primary"
                          >
                            ₹{offer.currentOfferPrice.toLocaleString()}
                          </Typography>
                        </Box>
                      )}

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

                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 1 }}
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

                    {canRespond(offer.status) && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 0.5,
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          size="small"
                          color="success"
                          onClick={() => openRespond(offer, "accept")}
                        >
                          Accept
                        </Button>

                        <Button
                          size="small"
                          color="error"
                          onClick={() => openRespond(offer, "reject")}
                        >
                          Reject
                        </Button>

                        <Button
                          size="small"
                          variant="contained"
                          color="info"
                          onClick={() => openRespond(offer, "counter")}
                        >
                          Counter
                        </Button>
                      </Box>
                    )}

                    {offer.status === "accepted" && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<Receipt />}
                        onClick={async () => {
                          const result = await dispatch(
                            createSaleTransaction({
                              offerId: offer._id,
                              notes: "",
                            }),
                          );
                          if (createSaleTransaction.fulfilled.match(result)) {
                            navigate("/agent/sale-transactions"); // or /owner/sale-transactions
                          }
                        }}
                      >
                        Create Transaction
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      {/* View dialog */}
      <Dialog
        open={viewOpen}
        onClose={closeView}
        maxWidth="sm"
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

          <IconButton
            onClick={closeView}
            size="small"
            aria-label="Close offer details"
          >
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
                pt: 1,
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Buyer
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {isPopulatedUser(viewTarget.buyer)
                    ? viewTarget.buyer.name
                    : "Buyer"}
                </Typography>

                {isPopulatedUser(viewTarget.buyer) && (
                  <Typography variant="body2" color="text.secondary">
                    {viewTarget.buyer.email}
                  </Typography>
                )}
              </Box>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Original Offer
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  ₹{viewTarget.offerPrice.toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Current Offer
                </Typography>

                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                  color="primary"
                >
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

              {viewTarget.message && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Message
                  </Typography>

                  <Alert severity="info" sx={{ mt: 0.5 }}>
                    {viewTarget.message}
                  </Alert>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Respond dialog */}
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
            {respondForm.watch("action") === "accept"
              ? "Accept Offer"
              : respondForm.watch("action") === "reject"
                ? "Reject Offer"
                : "Send Counter Offer"}
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            {respondTarget && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Buyer offered{" "}
                <Box component="span" sx={{ fontWeight: 700 }}>
                  ₹{respondTarget.currentOfferPrice.toLocaleString()}
                </Box>
              </Alert>
            )}

            <Box
              component="form"
              id="owner-respond-form"
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
                  { value: "accept", label: "Accept" },
                  { value: "reject", label: "Reject" },
                  { value: "counter", label: "Counter" },
                ]}
              />

              {respondForm.watch("action") === "counter" && (
                <FormInput<RespondSaleOfferFormValues>
                  name="counterOfferPrice"
                  control={respondForm.control}
                  label="Counter Offer Price"
                  type="number"
                />
              )}

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
          <Button onClick={closeRespond}>Cancel</Button>

          <Button variant="contained" type="submit" form="owner-respond-form">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default PropertySaleOffers;
