import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-[#020617] py-28">

      <div className="max-w-6xl mx-auto px-6">

        <div className="rounded-[40px] overflow-hidden relative bg-gradient-to-r from-blue-700 to-blue-500 p-16 text-center">

          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative">

            <p className="uppercase tracking-[6px] text-blue-100">

              Join The Journey

            </p>

            <h2 className="text-5xl lg:text-6xl font-black text-white mt-6">

              Ready To Become

              <br />

              A Champion?

            </h2>

            <p className="text-blue-100 text-lg mt-8 max-w-2xl mx-auto leading-8">

              Join All Star Fencing Club today and start your journey with
              professional coaching, competitive tournaments and a
              community dedicated to excellence.

            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-12">

              <button className="bg-white text-blue-700 font-bold px-8 py-4 rounded-full hover:scale-105 transition">

                Register Now

              </button>

              <button className="border border-white text-white px-8 py-4 rounded-full flex items-center gap-3 hover:bg-white hover:text-blue-700 transition">

                Contact Us

                <ArrowRight size={20} />

              </button>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}