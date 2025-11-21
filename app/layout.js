export const metadata = {
  title: 'TyphoonHub - Independent Film Platform',
  description: 'Explore our complete collection of independent films, shorts, and documentaries',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header style={{ padding: '1rem', background: '#000', color: '#fff' }}>
          <h1>TYPHOONHUB</h1>
        </header>
        {children}
        <footer style={{ padding: '1rem', textAlign: 'center', marginTop: '2rem' }}>
          <p>© 2025 Typhoon Film Hub. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}
