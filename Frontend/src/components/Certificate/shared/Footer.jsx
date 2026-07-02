import Signature from "./Signature";

const Footer = () => {

    return (

        <div className="mt-auto flex items-end justify-between pt-20">

            <Signature
                name="Mr. Prakash Katule"
                designation="President"
            />

            <div className="text-center">

                <p className="text-sm uppercase tracking-[0.3rem] text-gray-500">
                    All Star Fencing Club
                </p>

                <p className="mt-2 text-xs text-gray-400">
                    Excellence • Discipline • Sportsmanship
                </p>

            </div>

            <Signature
                name="Mr. Deepak Shinde"
                designation="Secretary"
            />

        </div>

    );

};

export default Footer;