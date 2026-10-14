import { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Box,
  Divider,
  TextField,
  InputAdornment,
  Avatar,
  Tabs,
  Tab,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import {
  Search,
  Refresh,
  Visibility,
  Close,
  Home,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import {
  getAllSaleTransactionsAdmin,
  getSaleTransactionById,
  clearSelectedTransaction,
} from "../../features/saleTransaction/saleTransactionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type { SaleTransaction } from "../../typescript/type/saleTransaction.types";
import type { Property } from "../../typescript/type/property.types";
import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";

// =====================================================
// CONFIG
// =====================================================

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
  unpaid: "warning",
  partial: "info",
  paid: "success",
  pending: "warning",
  failed: "error",
};

const formatCurrency = (amount: number): string =>
  `₹${(amount ?? 0).toLocaleString()}`;

const formatStatus = (status: string): string =>
  status.replace(/_/g, " ");

// =====================================================
// TYPE GUARDS
// =====================================================

const isPopulatedProperty = (
  value: Property | string | undefined
): value is Property =>
  !!value && typeof value === "object" && "title" in value;

const isPopulatedUser = (
  value: PopulatedUserLite | string | null | undefined
): value is PopulatedUserLite =>
  !!value && typeof value === "object" && "name" in value;

// =====================================================
// PAGE
// =====================================================

const AdminSaleTransactions = () => {
  const dispatch = useAppDispatch();

  const { transactions, transaction, loading } = useAppSelector(
    (state) => state.saleTransaction
  );

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("all");
  const [viewOpen, setViewOpen] = useState(false);

  // =====================================================
  // FETCH
  // =====================================================

  useEffect(() => {
    dispatch(getAllSaleTransactionsAdmin());

    return () => {
      dispatch(clearSelectedTransaction());
    };
  }, [dispatch]);

  const handleRefresh = (): void => {
    dispatch(getAllSaleTransactionsAdmin());
  };

  // =====================================================
  // VIEW
  // =====================================================

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

  // =====================================================
  // HELPERS
  // =====================================================

  const getProperty = (tx: SaleTransaction): Property | null => {
    if (isPopulatedProperty(tx.property)) {
      return tx.property;
    }

    return tx.propertyDetails ?? null;
  };

  const getBuyer = (tx: SaleTransaction): PopulatedUserLite | null => {
    if (isPopulatedUser(tx.buyer)) {
      return tx.buyer;
    }

    return tx.buyerDetails ?? null;
  };

  const getOwner = (tx: SaleTransaction): PopulatedUserLite | null => {
    if (isPopulatedUser(tx.owner)) {
      return tx.owner;
    }

    return tx.ownerDetails ?? null;
  };

  const getAgent = (tx: SaleTransaction): PopulatedUserLite | null => {
    if (isPopulatedUser(tx.agent)) {
      return tx.agent;
    }

    return tx.agentDetails ?? null;
  };

  // =====================================================
  // FILTER
  // =====================================================

  const searchTerm = search.trim().toLowerCase();

  const tabFiltered =
    tab === "all"
      ? transactions
      : transactions.filter(
          (tx) => tx.transactionStatus === tab
        );

  const filtered = tabFiltered.filter((tx) => {
    if (!searchTerm) return true;

    const property = getProperty(tx);
    const buyer = getBuyer(tx);
    const owner = getOwner(tx);
    const agent = getAgent(tx);

    return (
      (property?.title ?? "").toLowerCase().includes(searchTerm) ||
      (buyer?.name ?? "").toLowerCase().includes(searchTerm) ||
      (buyer?.email ?? "").toLowerCase().includes(searchTerm) ||
      (owner?.name ?? "").toLowerCase().includes(searchTerm) ||
      (owner?.email ?? "").toLowerCase().includes(searchTerm) ||
      (agent?.name ?? "").toLowerCase().includes(searchTerm) ||
      tx.paymentStatus.toLowerCase().includes(searchTerm) ||
      tx.transactionStatus.toLowerCase().includes(searchTerm)
    );
  });

  // =====================================================
  // COUNTS
  // =====================================================

  const counts = {
    all: transactions.length,
    initiated: transactions.filter(
      (tx) => tx.transactionStatus === "initiated"
    ).length,
    agreement_signed: transactions.filter(
      (tx) => tx.transactionStatus === "agreement_signed"
    ).length,
    payment_pending: transactions.filter(
      (tx) => tx.transactionStatus === "payment_pending"
    ).length,
    completed: transactions.filter(
      (tx) => tx.transactionStatus === "completed"
    ).length,
    cancelled: transactions.filter(
      (tx) => tx.transactionStatus === "cancelled"
    ).length,
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <MainLayout>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
        }}
      >
        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              All Sale Transactions
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Every sale transaction across the platform
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Chip
              label={`${counts.all} Total`}
              color="primary"
              variant="outlined"
            />

            <Chip
              label={`${counts.completed} Completed`}
              color="success"
              variant="outlined"
            />

            <Chip
              label={`${counts.payment_pending} Pending`}
              color="warning"
              variant="outlined"
            />
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* TABS */}

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
          <Tab
            value="cancelled"
            label={`Cancelled (${counts.cancelled})`}
          />
        </Tabs>

        {/* SEARCH AND REFRESH */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search by property, buyer, owner, agent, status..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            size="small"
            fullWidth
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Tooltip title="Refresh transactions">
            <span>
              <IconButton
                color="primary"
                onClick={handleRefresh}
                disabled={loading}
              >
                <Refresh />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* CONTENT */}

        {loading && transactions.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {[1, 2, 3, 4].map((item) => (
              <Skeleton
                key={item}
                variant="rounded"
                height={70}
                sx={{ borderRadius: 2 }}
              />
            ))}
          </Box>
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <Typography color="text.secondary">
              No transactions found.
            </Typography>
          </Box>
        ) : (
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table sx={{ minWidth: 1200 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Buyer</TableCell>
                  <TableCell>Owner</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Agreed Price</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((tx) => {
                  const property = getProperty(tx);
                  const buyer = getBuyer(tx);
                  const owner = getOwner(tx);
                  const agent = getAgent(tx);

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
                    <TableRow key={tx._id} hover>
                      {/* PROPERTY */}

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            minWidth: 140,
                          }}
                        >
                          {property?.images?.[0]?.image && (
                            <Avatar
                              src={property.images[0].image}
                              variant="rounded"
                              sx={{ width: 32, height: 32 }}
                            />
                          )}

                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 160 }}
                          >
                            {property?.title ?? "—"}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* BUYER */}

                      <TableCell>
                        {buyer ? (
                          <Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {buyer.name}
                            </Typography>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {buyer.email}
                            </Typography>
                          </Box>
                        ) : (
                          "—"
                        )}
                      </TableCell>

                      {/* OWNER */}

                      <TableCell>
                        <Typography variant="body2" noWrap>
                          {owner?.name ?? "—"}
                        </Typography>
                      </TableCell>

                      {/* AGENT */}

                      <TableCell>
                        {agent ? (
                          <Chip
                            label={agent.name}
                            size="small"
                            color="info"
                            variant="outlined"
                          />
                        ) : (
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Direct (no agent)
                          </Typography>
                        )}
                      </TableCell>

                      {/* AGREED PRICE */}

                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 700 }}
                        >
                          {formatCurrency(tx.agreedPrice)}
                        </Typography>
                      </TableCell>

                      {/* PAYMENT */}

                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                            minWidth: 90,
                          }}
                        >
                          <Chip
                            label={formatStatus(tx.paymentStatus)}
                            color={
                              PAYMENT_STATUS_COLORS[tx.paymentStatus] ??
                              "default"
                            }
                            size="small"
                          />

                          <LinearProgress
                            variant="determinate"
                            value={progressPercent}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                            }}
                          />

                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatCurrency(tx.amountPaid)} paid
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* TRANSACTION STATUS */}

                      <TableCell>
                        <Chip
                          label={formatStatus(tx.transactionStatus)}
                          color={
                            TX_STATUS_COLORS[tx.transactionStatus] ??
                            "default"
                          }
                          size="small"
                        />
                      </TableCell>

                      {/* ACTIONS */}

                      <TableCell align="center">
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleView(tx._id)}
                            disabled={loading}
                          >
                            <Visibility fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* VIEW DIALOG */}

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
          Transaction Details

          <IconButton onClick={closeView} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !transaction ? (
            <Skeleton variant="rounded" height={300} />
          ) : transaction ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              {/* PROPERTY */}

              <Box>
                <Typography variant="caption" color="text.secondary">
                  Property
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mt: 0.5,
                  }}
                >
                  <Avatar
                    src={getProperty(transaction)?.images?.[0]?.image}
                    variant="rounded"
                    sx={{ width: 48, height: 48 }}
                  >
                    <Home />
                  </Avatar>

                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 700 }}
                    >
                      {getProperty(transaction)?.title ?? "Property"}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {getProperty(transaction)?.propertyType ?? "—"} •{" "}
                      {getProperty(transaction)?.purpose ?? "—"}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider />

              {/* PARTICIPANTS */}

              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                {getBuyer(transaction) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Buyer
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Avatar
                        src={getBuyer(transaction)?.image}
                        sx={{ width: 32, height: 32 }}
                      >
                        {getBuyer(transaction)?.name?.charAt(0)}
                      </Avatar>

                      <Box>
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

                {getOwner(transaction) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Owner
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Avatar
                        src={getOwner(transaction)?.image}
                        sx={{ width: 32, height: 32 }}
                      >
                        {getOwner(transaction)?.name?.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                        >
                          {getOwner(transaction)?.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {getOwner(transaction)?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}

                {getAgent(transaction) && (
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Agent
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Avatar
                        src={getAgent(transaction)?.image}
                        sx={{ width: 32, height: 32 }}
                      >
                        {getAgent(transaction)?.name?.charAt(0)}
                      </Avatar>

                      <Box>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600 }}
                        >
                          {getAgent(transaction)?.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {getAgent(transaction)?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>

              <Divider />

              {/* PAYMENT DETAILS */}

              <Box
                sx={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Agreed Price
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {formatCurrency(transaction.agreedPrice)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
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

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Remaining Amount
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {formatCurrency(
                      Math.max(
                        transaction.agreedPrice - transaction.amountPaid,
                        0
                      )
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* STATUSES */}

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Transaction
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={formatStatus(transaction.transactionStatus)}
                      color={
                        TX_STATUS_COLORS[transaction.transactionStatus] ??
                        "default"
                      }
                      size="small"
                    />
                  </Box>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Payment
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={formatStatus(transaction.paymentStatus)}
                      color={
                        PAYMENT_STATUS_COLORS[transaction.paymentStatus] ??
                        "default"
                      }
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              {/* NOTES */}

              {transaction.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
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
              No transaction details available.
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

export default AdminSaleTransactions;