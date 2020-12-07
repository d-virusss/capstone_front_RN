import React, {Component} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Form, Item, Input, Label, Header, 
  Left, Right, Body, Title, Icon, Footer, Button, Text} from 'native-base';
import api from '../shared/server_address';

var partner_obj = {
  company: {
    name: '',
    title: '',
    business_registration: '',
    business_address: '',
    phone:'',
    category:'',
    biz_type: '',
    message: '',
    description: '',
  },
};


export default class RegistrationScreen extends React.Component {
  constructor(props){
    super(props);
    this.state.token = AsyncStorage.getItem('token');
  }
  state = {
    company: {
      name: '',
      title: '',
      business_registration: '',
      business_address: '',
      phone:'',
      category:'',
      biz_type:'',
      message : "",
      description : "",
    },
  };

  getToken = async() => {
    this.state.token = await AsyncStorage.getItem('token');
  }
    

  registrationRequest = async () => {
    partner_obj.company = this.state.company;
    await api
      .post('/companies', partner_obj, {headers:{'Authorization':this.state.token}})
      .then(async (res) =>  {
        console.log(res);
        console.log('send data for registration');
        Alert.alert("파트너 신청 완료", "파트너 신청이 완료되었습니다.",[{text:'확인', style:'cancel'}])
        this.props.navigation.goBack();
      })
      .catch((err) =>  {
        console.log('fail to register');
        console.log(err.response.data.error)
        Alert.alert("파트너 신청 실패", err.response.data.error+".",[{text:'확인', style:'cancel'}])       
      });
  };
  componentDidMount(){
    this.getToken();
  }

  render() {
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <Container style={{flex:1}}>
        <Header style = {{
            backgroundColor: '#f8f8f8',
            alignItems: 'center',
            justifyContent: 'space-between',
          }} androidStatusBarColor='#000'
        >
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title style={{color:'black',alignSelf:'center'}}>파트너 신청</Title></Body>
          <Right></Right>
        </Header>
        <Content>
          <Form>
          {/* 대표자 */}
            <Item floatingLabel>
                <Label>대표자 이름</Label>
                <Input
                autoCapitalize="none"
                onChangeText = {(nAme) => { this.state.company.name = nAme}}/>
            </Item>

              {/* 회사명 */}
            <Item floatingLabel>
              <Label>회사명</Label>
              <Input autoCapitalize="none"
                onChangeText = {(tItle) => {this.state.company.title = tItle}}/>
            </Item>

            <Item floatingLabel>
              <Label>사업자 번호</Label>
              <Input autoCapitalize="none"
                onChangeText={(text) => {this.state.company.business_registration = text}}/>
            </Item>


            <Item floatingLabel>
              <Label>사업자 주소</Label>
              <Input autoCapitalize="none"
                onChangeText = {(text) => {this.state.company.business_address = text }}
              />
            </Item>

            {/* phone */}
            <Item floatingLabel>
              <Label>연락처 ex) 01012345678</Label>
              <Input autoCapitalize="none"
                keyboardType="numeric"
                onChangeText = {(text) => {this.state.company.phone = text }}
              />
            </Item>

            {/* 카테고리 */}
            <Item floatingLabel>
              <Label>종목</Label>
              <Input autoCapitalize="none"
                onChangeText = {(cAtegory) => {this.state.company.category = cAtegory }}
              />
            </Item>
            {/* biz_type */}
            <Item floatingLabel>
              <Label>업태</Label>
              <Input autoCapitalize="none"
                onChangeText = {(text) => {this.state.company.biz_type = text }}
              />
            </Item>
            {/* biz_type */}
            <Item floatingLabel>
              <Label>한줄 소개</Label>
              <Input autoCapitalize="none"
                onChangeText = {(text) => {this.state.company.message = text }}
              />
            </Item>

            {/* Description */}
            <Item floatingLabel>
              <Label>상세정보</Label>
              <Input autoCapitalize="none"
                onChangeText = {(description) => {this.state.company.description = description }}
              />
            </Item>

          </Form>
        </Content>
        <Footer style={styles.footer}>
          <Button transparent style={ styles.footerbutton }
            onPress={() => this.registrationRequest()}>
            <Text style={styles.footerText}>신청하기</Text>
          </Button>
        </Footer>
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
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

