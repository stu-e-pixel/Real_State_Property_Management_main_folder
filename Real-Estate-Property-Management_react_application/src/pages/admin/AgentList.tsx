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
  getAllAgents,
  updateAgentStatus,
  deleteAgent,
  clearSelectedAgent,
} from "../../features/agent/agentSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { AccountStatus } from "../../typescript/type/agent.types";

const AgentList: React.FC = () => {
  const dispatch = useAppDispatch();

  const { agents, pagination, loading } = useAppSelector(
    (state) => state.agent,
  );

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const [search, setSearch] = useState<string>("");

  const [statusFilter, setStatusFilter] = useState<string>("");

  const [selectedAgent, setSelectedAgent] = useState<
    (typeof agents)[number] | null
  >(null);

  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);

  useEffect(() => {
    const params = {
      page: page + 1,
      limit: rowsPerPage,
      ...(search && { search }),
      ...(statusFilter && {
        status: statusFilter,
      }),
    };

    dispatch(getAllAgents(params));

    return () => {
      dispatch(clearSelectedAgent());
    };
  }, [dispatch, page, rowsPerPage, statusFilter]);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    setPage(0);

    if (page === 0) {
      const params = {
        page: 1,
        limit: rowsPerPage,
        ...(search && { search }),
        ...(statusFilter && {
          status: statusFilter,
        }),
      };

      dispatch(getAllAgents(params));
    }
  };

  const handleViewAgent = (agent: (typeof agents)[number]): void => {
    setSelectedAgent(agent);
    setViewDialogOpen(true);
  };

  const handleCloseDialog = (): void => {
    setViewDialogOpen(false);
    setSelectedAgent(null);
  };

  const handleStatusChange = (id: string, status: AccountStatus): void => {
    dispatch(
      updateAgentStatus({
        id,
        status,
      }),
    );
  };

  const handleDelete = (id: string): void => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      dispatch(deleteAgent(id));
    }
  };

  const formatAddress = (
    address: (typeof agents)[number]["address"],
  ): string => {
    if (!address) {
      return "N/A";
    }

    return (
      [
        address.street,
        address.city,
        address.state,
        address.country,
        address.pincode,
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
          Manage Agents
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
          <Loader message="Loading agents..." />
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

                    <TableCell>Agency</TableCell>

                    <TableCell>Experience</TableCell>

                    <TableCell>Status</TableCell>

                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {agents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No agents found
                      </TableCell>
                    </TableRow>
                  ) : (
                    agents.map((agent) => (
                      <TableRow key={agent._id}>
                        <TableCell>
                          <Avatar
                            src={agent.image || undefined}
                            alt={agent.name}
                            sx={{
                              width: 45,
                              height: 45,
                            }}
                          >
                            {agent.name?.charAt(0).toUpperCase()}
                          </Avatar>
                        </TableCell>

                        <TableCell>{agent.name}</TableCell>

                        <TableCell>{agent.email}</TableCell>

                        <TableCell>{agent.phone}</TableCell>

                        <TableCell>{agent.agencyName || "N/A"}</TableCell>

                        <TableCell>{agent.experience} years</TableCell>

                        <TableCell>
                          <Chip
                            label={agent.status}
                            color={
                              agent.status === "active"
                                ? "success"
                                : agent.status === "blocked"
                                  ? "error"
                                  : "default"
                            }
                            size="small"
                          />
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleViewAgent(agent)}
                            title="View agent"
                          >
                            <Visibility />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="success"
                            onClick={() =>
                              handleStatusChange(agent._id, "active")
                            }
                            title="Activate agent"
                          >
                            <CheckCircle />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="warning"
                            onClick={() =>
                              handleStatusChange(agent._id, "inactive")
                            }
                            title="Deactivate agent"
                          >
                            <Block />
                          </IconButton>

                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(agent._id)}
                            title="Delete agent"
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
              count={pagination?.totalAgents || 0}
              page={page}
              onPageChange={(_event, newPage) => {
                setPage(newPage);
              }}
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

      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Agent Details
          </Typography>

          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {selectedAgent && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  mb: 3,
                }}
              >
                <Avatar
                  src={selectedAgent.image || undefined}
                  alt={selectedAgent.name}
                  sx={{
                    width: 100,
                    height: 100,
                    fontSize: 36,
                  }}
                >
                  {selectedAgent.name?.charAt(0).toUpperCase()}
                </Avatar>

                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {selectedAgent.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                      mt: 0.5,
                    }}
                  >
                    {selectedAgent.email}
                  </Typography>

                  <Chip
                    label={selectedAgent.status}
                    size="small"
                    sx={{ mt: 1 }}
                    color={
                      selectedAgent.status === "active"
                        ? "success"
                        : selectedAgent.status === "blocked"
                          ? "error"
                          : "default"
                    }
                  />
                </Box>
              </Box>

              <Divider sx={{ mb: 3 }} />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Personal Information
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  mb: 3,
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Agent ID
                  </Typography>

                  <Typography>{selectedAgent._id}</Typography>
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
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Phone
                  </Typography>

                  <Typography>{selectedAgent.phone}</Typography>
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
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    License Number
                  </Typography>

                  <Typography>
                    {selectedAgent.licenseNumber || "N/A"}
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
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Agency
                  </Typography>

                  <Typography>{selectedAgent.agencyName || "N/A"}</Typography>
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
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Experience
                  </Typography>

                  <Typography>{selectedAgent.experience} years</Typography>
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
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Role
                  </Typography>

                  <Typography>{selectedAgent.role || "agent"}</Typography>
                </Box>
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Specialization
              </Typography>

              <Box sx={{ mb: 3 }}>
                {selectedAgent.specialization &&
                selectedAgent.specialization.length > 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 1,
                    }}
                  >
                    {selectedAgent.specialization.map((item) => (
                      <Chip
                        key={item}
                        label={item}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    No specialization provided
                  </Typography>
                )}
              </Box>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Bio
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 3,
                }}
              >
                {selectedAgent.bio || "No bio provided"}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Address
              </Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  mb: 3,
                }}
              >
                {formatAddress(selectedAgent.address)}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Account Information
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      sm: "calc(50% - 8px)",
                    },
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Email Verification
                  </Typography>

                  <Chip
                    label={
                      selectedAgent.isEmailVerified
                        ? "Verified"
                        : "Not Verified"
                    }
                    size="small"
                    color={
                      selectedAgent.isEmailVerified ? "success" : "warning"
                    }
                  />
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
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Deleted
                  </Typography>

                  <Chip
                    label={selectedAgent.isDeleted ? "Yes" : "No"}
                    size="small"
                    color={selectedAgent.isDeleted ? "error" : "success"}
                  />
                </Box>

                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Created At
                  </Typography>

                  <Typography>
                    {selectedAgent.createdAt
                      ? new Date(selectedAgent.createdAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "text.secondary",
                    }}
                  >
                    Updated At
                  </Typography>

                  <Typography>
                    {selectedAgent.updatedAt
                      ? new Date(selectedAgent.updatedAt).toLocaleString()
                      : "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default AgentList;
