import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    await resend.emails.send({
      from: "orders@cre8tiveteamwear.co.uk",
      to: process.env.QUOTE_TO_EMAIL!,
      subject: `New Rugby Quote - ${data.clubName}`,
      html: `
        <h2>New Rugby Quote Request</h2>

        <p><strong>Club:</strong> ${data.clubName}</p>
        <p><strong>Age Group:</strong> ${data.ageGroup}</p>
        <p><strong>Quantity:</strong> ${data.quantity}</p>

        <hr>

        <p><strong>Contact:</strong> ${data.contactName}</p>
        <p><strong>Email:</strong> ${data.contactEmail}</p>
        <p><strong>Phone:</strong> ${data.contactNumber}</p>

        <hr>

        <p><strong>Body Design:</strong> ${data.bodyDesign}</p>
        <p><strong>Sleeve Design:</strong> ${data.sleeveDesign}</p>
        <p><strong>Collar Design:</strong> ${data.collarDesign}</p>

       <p><strong>Font:</strong> ${data.fontStyle}</p>

${data.designImageUrl ? `
  <hr>
  <h3>Customer Design</h3>
  <img
    src="${data.designImageUrl}"
    alt="Customer Design"
    style="max-width:100%; border:1px solid #ddd; border-radius:8px;"
  />
` : ""}

<p><strong>Notes:</strong></p>
<p>${data.notes}</p>
      `,
    });

    await resend.emails.send({
      from: "orders@cre8tiveteamwear.co.uk",
      to: data.contactEmail,
      subject: "We've received your rugby kit quote request",
      html: `
        <h2>Thank you for your enquiry</h2>

        <p>We've received your rugby kit design request and will contact you shortly.</p>

        <p><strong>Club:</strong> ${data.clubName}</p>
        <p><strong>Body Design:</strong> ${data.bodyDesign}</p>
        <p><strong>Sleeve Design:</strong> ${data.sleeveDesign}</p>
        <p><strong>Collar Design:</strong> ${data.collarDesign}</p>

${data.designImageUrl ? `
  <hr>
  <h3>Your Design</h3>
  <img
    src="${data.designImageUrl}"
    alt="Your Rugby Kit Design"
    style="max-width:100%; border:1px solid #ddd; border-radius:8px;"
  />
` : ""}

<br>

<p>Cre8tive Teamwear</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false },
      { status: 500 }
    );
  }
}