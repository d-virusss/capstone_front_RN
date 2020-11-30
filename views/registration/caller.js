import React, {Component} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Button as NativeButton} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Form, Item, Input, Label, Header, 
  Left, Right, Body, Title, Icon, Button, Text} from 'native-base';
import api from '../shared/server_address';
import Fire from '../shared/Fire';

var user_obj = {
  user: {
    email: '',
    nickname: '',
    password: '',
    password_confirmation: '',
    number:'',
    device_token:'',
    name: '',
    birthday: '',
  },
};


export default class RegistrationScreen extends React.Component {
 state = {
  email: '',
  nickname: '',
  password: '',
  password_confirmation: '',
  device_token:'',
  name : "",
  birthday : "",
  number : '',
  auth : false,
  code:'',
 };

  authRequest(){
  console.log("call request---------------")
  let auth = {
    user : {
      phone : this.state.number
    }
  };

  api.post('/users/sms_auth', auth)
  .then((res) => {
    console.log(res.data);
    Alert.alert("전송 완료", res.data.message, [{text:'확인'},{style:'cancel'}])
    this.setState({auth : true})
  }).catch((err) => {
    Alert.alert("전송 실패", e.response.data.error, [{text:'확인'},{style:'cancel'}])
  })
}

authCodeRequest(){
  console.log("call code request---------------")
  let auth = {
    user : {
      code : this.state.code
    }
  };

  api.post('/users/sms_auth', auth)
  .then((res) => {
    console.log(res.data);
    Alert.alert("인증 완료", res.data.message, [{text:'확인'},{style:'cancel'}])
  }).catch((err) => {
    Alert.alert("인증 실패", "인증번호를 다시 확인해주세요", [{text:'확인'},{style:'cancel'}])
  })
}

 is_input_idle(){
  if(this.state.number === '') return true
  else return false
}

 renderSubmitButton(){
  if(this.is_input_idle()){
    return (
      <Button bordered style={{ borderColor: '#aaaaaa', marginTop : '3%'}} disabled>
        <Text style={{ color: '#aaaaaa' }}>인증</Text>
      </Button>
    )
  }
  else{
    return(
      <Button NativeButton style={{ backgroundColor: '#ff3377', marginTop : '3%' }} onPress={() => this.authRequest()}>
        <Text style={{ color: 'white', fontWeight:'bold' }}>인증</Text>
      </Button>
    )
  }
}

makeForm() {
  user_obj.user.email = this.state.email;
  user_obj.user.nickname = this.state.nickname;
  user_obj.user.password = this.state.password;
  user_obj.user.password_confirmation = this.state.password_confirmation;
  user_obj.user.number = this.state.number;
  user_obj.user.device_token = this.state.device_token;
  user_obj.user.name = this.state.name;
  user_obj.user.birthday = this.state.birthday;
}

renderAuthCodeForm(){
  if(this.state.auth){
    return(
      <View style={{flexDirection: 'row', alignItems: 'center',}}>
        <Item floatingLabel style={{width : '80%'}}>
          <Label>인증 번호</Label>
          <Input autoCapitalize="none"
            keyboardType="numeric"
            onChangeText = {(text) => {this.setState({code : text}) }}
          />
        </Item>
        <Button NativeButton style={{ backgroundColor: '#ff3377', marginTop : '3%' }} onPress={() => this.authCodeRequest()}>
          <Text style={{ color: 'white', fontWeight:'bold' }}>확인</Text>
        </Button>
      </View>
    )
  }else{
    console.log("fail")
    return null;
  }
}

  registrationRequest = async () => {
      this.makeForm()
      user_obj.user.device_token = await AsyncStorage.getItem('fcmToken');
      console.log("token")
      console.log(user_obj.user.device_token)
      api
      .post('/users/sign_up', user_obj)
      .then(async (res) =>  {
        console.log(res);
        //await Fire.createUser(user_obj.user);
        console.log('send data for registration');
        Alert.alert("모두나눔 가입 완료", "회원가입이 완료되었습니다.",[
          {
            text:'확인', 
            onPress: () => {this.props.navigation.goBack()}
          },
          {
            style:'cancel'
          }
        ])
      })
      .catch((err) =>  {
        console.log('fail to register');
        console.log(err.response.data.error)
        Alert.alert("가입 실패", err.response.data.error,[
          {
            text:'확인', 
            onPress: () => {}
          },
          {
            style:'cancel'
          }
        ])       
      });
    
  };


  render() {
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title>회원가입</Title></Body>
          <Right></Right>
        </Header>
        <Content>
          <Form>
          {/* email */}
            <Item floatingLabel>
                <Label>이메일</Label>
                <Input
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText = {(eMail) => { this.state.email = eMail}}/>
            </Item>

              {/* pw */}
            <Item floatingLabel>
              <Label>비밀번호</Label>
              <Input placeholder="password" secureTextEntry={true} autoCapitalize="none"
                onChangeText = {(pw) => {this.state.password = pw;}}/>
            </Item>

            <Item floatingLabel>
              <Label>비밀번호 확인</Label>
              <Input placeholder="password" secureTextEntry={true} autoCapitalize="none"
                onChangeText={(pw_confirmation) => {this.state.password_confirmation = pw_confirmation}}/>
            </Item>


            <Item floatingLabel>
              <Label>이름(실명)</Label>
              <Input autoCapitalize="none"
                onChangeText = {(text) => {this.state.name = text }}
              />
            </Item>

            {/* nickname */}
            <Item floatingLabel>
              <Label>닉네임</Label>
              <Input autoCapitalize="none"
                onChangeText = {(name) => {this.state.nickname = name }}
              />
            </Item>

            {/* phone */}
            <View style={{flexDirection: 'row', alignItems: 'center',}}>
              <Item floatingLabel style={{width : '80%'}}>
                <Label>연락처 ex) 01012345678</Label>
                <Input autoCapitalize="none"
                  keyboardType="numeric"
                  onChangeText = {(text) => {this.setState({number : text}) }}
                />
              </Item>
              {this.renderSubmitButton()}
            </View>
            {this.renderAuthCodeForm()}
            

            <Item floatingLabel>
              <Label>생일 ex) 19960827</Label>
              <Input autoCapitalize="none"
                onChangeText = {(birthday) => {this.state.birthday = birthday }}
              />
            </Item>

          </Form>
        </Content>
        <View style={styles.footer}>
          <Button transparent style={ styles.footerbutton }
            onPress={() => this.registrationRequest()}>
            <Text style={styles.footerText}>회원가입</Text>
          </Button>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    flex:0.1,
    left: 0,
    right: 0,
    bottom: -5,
    backgroundColor:'#ff3377',
    flexDirection:'row',
    height:80,
    alignItems:'center',
    paddingTop: 7
  },
  footerbutton: {
    alignItems:'center',
    justifyContent: 'center',
    flex:1,
  },
  footerText: {
    color:'white',
    fontWeight:'bold',
    alignItems:'center',
    fontSize: 20,
  },
});

