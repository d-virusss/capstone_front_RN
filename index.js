/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import App from './App';
import Toast from './views/shared/Toast'
import {name as appName} from './app.json';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

function HeadlessCheck({isHeadless}) {
  if (isHeadless){
    return null;
  } 

  return <App/>;
}

AppRegistry.registerComponent(appName, () => App);
