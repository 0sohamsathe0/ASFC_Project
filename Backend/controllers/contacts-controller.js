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

    const contact = await Contact.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
      data: contact,
    });
  } catch (error) {
    console.error("Create Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to send message.",
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    console.error("Get Contacts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch contacts.",
    });
  }
};