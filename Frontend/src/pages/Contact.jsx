import { motion } from "framer-motion";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
} from "lucide-react";

import { FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Contact() {
  return (
    <main className="bg-[#020617] text-white">

      {/* Hero */}

      <section className="py-24 border-b border-white/10">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <p className="uppercase tracking-[8px] text-blue-400 font-semibold">

            Contact ASFC

          </p>

          <h1 className="text-5xl lg:text-7xl font-black mt-6">

            Let's Build

            <span className="text-blue-500">

              {" "}Champions Together

            </span>

          </h1>

          <p className="text-slate-400 max-w-3xl mx-auto text-lg leading-8 mt-8">

            Whether you're looking to join the club, participate in tournaments,
            or simply learn more about fencing, we're here to help.

          </p>

        </div>

      </section>

      {/* Contact Section */}

      <section className="py-24">

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-5 gap-12">

          {/* Left */}

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >

            <div>

              <h2 className="text-4xl font-black">

                Get In Touch

              </h2>

              <p className="text-slate-400 mt-5 leading-8">

                We'd love to hear from athletes, parents and anyone interested
                in becoming a part of All Star Fencing Club.

              </p>

            </div>

            {/* Info Cards */}

            <div className="space-y-5">

              <div className="flex gap-5 bg-slate-900 border border-white/10 rounded-2xl p-6">

                <MapPin className="text-blue-400" />

                <div>

                  <h3 className="font-semibold">

                    Address

                  </h3>

                  <p className="text-slate-400">

                    Solapur, Maharashtra, India

                  </p>

                </div>

              </div>

              <div className="flex gap-5 bg-slate-900 border border-white/10 rounded-2xl p-6">

                <Phone className="text-blue-400" />

                <div>

                  <h3 className="font-semibold">

                    Phone

                  </h3>

                  <p className="text-slate-400">

                    +91 98765 43210

                  </p>

                </div>

              </div>

              <div className="flex gap-5 bg-slate-900 border border-white/10 rounded-2xl p-6">

                <Mail className="text-blue-400" />

                <div>

                  <h3 className="font-semibold">

                    Email

                  </h3>

                  <p className="text-slate-400">

                    info@allstarfencingclub.com

                  </p>

                </div>

              </div>

              <div className="flex gap-5 bg-slate-900 border border-white/10 rounded-2xl p-6">

                <Clock className="text-blue-400" />

                <div>

                  <h3 className="font-semibold">

                    Training Hours

                  </h3>

                  <p className="text-slate-400">

                    Monday - Saturday
                    <br />
                    6:00 AM - 10:00 AM
                    <br />
                    5:00 PM - 9:00 PM

                  </p>

                </div>

              </div>

            </div>

            {/* Social */}

            <div className="flex gap-4">

              <button className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-blue-600 transition">

                <FaFacebookF size={20} />
              </button>

              <button className="w-12 h-12 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center hover:bg-pink-600 transition">

                <FaInstagram size={20} />

              </button>

            </div>

          </motion.div>

          {/* Form */}

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-slate-900 border border-white/10 rounded-3xl p-10"
          >

            <div className="grid md:grid-cols-2 gap-6">

              <input
                placeholder="Full Name"
                className="bg-slate-950 rounded-xl p-4 outline-none border border-white/10 focus:border-blue-500"
              />

              <input
                placeholder="Email Address"
                className="bg-slate-950 rounded-xl p-4 outline-none border border-white/10 focus:border-blue-500"
              />

              <input
                placeholder="Phone Number"
                className="bg-slate-950 rounded-xl p-4 outline-none border border-white/10 focus:border-blue-500"
              />

              <input
                placeholder="Subject"
                className="bg-slate-950 rounded-xl p-4 outline-none border border-white/10 focus:border-blue-500"
              />

            </div>

            <textarea
              rows="7"
              placeholder="Write your message..."
              className="w-full mt-6 bg-slate-950 rounded-xl p-4 outline-none border border-white/10 focus:border-blue-500 resize-none"
            />

            <button className="mt-8 bg-blue-600 hover:bg-blue-700 transition px-8 py-4 rounded-xl flex items-center gap-3 font-semibold">

              Send Message

              <Send size={20} />

            </button>

          </motion.div>

        </div>

      </section>

      {/* Map */}

      <section className="pb-24">

        <div className="max-w-7xl mx-auto px-6">

          <div className="overflow-hidden rounded-3xl border border-white/10">

            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=Solapur,Maharashtra&output=embed"
              width="100%"
              height="450"
              loading="lazy"
            />

          </div>

        </div>

      </section>

    </main>
  );
}