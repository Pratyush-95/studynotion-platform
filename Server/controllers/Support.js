const SupportTicket = require("../models/SupportTicket");
const User = require("../models/User");
const Notification = require("../models/Notification");

exports.createTicket = async (req, res) => {
  try {
    const { category, subject, description } = req.body;

    const ticket = await SupportTicket.create({
      createdBy: req.user.id,
      category,
      subject,
      description,
    });

    return res.status(200).json({
      success: true,
      data: ticket,
      message: "Ticket created successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create ticket",
    });
  }
};

exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tickets,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};



exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate("createdBy", "firstName lastName email accountType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tickets,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch tickets",
    });
  }
};



exports.replyToTicket = async (req, res) => {
  try {

    const {
      ticketId,
      adminReply,
      status,
    } = req.body;

       if (!ticketId || !adminReply) {
      return res.status(400).json({
        success: false,
        message: "Ticket ID and admin reply are required",
      });
    }

    const ticket = await SupportTicket.findByIdAndUpdate(
      ticketId,
      {
        adminReply,
        status,
      },
      { new: true }
    );

     if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    await Notification.create({
  user: ticket.createdBy,
  title: "Support Ticket Updated",
  message: `Your ticket "${ticket.subject}" has received a reply from the admin.`,
  type: "TICKET_REPLY",
});

    return res.status(200).json({
      success: true,
      data: ticket,
      message: "Reply submitted successfully",
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed to reply",
    });
  }
};