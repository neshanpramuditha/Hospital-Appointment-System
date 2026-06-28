const OTP_STORAGE_PREFIX = "hospital_otp";

export function generateOtp(length = 6) {
  const digits = "0123456789";
  let otp = "";

  for (let index = 0; index < length; index += 1) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }

  return otp;
}

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function getOtpStorageKey(email) {
  return `${OTP_STORAGE_PREFIX}:${normalizeEmail(email)}`;
}

export function saveOtp(email, otp, ttlMinutes = 5) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !otp) {
    throw new Error("Email and OTP are required to save an OTP.");
  }

  const payload = {
    email: normalizedEmail,
    otp,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttlMinutes * 60 * 1000,
  };

  if (typeof window !== "undefined") {
    window.localStorage.setItem(
      getOtpStorageKey(normalizedEmail),
      JSON.stringify(payload)
    );
  }

  return payload;
}

export function verifyOtp(email, otp) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !otp) {
    return { valid: false, reason: "Email and OTP are required." };
  }

  if (typeof window === "undefined") {
    return { valid: false, reason: "OTP verification is only available in the browser." };
  }

  const rawRecord = window.localStorage.getItem(getOtpStorageKey(normalizedEmail));

  if (!rawRecord) {
    return { valid: false, reason: "OTP not found." };
  }

  try {
    const record = JSON.parse(rawRecord);

    if (!record || !record.otp) {
      return { valid: false, reason: "OTP is invalid." };
    }

    if (Date.now() > record.expiresAt) {
      window.localStorage.removeItem(getOtpStorageKey(normalizedEmail));
      return { valid: false, reason: "OTP has expired." };
    }

    if (String(record.otp) !== String(otp)) {
      return { valid: false, reason: "OTP is incorrect." };
    }

    window.localStorage.removeItem(getOtpStorageKey(normalizedEmail));
    return { valid: true, reason: "OTP verified successfully." };
  } catch (error) {
    console.error("OTP verification failed:", error);
    return { valid: false, reason: "OTP verification failed." };
  }
}

export async function createMailTransporter() {
  if (typeof window !== "undefined") {
    return null;
  }

  const nodemailer = await import("nodemailer");

  const host = process?.env?.SMTP_HOST || import.meta?.env?.VITE_SMTP_HOST;
  const port = Number(process?.env?.SMTP_PORT || import.meta?.env?.VITE_SMTP_PORT || 587);
  const user = process?.env?.SMTP_USER || import.meta?.env?.VITE_SMTP_USER;
  const pass = process?.env?.SMTP_PASS || import.meta?.env?.VITE_SMTP_PASS;
  const secure = Boolean(process?.env?.SMTP_SECURE || import.meta?.env?.VITE_SMTP_SECURE || false);

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOtpEmail(email, otp, transporter = null) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !otp) {
    throw new Error("Email and OTP are required to send an OTP.");
  }

  if (transporter) {
    await transporter.sendMail({
      from: import.meta?.env?.VITE_SMTP_FROM || "hospital@local.dev",
      to: normalizedEmail,
      subject: "Your OTP for hospital authentication",
      text: `Your OTP is ${otp}`,
    });

    return { sent: true };
  }

  if (typeof window !== "undefined") {
    console.info(`OTP for ${normalizedEmail}: ${otp}`);
    return { sent: false, skipped: true };
  }

  const mailTransporter = await createMailTransporter();

  if (!mailTransporter) {
    console.info(`OTP for ${normalizedEmail}: ${otp}`);
    return { sent: false, skipped: true };
  }

  await mailTransporter.sendMail({
    from: process?.env?.SMTP_FROM || import.meta?.env?.VITE_SMTP_FROM || "hospital@local.dev",
    to: normalizedEmail,
    subject: "Your OTP for hospital authentication",
    text: `Your OTP is ${otp}`,
  });

  return { sent: true };
}
