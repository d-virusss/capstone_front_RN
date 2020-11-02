import React, {Component} from 'react';
import {Alert} from 'react-native';
import {WebView} from 'react-native-webview';

// const html = `
// <script>
// function send(){
//   window.ReactNativeWebView.postMessage('hello');

// }
// </script>
// <button onclick ="send()"> Send</button>
// `;

class KakaoLoginScreen extends Component {
  onWebViewMessage = (e) => {
    console.log("kakao")
    Alert.alert(e.nativeEvent.data);
  };
  render() {
    return (
      <WebView
        ref={(webview) => (this.webview = webview)}
        onMessage={this._onMessage}
        source={{uri: 'http://3.35.9.144/users/auth/kakao'}}
        // source={{html}}
        // onMessage={this.onWebViewMessage}
        javaScriptEnabled={true}
        onLoadENd={() => {
          console.log("LOAD END");
        }}
        onError={err => {
          console.log('ERROR ', err);
        }}
      />
    );
  }

  _onMessage = (data) => {
    alert(data.nativeEvent.data);
  }
}

export default KakaoLoginScreen;
