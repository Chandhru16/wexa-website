const express = require("express");
const router = express.Router();

// Validation Middleware
const {
    contactValidation,
    validate
} = require("../middleware/validator");

// Controller Functions
const {
    createContact,
    getAllContacts,
    getContactById,
    deleteContact
} = require("../controllers/contactController");

// ======================================
// POST - Submit Contact Form
// ======================================
router.post(
    "/",
    contactValidation,
    validate,
    createContact
);

// ======================================
// GET - All Contact Enquiries
// ======================================
router.get(
    "/",
    getAllContacts
);

// ======================================
// GET - Single Contact Enquiry
// ======================================
router.get(
    "/:id",
    getContactById
);

// ======================================
// DELETE - Contact Enquiry
// ======================================
router.delete(
    "/:id",
    deleteContact
);

module.exports = router;