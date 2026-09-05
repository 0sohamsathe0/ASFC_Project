import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import SaveIcon from "@mui/icons-material/Save";
import Snackbar from "@mui/material/Snackbar";

import { api } from "../api";

const fieldClass = "min-h-11 w-full min-w-0 rounded-lg border border-slate-600 bg-slate-700 p-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60";

const Field = ({ label, children }) => (
  <label className="block min-w-0">
    <span className="mb-1.5 block text-sm font-medium text-slate-300">{label}</span>
    {children}
  </label>
);

const getInitialPlayerData = (player) => ({
  fullName: player.fullName || "",
  email: player.email || "",
  phone: player.phone || "",
  gender: player.gender || "",
  dob: player.dob?.slice(0, 10) || "",
  aadharCard: player.aadharCard || "",
  faiId: player.faiId || "",
  mfaId: player.mfaId || "",
  event: player.event || "",
  institute: player.institute || "",
  address: {
    addressLine1: player.address?.addressLine1 || "",
    addressLine2: player.address?.addressLine2 || "",
    pincode: player.address?.pincode || "",
  },
});

const EditPlayerModal = ({ player, onClose, refresh }) => {
  const [formData, setFormData] = useState(() => getInitialPlayerData(player));
  const [originalData] = useState(() => getInitialPlayerData(player));
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, severity: "success", message: "" });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleEscape = (event) => {
      if (event.key === "Escape" && !loading) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [loading, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      address: { ...previous.address, [name]: value },
    }));
  };

  const getChangedFields = () => {
    if (!originalData) return {};
    const changed = {};

    Object.keys(formData).forEach((key) => {
      if (key === "address") {
        const addressChanges = {};
        Object.keys(formData.address).forEach((addressKey) => {
          if (formData.address[addressKey] !== originalData.address[addressKey]) {
            addressChanges[addressKey] = formData.address[addressKey];
          }
        });
        if (Object.keys(addressChanges).length > 0) changed.address = addressChanges;
      } else if (formData[key] !== originalData[key]) {
        changed[key] = formData[key];
      }
    });

    return changed;
  };

  const isChanged = originalData && JSON.stringify(formData) !== JSON.stringify(originalData);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedFields = getChangedFields();

    if (Object.keys(updatedFields).length === 0) {
      setSnackbar({ open: true, severity: "info", message: "No changes made" });
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/player/${player._id}`, updatedFields);
      setSnackbar({ open: true, severity: "success", message: response.data.message || "Player updated successfully" });
      await refresh();
      setTimeout(onClose, 500);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, severity: "error", message: error.response?.data?.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  if (!originalData) return null;

  return (
    <>
      <div className="fixed inset-0 z-[140] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="edit-player-title">
        <div className="flex max-h-[94dvh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 text-white shadow-2xl sm:max-h-[90dvh]">
          <header className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-700 px-4 py-4 sm:px-6">
            <div className="min-w-0">
              <h2 id="edit-player-title" className="text-xl font-semibold sm:text-2xl">Edit Player</h2>
              <p className="mt-1 truncate text-sm text-slate-400">{player.fullName}</p>
            </div>
            <button type="button" onClick={onClose} disabled={loading} aria-label="Close edit player dialog" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50">
              <CloseIcon fontSize="small" />
            </button>
          </header>

          <form id="edit-player-form" onSubmit={handleSubmit} className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
            <section>
              <h3 className="mb-4 text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <Field label="Full Name"><input name="fullName" value={formData.fullName} onChange={handleChange} disabled={loading} className={fieldClass} /></Field>
                <Field label="Gender"><select name="gender" value={formData.gender} onChange={handleChange} disabled={loading} className={fieldClass}><option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></Field>
                <Field label="Date of Birth"><input type="date" name="dob" value={formData.dob} onChange={handleChange} disabled={loading} className={fieldClass} /></Field>
                <Field label="Aadhaar Number"><input name="aadharCard" value={formData.aadharCard} onChange={handleChange} disabled={loading} inputMode="numeric" className={fieldClass} /></Field>
                <Field label="Email"><input type="email" name="email" value={formData.email} onChange={handleChange} disabled={loading} className={fieldClass} /></Field>
                <Field label="Phone Number"><input type="tel" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} className={fieldClass} /></Field>
                <Field label="Weapon"><select name="event" value={formData.event} onChange={handleChange} disabled={loading} className={fieldClass}><option value="">Select Weapon</option><option value="Epee">Epee</option><option value="Foil">Foil</option><option value="Sabre">Sabre</option></select></Field>
                <Field label="School / College"><input name="institute" value={formData.institute} onChange={handleChange} disabled={loading} className={fieldClass} /></Field>
                <Field label="FAI ID"><input name="faiId" value={formData.faiId} onChange={(event) => setFormData((previous) => ({ ...previous, faiId: event.target.value.toUpperCase() }))} disabled={loading} className={fieldClass} /></Field>
                <Field label="MFA ID"><input name="mfaId" value={formData.mfaId} onChange={(event) => setFormData((previous) => ({ ...previous, mfaId: event.target.value.toUpperCase() }))} disabled={loading} className={fieldClass} /></Field>
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-semibold">Address</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Address Line 1"><input name="addressLine1" value={formData.address.addressLine1} onChange={handleAddressChange} disabled={loading} className={fieldClass} /></Field>
                <Field label="Address Line 2"><input name="addressLine2" value={formData.address.addressLine2} onChange={handleAddressChange} disabled={loading} className={fieldClass} /></Field>
                <Field label="Pincode"><input name="pincode" value={formData.address.pincode} onChange={handleAddressChange} disabled={loading} inputMode="numeric" className={fieldClass} /></Field>
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-semibold">Documents</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="min-w-0 rounded-xl border border-slate-600 bg-slate-700 p-4">
                  <p className="mb-3 text-sm font-medium text-slate-300">Player Photo</p>
                  {player.photoURL ? <a href={player.photoURL} target="_blank" rel="noopener noreferrer" aria-label={`Open profile photo for ${player.fullName}`} className="inline-block"><img src={player.photoURL} alt={`${player.fullName} profile`} className="h-32 w-32 max-w-full rounded-lg border border-slate-500 object-cover" /></a> : <p className="text-sm text-slate-400">No photo available</p>}
                </div>
                <div className="min-w-0 rounded-xl border border-slate-600 bg-slate-700 p-4">
                  <p className="mb-3 text-sm font-medium text-slate-300">Aadhaar Card</p>
                  {player.aadharCardURL ? <a href={player.aadharCardURL} target="_blank" rel="noopener noreferrer" aria-label={`Open Aadhaar document for ${player.fullName}`} className="block"><img src={player.aadharCardURL} alt={`${player.fullName} Aadhaar document`} className="h-32 w-full max-w-xs rounded-lg border border-slate-500 object-contain object-left" /></a> : <p className="text-sm text-slate-400">No document available</p>}
                </div>
              </div>
            </section>
          </form>

          <footer className="grid shrink-0 grid-cols-1 gap-2 border-t border-slate-700 bg-slate-900/95 px-4 py-3 min-[380px]:grid-cols-2 sm:flex sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
            <button type="button" onClick={onClose} disabled={loading} className="flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-700 px-5 py-2.5 font-medium transition hover:bg-slate-600 disabled:opacity-50"><CloseIcon fontSize="small" /> Cancel</button>
            <button type="submit" form="edit-player-form" disabled={!isChanged || loading} className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold shadow-lg transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-600 sm:min-w-[180px]">
              {loading ? <><CircularProgress size={18} sx={{ color: "white" }} />Saving...</> : <><SaveIcon fontSize="small" />Save Changes</>}
            </button>
          </footer>
        </div>
      </div>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((previous) => ({ ...previous, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default EditPlayerModal;
