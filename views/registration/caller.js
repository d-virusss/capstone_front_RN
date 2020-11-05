import React, {Component} from 'react';
import { StyleSheet, Platform, View, Alert } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import api from '../shared/server_address'
var user_obj = {
  user: {
    email: '',
    nickname: '',
    password: '',
    password_confirmation: '',
  },
};


export default class RegistrationScreen extends React.Component {
 state = {
  user: {
    email: '',
    nickname: '',
    password: '',
    password_confirmation: '',
  },
 };

 checkInputVaule = async() => {
    //check pw
    if(this.state.user.password_confirmation != this.state.user.password)
      alert("비밀번호가 다릅니다")

    user_obj.user = this.state.user;
 
   }

  onButtonPress = async () => {
    this.checkInputVaule().then(()=>{

      api
      .post('/users/sign_up', user_obj)
      .then((res) =>  {
        console.log('send data for registration');
        alert("회원가입 성공")
        this.props.navigation.navigate("Logins")
      })
      .catch((err) =>  {
        console.log('fail to register');
        alert("회원가입 실패")
      });
    })
  };


  render() {
    return (
      <Container>
        <Content>
          <Form>
          {/* email */}
          <Item floatingLabel>
              <Label>E-mail</Label>
              <Input
              ref="e_mail"
              placeholder="이메일을 입력하세요"
              onChangeText = {(eMail) => {
                this.state.user.email = eMail
                }}
            />
          </Item>

            {/* pw */}
          <Item floatingLabel>
            <Label>비밀번호</Label>
            <Input
              placeholder="비밀번호를 입력하세요"
              onChangeText = {(pw) => {
                this.state.user.password = pw
                }}
            />
          </Item>

          <Item floatingLabel>
            <Label>비밀번호 확인</Label>
            <Input
              placeholder="비밀번호를 다시 입력하세요"
              onChangeText={(pw_confirmation) => {
                this.state.user.password_confirmation = pw_confirmation
              }}
                
            />
          </Item>

          {/* nickname */}
          <Item floatingLabel>
            <Label>이름</Label>
            <Input
              placeholder="이름을 입력하세요"
              onChangeText = {(name) => {
                this.state.user.nickname = name
                }}
            />
          </Item>

          {/* phone */}
          <Item floatingLabel>
            <Label>연락처</Label>
            <Input
              placeholder="연락처를 입력하세요"
            />
          </Item>
        </Form>
      </Content>

      <Content>
        <Button bordered info onPress={this.onButtonPress}>
            <Text>가입</Text>
        </Button>
    
      </Content>
    </Container>
    );
  }
}

const styles = StyleSheet.create({
 
});

