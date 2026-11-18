
import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("Password reset link sent successfully! (Demo)");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-rose-900 mb-2">
          Forgot Password?
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Enter your email to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block font-medium mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-rose-800"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-900 text-white py-3 rounded-lg font-semibold hover:bg-rose-950"
          >
            Reset Password
          </button>

          {message && (
            <p className="text-center text-green-600">
              {message}
            </p>
          )}

        </form>

        <p className="text-center mt-6 text-gray-600">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-rose-800 font-semibold hover:underline"
          >
            Back to Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default ForgotPassword;
