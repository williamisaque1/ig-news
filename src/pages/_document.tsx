import Document, { Html, Head, Main, NextScript } from "next/document";
export default class myDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&family=Roboto:wght@400;700;900&display=swap"
            rel="stylesheet"
          />
          <link rel="shotcut icon" href="/favicon.png" type="image/png"></link>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
