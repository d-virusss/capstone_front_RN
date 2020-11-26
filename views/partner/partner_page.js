import React, {Component} from 'react';
import {
  View, Container, Header, Content, Form, Item, Button, Text, Left, Right, 
  Body, Icon
} from 'native-base';

class Partner_page extends Component{
  render(){
    return(
      <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title>파트너 인증</Title></Body>
          <Right></Right>
        </Header>
      </Container>

    )
  }
}

export default Partner_page;