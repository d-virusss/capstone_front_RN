//import axios from 'axios';
import React, {Component} from 'react';
import {StyleSheet, Platform, View, Alert} from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { Container, Header, Content, Form, Item, Input, Label, 
  Button, Text, Right, Body, Left, Icon, Title, Footer} from 'native-base';
//import getLoginClient from '../../apiAuth/loggedInClient';
//Import the file if you are logged in
import api from '../shared/server_address'

export default class FindPwScreen extends React.Component {
  state = {
    myInfo: [],
    e_mail: '',
    pw: '',
    name: '',
    phone: '',
  };

  //   componentDidMount() {
  //     axios.get('url').then((res) => {
  //       console.log('res : ' + res);
  //       this.setState({myInfo: res.data.data.children});
  //     });
  //   }

  onButtonPress = async () => {
    // let t_name = this.state.name;
    // let t_num = this.state.phone;
    // console.log('temp : ' + t_name + ' ' + t_num);
    // const {randomMesage} = this.state;
    // const client = await getLoginClient();
    // client
    //   .post('contactSupport', {
    //     message: randomMessage,
    //   })
    //   .then((response) => {
    //     console.log('response is', response);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>비밀번호 찾기</Title></Body>
          <Right></Right>
        </Header>
        <Content style={{padding: 10}}>
          {/* e-mail */}
          <Item inlineLabel>
            <Label>E-mail</Label>
            <Input
              placeholder="Enter your e-mail"
              onChangeText={(e_mail) => this.setState({e_mail})}
            />
          </Item>

          {/* phone */}
          <Item inlineLabel>
            <Label>Phone Number</Label>
            <Input
              placeholder="Enter your number"
              onChangeText={(phone) => this.setState({phone})}
            />
          </Item>
        </Content>
        <Footer style={styles.footer}>
          <Button transparent style={styles.footerbutton}
            onPress={() => { console.log('찾기') }}>
            <Text style={styles.footerText}>찾기</Text>
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