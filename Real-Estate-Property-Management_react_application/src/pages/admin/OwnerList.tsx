import React, { useEffect, useState } from "react";
import type { FormEvent } from "react";

import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Avatar,
} from "@mui/material";

import { Delete, CheckCircle, Block } from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";

import {
  getAllOwners,
  updateOwnerStatus,
  deleteOwner,
} from "../../features/owner/ownerSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { AccountStatus } from "../../typescript/type/owner.types";

const OwnerList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { owners, pagination, loading } = useAppSelector(
    (state) => state.owner,
  );

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // Fetch owners
  useEffect(() => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
    };

    dispatch(getAllOwners(params));
  }, [dispatch, page, rowsPerPage, statusFilter]);

  // Search
  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    setPage(0);

    if (page === 0) {
      const params = {
        page: 1,
        limit: rowsPerPage,
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      };

      dispatch(getAllOwners(params));
    }
  };

  const handleStatusChange = (id: string, status: AccountStatus): void => {
    dispatch(
      updateOwnerStatus({
        id,
        status,
      }),
    );
  };

  const handleDelete = (id: string): void => {
    if (window.confirm("Are you sure you want to delete this owner?")) {
      dispatch(deleteOwner(id));
    }
  };

  const formatAddress = (owner: (typeof owners)[number]): string => {
    if (!owner.address) {
      return "N/A";
    }

    return (
      [
        owner.address.street,
        owner.address.city,
        owner.address.state,
        owner.address.country,
        owner.address.pincode,
      ]
        .filter(Boolean)
        .join(", ") || "N/A"
    );
  };

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 3,
          }}
        >
          Manage Owners
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <form onSubmit={handleSearch}>
            <TextField
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{
                minWidth: 280,
              }}
            />
          </form>

          <FormControl
            size="small"
            sx={{
              minWidth: 150,
            }}
          >
            <InputLabel>Status</InputLabel>

            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>

              <MenuItem value="active">Active</MenuItem>

              <MenuItem value="inactive">Inactive</MenuItem>

              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Loader message="Loading owners..." />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Image</TableCell>

                    <TableCell>Name</TableCell>

                    <TableCell>Email</TableCell>

                    <TableCell>Phone</TableCell>

                    <TableCell>Address</TableCell>

                    <TableCell>Status</TableCell>

                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {owners.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No owners found
                      </TableCell>
                    </TableRow>
                  ) : (
                    owners.map((owner) => (
                      <TableRow key={owner._id}>
                        <TableCell>
                          <Avatar
                            src={owner.image || undefined}
                            alt={owner.name}
                            sx={{
                              width: 45,
                              height: 45,
                            }}
                          >
                            {owner.name?.charAt(0).toUpperCase()}
                          </Avatar>
                        </TableCell>

                        <TableCell>{owner.name}</TableCell>

                        <TableCell>{owner.email}</TableCell>

                        <TableCell>{owner.phone}</TableCell>

                        <TableCell>{formatAddress(owner)}</TableCell>

                        <TableCell>
                          <Chip
                            label={owner.status}
                            color={
                              owner.status === "active"
                                ? "success"
                                : owner.status === "blocked"
                                  ? "error"
                                  : "default"
                            }
                            size="small"
                          />
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="success"
                            onClick={() =>
                              handleStatusChange(owner._id, "active")
                            }
                            title="Activate owner"
                          >
                            <CheckCircle />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() =>
                              handleStatusChange(owner._id, "inactive")
                            }
                            title="Deactivate owner"
                          >
                            <Block />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(owner._id)}
                            title="Delete owner"
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={pagination?.totalOwners || 0}
              page={page}
              onPageChange={(_event, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(event) => {
                setRowsPerPage(parseInt(event.target.value, 10));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>
    </MainLayout>
  );
};

export default OwnerList;
