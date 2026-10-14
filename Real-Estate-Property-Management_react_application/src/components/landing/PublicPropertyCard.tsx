import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Chip,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";

import {
  LocationOn,
  Bed,
  Bathtub,
  SquareFoot,
  ArrowForward,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import type { Property } from "../../typescript/type/property.types";

interface PublicPropertyCardProps {
  property: Property;
}

const PublicPropertyCard = ({
  property,
}: PublicPropertyCardProps) => {
  const navigate = useNavigate();

  const coordinates = property.location?.coordinates ?? [];

  const propertyPath = `/property/${property._id}`;

  const formattedPrice = Number(property.price).toLocaleString("en-IN");

  const formattedDate = property.createdAt
    ? new Date(property.createdAt).toLocaleDateString("en-IN")
    : "Date unavailable";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid #e2e8f0",
        boxShadow: "0 4px 18px rgba(15, 23, 42, 0.05)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
        },
      }}
    >
      {/* Property Image */}
      <Box sx={{ position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={
            property.images?.[0]?.image ||
            "https://placehold.co/600x400?text=No+Property+Image"
          }
          alt={property.title || "Property image"}
          onClick={() => navigate(propertyPath)}
          sx={{
            height: 220,
            width: "100%",
            objectFit: "cover",
            cursor: "pointer",
            transition: "transform 0.4s ease",
            "&:hover": {
              transform: "scale(1.04)",
            },
          }}
        />

        {/* Purpose Badge */}
        <Chip
          label={property.purpose || "Property"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            fontWeight: 700,
            fontSize: 12,
            color: "#ffffff",
            bgcolor:
              property.purpose === "Sale" ? "#0f766e" : "#2563eb",
          }}
        />

        {/* Property Type Badge */}
        <Chip
          label={property.propertyType || "Other"}
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
            maxWidth: "55%",
            fontWeight: 700,
            fontSize: 12,
            bgcolor: "rgba(255,255,255,0.96)",
            color: "#0f172a",
            "& .MuiChip-label": {
              overflow: "hidden",
              textOverflow: "ellipsis",
            },
          }}
        />
      </Box>

      {/* Property Content */}
      <CardContent
        sx={{
          flexGrow: 1,
          p: 2.5,
          "&:last-child": {
            pb: 2.5,
          },
        }}
      >
        <Typography
          component="h2"
          variant="h6"
          onClick={() => navigate(propertyPath)}
          sx={{
            fontSize: 18,
            fontWeight: 800,
            color: "#0f172a",
            cursor: "pointer",
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            "&:hover": {
              color: "#0f766e",
            },
          }}
        >
          {property.title || "Untitled Property"}
        </Typography>

        {/* Location */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            mb: 2,
            color: "text.secondary",
            minWidth: 0,
          }}
        >
          <LocationOn
            fontSize="small"
            sx={{ color: "#0f766e", flexShrink: 0 }}
          />

          <Typography
            component="p"
            variant="caption"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {coordinates.length >= 2 &&
            typeof coordinates[0] === "number" &&
            typeof coordinates[1] === "number"
              ? `${coordinates[1].toFixed(3)}, ${coordinates[0].toFixed(3)}`
              : "Location unavailable"}
          </Typography>
        </Box>

        {/* Price */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            mb: 2,
          }}
        >
          

          <Typography
            component="p"
            variant="h5"
            sx={{
              fontSize: { xs: 20, sm: 22 },
              fontWeight: 800,
              color: "#0f766e",
              overflowWrap: "anywhere",
            }}
          >
            ₹{formattedPrice}
          </Typography>
        </Box>

        {/* Property Features */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
            }}
          >
            <Bed fontSize="small" />

            <Typography component="span" variant="caption">
              {property.bedrooms ?? 0} Beds
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
            }}
          >
            <Bathtub fontSize="small" />

            <Typography component="span" variant="caption">
              {property.bathrooms ?? 0} Baths
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "text.secondary",
            }}
          >
            <SquareFoot fontSize="small" />

            <Typography component="span" variant="caption">
              {property.area ?? 0} sqft
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider sx={{ borderColor: "#e2e8f0" }} />

      {/* Card Footer */}
      <CardActions
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Typography
          component="span"
          variant="caption"
          sx={{ color: "text.secondary" }}
        >
          {formattedDate}
        </Typography>

        <Button
          size="small"
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={() => navigate(propertyPath)}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            px: 1.75,
            py: 0.9,
            bgcolor: "#0f766e",
            color: "#ffffff",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#115e59",
              boxShadow: "none",
            },
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default PublicPropertyCard;