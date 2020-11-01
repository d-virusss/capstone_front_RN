import React, {Component} from 'react';
import {WebView} from 'react-native-webview';

class KakaoLoginScreen extends Component {
  onWebViewMessage = (e) => {
    console.log('kakaologin screen');
    console.log(e.nativeEvent.data);
  };
  render() {
    return (
      <WebView
        source={{uri: 'http://3.35.9.144/users/auth/kakao'}}
        onMessage={this.onWebViewMessage}
        javaScriptEnabled={true}
      />
    );
  }
}

export default KakaoLoginScreen;
