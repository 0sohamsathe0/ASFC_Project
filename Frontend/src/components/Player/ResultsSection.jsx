const ResultsSection = ({
    title,
    description,
    results,
    color,
    icon,
    setSelectedCertificate,
    setShowCertificate,
}) => {

    const colors = {
        purple: {
            badge: "bg-purple-100 text-purple-700",
            button: "bg-purple-600 hover:bg-purple-700",
            border: "hover:border-purple-500",
            icon: "bg-purple-100",
        },

        blue: {
            badge: "bg-blue-100 text-blue-700",
            button: "bg-blue-600 hover:bg-blue-700",
            border: "hover:border-blue-500",
            icon: "bg-blue-100",
        },
    };

    const theme = colors[color];

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });

    const getPlaceBadge = (place) => {

        switch (place) {

            case "First":
                return "🥇";

            case "Second":
                return "🥈";

            case "Third":
                return "🥉";

            default:
                return "🏅";
        }
    };

    return (

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 mt-10">

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h2 className="text-3xl font-bold text-gray-800">
                        {title}
                    </h2>

                    <p className="text-gray-500 mt-1">
                        {description}
                    </p>

                </div>

                <div
                    className={`${theme.badge} px-4 py-2 rounded-full font-semibold`}
                >
                    {results.length} Results
                </div>

            </div>

            {/* Empty */}

            {results.length === 0 ? (

                <div className="border-2 border-dashed border-gray-200 rounded-xl py-16 text-center">

                    <div className="text-6xl mb-5">
                        📜
                    </div>

                    <h3 className="text-xl font-bold text-gray-700">
                        No Results Yet
                    </h3>

                    <p className="text-gray-500 mt-2">
                        Participate in tournaments to earn certificates.
                    </p>

                </div>

            ) : (

                <div className="space-y-5">

                    {results.map((cert) => (

                        <div
                            key={cert._id}
                            className={`border rounded-2xl p-6 hover:shadow-xl ${theme.border} transition-all duration-300 hover:scale-[1.01]`}
                        >

                            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6">

                                {/* LEFT */}

                                <div className="flex items-start gap-5 flex-1">

                                    <div
                                        className={`w-14 h-14 rounded-full ${theme.icon} flex items-center justify-center text-3xl`}
                                    >
                                        {icon}
                                    </div>

                                    <div>

                                        <h3 className="text-2xl font-bold text-gray-800">
                                            {cert.tournament.title}
                                        </h3>

                                        <p className="text-gray-500 mt-1">
                                            {cert.result.category}
                                        </p>

                                        <div className="mt-5 flex flex-wrap gap-10">

                                            <div>

                                                <p className="text-xs uppercase text-gray-400">
                                                    Position
                                                </p>

                                                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-700 px-3 py-1 font-semibold mt-2">

                                                    {getPlaceBadge(cert.result.place)}

                                                    {cert.result.place} Place

                                                </span>

                                            </div>

                                            <div>

                                                <p className="text-xs uppercase text-gray-400">
                                                    Tournament Date
                                                </p>

                                                <p className="font-semibold text-lg mt-2">
                                                    📅 {formatDate(cert.tournament.startingDate)}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* RIGHT */}

                                <div className="flex flex-col items-end gap-3">

                                    <button
                                        onClick={() => {

                                            setSelectedCertificate(cert);

                                            setShowCertificate(true);

                                        }}
                                        className={`${theme.button} text-white px-8 py-3 rounded-xl font-semibold transition`}
                                    >
                                        View Certificate
                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

};

export default ResultsSection;