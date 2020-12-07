import React, {Component} from 'react';
import {StyleSheet, Platform, View, Alert} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, 
  Button, Text, Right, Body, Footer, Left, Icon, Title } from 'native-base';
import api from '../shared/server_address';

//import getLoginClient from '../../apiAuth/loggedInClient';
//Import the file if you are logged in

export default class FindPwShow extends Component {
  state = {
    for:'',
    email:'',
    name:'',
    birthday:'',
    number:'',
    code:'',
    pw:'',
    pw_confirm:''
  };

  changePw=async()=>{
    await api
            .put('users/reset',{
              user:{
                for:'password',
                email:this.state.email,
                name:this.state.name,
                birthday:this.state.birthday,
                number:this.state.number,
                code:this.state.code,
                password:this.state.pw,
                password_confirmation:this.state.pw_confirm
              }
            })
            .then(response=>{
              console.log(response)
              Alert.alert('비밀번호 재설정 성공', '비밀번호 재설정에 성공했습니다!', [{text:'확인',style:'cancel'}])
              this.props.navigation.navigate('Logins')
            })
            .catch(error=>{
              Alert.alert('비밀번호 재설정 오류',error.response.data.error,[{text:'확인',style:'cancel'}])
            })
  }

  componentDidMount(){
    this.state.email=this.props.route.params.email
    this.state.name=this.props.route.params.name
    this.state.birthday=this.props.route.params.birthday
    this.state.number=this.props.route.params.number
    this.state.code=this.props.route.params.code
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
          <Body><Title style={{color:'black',alignSelf:'center'}}>비밀번호 재설정</Title></Body>
          <Right></Right>
        </Header>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>새로운 비밀번호</Label>
              <Input
                placeholder='비밀번호'
                secureTextEntry={true}
                onChangeText={(text)=>{this.state.pw=text}}
              />
            </Item>
            <Item floatingLabel>
              <Label>비밀번호 확인</Label>
              <Input
                placeholder='비밀번호 확인'
                secureTextEntry={true}
                onChangeText={(text)=>{this.state.pw_confirm=text}}
              />
            </Item>
          </Form>
        </Content>
        <View style={styles.footer}>
          <Button transparent style={styles.footerbutton}
                onPress={() => this.changePw()}>
            <Text style={styles.footerText}>로그인 하러 가기</Text>
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
});