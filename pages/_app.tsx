// Global CSS imports
import '../src/components/layouts/App/App.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-tippy/dist/tippy.css';
import '../src/components/MemberArea/EditProfile.css';
import '../src/components/AutoComplete/AutoComplete.css';
import '../src/components/Content/Content.css';
import '../src/components/Filter/Filter.css';
import '../src/components/FilterClear/FilterClear.css';
import '../src/components/Input/Input.css';
import '../src/components/MentorsList/MentorList.css';
import '../src/components/Modal/Modal.css';
import '../src/components/SocialLinks/SocialLinks.css';
import '../src/index.css';

// import App from 'next/app'

import Head from './head';
import { ApiProvider } from '../src/context/apiContext/ApiContext';
import { AuthProvider } from '../src/context/authContext/AuthContext';
import { UserProvider } from '../src/context/userContext/UserContext';
import { FiltersProvider } from '../src/context/filtersContext/FiltersContext';
import { ModalHookProvider } from '../src/context/modalContext/ModalContext';
import { MentorsProvider } from '../src/context/mentorsContext/MentorsContext';
import Script from 'next/script';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Scripts />
      <Head />
      <AuthProvider>
        <ApiProvider>
          <UserProvider>
            <ModalHookProvider>
              <FiltersProvider>
                <MentorsProvider>
                  <Component {...pageProps} />
                </MentorsProvider>
              </FiltersProvider>
            </ModalHookProvider>
          </UserProvider>
        </ApiProvider>
      </AuthProvider>
    </>
  );
}

const Scripts = () => (
  <>
    <Script id="google-analytics">
      {`
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;
          (i[r] =
            i[r] ||
            function () {
              (i[r].q = i[r].q || []).push(arguments);
            }),
            (i[r].l = 1 * new Date());
          (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
          a.async = 1;
          a.src = g;
          m.parentNode.insertBefore(a, m);
        })(
          window,
          document,
          'script',
          'https://www.google-analytics.com/analytics.js',
          'ga'
        );
        ga('create', 'UA-133820299-2', 'auto');
        ga('send', 'pageview');
        `}
    </Script>
  </>
);

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// MyApp.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//
//   return { ...appProps }
// }

export default MyApp;
