
import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setMessage({ type: "", text: "" });
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (formData.password !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Passwords do not match. Please try again.",
      });
      return;
    }

    const email = formData.email.trim().toLowerCase();

    try {
      const savedUsers = localStorage.getItem("users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      if (!Array.isArray(users)) {
        throw new Error("Saved users must be an array.");
      }

      const emailAlreadyRegistered = users.some(
        (user) =>
          user &&
          typeof user.email === "string" &&
          user.email.trim().toLowerCase() === email
      );

      if (emailAlreadyRegistered) {
        setMessage({
          type: "error",
          text: "An account with this email already exists. Please log in.",
        });
        return;
      }

      const newUser = {
        id: Date.now(),
        name: formData.name.trim(),
        email,
        password: formData.password,
        phone: "",
        role: "customer",
      };

      localStorage.setItem("users", JSON.stringify([...users, newUser]));
      setMessage({
        type: "success",
        text: "Registration successful! You can now log in.",
      });
    } catch (error) {
      console.error("Unable to save the demo account.", error);
      setMessage({
        type: "error",
        text: "We could not save your demo account. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-rose-900 mb-2">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Join ShopSphere today
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-medium mb-2">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="Create password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-900 text-white py-3 rounded-lg font-semibold hover:bg-rose-950"
          >
            Register
          </button>

          {message.text && (
            <p
              role="status"
              className={`text-center ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}

        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-rose-800 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
