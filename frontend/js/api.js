// ==========================================
// WEXA API Configuration
// ==========================================

// Development
//const API_BASE_URL = "http://localhost:5000/api";

// Production (Uncomment when deployed)
const API_BASE_URL = "https://wexa-website.onrender.com/api";

// ==========================================
// Generic API Request
// ==========================================

async function apiRequest(endpoint, method = "GET", data = null) {

    const options = {
        method,
        headers: {
            "Content-Type": "application/json"
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        const result = await response.json();

        if (!response.ok) {
            // Validation errors come back as an `errors` array (one entry per
            // invalid field) rather than a single `message` string — surface
            // those instead of falling back to a generic message.
            if (Array.isArray(result.errors) && result.errors.length > 0) {
                const fieldMessages = result.errors
                    .map(err => err.message)
                    .join("\n");
                throw new Error(fieldMessages);
            }
            throw new Error(result.message || "Something went wrong");
        }

        return result;

    } catch (error) {

        console.error("API Error:", error);

        throw error;

    }

}

// ==========================================
// Contact APIs
// ==========================================

async function submitContactForm(formData) {
    return await apiRequest("/contact", "POST", formData);
}

async function getAllContacts() {
    return await apiRequest("/contact");
}

async function getContact(id) {
    return await apiRequest(`/contact/${id}`);
}

async function deleteContact(id) {
    return await apiRequest(`/contact/${id}`, "DELETE");
}

// ==========================================
// Health Check
// ==========================================

async function checkServerStatus() {

    try {

        const response = await fetch("http://localhost:5000/");

        if (!response.ok) {
            throw new Error("Server Offline");
        }

        const data = await response.json();

        console.log("✅ Backend Connected");
        console.log(data);

    } catch (error) {

        console.error("❌ Backend Connection Failed");
        console.error(error.message);

    }

}

checkServerStatus();