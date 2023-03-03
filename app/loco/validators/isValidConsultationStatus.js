function isValidConsultationStatus(s) {
  return !["buyer_send_request","banker_accepted_the_request","banker_rejected_the_request","buyer_payment_done",
  "buyer_payment_failed","consultation_completed"].includes(s) ? "^Invalid consultation status" : true;
}

module.exports = isValidConsultationStatus;
