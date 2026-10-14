const Notification = require("../models/notificationModel");
const User = require("../models/userModel");

// =====================================================
// CORE — Create notification
// =====================================================

const createNotification = async ({
  recipient,
  recipientRole,
  sender = null,
  type,
  title,
  message,
  link = "",
  refId = null,
  refModel = null,
  metadata = {},
}) => {
  try {
    // Don't notify self
    if (sender && String(sender) === String(recipient)) return null;

    const notification = await Notification.create({
      recipient,
      recipientRole,
      sender,
      type,
      title,
      message,
      link,
      refId,
      refModel,
      metadata,
    });

    return notification;
  } catch (error) {
    console.error("Create Notification ERROR:", error);
    return null;
  }
};

// =====================================================
// BULK — Notify multiple recipients
// =====================================================

const createBulkNotifications = async (recipients, payload) => {
  try {
    const promises = recipients.map((r) =>
      createNotification({
        recipient: r.id,
        recipientRole: r.role,
        ...payload,
      })
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error("Bulk Notification ERROR:", error);
    return [];
  }
};

// =====================================================
// HELPER — Notify all admins
// =====================================================

const notifyAllAdmins = async (payload) => {
  try {
    const admins = await User.find({
      role: "admin",
      isDeleted: false,
    }).select("_id role");

    const recipients = admins.map((a) => ({
      id: a._id,
      role: "admin",
    }));

    return await createBulkNotifications(recipients, payload);
  } catch (error) {
    console.error("Notify Admins ERROR:", error);
    return [];
  }
};

// =====================================================
// SPECIFIC HELPERS (optional — for cleaner controllers)
// =====================================================

const notifyInquiryCreated = async ({
  inquiry,
  property,
  senderUser,
}) => {
  const recipient = property.agentId || property.owner;
  const recipientRole = property.agentId ? "agent" : "owner";

  if (!recipient) return null;

  return createNotification({
    recipient,
    recipientRole,
    sender: senderUser._id,
    type: "inquiry_created",
    title: "New Inquiry Received",
    message: `${senderUser.name} sent an inquiry on "${property.title}"`,
    link:
      recipientRole === "agent" ? "/agent/inquiries" : "/owner/inquiries",
    refId: inquiry._id,
    refModel: "Inquiry",
  });
};

const notifyAppointmentCreated = async ({
  appointment,
  property,
  senderUser,
}) => {
  const recipient = property.agentId || property.owner;
  const recipientRole = property.agentId ? "agent" : "owner";

  if (!recipient) return null;

  return createNotification({
    recipient,
    recipientRole,
    sender: senderUser._id,
    type: "appointment_created",
    title: "New Appointment Request",
    message: `${senderUser.name} booked a visit for "${property.title}"`,
    link:
      recipientRole === "agent"
        ? "/agent/appointments"
        : "/owner/appointments",
    refId: appointment._id,
    refModel: "Appointment",
  });
};

const notifyAppointmentAction = async ({
  appointment,
  property,
  senderUser,
  action,
}) => {
  const actionTitles = {
    confirm: "Appointment Confirmed",
    reject: "Appointment Rejected",
    reschedule: "Appointment Rescheduled",
    complete: "Appointment Completed",
  };

  const actionMessages = {
    confirm: `Your appointment for "${property.title}" has been confirmed`,
    reject: `Your appointment for "${property.title}" was rejected`,
    reschedule: `Your appointment for "${property.title}" has been rescheduled`,
    complete: `Your appointment for "${property.title}" is completed`,
  };

  return createNotification({
    recipient: appointment.user,
    recipientRole: "customer",
    sender: senderUser._id,
    type: `appointment_${action === "confirm" ? "confirmed" : action === "reject" ? "rejected" : action === "reschedule" ? "rescheduled" : "completed"}`,
    title: actionTitles[action],
    message: actionMessages[action],
    link: "/user/appointments",
    refId: appointment._id,
    refModel: "Appointment",
  });
};

const notifySaleOfferAction = async ({
  offer,
  property,
  senderUser,
  action,
}) => {
  const actionTitles = {
    accept: "Offer Accepted! 🎉",
    reject: "Offer Rejected",
    counter: "Offer Countered",
  };

  const actionMessages = {
    accept: `Your offer of $${offer.currentOfferPrice.toLocaleString()} for "${property.title}" was accepted`,
    reject: `Your offer for "${property.title}" was rejected`,
    counter: `The owner countered your offer at $${offer.currentOfferPrice.toLocaleString()}`,
  };

  return createNotification({
    recipient: offer.buyer,
    recipientRole: "customer",
    sender: senderUser._id,
    type: `sale_offer_${action === "accept" ? "accepted" : action === "reject" ? "rejected" : "countered"}`,
    title: actionTitles[action],
    message: actionMessages[action],
    link: "/user/sale-offers",
    refId: offer._id,
    refModel: "SaleOffer",
  });
};

const notifyRentalAction = async ({
  application,
  property,
  senderUser,
  action,
}) => {
  const actionTitles = {
    approve: "Rental Application Approved ✅",
    reject: "Rental Application Rejected",
  };

  const actionMessages = {
    approve: `Your rental application for "${property.title}" was approved`,
    reject: `Your rental application for "${property.title}" was rejected`,
  };

  return createNotification({
    recipient: application.applicant,
    recipientRole: "customer",
    sender: senderUser._id,
    type: `rental_${action === "approve" ? "approved" : "rejected"}`,
    title: actionTitles[action],
    message: actionMessages[action],
    link: "/user/rental-applications",
    refId: application._id,
    refModel: "RentalApplication",
  });
};

module.exports = {
  createNotification,
  createBulkNotifications,
  notifyAllAdmins,
  notifyInquiryCreated,
  notifyAppointmentCreated,
  notifyAppointmentAction,
  notifySaleOfferAction,
  notifyRentalAction,
};