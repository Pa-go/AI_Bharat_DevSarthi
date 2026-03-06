// app/layout.js
export default function RootLayout({ children }) {
  return (
    // This provides the base HTML tags for the entire app
    <html>
      <body>{children}</body>
    </html>
  );
}