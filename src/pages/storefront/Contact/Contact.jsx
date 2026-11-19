
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setSuccessMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      const savedMessages = localStorage.getItem("contactMessages");
      const messages = savedMessages ? JSON.parse(savedMessages) : [];
      const safeMessages = Array.isArray(messages) ? messages : [];

      localStorage.setItem(
        "contactMessages",
        JSON.stringify([
          ...safeMessages,
          { ...formData, id: Date.now(), createdAt: new Date().toISOString() },
        ])
      );
      setSuccessMessage(
        "Your message has been submitted successfully!"
      );
    } catch (error) {
      console.error("Unable to save contact message:", error);
      setSuccessMessage(
        "We could not save your message. Please try again."
      );
      return;
    }

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12 md:px-8">

      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-rose-900">
            Contact Us
          </h1>

          <p className="text-gray-500 mt-3">
            Have any questions? We would love to hear from you.
          </p>
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-md">

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className="block font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block font-medium mb-2">
                Subject
              </label>

              <input
                type="text"
                name="subject"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            {/* Message */}
            <div>
              <label className="block font-medium mb-2">
                Message
              </label>

              <textarea
                name="message"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-rose-900 text-white py-3 rounded-lg font-semibold hover:bg-rose-950"
            >
              Send Message
            </button>

            {/* Success Message */}
            {successMessage && (
              <p className="text-center text-green-600 font-medium">
                {successMessage}
              </p>
            )}

          </form>

        </div>

      </div>

    </div>
  );
}

export default Contact;
