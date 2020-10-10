import axios from 'axios';
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
import PostWrite_p from '../post/postwrite_p';
Icon.loadFont();
const api = axios.create({baseURL: 'http://52.79.179.211'});

var user_obj = {
  user: {
    email: 'test@test.com',
    password: '1234',
    password_confirmation: '1234',
    nickname: "new_appleman",
  },
};

class LoginScreen extends Component {
  state = {
    token : ""
  }
  senddata(data){
    this.setState({
      token : data
    })
  }
  componentDidMount() {
    api
      .post('/users/sign_up', user_obj)
      .then(function (response) {
        console.log("create success!")
        console.log('true_token : ' + response.data.token.jwt);
        console.log("all token : " + response);
        senddata(response)
        this.props.navigation.navigate('PostWrite_p', {
          data: {
            title: 'Hello World',
            token: response.data.token.jwt,
          },
        });
      })
      .catch(function (error) {
        console.log('axios call faiddddl: ' + error);
      });
  }

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
                <Input style={{fontSize: 25}} placeholder="Username" />
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
                <Input style={{fontSize: 25}} placeholder="Password" />
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
                onPress={() => this.props.navigation.navigate('PLScreen')}
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