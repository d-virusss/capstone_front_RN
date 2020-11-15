import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import { Container, View, Header, Left, Right, Body, Title, TouchableOpacity, Icon } from 'native-base'
import AsyncStorage from '@react-native-community/async-storage';

class KakaoLoginScreen extends Component {
  onWebViewMessage = (e) => {
    //console.log(e.nativeEvent.data)
    let res = JSON.parse(e.nativeEvent.data);
    AsyncStorage.setItem('token', res.token);
    AsyncStorage.setItem('user_id', String(res.id));
    AsyncStorage.setItem('myLocation', res.location_auth);
  
    if (res.location_auth != null) {// already has location
      this.props.navigation.navigate('postIndex')
    } else {
      this.props.navigation.navigate('MyPage_Location')
    }
  };

  render() {
    return (
      <WebView
        ref={(webview) => (this.webview = webview)}
        source={{ uri: 'http://54.180.26.138/users/auth/kakao'}}
        // source={{html}}
        onMessage={this.onWebViewMessage}
        javaScriptEnabled={true}
        onLoadENd={() => {
          console.log('LOAD END');
        }}
        onError={(err) => {
          console.log('ERROR ', err);
        }}
      />
    );
  }
}

export default KakaoLoginScreen;
