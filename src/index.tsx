import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from './ssr/Routes';

ReactDOM.hydrate(
  <Router>
    <Routes ssrData={window.ssrData} />
  </Router>,
  document.getElementById('root'),
  () => {
    delete window.ssrData;
  }
);
