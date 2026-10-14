import * as yup from "yup";
import type {
  LoginFormValues,
  AuthFormValues,
  VerifyEmailFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
  ChangePasswordFormValues,
  UpdateProfileFormValues,
} from "../typescript/type/auth.types";
import type {
  AgentRegisterFormValues,
  UpdateAgentProfileFormValues,
} from "../typescript/type/agent.types";
import type {
  OwnerRegisterFormValues,
  UpdateOwnerProfileFormValues,
} from "../typescript/type/owner.types";

import type { PropertyFormValues } from "../typescript/type/property.types";
import type {
  InquiryFormValues,
  ReplyInquiryFormValues,
} from "../typescript/type/inquiry.types";

import type {
  AppointmentFormValues,
  RescheduleFormValues,
  CancelFormValues,
} from "../typescript/type/appointment.types";

import type { UpdateTransactionFormValues } from "../typescript/type/saleTransaction.types";

import type {
  RentalApplicationFormValues,
  RentalActionFormValues,
} from "../typescript/type/rental.types";

import type {
  LeaseFormValues,
  UpdateLeaseFormValues,
  TerminateLeaseFormValues,
} from "../typescript/type/lease.types";

import type {
  SaleOfferFormValues,
  RespondSaleOfferFormValues,
} from "../typescript/type/saleOffer.types";

import type {
  ReviewFormValues,
  ReviewActionFormValues,
} from "../typescript/type/review.types";

const phoneRegex = /^[0-9]{10,15}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

export const loginSchema: yup.ObjectSchema<LoginFormValues> = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const registerSchema: yup.ObjectSchema<AuthFormValues> = yup.object({
  name: yup
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .required("Name is required"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      passwordRegex,
      "Password must contain uppercase, lowercase, and number",
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm password is required"),
  phone: yup
    .string()
    .matches(phoneRegex, "Invalid phone number")
    .required("Phone is required"),
});

export const agentRegisterSchema: yup.ObjectSchema<AgentRegisterFormValues> =
  yup.object({
    name: yup
      .string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),

    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),

    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegex,
        "Password must contain uppercase, lowercase, and number",
      )
      .required("Password is required"),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),

    phone: yup
      .string()
      .matches(phoneRegex, "Invalid phone number")
      .required("Phone is required"),

    licenseNumber: yup.string().required("License number is required"),

    agencyName: yup.string().required("Agency name is required"),

    experience: yup
      .number()
      .typeError("Experience must be a number")
      .min(0, "Experience cannot be negative")
      .integer("Experience must be a whole number")
      .required("Experience is required"),

    specialization: yup
      .array()
      .of(
        yup
          .string()
          .oneOf(["Residential", "Commercial", "Land", "Rental", "Luxury"])
          .required(),
      )
      .min(1, "At least one specialization is required")
      .required("Specialization is required"),

    bio: yup
      .string()
      .max(1000, "Bio must be less than 1000 characters")
      .defined(),

    address: yup
      .object({
        street: yup
          .string()
          .max(200, "Street must be less than 200 characters")
          .defined(),

        city: yup
          .string()
          .max(100, "City must be less than 100 characters")
          .defined(),

        state: yup
          .string()
          .max(100, "State must be less than 100 characters")
          .defined(),

        country: yup.string().default("India").defined(),

        pincode: yup
          .string()
          .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
          .defined(),
      })
      .required("Address is required"),
  });

export const ownerRegisterSchema: yup.ObjectSchema<OwnerRegisterFormValues> =
  yup.object({
    name: yup
      .string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegex,
        "Password must contain uppercase, lowercase, and number",
      )
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    phone: yup
      .string()
      .matches(phoneRegex, "Invalid phone number")
      .required("Phone is required"),
    address: yup
      .object({
        street: yup
          .string()
          .max(200, "Street must be less than 200 characters")
          .defined(),

        city: yup
          .string()
          .max(100, "City must be less than 100 characters")
          .defined(),

        state: yup
          .string()
          .max(100, "State must be less than 100 characters")
          .defined(),

        country: yup.string().default("India").defined(),

        pincode: yup
          .string()
          .matches(/^\d{6}$/, "Pincode must be exactly 6 digits")
          .defined(),
      })
      .required("Address is required"),
  });

