import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component, Fragment} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Button,
  TouchableHighlightBase,
} from 'react-native';
import CustomButton from './custom_button';
import {Container, Header, Content, Form, Item, Input} from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Post_provide from '../post/post_provide';
Icon.loadFont();
const api = axios.create({baseURL: 'http://3.35.9.144'});

var user_obj = {
  user: {
    email: 'tester1@test.com',
    password: 'test123',
  },
};

let userinfo = {
  user: {
    email: '',
    password: '',
  },
};

class LoginScreen extends Component {
  state = {
    token: '',
    title: 'first',
    user: {
      email: '',
      password: '',
      asdf: '',
      ttas: '',
    },
  };

  setToken = async () => {
    try {
      await AsyncStorage.setItem('token', response.data.token);
    } catch (error) {
      // Error saving data
    }
  };

  senddata(data) {
    console.log('enter senddata');
    // this.setState({
    //   token : toString(data)
    // })
  }

  makeRequest() {
    console.log('start send request to server');
    api
      .post('/users/sign_in', user_obj)
      .then((response) => {
        console.log('create success!');
        console.log(response);
        AsyncStorage.setItem('token', response.data.token);
        AsyncStorage.setItem('user_id', String(response.data.id));
        this.props.navigation.navigate('postIndex');
      })
      .catch(function (error) {
        console.log('axios call failed!! : ' + error);
      });
  }
  makeKakaoRequest() {
    console.log('kakao login start!');
    api
      .get('/users/auth/kakao')
      .then((response) => {
        console.log('get kakao login callback');
        console.log(response);
      })
      .catch(function (error) {
        console.log('kakao auth call failed!!' + error);
      });
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
                  placeholder="Username"
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
                title="카카오계정 로그인"
                icon_name="chatbubble-sharp"
                titleColor="black"
                buttonColor="#fae100"
                borderWidth={5}
                borderRadius={5}
                width="100%"
                height="100%"
                onPress={() => this.makeKakaoRequest()}
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
