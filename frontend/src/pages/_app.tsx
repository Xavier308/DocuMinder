import React from 'react';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { store } from '../stores/store';
import { Provider } from 'react-redux';
import '../css/main.css';
import axios from 'axios';
import { baseURLApi } from '../config';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);

  if (typeof window !== 'undefined') {
    // Perform localStorage action
    axios.defaults.baseURL = baseURLApi;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }
  }

  const title = 'DocuMinder';

  const description = 'DocuMinder generated by Flatlogic';

  const url = 'https://flatlogic.com/';

  const image = `https://flatlogic.com/logo.svg`;

  const imageWidth = '1920';

  const imageHeight = '960';

  return (
    <Provider store={store}>
      {getLayout(
        <>
          <Head>
            <meta name='description' content={description} />

            <meta property='og:url' content={url} />
            <meta property='og:site_name' content='https://flatlogic.com/' />
            <meta property='og:title' content={title} />
            <meta property='og:description' content={description} />
            <meta property='og:image' content={image} />
            <meta property='og:image:type' content='image/png' />
            <meta property='og:image:width' content={imageWidth} />
            <meta property='og:image:height' content={imageHeight} />

            <meta property='twitter:card' content='summary_large_image' />
            <meta property='twitter:title' content={title} />
            <meta property='twitter:description' content={description} />
            <meta property='twitter:image:src' content={image} />
            <meta property='twitter:image:width' content={imageWidth} />
            <meta property='twitter:image:height' content={imageHeight} />

            <link rel='icon' href='/favicon.svg' />
          </Head>

          <Component {...pageProps} />
        </>,
      )}
    </Provider>
  );
}

export default MyApp;
