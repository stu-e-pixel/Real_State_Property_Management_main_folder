/* eslint-disable react-hooks/exhaustive-deps */
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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

import {
  Delete,
  CheckCircle,
  Block,
  Visibility,
  Close,
} from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";

import {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
  clearSelectedUser,
} from "../../features/user/userSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { AccountStatus } from "../../typescript/type/user.types";

const UserList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { users, user, pagination, loading } = useAppSelector(
    (state) => state.user,
  );

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");
  const [viewOpen, setViewOpen] = useState<boolean>(false);

  useEffect(() => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      role: "customer",
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
      ...(verifiedFilter && {
        isEmailVerified: verifiedFilter,
      }),
    };

    dispatch(getAllUsers(params));

    return () => {
      dispatch(clearSelectedUser());
    };
  }, [dispatch, page, rowsPerPage, statusFilter, verifiedFilter]);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    setPage(0);

    const params = {
      page: 1,
      limit: rowsPerPage,
      role: "customer",
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
      ...(verifiedFilter && {
        isEmailVerified: verifiedFilter,
      }),
    };

    dispatch(getAllUsers(params));
  };

  const handleStatusChange = (id: string, status: AccountStatus): void => {
    dispatch(updateUserStatus({ id, status }));
  };

  const handleDelete = (id: string): void => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  const handleView = async (id: string): Promise<void> => {
    await dispatch(getUserById(id));
    setViewOpen(true);
  };

  const handleCloseView = (): void => {
    setViewOpen(false);
    dispatch(clearSelectedUser());
  };

  return (
    <MainLayout>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
            }}
          >
            Manage Customers
          </Typography>

          <Chip
            label={`Total: ${pagination?.totalUsers ?? 0}`}
            color="primary"
            variant="outlined"
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 2,
            mb: 3,
            flexWrap: "wrap",
          }}
        >
          <Box component="form" onSubmit={handleSearch}>
            <TextField
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{
                minWidth: 280,
              }}
            />
          </Box>

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

          <FormControl
            size="small"
            sx={{
              minWidth: 180,
            }}
          >
            <InputLabel>Email Verified</InputLabel>

            <Select
              value={verifiedFilter}
              onChange={(e) => setVerifiedFilter(e.target.value)}
              label="Email Verified"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Verified</MenuItem>
              <MenuItem value="false">Not Verified</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {loading ? (
          <Loader message="Loading users..." />
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Verified</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((u) => (
                      <TableRow key={u._id} hover>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                            }}
                          >
                            <Avatar
                              src={u.image || undefined}
                              sx={{
                                width: 36,
                                height: 36,
                              }}
                            >
                              {u.name?.charAt(0).toUpperCase()}
                            </Avatar>

                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 600,
                              }}
                            >
                              {u.name}
                            </Typography>
                          </Box>
                        </TableCell>

                        <TableCell>{u.email}</TableCell>

                        <TableCell>{u.phone}</TableCell>

                        <TableCell>
                          <Chip
                            label={u.isEmailVerified ? "Verified" : "Pending"}
                            color={u.isEmailVerified ? "info" : "default"}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={u.status}
                            color={
                              u.status === "active"
                                ? "success"
                                : u.status === "blocked"
                                  ? "error"
                                  : "default"
                            }
                            size="small"
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="View">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => handleView(u._id)}
                            >
                              <Visibility fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Activate">
                            <IconButton
                              size="small"
                              color="success"
                              onClick={() =>
                                handleStatusChange(u._id, "active")
                              }
                            >
                              <CheckCircle fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Deactivate">
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() =>
                                handleStatusChange(u._id, "inactive")
                              }
                            >
                              <Block fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(u._id)}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={pagination?.totalUsers ?? 0}
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

      <Dialog open={viewOpen} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          User Details
          <IconButton onClick={handleCloseView} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {user ? (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 0.5,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  mb: 1,
                }}
              >
                <Avatar
                  src={user.image || undefined}
                  sx={{
                    width: 100,
                    height: 100,
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Name
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {user.name}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Email
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {user.email}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Phone
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {user.phone}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Role
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  {user.role}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
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
                    label={user.status}
                    color={user.status === "active" ? "success" : "default"}
                    size="small"
                  />
                </Box>
              </Box>

              <Box
                sx={{
                  width: {
                    xs: "100%",
                    sm: "calc(50% - 8px)",
                  },
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  Email Verified
                </Typography>

                <Box
                  sx={{
                    mt: 0.5,
                  }}
                >
                  <Chip
                    label={user.isEmailVerified ? "Verified" : "Pending"}
                    color={user.isEmailVerified ? "info" : "default"}
                    size="small"
                  />
                </Box>
              </Box>
            </Box>
          ) : (
            <Loader message="Loading user..." />
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseView}>Close</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default UserList;
