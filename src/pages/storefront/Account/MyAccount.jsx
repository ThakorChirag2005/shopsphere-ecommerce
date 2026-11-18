
import { useState } from "react";

function MyAccount() {
  const [profile, setProfile] = useState({
    name: "Chirag Thakor",
    email: "chiragthakor932728@gmail.com",
    phone: "9327281427",
  });

  const [notifications, setNotifications] = useState(true);

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setMessage("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 md:px-8">

      <h1 className="text-3xl font-bold text-rose-900 mb-8">
        My Account
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Profile Information */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-xl font-bold mb-6">
            Profile Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Phone Number
              </label>

              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                pattern="[0-9]{10}"
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <button
              type="submit"
              className="bg-rose-900 text-white px-6 py-3 rounded-lg hover:bg-rose-950"
            >
              Save Changes
            </button>

            {message && (
              <p className="text-green-600">{message}</p>
            )}

          </form>
        </div>

        {/* Account Settings */}
        <div className="bg-white p-6 rounded-xl shadow-md h-fit">

          <h2 className="text-xl font-bold mb-6">
            Account Settings
          </h2>

          <label className="flex items-center justify-between gap-3">
            <span className="font-medium">
              Email Notifications
            </span>

            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) =>
                setNotifications(e.target.checked)
              }
              className="w-5 h-5 accent-rose-900"
            />
          </label>

          <p className="text-sm text-gray-500 mt-3">
            Receive updates about your orders and offers.
          </p>

        </div>

        {/* Saved Addresses */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-xl font-bold mb-6">
            Saved Addresses
          </h2>

          <div className="border rounded-lg p-5">
            <h3 className="font-semibold mb-2">
              Home Address
            </h3>

            <p className="text-gray-600">
              Kanjat, Anand, Gujarat - 388170
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MyAccount;
