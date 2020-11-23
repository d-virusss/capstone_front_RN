import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import BottomTab from '../shared/bottom_tab';
import {
  Container, Header, Left, Body, Right, Button, Icon, Title,
  Text, Thumbnail, Footer, FooterTab, Content, ListItem, List, Separator,
  Card, CardItem,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import api from '../shared/server_address'
import FormData from 'form-data'

var formdata = new FormData()

class ReportDetail extends Component {
  state = {
    body : '',
    reason : -1,
    type: '',
    loading: false,
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    console.log(this.state.token)
  }

  componentDidMount() {
    this.getToken()
    console.log("component did mount --- report")
    console.log(this.props.route.params)
    console.log(this.props.route.params.post.post_info)
    this.setState({ 
      reason : this.props.route.params.reason,
      type: this.props.route.params.type
    }, () => { console.log(this.props.route.params.reason) })
  }

  setReportInfo = () => {
    formdata = new FormData();
    if(this.state.type === 'user'){
      formdata.append('report[target_id]', this.props.route.params.post.user.user_info.id)
    }
    else{
      formdata.append('report[target_id]', this.props.route.params.post.post_info.id)
    }
    formdata.append('report[target_type]', this.state.type)
    formdata.append('report[reason]', this.state.reason)
    formdata.append('report[detail]', this.state.body)
    console.log(formdata)
    console.log(this.state.token)
  }

  ReportRequest() {
    console.log('start send ReportRequest -------------')
    this.setReportInfo()
    this.setState({ loading : true })
    api
      .post('/reports', (formdata), {
        headers: {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log("send success!")
        console.log(res)
        Alert.alert("신고 완료", '신고가 접수되었습니다.',
          [
            {
              text: '확인',
              onPress: () => {this.props.navigation.navigate("PostShow")}
            }
            ,
            {
              style: 'cancel'
            }
          ])

      })
      .catch((e) => {
        console.log('send post failed!!!!' + e)
        this.setState({ loading: false })
        Alert.alert("요청 실패", e.response.data.error, [{ text: '확인', style: 'cancel' }])
      })
  }

  renderReason(){
    if(this.state.reason === 'fake_item') return "허위 매물이에요."
    else if(this.state.reason === 'break_rule') return "계약사항을 지키지 않아요."
    else if(this.state.reason === 'lost_contact') return "대여 후 연락이 두절됐어요."
    else if (this.state.reason === 'impertinence') return "무례하거나, 혐오스런 표현 혹은 차별적 발언을 해요."
    else if(this.state.reason === 'unsuitable_post') return "부적절한 게시물이에요."
    else if(this.state.reason === 'fraud') return "사기가 의심돼요."
    else if(this.state.reason === 'threat_violence') return "폭력 및 협박, 위협을 가해요."
    else if(this.state.reason === 'etc') return "기타 사유"
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
          <Body><Title>신고사유 작성</Title></Body>
          <Right></Right>
        <Spinner visible={this.state.loading} />
        </Header>

        <Spinner visible={this.state.loading} />

        <View style={styles.screen}>
          <Text style={styles.reportreason}>{this.renderReason()}</Text>
          <View style={styles.textareaContainer}>
            <TextInput multiline={true} numberOfLines={10}
              style={styles.textarea}
              onChangeText={(text) => this.setState({ body: text })}
              value={this.state.body}
            ></TextInput>
          </View>
        </View>

        <View style={styles.footer}>
          <Button transparent style={styles.footerbutton}
            onPress={() => this.ReportRequest()}>
            <Text style={styles.footerText}>신고하기</Text>
          </Button>
        </View>

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
    paddingTop: 7
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
  screen : {
    padding : 20,
  },
  btn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  reportreason: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20
  },
  elmargin: {
    marginLeft: 10,
  },
  card : {
    padding : 10,
    margin : 10,
  },
  textareaContainer: {
    borderColor: '#dddddd',
    borderRadius: 3,
    borderWidth: 1,
    padding: 10,
    width: '100%',
  },
  textarea: {
    height: 200,
  },
});
export default ReportDetail;
