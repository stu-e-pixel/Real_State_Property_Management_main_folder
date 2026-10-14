import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import ResetPassword from "../pages/auth/ResetPassword";
import ForgotPassword from "../pages/auth/ForgotPassword";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import AuthLayout from "../layout/AuthLayout";
import ProtectedRoute from "../components/common/ProtectedRoute";
import UserLayout from "../layout/customer/CustomerLayout";
import OwnerLayout from "../layout/owner/OwnerLayout";

import OwnerList from "../pages/admin/OwnerList";
import AgentLayout from "../layout/agent/AgentLayout";
import OwnerDashboard from "../pages/owner/OwnerDashboard";
import AgentDashboard from "../pages/agent/AgentDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AgentList from "../pages/admin/AgentList";
import AgentRegister from "../pages/agent/AgentRegister";
import OwnerRegister from "../pages/owner/OwnerRegister";
import AdminLayout from "../layout/admin/AdminLayout";
import AdminProfile from "../pages/admin/AdminProfile";
import UserList from "../pages/admin/UserList";
import AdminChangePassword from "../pages/admin/AdminChangePassword";
import PropertyForm from "../pages/owner/PropertyForm";
import PropertyList from "../pages/owner/PropertyList";
import OwnerProfile from "../pages/owner/OwnerProfile";
import PropertyEdit from "../pages/owner/PropertyEdit";
import PropertyApproval from "../pages/admin/PropertyApproval";
import AgentApprovedProperties from "../pages/agent/AgentApprovedProperties";
import CustomerProperty from "../pages/customer/CustomerProperty";
import MyInquiryModal from "../pages/customer/MyInquiries";
import AgentInquiries from "../pages/agent/AgentInquiries";
import AdminInquiries from "../pages/admin/AdminInquiries";
import MyAppointments from "../pages/customer/MyAppointments";
import AgentAppointments from "../pages/agent/AgentAppointments";
import AdminAppointments from "../pages/admin/AdminAppointments";
import MyRentalApplications from "../pages/customer/MyRentalApplications";
import ManageRentalApplications from "../pages/agent/ManageRentalApplications";
import MyLeases from "../pages/customer/MyLeases";
import ManageLeases from "../pages/agent/ManageLeases";
import AdminLeases from "../pages/admin/AdminLeases";
import MySaleOffers from "../pages/customer/MySaleOffers";
import PropertySaleOffers from "../pages/agent/PropertySaleOffers";
import AgentSaleOffers from "../pages/agent/AgentSaleOffers";
import OwnerSaleOffers from "../pages/owner/OwnerSaleOffers";
import MySaleTransactions from "../pages/customer/MySaleTransactions";
import ManageSaleTransactions from "../pages/agent/ManageSaleTransactions";
import AdminSaleTransactions from "../pages/admin/AdminSaleTransactions";
import MyFavorites from "../pages/customer/MyFavorites";
import CustomerPropertyDetails from "../pages/customer/CustomerPropertyDetails";
import MyReviews from "../pages/customer/MyReviews";
import ManagePropertyReviews from "../pages/agent/ManagePropertyReviews";
import AdminReviews from "../pages/admin/AdminReviews";
import PropertySearch from "../pages/customer/PropertySearch";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import PublicPropertyDetailsPage from "../pages/Service";
import LandingLayout from "../layout/landing/landingLayout";
import AllNotifications from "../components/notification/AllNotifications";

