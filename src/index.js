import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import SearchLocationInput from './components/map/SearchLocationInput';

ReactDOM.render(
  <React.StrictMode>
    <SearchLocationInput />
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.unregister();
