import { Otp } from "../committee/data_types";
const qrcode = require('qrcode');


const emailTemplate = (otp: Otp, voterName: string, textQRCode: string) => {
    // console.log("QR CODE: ", textQRCode);

    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Secure Transmission of Citizen Credentials</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 90%;
                margin: 0 auto;
                padding: 20px;
                background-color: #f8f8f8;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            h1 {
                text-align: center;
                margin-top: 0;
            }
            p {
                margin-top: 10px;
                text-align: justify;
            }
            .credentials {
                background-color: #f0f0f0;
                border: 1px solid #cccccc;
                border-radius: 6px;
                padding: 20px;
                margin-top: 20px;
            }
            .credentials p {
                margin: 0;
                font-size: 14px;
            }
            .credentials span {
                display: block;
                margin-top: 10px;
                background-color: #ffffff;
                border: 1px solid #cccccc;
                border-radius: 4px;
                padding: 10px;
                font-size: 12px;
                overflow-wrap: break-word;
                word-wrap: break-word;
                word-break: break-all;
            }
            .credentials img {
                display: block;
                margin: 0 auto;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Secure Transmission of Citizen Credentials</h1>
            <p>Dear Citizen <strong>${voterName}</strong>,</p>
            <p>We hope this email finds you well.</p>
            <p>In keeping with our commitment to protecting sensitive information, we're providing you with the necessary credentials for the final voting phase. Below is the required data to set up your OTP. Please keep this information private.</p>
            <div class="credentials">
                <p><strong>CITIZEN CREDENTIALS</strong></p>
                <span><strong>ASCII: </strong>${otp.ascii}</span>
                <span><strong>HEX: </strong>${otp.hex}</span>
                <span><strong>Base32: </strong>${otp.base32}</span>
                <span><strong>OTP Auth URL: </strong>${otp.otpauth_url}</span>
                <span><strong>QR CODE: </strong><img src="${textQRCode}" /></span>
            </div>
            <p>Please note that these credentials are highly confidential and should only be accessed by authorized individuals for the specified purpose. We urge you to handle this information with care and adhere strictly to security protocols.</p>
            <p>If you need assistance, please contact our support team at [support@election.angola.com].</p>
            <p>We appreciate your cooperation in maintaining the integrity and security of our systems and data.</p>
            <p>Warm regards,<br>Angolan Election Committee<br>Desk Committee<br>codetyper.angola@gmail.com</p>
        </div>
    </body>
    </html>
    
    `;

    return html;
}

export default emailTemplate;
