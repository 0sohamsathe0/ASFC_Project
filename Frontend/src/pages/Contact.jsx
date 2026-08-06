import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, Loader2, ArrowDown, ChevronDown } from "lucide-react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { api } from "../components/api.js";

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
        message: res.data.message || "Message sent successfully!",
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
          "Failed to send message. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    const section = document.getElementById("contact-section");
    section?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="bg-[#020617] text-white min-h-screen selection:bg-blue-500 selection:text-white">
      {/* Hero Section with Quick FAQs Content */}
      <section className="relative flex min-h-[calc(100vh-4rem)] lg:min-h-0 w-full flex-col items-center justify-center border-b border-white/10 px-4 py-12 lg:py-20 text-center overflow-hidden">
        {/* Glow Ambient Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] sm:w-[500px] sm:h-[500px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-3xl px-2 w-full">
          <p className="text-xs font-bold uppercase tracking-[4px] sm:tracking-[6px] text-blue-400 sm:text-sm">
            Contact ASFC
          </p>

          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl lg:text-6xl leading-tight">
            Let's Build{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Champions Together
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base md:text-lg">
            Whether you're looking to join the club, participate in tournaments,
            or learn more about fencing, we're here to help.
          </p>

          {/* Integrated Quick FAQs */}
          <div className="mt-8 max-w-2xl mx-auto w-full space-y-3 text-left">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center mb-1">
              Quick Questions
            </p>

            <details className="group rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md transition [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white">
                <span>Do I need prior fencing experience to join?</span>
                <ChevronDown size={18} className="shrink-0 transition duration-300 group-open:-rotate-180 text-blue-400" />
              </summary>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-2.5">
                No experience needed! We run beginner foundation batches for all age groups starting from age 3+.
              </p>
            </details>

            <details className="group rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md transition [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white">
                <span>Is fencing safety equiped sport ?</span>
                <ChevronDown size={18} className="shrink-0 transition duration-300 group-open:-rotate-180 text-blue-400" />
              </summary>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-2.5">
                Yes! All protective gear, masks, and weapons make fencing a safe sport (Actully Fencing is one of the most safest sport)
              </p>
            </details>

            <details className="group rounded-2xl border border-white/10 bg-slate-900/60 p-4 backdrop-blur-md transition [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white">
                <span>When should we visit the club?</span>
                <ChevronDown size={18} className="shrink-0 transition duration-300 group-open:-rotate-180 text-blue-400" />
              </summary>
              <p className="mt-2.5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/5 pt-2.5">
                At the evening session (6:00 to 8:00 PM) or call us directly at +91 96379 63777 
              </p>
            </details>
          </div>

          <button
            onClick={scrollToForm}
            className="mt-8 inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 px-6 py-3 text-xs font-bold uppercase tracking-wider text-slate-300 backdrop-blur-md transition hover:border-blue-500 hover:text-white active:scale-95"
          >
            <span>Send Us A Message</span>
            <ArrowDown size={16} className="animate-bounce text-blue-400" />
          </button>
        </div>
      </section>

      {/* Main Section */}
      <section id="contact-section" className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-start">
            
            {/* Left Info Cards Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="space-y-6 lg:col-span-5"
            >
              <div>
                <h2 className="text-2xl font-black sm:text-3xl">
                  Get In Touch
                </h2>
                <p className="mt-2 text-sm text-slate-400">
                  We'd love to hear from athletes, parents, and anyone interested
                  in joining All Star Fencing Club.
                </p>
              </div>

              <div className="space-y-4">
                {/* Address Card */}
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Address</h3>
                    <p className="mt-0.5 text-xs sm:text-sm text-slate-400 leading-relaxed">
                      Chh. Shivaji Night College Solapur, Maharashtra, India
                    </p>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Phone</h3>
                    <a
                      href="tel:+919637963777"
                      className="mt-0.5 inline-block text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition"
                    >
                      +91 96379 63777
                    </a>
                  </div>
                </div>

                {/* Email Card */}
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Mail size={20} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">Email</h3>
                    <a
                      href="mailto:info@allstarfencingclub.com"
                      className="mt-0.5 block truncate text-xs sm:text-sm text-slate-400 hover:text-blue-400 transition"
                    >
                      info@allstarfencingclub.com
                    </a>
                  </div>
                </div>

                {/* Training Hours Card */}
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-md">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Training Hours
                    </h3>
                    <div className="mt-1 text-xs sm:text-sm text-slate-400 space-y-0.5">
                      <p className="font-medium text-slate-300">Monday - Saturday</p>
                      <p>Morning: 5:00 AM - 7:00 AM</p>
                      <p>Evening: 6:00 PM - 8:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="pt-2 flex items-center gap-3">
                <a
                  href="https://www.facebook.com/p/ALL-STAR-Fencing-CLUB-100064343851939/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-300 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white active:scale-95"
                  aria-label="Facebook"
                >
                  <FaFacebookF size={16} />
                </a>

                <a
                  href="https://www.instagram.com/all_star_fencing_club/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-900/80 text-slate-300 transition hover:border-pink-500 hover:bg-pink-600 hover:text-white active:scale-95"
                  aria-label="Instagram"
                >
                  <FaInstagram size={18} />
                </a>
              </div>
            </motion.div>

            {/* Right Contact Form Column */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl border border-white/10 bg-slate-900/50 p-5 sm:p-8 lg:col-span-7 backdrop-blur-xl"
            >
              <h3 className="text-xl font-bold mb-6 text-white">Send Us a Message</h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <div>
                  <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    disabled={loading}
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    disabled={loading}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    disabled={loading}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    disabled={loading}
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Inquiry about training"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="mt-4 sm:mt-5">
                <label className="block mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Message
                </label>
                <textarea
                  name="message"
                  required
                  disabled={loading}
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message or inquiry here..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:from-blue-500 hover:to-blue-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send size={16} />
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="pb-12 sm:pb-16 md:pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <iframe
              title="All Star Fencing Club Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.470314578422!2d75.8990999!3d17.675229!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc5d08029796ae9%3A0xf8f57d22b01ea920!2sChh.%20Chatrapati%20Shivaji%20Maharaj%20Night%20College%20of%20Arts%20%26%20Commerce%20Solapur!5e0!3m2!1sen!2sin!4v1785833307387!5m2!1sen!2sin"
              width="100%"
              height="400"
              className="w-full h-[280px] sm:h-[350px] lg:h-[400px] grayscale contrast-125 opacity-85 hover:grayscale-0 transition duration-500"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </section>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
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