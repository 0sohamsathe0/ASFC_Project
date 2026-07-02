const PlayerName = ({ name }) => {
    return (
        <div className="mt-10 flex flex-col items-center">

            <p className="text-xl text-gray-700 tracking-wide">
                This Certificate is proudly presented to
            </p>

            <h2 className="mt-4 border-b-2 border-gray-700 px-12 pb-2 text-5xl font-bold uppercase tracking-wider text-blue-900">
                {name}
            </h2>

        </div>
    );
};

export default PlayerName;