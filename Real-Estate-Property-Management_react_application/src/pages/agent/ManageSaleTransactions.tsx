import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
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
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import {
  Receipt,
  Close,
  Home,
  Visibility,
  Edit,
  MoreVert,
} from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import MainLayout from "../../components/layout/MainLayout";
import FormInput from "../../components/common/FormInput";
import { updateTransactionSchema } from "../../utils/validations";
import {
  getMySaleTransactions,
  getSaleTransactionById,
  updateSaleTransaction,
  clearSelectedTransaction,
} from "../../features/saleTransaction/saleTransactionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";
import type {
  SaleTransaction,
  UpdateTransactionFormValues,
} from "../../typescript/type/saleTransaction.types";
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
  unpaid: "warning",
  partial: "info",
  paid: "success",
  pending: "warning",
  failed: "error",
};

const isPopulatedProperty = (
  value: Property | string | undefined,
): value is Property =>
  !!value && typeof value === "object" && "title" in value;

const isPopulatedUser = (
  value: PopulatedUserLite | string | null | undefined,
): value is PopulatedUserLite =>
  !!value && typeof value === "object" && "name" in value;

const formatCurrency = (amount: number): string =>
  `₹${amount.toLocaleString()}`;

const formatStatus = (status: string): string => status.replace(/_/g, " ");

