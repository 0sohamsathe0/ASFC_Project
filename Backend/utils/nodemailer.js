import nodemailer from 'nodemailer';
import dotenv from "dotenv";
import dns from "node:dns/promises";
import net from "node:net";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    family: 4,

    auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASS,
    },
});

console.log("🔥 NODEMAILER SERVICE LOADED");
console.log("EMAIL_ID exists:", !!process.env.EMAIL_ID);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

console.log("🔥 NODEMAILER SERVICE LOADED");
console.log("EMAIL_ID exists:", !!process.env.EMAIL_ID);
console.log("EMAIL_PASS exists:", !!process.env.EMAIL_PASS);

transporter.verify()
    .then(() => {
        console.log("✅ NODEMAILER SMTP CONNECTION READY");
    })
    .catch((error) => {
        console.error("❌ NODEMAILER VERIFY FAILED");
        console.error("Code:", error.code);
        console.error("Command:", error.command);
        console.error("Address:", error.address);
        console.error("Port:", error.port);
        console.error("Message:", error.message);
    });

const testSMTPConnection = async () => {
    try {
        const addresses = await dns.resolve4("smtp.gmail.com");

        console.log("🌐 Gmail IPv4 addresses:", addresses);

        const socket = net.createConnection({
            host: addresses[0],
            port: 587,
            family: 4,
            timeout: 10000,
        });

        socket.on("connect", () => {
            console.log("✅ TCP CONNECTION TO GMAIL:587 SUCCESS");
            socket.destroy();
        });

        socket.on("timeout", () => {
            console.error("❌ TCP CONNECTION TIMEOUT");
            socket.destroy();
        });

        socket.on("error", (err) => {
            console.error("❌ TCP CONNECTION FAILED");
            console.error("Code:", err.code);
            console.error("Message:", err.message);
            console.error("Address:", err.address);
            console.error("Port:", err.port);
        });

    } catch (error) {
        console.error("❌ DNS LOOKUP FAILED");
        console.error(error);
    }
};

testSMTPConnection();

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
                        <a href="https://all-star-fencing-club.vercel.app/" style="display: inline-block; padding: 12px 25px; margin-top: 20px; background: #0051a8; color: white; text-decoration: none; font-size: 18px; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                    </div>
                    <div style="text-align: center; padding: 10px; font-size: 14px; color: #777;">
                        <p>📍 All-Star Fencing Club | ⚔️ Train with the Best</p>
                        <p>Need help? Contact us at <a href="mailto:support@fencingclub.com">support@allstarfencingclub.com</a></p>
                    </div>
                </div>
            </div>
        `,
        });

        return {
            success: true,
        };

    } catch (err) {
    console.error("❌ EMAIL SEND FAILED");
    console.error("Error code:", err.code);
    console.error("Error command:", err.command);
    console.error("Error response:", err.response);
    console.error("Error message:", err.message);

    return {
        success: false,
        error: err.message,
    };
}

};

const sendRejectionMail = async (
    recipientName,
    recipientEmail,
    rejectionReason
) => {
    try {
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

                            <a href="https://all-star-fencing-club.vercel.app/"
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
                               Visit Club Website
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

        console.log("✅ REJECTION EMAIL SENT SUCCESSFULLY");
        console.log("Message ID:", info.messageId);
        console.log("Rejected recipient:", recipientEmail);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (err) {
        console.error("❌ REJECTION EMAIL SEND FAILED");
        console.error("Code:", err.code);
        console.error("Command:", err.command);
        console.error("Response:", err.response);
        console.error("Message:", err.message);

        return {
            success: false,
            error: err.message,
        };
    }
};

export { sendAcceptedMail, sendRejectionMail }