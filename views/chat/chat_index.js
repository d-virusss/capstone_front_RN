import React, { Component } from 'react';
import { 
  Container, Header, Content, List, ListItem, 
  Left, Body, Right, Thumbnail, Text, View } from 'native-base';

class ListAvatarExample extends Component {

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
                <Thumbnail source={{ uri: "https://picsum.photos/id/1001/200/200" }} />
              </Left>
              <Body>
                <Text onPress={this.callimage}>Kumar Pratik</Text>
                <Text note>Doing what you like will always keep you happy . .</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
            <ListItem avatar>
              <Left>
                <Thumbnail source={{ uri: "https://picsum.photos/id/1001/200/200" }} />
              </Left>
              <Body>
                <Text onPress={this.callimage}>Kumar Pratik</Text>
                <Text note>Doing what you like will always keep you happy . .</Text>
              </Body>
              <Right>
                <Text note>3:43 pm</Text>
              </Right>
            </ListItem>
            <ListProfile></ListProfile>
          </List>
        </Content>
      </Container>
    );
  }
}

class ListProfile extends Component {
  state = {
    imageURI : "",
    title : "",
    body : "",
    time : ""
  }
  
  render(){
    return(
      <ListItem avatar>
        <Left>
          <Thumbnail source={this.state.imageURI} />
        </Left>
        <Body>
          <Text> {this.state.title} </Text>
          <Text note> {this.state.body} </Text>
        </Body>
        <Right>
          <Text note> {this.state.time} </Text>
        </Right>
      </ListItem>
    );
  }
}

export default ListAvatarExample;