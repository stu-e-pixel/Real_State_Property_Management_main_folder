
import React, { useEffect } from "react";

import MainLayout from "../../components/layout/MainLayout";
import ProfileView from "./ProfileView";

import { updateOwnerProfileSchema } from "../../utils/validations";

import {
  getOwnerProfile,
  updateOwnerProfile,
  clearOwnerProfile,
} from "../../features/owner/ownerSlice";

import { useAppDispatch, useAppSelector } from "../../hooks/useAppDispatch";

import type { Owner } from "../../typescript/type/owner.types";

import {
  Email,
  Phone,
  LocationOn,
} from "@mui/icons-material";

const OwnerProfile: React.FC = () => {
  const dispatch = useAppDispatch();

 

  const { profile, loading } = useAppSelector(
    (state) => state.owner,
  );

 

  useEffect(() => {
    dispatch(getOwnerProfile());

    return () => {
      dispatch(clearOwnerProfile());
    };
  }, [dispatch]);

 

  const handleSubmit = (
  data: Owner,
  imageFile: File | null,
): void => {
  dispatch(
    updateOwnerProfile({
      name: data.name,
      phone: data.phone,
      address: JSON.stringify(data.address),
      image: imageFile ? [imageFile] : undefined,
    }),
  );
};

  

  return (
    <MainLayout>
      <ProfileView<Owner>
        profile={profile}
        loading={loading}
        roleLabel="Owner"
        validationSchema={updateOwnerProfileSchema}
        onSubmit={handleSubmit}
        editableFields={[
          {
            name: "name",
            label: "Full Name",
          },
          {
            name: "phone",
            label: "Phone Number",
          },
          {
            name: "address",
            label: "Address",
          },
        ]}
        readOnlyFields={[
          {
            name: "email",
            label: "Email",
            icon: (
              <Email
                fontSize="small"
                color="action"
              />
            ),
          },
          {
            name: "phone",
            label: "Phone",
            icon: (
              <Phone
                fontSize="small"
                color="action"
              />
            ),
          },
          {
            name: "address",
            label: "Address",
            icon: (
              <LocationOn
                fontSize="small"
                color="action"
              />
            ),
          },
        ]}
      />
    </MainLayout>
  );
};

export default OwnerProfile;