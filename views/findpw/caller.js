
import React, {Component} from 'react';
import {StyleSheet, KeyboardAvoidingView, View, Alert, TouchableWithoutFeedback, Keyboard,
ActionSheetIOS} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, 
  Button, Text, Right, Body, Left, Icon, Title,} from 'native-base';
import IconA from 'react-native-vector-icons/AntDesign'
//import getLoginClient from '../../apiAuth/loggedInClient';
//Import the file if you are logged in
import api from '../shared/server_address'

IconA.loadFont()

export default class FindPwScreen extends Component {
  state = {
    for:'',
    myInfo: [],
    email: '',
    pw: '',
    name: '',
    number: '',
    code:'',
    sms:true,
    backEmail:'#fff',
    backSMS:'#fff',
  };

  findPw = async()=>{
    if(this.state.sms)
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
                  by:'',
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
    else{
      await api
              .post(`/users/find`,{
                user:{
                  for:'password',
                  by:'email',
                  email:this.state.email,
                  name:this.state.name,
                  birthday:this.state.birthday,
                  number:this.state.number
                }
              })
              .then(async(response)=>{
                this.state.myInfo=response.data.emails
                this.props.navigation.navigate('PwInputCode',{
                  for:'password',
                  by:'email',
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
  }

  onEmailPress=()=>{
    this.setState({backEmail:'#f8f8f8',backSMS:'#fff',sms:false})
  }
  onSMSPress=()=>{
    this.setState({backSMS:'#f8f8f8',backEmail:'#fff',sms:true})
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
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
            <View style={{height:'100%',flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
              <Button onPress={this.onEmailPress} vertical style={{alignSelf:'center', padding:'4%',margin:'4%', width:'40%',justifyContent:'center',backgroundColor:this.state.backEmail}}>
                <Icon name='mail' style={{fontSize:50,color:'black'}}/>
                <Text style={{color:'black', marginTop:'10%'}}>이메일 인증</Text>
              </Button>
              <Button onPress={this.onSMSPress} vertical style={{alignSelf:'center',padding:'4%',margin:'4%', width:'40%',justifyContent:'center',backgroundColor:this.state.backSMS}}>
                <Icon name='chatbox' style={{fontSize:50,color:'black'}}/>
                <Text style={{color:'black', marginTop:'10%'}}>SMS 인증</Text>
              </Button>
            </View>
          </Content>
          <View style={styles.footer}>
            <Button transparent style={styles.footerbutton}
              onPress={() => this.findPw()}>
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
    width:'100%',
    justifyContent:'center'
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    alignSelf:'center'
  },
});