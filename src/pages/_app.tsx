import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import Layout from "components/layout/Layout";
import ThemeProvider from "context/themeContext";
import createEmotionCache from "lib/createEmotionCache";
import { AppProps as NextAppProps } from "next/app";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface AppProps extends NextAppProps {
  emotionCache?: EmotionCache;
}

export default function App(props: AppProps): JSX.Element {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </CacheProvider>
  );
}
