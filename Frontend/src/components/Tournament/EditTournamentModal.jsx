import { useEffect, useMemo, useState } from "react";
import { CalendarDays, LoaderCircle, MapPin, Save, Trophy, X } from "lucide-react";
import toast from "react-hot-toast";

import { api } from "../api";

const fieldClass = "min-h-11 w-full min-w-0 rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60";

const EditTournamentModal = ({ tournament, onClose, refresh }) => {
  const originalData = useMemo(
    () => ({
      title: tournament.title || "",
      locationState: tournament.locationState || "",
      startingDate: tournament.startingDate?.slice(0, 10) || "",
      endDate: tournament.endDate?.slice(0, 10) || "",
      status: tournament.status || "",
    }),
    [tournament]
  );

  const [formData, setFormData] = useState(originalData);
  const [loading, setLoading] = useState(false);

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
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const getChangedFields = () => {
    const updatedFields = {};
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== originalData[key]) updatedFields[key] = formData[key];
    });
    return updatedFields;
  };

  const hasChanges = useMemo(
    () => JSON.stringify(formData) !== JSON.stringify(originalData),
    [formData, originalData]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedData = getChangedFields();

    if (Object.keys(updatedData).length === 0) {
      toast("No changes made");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/tournament/${tournament._id}`, updatedData);
      toast.success("Tournament updated successfully");
      await refresh();
      onClose();
    } catch (error) {
      console.error("Tournament update error", error);
      toast.error(error.response?.data?.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5" role="dialog" aria-modal="true" aria-labelledby="edit-tournament-title">
      <div className="flex max-h-[94dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 text-white shadow-2xl sm:max-h-[90dvh]">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-700 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300 ring-1 ring-blue-500/30">
              <Trophy size={21} />
            </span>
            <div className="min-w-0">
              <h2 id="edit-tournament-title" className="text-xl font-bold sm:text-2xl">Edit Tournament</h2>
              <p className="mt-1 break-words text-sm text-slate-400">{tournament.title}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} disabled={loading} aria-label="Close edit tournament dialog" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-slate-300 transition hover:bg-slate-700 hover:text-white disabled:opacity-50">
            <X size={21} />
          </button>
        </header>

        <form id="edit-tournament-form" onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6">
          <label className="block min-w-0">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-300"><Trophy size={16} /> Tournament Name</span>
            <input name="title" value={formData.title} onChange={handleChange} disabled={loading} className={fieldClass} />
          </label>

          <label className="block min-w-0">
            <span className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-300"><MapPin size={16} /> State / Location</span>
            <input name="locationState" value={formData.locationState} onChange={handleChange} disabled={loading} className={fieldClass} />
          </label>

          <fieldset>
            <legend className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-300"><CalendarDays size={16} /> Tournament Dates</legend>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block min-w-0">
                <span className="mb-1.5 block text-sm text-slate-400">Start Date</span>
                <input type="date" name="startingDate" value={formData.startingDate} onChange={handleChange} disabled={loading} className={fieldClass} />
              </label>
              <label className="block min-w-0">
                <span className="mb-1.5 block text-sm text-slate-400">End Date</span>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} disabled={loading} className={fieldClass} />
              </label>
            </div>
          </fieldset>

          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 text-sm text-slate-400">
            Level, age category, and city remain unchanged by this form.
          </div>
        </form>

        <footer className="grid shrink-0 grid-cols-1 gap-2 border-t border-slate-700 bg-slate-900/95 px-4 py-3 min-[360px]:grid-cols-2 sm:flex sm:justify-end sm:gap-3 sm:px-6 sm:py-4">
          <button type="button" onClick={onClose} disabled={loading} className="min-h-11 rounded-xl border border-slate-600 bg-slate-700 px-5 py-2.5 font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-60">Cancel</button>
          <button type="submit" form="edit-tournament-form" disabled={!hasChanges || loading} className="flex min-h-11 min-w-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-600 sm:min-w-[140px]">
            {loading ? <><LoaderCircle size={18} className="animate-spin" />Saving...</> : <><Save size={18} />Save Changes</>}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default EditTournamentModal;
