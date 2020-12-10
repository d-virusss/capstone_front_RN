import React, {Component} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Button as NativeButton,  Dimensions, TextInput,
  Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Form, Item, Input, Label, Header, 
  Left, Right, Body, Title, Icon, Button, Text} from 'native-base';
import api from '../shared/server_address';
import Fire from '../shared/Fire';


var {Height, Width} = Dimensions.get('window');

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
      phone : this.state.number,
      code : this.state.code
    }
  };

  api.post('/users/sms_auth', auth)
  .then((res) => {
    console.log(res.data);
    Alert.alert("인증 완료", res.data.message, [{text:'확인'},{style:'cancel'}])
    this.setState({code : "success"})
  }).catch((err) => {
    Alert.alert("인증 실패", err.response.data.error, [{text:'확인'},{style:'cancel'}])
  })
}

 is_input_idle(text){
  if(text === '') return true
  else return false
}

 renderSubmitButton(){
  if(this.is_input_idle(this.state.number)){
    return (
      <Button bordered style={{ borderColor: '#aaaaaa'}} disabled>
        <Text style={{ color: '#aaaaaa', fontWeight:'bold'  }}>인증</Text>
      </Button>
    )
  }
  else{
    if(this.state.code == "success"){
      return(
        <Button NativeButton style={{ backgroundColor: '#aaaaaa' }} disabled>
          <Text style={{ color: 'white',fontWeight:'bold'}}>인증</Text>
        </Button>
      )
    }else{
      return(
        <Button NativeButton style={{ backgroundColor: '#ff3377' }}
          onPress={() => this.authRequest()}>
          <Text style={{ color: 'white',fontWeight:'bold'}}>인증</Text>
        </Button>
      )
    }
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
      <View>
        <Text style={styles.codeTextForm}>인증번호</Text>
        <View style={styles.codeForm}>
          <TextInput style={styles.keywordArea}
            placeholder='인증번호를 입력해주세요.'
            autoCapitalize='none'
            onChangeText={(text) => this.setState({code : text})}
            editable={this.state.code == "success" ? "false" : "true"}
            />
            {this.AuthCodeSubmit()}
        </View>
      </View>
    )
  }else{
    console.log("fail")
    return null;
  }
}

AuthCodeSubmit() {
  if(this.is_input_idle(this.state.code)){
    return (
      <Button bordered style={{ borderColor: '#aaaaaa'}} disabled>
        <Text style={{ color: '#aaaaaa', fontWeight:'bold'  }}>확인</Text>
      </Button>
    )
  }else{
    if(this.state.code == "success"){
      return(
        <Button NativeButton style={{ backgroundColor: '#aaaaaa' }} disabled>
             <Text style={{ color: 'white', fontWeight:'bold' }}>확인</Text>
        </Button>
      )
    }else{
      return(
        <Button NativeButton style={{ backgroundColor: '#ff3377' }} 
          onPress={() => this.authCodeRequest()}>
             <Text style={{ color: 'white', fontWeight:'bold' }}>확인</Text>
        </Button>
      )
    }
  }
  
}
  registrationRequest = async () => {
      if(this.state.code != "success"){
        Alert.alert("가입 실패", "핸드폰 인증이 필요합니다.", [{text:'확인'},{style:'cancel'}])
        return;
      }
      this.makeForm()
      console.log("token")
      console.log(user_obj.user.device_token)
      api
      .post('/users/sign_up', user_obj)
      .then(async (res) =>  {
        user_obj.user.device_token = await AsyncStorage.getItem('fcmToken');
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
          <TouchableWithoutFeedback onPress = {() => Keyboard.dismiss()}>
            <KeyboardAvoidingView>
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

              <Item floatingLabel>
                <Label>생일 ex) 19960827</Label>
                <Input autoCapitalize="none"
                  onChangeText = {(birthday) => {this.state.birthday = birthday }}
                />
              </Item>

              <Content scrollEnabled={false}>
                <Text style={styles.textForm}>SMS 인증</Text>
                <View style={styles.inputForm}>
                  <TextInput style={styles.keywordArea}
                    ref={(input) => { this.textInput = input }}
                    placeholder='연락처 ex) 01012345678'
                    autoCapitalize='none'
                    onChangeText={(text) => this.setState({number : text})}
                    editable={this.state.code == "success" ? "false" : "true"}
                    />
                    {this.renderSubmitButton()}
                </View>
                {this.renderAuthCodeForm()}
              </Content>

            </Form>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
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
    backgroundColor: '#ff3377',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '9%',
    position: 'absolute',
    bottom: -5,
  },
  footerbutton: {
    alignSelf: 'center',
    padding: 4,
    marginBottom: '3%',
    height: 80,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
  inputForm : {
    marginLeft : 0,
    width : '100%',
    padding : '3%',
    flexDirection : 'row',
    alignItems : 'center',
  },
  textForm : {
    width : '100%',
    paddingHorizontal: '4%',
    marginTop: '5%',
    marginBottom: '-1%',
    alignItems : 'center',
    color :'#666666'
  },
  codeTextForm : {
    width : '100%',
    paddingHorizontal: '4%',
    marginTop: '2%',
    marginBottom: '-1%',
    alignItems : 'center',
    color :'#666666'
  },
  
  codeForm : {
    marginLeft : 0,
    width : '100%',
    flexDirection : 'row',
    alignItems : 'center',
    padding : '3%'
  },
  keywordArea : {
    width : '83%',
    fontSize : 17,
    borderWidth : 1,
    borderRadius : 5,
    borderColor : '#aaaaaa',
    padding: '3%',
    marginRight : '3%'
  },
});