export const verifyEmailSchema: yup.ObjectSchema<VerifyEmailFormValues> =
  yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    otp: yup
      .string()
      .length(6, "OTP must be 6 digits")
      .matches(/^[0-9]+$/, "OTP must contain only numbers")
      .required("OTP is required"),
  });

export const resendOTPSchema = yup.object({
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const updateProfileSchema: yup.ObjectSchema<UpdateProfileFormValues> =
  yup.object({
    name: yup.string().min(2, "Name must be at least 2 characters"),
    phone: yup.string().matches(phoneRegex, "Invalid phone number"),
  });

export const updateAgentProfileSchema: yup.ObjectSchema<UpdateAgentProfileFormValues> =
  yup.object({
    name: yup.string().min(2, "Name must be at least 2 characters"),
    phone: yup.string().matches(phoneRegex, "Invalid phone number"),
    licenseNumber: yup.string(),
    agencyName: yup.string(),
    experience: yup.number().min(0, "Experience cannot be negative"),
    specialization: yup.string(),
    bio: yup.string().max(500, "Bio must be less than 500 characters"),
    address: yup.string(),
  });

export const changePasswordSchema: yup.ObjectSchema<ChangePasswordFormValues> =
  yup.object({
    currentPassword: yup.string().required("Current password is required"),
    newPassword: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegex,
        "Password must contain uppercase, lowercase, and number",
      )
      .required("New password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Passwords must match")
      .required("Confirm password is required"),
  });

export const forgotPasswordSchema: yup.ObjectSchema<ForgotPasswordFormValues> =
  yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
  });

export const resetPasswordSchema: yup.ObjectSchema<ResetPasswordFormValues> =
  yup.object({
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        passwordRegex,
        "Password must contain uppercase, lowercase, and number",
      )
      .required("Password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

export const updateStatusSchema = yup.object({
  status: yup
    .string()
    .oneOf(["active", "inactive", "blocked"], "Invalid status")
    .required("Status is required"),
});

export const propertySchema: yup.ObjectSchema<PropertyFormValues> = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .required("Title is required"),

  description: yup
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .required("Description is required"),

  propertyType: yup
    .string()
    .oneOf(
      ["Apartment", "House", "Villa", "Land", "Office", "Shop", "Warehouse"],
      "Invalid property type",
    )
    .required("Property type is required") as yup.StringSchema<
    PropertyFormValues["propertyType"]
  >,

  purpose: yup
    .string()
    .oneOf(["Sale", "Rent"], "Purpose must be Sale or Rent")
    .required("Purpose is required") as yup.StringSchema<
    PropertyFormValues["purpose"]
  >,

  price: yup
    .number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .required("Price is required"),

  area: yup
    .number()
    .typeError("Area must be a number")
    .positive("Area must be greater than 0")
    .required("Area is required"),

  bedrooms: yup
    .number()
    .typeError("Bedrooms must be a number")
    .integer("Bedrooms must be a whole number")
    .min(0, "Bedrooms cannot be negative")
    .required("Bedrooms is required"),

  bathrooms: yup
    .number()
    .typeError("Bathrooms must be a number")
    .integer("Bathrooms must be a whole number")
    .min(0, "Bathrooms cannot be negative")
    .required("Bathrooms is required"),

  furnishingStatus: yup
    .string()
    .oneOf(
      ["Furnished", "Semi-Furnished", "Unfurnished"],
      "Invalid furnishing status",
    )
    .required("Furnishing status is required") as yup.StringSchema<
    PropertyFormValues["furnishingStatus"]
  >,

  amenities: yup.string().default(""),

  status: yup
    .string()
    .oneOf(["Available", "Sold", "Rented", "Unavailable"], "Invalid status")
    .required("Status is required") as yup.StringSchema<
    PropertyFormValues["status"]
  >,

  agentId: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid Agent ID")
    .optional()
    .transform((v) => (v === "" ? undefined : v)),

  longitude: yup
    .number()
    .typeError("Longitude must be a number")
    .min(-180, "Longitude must be ≥ -180")
    .max(180, "Longitude must be ≤ 180")
    .required("Longitude is required"),

  latitude: yup
    .number()
    .typeError("Latitude must be a number")
    .min(-90, "Latitude must be ≥ -90")
    .max(90, "Latitude must be ≤ 90")
    .required("Latitude is required"),
});

