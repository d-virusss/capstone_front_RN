import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from '../login/custom_button';
import { Container, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import api from '../shared/server_address'

var user_obj = {
  user: {
    email: '',
    nickname: '',
    password: '',
    password_confirmation: '',
  },
};


export default class Contract extends React.Component {
  state = {
    title : "",
    body : "",
  };

  checkInputVaule = async () => {
    if (this.state.user.email == '')
      alert("이메일을 입력해주세요")
    if (this.state.user.password == '')
      alert("비밀번호를 입력해주세요")
    if (this.state.user.nickname == '')
      alert("이름을 입력해주세요")

    //check pw
    if (this.state.user.password_confirmation != this.state.user.password)
      alert("비밀번호가 다릅니다")

    user_obj.user = this.state.user;

  }

  onButtonPress = async () => {
    this.checkInputVaule().then(() => {

      api
        .post('/users/sign_up', user_obj)
        .then((res) => {
          console.log('send data for registration');
          alert("회원가입 성공")
          this.props.navigation.navigate("Logins")
        })
        .catch((err) => {
          console.log('fail to register');
          if (err.response.status == 422)
            alert("중복된 이메일 입니다")
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
                onChangeText={(eMail) => { this.state.user.email = eMail }}
                autoCapitalize="none" />
            </Item>

            {/* pw */}
            <Item floatingLabel>
              <Label>비밀번호</Label>
              <Input placeholder="password" secureTextEntry={true} autoCapitalize="none"
                onChangeText={(pw) => { this.state.user.password = pw }} />
            </Item>

            <Item floatingLabel>
              <Label>비밀번호 확인</Label>
              <Input placeholder="password" secureTextEntry={true} autoCapitalize="none"
                onChangeText={(pw_confirmation) => { this.state.user.password_confirmation = pw_confirmation }} />
            </Item>

            {/* nickname */}
            <Item floatingLabel>
              <Label>이름</Label>
              <Input autoCapitalize="none"
                onChangeText={(name) => { this.state.user.nickname = name }}
              />
            </Item>

            <View style={{ marginTop: '10%', height: '13%', alignItems: 'center', }}>
              <CustomButton
                title="가입"
                titleColor="white"
                buttonColor="skyblue"
                borderWidth={5}
                borderRadius={5}
                width="30%"
                height="100%"
                justify='center'
                onPress={() => this.onButtonPress()}
              />
            </View>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

});

