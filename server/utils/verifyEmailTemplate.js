const verifyEmailTemplate = ({ email, name, url }) => {
  return `
  <div style="background:#f4f6f8;padding:40px 0;font-family:Segoe UI,Arial,sans-serif;">
    
    <div style="
        max-width:420px;
        margin:auto;
        background:#ffffff;
        padding:40px 30px;
        border-radius:12px;
        text-align:center;
    ">

      <!-- Email Icon -->
      <div style="
          width:70px;
          height:70px;
          margin:0 auto 20px;
          background:#e6f4ea;
          border-radius:50%;
          display:flex;
          justify-content:center;
          align-items:center;
          font-size:32px;">
          📩
      </div>

      <h2 style="margin-bottom:15px;color:#333;">
        Please verify your email
      </h2>

      <p style="color:#555;margin-bottom:10px;">
        You're almost there! We sent an email to
        <strong>${email}</strong>
      </p>

      <p style="color:#666;font-size:14px;line-height:1.6;">
        Hello ${name}, click below button to finish signup.
      </p>
<a href="${url}" style="
  display:inline-block;
  margin-top:20px;
  padding:12px 28px;
  background:#c89a54;
  color:#ffffff;
  text-decoration:none;
  border-radius:25px;
  font-weight:600;
  border:1px solid #b58944;
  box-shadow:0 5px 0 #22201d;
  transition:all .15s ease;
">
  Verify Email
</a>
      <p style="margin-top:20px;font-size:13px;color:#888;">
        If button not working, copy link:<br>
        ${url}
      </p>

    </div>
  </div>
  `;
};

export default verifyEmailTemplate;
