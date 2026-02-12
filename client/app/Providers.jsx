"use client";

import { Suspense, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer, Slide } from "react-toastify";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import "react-toastify/dist/ReactToastify.css";

import { store, persistor } from "@/store";
import DynamicThemeProvider from "@/frontoffice/_components/DynamicThemeProvider";
import "../locales/i18n";

import { usePathname } from "next/navigation";

export default function Providers({ children }) {
  const pathname = usePathname();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const captchaKey = process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY;

  const authRoutes = [
    "/login",
    "/register",
    "/reset-password",
    "/check-email",
    "/set-password",
    "/vendor/register",
    "/admin/login",
  ];

  const isAuthPage = authRoutes.some((route) => pathname?.startsWith(route));

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <GoogleOAuthProvider clientId={googleClientId}>
            <DynamicThemeProvider>
              {isAuthPage ? (
                <GoogleReCaptchaProvider
                  reCaptchaKey={captchaKey}
                  scriptProps={{
                    async: false,
                    defer: false,
                    appendTo: "head",
                    nonce: undefined,
                  }}
                  container={{
                    parameters: {
                      badge: "inline",
                    },
                  }}
                >
                  <ToastContainer
                    autoClose={1000}
                    hideProgressBar={true}
                    position="bottom-left"
                    transition={Slide}
                  />
                  <Suspense>{children}</Suspense>
                </GoogleReCaptchaProvider>
              ) : (
                <>
                  <ToastContainer
                    autoClose={1000}
                    hideProgressBar={true}
                    position="bottom-left"
                    transition={Slide}
                  />
                  <Suspense>{children}</Suspense>
                </>
              )}
            </DynamicThemeProvider>
          </GoogleOAuthProvider>
          {process.env.NODE_ENV === "development" && (
            <ReactQueryDevtools initialIsOpen={false} />
          )}
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}
