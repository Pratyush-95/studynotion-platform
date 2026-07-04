module.exports = {
  sendSms: async () => {
    throw new Error(
      "Twilio SMS sending is no longer available. Use Firebase phone authentication instead."
    );
  },
};
