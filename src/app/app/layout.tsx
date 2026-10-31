import type { Metadata } from "next";
import { AppClientShell } from "@/components/app/app-client-shell";

export const metadata: Metadata = {
  title: "Radio Libre App | 93.9 FM",
  description: "Aplicación móvil oficial de Radio Libre 93.9 FM. En vivo desde Babahoyo y Guayaquil, Ecuador.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppClientShell>{children}</AppClientShell>;
}
