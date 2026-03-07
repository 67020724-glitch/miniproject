import type { Metadata } from "next";
import "./globals.css";
import { BookProvider } from "@/context/BookContext";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";
import AppLayout from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "StoryNest - Personal Book Tracker",
  description: "ระบบจัดการคลังหนังสือส่วนตัว",
};

// Critical CSS and script to prevent flash
const noFlashScript = `
(function() {
  var theme = 'light';
  try { theme = localStorage.getItem('storynest-theme') || 'light'; } catch(e) {}
  document.documentElement.className = theme;
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
        <style>{`
          html.dark { background-color: #0F172A; }
          html.light { background-color: #F8FAFC; }
          html.dark body { background-color: #0F172A; }
          html.light body { background-color: #F8FAFC; }
        `}</style>
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <BookProvider>
                <AppLayout>{children}</AppLayout>
              </BookProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

