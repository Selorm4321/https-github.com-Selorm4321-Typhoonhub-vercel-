import "./globals.css";
import { AuthProvider } from "@/components/auth-context";
import { TyphoonHeader } from "@/components/typhoon-header";

export const metadata = {
  title: 'TyphoonHub - Independent Film Platform',
  description: 'Explore our complete collection of independent films, shorts, and documentaries',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <TyphoonHeader />
            <main className="flex-1">
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
