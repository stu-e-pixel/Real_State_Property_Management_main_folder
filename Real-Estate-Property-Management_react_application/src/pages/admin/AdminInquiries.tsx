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
  Box,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";

import { Search, Refresh } from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";

import { getAllInquiries } from "../../features/inquiry/inquirySlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { PopulatedUserLite } from "../../typescript/type/inquiry.types";

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

const isPopulatedProperty = (
  val: Property | string | undefined,
): val is Property => !!val && typeof val === "object" && "title" in val;

const isPopulatedUser = (
  val: PopulatedUserLite | string | null | undefined,
): val is PopulatedUserLite =>
  !!val && typeof val === "object" && "name" in val;

const AdminInquiries: React.FC = () => {
  const dispatch = useAppDispatch();

  const { inquiries, loading } = useAppSelector((state) => state.inquiry);

  const [search, setSearch] = useState<string>("");

  // ================= FETCH =================

  useEffect(() => {
    dispatch(getAllInquiries());
  }, [dispatch]);

  // ================= SEARCH =================

  const searchTerm = search.trim().toLowerCase();

  const filtered = inquiries.filter((i) => {
    if (!searchTerm) {
      return true;
    }

    return (
      i.name.toLowerCase().includes(searchTerm) ||
      i.email.toLowerCase().includes(searchTerm) ||
      i.message.toLowerCase().includes(searchTerm) ||
      (isPopulatedProperty(i.property) &&
        i.property.title.toLowerCase().includes(searchTerm)) ||
      (isPopulatedUser(i.agent) &&
        i.agent.name.toLowerCase().includes(searchTerm))
    );
  });

  // ================= REFRESH =================

  const handleRefresh = (): void => {
    dispatch(getAllInquiries());
  };

  return (
    <MainLayout>
      <Paper
        sx={{
          p: {
            xs: 2,
            sm: 3,
            md: 4,
          },
          borderRadius: 3,
        }}
      >
        {/* ================= HEADER ================= */}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            gap: 2,
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
              All Inquiries
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
              }}
            >
              Monitor customer inquiries across the platform
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

        {/* ================= SEARCH AND REFRESH ================= */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 3,
          }}
        >
          <TextField
            placeholder="Search by name, email, message, property..."
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

          <IconButton
            color="primary"
            onClick={handleRefresh}
            disabled={loading}
            aria-label="Refresh inquiries"
          >
            <Refresh />
          </IconButton>
        </Box>

        {/* ================= CONTENT ================= */}

        {loading && inquiries.length === 0 ? (
          <Loader message="Loading inquiries..." />
        ) : filtered.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              No inquiries found.
            </Typography>
          </Box>
        ) : (
          <TableContainer
            sx={{
              width: "100%",
              overflowX: "auto",
            }}
          >
            <Table
              sx={{
                minWidth: 850,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Property</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Message</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filtered.map((i) => (
                  <TableRow key={i._id} hover>
                    {/* Customer */}

                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                          minWidth: 120,
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 600,
                          }}
                        >
                          {i.name}
                        </Typography>

                        <Typography
                          variant="caption"
                          sx={{
                            color: "text.secondary",
                          }}
                        >
                          {i.email}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Property */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          maxWidth: 180,
                        }}
                      >
                        {isPopulatedProperty(i.property)
                          ? i.property.title
                          : "—"}
                      </Typography>
                    </TableCell>

                    {/* Agent */}

                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{
                          maxWidth: 150,
                        }}
                      >
                        {isPopulatedUser(i.agent) ? i.agent.name : "—"}
                      </Typography>
                    </TableCell>

                    {/* Message */}

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

                    {/* Status */}

                    <TableCell>
                      <Chip
                        label={i.status}
                        color={STATUS_COLORS[i.status] ?? "default"}
                        size="small"
                      />
                    </TableCell>

                    {/* Date */}

                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{
                          whiteSpace: "nowrap",
                        }}
                      >
                        {new Date(i.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </MainLayout>
  );
};

export default AdminInquiries;
