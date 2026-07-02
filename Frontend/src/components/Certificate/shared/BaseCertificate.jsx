import Background from "./Background";

const BaseCertificate = ({ children, certificateRef }) => {
  return (
    <div className="flex w-full justify-center bg-gray-100 py-8">
      <div
        ref={certificateRef}
        className="
          relative
          w-[1123px]
          h-[794px]
          overflow-hidden
          bg-white
        "
      >
        {/* Background */}
        <Background />

        {/* Certificate Content */}
        <div className="relative z-10 flex h-full flex-col px-16 py-12">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BaseCertificate;