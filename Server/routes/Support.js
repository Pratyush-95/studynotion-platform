const express = require("express");
const router = express.Router();

const {
  createTicket,
  getMyTickets,
  getAllTickets,
  replyToTicket
} = require("../controllers/Support");

const { auth,isAdmin, } = require("../middlewares/auth");

router.post(
  "/create-ticket",
  auth,
  createTicket
);

router.get(
  "/my-tickets",
  auth,
  getMyTickets
);

router.get(
  "/all-tickets",
  auth,
  isAdmin,
  getAllTickets
);

router.put(
  "/reply-ticket",
  auth,
  isAdmin,
  replyToTicket
);

module.exports = router;