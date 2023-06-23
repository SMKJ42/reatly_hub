import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import { Provider } from "react-redux";
import store from "~/redux/store";

export type NextPageWithLayout<P = NonNullable<unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ClerkProvider {...pageProps}>
      <Provider store={store}>
        {getLayout(<Component {...pageProps} />)}
      </Provider>
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
