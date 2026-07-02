const Background = () => {
    return (
        <>
            {/* ===================== */}
            {/* Paper Texture */}
            {/* ===================== */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, rgba(0,0,0,.8) 0.7px, transparent 0.7px)",
                    backgroundSize: "18px 18px",
                }}
            />

            {/* ===================== */}
            {/* Double Border */}
            {/* ===================== */}

            <div className="absolute inset-2 border-[6px] border-blue-700 pointer-events-none" />

            <div className="absolute inset-5 border border-sky-300 pointer-events-none" />

            {/* ===================== */}
            {/* TOP LEFT */}
            {/* ===================== */}

            <div className="absolute top-0 left-0 w-[360px] h-[120px] overflow-hidden">

                <div className="absolute top-0 left-[-80px] w-[420px] h-24 bg-blue-800 -skew-x-12" />

                <div className="absolute top-0 left-[20px] w-[260px] h-16 bg-sky-400 -skew-x-12 opacity-80" />

            </div>

            {/* ===================== */}
            {/* TOP RIGHT */}
            {/* ===================== */}

            <div className="absolute top-0 right-0 w-[360px] h-[120px] overflow-hidden">

                <div className="absolute top-0 right-[-80px] w-[420px] h-24 bg-blue-800 skew-x-12" />

                <div className="absolute top-0 right-[20px] w-[260px] h-16 bg-sky-400 skew-x-12 opacity-80" />

            </div>

            {/* ===================== */}
            {/* Decorative Lines Left */}
            {/* ===================== */}

            <div className="absolute top-10 left-[270px] w-16 h-[2px] bg-sky-400 rotate-[-22deg]" />

            <div className="absolute top-16 left-[255px] w-20 h-[2px] bg-sky-300 rotate-[-22deg]" />

            <div className="absolute top-24 left-[245px] w-24 h-[2px] bg-sky-300 rotate-[-22deg]" />

            {/* ===================== */}
            {/* Decorative Lines Right */}
            {/* ===================== */}

            <div className="absolute top-10 right-[270px] w-16 h-[2px] bg-sky-400 rotate-[22deg]" />

            <div className="absolute top-16 right-[255px] w-20 h-[2px] bg-sky-300 rotate-[22deg]" />

            <div className="absolute top-24 right-[245px] w-24 h-[2px] bg-sky-300 rotate-[22deg]" />

            {/* ===================== */}
            {/* Bottom Left */}
            {/* ===================== */}

            <div className="absolute bottom-0 left-6">

                <div className="w-80 h-7 bg-blue-800 -skew-x-12" />

                <div className="absolute left-0 -top-2 w-7 h-10 bg-sky-400 -skew-x-12" />

            </div>

            {/* ===================== */}
            {/* Bottom Right */}
            {/* ===================== */}

            <div className="absolute bottom-0 right-6">

                <div className="w-80 h-7 bg-blue-800 skew-x-12" />

                <div className="absolute right-0 -top-2 w-7 h-10 bg-sky-400 skew-x-12" />

            </div>

            {/* ===================== */}
            {/* Corner Accents */}
            {/* ===================== */}

            <div className="absolute top-32 left-6 text-blue-300 text-5xl rotate-12">
                ❮
            </div>

            <div className="absolute top-32 right-6 text-blue-300 text-5xl -rotate-12">
                ❯
            </div>

            {/* ===================== */}
            {/* Watermark Placeholder */}
            {/* ===================== */}

            <div className="absolute inset-0 flex items-center justify-center">

                <div className="w-[420px] h-[420px] rounded-full border-[12px] border-blue-900 opacity-[0.03]" />

            </div>

            {/* ===================== */}
            {/* Left Fencer Placeholder */}
            {/* ===================== */}

            <div className="absolute bottom-8 left-6 w-24 h-44 rounded-full bg-gray-400 opacity-10" />

            {/* ===================== */}
            {/* Right Fencer Placeholder */}
            {/* ===================== */}

            <div className="absolute bottom-8 right-6 w-24 h-44 rounded-full bg-gray-400 opacity-10" />

        </>
    );
};

export default Background;