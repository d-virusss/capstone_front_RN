import React, { Component } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text } from 'native-base';

import avatar from '../../assets/p1.jpg'

export default class ListAvatarExample extends Component {

  callimage = () => {
    console.log(avatar)
  }

  render() {
    return (
      <Container>
        <Header />
        <Content>
          <List>
            <ListItem avatar>
              <Left>
                <Thumbnail source={{ uri: "assets/p1.jpg" }} />
              </Left>
              <Body>
                <Text onPress = {this.callimage}>Kumar Pratik</Text>
                <Text note>Doing what you like will always keep you happy . .</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
          </List>
        </Content>
      </Container>
    );
  }
}