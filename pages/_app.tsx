// Global CSS imports
import '../src/components/App/App.css';
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

// import App from 'next/app'

function MyApp({ Component, pageProps }) {
    return <Component {...pageProps} />
  }
  
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
  
  export default MyApp