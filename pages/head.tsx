import NextHead from 'next/head';
import { getTitleTags } from '../src/helpers/getTitleTags';

const Head = () => {
  return (
    <NextHead>
      {getTitleTags('Coding Coach')}
      <meta
        name="Description"
        content="Coding Coach is here to connect mentors and mentees around the world, for free. We believe mentorship should be accessible to all, regardless of circumstance."
      />
      <meta
        name="google-site-verification"
        content="FDwgnrh2ftb6shLvseXpn_mH1LNxln2eD7UgE1FSlfg"
      />

      {/* <!-- Open Graph data --> */}
      <meta property="og:type" content="article" />
      <meta property="og:url" content="/" />
      <meta
        property="og:image"
        content={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/codingcoach-logo.jpg`}
      />
      <meta
        property="og:description"
        content="Connecting developers with mentors worldwide."
      />
      <meta property="og:site_name" content="https://mentors.codingcoach.io/" />

      {/* <!-- Twitter cards --> */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@codingcoach_io" />
      <meta name="twitter:domain" content="/" />
      <meta name="twitter:creator" content="@codingcoach_io" />
      <meta
        name="twitter:image"
        content={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/codingcoach-logo.jpg`}
      />
      <meta
        name="twitter:description"
        content="Connecting developers with mentors worldwide."
      />

      {/* <!-- Favicon --> */}
      <link
        rel="shortcut icon"
        href={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/favicon.ico`}
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/apple-touch-icon.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/codingcoach-logo-32.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/codingcoach-logo-16.png`}
      />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/codingcoach-logo-512.png`}
      />
      <link
        rel="manifest"
        href={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/manifest.json`}
      />
      <link
        rel="mask-icon"
        href={`${process.env.NEXT_PUBLIC_PUBLIC_URL}/safari-pinned-tab.svg`}
        color="#20293a"
      />
      <meta name="msapplication-TileColor" content="#20293a" />
      <meta name="theme-color" content="#20293a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
    </NextHead>
  );
};

export default Head;
