import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer"
import { SearchProvider } from "@/context/SearchContext";

export const metadata = {
  title: "Job Portal",
  description: "Find jobs and hire talent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <SearchProvider>
          {children}
        </SearchProvider>
        <Footer />
      </body>
    </html>
  );
}
