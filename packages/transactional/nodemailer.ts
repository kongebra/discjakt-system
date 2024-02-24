import nodemailer from "nodemailer";

type CreateTransportOptions = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
};

export const createTransport = (options: CreateTransportOptions) => {
  return nodemailer.createTransport({
    ...options,
  });
};

