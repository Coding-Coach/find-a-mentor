import ReactDOM from 'react-dom';
import { App } from './App';

ReactDOM.hydrate(
  <App ssrItems={window.ssrModel} />,
  document.getElementById('root')
);
