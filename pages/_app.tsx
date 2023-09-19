import "tailwindcss/tailwind.css";
import "../styles/global.css";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import { ApolloProvider } from "@apollo/client";
import { RegionsProvider } from "@/components/RegionsProvider";
import { useAuthenticatedApolloClient } from "@/lib/auth/useAuthenticatedApolloClient";
import { SaleorAuthProvider, useAuthChange, useSaleorAuthClient } from "@/lib/auth";
import { CheckoutProvider } from "@/lib/providers/CheckoutProvider";
import { API_URI, CLIENT_ID } from "@/lib/const";
import { store } from "../app/store";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import Router from "next/router";
NProgress.configure({ showSpinner: false });
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());
// PayPal
import { PayPalScriptProvider } from '@paypal/react-paypal-js';

function MyApp({ Component, pageProps }) {

    const useSaleorAuthClientProps = useSaleorAuthClient({
        saleorApiUrl: API_URI,
        storage: typeof window !== "undefined" ? window.localStorage : undefined,
    });

    const { saleorAuthClient } = useSaleorAuthClientProps;

    const { apolloClient, resetClient } = useAuthenticatedApolloClient(
        saleorAuthClient.fetchWithAuth
    );

  return (
      <AnimatePresence>
          <SaleorAuthProvider {...useSaleorAuthClientProps}>
              <ApolloProvider client={apolloClient}>
                  {/* PayPal沙盒账号 */}
                  {/*<PayPalScriptProvider options={{ "client-id": "AZWL-t91AurMPc_QJNIDXGX7klRDTtsQe1G7CegWplWlJ0fhZmmhGkRhh8oALtJ-q1GMQcn0knYh03c0" }}>*/}
                  {/* PayPal正式账号 */}
                  <PayPalScriptProvider options={{ "client-id": "AYypkTwKb-agVMyxJByKU__0DIwLFQ0mQuSbPpkmU3d_XiZZNbA9UPKMxWWuGqDdj7LNjCbUSE0xnL2S" }}>
                  <CheckoutProvider>
                      <RegionsProvider>
                          <Provider store={store}>
                              <Component {...pageProps} />
                          </Provider>
                      </RegionsProvider>
                  </CheckoutProvider>
                  </PayPalScriptProvider>
              </ApolloProvider>
          </SaleorAuthProvider>
      </AnimatePresence>
  );
}

export default MyApp;
