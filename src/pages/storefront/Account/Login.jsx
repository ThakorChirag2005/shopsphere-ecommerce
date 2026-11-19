
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

    try {
      const savedUsers = localStorage.getItem("users");
      const users = savedUsers ? JSON.parse(savedUsers) : [];

      if (!Array.isArray(users)) {
        throw new Error("Saved users must be an array.");
      }

      const email = formData.email.trim().toLowerCase();
      if (
        email === "admin@shopsphere.com" &&
        formData.password === "admin123"
      ) {
        const demoAdmin = {
          id: "demo-admin",
          name: "ShopSphere Admin",
          email,
          phone: "",
          role: "admin",
        };
        localStorage.setItem("currentUser", JSON.stringify(demoAdmin));
        setMessage({
          type: "success",
          text: "Admin login successful!",
        });
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      const user = users.find(
        (savedUser) =>
          savedUser &&
          typeof savedUser.email === "string" &&
          savedUser.email.trim().toLowerCase() === email
      );

      if (!user || user.password !== formData.password) {
        setMessage({
          type: "error",
          text: "Invalid email or password. Please try again.",
        });
        return;
      }

      const currentUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        role: user.role || "customer",
      };

      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      setMessage({
        type: "success",
        text: "Login successful! You are now signed in.",
      });
      navigate("/account", { replace: true });
    } catch (error) {
      console.error("Unable to sign in with the saved account.", error);
      setMessage({
        type: "error",
        text: "We could not read or save your demo account. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-rose-900 mb-2">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Login to your ShopSphere account
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

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

          <div>
            <label className="block font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-rose-800 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-900 text-white py-3 rounded-lg font-semibold hover:bg-rose-950"
          >
            Login
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
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-rose-800 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
