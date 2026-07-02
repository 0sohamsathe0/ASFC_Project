const logos = [
    "District Logo",
    "Club Logo",
    "Fencing India",
    "Association Logo",
];

const Logo = () => {
    return (
        <div className="flex items-center justify-evenly">

            {logos.map((logo) => (
                <div
                    key={logo}
                    className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-center text-xs font-semibold text-gray-500 shadow"
                >
                    {logo}
                </div>
            ))}

        </div>
    );
};

export default Logo;