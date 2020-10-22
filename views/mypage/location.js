import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
//import {WebView} from 'react-native-webview';

class LocationScreen extends Component {
  render() {
    const uri = 'http://webwiew-domain/app/map';

    const goToSetLocation = () => {
      console.log('Navigation router run...');
    };

    return <View></View>;
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
});
export default LocationScreen;
