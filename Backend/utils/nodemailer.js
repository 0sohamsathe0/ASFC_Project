import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.error("Transporter error:", error);
    } else {
        console.log("Transporter is ready to send emails");
    }
});


const sendAcceptedMail = async (recipientName, recipientEmail) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_ID,
            to: recipientEmail,
            subject: "🎉 Welcome to All-Star Fencing Club! 🤺",
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; background: #ffffff; margin: auto; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center; padding: 20px; background: #0051a8; color: white; border-radius: 8px 8px 0 0;">
                        <h1>🎉 Welcome to All-Star Fencing Club! 🤺</h1>
                    </div>
                    <div style="padding: 20px; text-align: center; color: #333;">
                        <p>Dear <b>${recipientName}</b>,</p>
                        <p>Congratulations! You have been <b>accepted</b> into the <b>All-Star Fencing Club</b>. 🏆</p>
                        <p>We are excited to have you on board and look forward to seeing you in action!</p>
                        <p><b>For login use you AadharCardNumber and birth date as id password </b></p>
                        <a href="https://yourwebsite.com/dashboard" style="display: inline-block; padding: 12px 25px; margin-top: 20px; background: #0051a8; color: white; text-decoration: none; font-size: 18px; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                    </div>
                    <div style="text-align: center; padding: 10px; font-size: 14px; color: #777;">
                        <p>📍 All-Star Fencing Club | ⚔️ Train with the Best</p>
                        <p>Need help? Contact us at <a href="mailto:support@fencingclub.com">support@allstarfencingclub.com</a></p>
                    </div>
                </div>
            </div>
        `,
        });
        if(info.rejected.length > 0) { return { success: false,};}

        return {
            success: true,
        };

    } catch (err) {

    return {
      success: false,
      error: err.message,
    };
  }

};

const sendRejectionMail = async ( recipientName,recipientEmail,rejectionReason) => {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_ID,
        to: recipientEmail,
        subject: "⚔️ Thank You for Applying – Keep Training!",
        html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="max-width: 600px; background: #ffffff; margin: auto; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">

                    <div style="text-align: center; padding: 20px; background: #d9534f; color: white; border-radius: 8px 8px 0 0;">
                        <h1>⚔️ Thank You for Applying</h1>
                    </div>

                    <div style="padding: 20px; text-align: center; color: #333;">
                        <p>Dear <b>${recipientName}</b>,</p>

                        <p>
                            We sincerely appreciate your interest in joining the
                            <b>All-Star Fencing Club</b>.
                        </p>

                        <p>
                            Unfortunately, after careful consideration, we are unable
                            to offer you a spot at this time.
                        </p>

                        <p style="margin-top:20px;">
                            <span style="font-size:16px;">Reason for rejection:</span>
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
                            This does not reflect your potential, and we encourage
                            you to keep training and apply again in the future.
                        </p>

                        <a href="https://yourwebsite.com/training-resources"
                           style="
                               display:inline-block;
                               padding:12px 25px;
                               margin-top:20px;
                               background:#5bc0de;
                               color:white;
                               text-decoration:none;
                               font-size:18px;
                               border-radius:5px;
                               font-weight:bold;
                           ">
                           Edit Profile
                        </a>
                    </div>

                    <div style="text-align: center; padding: 10px; font-size: 14px; color: #777;">
                        <p>📍 All-Star Fencing Club | ⚔️ Keep Pushing Forward</p>
                        <p>
                            Have questions? Contact us at
                            <a href="mailto:support@allstarfencingclub.com">
                                support@allstarfencingclub.com
                            </a>
                        </p>
                    </div>

                </div>
            </div>
        `,
    });

    console.log("Rejection email sent: %s", info.messageId);
};

export { sendAcceptedMail, sendRejectionMail }