import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-[#020617] py-20 sm:py-24 lg:py-28">

      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">

        <div className="relative overflow-hidden rounded-[28px] sm:rounded-[40px] bg-gradient-to-r from-blue-700 to-blue-500 px-6 py-12 sm:px-10 sm:py-16 lg:p-16 text-center">

          {/* Background Grid */}

          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:50px_50px]" />

          <div className="relative">

            <p className="text-xs sm:text-sm uppercase tracking-[4px] sm:tracking-[6px] text-blue-100 font-semibold">

              Join The Journey

            </p>

            <h2 className="mt-5 text-3xl sm:text-4xl lg:text-6xl font-black leading-tight text-white">

              Ready To Become

              <br />

              A Champion?

            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-blue-100">

              Join All Star Fencing Club today and start your journey with
              professional coaching, competitive tournaments and a
              community dedicated to excellence.

            </p>

            {/* Buttons */}

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">

              <button className="w-full sm:w-auto rounded-full bg-white px-8 py-4 font-bold text-blue-700 transition hover:scale-105">

                Register Now

              </button>

              <button className="flex w-full sm:w-auto items-center justify-center gap-3 rounded-full border border-white px-8 py-4 text-white transition hover:bg-white hover:text-blue-700">

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