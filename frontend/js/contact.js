document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("contactForm");

    if (!form) return;

    form.addEventListener("submit", async (e) => {

        e.preventDefault();

        const button = form.querySelector("button[type='submit']");

        const originalText = button.innerHTML;

        button.disabled = true;
        button.innerHTML = "Sending...";

        const formData = {

            name: document.getElementById("name").value.trim(),

            email: document.getElementById("email").value.trim(),

            phone: document.getElementById("phone").value.trim(),

            service: document.getElementById("service").value,

            message: document.getElementById("message").value.trim()

        };

        try {

            const result = await submitContactForm(formData);

            alert(result.message);

            form.reset();

        } catch (error) {

            alert(error.message);

        } finally {

            button.disabled = false;

            button.innerHTML = originalText;

        }

    });

});