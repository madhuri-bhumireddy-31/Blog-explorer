import {TanstackProvider} from "./components/providers/tanstack-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanstackProvider>
            {children}
        </TanstackProvider>
      </body>
    </html>
  );
}