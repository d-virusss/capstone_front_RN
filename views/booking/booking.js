import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {
  Text, Form, Icon, Textarea, Item, Input, Button, 
  Container, Content, Header
} from 'native-base';


const api = axios.create({ baseURL: 'http://3.35.9.144'});

function booking ({navigation}) {
  const windowWidth = Dimensions.get('window').width;
  let title = '화이트채플';
  let category = '보드게임';
  let price = 10000;
  let bodytext = '어쩌구저쩌구';
  let token = "";
  let chatID;
  

  getToken = async () => {
  try{
      const value = await AsyncStorage.getItem('token');
      if (value !== null) token = value;
    } catch (error){
      console.log("error : ", error);
    }
  }

  const chatCreateRequest = () => {
    api
      .post(`/chats?post_id=${post_id}`, null,{ headers : {
        'Authorization': token
      }})
      .then((response) => {
        console.log('success');
        console.log(token);
        console.log(response);
        
      })
      .catch((err) => console.log("err : ", err))
  }

  getToken();
  return(
    <Container>
      <Header style = {{height: 100}}>
        <View style = {{width : '30%', justifyContent : 'center'}}>
          <Icon name = 'person' style = {{fontSize : 80, margin : '1%'}}/>
        </View>
        <View style = {{width : '70%', justifyContent : 'center'}}>
          <Text style = {{margin : '1%', fontSize : 25}}>화이트채플</Text>
          <Text style = {{margin : '1%', fontSize : 20}}>10000원</Text>
        </View>
      </Header>
    <Content>
      <View style={{width : '95%', justifyContent : 'center', alignItems: 'center', alignSelf: 'center'}}>
        
      </View>
      <View style = {{ alignItems : 'center'}}>
        <View style = {{ width : '95%',}}>
          <Form>
            <Button style = {{alignSelf : 'center', marginTop : '3%'}}>
              <Icon name = 'person'></Icon>
              <Text>예약 신청하기</Text>
            </Button>
          </Form>
        </View>
      </View>
    </Content>
    </Container>
  );
    
}

export default booking;