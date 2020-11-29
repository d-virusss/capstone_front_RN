//import axios from 'axios';
import React, {Component} from 'react';
import {StyleSheet, Platform, View, Alert} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, 
  Button, Text, Right, Body, Left, Icon, Title, Footer} from 'native-base';
//import getLoginClient from '../../apiAuth/loggedInClient';
//Import the file if you are logged in
import api from '../shared/server_address'

export default class FindPwScreen extends Component {
  state = {
    for:'',
    myInfo: [],
    email: '',
    pw: '',
    name: '',
    number: '',
    code:'',
  };

  findPw = async()=>{
    await api
            .post(`/users/find`,{
              user:{
                for:'password',
                email:this.state.email,
                name:this.state.name,
                birthday:this.state.birthday,
                number:this.state.number
              }
            })
            .then(async(response)=>{
              this.state.myInfo=response.data.emails
              this.props.navigation.navigate('PwInputCode',{
                for:'email',
                email:this.state.email,
                name:this.state.name,
                birthday:this.state.birthday,
                number:this.state.number
              })
            })
            .catch(error=>{
              console.log(error.response)
              Alert.alert('찾기 오류',error.response.data.error,[{text:'확인',style:'cancel'}])
            })
  }

  render() {
    return (
      <Container>
        <Header style={{
          height:60,
          backgroundColor:'f8f8f8'
        }} androidStatusBarColor='#000'>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title style={{color:'black',alignSelf:'center'}}>비밀번호 찾기</Title></Body>
          <Right></Right>
        </Header>
        <Content>
          <Form>
          <Item floatingLabel>
              <Label>이메일</Label>
              <Input autoCapitalize='none'
                placeholder="아이디를 입력하세요"
                onChangeText={(text)=>{this.state.email=text}}
              />
            </Item>
            <Item floatingLabel>
              <Label>이름</Label>
              <Input autoCapitalize='none'
                placeholder="본명을 입력하세요"
                onChangeText={(text)=>{this.state.name=text}}
              />
            </Item>
            <Item floatingLabel>
              <Label>생일 ex)20200101</Label>
              <Input keyboardType='numeric'
                placeholder="생일을 입력하세요"
                onChangeText={(text)=>{this.state.birthday=text}}
              />
            </Item>
            <Item floatingLabel>
              <Label>연락처 ex)01012345678</Label>
              <Input keyboardType='numeric'
                placeholder="가입한 핸드폰 번호를 입력하세요"
                onChangeText={(text)=>{this.state.number=text}}
              />
            </Item>
          </Form>
        </Content>
        <Footer style={styles.footer}>
          <Button transparent style={styles.footerbutton}
            onPress={() => this.findPw()}>
            <Text style={styles.footerText}>찾기</Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -5,
    backgroundColor: '#ff3377',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    paddingTop: 7,
  },
  footerbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 20,
  },
});