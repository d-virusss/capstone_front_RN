import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity,ScrollView, Alert } from 'react-native';
import {
  Container, Content, Text, Header, Card, CardItem, Body, Left, Right, Title,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address'

export default class SignState extends React.Component {
  booking_info = this.props.route.params.booking_info
  res = this.props.route.params.res
  current_date = new Date();
  current_year = this.current_date.getFullYear();
  current_month = this.current_date.getMonth()+1;
  current_day = this.current_date.getDate() < 10 ? '0'+this.current_date.getDate() : this.current_date.getDate();

  start_date = this.booking_info.start_at.split("T")[0]
  end_date = this.booking_info.end_at.split("T")[0]

  state = {
    token: "",
    receipt_id: this.res.receiptId,
    booking_id : this.booking_info.id,
    eSignState : -1,
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

  checkState(){
    console.log(this.state.eSignState)
    if(this.state.eSignState === 0){
      Alert.alert("인증 대기", "인증을 완료해주세요.", [{ text: '확인', style: 'cancel' }])
    }
    else if (this.state.eSignState === 1) {
      api
        .get(`/kakaocert/verifyESign?receiptId=${this.state.receipt_id}&booking_id=${this.state.booking_id}`, {
          headers: {
            'Authorization': this.state.token,
          }
        })
        .then((res) => {
          console.log("3번째 요청 ----------------성공------")
          console.log(res)
          Alert.alert("인증 완료", "계약서 서명이 완료되었습니다.", [
            {
              text: '확인', style: 'cancel', onPress: () => {
                this.props.navigation.navigate("MyPage")
              }
            }])
        })
        .catch((e) => {
          console.log(e)
        })

    }
    else if(this.state.eSignState === 2){
      Alert.alert("인증 시간 만료", "인증 요청이 종료되었습니다.", [
        { text: '확인', style: 'cancel', onPress: () => { this.props.navigation.navigate("MyPage") } }])
    }
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
        this.setState({ eSignState : res.data.state }, () => this.checkState())
      })
      .catch((e) => {
        console.log('send post failed!!!!')
        console.log(e)
        Alert.alert("요청 실패", e.response.data.error,[
          { text: '확인', style: 'cancel', onPress: () => { this.props.navigation.navigate("MyPage") } }])
      })
  }

  render() {
    return (
      <Container>
        <Header>
          <Left>
          </Left>
          <Body><Title style={{ fontSize: 20 }}>서명 확인</Title>
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
                  계약일 : {this.current_year}-
                  { this.current_month}-
                  { this.current_day}
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
                  {this.current_year}년 {this.current_month}월 {this.current_day}일
                </Text>
              </CardItem>
            </Card>
          </Content>
        </ScrollView>
        <TouchableOpacity style={styles.footer}
          onPress={()=> {this.RequestcheckCertstate()}}>
              <Text style={ styles.footertext }>확인</Text>
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
  footer: {
    backgroundColor: '#ff3377',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '9%',
    position: 'absolute',
    bottom: -5,
  },
  footertext: {
    alignSelf: 'center',
    marginBottom: '3%',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
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

