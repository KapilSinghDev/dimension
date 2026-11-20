import Image from "next/image";

import DimensionDarkLogo from "@/assets/Dimension dark version.svg";

export default function FooterComponent() {
  return (
    <footer className="w-full bg-[#000000] text-white">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-8">
        <Image
          src={DimensionDarkLogo}
          alt="Dimension"
          width={400}
          // height={33}
        />
        <p className="text-sm text-white/70">
          &copy; {new Date().getFullYear()} Dimension
        </p>
      </div>
    </footer>
  );
}
