const forgotPasswordTemplate = ({ email, name, otp }) => {
  return `

<div style="background:#f4f6f8;padding:30px 10px;font-family:Segoe UI,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" align="center">
    <tr>
      <td align="center">

        <!-- Shadow Wrapper -->
        <table width="100%" style="max-width:440px;background:#e6e6e6;border-radius:14px;" cellpadding="0" cellspacing="0">
          <tr>
            <td style="padding:4px;border-radius:14px;">

              <!-- Main Card -->
              <table width="100%" style="background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;"box-shadow:0 8px 20px rgba(0,0,0,0.08); cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:40px 30px;">
                          
       

                    <!-- Icon -->
                    <div style="
                        width:70px;
                        height:70px;
                        background:#f3e8d7;
                        border-radius:50%;
                        line-height:70px;
                        font-size:32px;
                        color:#b58944;
                        margin:0 auto 20px auto;
                    ">
                      🔐
                    </div>

                    <!-- Heading -->
                    <h2 style="margin:0 0 15px 0;color:#333;font-size:22px;">
                      Verify Account
                    </h2>

                    <!-- Greeting -->
                    <p style="margin:0 0 10px 0;color:#555;font-size:14px;">
                      Dear <strong>${name}</strong>,
                    </p>

                    <!-- Subtitle -->
                    <p style="margin:0 0 20px 0;color:#666;font-size:14px;line-height:1.6;">
                      Use the OTP code below to complete your verification.
                      This code will expire in 5 minutes.
                    </p>

                    <!-- OTP BOX -->
                    <div style="
                        margin:25px 0;
                        padding:18px 20px;
                        font-size:30px;
                        letter-spacing:8px;
                        font-weight:bold;
                        color:#333;
                        background:#ffffff;
                        border:2px solid #b58944;
                        border-radius:10px;
                        display:inline-block;
                    ">
                      ${otp}
                    </div>

                    <!-- Email Info -->
                    <p style="margin-top:25px;font-size:14px;color:#555;">
                      Verification requested for:<br>
                      <strong style="color:#b58944;">${email}</strong>
                    </p>

                    <!-- Footer -->
                    <p style="margin-top:20px;font-size:12px;color:#888;">
                      If you didn’t request this, you can safely ignore this message.
                    </p>

                  </td>
                </tr>
              </table>
              <!-- End Main Card -->

            </td>
          </tr>
        </table>
        <!-- End Shadow Wrapper -->

      </td>
    </tr>
  </table>
</div>

    `;
};

export default forgotPasswordTemplate;