export const updateOwnerProfileSchema: yup.ObjectSchema<UpdateOwnerProfileFormValues> =
  yup.object({
    name: yup
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be less than 50 characters")
      .optional(),
    phone: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Invalid phone number")
      .optional(),
    address: yup.string().max(200, "Address is too long").optional(),
  });

// =====================================================
// INQUIRY SCHEMAS
// =====================================================

export const inquirySchema: yup.ObjectSchema<InquiryFormValues> = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long")
    .required("Name is required"),

  email: yup
    .string()
    .trim()
    .lowercase()
    .email("Invalid email format")
    .required("Email is required"),

  phone: yup
    .string()
    .trim()
    .matches(/^[0-9+\-\s()]{7,20}$/, "Invalid phone number")
    .required("Phone is required"),

  message: yup
    .string()
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message is too long")
    .required("Message is required"),
});

export const replyInquirySchema: yup.ObjectSchema<ReplyInquiryFormValues> =
  yup.object({
    reply: yup
      .string()
      .trim()
      .min(1, "Reply cannot be empty")
      .max(2000, "Reply is too long")
      .required("Reply is required"),
  });

// =====================================================
// APPOINTMENT SCHEMAS
// =====================================================

export const appointmentSchema: yup.ObjectSchema<AppointmentFormValues> =
  yup.object({
    appointmentDate: yup
      .string()
      .required("Appointment date is required")
      .test("is-future", "Appointment date must be in the future", (value) => {
        if (!value) return false;
        return new Date(value) > new Date();
      }),

    duration: yup
      .number()
      .typeError("Duration must be a number")
      .integer("Duration must be a whole number")
      .min(15, "Duration must be at least 15 minutes")
      .max(480, "Duration cannot exceed 480 minutes")
      .required("Duration is required"),

    message: yup.string().trim().max(1000, "Message is too long").default(""),
  });

export const rescheduleSchema: yup.ObjectSchema<RescheduleFormValues> =
  yup.object({
    appointmentDate: yup
      .string()
      .required("New date is required")
      .test("is-future", "New date must be in the future", (value) =>
        value ? new Date(value) > new Date() : false,
      ),
    duration: yup
      .number()
      .typeError("Duration must be a number")
      .integer()
      .min(15)
      .max(480)
      .required(),
    message: yup.string().trim().max(1000).default(""),
  });

export const cancelAppointmentFormSchema: yup.ObjectSchema<CancelFormValues> =
  yup.object({
    cancellationReason: yup
      .string()
      .trim()
      .max(1000, "Reason is too long")
      .default(""),
  });

// =====================================================
// RENTAL APPLICATION SCHEMAS
// =====================================================

export const rentalApplicationSchema: yup.ObjectSchema<RentalApplicationFormValues> =
  yup.object({
    monthlyIncome: yup
      .number()
      .typeError("Monthly income must be a number")
      .min(0, "Monthly income cannot be negative")
      .required("Monthly income is required"),

    employmentStatus: yup.string().trim().max(100, "Too long").default(""),

    occupation: yup.string().trim().max(100, "Too long").default(""),

    message: yup.string().trim().max(1000, "Message is too long").default(""),
  });

export const rentalActionSchema: yup.ObjectSchema<RentalActionFormValues> =
  yup.object({
    rejectionReason: yup
      .string()
      .trim()
      .min(3, "Rejection reason must be at least 3 characters")
      .max(500, "Reason too long")
      .required("Rejection reason is required"),
  });

// =====================================================
// LEASE SCHEMAS
// =====================================================

export const leaseSchema: yup.ObjectSchema<LeaseFormValues> = yup.object({
  rentalApplication: yup
    .string()
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid application ID")
    .required("Rental application is required"),

  startDate: yup
    .string()
    .required("Start date is required")
    .test(
      "is-valid",
      "Invalid start date",
      (v) => !!v && !isNaN(new Date(v).getTime()),
    ),

  endDate: yup
    .string()
    .required("End date is required")
    .test(
      "is-after-start",
      "End date must be after start date",
      function (value) {
        const { startDate } = this.parent as { startDate?: string };
        if (!value || !startDate) return false;
        return new Date(value) > new Date(startDate);
      },
    ),

  monthlyRent: yup
    .number()
    .typeError("Monthly rent must be a number")
    .positive("Monthly rent must be greater than 0")
    .required("Monthly rent is required"),

  securityDeposit: yup
    .number()
    .typeError("Security deposit must be a number")
    .min(0, "Security deposit cannot be negative")
    .default(0),

  agreementDocument: yup
    .string()
    .trim()
    .url("Must be a valid URL")
    .optional()
    .default(""),
});

