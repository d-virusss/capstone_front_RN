//import axios from 'axios';
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

export default class FindIdScreen extends React.Component {
  state = {
    myInfo: [],
    e_mail: '',
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
    let t_name = this.state.name;
    let t_num = this.state.phone;
    console.log('temp : ' + t_name + ' ' + t_num);
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

  render() {
    return (
      <Container>
        <Content>
          {/* phone */}
          <Item inlineLabel>
            <Label>Phone Number</Label>
            <Input
              placeholder="Enter your number"
              onChangeText={(phone) => this.setState({phone})}
            />
          </Item>

          <Button bordered onPress={this.onButtonPress}>
            <Text>찾기</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});