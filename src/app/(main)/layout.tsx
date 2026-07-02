import BottomBar from "@/components/bottom-bar";
import LenisWrapper from "@/components/common/lenis-wrapper";
import ConditionalScripts from "@/components/common/conditional-scripts";
import CookieBanner from "@/components/cookie-banner";
import { CookieConsentProvider } from "@/contexts/cookie-consent";
import Footer from "@/sections/footer";
import Navigation from "@/sections/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CookieConsentProvider>
      <LenisWrapper>
        <Navigation />
        <main className="relative min-h-screen overflow-x-clip">
          {children}
        </main>
        <Footer />
      </LenisWrapper>
      <ConditionalScripts />
      <BottomBar />
      <CookieBanner />
    </CookieConsentProvider>
  );
}
