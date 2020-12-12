import React, {Component} from 'react';
import {WebView} from 'react-native-webview';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'

var user={
  user:{
    device_token:''
  }
};

class AppleLoginScreen extends Component {

  onWebViewMessage = (e) => {
    //console.log(e.nativeEvent.data)
    let res = JSON.parse(e.nativeEvent.data);
    
    if(res.error){
      this.props.navigation.goBack(); //back to login
      return;
    }

    AsyncStorage.setItem('token', res.token);
    AsyncStorage.setItem('user_id', String(res.id));

    this.getDeviceToken().then(()=> {
      api.post('/users/add_device',user, {
        headers: {
          Authorization: res.token,
        },
      }).then((res) => {
        console.log("디바이스 등록 성공")
        
      }).catch((err) => {
        console.log(err);
        Alert.alert("기기 등록 실패", "등록된 기기가 없습니다.",[{text:'확인', style:'cancel'}])
      })
    })

    if (res.location_auth != '') {// already has location
      this.props.navigation.push('Main')
      AsyncStorage.setItem('my_location', res.location_auth);
    } else {
      this.props.navigation.push('MyPage_Location')
      AsyncStorage.setItem('my_location', String(null));
    }
    
  };

  getDeviceToken = async() =>{
    user.user.device_token = await AsyncStorage.getItem('fcmToken');
  }

  render() {
    return (
      <WebView
        ref={(webview) => (this.webview = webview)}
        source={{ uri: 'https://www.applepink.ml/users/auth/apple'}}
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

export default AppleLoginScreen;
