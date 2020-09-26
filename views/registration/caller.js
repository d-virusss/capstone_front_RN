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

export default class MainScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      e_mail: '',
      pw1: '',
      pw2: '',
      nickname: '',
      region: '',
      phone: '',
    };
  }

  _join_number(event) {
    let temp = this.state;
    console.log('obj' + temp.e_mail + '' + temp.pw1);
  }

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
    console.log(this.state.e_mail);

    return (
      <Container>
        <Form>
          <Item>
            <Label> E-mail</Label>
            <Input onChangeText={(e_mail) => this.setState({e_mail})} />
          </Item>

          <Item inlineLabel>
            <Label> Password</Label>
            <Input onChangeText={(pw1) => this.setState({pw1})} />
          </Item>

          <Item inlineLabel>
            <Label> Password again</Label>
            <Input onChangeText={(pw2) => this.setState({pw2})} />
          </Item>

          <Item inlineLabel>
            <Label> Name</Label>
            <Input onChangeText={(e_mail) => this.setState({e_mail})} />
            <Button bordered primary onPress={this._submit_nickname.bind(this)}>
              <Text>중복 확인</Text>
            </Button>
          </Item>

          <Item inlineLabel>
            <Label> Region</Label>
            <Input onChangeText={(region) => this.setState({region})} />
            <Button bordered light onPress={this._find_region.bind(this)}>
              <Text> 검색</Text>
            </Button>
          </Item>

          <Item inlineLabel>
            <Label> Phone Number</Label>
            <Input onChangeText={(phone) => this.setState({phone})} />
            <Button bordered light onPress={this._submit_phoneNum.bind(this)}>
              <Text> 인증</Text>
            </Button>
          </Item>
        </Form>

        <Button bordered light onPress={this._join_number.bind(this)}>
          <Text> 가입</Text>
        </Button>
      </Container>
    );
  }
}

const styles = StyleSheet.create({});
