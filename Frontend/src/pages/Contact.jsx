import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { api } from "../components/api.js"

export default function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    try {
      setLoading(true);

      const res = await api.post("/contact", formData);

      setSnackbar({
        open: true,
        severity: "success",
        message: res.data.message,
      });

      setFormData({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        severity: "error",
        message:
          err.response?.data?.message ||
          "Failed to send message.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#020617] text-white">

      {/* Hero */}

      <section className="border-b border-white/10 py-16 md:py-20 lg:py-24">

        <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">

          <p className="text-xs font-semibold uppercase tracking-[4px] text-blue-400 sm:text-sm sm:tracking-[6px] lg:tracking-[8px]">
            Contact ASFC
          </p>

          <h1 className="mt-5 text-4xl font-black leading-tight sm:mt-6 sm:text-5xl lg:text-7xl">
            Let's Build
            <span className="text-blue-500">
              {" "}Champions Together
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-7 text-slate-400 sm:mt-8 sm:text-lg sm:leading-8">
            Whether you're looking to join the club, participate in tournaments,
            or simply learn more about fencing, we're here to help.
          </p>

        </div>

      </section>

      {/* Contact Section */}

      <section className="py-16 md:py-20 lg:py-24">

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:px-6 lg:grid-cols-5 lg:gap-12 lg:px-8">

          {/* Left Side */}

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8 lg:col-span-2"
          >

            <div>

              <h2 className="text-3xl font-black sm:text-4xl">
                Get In Touch
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
                We'd love to hear from athletes, parents and anyone interested
                in becoming a part of All Star Fencing Club.
              </p>

            </div>

            <div className="space-y-5">

              <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-slate-900 p-6">

                <MapPin className="flex-shrink-0 text-blue-400" size={22} />

                <div>

                  <h3 className="font-semibold">
                    Address
                  </h3>

                  <p className="text-sm text-slate-400 sm:text-base">
                    Chh. Shivaji Night College Solapur, Maharashtra, India
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-slate-900 p-6">

                <Phone className="flex-shrink-0 text-blue-400" size={22} />

                <div>

                  <h3 className="font-semibold">
                    Phone
                  </h3>

                  <p className="text-sm text-slate-400 sm:text-base">
                    +91 96379 63777
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-slate-900 p-6">

                <Mail className="flex-shrink-0 text-blue-400" size={22} />

                <div>

                  <h3 className="font-semibold">
                    Email
                  </h3>

                  <p className="break-all text-sm text-slate-400 sm:text-base">
                    info@allstarfencingclub.com
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-5 rounded-2xl border border-white/10 bg-slate-900 p-6">

                <Clock className="flex-shrink-0 text-blue-400" size={22} />

                <div>

                  <h3 className="font-semibold">
                    Training Hours
                  </h3>

                  <p className="text-sm leading-7 text-slate-400 sm:text-base">
                    Monday - Saturday
                    <br />
                    5:00 AM - 7:00 AM
                    <br />
                    6:00 PM - 8:00 PM
                  </p>

                </div>

              </div>

            </div>

            <div className="flex gap-4">

              <a
                href="https://www.facebook.com/p/ALL-STAR-Fencing-CLUB-100064343851939/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900 transition hover:bg-blue-600"
                aria-label="Facebook"
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://www.instagram.com/all_star_fencing_club/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-slate-900 transition hover:bg-pink-600"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>

            </div>

          </motion.div>

          {/* Contact Form */}

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-white/10 bg-slate-900 p-6 sm:p-8 lg:col-span-3 lg:p-10"
          >

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              <input
                type="text"
                name="fullName"
                required
                disabled={loading}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-4 outline-none transition focus:border-blue-500 disabled:opacity-60"
              />

              <input
                type="email"
                name="email"
                required
                disabled={loading}
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-4 outline-none transition focus:border-blue-500 disabled:opacity-60"
              />

              <input
                type="tel"
                name="phone"
                required
                disabled={loading}
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-4 outline-none transition focus:border-blue-500 disabled:opacity-60"
              />

              <input
                type="text"
                name="subject"
                required
                disabled={loading}
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full rounded-xl border border-white/10 bg-slate-950 p-4 outline-none transition focus:border-blue-500 disabled:opacity-60"
              />
            </div>
            <textarea
              name="message"
              required
              disabled={loading}
              rows={7}
              value={formData.message}
              onChange={handleChange}
              placeholder="Write your message..."
              className="mt-6 w-full resize-none rounded-xl border border-white/10 bg-slate-950 p-4 outline-none transition focus:border-blue-500 disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={loading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-fit"
            >
              {loading ? "Sending..." : "Send Message"}
              <Send size={20} />
            </button>

          </motion.form>

        </div>

      </section>

      {/* Map */}

      <section className="pb-16 md:pb-20 lg:pb-24">

        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

          <div className="overflow-hidden rounded-3xl border border-white/10">

            <iframe
              title="All Star Fencing Club Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.470314578422!2d75.8990999!3d17.675229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc5d08029796ae9%3A0xf8f57d22b01ea920!2sChh.%20Chatrapati%20Shivaji%20Maharaj%20Night%20College%20of%20Arts%20%26%20Commerce%20Solapur!5e0!3m2!1sen!2sin!4v1785833307387!5m2!1sen!2sin"
              width="100%"
              height="450"
              className="w-full h-[300px] sm:h-[380px] lg:h-[450px]"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />

          </div>

        </div>

      </section>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      >
        <Alert
          variant="filled"
          severity={snackbar.severity}
          onClose={() =>
            setSnackbar((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

    </main>
  );
}