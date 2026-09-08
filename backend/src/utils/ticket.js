import crypto from "crypto";

export function generateTicketNumber() {
  const date = new Date();

  const year = date.getFullYear();

  const random = crypto
    .randomInt(100000, 1000000)
    .toString();

  return `PAL-${year}-${random}`;
}