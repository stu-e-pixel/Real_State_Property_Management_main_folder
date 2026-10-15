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
} from "@mui/material";

import {
  LocalOffer,
  ExpandMore,
  Home,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";

import { getSaleOfferByOwner } from "../../features/saleOffer/saleOfferSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";

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
  value: Property | string | undefined
): value is Property =>
  !!value && typeof value === "object" && "title" in value;

const isPopulatedUser = (
  value: PopulatedUserLite | string | null | undefined
): value is PopulatedUserLite =>
  !!value && typeof value === "object" && "name" in value;



interface PropertyGroup {
  propertyId: string;
  property: Property | null;
  offers: SaleOffer[];
}



const groupByProperty = (offers: SaleOffer[]): PropertyGroup[] => {
  const map = new Map<string, PropertyGroup>();

  offers.forEach((offer) => {
    const propertyId =
      typeof offer.property === "string"
        ? offer.property
        : offer.property?._id ?? "unknown";

    if (!map.has(propertyId)) {
      map.set(propertyId, {
        propertyId,
        property: isPopulatedProperty(offer.property)
          ? offer.property
          : null,
        offers: [],
      });
    }

    map.get(propertyId)!.offers.push(offer);
  });

  return Array.from(map.values()).sort(
    (a, b) => b.offers.length - a.offers.length
  );
};



