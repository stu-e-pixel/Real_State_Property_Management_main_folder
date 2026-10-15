
import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Paper, Typography, Button } from "@mui/material";
import { ArrowBack, ErrorOutlined } from "@mui/icons-material";

import MainLayout from "../../components/layout/MainLayout";
import Loader from "../../components/common/Loader";
import PropertyForm from "./PropertyForm";

import {
  getPropertyById,
  clearSelectedProperty,
} from "../../features/property/propertySlice";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/useAppDispatch";

const PropertyEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { property, loading, error } = useAppSelector(
    (state) => state.property
  );

 
  useEffect(() => {
    if (id) {
      dispatch(getPropertyById(id));
    }

    return () => {
      dispatch(clearSelectedProperty());
    };
  }, [dispatch, id]);

  
  if (loading && !property) {
    return (
      <MainLayout>
        <Loader message="Loading property..." />
      </MainLayout>
    );
  }

  
  if (error || !property) {
    return (
      <MainLayout>
        <Paper
          sx={{
            p: 6,
            borderRadius: 3,
            textAlign: "center",
          }}
        >
          <ErrorOutlined
            sx={{
              fontSize: 64,
              color: "error.main",
              mb: 2,
            }}
          />

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mb: 1,
            }}
          >
            Property Not Found
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              mb: 3,
            }}
          >
            {error ||
              "The property you're trying to edit doesn't exist."}
          </Typography>

          <Button
            variant="contained"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/owner/properties")}
          >
            Back to Properties
          </Button>
        </Paper>
      </MainLayout>
    );
  }

 
  return (
    <PropertyForm
      mode="update"
      initialData={property}
    />
  );
};

export default PropertyEdit;
