import { useState } from "react";

const ACCOUNT_STORAGE_KEY = "shopSphereAccount";

const EMPTY_PROFILE = {
  name: "",
  email: "",
  phone: "",
};

const EMPTY_ADDRESS = {
  label: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

function getEmptyAccountData() {
  return {
    profile: { ...EMPTY_PROFILE },
    addresses: [],
    settings: {
      emailNotifications: true,
    },
  };
}

function getDefaultAccountData() {
  const savedUser = localStorage.getItem("currentUser");
  const currentUser = savedUser ? JSON.parse(savedUser) : {};
  const defaultData = getEmptyAccountData();

  return {
    profile: {
      ...defaultData.profile,
      name: currentUser?.name || defaultData.profile.name,
      email: currentUser?.email || defaultData.profile.email,
      phone: currentUser?.phone || defaultData.profile.phone,
    },
    addresses: defaultData.addresses,
    settings: defaultData.settings,
  };
}

function getInitialAccountData() {
  const savedAccount = localStorage.getItem(ACCOUNT_STORAGE_KEY);

  if (!savedAccount) {
    return getDefaultAccountData();
  }

  const accountData = JSON.parse(savedAccount);

  if (
    !accountData ||
    typeof accountData !== "object" ||
    Array.isArray(accountData) ||
    (accountData.addresses !== undefined &&
      !Array.isArray(accountData.addresses)) ||
    (accountData.profile !== undefined &&
      (!accountData.profile || typeof accountData.profile !== "object")) ||
    (accountData.settings !== undefined &&
      (!accountData.settings || typeof accountData.settings !== "object"))
  ) {
    throw new Error("Saved account data has an invalid format.");
  }

  const defaultData = getDefaultAccountData();

  return {
    profile: {
      ...defaultData.profile,
      ...accountData.profile,
    },
    addresses: accountData.addresses || [],
    settings: {
      ...defaultData.settings,
      ...accountData.settings,
    },
  };
}

function MyAccount() {
  const [initialState] = useState(() => {
    try {
      return {
        accountData: getInitialAccountData(),
        error: "",
      };
    } catch (error) {
      console.error("Unable to load saved account data.", error);
      return {
        accountData: getEmptyAccountData(),
        error: "Saved account data could not be loaded. Please review and save it again.",
      };
    }
  });
  const [accountData, setAccountData] = useState(initialState.accountData);
  const [profile, setProfile] = useState(initialState.accountData.profile);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [message, setMessage] = useState({
    type: initialState.error ? "error" : "",
    text: initialState.error,
  });

  const saveAccountData = (nextAccountData, successText) => {
    try {
      localStorage.setItem(
        ACCOUNT_STORAGE_KEY,
        JSON.stringify(nextAccountData)
      );
      setAccountData(nextAccountData);
      setMessage({ type: "success", text: successText });
      return true;
    } catch (error) {
      console.error("Unable to save account data.", error);
      setMessage({
        type: "error",
        text: "We could not save your changes. Please try again.",
      });
      return false;
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();

    const updatedProfile = {
      name: profile.name.trim(),
      email: profile.email.trim().toLowerCase(),
      phone: profile.phone.trim(),
    };
    const nextAccountData = {
      ...accountData,
      profile: updatedProfile,
    };

    if (saveAccountData(nextAccountData, "Profile updated successfully!")) {
      setProfile(updatedProfile);

      try {
        const savedUser = localStorage.getItem("currentUser");
        const currentUser = savedUser ? JSON.parse(savedUser) : null;
        if (currentUser) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              ...currentUser,
              ...updatedProfile,
            })
          );
        }
      } catch (error) {
        console.error("Unable to synchronize the signed-in profile.", error);
      }
    }
  };

  const handleAddressChange = (e) => {
    setAddressForm({
      ...addressForm,
      [e.target.name]: e.target.value,
    });
    setMessage({ type: "", text: "" });
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();

    const updatedAddress = {
      ...addressForm,
      id: editingAddressId || Date.now(),
    };
    const nextAddresses = editingAddressId
      ? accountData.addresses.map((address) =>
          address.id === editingAddressId ? updatedAddress : address
        )
      : [...accountData.addresses, updatedAddress];
    const nextAccountData = {
      ...accountData,
      addresses: nextAddresses,
    };
    const successText = editingAddressId
      ? "Address updated successfully!"
      : "Address added successfully!";

    if (saveAccountData(nextAccountData, successText)) {
      setAddressForm(EMPTY_ADDRESS);
      setEditingAddressId(null);
    }
  };

  const handleEditAddress = (address) => {
    setAddressForm({
      label: address.label,
      address: address.address,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditingAddressId(address.id);
    setMessage({ type: "", text: "" });
  };

  const handleDeleteAddress = (addressId) => {
    const nextAccountData = {
      ...accountData,
      addresses: accountData.addresses.filter(
        (address) => address.id !== addressId
      ),
    };

    saveAccountData(nextAccountData, "Address deleted successfully!");
  };

  const handleNotificationChange = (e) => {
    const nextAccountData = {
      ...accountData,
      settings: {
        ...accountData.settings,
        emailNotifications: e.target.checked,
      },
    };

    saveAccountData(nextAccountData, "Account settings saved.");
  };

  const handleCancelAddressEdit = () => {
    setAddressForm(EMPTY_ADDRESS);
    setEditingAddressId(null);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 md:px-8">
      <h1 className="text-3xl font-bold text-rose-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6">Profile Information</h2>

          <form onSubmit={handleProfileSubmit} className="space-y-5">
            <div>
              <label htmlFor="profile-name" className="block font-medium mb-2">
                Full Name
              </label>
              <input
                id="profile-name"
                type="text"
                name="name"
                autoComplete="name"
                value={profile.name}
                onChange={handleProfileChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="profile-email"
                className="block font-medium mb-2"
              >
                Email Address
              </label>
              <input
                id="profile-email"
                type="email"
                name="email"
                autoComplete="email"
                value={profile.email}
                onChange={handleProfileChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="block font-medium mb-2"
              >
                Phone Number
              </label>
              <input
                id="profile-phone"
                type="tel"
                name="phone"
                autoComplete="tel"
                value={profile.phone}
                onChange={handleProfileChange}
                pattern="[0-9]{10}"
                title="Enter a valid 10 digit phone number"
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
          </form>

          {message.text && (
            <p
              role="status"
              className={`mt-4 ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md h-fit">
          <h2 className="text-xl font-bold mb-6">Account Settings</h2>
          <label className="flex items-center justify-between gap-3">
            <span className="font-medium">Email Notifications</span>
            <input
              type="checkbox"
              checked={accountData.settings.emailNotifications}
              onChange={handleNotificationChange}
              className="w-5 h-5 accent-rose-900"
            />
          </label>
          <p className="text-sm text-gray-500 mt-3">
            Receive updates about your orders and offers.
          </p>
        </div>

        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-6">Saved Addresses</h2>

          {accountData.addresses.length === 0 ? (
            <p className="text-gray-500 mb-6">You have no saved addresses.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {accountData.addresses.map((address) => (
                <div
                  key={address.id}
                  className="border rounded-lg p-5"
                >
                  <h3 className="font-semibold mb-2">{address.label}</h3>
                  <p className="text-gray-600">{address.address}</p>
                  <p className="text-gray-600">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  <div className="flex gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => handleEditAddress(address)}
                      className="text-rose-800 font-semibold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-600 font-semibold hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form
            onSubmit={handleAddressSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            <div>
              <label
                htmlFor="address-label"
                className="block font-medium mb-2"
              >
                Address Label
              </label>
              <input
                id="address-label"
                type="text"
                name="label"
                placeholder="Home, Work, etc."
                value={addressForm.label}
                onChange={handleAddressChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="address-line"
                className="block font-medium mb-2"
              >
                Street Address
              </label>
              <input
                id="address-line"
                type="text"
                name="address"
                autoComplete="street-address"
                placeholder="Full Address"
                value={addressForm.address}
                onChange={handleAddressChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label htmlFor="address-city" className="block font-medium mb-2">
                City
              </label>
              <input
                id="address-city"
                type="text"
                name="city"
                autoComplete="address-level2"
                value={addressForm.city}
                onChange={handleAddressChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="address-state"
                className="block font-medium mb-2"
              >
                State
              </label>
              <input
                id="address-state"
                type="text"
                name="state"
                autoComplete="address-level1"
                value={addressForm.state}
                onChange={handleAddressChange}
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label
                htmlFor="address-pincode"
                className="block font-medium mb-2"
              >
                Pincode
              </label>
              <input
                id="address-pincode"
                type="text"
                name="pincode"
                autoComplete="postal-code"
                value={addressForm.pincode}
                onChange={handleAddressChange}
                pattern="[0-9]{6}"
                title="Enter a valid 6 digit pincode"
                required
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <button
                type="submit"
                className="bg-rose-900 text-white px-6 py-3 rounded-lg hover:bg-rose-950"
              >
                {editingAddressId ? "Update Address" : "Add Address"}
              </button>
              {editingAddressId && (
                <button
                  type="button"
                  onClick={handleCancelAddressEdit}
                  className="border px-6 py-3 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