const ManageSaleTransactions: React.FC = () => {
  const dispatch = useAppDispatch();

  const { transactions, transaction, loading } = useAppSelector(
    (state) => state.saleTransaction,
  );

  const [tab, setTab] = useState<string>("all");
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] = useState<SaleTransaction | null>(null);

  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuTx, setMenuTx] = useState<SaleTransaction | null>(null);

  const editForm = useForm<UpdateTransactionFormValues>({
    resolver: yupResolver(updateTransactionSchema),
    defaultValues: {
      transactionStatus: "initiated",
      paymentStatus: "unpaid",
      amountPaid: 0,
      notes: "",
    },
  });

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

  const openEdit = (tx: SaleTransaction): void => {
    setEditTarget(tx);

    editForm.reset({
      transactionStatus: tx.transactionStatus,
      paymentStatus: tx.paymentStatus,
      amountPaid: tx.amountPaid,
      notes: tx.notes ?? "",
    });

    setEditOpen(true);
  };

  const closeEdit = (): void => {
    setEditOpen(false);
    setEditTarget(null);
    editForm.reset();
  };

  const submitEdit = async (
    data: UpdateTransactionFormValues,
  ): Promise<void> => {
    if (!editTarget) return;

    const result = await dispatch(
      updateSaleTransaction({
        id: editTarget._id,
        transactionStatus: data.transactionStatus,
        paymentStatus: data.paymentStatus,
        amountPaid: Number(data.amountPaid),
        notes: data.notes,
      }),
    );

    if (updateSaleTransaction.fulfilled.match(result)) {
      closeEdit();
    }
  };

  const openMenu = (
    event: MouseEvent<HTMLElement>,
    tx: SaleTransaction,
  ): void => {
    setMenuAnchor(event.currentTarget);
    setMenuTx(tx);
  };

  const closeMenu = (): void => {
    setMenuAnchor(null);
    setMenuTx(null);
  };

  const handleEditFromMenu = (): void => {
    if (menuTx) {
      openEdit(menuTx);
    }

    closeMenu();
  };

  const filtered =
    tab === "all"
      ? transactions
      : transactions.filter((tx) => tx.transactionStatus === tab);

  const counts = {
    all: transactions.length,
    initiated: transactions.filter((tx) => tx.transactionStatus === "initiated")
      .length,
    agreement_signed: transactions.filter(
      (tx) => tx.transactionStatus === "agreement_signed",
    ).length,
    payment_pending: transactions.filter(
      (tx) => tx.transactionStatus === "payment_pending",
    ).length,
    completed: transactions.filter((tx) => tx.transactionStatus === "completed")
      .length,
  };

  const getProperty = (tx: SaleTransaction): Property | null => {
    if (isPopulatedProperty(tx.property)) return tx.property;
    if (tx.propertyDetails) return tx.propertyDetails;
    return null;
  };

  const getBuyer = (tx: SaleTransaction): PopulatedUserLite | null => {
    if (isPopulatedUser(tx.buyer)) return tx.buyer;
    if (tx.buyerDetails) return tx.buyerDetails;
    return null;
  };

  const isEditable = (status: string): boolean =>
    !["completed", "cancelled"].includes(status);

  return (
    <MainLayout>
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 3,
        }}
      >
        {/* Header */}
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
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Sale Transactions
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage active sale transactions.
            </Typography>
          </Box>

          <Chip
            label={`${transactions.length} Total`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Transaction Filters */}
        <Tabs
          value={tab}
          onChange={(_event, value: string) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ mb: 3 }}
        >
          <Tab value="all" label={`All (${counts.all})`} />
          <Tab value="initiated" label={`Initiated (${counts.initiated})`} />
          <Tab
            value="agreement_signed"
            label={`Agreement (${counts.agreement_signed})`}
          />
          <Tab
            value="payment_pending"
            label={`Payment (${counts.payment_pending})`}
          />
          <Tab value="completed" label={`Completed (${counts.completed})`} />
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
                  height={300}
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
                      Math.max((tx.amountPaid / tx.agreedPrice) * 100, 0),
                      100,
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
                      {/* Property Header */}
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

                          <Typography variant="caption" color="text.secondary">
                            {property
                              ? `${property.propertyType} • ${property.purpose}`
                              : "—"}
                          </Typography>
                        </Box>

                        <Chip
                          label={formatStatus(tx.transactionStatus)}
                          color={
                            TX_STATUS_COLORS[tx.transactionStatus] ?? "default"
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
                          <Typography variant="caption" color="text.secondary">
                            Agreed
                          </Typography>

                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
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
                          <Typography variant="caption" color="text.secondary">
                            Paid
                          </Typography>

                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{ fontWeight: 700 }}
                          >
                            {formatCurrency(tx.amountPaid)}
                          </Typography>
                        </Box>

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
                            gap: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {progressPercent.toFixed(0)}%
                          </Typography>

                          <Chip
                            label={tx.paymentStatus}
                            color={
                              PAYMENT_STATUS_COLORS[tx.paymentStatus] ??
                              "default"
                            }
                            size="small"
                          />
                        </Box>
                      </Box>
                    </CardContent>

                    <Divider />

                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Tooltip title="View transaction">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => void handleView(tx._id)}
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      {isEditable(tx.transactionStatus) && (
                        <Tooltip title="Transaction actions">
                          <IconButton
                            size="small"
                            onClick={(event) => openMenu(event, tx)}
                          >
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </CardActions>
                  </Card>
                </Box>
              );
            })}
          </Box>
        )}
      </Paper>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem onClick={handleEditFromMenu}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          Update Transaction
        </MenuItem>
      </Menu>

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
                <Typography variant="caption" color="text.secondary">
                  Property
                </Typography>

                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  {getProperty(transaction)?.title ?? "Property"}
                </Typography>
              </Box>

              {getBuyer(transaction) && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
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
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {getBuyer(transaction)?.name}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
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
              </Box>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
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
                      label={transaction.paymentStatus}
                      color={
                        PAYMENT_STATUS_COLORS[transaction.paymentStatus] ??
                        "default"
                      }
                      size="small"
                    />
                  </Box>
                </Box>
              </Box>

              {transaction.notes && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Notes
                  </Typography>

                  <Typography variant="body2">{transaction.notes}</Typography>
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

      <Dialog
        open={editOpen}
        onClose={closeEdit}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: 3 },
          },
        }}
      >
        <DialogTitle>Update Transaction</DialogTitle>

        <Divider />

        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <form
              id="edit-transaction-form"
              onSubmit={editForm.handleSubmit(submitEdit)}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <FormInput<UpdateTransactionFormValues>
                  name="transactionStatus"
                  control={editForm.control}
                  label="Transaction Status"
                  select
                  options={[
                    { value: "initiated", label: "Initiated" },
                    {
                      value: "agreement_signed",
                      label: "Agreement Signed",
                    },
                    {
                      value: "payment_pending",
                      label: "Payment Pending",
                    },
                    { value: "completed", label: "Completed" },
                    { value: "cancelled", label: "Cancelled" },
                  ]}
                />

                <FormInput<UpdateTransactionFormValues>
                  name="paymentStatus"
                  control={editForm.control}
                  label="Payment Status"
                  select
                  options={[
                    { value: "unpaid", label: "Unpaid" },
                    { value: "partial", label: "Partial" },
                    { value: "paid", label: "Paid" },
                  ]}
                />

                <FormInput<UpdateTransactionFormValues>
                  name="amountPaid"
                  control={editForm.control}
                  label="Amount Paid"
                  type="number"
                />

                <FormInput<UpdateTransactionFormValues>
                  name="notes"
                  control={editForm.control}
                  label="Notes"
                  multiline
                  rows={3}
                />
              </Box>
            </form>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeEdit}>Cancel</Button>

          <Button
            variant="contained"
            type="submit"
            form="edit-transaction-form"
            disabled={editForm.formState.isSubmitting || loading}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default ManageSaleTransactions;
