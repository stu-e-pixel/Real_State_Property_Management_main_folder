import React, { useEffect, useState } from "react";
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
  Tooltip,
  Box,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";

import {
  Visibility,
  Delete,
  Edit,
  Close,
  Home,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import FormInput from "../../components/common/FormInput";

import {
  getMyInquiries,
  getInquiryById,
  deleteInquiry,
  updateInquiry,
  clearSelectedInquiry,
} from "../../features/inquiry/inquirySlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { inquirySchema } from "../../utils/validations";

import type {
  Inquiry,
  InquiryFormValues,
} from "../../typescript/type/inquiry.types";

import type { Property } from "../../typescript/type/property.types";

const STATUS_COLORS: Record<
  string,
  "default" | "info" | "success" | "warning"
> = {
  pending: "warning",
  contacted: "info",
  resolved: "success",
  closed: "default",
};

const isPopulated = (
  val: Property | string | undefined
): val is Property =>
  !!val &&
  typeof val === "object" &&
  "title" in val;

const MyInquiries: React.FC = () => {
  const dispatch = useAppDispatch();

  const {
    inquiries,
    inquiry,
    loading,
  } = useAppSelector((state) => state.inquiry);

  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [editTarget, setEditTarget] =
    useState<Inquiry | null>(null);

  const {
    control,
    handleSubmit,
    reset,
  } = useForm<InquiryFormValues>({
    resolver: yupResolver(inquirySchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // ================= FETCH =================

  useEffect(() => {
    dispatch(getMyInquiries());

    return () => {
      dispatch(clearSelectedInquiry());
    };
  }, [dispatch]);

  // ================= VIEW =================

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getInquiryById(id));
    setViewOpen(true);
  };

  const closeView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedInquiry());
  };

  // ================= EDIT =================

  const openEdit = (i: Inquiry): void => {
    setEditTarget(i);

    reset({
      name: i.name,
      email: i.email,
      phone: i.phone ?? "",
      message: i.message,
    });

    setEditOpen(true);
  };

  const closeEdit = (): void => {
    setEditOpen(false);
    setEditTarget(null);
  };

  const onSubmitEdit = async (
    data: InquiryFormValues
  ): Promise<void> => {
    if (!editTarget) {
      return;
    }

    const result = await dispatch(
      updateInquiry({
        id: editTarget._id,
        data,
      })
    );

    if (updateInquiry.fulfilled.match(result)) {
      setEditOpen(false);
      setEditTarget(null);
    }
  };

  // ================= DELETE =================

  const handleDelete = (id: string): void => {
    if (window.confirm("Delete this inquiry?")) {
      dispatch(deleteInquiry(id));
    }
  };

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* ================= HEADER ================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
              }}
            >
              My Inquiries
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Track the inquiries you've sent to property owners
            </Typography>
          </Box>

          <Chip
            label={`${inquiries.length} Total`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Divider
          sx={{
            mb: 3,
          }}
        />

        {/* ================= CONTENT ================= */}

        {loading && inquiries.length === 0 ? (
          <Loader message="Loading inquiries..." />
        ) : inquiries.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Home
              sx={{
                fontSize: 80,
                color: "text.disabled",
                mb: 2,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                color: "text.secondary",
                mb: 1,
              }}
            >
              No inquiries yet
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              When you inquire about a property, it will show up here.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Property</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Replied</TableCell>
                  <TableCell>Date</TableCell>

                  <TableCell
                    align="center"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {inquiries.map((i) => (
                  <TableRow
                    key={i._id}
                    hover
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                        }}
                      >
                        {isPopulated(i.property)
                          ? i.property.title
                          : "Property"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          maxWidth: 220,
                        }}
                      >
                        {i.message}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={i.status}
                        color={
                          STATUS_COLORS[i.status] ?? "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {i.reply ? (
                        <Chip
                          label="Yes"
                          color="success"
                          size="small"
                        />
                      ) : (
                        <Chip
                          label="No"
                          color="default"
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption">
                        {new Date(
                          i.createdAt
                        ).toLocaleDateString()}
                      </Typography>
                    </TableCell>

                    <TableCell
                      align="center"
                    >
                      <Tooltip title="View">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() =>
                            handleView(i._id)
                          }
                        >
                          <Visibility fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton
                          size="small"
                          color="warning"
                          onClick={() =>
                            openEdit(i)
                          }
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() =>
                            handleDelete(i._id)
                          }
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* =====================================================
          VIEW DIALOG
      ===================================================== */}

      <Dialog
        open={viewOpen}
        onClose={closeView}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: "1.25rem",
              fontWeight: 600,
            }}
          >
            Inquiry Details
          </Typography>

          <IconButton
            onClick={closeView}
            size="small"
            aria-label="Close inquiry details"
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && !inquiry ? (
            <Loader message="Loading..." />
          ) : inquiry ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {/* Property */}

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Property
                </Typography>

                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 700,
                  }}
                >
                  {isPopulated(inquiry.property)
                    ? inquiry.property.title
                    : "—"}
                </Typography>
              </Box>

              {/* Message */}

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Your Message
                </Typography>

                <Alert
                  severity="info"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  {inquiry.message}
                </Alert>
              </Box>

              {/* Status */}

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Status
                </Typography>

                <Box
                  sx={{
                    mt: 0.5,
                  }}
                >
                  <Chip
                    label={inquiry.status}
                    color={
                      STATUS_COLORS[inquiry.status] ??
                      "default"
                    }
                    size="small"
                  />
                </Box>
              </Box>

              {/* Reply */}

              {inquiry.reply && (
                <Box>
                  <Divider
                    sx={{
                      my: 1,
                    }}
                  />

                  <Typography
                    variant="caption"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Agent Reply
                  </Typography>

                  <Alert
                    severity="success"
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    {inquiry.reply}
                  </Alert>

                  {inquiry.repliedAt && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "text.secondary",
                        display: "block",
                        mt: 1,
                      }}
                    >
                      Replied on{" "}
                      {new Date(
                        inquiry.repliedAt
                      ).toLocaleString()}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          ) : (
            <Typography variant="body2">
              Not found.
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={closeView}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* =====================================================
          EDIT DIALOG
      ===================================================== */}

      <Dialog
        open={editOpen}
        onClose={closeEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
          }}
        >
          Edit Inquiry
        </DialogTitle>

        <Divider />

        <DialogContent>
          <Box
            component="form"
            id="edit-inquiry-form"
            onSubmit={handleSubmit(onSubmitEdit)}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              pt: 2,
            }}
          >
            <FormInput<InquiryFormValues>
              name="name"
              control={control}
              label="Name"
            />

            <FormInput<InquiryFormValues>
              name="email"
              control={control}
              label="Email"
              type="email"
            />

            <FormInput<InquiryFormValues>
              name="phone"
              control={control}
              label="Phone"
            />

            <FormInput<InquiryFormValues>
              name="message"
              control={control}
              label="Message"
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
            gap: 1,
          }}
        >
          <Button
            type="button"
            onClick={closeEdit}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-inquiry-form"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default MyInquiries;