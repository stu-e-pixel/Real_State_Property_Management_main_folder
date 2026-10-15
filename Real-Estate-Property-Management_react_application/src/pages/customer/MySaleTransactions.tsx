import { useEffect, useState } from "react";
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
  LinearProgress,
} from "@mui/material";
import {
  Receipt,
  Close,
  Home,
  Visibility,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import {
  getMySaleTransactions,
  getSaleTransactionById,
  clearSelectedTransaction,
} from "../../features/saleTransaction/saleTransactionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type { SaleTransaction } from "../../typescript/type/saleTransaction.types";
import type { Property } from "../../typescript/type/property.types";
import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";

const TX_STATUS_COLORS: Record<
  string,
  "default" | "info" | "success" | "error" | "warning"
> = {
  initiated: "info",
  agreement_signed: "info",
  payment_pending: "warning",
  completed: "success",
  cancelled: "error",
};

const PAYMENT_STATUS_COLORS: Record<
  string,
  "default" | "info" | "success" | "error" | "warning"
> = {
  paid: "success",
  partial: "info",
  pending: "warning",
  failed: "error",
};

const isPopulatedProperty = (
  value: Property | string | undefined
): value is Property =>
  !!value && typeof value === "object" && "title" in value;

const isPopulatedUser = (
  value: PopulatedUserLite | string | null | undefined
): value is PopulatedUserLite =>
  !!value && typeof value === "object" && "name" in value;

const formatCurrency = (amount: number): string =>
  `₹${amount.toLocaleString()}`;

const formatStatus = (status: string): string =>
  status.replace(/_/g, " ");

const MySaleTransactions: React.FC = () => {
  const dispatch = useAppDispatch();

  const { transactions, transaction, loading } = useAppSelector(
    (state) => state.saleTransaction
  );

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);

  useEffect(() => {
    dispatch(getMySaleTransactions());

    return () => {
      dispatch(clearSelectedTransaction());
    };
  }, [dispatch]);

  const handleView = async (id: string): Promise<void> => {
    const result = await dispatch(getSaleTransactionById(id));

    if (getSaleTransactionById.fulfilled.match(result)) {
      setViewOpen(true);
    }
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedTransaction());
  };

  const filtered =
    tab === "all"
      ? transactions
      : transactions.filter(
          (item) => item.transactionStatus === tab
        );

  const counts = {
    all: transactions.length,
    initiated: transactions.filter(
      (item) => item.transactionStatus === "initiated"
    ).length,
    agreement_signed: transactions.filter(
      (item) => item.transactionStatus === "agreement_signed"
    ).length,
    payment_pending: transactions.filter(
      (item) => item.transactionStatus === "payment_pending"
    ).length,
    completed: transactions.filter(
      (item) => item.transactionStatus === "completed"
    ).length,
  };

  const getProperty = (
    item: SaleTransaction
  ): Property | null => {
    if (isPopulatedProperty(item.property)) {
      return item.property;
    }

    if (item.propertyDetails) {
      return item.propertyDetails;
    }

    return null;
  };

  const getBuyer = (
    item: SaleTransaction
  ): PopulatedUserLite | null => {
    if (isPopulatedUser(item.buyer)) {
      return item.buyer;
    }

    if (item.buyerDetails) {
      return item.buyerDetails;
    }

    return null;
  };

  return (
    <MainLayout>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
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
              variant="h5"
              sx={{ fontWeight: 700 }}
            >
              Sale Transactions
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Track your property sale transactions.
            </Typography>
          </Box>

          <Chip
            label={`${transactions.length} Total`}
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
          <Tab
            value="initiated"
            label={`Initiated (${counts.initiated})`}
          />
          <Tab
            value="agreement_signed"
            label={`Agreement (${counts.agreement_signed})`}
          />
          <Tab
            value="payment_pending"
            label={`Payment (${counts.payment_pending})`}
          />
          <Tab
            value="completed"
            label={`Completed (${counts.completed})`}
          />
        </Tabs>

       
        {loading && transactions.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {[1, 2, 3].map((item) => (
              <Box
                key={item}
                sx={{
                  width: {
                    xs: "100%",
                    md: "calc(50% - 12px)",
                  },
                }}
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              py: 8,
            }}
          >
            <Receipt
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography color="text.secondary">
              No transactions in this category.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 3,
            }}
          >
            {filtered.map((tx) => {
              const property = getProperty(tx);
              const buyer = getBuyer(tx);

              const progressPercent =
                tx.agreedPrice > 0
                  ? Math.min(
                      Math.max(
                        (tx.amountPaid / tx.agreedPrice) * 100,
                        0
                      ),
                      100
                    )
                  : 0;

              return (
                <Box
                  key={tx._id}
                  sx={{
                    width: {
                      xs: "100%",
                      md: "calc(50% - 12px)",
                    },
                    minWidth: 0,
                  }}
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
                          alignItems: "center",
                          gap: 1.5,
                          mb: 2,
                        }}
                      >
                        <Avatar
                          src={property?.images?.[0]?.image}
                          variant="rounded"
                          sx={{ width: 44, height: 44 }}
                        >
                          <Home />
                        </Avatar>

                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle2"
                            noWrap
                            sx={{ fontWeight: 700 }}
                          >
                            {property?.title ?? "Property"}
                          </Typography>

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {property
                              ? `${property.propertyType} • ${property.purpose}`
                              : "—"}
                          </Typography>
                        </Box>

                        <Chip
                          label={formatStatus(tx.transactionStatus)}
                          color={
                            TX_STATUS_COLORS[
                              tx.transactionStatus
                            ] ?? "default"
                          }
                          size="small"
                        />
                      </Box>

                     
                      {buyer && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            p: 1,
                            bgcolor: "action.hover",
                            borderRadius: 1,
                            mb: 1.5,
                          }}
                        >
                          <Avatar
                            src={buyer.image}
                            sx={{ width: 28, height: 28 }}
                          >
                            {buyer.name?.charAt(0)}
                          </Avatar>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              variant="caption"
                              sx={{ fontWeight: 600 }}
                            >
                              {buyer.name}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ display: "block" }}
                            >
                              {buyer.email}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      
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
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Agreed Price
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 700 }}
                          >
                            {formatCurrency(tx.agreedPrice)}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 2,
                          }}
                        >
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Amount Paid
                          </Typography>

                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ fontWeight: 700 }}
                          >
                            {formatCurrency(tx.amountPaid)}
                          </Typography>
                        </Box>

                        <Box>
                          <LinearProgress
                            variant="determinate"
                            value={progressPercent}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                            }}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mt: 0.5,
                            }}
                          >
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {progressPercent.toFixed(0)}%
                            </Typography>

                            <Chip
                              label={tx.paymentStatus}
                              color={
                                PAYMENT_STATUS_COLORS[
                                  tx.paymentStatus
                                ] ?? "default"
                              }
                              size="small"
                            />
                          </Box>
                        </Box>
                      </Box>

                      {tx.notes && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{
                            mt: 1,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {tx.notes}
                        </Typography>
                      )}

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: "block",
                          mt: 1,
                        }}
                      >
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>

                    <Divider />

                    <CardActions
                      sx={{ justifyContent: "flex-end" }}
                    >
                      <Tooltip title="View details">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => void handleView(tx._id)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </CardActions>
                  </Card>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

     
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
          Transaction Details

          <IconButton
            onClick={closeView}
            size="small"
            aria-label="Close transaction details"
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !transaction ? (
            <Skeleton variant="rounded" height={240} />
          ) : transaction ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
             
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Property
                </Typography>

                <Typography
                  variant="body1"
                  sx={{ fontWeight: 700 }}
                >
                  {getProperty(transaction)?.title ?? "Property"}
                </Typography>
              </Box>

             
              {getBuyer(transaction) && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Buyer
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      mt: 1,
                      p: 1.5,
                      bgcolor: "action.hover",
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      src={getBuyer(transaction)?.image}
                      sx={{ width: 40, height: 40 }}
                    >
                      {getBuyer(transaction)?.name?.charAt(0)}
                    </Avatar>

                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600 }}
                      >
                        {getBuyer(transaction)?.name}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {getBuyer(transaction)?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              )}

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 3,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Agreed Price
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700 }}
                  >
                    {formatCurrency(transaction.agreedPrice)}
                  </Typography>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Amount Paid
                  </Typography>

                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: 700 }}
                  >
                    {formatCurrency(transaction.amountPaid)}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Transaction
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={formatStatus(
                        transaction.transactionStatus
                      )}
                      color={
                        TX_STATUS_COLORS[
                          transaction.transactionStatus
                        ] ?? "default"
                      }
                      size="small"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Payment
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={transaction.paymentStatus}
                      color={
                        PAYMENT_STATUS_COLORS[
                          transaction.paymentStatus
                        ] ?? "default"
                      }
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              {transaction.agreementDate && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Agreement Signed
                  </Typography>

                  <Typography variant="body2">
                    {new Date(
                      transaction.agreementDate
                    ).toLocaleString()}
                  </Typography>
                </Box>
              )}

              {transaction.completedAt && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Completed At
                  </Typography>

                  <Typography variant="body2">
                    {new Date(
                      transaction.completedAt
                    ).toLocaleString()}
                  </Typography>
                </Box>
              )}

              {transaction.notes && (
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Notes
                  </Typography>

                  <Typography variant="body2">
                    {transaction.notes}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary">
              Transaction details could not be loaded.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeView}>Close</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default MySaleTransactions;