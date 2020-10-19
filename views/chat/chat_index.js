import React, { Component } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View , Footer, FooterTab, Button, Icon, Root, Badge, ActionSheet} from 'native-base';

var BUTTONS = ["제공 글쓰기", "대여요청 글쓰기", "취소"];
var CANCEL_INDEX = 2;

import FootTab from '../shared/bottom_tab'
import BottomTab from '../shared/bottom_tab';
import { TouchableOpacity } from 'react-native-gesture-handler';

class ListAvatarExample extends Component {

  callimage = () => {
    console.log(avatar)
  }

  render() {
    return (
      <Container>
        <Content>
          <List>
            <ListProfile navigation = {this.props.navigation} imageURI="https://picsum.photos/id/3/150/150" title="시스템프로그래밍" body="과제 너무 어렵지만 즐겁다 ㅎㅎ" time="9:02 pm"></ListProfile>
            <ListProfile imageURI="https://picsum.photos/id/100/150/150" title="캡디" body="아 리액트 ㅡㅡ" time="8:55 pm"></ListProfile>
            <ListProfile imageURI="https://picsum.photos/id/1001/150/150" title="엄마" body="밥 먹었어?" time="8:49 pm"></ListProfile>
          </List>
        </Content>
        <BottomTab navigation = {this.props.navigation}></BottomTab>
      </Container>
    );
  }
}

class ListProfile extends Component {  
  render(){
    return(
      <ListItem avatar>
        <Left>
          <TouchableOpacity onPress = {() => this.props.navigation.navigate('ChatRoom')}>
            <Thumbnail source={{ uri: this.props.imageURI}} style={{ marginTop: -14 }} />
          </TouchableOpacity>
        </Left>
        <Body style={{paddingVertical: 30}} >
        <TouchableOpacity onPress = {() => this.props.navigation.navigate('ChatRoom')}>
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

export default ListAvatarExample;