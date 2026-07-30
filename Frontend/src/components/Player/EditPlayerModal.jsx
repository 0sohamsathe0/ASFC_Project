import { useState, useEffect } from "react";
import { CircularProgress, Snackbar, Alert } from "@mui/material";
import { api } from "../api";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";

const EditPlayerModal = ({ player, onClose, refresh }) => {
  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  // Initialize player data
  useEffect(() => {
    if (!player) return;

    const initialData = {
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
    };

    setFormData(initialData);
    setOriginalData(initialData);
  }, [player]);

  // Handle normal inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle nested address fields
  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  // Find only modified fields
  const getChangedFields = () => {
    if (!originalData) return {};

    let changed = {};

    Object.keys(formData).forEach((key) => {
      if (key === "address") {
        let addressChanges = {};

        Object.keys(formData.address).forEach((addrKey) => {
          if (
            formData.address[addrKey] !==
            originalData.address[addrKey]
          ) {
            addressChanges[addrKey] =
              formData.address[addrKey];
          }
        });

        if (Object.keys(addressChanges).length > 0) {
          changed.address = addressChanges;
        }
      } else {
        if (formData[key] !== originalData[key]) {
          changed[key] = formData[key];
        }
      }
    });

    return changed;
  };

  // Detect changes
  const isChanged =
    originalData &&
    JSON.stringify(formData) !==
    JSON.stringify(originalData);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFields = getChangedFields();

    if (Object.keys(updatedFields).length === 0) {
      setSnackbar({
        open: true,
        severity: "info",
        message: "No changes made",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await api.put(
        `/player/${player._id}`,
        updatedFields
      );

      setSnackbar({
        open: true,
        severity: "success",
        message:
          response.data.message ||
          "Player updated successfully",
      });

      await refresh();

      setTimeout(() => {
        onClose();
      }, 500);

    } catch (err) {
      console.error(err);

      setSnackbar({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Update failed",
      });

    } finally {
      setLoading(false);
    }
  };

  if (!originalData) return null;
  return (
    <>
      <div className="fixed inset-0 z-500 bg-black/50 flex items-center justify-center p-4">

        <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] h-[90vh] flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">

            <div>
              <h2 className="text-2xl font-semibold text-white">
                Edit Player
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Update player information
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="text-slate-400 hover:text-white text-2xl disabled:opacity-50"
            >
              ✕
            </button>

          </div>

          {/* Body */}

          <div className="flex-1 overflow-y-auto px-6 py-5">

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* Personal Information */}

              <section>

                <h3 className="text-lg font-semibold text-white mb-4">
                  Personal Information
                </h3>

                <div className="grid grid-cols-2 gap-5">

                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Full Name"
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={loading}
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    disabled={loading}
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                  <input
                    name="aadharCard"
                    value={formData.aadharCard}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Aadhaar Number"
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Email"
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Phone Number"
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                  <input
                    name="event"
                    value={formData.event}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Weapon"
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                  <input
                    name="institute"
                    value={formData.institute}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Institute"
                    className="p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                </div>

              </section>
              {/* Address */}

              <section>

                <h3 className="text-lg font-semibold text-white mb-4">
                  Address
                </h3>

                <div className="space-y-4">

                  <input
                    name="addressLine1"
                    value={formData.address.addressLine1}
                    onChange={handleAddressChange}
                    disabled={loading}
                    placeholder="Address Line 1"
                    className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                  <input
                    name="addressLine2"
                    value={formData.address.addressLine2}
                    onChange={handleAddressChange}
                    disabled={loading}
                    placeholder="Address Line 2"
                    className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                  <input
                    name="pincode"
                    value={formData.address.pincode}
                    onChange={handleAddressChange}
                    disabled={loading}
                    placeholder="Pincode"
                    className="w-full md:w-52 p-3 rounded-lg bg-slate-700 border border-slate-600"
                  />

                </div>

              </section>

              {/* Documents */}

              <section>

                <h3 className="text-lg font-semibold text-white mb-4">
                  Documents
                </h3>

                <div className="grid grid-cols-2 gap-6">

                  {/* Photo */}

                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">

                    <p className="text-sm text-slate-300 mb-3 font-medium">
                      Player Photo
                    </p>

                    <a
                      href={player.photoURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={player.photoURL}
                        alt="Player"
                        className="w-32 h-32 object-cover rounded-lg border border-slate-500 hover:scale-105 transition"
                      />
                    </a>

                  </div>

                  {/* Aadhaar */}

                  <div className="bg-slate-700 rounded-xl p-4 border border-slate-600">

                    <p className="text-sm text-slate-300 mb-3 font-medium">
                      Aadhaar Card
                    </p>

                    <a
                      href={player.aadharCardURL}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={player.aadharCardURL}
                        alt="Aadhaar"
                        className="w-40 h-32 object-cover rounded-lg border border-slate-500 hover:scale-105 transition"
                      />
                    </a>

                  </div>

                </div>

              </section>

            </form>

          </div>

          {/* Footer */}

          <div className="shrink-0 border-t border-slate-700 bg-slate-900/95 backdrop-blur-md px-6 py-5 flex justify-end items-center gap-4">

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="
      px-6
      py-3
      rounded-xl
      border
      border-slate-600
      bg-slate-700
      hover:bg-slate-600
      text-white
      font-medium
      transition-all
      duration-200
      disabled:opacity-50
      disabled:cursor-not-allowed
    "
            >
              <>
                <CloseIcon fontSize="small" />
                Cancel
              </>
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={!isChanged || loading}
              className="
      min-w-[190px]
      px-6
      py-3
      rounded-xl
      bg-emerald-600
      hover:bg-emerald-500
      active:scale-95
      text-white
      font-semibold
      shadow-lg
      transition-all
      duration-200
      disabled:bg-slate-600
      disabled:cursor-not-allowed
      flex
      items-center
      justify-center
      gap-2
    "
            >
              {loading ? (
                <>
                  <CircularProgress size={18} sx={{ color: "white" }} />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon fontSize="small" />
                  Save Changes
                </>
              )}
            </button>

          </div>

        </div>

      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </>
  );
};

export default EditPlayerModal;