const Achievement = ({
    place,
    category,
    event,
    certificateType,
}) => {
    return (
        <div className="mt-10 flex flex-col items-center">

            <p className="max-w-4xl text-center text-xl leading-9 text-gray-700">

                For securing{" "}

                <span className="font-bold text-red-700 uppercase">
                    {place} Place
                </span>

                {" "}in the{" "}

                <span className="font-semibold text-blue-700">
                    {certificateType}
                </span>

                {" "}

                <span className="font-semibold text-gray-900">
                    {category}
                </span>

                {" "}event during the championship.

            </p>

        </div>
    );
};

export default Achievement;