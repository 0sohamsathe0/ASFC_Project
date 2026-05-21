import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditPlayerProfile = () => {
  const { playerId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    event: "",
    email: "",
    phone: "",
    institute: "",

    address: {
      addressLine1: "",
      addressLine2: "",
      pincode: "",
    },
  });

  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    fetchPlayer();
  }, []);

  const fetchPlayer = async () => {
  try {
    const cookies = document.cookie.split("; ");

    let token = cookies.find((cookie) =>
      cookie.startsWith("token=")
    );

    token = token ? token.split("=")[1] : null;

    const response = await axios.get(
      "http://localhost:5050/player/profile",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const player = response.data.player;

    const playerData = {
      fullName: player.fullName,
      gender: player.gender,
      dob: player.dob?.split("T")[0],
      event: player.event,
      email: player.email,
      phone: player.phone,
      institute: player.institute,

      address: {
        addressLine1:
          player.address?.addressLine1 || "",

        addressLine2:
          player.address?.addressLine2 || "",

        pincode:
          player.address?.pincode || "",
      },
    };

    setFormData(playerData);
    setOriginalData(playerData);

  } catch (error) {
    console.log(error);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const cookies = document.cookie.split("; ");

    let token = cookies.find((cookie) =>
      cookie.startsWith("token=")
    );

    token = token ? token.split("=")[1] : null;

    const payload = {};

    // Compare all fields
    for (const key in formData) {

      if (key === "address") {

        const changedAddress = {};

        for (const addressKey in formData.address) {

          if (
            formData.address[addressKey] !==
            originalData.address[addressKey]
          ) {
            changedAddress[addressKey] =
              formData.address[addressKey];
          }
        }

        if (
          Object.keys(changedAddress).length > 0
        ) {
          payload.address = changedAddress;
        }

      } else if (
        formData[key] !== originalData[key]
      ) {

        payload[key] = formData[key];
      }
    }

    // Nothing changed
    if (Object.keys(payload).length === 0) {
      alert("No changes detected");
      return;
    }

    // Resubmission settings
    payload.requestStatus = "Pending";
    payload.rejectionReason = "";
    payload.isEditable = false;

    console.log(payload);

    await axios.put(
      `http://localhost:5050/player/${playerId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(
      "Profile updated successfully and sent for review"
    );

    navigate("/player/profile");

  } catch (error) {

    console.log(error);

    alert(
      error.response?.data?.message ||
      "Something went wrong"
    );

  } finally {

    setLoading(false);

  }
};

  return (
    <div className="min-h-screen bg-gray-100 py-10">

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-purple-700 mb-8">
          Edit Profile
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <div className="grid md:grid-cols-2 gap-5">

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-3 rounded-lg"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-3 rounded-lg"
            />

            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="institute"
              value={formData.institute}
              onChange={handleChange}
              placeholder="Institute"
              className="border p-3 rounded-lg"
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="">
                Select Gender
              </option>

              <option value="Male">
                Male
              </option>

              <option value="Female">
                Female
              </option>

              <option value="Other">
                Other
              </option>
            </select>

            <select
              name="event"
              value={formData.event}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="">
                Select Event
              </option>

              <option value="Epee">
                Epee
              </option>

              <option value="Foil">
                Foil
              </option>

              <option value="Sabre">
                Sabre
              </option>
            </select>

          </div>

          <h2 className="font-bold text-xl mt-5">
            Address
          </h2>

          <div className="grid gap-4">

            <input
              type="text"
              name="address.addressLine1"
              value={formData.address.addressLine1}
              onChange={handleChange}
              placeholder="Address Line 1"
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="address.addressLine2"
              value={formData.address.addressLine2}
              onChange={handleChange}
              placeholder="Address Line 2"
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              name="address.pincode"
              value={formData.address.pincode}
              onChange={handleChange}
              placeholder="Pincode"
              className="border p-3 rounded-lg"
            />

          </div>

          <div className="flex gap-4 pt-5">

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg"
            >
              {loading
                ? "Updating..."
                : "Update Profile"}
            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/player/profile")
              }
              className="bg-gray-400 text-white px-6 py-3 rounded-lg"
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EditPlayerProfile;