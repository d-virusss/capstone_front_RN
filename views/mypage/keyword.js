import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Text, Form, Item, Input, Label, Left, 
  Right, Icon, Body, Title, Button, Content } from 'native-base';
import api from '../shared/server_address'
import Spinner from 'react-native-loading-spinner-overlay';

class Keyword extends Component {
  state = {
    token: '',
    loading: false,
    keyword : ''
  }

  componentDidMount(){
    this.getToken()
  }

  getToken = async () => {
    let token = await AsyncStorage.getItem('token')
    this.state.token = token
  }

  getAuthCodeRequest = async () => {

    this.setState({ loading: true })
    api
      .post('/users/email_auth', this.state, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log('success getAuthCodeRequest');
        Alert.alert("등록 성공", "키워드를 등록했습니다.", [{ text: '확인', style: 'cancel',
          onPress: () => { this.setState({ loading: true }) } }])
      })
      .catch((e) => {
        console.log('fail getAuthCodeRequest');
        console.log(e.response)
        Alert.alert("등록 실패", "키워드를 등록하지 못했습니다.", [{ text: '확인', style: 'cancel',
          onPress: () => { this.setState({ loading: true }) } }])
      });
  }

  changedata = (text) => {
    this.setState({
      keyword: text,
    }, () => { console.log(this.state.title) })
  }

  render() {
    return (
      <Container>
        <Header style={{
            height: 60,
            backgroundColor: '#f8f8f8',
            justifyContent:'space-between'}}
            androidStatusBarColor='#000'
        >
          <Left>
            <TouchableOpacity transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name='chevron-back' type='Ionicons' />
            </TouchableOpacity>
          </Left>
          <Body><Title style={{color:'black',alignSelf:'center'}}>키워드 알림</Title></Body>
          <Right></Right>
        </Header>
        <Spinner visible={this.state.loading} />
        <Content style={styles.screen}>
          <Text style={styles.title}>키워드 알림</Text>
          <Text>키워드를 등록해 두면 키워드가 포함된 게시글이 올라올 때 푸시 알람을 받을 수 있어요!</Text>
          <Form>
            <Item inlineLabel>
              <Label>키워드</Label>
              <Input autoCapitalize='none'
                onChangeText={(text) => this.changedata(text)}/>
            </Item>
          </Form>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  screen : {
    padding : '7%',
  },
  title : {
    fontSize : 20,
    fontWeight : 'bold',
    marginBottom : '3%',
  },
})

export default Keyword;
