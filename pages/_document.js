import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta name="application-name" content="eminstore" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="eminstore" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/static/icons/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#000" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#fff" />

          <link rel="apple-touch-icon" href="/icon-192x192.png" />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/icon-192x192.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/icon-192x192.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="167x167"
            href="/icon-192x192.png"
          />

          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/icon-192x192.png"
          />

          <link rel="mask-icon" href="/icon-192x192.png" color="#5bbad5" />
          <link rel="shortcut icon" href="/icon-192x192.png" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
          />

          <meta name="twitter:creator" content="@Hi_EminX" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="icon" href="/icon-512x512.png" type="image/x-icon" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />

          <!-- Google tag (gtag.js) -->
            <script async src="https://www.googletagmanager.com/gtag/js?id=G-L5KXY7CS9J"></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', 'G-L5KXY7CS9J');
            </script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
