import Contact from "../models/contact-us-model.js";

export const createContact = async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    await Contact.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (error) {
    console.error("Contact submission failed.");

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .select("fullName email phone subject message isRead createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts.map((contact) => ({
        _id: contact._id,
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
        isRead: contact.isRead,
        createdAt: contact.createdAt,
        updatedAt: contact.updatedAt,
      })),
    });
  } catch (error) {
    console.error("Contact listing failed.");

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts.",
    });
  }
};
