export const adminHajjInquiryTemplate = (data: {
  fullName: string;
  phoneNumber: string;
  packageType?: string;
  hotelCategory?: string;
  departureDate?: string;
  departureAirport?: string;
  adults: number;
  children: number;
}): string => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>New Hajj Quote Request</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background:#1C398E;padding:32px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;letter-spacing:1px;">New Shifting Hajj Quote Request</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="color:#333;font-size:15px;margin:0 0 24px;font-weight:bold;">
                A new Hajj customization request has been submitted:
              </p>

              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#888;font-size:12px;display:block;">Full Name</span>
                    <span style="color:#222;font-size:15px;font-weight:bold;">${data.fullName}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#888;font-size:12px;display:block;">Phone Number</span>
                    <span style="color:#222;font-size:15px;">${data.phoneNumber}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#888;font-size:12px;display:block;">Package Type</span>
                    <span style="color:#222;font-size:15px;">${data.packageType ?? 'Not specified'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#888;font-size:12px;display:block;">Hotel Category</span>
                    <span style="color:#222;font-size:15px;">${data.hotelCategory ?? 'Not specified'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#888;font-size:12px;display:block;">Departure Date</span>
                    <span style="color:#222;font-size:15px;">${data.departureDate ?? 'Not specified'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#888;font-size:12px;display:block;">Departure Airport</span>
                    <span style="color:#222;font-size:15px;">${data.departureAirport ?? 'Not specified'}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
                    <span style="color:#888;font-size:12px;display:block;">Adults</span>
                    <span style="color:#222;font-size:15px;font-weight:bold;">${data.adults}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <span style="color:#888;font-size:12px;display:block;">Children</span>
                    <span style="color:#222;font-size:15px;font-weight:bold;">${data.children}</span>
                  </td>
                </tr>
              </table>

              <div style="background:#f0f4ff;border-left:4px solid #1C398E;padding:14px 16px;margin-top:24px;border-radius:4px;">
                <p style="margin:0;color:#1C398E;font-size:13px;font-weight:bold;">
                  Total Travellers: ${data.adults + data.children} (${data.adults} Adult${data.adults > 1 ? 's' : ''}, ${data.children} Child${data.children !== 1 ? 'ren' : ''})
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f9;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="color:#aaa;font-size:12px;margin:0;">Admin Panel — Al-Ahsan Travels © ${new Date().getFullYear()}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;