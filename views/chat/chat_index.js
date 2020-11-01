import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component, useState, useEffect } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text,
} from 'native-base';
import BottomTab from '../shared/bottom_tab';
import { TouchableOpacity } from 'react-native-gesture-handler';

const api = axios.create({baseURL: 'http://3.35.9.144'});
let token;

class ListProfile extends Component {  
  render(){
    return(
      <ListItem avatar>
        <Left>
          <TouchableOpacity onPress = {() => this.props.navigation.navigate('ChatRoom'), {chat_id : this.props.chatID}}>
            <Thumbnail source={{ uri: this.props.imageURI}} style={{ marginTop: -14 }} />
          </TouchableOpacity>
        </Left>
        <Body style={{paddingVertical: 30}} >
          <TouchableOpacity onPress = {() => this.props.navigation.navigate('ChatRoom', {chat_id : this.props.chatID})}>
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
  
  const [chats, setChats] = useState([]);

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
      .get(`/chats`, 
      { 
        headers : {
          'Authorization': token
        }
      })
      .then((response) => {
        console.log('success');
        console.log(response);
        setChats(response.data, [])
      })
      .catch((err) => console.log("err : ", err))
  }

  callimage = () => {
    console.log(avatar)
  }

  const makeIndexList = () => {
    console.log(JSON.stringify(chats));
    return chats.map((chat) => {
      return(
        <ListProfile navigation = {navigation} imageURI="https://picsum.photos/id/3/150/150" title = {chat.chat_info.post_id} body = {chat.chat_info.message} time = "" chatID = {chat.chat_info.id}/> 
      )
    })
  }

  useEffect(() => {
    getToken(), 
    setTimeout(chatGetRequest,1000), 
    console.log("--------------------")
  })
  return(
    <Container>
        <Content>
          <List>
            {makeIndexList()}
          </List>
        </Content>
        <BottomTab navigation = {navigation}></BottomTab>
      </Container>
  );
}
export default ChatList;