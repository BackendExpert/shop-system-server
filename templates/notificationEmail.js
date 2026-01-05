const sendEmail = require("../utils/emails/emailTransporter");

async function NotificationEmail(email, notification) {
    const displayName = email.split("@")[0];

    await sendEmail({
        to: email,
        subject: `Notification from – ${process.env.PROJECT_NAME}`,
        html: `
            <div style="
                background-color: #f1f5f9;
                padding: 50px 16px;
                font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            ">
                <div style="
                    max-width: 640px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 18px;
                    overflow: hidden;
                    box-shadow: 0 20px 45px rgba(15, 23, 42, 0.12);
                ">

                    <!-- Top Accent -->
                    <div style="
                        height: 6px;
                        background: linear-gradient(90deg, #6366f1, #22c55e);
                    "></div>

                    <!-- Header -->
                    <div style="padding: 34px 40px 20px;">
                        <h1 style="
                            margin: 0;
                            font-size: 26px;
                            font-weight: 800;
                            color: #0f172a;
                            letter-spacing: -0.3px;
                        ">
                            ${process.env.PROJECT_NAME}
                        </h1>

                        <p style="
                            margin-top: 8px;
                            font-size: 15px;
                            color: #64748b;
                        ">
                            System Notification
                        </p>
                    </div>

                    <!-- Divider -->
                    <div style="height: 1px; background-color: #e5e7eb;"></div>

                    <!-- Content -->
                    <div style="padding: 32px 40px;">
                        <p style="
                            font-size: 16px;
                            color: #1e293b;
                            margin-bottom: 18px;
                        ">
                            Hello <strong>${displayName}</strong>,
                        </p>

                        <p style="
                            font-size: 15.5px;
                            line-height: 1.7;
                            color: #475569;
                            margin-bottom: 26px;
                        ">
                            ${notification}
                        </p>

                        <div style="
                            margin-top: 28px;
                            padding: 18px;
                            background-color: #f8fafc;
                            border-radius: 12px;
                            font-size: 14px;
                            color: #475569;
                        ">
                            This is an automated system notification.  
                            Please do not reply to this email.
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="
                        padding: 26px 40px;
                        background-color: #f1f5f9;
                        border-top: 1px solid #e5e7eb;
                        text-align: center;
                        font-size: 13px;
                        color: #64748b;
                    ">
                        <strong style="color:#0f172a;">
                            ${process.env.PROJECT_NAME}
                        </strong>
                        <div style="margin-top: 6px;">
                            Secure • Reliable • System Alerts
                        </div>
                    </div>

                </div>
            </div>
        `
    });
}

module.exports = NotificationEmail;
