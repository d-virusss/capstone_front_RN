import React, {Component} from 'react';
import {StyleSheet, Platform, View, Alert} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, ListItem, Input, Label, 
  Button, Text, Right, Body, Footer, Left, Icon, Title, Item } from 'native-base';
import api from '../shared/server_address';

//import getLoginClient from '../../apiAuth/loggedInClient';
//Import the file if you are logged in

export default class PwInputCode extends Component {
  state = {
    for:'',
    email:'',
    name:'',
    birthday:'',
    number:'',
    code:''
  };

  checkCodeInput=async()=>{
    if(this.state.code=='') {
      console.log(this.state.code)
      return Alert.alert('코드 오류','코드를 입력해주세요.',[({text:'확인',style:'cancel'})])
      
    }
    await api
            .put('/users/reset',{
              user:{
                for:'password',
                email:this.state.email,
                name:this.state.name,
                birthday:this.state.birthday,
                number:this.state.number,
                code:this.state.code
              }
            })
            .then(response=>{
              console.log(response)
              this.props.navigation.navigate('FindPwShow',{for:'email',
                email:this.state.email, name:this.state.name,
                birthday:this.state.birthday, number:this.state.number,
                code:this.state.code
              })
            })
            .catch(error=>{
              console.log(error.response)
              Alert.alert('인증 실패',error.response.data.error,[{text:'확인',style:'cancel'}])
            })
  }

  componentDidMount(){
    this.state.email=this.props.route.params.email
    this.state.name=this.props.route.params.name
    this.state.birthday=this.props.route.params.birthday
    this.state.number=this.props.route.params.number
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
              <Label>이메일로 전송된 코드를 입력하세요</Label>
              <Input
                placeholder='코드를 입력하세요'
                onChangeText={(text)=>this.state.code=text}
              />
            </Item>
          </Form>
        </Content>
        <Footer style={styles.footer}>
          <Button transparent style={styles.footerbutton}
                onPress={() => this.checkCodeInput()}>
            <Text style={styles.footerText}>코드확인</Text>
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