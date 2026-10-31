import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Lilita_One, Nunito } from "next/font/google";
import { ProgressHydrator } from "@/components/providers/progress-hydrator";
import { MotionRoot } from "@/components/ui/motion-root";
import "./globals.css";

const lilita = Lilita_One({ weight: "400", subsets: ["latin"], variable: "--font-lilita" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "ShipNLearn — aprende HTML y CSS construyendo",
  description:
    "Un juego para aprender HTML y CSS haciendo: construye webs para las islas del archipiélago y míralas cobrar vida.",
};

export const viewport: Viewport = {
  themeColor: "#1e90ff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${lilita.variable} ${nunito.variable} ${jetbrains.variable}`}>
      <body className="antialiased">
        <ProgressHydrator />
        <MotionRoot>{children}</MotionRoot>
      </body>
    </html>
  );
}
