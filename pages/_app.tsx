// import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import PrivateRoute from 'routers/PrivateRoute';
import useApolloClient from 'hooks/useApolloClient';
import { ApolloProvider } from '@apollo/client';
import { ToastContainer } from 'react-toastify';
import { NextComponentType, NextPageContext } from 'next/types';
import 'react-toastify/dist/ReactToastify.css';
import 'styles/globals.scss';
import 'nprogress/nprogress.css';
import Router from 'next/router';
import NProgress from 'nprogress';
import CookieConsent from 'react-cookie-consent';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps: { session, ...pageProps } }: any) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={60 * 30}
    >
      <Head>
        <title>{`${pageProps?.page?.name} | Boilerplate PrevalentWare`}</title>
        <link
          rel='shortcut icon'
          href='/img/icons/favicon.ico'
          type='image/x-icon'
        />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          href='https://fonts.googleapis.com/css2?family=Arvo&display=swap'
          rel='stylesheet'
        />

        <title>Boiler Plate</title>
        <meta name='title' content='' />
        <meta name='description' content='' />
        <meta property='og:type' content='' />
        <meta property='og:url' content='' />
        <meta property='og:title' content='' />
        <meta property='og:description' content='' />
        <meta property='og:image' content='' />

        <meta property='twitter:card' content='' />
        <meta property='twitter:url' content='' />
        <meta property='twitter:title' content='' />
        <meta property='twitter:description' content='' />
        <meta property='twitter:image' content='' />
      </Head>
      <App Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}

function App({
  Component,
  pageProps,
}: {
  Component: NextComponentType<NextPageContext, any, {}>;
  pageProps: any;
}) {
  const { client } = useApolloClient();

  return (
    <ApolloProvider client={client}>
      <PrivateRoute
        rejected={pageProps?.rejected ?? false}
        isPublic={pageProps?.isPublic ?? false}
      >
        <CookieConsent
          style={{
            background: '#000000',
            paddingLeft: '30px',
            paddingRight: '30px',
            fontFamily: 'montserrat-regular',
          }}
          buttonStyle={{
            background: '#fff',
            borderRadius: '5px',
            color: 'black',
            paddingLeft: '30px',
            paddingRight: '30px',
            fontWeight: 'bold',
          }}
          buttonText='Aceptar'
        >
          Este sitio web utiliza cookies para mejorar el rendimiento del
          aplicativo.
        </CookieConsent>

        <Component {...pageProps} />
      </PrivateRoute>
      <ToastContainer />
    </ApolloProvider>
  );
}

export default MyApp;