const OwnerSaleOffers: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { saleOffers, loading } = useAppSelector(
    (state) => state.saleOffer
  );

  const [expanded, setExpanded] = useState<string | false>(false);



  useEffect(() => {
    dispatch(getSaleOfferByOwner())
      .unwrap()
      .catch((error: unknown) => {
        console.error("Failed to fetch sale offers:", error);
      });
  }, [dispatch]);



  const propertyGroups = useMemo(
    () => groupByProperty(saleOffers),
    [saleOffers]
  );

  const totalOffers = saleOffers.length;
  const totalProperties = propertyGroups.length;

  const offerCardWidth = {
    xs: "100%",
    sm: "calc(50% - 12px)",
    md: "calc(33.333% - 16px)",
  };

  

  return (
    <MainLayout>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f8fafc",
          p: { xs: 1.5, sm: 2, md: 3 },
        }}
      >
        <Paper
          sx={{
            maxWidth: 1600,
            mx: "auto",
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 4,
            bgcolor: "#ffffff",
            border: "1px solid #dbe7e4",
            boxShadow: "0 10px 35px rgba(15,23,42,0.05)",
          }}
        >
          

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              flexWrap: "wrap",
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography
                variant="overline"
                sx={{
                  color: "#0f766e",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                }}
              >
                PROPERTY MANAGEMENT
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  fontSize: { xs: "1.5rem", sm: "1.8rem" },
                  mb: 0.5,
                }}
              >
                Sale Offers
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#64748b" }}
              >
                Buyer offers across all your sale properties
              </Typography>
            </Box>

           

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Chip
                icon={<LocalOffer />}
                label={`${totalOffers} Offers`}
                variant="outlined"
                sx={{
                  color: "#0f766e",
                  borderColor: "#99f6e4",
                  bgcolor: "#f0fdfa",
                  fontWeight: 700,
                  "& .MuiChip-icon": {
                    color: "#0f766e",
                  },
                }}
              />

              <Chip
                icon={<Home />}
                label={`${totalProperties} Properties`}
                variant="outlined"
                sx={{
                  color: "#047857",
                  borderColor: "#a7f3d0",
                  bgcolor: "#ecfdf5",
                  fontWeight: 700,
                  "& .MuiChip-icon": {
                    color: "#047857",
                  },
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "#e2e8f0" }} />

         

          {loading && saleOffers.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {[1, 2, 3].map((item) => (
                <Skeleton
                  key={item}
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
                px: 2,
                border: "1px dashed #cbd5e1",
                borderRadius: 3,
                bgcolor: "#f8fafc",
              }}
            >
              <Box
                sx={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "#ecfdf5",
                  mb: 2,
                }}
              >
                <LocalOffer
                  sx={{ fontSize: 42, color: "#0f766e" }}
                />
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: "#0f172a",
                  mb: 1,
                }}
              >
                No Sale Offers Yet
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "#64748b" }}
              >
                Buyer offers for your sale properties will appear here.
              </Typography>
            </Box>
          ) : (
            
            <Box>
              {propertyGroups.map((group) => (
                <Accordion
                  key={group.propertyId}
                  expanded={expanded === group.propertyId}
                  onChange={(_event, isExpanded) => {
                    setExpanded(
                      isExpanded ? group.propertyId : false
                    );
                  }}
                  sx={{
                    mb: 2,
                    border: "1px solid #dbe7e4",
                    borderRadius: "12px !important",
                    "&:before": {
                      display: "none",
                    },
                    boxShadow:
                      "0 3px 12px rgba(15,23,42,0.04)",
                    overflow: "hidden",
                    "&.Mui-expanded": {
                      borderColor: "#99f6e4",
                      boxShadow:
                        "0 8px 24px rgba(15,118,110,0.08)",
                    },
                  }}
                >
                 

                  <AccordionSummary
                    expandIcon={
                      <ExpandMore sx={{ color: "#0f766e" }} />
                    }
                    sx={{
                      bgcolor: "#f8fcfb",
                      px: { xs: 1.5, sm: 2.5 },
                      py: 1,
                      "&:hover": {
                        bgcolor: "#f0fdfa",
                      },
                      "& .MuiAccordionSummary-content": {
                        my: 1,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: { xs: 1.2, sm: 2 },
                        width: "100%",
                        minWidth: 0,
                        pr: 1,
                      }}
                    >
                      <Avatar
                        src={
                          group.property?.images?.[0]?.image
                        }
                        variant="rounded"
                        sx={{
                          width: { xs: 44, sm: 58 },
                          height: { xs: 44, sm: 58 },
                          bgcolor: "#d1fae5",
                          color: "#047857",
                          flexShrink: 0,
                        }}
                      >
                        <Home />
                      </Avatar>

                      <Box
                        sx={{
                          flexGrow: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 800,
                            color: "#0f172a",
                            fontSize: {
                              xs: "0.9rem",
                              sm: "1rem",
                            },
                          }}
                          noWrap
                        >
                          {group.property?.title ?? "Property"}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{ color: "#64748b" }}
                        >
                          {group.property
                            ? `${group.property.propertyType} • For Sale`
                            : "Property details unavailable"}
                        </Typography>

                        {group.property && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: "#047857",
                              fontWeight: 800,
                            }}
                          >
                            Asking: ₹
                            {Number(
                              group.property.price
                            ).toLocaleString("en-US")}
                          </Typography>
                        )}
                      </Box>

                      <Chip
                        label={`${group.offers.length} ${
                          group.offers.length === 1
                            ? "Offer"
                            : "Offers"
                        }`}
                        size="small"
                        sx={{
                          flexShrink: 0,
                          bgcolor: "#d1fae5",
                          color: "#065f46",
                          fontWeight: 800,
                          border: "1px solid #a7f3d0",
                        }}
                      />
                    </Box>
                  </AccordionSummary>

                  

                  <AccordionDetails
                    sx={{
                      p: { xs: 1.5, sm: 2.5 },
                      bgcolor: "#ffffff",
                    }}
                  >
                   

                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                      }}
                    >
                      {group.offers.map((offer) => (
                        <Box
                          key={offer._id}
                          sx={{
                            width: offerCardWidth,
                            display: "flex",
                            minWidth: 0,
                          }}
                        >
                          <Card
                            variant="outlined"
                            sx={{
                              borderRadius: 3,
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              borderColor: "#dbe7e4",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                borderColor: "#99f6e4",
                                boxShadow:
                                  "0 8px 20px rgba(15,118,110,0.08)",
                                transform: "translateY(-2px)",
                              },
                            }}
                          >
                            <CardContent
                              sx={{
                                flexGrow: 1,
                                p: 2,
                              }}
                            >
                              {/* BUYER INFORMATION */}

                              {isPopulatedUser(offer.buyer) && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                    mb: 1.5,
                                    minWidth: 0,
                                  }}
                                >
                                  <Avatar
                                    src={
                                      offer.buyer.image ?? undefined
                                    }
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      bgcolor: "#d1fae5",
                                      color: "#047857",
                                      fontWeight: 800,
                                      flexShrink: 0,
                                    }}
                                  >
                                    {offer.buyer.name?.charAt(0)}
                                  </Avatar>

                                  <Box
                                    sx={{
                                      flex: 1,
                                      minWidth: 0,
                                    }}
                                  >
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        fontWeight: 800,
                                        color: "#0f172a",
                                      }}
                                      noWrap
                                    >
                                      {offer.buyer.name}
                                    </Typography>

                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",
                                        color: "#64748b",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {offer.buyer.email}
                                    </Typography>
                                  </Box>

                                  <Chip
                                    label={offer.status}
                                    color={
                                      STATUS_COLORS[offer.status] ??
                                      "default"
                                    }
                                    size="small"
                                    sx={{
                                      fontWeight: 700,
                                      textTransform: "capitalize",
                                      flexShrink: 0,
                                    }}
                                  />
                                </Box>
                              )}

                              <Divider sx={{ my: 1.5 }} />

                             

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
                                    gap: 0.7,
                                    p: 1.2,
                                    borderRadius: 2,
                                    bgcolor: "#ecfdf5",
                                  }}
                                >
                                  <IndianRupee
                                    fontSize="small"
                                    color= "#047857"
                                  />

                                  <Box sx={{ minWidth: 0 }}>
                                    <Typography
                                      variant="caption"
                                      sx={{ color: "#64748b" }}
                                    >
                                      Buyer offer
                                    </Typography>

                                    <Typography
                                      variant="subtitle1"
                                      sx={{
                                        color: "#047857",
                                        fontWeight: 800,
                                        lineHeight: 1.4,
                                        overflowWrap: "anywhere",
                                      }}
                                    >
                                      ₹
                                      {Number(
                                        offer.offerPrice
                                      ).toLocaleString("en-US")}
                                    </Typography>
                                  </Box>
                                </Box>

                                {offer.currentOfferPrice !==
                                  offer.offerPrice && (
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#0f766e",
                                      fontWeight: 700,
                                    }}
                                  >
                                    Current offer: ₹
                                    {Number(
                                      offer.currentOfferPrice
                                    ).toLocaleString("en-US")}
                                  </Typography>
                                )}

                                {offer.message && (
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color: "#64748b",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      overflowWrap: "anywhere",
                                    }}
                                  >
                                    {offer.message}
                                  </Typography>
                                )}

                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: "#94a3b8",
                                    fontSize: 11,
                                  }}
                                >
                                  Submitted:{" "}
                                  {new Date(
                                    offer.createdAt
                                  ).toLocaleString()}
                                </Typography>
                              </Box>
                            </CardContent>

                            <Divider
                              sx={{ borderColor: "#edf2f7" }}
                            />

                            {/* MANAGE ACTION */}

                            <CardActions
                              sx={{
                                justifyContent: "flex-end",
                                p: 1.5,
                                bgcolor: "#fcfefd",
                              }}
                            >
                              <Button
                                size="small"
                                variant="contained"
                                startIcon={<LocalOffer />}
                                onClick={() =>
                                  navigate(
                                    `/owner/property/${group.propertyId}/offers`
                                  )
                                }
                                sx={{
                                  bgcolor: "#0f766e",
                                  color: "#ffffff",
                                  borderRadius: 2,
                                  fontWeight: 700,
                                  textTransform: "none",
                                  boxShadow: "none",
                                  "&:hover": {
                                    bgcolor: "#115e59",
                                    boxShadow:
                                      "0 4px 12px rgba(15,118,110,0.2)",
                                  },
                                }}
                              >
                                Manage
                              </Button>
                            </CardActions>
                          </Card>
                        </Box>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default OwnerSaleOffers;