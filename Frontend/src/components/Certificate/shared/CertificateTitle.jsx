const CertificateTitle = ({ tournament }) => {
    const {
        title,
        locationCity,
        locationState,
    } = tournament;

    return (
<div className="pt-16 flex flex-col items-center">
            {/* Championship Title */}
            <h1
                className="
        text-[56px]
        font-bold
        text-[#2E2E2E]
        tracking-tight
         max-w-4xl
        mx-auto
        text-center
        leading-tight
    "
                style={{
                    fontFamily: "Playfair Display"
                }}
            >
                {title}
            </h1>

            {/* Subtitle */}
            <p
                className="
        mt-3
        text-[24px]
        text-gray-700
        font-medium
        tracking-wide
    "
            >
                ( Boys & Girls )
            </p>
            

            {/* Venue */}
            <p className="mt-5 text-xl text-gray-700">
                <span className="font-semibold">
                    Venue :
                </span>{" "}
                {locationCity}, {locationState}
            </p>

            {/* Certificate Heading */}
            <h2 className="mt-8 text-4xl font-extrabold tracking-[0.35rem] text-red-700">
                MERIT CERTIFICATE
            </h2>

        </div>
    );
};

export default CertificateTitle;