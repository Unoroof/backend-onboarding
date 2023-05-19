function isValidConsultationStatus(s, b, c) {
  const gmModuleStatus = [
    "source_send_request",
    "destination_accepted_the_request",
    "destination_rejected_the_request",
    "source_payment_failed",
    "source_payment_done",
  ];

  const videoConsultationStatus = [
    "buyer_send_request",
    "banker_accepted_the_request",
    "banker_rejected_the_request",
    "buyer_payment_done",
    "buyer_payment_failed",
    "consultation_done",
  ];

  if (videoConsultationStatus.includes(s) || gmModuleStatus.includes(s)) {
    return true;
  }

  return "^Invalid consultation status";
}

module.exports = isValidConsultationStatus;
