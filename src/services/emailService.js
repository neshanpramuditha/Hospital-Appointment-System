import emailjs from "@emailjs/browser";

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;

const CONTACT_TEMPLATE =
  import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID;

const AUTO_REPLY_TEMPLATE =
  import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID;

emailjs.init(PUBLIC_KEY);

export async function sendContactEmail(form) {
  const templateParams = {
    from_name: form.name,
    from_email: form.email,
    subject: form.subject,
    message: form.message,
    time: new Date().toLocaleString(),
  };

  // Send email to hospital
  await emailjs.send(
    SERVICE_ID,
    CONTACT_TEMPLATE,
    templateParams
  );

  // Send auto reply
  await emailjs.send(
    SERVICE_ID,
    AUTO_REPLY_TEMPLATE,
    templateParams
  );
}
