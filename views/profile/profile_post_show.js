import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import {Text, Form, Icon, Textarea, Item, Input, Button} from 'native-base';

const api = axios.create({ baseURL: 'http://3.35.9.144'});

function profilePostShow ({navigation}) {
  let title = '화이트채플';
  let category = '보드게임';
  let price = 10000;
  let bodytext = '어쩌구저쩌구';
  let token = "";
  let chatID;
  postId = 2;

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
      .post(`/chats?post_id=${postId}`, null,{ headers : {
        'Authorization': token
      }})
      .then((response) => {
        console.log('success');
        console.log(token);
        console.log(response);
        chatID = response.data.id
      })
      .catch((err) => console.log("err : ", err))
  }

  const createAndNavigate = () => {
    chatCreateRequest();
    navigation.navigate('ChatRoom', {
      chat_id : chatID, 
    });
  } 
  getToken();
  return(
    <ScrollView>
      <View style={{width : '95%', height : '40%', justifyContent : 'center', alignItems: 'center', alignSelf: 'center'}}>
        <Text>이미지</Text>
      </View>
      <View style = {{ alignItems : 'center'}}>
        <View style = {{ width : '95%',}}>
          <Form>
            <Item regular style = {{marginBottom : '3%'}}>
                <Text style = {{fontSize : 17, margin : '4%'}}>{title}</Text>
            </Item>
            <Item regular style = {{marginBottom : '3%'}}>
                <Text style = {{fontSize : 17, margin : '4%'}}>{category}</Text>
            </Item>
            <Item regular style = {{marginBottom : '5%', marginTop  :'3%'}}>
                <Text style = {{fontSize : 17, margin : '4%'}}>{price + '원'}</Text>
            </Item>
            <Item regular style = {{marginBottom : '5%', marginTop  :'3%'}}>
                <Text style = {{fontSize : 17, margin : '4%'}}>{bodytext}</Text>
            </Item>
            <Button style = {{alignSelf : 'center', marginTop : '3%'}}
              onPress = {() => createAndNavigate()}
            >
              <Icon name = 'person'></Icon>
              <Text>채팅 거래하기</Text>
            </Button>
            <Button onPress = {() => navigation.navigate('ProfileShow')}>
              <Text>프로필보기</Text>
            </Button>
          </Form>
        </View>
      </View>
    </ScrollView>
  );
    
}

export default profilePostShow;