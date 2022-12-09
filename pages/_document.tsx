import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lobster&family=Manrope&family=Mulish&family=Nunito+Sans&family=Roboto+Flex:opsz,wght@8..144,300&family=Roboto:wght@300&family=Source+Sans+Pro&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
