import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomButton from './custom_button';
import { Item, Input} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import api from '../shared/server_address'

Icon.loadFont();

var user_obj = {
  user: {
    email: 'tester1@test.com',
    password: 'test123',
  },
};

var userinfo = {
  user: {
    email: '',
    password: '',
  },
};

class LoginScreen extends Component {

  setToken = async () => {
    try {
      await AsyncStorage.setItem('token', response.data.token);
    } catch (error) {
      // Error saving data
    }
  };

  senddata(data) {
    console.log('enter senddata');
  }

  
  makeRequest() {
    if(userinfo.user.email == '')
      alert("이메일을 입력해주세요")
    if(userinfo.user.password == '')
      alert("비밀번호를 입력해주세요")
    api
      .post('/users/sign_in', userinfo)
      .then((response) => {
        console.log(response.data.token);
        AsyncStorage.setItem('token', response.data.token);
        AsyncStorage.setItem('user_id', String(response.data.id));
        AsyncStorage.setItem('myLocation', String(response.data.location_auth));
        
        if (String(response.data.location_auth) == "true") {// already has location
          this.props.navigation.navigate('postIndex')
        } else {
          this.props.navigation.navigate('MyPage_Location')
        }
      })
      .catch(function (error) {
        console.log("login fail")
        alert("가입하신 정보를 다시 확인해주세요")
      });
  }

  testLoginRequest(){
    api
      .post('/users/sign_in', user_obj)
      .then((response) => {
        console.log(response.data.token);
        AsyncStorage.setItem('token', response.data.token);
        AsyncStorage.setItem('user_id', String(response.data.id));
        AsyncStorage.setItem('myLocation', String(response.data.location_auth));
        
        if (String(response.data.location_auth) == "true") {// already has location
          this.props.navigation.navigate('postIndex')
        } else {
          this.props.navigation.navigate('MyPage_Location')
        }
      })
      .catch(function (error) {
        console.log('axios call failed!! : ' + error);
      });
  }

  redirectKakaoLogin() {
    this.props.navigation.navigate('KakaoLogin');
  }

  changeUsername = (text, type) => {
    if (type === 'email') {
      userinfo.user.email = text;
      console.log(userinfo.user.email);
    } else if (type === 'password') {
      userinfo.user.password = text;
      console.log(userinfo.user.password);
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 4, width: '70%', alignSelf: 'center'}}>
          <Text
            style={{
              color: 'black',
              fontSize: 40,
              textAlign: 'center',
              flex: 1,
            }}>
            모두나눔
          </Text>
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                height: '50%',
                alignItems: 'center',
              }}>
              <Icon
                name="ios-person-outline"
                size={30}
                color="black"
                style={{flex: 1}}></Icon>
              <Item style={{flex: 4}}>
                <Input
                  style={{fontSize: 25}}
                  placeholder="E-mail"
                  autoCapitalize="none"
                  onChangeText={(text) => this.changeUsername(text, 'email')}
                />
              </Item>
            </View>
            <View
              style={{
                flexDirection: 'row',
                height: '50%',
                alignItems: 'center',
              }}>
              <Icon name="key" size={30} color="black" style={{flex: 1}}></Icon>
              <Item style={{flex: 4}}>
                <Input
                  type="password"
                  style={{fontSize: 25}}
                  placeholder="Password"
                  autoCapitalize="none"
                  secureTextEntry={true}
                  onChangeText={(text) => this.changeUsername(text, 'password')}
                />
              </Item>
            </View>
          </View>
          <View name="buttons" style={{flex: 3}}>
            <View style={{marginTop: '10%', height: '10%'}}>
              <CustomButton
                title="로그인"
                titleColor="black"
                buttonColor="white"
                borderWidth={5}
                borderRadius={5}
                width="100%"
                height="100%"
                onPress={() => this.makeRequest()}
              />
            </View>
            <View style={{marginTop: '3%', height: '10%'}}>
              <CustomButton
                title="test로그인"
                titleColor="black"
                buttonColor="white"
                borderWidth={5}
                borderRadius={5}
                width="100%"
                height="100%"
                onPress={() => this.testLoginRequest()}
              />
            </View>
            <View style={{marginTop: '3%', height: '10%'}}>
              <CustomButton
                title="카카오 로그인"
                icon_name="chatbubble-sharp"
                titleColor="black"
                buttonColor="#fae100"
                borderWidth={5}
                borderRadius={5}
                width="100%"
                height="100%"
                onPress={() => this.redirectKakaoLogin()}
              />
            </View>
            <View style={{marginTop: '3%', height: '10%'}}>
              <CustomButton
                title="회원가입"
                titleColor="#fff"
                buttonColor="#64b5f6"
                width="100%"
                height="100%"
                onPress={() => this.props.navigation.navigate('Register')}
              />
            </View>
            <View style={{height: '10%', marginTop: '3%'}}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                <View style={{width: '47%', marginRight: '3%'}}>
                  <CustomButton
                    title="ID찾기"
                    titleColor="#fff"
                    buttonColor="#C8C8C8"
                    width="100%"
                    height="100%"
                    fontSize={15}
                    onPress={() => this.props.navigation.navigate('Find_id')}
                  />
                </View>
                <View style={{width: '47%', marginLeft: '3%'}}>
                  <CustomButton
                    title="PW찾기"
                    titleColor="#fff"
                    buttonColor="#C8C8C8"
                    width="100%"
                    height="100%"
                    fontSize={15}
                    onPress={() => this.props.navigation.navigate('Find_pw')}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default LoginScreen;