const Routes = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/contact",
        element: <ContactPage />,
      },
      {
        path: "/services",
        element: <PublicPropertyDetailsPage />,
      },
    ],
  },

  {
    element: <AuthLayout />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/verify-email",
        element: <VerifyEmail />,
      },
      {
        path: "/agent/register",
        element: <AgentRegister />,
      },
      {
        path: "/owner/register",
        element: <OwnerRegister />,
      },
      {
        path: "/reset-password-confirm/:id/:token",
        element: <ResetPassword />,
      },
      {
        path: "/forgot-password",
        element: <ForgotPassword />,
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRole="customer" />,
    children: [
      {
        path: "/user",
        element: <UserLayout />,
        children: [
          {
            index: true,
            element: <CustomerProperty />,
          },
          {
            path: "inquiries",
            element: <MyInquiryModal />,
          },
          {
            path: "appointments",
            element: <MyAppointments />,
          },
          {
            path: "rental-applications",
            element: <MyRentalApplications />,
          },
          {
            path: "leases",
            element: <MyLeases />,
          },
          {
            path: "sale-offers",
            element: <MySaleOffers />,
          },
          {
            path: "sale-transactions",
            element: <MySaleTransactions />,
          },
          {
            path: "favorites",
            element: <MyFavorites />,
          },
          {
            path: "properties/:propertyId",
            element: <CustomerPropertyDetails />,
          },
          {
            path: "reviews",
            element: <MyReviews />,
          },
          {
            path: "properties/search",
            element: <PropertySearch />,
          },
          {
            path:"notifications",
            element:<AllNotifications/>
          },
          {
            path:"profile",
            element:<AdminProfile/>
          }
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRole="owner" />,
    children: [
      {
        path: "/owner",
        element: <OwnerLayout />,
        children: [
          {
            path: "dashboard",
            element: <OwnerDashboard />,
          },
          {
            path: "properties/create",
            element: <PropertyForm />,
          },
          {
            path: "properties",
            element: <PropertyList />,
          },
          {
            path: "profile",
            element: <OwnerProfile />,
          },

          {
            path: "change-password",
            element: <AdminChangePassword />,
          },
          {
            path: "properties/edit/:id",
            element: <PropertyEdit />,
          },
          {
            path: "appointments",
            element: <AgentAppointments mode="owner" />,
          },
          {
            path: "inquiries",
            element: <AgentInquiries mode="owner" />,
          },
          {
            path: "rentals",
            element: <ManageRentalApplications mode="owner" />,
          },
          {
            path: "leases",
            element: <ManageLeases mode="owner" />,
          },
          {
            path: "sale-offers",
            element: <OwnerSaleOffers />,
          },
          {
            path: "property/:propertyId/offers",
            element: <PropertySaleOffers />,
          },
          {
            path: "sale-transactions",
            element: <ManageSaleTransactions />,
          },
          {
            path: "reviewmanage",
            element: <ManagePropertyReviews mode="owner" />,
          },
          {
            path:"notifications",
            element:<AllNotifications/>
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRole="agent" />,
    children: [
      {
        path: "/agent",
        element: <AgentLayout />,
        children: [
          {
            path: "dashboard",
            element: <AgentDashboard />,
          },
          {
            path: "properties",
            element: <AgentApprovedProperties />,
          },
          {
            path: "profile",
            element: <AdminProfile />,
          },
          {
            path: "change-password",
            element: <AdminChangePassword />,
          },
          {
            path: "inquiries",
            element: <AgentInquiries mode="agent" />,
          },
          {
            path: "appointments",
            element: <AgentAppointments mode="agent" />,
          },

          {
            path: "rentals",
            element: <ManageRentalApplications mode="agent" />,
          },
          {
            path: "leases",
            element: <ManageLeases mode="agent" />,
          },
          {
            path: "sale-offers",
            element: <AgentSaleOffers />,
          },

          {
            path: "property/:propertyId/offers",
            element: <PropertySaleOffers />,
          },
          {
            path: "sale-transactions",
            element: <ManageSaleTransactions />,
          },
          {
            path: "reviewmanage",
            element: <ManagePropertyReviews mode="agent" />,
          },
          {
            path:"notifications",
            element:<AllNotifications/>
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allowedRole="admin" />,
    children: [
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "users",
            element: <UserList />,
          },
          {
            path: "owners",
            element: <OwnerList />,
          },
          {
            path: "agents",
            element: <AgentList />,
          },
          {
            path: "profile",
            element: <AdminProfile />,
          },
          {
            path: "change-password",
            element: <AdminChangePassword />,
          },
          {
            path: "properties",
            element: <PropertyApproval />,
          },
          {
            path: "inquiries",
            element: <AdminInquiries />,
          },
          {
            path: "appointments",
            element: <AdminAppointments />,
          },
          {
            path: "AllLeases",
            element: <AdminLeases />,
          },
          {
            path: "sale-transactions",
            element: <AdminSaleTransactions />,
          },
          {
            path: "allreview",
            element: <AdminReviews />,
          },
          {
            path:"notifications",
            element:<AllNotifications/>
          },
        ],
      },
    ],
  },
]);

export default Routes;