export const updateLeaseSchema: yup.ObjectSchema<UpdateLeaseFormValues> =
  yup.object({
    startDate: yup
      .string()
      .required("Start date is required")
      .test(
        "is-valid",
        "Invalid start date",
        (v) => !!v && !isNaN(new Date(v).getTime()),
      ),

    endDate: yup
      .string()
      .required("End date is required")
      .test(
        "is-after-start",
        "End date must be after start date",
        function (value) {
          const { startDate } = this.parent as { startDate?: string };
          if (!value || !startDate) return false;
          return new Date(value) > new Date(startDate);
        },
      ),

    monthlyRent: yup
      .number()
      .typeError("Monthly rent must be a number")
      .positive("Monthly rent must be greater than 0")
      .required(),

    securityDeposit: yup
      .number()
      .typeError("Security deposit must be a number")
      .min(0)
      .default(0),

    agreementDocument: yup
      .string()
      .trim()
      .url("Must be a valid URL")
      .default(""),
  });

export const terminateLeaseSchema: yup.ObjectSchema<TerminateLeaseFormValues> =
  yup.object({
    terminationReason: yup
      .string()
      .trim()
      .min(3, "Reason must be at least 3 characters")
      .max(1000, "Reason too long")
      .required("Termination reason is required"),
  });

export const saleOfferSchema: yup.ObjectSchema<SaleOfferFormValues> =
  yup.object({
    offerPrice: yup
      .number()
      .typeError("Offer price must be a number")
      .positive("Offer price must be greater than 0")
      .required("Offer price is required"),

    message: yup.string().trim().max(2000, "Message is too long").default(""),
  });

export const respondSaleOfferSchema: yup.ObjectSchema<RespondSaleOfferFormValues> =
  yup.object({
    action: yup
      .string()
      .oneOf(["accept", "reject", "counter"], "Invalid action")
      .required("Action is required") as yup.StringSchema<
      RespondSaleOfferFormValues["action"]
    >,

    counterOfferPrice: yup
      .number()
      .typeError("Counter offer price must be a number")
      .when("action", {
        is: "counter",
        then: (schema) =>
          schema
            .positive("Counter offer must be greater than 0")
            .required("Counter offer price is required"),
        otherwise: (schema) => schema.default(0),
      }),

    message: yup.string().trim().max(2000, "Message is too long").default(""),
  });

export const updateTransactionSchema: yup.ObjectSchema<UpdateTransactionFormValues> =
  yup.object({
    transactionStatus: yup
      .string()
      .oneOf(
        [
          "initiated",
          "agreement_signed",
          "payment_pending",
          "completed",
          "cancelled",
        ],
        "Invalid transaction status",
      )
      .required("Status is required") as yup.StringSchema<
      UpdateTransactionFormValues["transactionStatus"]
    >,

    paymentStatus: yup
      .string()
      .oneOf(["unpaid", "partial", "paid"], "Invalid payment status")
      .required("Payment status is required") as yup.StringSchema<
      UpdateTransactionFormValues["paymentStatus"]
    >,

    amountPaid: yup
      .number()
      .typeError("Amount paid must be a number")
      .min(0, "Amount cannot be negative")
      .required("Amount paid is required"),

    notes: yup.string().trim().max(2000, "Notes are too long").default(""),
  });

export const reviewSchema: yup.ObjectSchema<ReviewFormValues> = yup.object({
  rating: yup
    .number()
    .typeError("Rating must be a number")
    .integer("Rating must be a whole number")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),

  comment: yup
    .string()
    .trim()
    .min(3, "Comment must be at least 3 characters")
    .max(2000, "Comment is too long")
    .required("Comment is required"),
});

export const reviewActionSchema: yup.ObjectSchema<ReviewActionFormValues> =
  yup.object({
    action: yup
      .string()
      .oneOf(["approve", "reject"], "Invalid action")
      .required("Action is required"),

    reason: yup
      .string()
      .defined()
      .default("")
      .trim()
      .max(1000, "Reason is too long")
      .when("action", {
        is: "reject",
        then: (schema) =>
          schema
            .min(3, "Rejection reason must be at least 3 characters")
            .required("Reason is required when rejecting"),
        otherwise: (schema) => schema,
      }),
  });
