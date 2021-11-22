import crypto from "crypto";

export const uid = () => {
  return crypto.randomBytes(3).toString("hex");
};

export const log = console.log;
