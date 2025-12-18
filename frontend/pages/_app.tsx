import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function App({ Component, pageProps }: AppProps) {
  return(
    <AuthProvider>
      <Navbar />
      <main className="container-custom py-8">
        <Component {...pageProps} />
      </main>
    </AuthProvider>
  );
}
