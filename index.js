/**
 * @format
 */
import "react-native-url-polyfill/auto"
import '@azure/core-asynciterator-polyfill'
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
