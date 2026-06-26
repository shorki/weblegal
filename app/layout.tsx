import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "C & V Estudio Jurídico | Abogadas",
  description:
    "Estudio jurídico en Montevideo. Derecho de Familia, Civil, Laboral y Amparos. Consulta sin costo, respuesta dentro de las 24 horas hábiles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Manrope:wght@200;300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
