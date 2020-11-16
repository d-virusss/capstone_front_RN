import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import {
  Container, Content, Form, Item, Input, Label, Button, Text,
  Header, Card, CardItem, Body, Left, Right, Icon, Title, Textarea
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'
import FormData from 'form-data'
import number_delimeter from '../shared/number_delimiter'

var formdata = new FormData();

export default class Sign extends React.Component {
  booking_info = this.props.route.params.booking_info
  current_date = new Date()

  state = {
    token: "",
    post_id: this.booking_info.post_id,
    body: this.booking_info.contract,
  };

  componentDidMount() {
    this.getToken();
    console.log(this.state)
    console.log(this.booking_info)
    console.log('component did mount ----------------')
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  setCertForm(){
    formdata = new FormData()
    formdata.append('kakaocert[birthday]', this.booking_info.provider.birth)
    formdata.append('kakaocert[number]', this.booking_info.provider.number)
    formdata.append('kakaocert[name]', this.booking_info.provider.name)
    formdata.append('kakaocert[token]', this.state.body)
    console.log(formdata)
    console.log('in setCertForm --------------')
  }

  certRequest() {
    console.log("start sign--------------")
    this.setCertForm()
    // this.props.navigation.navigate("SignState", ({
    //   booking_info: this.booking_info,
    // }))
    api
      .post(`/kakaocert/requestESign`, (formdata), {
        headers: {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
        this.props.navigation.navigate("SignState", { 
          booking_info : this.booking_info,
          res : res.data
         })
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
          <Body><Title>계약서 서명</Title>
          </Body>
          <Right>
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
                  <Text>{this.booking_info.provider.name}(이하 “갑”이라 칭함.)와(과)
                   {this.booking_info.consumer.name}(이하 “을”이라 칭함.)와(과)의 사이에 물품
                   {this.booking_info.product}의 대여(이하 “대여물건”이라 칭함.)에 관하여 다음과 같이 계약을 체결한다.
                  </Text>
                  <Text>
                    대여물건의 대여료는 금 {number_delimeter(this.booking_info.price)}원으로 정한다.
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
                <Text>{this.current_date.getFullYear()}년 {this.current_date.getMonth()+1}월 {this.current_date.getDate()}일
                </Text>
              </CardItem>
            </Card>
            <Button block style={ styles.signbutton } onPress={() => this.certRequest()}>
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
    borderColor : '#262626',
    borderWidth : 3,
    borderRadius : 5
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
    backgroundColor : "#ff3377",
  },
});
