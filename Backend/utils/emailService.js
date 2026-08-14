import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

console.log("📧 RESEND EMAIL SERVICE LOADED");
console.log(
  "RESEND_API_KEY exists:",
  !!process.env.RESEND_API_KEY
);

export const sendAcceptedMail = async (
  recipientName,
  recipientEmail
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "All Star Fencing Club <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: "🎉 Welcome to All-Star Fencing Club! 🤺",

      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; background: #ffffff; margin: auto; padding: 20px; border-radius: 8px;">

            <div style="text-align: center; padding: 20px; background: #0051a8; color: white; border-radius: 8px 8px 0 0;">
              <h1>🎉 Welcome to All-Star Fencing Club! 🤺</h1>
            </div>

            <div style="padding: 20px; text-align: center; color: #333;">

              <p>Dear <b>${recipientName}</b>,</p>

              <p>
                Congratulations! You have been
                <b>accepted</b> into the
                <b>All-Star Fencing Club</b>. 🏆
              </p>

              <p>
                We are excited to have you on board
                and look forward to seeing you in action!
              </p>

              <p>
                <b>
                  For login, use your Aadhaar Card Number
                  and birth date as ID and password.
                </b>
              </p>

              <a
                href="https://all-star-fencing-club.vercel.app/"
                style="
                  display:inline-block;
                  padding:12px 25px;
                  margin-top:20px;
                  background:#0051a8;
                  color:white;
                  text-decoration:none;
                  font-size:18px;
                  border-radius:5px;
                  font-weight:bold;
                "
              >
                Visit All Star Fencing Club
              </a>

            </div>

            <div style="text-align:center; padding:10px; font-size:14px; color:#777;">
              <p>
                📍 All-Star Fencing Club | ⚔️ Train with the Best
              </p>
            </div>

          </div>
        </div>
      `,
    });

    if (error) {
      console.error("❌ ACCEPTANCE EMAIL FAILED:", error);

      return {
        success: false,
        error: error.message || "Email could not be sent",
      };
    }

    console.log("✅ ACCEPTANCE EMAIL SENT");
    console.log("Message ID:", data?.id);
    console.log("Recipient:", recipientEmail);

    return {
      success: true,
      messageId: data?.id,
    };

  } catch (error) {
    console.error("❌ ACCEPTANCE EMAIL ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};


export const sendRejectionMail = async (
  recipientName,
  recipientEmail,
  rejectionReason
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "All Star Fencing Club <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: "⚔️ Thank You for Applying – Keep Training!",

      html: `
        <div style="font-family: Arial, sans-serif; background-color:#f4f4f4; padding:20px;">
          <div style="max-width:600px; background:#ffffff; margin:auto; padding:20px; border-radius:8px;">

            <div style="text-align:center; padding:20px; background:#d9534f; color:white; border-radius:8px 8px 0 0;">
              <h1>⚔️ Thank You for Applying</h1>
            </div>

            <div style="padding:20px; text-align:center; color:#333;">

              <p>Dear <b>${recipientName}</b>,</p>

              <p>
                We sincerely appreciate your interest in joining
                <b>All-Star Fencing Club</b>.
              </p>

              <p>
                Unfortunately, after careful consideration,
                we are unable to offer you a spot at this time.
              </p>

              <p style="margin-top:20px;">
                <span style="font-size:16px;">
                  Reason for rejection:
                </span>
              </p>

              <p style="
                font-size:18px;
                font-weight:bold;
                color:#d9534f;
                background:#fff3f3;
                padding:12px;
                border-radius:6px;
                border-left:5px solid #d9534f;
              ">
                ${rejectionReason}
              </p>

              <p>
                This does not reflect your potential.
                We encourage you to keep training and
                apply again in the future.
              </p>

            </div>

            <div style="text-align:center; padding:10px; font-size:14px; color:#777;">
              <p>
                📍 All-Star Fencing Club | ⚔️ Keep Pushing Forward
              </p>
            </div>

          </div>
        </div>
      `,
    });

    if (error) {
      console.error("❌ REJECTION EMAIL FAILED:", error);

      return {
        success: false,
        error: error.message || "Email could not be sent",
      };
    }

    console.log("✅ REJECTION EMAIL SENT");
    console.log("Message ID:", data?.id);
    console.log("Recipient:", recipientEmail);

    return {
      success: true,
      messageId: data?.id,
    };

  } catch (error) {
    console.error("❌ REJECTION EMAIL ERROR:", error);

    return {
      success: false,
      error: error.message,
    };
  }
};