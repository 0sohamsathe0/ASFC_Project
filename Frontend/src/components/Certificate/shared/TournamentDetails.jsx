const TournamentDetails = ({ tournament }) => {

    const {
        title,
        startingDate,
        endDate,
        locationCity,
        locationState,
    } = tournament;

    const formatDate = (date) =>
        new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });

    return (
        <div className="mt-10 text-center">

            <p className="text-xl text-gray-700 leading-9">

                At the

                <span className="mx-2 font-bold text-blue-800">
                    {title}
                </span>

                held at

                <span className="mx-2 font-semibold">
                    {locationCity}, {locationState}
                </span>

                from

                <span className="mx-2 font-semibold">
                    {formatDate(startingDate)}
                </span>

                to

                <span className="ml-2 font-semibold">
                    {formatDate(endDate)}
                </span>

            </p>

        </div>
    );

};

export default TournamentDetails;