const Contact = require("../models/Contact");

// Send an email via Brevo's transactional email API.
// Using the API instead of SMTP avoids SMTP auth/connection issues entirely —
// just an HTTPS POST with the API key in a header.
async function sendBrevoEmail({ toEmail, toName, fromName, subject, htmlContent }) {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "api-key": process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: { name: fromName, email: process.env.SENDER_EMAIL },
            to: [{ email: toEmail, name: toName }],
            subject,
            htmlContent
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
    }

    return response.json();
}

// ================================
// Create Contact
// ================================
exports.createContact = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            service,
            message
        } = req.body;

        // Save to MongoDB
        const contact = await Contact.create({
            name,
            email,
            phone,
            service,
            message
        });

        // Email sending is best-effort: the enquiry is already saved above,
        // so an email hiccup shouldn't make the visitor see a failure for
        // something that actually succeeded. Log and move on if it fails.
        try {

            // Send Email to Admin
            await sendBrevoEmail({
                toEmail: process.env.ADMIN_EMAIL,
                toName: "WEXA Team",
                fromName: "WEXA Website",
                subject: "🚀 New Project Enquiry",
                htmlContent: `
                    <h2>New Client Enquiry</h2>
                    <hr>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Service:</strong> ${service}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p>
                `
            });

            // Auto Reply to Client
            await sendBrevoEmail({
                toEmail: email,
                toName: name,
                fromName: "WEXA Team",
                subject: "Thank You for Contacting WEXA",
                htmlContent: `
                    <h2>Hello ${name},</h2>

                    <p>Thank you for contacting <strong>WEXA</strong>.</p>

                    <p>We have successfully received your enquiry.</p>

                    <p>Our team will contact you within <strong>24 hours</strong>.</p>

                    <br>

                    <p>Regards,</p>
                    <h3>WEXA Team</h3>
                `
            });

        } catch (emailError) {
            console.error("Email sending failed (enquiry was still saved):", emailError);
        }

        res.status(201).json({
            success: true,
            message: "Enquiry submitted successfully.",
            data: contact
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

// ================================
// Get All Contacts
// ================================
exports.getAllContacts = async (req, res) => {

    try {

        const contacts = await Contact
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            total: contacts.length,
            data: contacts
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ================================
// Get Contact By ID
// ================================
exports.getContactById = async (req, res) => {

    try {

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// ================================
// Delete Contact
// ================================
exports.deleteContact = async (req, res) => {

    try {

        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Contact deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};