import React, {Component} from 'react';
import {StyleSheet, Platform, View, Alert} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, ListItem, Input, Label, 
  Button, Text, Right, Body, Footer, Left, Icon, Title } from 'native-base';
import api from '../shared/server_address';

//import getLoginClient from '../../apiAuth/loggedInClient';
//Import the file if you are logged in

export default class FindIdShow extends Component {
  state = {
    myInfo: []
  };

  makeList(){
    console.log(JSON.stringify(this.state.myInfo))
    return this.state.myInfo.map(data=>{
      let i = 0;
      return(
        <ListItem key={++i}>
          <Text>{data}</Text>
        </ListItem>
      )
    })
  }

  componentDidMount(){
    this.setState({myInfo:this.props.route.params.myInfo});
  }

  render() {
    return (
      <Container>
        <Header style={{
          height:60,
          backgroundColor:'f8f8f8'
        }} androidStatusBarColor='#000'>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title style={{color:'black',alignSelf:'center'}}>아이디 목록</Title></Body>
          <Right></Right>
        </Header>
        <Content>
          <Form>
            {this.makeList()}
          </Form>
        </Content>
        <Footer style={styles.footer}>
          <Button transparent style={styles.footerbutton}
                onPress={() => this.props.navigation.navigate('Logins')}>
            <Text style={styles.footerText}>로그인 하러 가기</Text>
          </Button>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -5,
    backgroundColor: '#ff3377',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    paddingTop: 7,
  },
  footerbutton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 20,
  },
});