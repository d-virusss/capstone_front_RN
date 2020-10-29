import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text,
} from 'native-base';
import BottomTab from '../shared/bottom_tab';
import { TouchableOpacity } from 'react-native-gesture-handler';

const api = axios.create({baseURL: 'http://52.79.179.211'});
var token;
var chat_id = [];
chat_id[0] = 1;

class ListProfile extends Component {  
  render(){
    return(
      <ListItem avatar>
        <Left>
          <TouchableOpacity onPress = {() => this.props.navigation.navigate('ChatRoom'), {chat_id : chat_id[0]}}>
            <Thumbnail source={{ uri: this.props.imageURI}} style={{ marginTop: -14 }} />
          </TouchableOpacity>
        </Left>
        <Body style={{paddingVertical: 30}} >
          <TouchableOpacity onPress = {() => this.props.navigation.navigate('ChatRoom', {chat_id : chat_id[0]})}>
            <Text> {this.props.title} </Text>
            <Text note> {this.props.body} </Text>
          </TouchableOpacity>
        </Body>
        <Right>
          <Text note> {this.props.time} </Text>
        </Right>
      </ListItem>
    );
  }
}
function ChatList ({navigation}){

  getToken = async () => {
    try{
        const value = await AsyncStorage.getItem('token');
        if (value !== null) token = value;
      } catch (error){
        console.log("error : ", error);
      }
      console.log(token);
    }
  
  chatGetRequest = () => {
    api
      .get(`/chats`, null,{ headers : {
        'Authorization': token
      }})
      .then((response) => {
        console.log('success');
        console.log(response);
      })
      .catch((err) => console.log("err : ", err))
  }

  callimage = () => {
    console.log(avatar)
  }
  getToken();
  chatGetRequest();
  return(
    <Container>
        <Content>
          <List>
            <ListProfile navigation = {navigation} imageURI="https://picsum.photos/id/3/150/150" title="시스템프로그래밍" body="과제 너무 어렵지만 즐겁다 ㅎㅎ" time="9:02 pm"></ListProfile>
            <ListProfile navigation = {navigation} imageURI="https://picsum.photos/id/100/150/150" title="캡디" body="아 리액트 ㅡㅡ" time="8:55 pm"></ListProfile>
            <ListProfile navigation = {navigation} imageURI="https://picsum.photos/id/1001/150/150" title="엄마" body="밥 먹었어?" time="8:49 pm"></ListProfile>
          </List>
        </Content>
        <BottomTab navigation = {navigation}></BottomTab>
      </Container>
  );
}
export default ChatList;