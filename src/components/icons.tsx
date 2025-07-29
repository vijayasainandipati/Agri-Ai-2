import type { SVGProps } from "react";
import Image from "next/image";

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <Image src="/logo.png" alt="Logo" width={100} height={100} />
  ),
};
