import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import {
  Container, Content, Form, Item, Input, Label, Button, Text,
  Header, Card, CardItem, Body, Left, Right, Icon, Title, Textarea
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import FormData from 'form-data'

var formdata = new FormData();

export default class Sign extends React.Component {
  booking_info = this.props.route.params.booking_info
  state = {
    token: "",
    post_id: this.booking_info.post_id,
    body: this.booking_info.contract,
  };

  componentDidMount() {
    this.getToken();
    console.log(this.state)
    console.log(this.booking_info)
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  setCertForm(){
    formdata.append('kakaocert[birthday]', )
    formdata.append('kakaocert[number]', )
    formdata.append('kakaocert[name]', )
    formdata.append('kakaocert[token]', )
    console.log(formdata)
  }

  makeContractRequest() {
    console.log("start sign--------------")
    console.log(this.state);
    this.setCertForm()
    api
      .post(`/kakaocert/requestESign`, (formdata), {
        headers: {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
        this.props.navigation.navigate("SignState")
      })
      .catch((e) => {
        console.log('send post failed!!!!')
        console.log(e)
      })
  }

  finishContract(){
    Alert.alert("계약이 성공적으로 체결되었습니다.")
    // 대여중 목록화면으로 navigate
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title>계약서 작성</Title>
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
                  <Text>--(이하 “갑”이라 칭함.)와 --(이하 “을”이라 칭함.)와의 사이에 물품
                --의 대여(이하 “대여물건”이라 칭함.)에 관하여 다음과 같이 계약을 체결한다.</Text>
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
            <Button block style={ styles.signbutton } onPress={this.makeContractRequest()}>
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
  signbutton : {
    marginTop: '3%',
  },
});

