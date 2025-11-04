import Image from "next/image";

export default function Footer() {
  return (
    <div className="absolute bottom-10">
      <div className="flex items-end gap-4 opacity-80 brightness-0 invert">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={80}
          height={24}
          className="h-5 lg:h-6 w-auto object-contain"
        />
        <Image
          src="/getnet.png"
          alt="Getnet"
          width={80}
          height={24}
          className="h-4 w-auto object-contain"
        />
      </div>
    </div>
  );
}

