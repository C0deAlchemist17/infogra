import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, userEmail, userName } = await request.json()

    // Email configuration
    const toEmail = 'infograofficial1@gmail.com'
    const subject = `New Message from INFOGRA Website${userName ? ` - ${userName}` : ''}`
    const body = `
New message received from INFOGRA website:

${userName ? `Name: ${userName}` : ''}
${userEmail ? `Email: ${userEmail}` : ''}

Message:
${message}

---
Sent from INFOGRA website chatbot
    `.trim()

    // In production, you would use a service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - Resend
    // - AWS SES
    // - Mailgun

    // For now, we'll log the email data
    console.log('=== EMAIL TO BE SENT ===')
    console.log('To:', toEmail)
    console.log('Subject:', subject)
    console.log('Body:', body)
    console.log('======================')

    // Simulate email sending (replace with actual email service in production)
    // Example with Resend (uncomment and configure):
    /*
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: 'noreply@infogra.com',
      to: toEmail,
      subject: subject,
      text: body,
    })
    */

    return NextResponse.json({
      success: true,
      message: 'Message logged successfully',
      email: toEmail,
    })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}
