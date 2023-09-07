import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
    };
  }

  render() {
    return (
      <Html lang='es'>
        <Head>
          <link rel='preconnect' href='https://fonts.googleapis.com' />
          <link
            href='https://fonts.googleapis.com/css2?family=Arvo&display=swap'
            rel='stylesheet'
          />
          <script src='https://code.iconify.design/3/3.1.0/iconify.min.js' />
          {/* Global Site Tag (gtag.js) - Google Analytics */}
        </Head>
        <body style={{ background: '#fff' }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
