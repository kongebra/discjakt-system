import { createTransport } from "@discjakt/transactional";

export const transport = createTransport({
  host: process.env.EMAIL_HOST || "",
  port: parseInt(process.env.EMAIL_PORT || "0", 10),
  secure: true,
  auth: {
    user: process.env.EMAIL_USER || "",
    pass: process.env.EMAIL_PASS || "",
  },
});

