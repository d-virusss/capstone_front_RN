import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, 
  TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, Dimensions } from 'react-native';
import { Item, Input, Button, Text, Icon} from 'native-base';
import IconB from 'react-native-vector-icons/MaterialCommunityIcons';
import IconA from 'react-native-vector-icons/MaterialIcons';
import api from '../shared/server_address';
import db from '../shared/chat_db';
import  {
	AppleButton 
  } from '@invertase/react-native-apple-authentication';

//this is test login object
//using testLoginRequest func
var user_obj = {
  user: {
    email: '',
    password: '',
  },
};

var userinfo = {
  user: {
    email: '',
    password: '',
  },
};

const max_width=Dimensions.get('window').width;
const max_height=Dimensions.get('window').height;

IconB.loadFont()


class LoginScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      button_font_size:17
    }
  }

  componentDidMount() {
    if(max_width<=375){
      if(max_height<812){
        console.log('is modified? : yes')
        console.log(max_height)
        this.setState({button_font_size:13})
      }
      else{
        console.log('is modified? : yes')
        this.setState({button_font_size:16})
      }
    }
    else if(max_width<=414&&max_height<=736){
      console.log('is modified? : yes')
      console.log('height: '+max_height)
      this.setState({button_font_size:14})
    }
    else console.log('not modified')

    //init var
    userinfo.user.email = ''
    userinfo.user.password = ''
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
            this.props.navigation.push('Main')
          }
          else {
            //await Fire.signIn(userinfo.user);
            this.props.navigation.push('MyPage_Location')
          }
          //this.addUserIDtoDB(response.data.id);
        })
        .catch(function (error) {
          console.log("login fail")
          Alert.alert("로그인 실패",error.response.data.error,[{text:'확인', style:'cancel'}])
        });
    }
  }

  //for test login
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
    console.log(max_width)
    return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <View style={{flex: 1}}></View>
          <View style={{flex: 4, width: '70%', alignSelf: 'center'}}>
            <View style={{ flex: 1,}} >
              <Text style={{ color: 'black', fontSize: 40, textAlign: 'center', fontWeight: 'bold'}}>
              모두나눔
              </Text>
            </View>
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
                <IconB name="key" size={30} color="black" style={{flex: 1}}></IconB>
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
            <View style={{marginTop: '10%', height:'10%'}}>
              <Button onPress={() => {console.log(userinfo); this.makeRequest()}} style={{
                width: '100%',
                height: '100%',
                backgroundColor:'#ff3377',
                justifyContent:'center'
                }}>
                <Text style={{fontWeight:'500', fontSize:this.state.button_font_size, alignSelf:'center'}}>이메일로 로그인</Text>
              </Button>
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
              <Button onPress={() => {this.props.navigation.navigate('KakaoLogin')}} style={{
                width: '100%',
                height: '100%',
                backgroundColor:'#fae100',
                justifyContent:'center',
                alignItems:'center'
                }}>
                <Icon name='chat' type='MaterialCommunityIcons' style={{alignSelf:'center', color:'#000', fontSize:17,marginLeft:0,marginRight:0}} />
                <Text style={{paddingLeft:4,fontWeight:'500', fontSize:this.state.button_font_size, alignSelf:'center',color:'#000'}}>카카오로 로그인</Text>
              </Button>
            </View>

            <View style={{marginTop: '3%', height: '10%'}}>
              <Button onPress={() => this.props.navigation.navigate('Register')} style={{
                width: '100%',
                height: '100%',
                backgroundColor:'#fff',
                justifyContent:'center',
                alignItems:'center'
                }}>
                <Text style={{fontWeight:'500', fontSize:this.state.button_font_size, alignSelf:'center',color:'#000'}}>회원가입</Text>
              </Button>
            </View>
            <View style={{height: '10%', marginTop: '3%'}}>
              <View
                style={{
                  width: '100%',
                  flexDirection: 'row',
                  alignSelf: 'center',
                }}>
                <View style={{width: '49%', marginRight : '2%'}}>
                  <Button onPress={() => this.props.navigation.navigate('Find_id')} style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor:'#aaaaaa',
                    justifyContent:'center',
                    alignItems:'center'
                    }}>
                    <Text style={{fontWeight:'600', fontSize:this.state.button_font_size-1, alignSelf:'center',color:'#fff'}}>이메일 찾기</Text>
                  </Button>
                </View>
                <View style={{width: '49%',}}>
                  <Button onPress={() => this.props.navigation.navigate('Find_pw')} style={{
                    width: '100%',
                    height: '100%',
                    backgroundColor:'#aaaaaa',
                    justifyContent:'center',
                    alignItems:'center'
                    }}>
                    <Text style={{fontWeight:'600', fontSize:this.state.button_font_size-1, alignSelf:'center',color:'#fff'}}>PW 찾기</Text>
                  </Button>
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
