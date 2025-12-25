import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { TyphoonHeader } from "@/components/typhoon-header";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

export const metadata = {
  title: 'TyphoonHub - Independent Film Platform',
  description: 'Explore our complete collection of independent films, shorts, and documentaries',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <PayPalScriptProvider options={{ clientId: "AdV2FDzVvjCbCIvv-G34Y_3P5v5v2mDXMty233vQ5qmbu6XSPuh1g4sr2N_8dEEVjjGHiPkvzDa7sR2T" }}>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              <TyphoonHeader />
              <main className="flex-1">
                {children}
              </main>
            </div>
          </AuthProvider>
        </PayPalScriptProvider>
      </body>
    </html>
  )
}
