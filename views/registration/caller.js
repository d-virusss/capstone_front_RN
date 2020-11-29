import React, {Component} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Form, Item, Input, Label, Header, 
  Left, Right, Body, Title, Icon, Footer, Button, Text} from 'native-base';
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
  user: {
    email: '',
    nickname: '',
    password: '',
    password_confirmation: '',
    number:'',
    device_token:'',
    name : "",
    birthday : "",
  },
 };

  registrationRequest = async () => {
    
      user_obj.user = this.state.user;
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
                onChangeText = {(eMail) => { this.state.user.email = eMail}}/>
            </Item>

              {/* pw */}
            <Item floatingLabel>
              <Label>비밀번호</Label>
              <Input placeholder="password" secureTextEntry={true} autoCapitalize="none"
                onChangeText = {(pw) => {this.state.user.password = pw; console.log(this.state.user.password)}}/>
            </Item>

            <Item floatingLabel>
              <Label>비밀번호 확인</Label>
              <Input placeholder="password" secureTextEntry={true} autoCapitalize="none"
                onChangeText={(pw_confirmation) => {this.state.user.password_confirmation = pw_confirmation}}/>
            </Item>


            <Item floatingLabel>
              <Label>이름(실명)</Label>
              <Input autoCapitalize="none"
                onChangeText = {(text) => {this.state.user.name = text }}
              />
            </Item>

            {/* nickname */}
            <Item floatingLabel>
              <Label>닉네임</Label>
              <Input autoCapitalize="none"
                onChangeText = {(name) => {this.state.user.nickname = name }}
              />
            </Item>

            {/* phone */}
            <Item floatingLabel>
              <Label>연락처 ex) 01012345678</Label>
              <Input autoCapitalize="none"
                keyboardType="numeric"
                onChangeText = {(text) => {this.state.user.number = text }}
              />
            </Item>

            <Item floatingLabel>
              <Label>생일 ex) 19960827</Label>
              <Input autoCapitalize="none"
                onChangeText = {(birthday) => {this.state.user.birthday = birthday }}
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

