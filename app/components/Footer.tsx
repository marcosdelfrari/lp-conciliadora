import Image from "next/image";

export default function Footer() {
  return (
    <div className="absolute bottom-4 lg:bottom-5 left-1/2 transform -translate-x-1/2">
      <div className="flex items-end gap-3 sm:gap-4 opacity-80 brightness-0 invert">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={24}
          className="h-4 sm:h-5 lg:h-6 w-auto object-contain"
        />
        <Image
          src="/getnet.png"
          alt="Getnet"
          width={80}
          height={24}
          className="h-3 sm:h-4 w-auto object-contain"
        />
      </div>
    </div>
  );
}

