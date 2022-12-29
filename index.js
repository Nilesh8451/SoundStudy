/**
 * @format
 */
import React from 'react';

import {AppRegistry} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import App from './App';
import { Provider } from 'react-redux';


import {name as appName} from './app.json';
import { store } from './redux/store';


const ReduxAPP = () => {
    return (
      <Provider store={store}>
     
          <App />
      </Provider>
    );
  };


TrackPlayer.registerPlaybackService(() => require('./service'));

AppRegistry.registerComponent(appName, () => ReduxAPP);

