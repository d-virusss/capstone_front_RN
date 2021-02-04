import React, {Component} from 'react';
import {StyleSheet, Platform, View, Alert, TouchableWithoutFeedback, 
  Keyboard, KeyboardAvoidingView} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, 
  Button, Text, Right, Body, Footer, Left, Icon, Title } from 'native-base';
import api from '../shared/server_address';

//import getLoginClient from '../../apiAuth/loggedInClient';
//Import the file if you are logged in

export default class FindIdScreen extends Component {
  state = {
    for:'email',
    email: '',
    myInfo: [],
    name: '',
    birthday: '',
    number: '',
  };

  findId = async()=>{
    await api
            .post(`/users/find`,{
              user:{
                for:'email',
                name:this.state.name,
                birthday:this.state.birthday,
                number:this.state.number
              }
            })
            .then(async(response)=>{
              this.state.myInfo=response.data.emails
              this.props.navigation.navigate('FindIdShow',{myInfo:this.state.myInfo})
            })
            .catch(error=>{
              console.log(error.response)
              Alert.alert('찾기 오류',error.response.data.error,[{text:'확인',style:'cancel'}])
            })
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <Container style={{flex:1}}>
          <Header style={{
            height:60,
            backgroundColor:'f8f8f8'
          }} androidStatusBarColor='#000'>
            <Left>
              <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
                <Icon name='chevron-back' type='Ionicons' />
              </TouchableOpacity>
            </Left>
            <Body><Title style={{ color: 'black', alignSelf: 'center', fontSize: 20}}>아이디 찾기</Title></Body>
            <Right></Right>
          </Header>
          <Content>
            <Form>
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
          <View style={styles.footer}>
            <Button transparent style={styles.footerbutton}
                  onPress={() => this.findId()}>
              <Text style={styles.footerText}>찾기</Text>
            </Button>
          </View>
        </Container>
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#ff3377',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '100%',
    height: '9%',
    position :'absolute',
    bottom: -5,
  },
  footerbutton: {
    alignSelf: 'center',
    padding: 4,
    marginBottom: '3%',
    height: 80,
    width: '100%',
    justifyContent: 'center',
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});