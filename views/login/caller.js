import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import { StyleSheet, Text, View, Alert, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import CustomButton from './custom_button';
import { Item, Input} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IconA from 'react-native-vector-icons/MaterialIcons';
import api from '../shared/server_address';
import db from '../shared/chat_db';
import  {
	AppleButton 
  } from '@invertase/react-native-apple-authentication';


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
  constructor(props){
    super(props);
  }


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

  saveUserData(user_id, user_location, user_token){
    db.transaction(tx=>{
      tx.executeSql('insert into user (user_id, location, token) VALUE(?,?,?)',[user_id, user_location, user_token],
      (tx,results)=>{console.log(results)},(err)=>console.log(err))
    })
  }

  getToken = async() =>{
    myL = await AsyncStorage.getItem('my_location');
  }
  makeRequest = async()=>{
    if (userinfo.user.email == ''){
      Alert.alert('로그인',"이메일을 입력해주세요.",[{text: '확인', style:'cancel'}])
    }
    if (userinfo.user.password == '')
      Alert.alert("로그인", "비밀번호를 입력해주세요.",[{text: '확인', style:'cancel'}])
    if (!(userinfo.user.email == '') && !(userinfo.user.password == '')) {
      await api
        .post('/users/sign_in', userinfo)
        .then(async(response) => {
          this.addDevice(response.data.token);
          console.log(response);
          //this.saveUserData(response.data.id,response.data.location_auth,response.data.token)
          AsyncStorage.setItem('token', response.data.token);
          AsyncStorage.setItem('user_id', String(response.data.id));
          AsyncStorage.setItem('my_location',String(response.data.location_auth));
    
          if (response.data.location_auth != null) {// already has location
            //await Fire.signIn(userinfo.user);
            this.props.navigation.navigate('Main')
          }
          else {
            //await Fire.signIn(userinfo.user);
            this.props.navigation.navigate('MyPage_Location')
          }
          //this.addUserIDtoDB(response.data.id);
        })
        .catch(function (error) {
          console.log("login fail")
          Alert.alert("로그인 실패",error.response.data.error,[{text:'확인', style:'cancel'}])
        });
    }
  }

  testLoginRequest(){
    api
      .post('/users/sign_in', user_obj)
      .then((response) => {
        this.addDevice(response.data.token);
        console.log(response);
        console.log(response.data.location_auth)
        AsyncStorage.setItem('token', response.data.token);
        AsyncStorage.setItem('user_id', String(response.data.id));
        AsyncStorage.setItem('my_location', String(response.data.location_auth));
     
        if ((response.data.location_auth) != null) {// already has location
          console.log("dddd")
          this.props.navigation.navigate('Main')
          return ;
        } else {
          console.log("aaaa")
          this.props.navigation.navigate('MyPage_Location')
          return ;
        }
      })
      .catch(function (error) {
        console.log('axios call failed!! : ' + error);
        Alert.alert("요청 실패", error.response.data.error,[{text:'확인', style:'cancel'}])
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

  addDevice = async(tok)=>{
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    await api
            .post('/users/add_device',{
              user:{
                device_token: fcmToken
              }
            },{
              headers:{
                'Authorization': tok
              }
            })
            .then(response=>{
              console.log('fcm add device success')
              console.log(response)
            })
            .catch(err=>console.log(err))
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}></View>
        <View style={{flex: 4, width: '70%', alignSelf: 'center'}}>
          <TouchableOpacity style={{ flex: 1,}} onPress={() => this.testLoginRequest()}>
            <Text style={{ color: 'black', fontSize: 40, textAlign: 'center', fontWeight: 'bold'}}>
              모두나눔
            </Text>
          </TouchableOpacity>

         
              <View style={{flex: 1 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    height: '50%',
                    alignItems: 'center',
                  }}>
                
                    <IconA name="person" type="MaterialIcons" size={30} color="black" style={{flex: 1}}/>
                    <Item style={{flex: 4, marginLeft: -10}}>
                      <Input
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={{fontSize: 20, }}
                        placeholder="이메일"
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
                  <Item style={{flex: 4, marginLeft: -10}}>
                    <Input
                      type="password"
                      style={{fontSize: 20}}
                      placeholder="비밀번호"
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
                title="이메일로 로그인"
                titleColor="white"
                buttonColor="#ff3377"
                borderWidth={5}
                borderRadius={5}
                width="100%"
                height="100%"
                fontWeight="bold"
                onPress={() => {console.log(userinfo); this.makeRequest()}}
              />
            </View>
            <View style={{marginTop: '3%', height: '10%'}}>
            <AppleButton
                buttonStyle={AppleButton.Style.BLACK}
                buttonType={AppleButton.Type.SIGN_IN}
                style={{
                  width: '100%', // You must specify a width
                  height: '100%', // You must specify a height
                  fontWeight: 'bold',
                }}
                onPress={() => this.props.navigation.navigate('AppleLogin')}
              />
              
            </View>
            
            <View style={{marginTop: '3%', height: '10%'}}>
            <CustomButton
                title=" 카카오로 로그인"
                icon_name="chat"
                icon_type="MaterialCommunityIcons"
                titleColor="black"
                buttonColor="#fae100"
                borderWidth={5}
                borderRadius={5}
                width="100%"
                height="100%"
                fontWeight="bold"
                onPress={() => this.props.navigation.navigate('KakaoLogin')}
              /> 
            </View>

            <View style={{marginTop: '3%', height: '10%'}}>
              <CustomButton
                title="회원가입"
                titleColor="black"
                buttonColor="white"
                width="100%"
                height="100%"
                fontWeight="bold"
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
                <View style={{width: '49%', marginRight : '2%'}}>
                  <CustomButton
                    title="이메일 찾기"
                    titleColor="#fff"
                    buttonColor="#aaaaaa"
                    width="100%"
                    height="100%"
                    fontSize={15}
                    fontWeight="bold"
                    onPress={() => this.props.navigation.navigate('Find_id')}
                  />
                </View>
                <View style={{width: '49%',}}>
                  <CustomButton
                    title="PW 찾기"
                    titleColor="#fff"
                    buttonColor="#aaaaaa"
                    width="100%"
                    height="100%"
                    fontSize={15}
                    fontWeight="bold"
                    onPress={() => this.props.navigation.navigate('Find_pw')}
                  />
                </View>
              </View>

            </View>
          </View>
        </View>
      </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default LoginScreen;
