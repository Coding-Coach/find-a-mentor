import TawkMessengerReact from '@tawk.to/tawk-messenger-react';
import { useRef } from 'react';
const Tawk = () => {
  const tawkMessengerRef = useRef();
  const handleMinimize = () => {
    // console.log("was minimized");
    // tawkMessengerRef.current.minimize();
  };

  const onLoad = () => {
    console.log('onLoad works!');
    tawkMessengerRef.current.hideWidget();
  };

  return (
    <>
      {' '}
      <button
        id="somewiredbuttonId"
        style={{ position: 'absolute', top: '200' }}
        onClick={handleMinimize}
      >
        {' '}
        Minimize the Chat{' '}
      </button>
      <TawkMessengerReact
        propertyId="62887ef0b0d10b6f3e735155"
        widgetId="1g3iivn8k"
        onLoad={onLoad}
        ref={tawkMessengerRef}
      />
    </>
  );
};

export default Tawk;
