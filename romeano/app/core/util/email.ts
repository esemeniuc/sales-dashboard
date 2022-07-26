import nodemailer from "nodemailer"
import { BACKEND_ENDPOINT } from "../config"
import previewEmail from "preview-email"

export const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 465,
  auth: {
    user: "apikey",
    pass: "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",
  },
})

function recipientProcessor(recipients: string[]) {
  return process.env.NODE_ENV === "production" ? recipients : ["eric.semeniuc@gmail.com"]
}

//invitation for a new stakeholder
export async function sendInvite(
  customerName: string,
  vendorName: string,
  inviterFirstName: string,
  inviteeEmailAddress: string,
  magicLink: string
) {
  const body = `<h1>${inviterFirstName} has shared a customer portal with you</h1>
<br/>
<a href="${BACKEND_ENDPOINT}/magicLink/${magicLink}">Open Portal</a>`
  const msg = {
    from: `"Romeano" <hey@romeano.com>`,
    to: recipientProcessor([inviteeEmailAddress]),
    subject: `${customerName} Customer Portal Invitation - ${vendorName}`, // Subject line
    html: body,
  }
  if (process.env.NODE_ENV !== "production") {
    await previewEmail(msg)
  } else {
    const info = await transporter.sendMail(msg)
  }
}

//login for existing stakeholder
export async function sendPortalLoginLink(
  customerName: string,
  vendorName: string,
  inviterFirstName: string,
  inviteeEmailAddress: string,
  magicLink: string
) {
  const body = `<h1>Hello!</h1>
<p>
You asked us to send you a magic link for quickly signing in to your ${customerName} portal from ${vendorName}. Your wish is our command!
</p>
<br/>
<a href="${BACKEND_ENDPOINT}/magicLink/${magicLink}">Sign in to ${customerName} portal</a>`

  const msg = {
    from: `"Romeano" <hey@romeano.com>`,
    to: recipientProcessor([inviteeEmailAddress]),
    subject: `${customerName} Customer Portal Login - ${vendorName}`, // Subject line
    html: body,
  }
  if (process.env.NODE_ENV !== "production") {
    await previewEmail(msg)
  } else {
    const info = await transporter.sendMail(msg)
  }
}

// export async function sendAELoginLink(aeFirstName: string,
//                                       aeEmail: string,
//                                       magicLink: string) {
//   const body = `<h1>Hello!</h1>
// <p>
// You asked us to send you a magic link for quickly signing in to your buyer portal. Your wish is our command!
// </p>
// <br/>
// <a href="${BACKEND_ENDPOINT}/magicLink/${magicLink}">Sign in</a>`
//
//   const info = await transporter.sendMail({
//     from: `"Romeano" <hey@romeano.com>`,
//     to: recipientProcessor([aeEmail]),
//     subject: `Magic sign-in link for ${aeFirstName} on Romeano`, // Subject line
//     html: body
//   })
// }
