import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'MySpacerR — The Nostalgic Social Network',
  description: 'Relive the golden era of social networking. Customize your profile, blog, chat, and connect with friends — MySpace style! ✨🎸',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="stars-bg" />
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
