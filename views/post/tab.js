import React, { Component } from 'react';
import { Container, Header, Content, Footer, FooterTab, Button, Icon, Text, Badge } from 'native-base';
export default class TabBottom extends Component {
  render() {
    return (
    <Footer>
        <FooterTab>
        <Button badge vertical onPress={() => this.props.navigation.navigate('Logins')}>
            <Badge><Text>2</Text></Badge>
            <Icon name="apps" />
            <Text>Apps</Text>
        </Button>
        <Button vertical onPress = {() => this.props.navigation.navigate('Logins')}>
            <Icon name="camera" />
            <Text>Camera</Text>
        </Button>
        <Button active badge vertical onPress = {() => this.props.navigation.navigate('Logins')}>
            <Badge ><Text>51</Text></Badge>
            <Icon active name="navigate" />
            <Text>Navigate</Text>
        </Button>
        <Button vertical onPress = {() => this.props.navigation.navigate('Logins')}>
            <Icon name="person" />
            <Text>Mypage</Text>
        </Button>
        </FooterTab>
    </Footer>
    );
  }
}