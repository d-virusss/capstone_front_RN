import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import {
  Container, Content, Form, Item, Input, Label, Button, Text,
  Header, Card, CardItem, Body, Left, Right, Icon, Title, Textarea,
  Footer
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'

export default class SignState extends React.Component {
  booking_info = this.props.route.params.booking_info
  res = this.props.route.params.res
  current_date = new Date()
  start_date = this.booking_info.start_at.split("T")[0]
  end_date = this.booking_info.end_at.split("T")[0]

  state = {
    token: "",
    receipt_id: this.res.receiptId,
    booking_id : this.booking_info.id,
  };

  componentDidMount() {
    this.getToken();
    console.log(this.state)
    console.log(this.booking_info)
    console.log(this.res)
    console.log('component did mount ------- signState ----------')
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  RequestcheckCertstate() {
    console.log("start checksignstate-------------")
    console.log(this.res.receiptId)
    console.log(this.state)
    api
      .get(`/kakaocert/getESignState?receiptId=${this.state.receipt_id}&booking_id=${this.state.booking_id}`, {
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
      })
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
          <Body><Title>서명 확인</Title>
          </Body>
          <Right>
          </Right>
        </Header>
        <ScrollView>
          <Content style={{ padding: 20 }}>
            <Card style={styles.card}>
              <CardItem header style={{ marginBottom: '5%' }}>
                <Text>물품임대 계약서</Text>
              </CardItem>
              <CardItem style={ styles.contractDate }>
                <Text style = {styles.dateText}>
                  대여일 : {this.start_date}
                </Text>
              </CardItem>
              <CardItem style={ styles.contractDate }>
                <Text style={styles.dateText}>
                  반납일 : {this.end_date}
                </Text>
              </CardItem>
              <CardItem style={ styles.contractDate }>
                <Text style={styles.dateText}>
                  계약일 : {this.current_date.getFullYear()}-
                  { this.current_date.getMonth()+1}-
                  { this.current_date.getDate()}
                </Text>
              </CardItem>
              <CardItem>
                <Body>
                  <Text style={ styles.cardmain }>
                    {" "}5분안에 카카오페이 인증을 통해 인증을 완료해주세요.
                    인증이 끝났다면 아래의 확인버튼을 클릭해주세요.
                  </Text>
                </Body>
              </CardItem>
              <CardItem footer>
                <Text>
                  {this.current_date.getFullYear()}년 {this.current_date.getMonth()+1}월 {this.current_date.getDate()}일
                </Text>
              </CardItem>
            </Card>
          </Content>
        </ScrollView>
        <TouchableOpacity onPress={()=> {this.RequestcheckCertstate()}}>
          <Footer style={ styles.footer }>
              <Text style={ styles.footertext }>확인</Text>
          </Footer>
        </TouchableOpacity>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 10,
    alignItems: 'center',
    height : 650
  },
  contractDate : {
    alignSelf : 'flex-end',    
  },
  footer : {
    backgroundColor: '#ff3377',
    height: 50,
    alignItems: 'center',
    paddingTop : '3%'    
  },
  footertext : {
    color : 'white',
    fontSize : 20,
    fontWeight : 'bold',
  },
  cardmain : {
    paddingTop : '30%',
    paddingBottom : '50%',
    lineHeight : 35,
    fontSize : 17,
    fontWeight : '400'
  },
  dateText : {
    fontWeight : '500',
  }
});

