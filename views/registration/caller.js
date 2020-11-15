import React, {Component} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, } from 'react-native';
import CustomButton from '../login/custom_button';
import { Container, Content, Form, Item, Input, Label, Header, Left, Right, Body, Title, Icon} from 'native-base';
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
    number:'',
  },
 };

 checkInputVaule = () => {
    if(this.state.user.email == ''){
      Alert.alert("이메일을 입력해주세요", "",[{text:'확인', style:'cancel'}])
      return false;
    }
    if(this.state.user.password == ''){
      Alert.alert("비밀번호를 입력해주세요", "",[{text:'확인', style:'cancel'}])
      return false;
    }
    if(this.state.user.nickname == ''){
      Alert.alert("이름을 입력해주세요", "",[{text:'확인', style:'cancel'}])
      return false;
    }
    //check pw
    if(this.state.user.password_confirmation != this.state.user.password){
      Alert.alert("비밀번호가 다릅니다", "",[{text:'확인', style:'cancel'}])
      return false;
    }

    user_obj.user = this.state.user;
    return true;
   }

  onButtonPress = async () => {
    if(this.checkInputVaule()){
      api
      .post('/users/sign_up', user_obj)
      .then((res) =>  {
        console.log('send data for registration');
        Alert.alert("가입 완료", "",[{text:'확인', style:'cancel'}])
        this.props.navigation.navigate("Logins")
      })
      .catch((err) =>  {
        console.log('fail to register');
        console.log(err)
        if(err.response.status == 422){
          Alert.alert("이메일 중복 입니다", "",[{text:'확인', style:'cancel'}])
        }
      });
    }
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
            <Body><Title>회원 가입</Title></Body>
            <Right></Right>
          </Header>
        <Content>
          <Form>
          {/* email */}
          <Item floatingLabel>
              <Label>E-mail</Label>
              <Input
              keyboardType="email-address"
              onChangeText = {(eMail) => { this.state.user.email = eMail}}
              autoCapitalize="none"/>
          </Item>

            {/* pw */}
          <Item floatingLabel>
            <Label>비밀번호</Label>
            <Input placeholder="password" secureTextEntry={true} autoCapitalize="none"
              onChangeText = {(pw) => {this.state.user.password = pw}}/>
          </Item>

          <Item floatingLabel>
            <Label>비밀번호 확인</Label>
            <Input placeholder="password" secureTextEntry={true} autoCapitalize="none"
              onChangeText={(pw_confirmation) => {this.state.user.password_confirmation = pw_confirmation}}/>
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
            <Label>연락처</Label>
            <Input autoCapitalize="none"
              keyboardType="numeric"
              onChangeText = {(name) => {this.state.user.number = name }}
            />
          </Item>

          <View style={{marginTop: '10%',height: '13%', alignItems: 'center',}}>
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

