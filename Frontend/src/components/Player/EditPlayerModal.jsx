import { useState } from "react";
import axios from "axios";

const EditPlayerModal = ({ player, onClose, refresh }) => {
  const [formData, setFormData] = useState({
    fullName: player.fullName || "",
    email: player.email || "",
    phone: player.phone || "",
    gender: player.gender || "",
    dob: player.dob?.slice(0, 10) || "",
    aadharCard: player.aadharCard || "",
    event: player.event || "",
    institute: player.institute || "",

    address: {
      addressLine1: player.address?.addressLine1 || "",
      addressLine2: player.address?.addressLine2 || "",
      pincode: player.address?.pincode || "",
    },
  });

  // 🔹 Handle normal fields
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Handle nested address fields
  const handleAddressChange = (e) => {
    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [e.target.name]: e.target.value,
      },
    });
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(
        `http://localhost:5050/player/update/${player._id}`,
        formData
      );

      refresh();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center overflow-y-auto">
      <div className="bg-slate-800 p-6 rounded-xl w-[600px] text-white">
        <h2 className="text-xl font-semibold mb-4">Edit Player</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
{/* 🔹 Personal Details */}
<div>
  <h3 className="text-sm text-gray-400 mb-2 border-b border-slate-600 pb-1">
    Personal Details
  </h3>

  <div className="grid grid-cols-2 gap-3 mt-2">
    <input name="fullName" value={formData.fullName} onChange={handleChange} className="p-2 rounded bg-slate-700" placeholder="Full Name" />

    <select name="gender" value={formData.gender} onChange={handleChange} className="p-2 rounded bg-slate-700">
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>

    <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="p-2 rounded bg-slate-700" />
  </div>
</div>

{/* 🔹 Contact Info */}
<div>
  <h3 className="text-sm text-gray-400 mb-2 border-b border-slate-600 pb-1">
    Contact Information
  </h3>

  <div className="grid grid-cols-2 gap-3 mt-2">
    <input name="email" value={formData.email} onChange={handleChange} className="p-2 rounded bg-slate-700" placeholder="Email" />

    <input name="phone" value={formData.phone} onChange={handleChange} className="p-2 rounded bg-slate-700" placeholder="Phone" />
  </div>
</div>

{/* 🔹 Event & Institute */}
<div>
  <h3 className="text-sm text-gray-400 mb-2 border-b border-slate-600 pb-1">
    Event & Institute
  </h3>

  <div className="grid grid-cols-2 gap-3 mt-2">
    <input name="event" value={formData.event} onChange={handleChange} className="p-2 rounded bg-slate-700" placeholder="Event" />

    <input name="institute" value={formData.institute} onChange={handleChange} className="p-2 rounded bg-slate-700" placeholder="Institute" />
  </div>
</div>

{/* 🔹 Address */}
<div>
  <h3 className="text-sm text-gray-400 mb-2 border-b border-slate-600 pb-1">
    Address
  </h3>

  <input name="addressLine1" value={formData.address.addressLine1} onChange={handleAddressChange} className="w-full p-2 mb-2 rounded bg-slate-700" placeholder="Address Line 1" />

  <input name="addressLine2" value={formData.address.addressLine2} onChange={handleAddressChange} className="w-full p-2 mb-2 rounded bg-slate-700" placeholder="Address Line 2" />

  <input name="pincode" value={formData.address.pincode} onChange={handleAddressChange} className="w-full p-2 rounded bg-slate-700" placeholder="Pincode" />
</div>

{/* 🔹 Documents */}
<div>
  <h3 className="text-sm text-gray-400 mb-2 border-b border-slate-600 pb-1">
    Documents
  </h3>

  <div className="flex gap-4 mt-2">
    <div>
      <p className="text-xs mb-1">Photo</p>
      <img src={player.photoURL} className="w-20 h-20 rounded" />
    </div>

    <div>
      <p className="text-xs mb-1">Aadhar</p>
      <img src={player.aadharCardURL} className="w-20 h-20 rounded" />
    </div>
  </div>
</div>
          {/* 🔹 Buttons */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 px-3 py-1 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-green-500 px-3 py-1 rounded"
            >
              Save Changes
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditPlayerModal;