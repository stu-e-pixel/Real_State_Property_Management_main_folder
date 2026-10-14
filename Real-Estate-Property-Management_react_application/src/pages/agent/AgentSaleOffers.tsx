import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Divider,
  Skeleton,
  Chip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Stack,
} from "@mui/material";
import { LocalOffer, ExpandMore, Home } from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import { getSaleOfferByAgent } from "../../features/saleOffer/saleOfferSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type { SaleOffer } from "../../typescript/type/saleOffer.types";
import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";
import type { Property } from "../../typescript/type/property.types";
import { IndianRupee } from "lucide-react";

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

interface PropertyGroup {
  propertyId: string;
  property: Property | null;
  offers: SaleOffer[];
}

const groupByProperty = (offers: SaleOffer[]): PropertyGroup[] => {
  const map = new Map<string, PropertyGroup>();

  offers.forEach((o) => {
    const pid =
      typeof o.property === "string"
        ? o.property
        : (o.property?._id ?? "unknown");

    if (!map.has(pid)) {
      map.set(pid, {
        propertyId: pid,
        property: isPopulatedProperty(o.property) ? o.property : null,
        offers: [],
      });
    }

    map.get(pid)!.offers.push(o);
  });

  return Array.from(map.values()).sort(
    (a, b) => b.offers.length - a.offers.length,
  );
};

const AgentSaleOffers: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { saleOffers, loading } = useAppSelector((state) => state.saleOffer);

  const [expanded, setExpanded] = useState<string | false>(false);

  useEffect(() => {
    dispatch(getSaleOfferByAgent())
      .unwrap()
      .then((data) => {
        console.log("✅ Agent sale offers fetched:", data);
      })
      .catch((error) => {
        console.error("❌ Failed:", error);
      });
  }, [dispatch]);

  const propertyGroups = useMemo(
    () => groupByProperty(saleOffers),
    [saleOffers],
  );

  const totalOffers = saleOffers.length;
  const totalProperties = propertyGroups.length;

  return (
    <MainLayout>
      <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3 }}>
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
              Sale Offers
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Buyer offers on your assigned properties
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Chip
              label={`${totalOffers} Offers`}
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`${totalProperties} Properties`}
              color="success"
              variant="outlined"
            />
          </Stack>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading && saleOffers.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[1, 2, 3].map((i) => (
              <Skeleton
                key={i}
                variant="rounded"
                height={120}
                sx={{ borderRadius: 3 }}
              />
            ))}
          </Box>
        ) : saleOffers.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              py: 8,
            }}
          >
            <LocalOffer sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography color="text.secondary">
              No offers on your assigned properties yet.
            </Typography>
          </Box>
        ) : (
          <Box>
            {propertyGroups.map((group) => (
              <Accordion
                key={group.propertyId}
                expanded={expanded === group.propertyId}
                onChange={(_e, isExp) =>
                  setExpanded(isExp ? group.propertyId : false)
                }
                sx={{
                  mb: 2,
                  borderRadius: 3,
                  "&:before": { display: "none" },
                  boxShadow: 1,
                  overflow: "hidden",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  sx={{
                    bgcolor: "#f9fafb",
                    "&:hover": { bgcolor: "#f0f4f8" },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      width: "100%",
                      pr: 2,
                    }}
                  >
                    <Avatar
                      src={group.property?.images?.[0]?.image}
                      variant="rounded"
                      sx={{ width: 52, height: 52 }}
                    >
                      <Home />
                    </Avatar>

                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700 }}
                        noWrap
                      >
                        {group.property?.title ?? "Property"}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {group.property &&
                          `${group.property.propertyType} • For Sale`}
                      </Typography>
                      {group.property && (
                        <Typography
                          variant="caption"
                          color="primary"
                          sx={{ fontWeight: 600 }}
                        >
                          Asking: ₹{group.property.price.toLocaleString()}
                        </Typography>
                      )}
                    </Box>

                    <Chip
                      label={`${group.offers.length} Offer${
                        group.offers.length !== 1 ? "s" : ""
                      }`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ pt: 2 }}>
                  <Grid container spacing={2}>
                    {group.offers.map((offer) => (
                      <Box
                        key={offer._id}
                        sx={{
                          width: {
                            xs: "100%",
                            sm: "50%",
                            md: "33.3333%",
                          },
                          p: 1,
                          boxSizing: "border-box",
                        }}
                      >
                        <Card
                          sx={{
                            borderRadius: 2,
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <CardContent sx={{ flexGrow: 1 }}>
                            {isPopulatedUser(offer.buyer) && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mb: 1.5,
                                }}
                              >
                                <Avatar
                                  src={offer.buyer.image}
                                  sx={{ width: 32, height: 32 }}
                                >
                                  {offer.buyer.name?.charAt(0)}
                                </Avatar>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 600, display: "block" }}
                                  >
                                    {offer.buyer.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ fontSize: 11 }}
                                  >
                                    {offer.buyer.email}
                                  </Typography>
                                </Box>
                                <Box sx={{ ml: "auto" }}>
                                  <Chip
                                    label={offer.status}
                                    color={
                                      STATUS_COLORS[offer.status] ?? "default"
                                    }
                                    size="small"
                                  />
                                </Box>
                              </Box>
                            )}

                            <Divider sx={{ my: 1 }} />

                            <Stack spacing={0.5}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.5,
                                }}
                              >
                                <IndianRupee fontSize="small" color="action" />
                                <Typography
                                  variant="body2"
                                  sx={{ fontWeight: 600 }}
                                >
                                  ₹{offer.offerPrice.toLocaleString()}
                                </Typography>
                              </Box>

                              {offer.currentOfferPrice !== offer.offerPrice && (
                                <Typography
                                  variant="caption"
                                  color="primary"
                                  sx={{ fontWeight: 600 }}
                                >
                                  Current: ₹
                                  {offer.currentOfferPrice.toLocaleString()}
                                </Typography>
                              )}

                              {offer.message && (
                                <Typography
                                  variant="caption"
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

                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ fontSize: 10 }}
                              >
                                {new Date(offer.createdAt).toLocaleString()}
                              </Typography>
                            </Stack>
                          </CardContent>

                          <Divider />

                          <CardActions sx={{ justifyContent: "flex-end" }}>
                            <Button
                              size="small"
                              variant="outlined"
                              startIcon={<LocalOffer fontSize="small" />}
                              onClick={() =>
                                navigate(
                                  `/agent/property/${group.propertyId}/offers`,
                                )
                              }
                            >
                              Manage
                            </Button>
                          </CardActions>
                        </Card>
                      </Box>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Paper>
    </MainLayout>
  );
};

export default AgentSaleOffers;
