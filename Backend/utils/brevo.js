import fetch from "node-fetch";

/**
 * Send transactional email through Brevo SMTP API
 */
export const sendMail = async (to, subject, text) => {
  if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER) {
    throw new Error("Brevo credentials are not configured");
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "TrackZone", email: process.env.BREVO_SENDER },
        to: [{ email: to }],
        subject,
        textContent: text,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Brevo request failed: ${response.status} ${errorBody}`);
    }

    const data = await response.json();
    console.log("📧 Brevo email sent", data.messageId || data);
    return data;
  } catch (error) {
    console.error("❌ Brevo sendMail error", error.message);
    throw error;
  }
};
