import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Alert, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Header, Text, Form, Item, Input, Label, Left, 
  Right, Icon, Body, Title, Content, Badge, Button as NativeButton } from 'native-base';
import api from '../shared/server_address'
import _ from 'lodash'
import FormData from 'form-data'

var formdata = new FormData()
class Keyword extends Component {
  state = {
    token: '',
    loading: false,
    keyword : '',
    keywordCount : 0,
    given_keywords : [],
  }

  componentDidMount(){
    this.getToken()
  }

  getToken = async () => {
    let token = await AsyncStorage.getItem('token')
    this.state.token = token
    console.log(this.state.token)
    this.getKeywordRequest()
  }

  changedata = (text) => {
    this.setState({
      keyword: text,
    }, () => { console.log(this.state.keyword) })
  }

  is_input_idle(){
    if(this.state.keyword === '') return true
    else return false
  }

  getKeywordRequest(){
    console.log('get keyword request ------------')
    api
      .get('/users/keyword', {
        headers : {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log(res)
        this.setState({ keywordCount : res.data.count,
          given_keywords : res.data.keywords
        }, () => { console.log(this.state) })
      })
      .catch((e) => {
        console.log(e)
      })
  }

  setFormData(){
    formdata = new FormData()
    console.log(this.state.keyword)
    formdata.append('user[keyword]', this.state.keyword)
    console.log(formdata)
  }

  createKeywordRequest(){
    console.log('create keyword -------------')
    this.textInput.clear()
    this.setFormData()
    api
      .post('/users/keyword', (formdata), {
        headers : {
          'Authorization': this.state.token,
        }
      })
      .then((res) => {
        console.log(res)
        this.getKeywordRequest()
      })
      .catch((e) => {
        console.log(e.response)
      })
  }

  deleteKeywordRequest(target){
    console.log('delete request ----------------')
    api
      .delete('/users/keyword', {
        headers: {
          'Authorization': this.state.token,
        },
        params: {
          'user[keyword]' : target
        },
      })
      .then((res) => {
        console.log(res)
        console.log("삭제완료!")
        this.getKeywordRequest()
      })
      .catch((e) => {
        console.log(e)
        console.log(e.response)
      })
  }

  makeKeywordBadge(){
    return this.state.given_keywords.map((keyword) => {
      return(
        <Badge style={styles.badge}>
          <Text style={{ fontWeight: 'bold' }}>{keyword}</Text>
          <TouchableOpacity style={{ marginHorizontal: '2%' }}
            onPress={() => { this.deleteKeywordRequest(keyword) }}>
            <Icon style={{ fontSize: 11, fontWeight: 'bold' }} name='close' type="AntDesign"></Icon>
          </TouchableOpacity>
        </Badge>
      )
    })
  }

  renderSubmitButton(){
    if(this.is_input_idle()){
      return (
        <NativeButton bordered style={{ borderColor: '#aaaaaa' }} disabled>
          <Text style={{ color: '#aaaaaa' }}>등록</Text>
        </NativeButton>
      )
    }
    else{
      return(
        <NativeButton NativeButton style={{ backgroundColor: '#ff3377' }} onPress={() => this.createKeywordRequest()}>
          <Text style={{ color: 'white', fontWeight:'bold' }}>등록</Text>
        </NativeButton>
      )
    }
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
        <Content style={styles.screen}>
          <Text style={styles.title}>키워드 알림</Text>
          <Text>키워드를 등록해 두면 키워드가 포함된 게시글이 올라올 때 푸시 알람을 받을 수 있어요!</Text>
          <View style={styles.inputForm}>
            <TextInput style={styles.keywordArea}
              ref={(input) => { this.textInput = input }}
              placeholder='키워드'
              autoCapitalize='none'
              onChangeText={(text) => this.changedata(text)}/>
            {this.renderSubmitButton()}
          </View>
          <Text style={styles.keywordList}>등록된 키워드 ({this.state.keywordCount}/20)</Text>
          <View style={styles.keywordContainer}>
            {this.makeKeywordBadge()}
          </View>
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
  inputForm : {
    marginLeft : 0,
    marginTop: '5%',
    width : '100%',
    flexDirection : 'row',
    alignItems : 'center',
  },
  submitButton : {
  },
  keywordArea : {
    width : '80%',
    fontSize : 17,
    borderWidth : 1,
    borderRadius : 5,
    borderColor : '#aaaaaa',
    padding: '3%',
    marginRight : '3%'
  },
  badge : {
    flexDirection: 'row', 
    backgroundColor: '#ff3377',
    height: 33,
    justifyContent: 'center', 
    alignItems: 'center',
    alignSelf : 'center',
    marginVertical: '1%',
    marginRight: '2%',
  },
  keywordList : {
    marginTop : '4%',
    color : '#787878',

  },
  keywordContainer : {
    marginVertical : '3%',
    flexDirection : 'row',
    flexWrap : 'wrap',
  }
})

export default Keyword;
