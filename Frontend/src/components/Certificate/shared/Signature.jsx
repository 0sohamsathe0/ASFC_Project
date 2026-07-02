const Signature = ({
    name,
    designation,
}) => {

    return (

        <div className="flex w-64 flex-col items-center">

            <div className="mb-3 h-px w-full bg-gray-500" />

            <h4 className="text-lg font-bold text-gray-800">
                {name}
            </h4>

            <p className="text-gray-600">
                {designation}
            </p>

        </div>

    );

};

export default Signature;