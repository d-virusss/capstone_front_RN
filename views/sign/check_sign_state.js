import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import {
  Container, Content, Form, Item, Input, Label, Button, Text,
  Header, Card, CardItem, Body, Left, Right, Icon, Title, Textarea
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'

export default class SignState extends React.Component {
  // booking_info = this.props.route.params.booking_info
  state = {
    token: "",
    receipt_id: "",
  };

  componentDidMount() {
    this.getToken();
    console.log(this.state)
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  makeContractRequest() {
    console.log("start sign--------------")
    console.log(this.state);
    setCertForm()
    api
      .get(`/kakaocert/getESignState?receiptId=${this.state.receipt_id}`, {
        headers: {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
      })
      .catch((e) => {
        console.log('send post failed!!!!' + e)
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
          </Left>
          <Body><Title>서명 확인</Title>
          </Body>
          <Right>
            <TouchableOpacity
              style={{ marginRight: '4%' }}
              onPress={() => { this.finishContract() }}>
              <Text> 계약 완료 </Text>
            </TouchableOpacity>
          </Right>
        </Header>
        <ScrollView>
          <Content style={{ padding: 20 }}>
            <Card style={styles.card}>
              <CardItem header>
                <Text>물품임대 계약서</Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text>
                    5분안에 카카오페이 인증을 통해 인증을 완료해주세요.
                    인증이 끝났다면 아래의 확인버튼을 클릭해주세요.
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
                <Body>
                  <View style={styles.textareaContainer}>
                    <Text
                      style={styles.textarea} >
                      {this.state.body}
                    </Text>
                  </View>
                </Body>
              </CardItem>
              <CardItem footer>
                <Text>202*년 * 월 * 일
                </Text>
              </CardItem>
            </Card>
            <Button block style={styles.signbutton} onPress={this.makeContractRequest()}>
              <Text>서명하기</Text>
            </Button>
          </Content>
        </ScrollView>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 10,
    alignItems: 'center',
  },
  textareaContainer: {
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  signbutton: {
    marginTop: '3%',
  },
});

