import { useState } from "react";
import {
  Store,
  Mail,
  Phone,
  MapPin,
  IndianRupee,
  Save,
  RotateCcw,
} from "lucide-react";

const defaultSettings = {
  storeName: "ShopSphere",
  email: "support@shopsphere.com",
  phone: "",
  address: "",
  currency: "INR",
  description: "Your trusted online shopping destination.",
};

function Settings() {
  const [settings, setSettings] = useState(() => {
    try {
      const savedSettings = localStorage.getItem("adminSettings");
      return savedSettings
        ? { ...defaultSettings, ...JSON.parse(savedSettings) }
        : defaultSettings;
    } catch (error) {
      console.error("Unable to load settings:", error);
      return defaultSettings;
    }
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      localStorage.setItem("adminSettings", JSON.stringify(settings));
      setMessage("Settings saved successfully!");
    } catch (error) {
      console.error("Unable to save settings:", error);
      setMessage("Unable to save settings. Please try again.");
    }
  };

  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all settings?"
    );

    if (confirmReset) {
      setSettings(defaultSettings);
      localStorage.setItem(
        "adminSettings",
        JSON.stringify(defaultSettings)
      );
      setMessage("Settings reset successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Store Settings
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your store information and preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="max-w-4xl rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-7">
          {/* Store Information */}
          <div className="mb-6 flex items-center gap-3 border-b pb-4">
            <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
              <Store size={24} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Store Information
              </h2>
              <p className="text-sm text-gray-500">
                Update your basic store details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Store Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Store Name *
              </label>

              <div className="relative">
                <Store
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  name="storeName"
                  value={settings.storeName}
                  onChange={handleChange}
                  required
                  placeholder="Enter store name"
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Store Email *
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="email"
                  name="email"
                  value={settings.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="tel"
                  name="phone"
                  value={settings.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Currency
              </label>

              <div className="relative">
                <IndianRupee
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                >
                  <option value="INR">INR - Indian Rupee</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="EUR">EUR - Euro</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Store Address
              </label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-4 text-gray-400"
                />

                <textarea
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Enter store address"
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Store Description
              </label>

              <textarea
                name="description"
                value={settings.description}
                onChange={handleChange}
                rows="3"
                placeholder="Write about your store"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="mt-5 rounded-lg bg-blue-50 p-3 text-sm font-medium text-blue-700">
              {message}
            </div>
          )}

          {/* Buttons */}
          <div className="mt-7 flex flex-wrap justify-end gap-3 border-t pt-5">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-600 transition hover:bg-gray-50"
            >
              <RotateCcw size={18} />
              Reset
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
            >
              <Save size={18} />
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Settings;
