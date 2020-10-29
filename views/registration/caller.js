import axios from 'axios';
import React, {Component} from 'react';
import {StyleSheet, Platform, View, Alert} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {
  Container,
  Header,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
} from 'native-base';
//import getLoginClient from '../../apiAuth/loggedInClient';
//Import the file if you are logged in
const api = axios.create({ baseURL: 'http://3.35.9.144'});
var user = {
  user: {
    email: 'min06814@ajou.ac.kr',
    nickname: 'min06814',
    password: '1234',
    password_confirmation: '1234',
  },
};

export default class RegistrationScreen extends React.Component {
  state = user;

  componentDidMount() {
    api
      .post('/users/sign_up', user)
      .then(function (response) {
        console.log('true : ' + response);
      })
      .catch(function (error) {
        console.log('false: ' + error);
      });

    // axios.post('http://52.79.179.211/').then((res) => {
    //   console.log('!!!!!!!!res : ' + res);
    //   this.setState({myInfo: res.data.data.children});
    // });
  }

  onButtonPress = async () => {
    const {randomMesage} = this.state;
    const client = await getLoginClient();
    client
      .post('contactSupport', {
        message: randomMessage,
      })
      .then((response) => {
        console.log('response is', response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  _submit_mail(event) {
    let temp = this.state.e_mail;
    console.log('temp : ' + temp);
  }

  _check_avail_pw(event) {
    let temp = this.state.pw;
    console.log('temp : ' + temp);
  }

  _submit_nickname(event) {
    let temp = this.state.nickname;
    console.log('temp : ' + temp);
  }

  _find_region(event) {
    let temp = this.state.region;
    console.log('temp : ' + temp);
  }

  _submit_phoneNum(event) {
    let temp = this.state.phone;
    console.log('temp : ' + temp);
  }

  render() {
    //console.log(this.state.e_mail);
    //console.log(this.state.myInfo);
    return (
      <Container>
        <Content>
          {/* email */}
          <Item inlineLabel>
            <Label>E-mail</Label>
            <Input
              ref="e_mail"
              value={this.state.e_mail}
              placeholder="Enter your e-mail"
              onChangeText={(e_mail) => this.setState({e_mail})}
            />
          </Item>

          {/* pw */}
          <Item inlineLabel>
            <Label>Password</Label>
            <Input
              placeholder="Enter your password"
              onChangeText={(pw1) => this.setState({pw1})}
            />
          </Item>

          <Item inlineLabel>
            <Label>Password</Label>
            <Input
              placeholder="Password again"
              onChangeText={(pw2) => this.setState({pw2})}
            />
            <Button bordered>
              <Text>submit</Text>
            </Button>
          </Item>

          {/* nickname */}
          <Item inlineLabel>
            <Label>Name</Label>
            <Input
              placeholder="Enter your name"
              onChangeText={(name) => this.setState({name})}
            />
            <Button bordered>
              <Text>중복확인</Text>
            </Button>
          </Item>

          {/* region */}
          <Item inlineLabel>
            <Label>Region</Label>
            <Input
              placeholder="Search Region"
              onChangeText={(region) => this.setState({region})}
            />
            <Button bordered onPress={this.onButtonPress2}>
              <Text>검색</Text>
            </Button>
          </Item>

          {/* phone */}
          <Item inlineLabel>
            <Label>Contact</Label>
            <Input
              placeholder="PhoneNumber"
              onChangeText={(phone) => this.setState({phone})}
            />
          </Item>
        </Content>

        <Content>
          <Button bordered onPress={this.onButtonPress}>
            <Text>검색</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    flexDirection: 'column',
  },
  textInput: {
    alignItems: 'stretch',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    height: 50,
    borderColor: 'black',
  },
});
