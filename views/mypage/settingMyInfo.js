import React, {Component} from 'react';
import { StyleSheet, View, Alert, TouchableOpacity,
  TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Container, Content, Form, Item, Input, Label, Header, 
  Left, Right, Body, Title, Icon, Footer, Button, Text} from 'native-base';
import api from '../shared/server_address'
import Spinner from 'react-native-loading-spinner-overlay';
import ImageSelect from '../post/imageselect';
import FormData from 'form-data'

var user_obj = {
  user: {
    email: '',
    nickname: '',
    // password: '',
    // password_confirmation: '',
    number:'',
    name: '',
    birthday: '',
    image : [],
  },
};

const image_info = {
  uri: '',
  type: '',
  name: '',
}

var formdata = new FormData()

class SettingMyInfoScreen extends React.Component {
  params = this.props.route.params;

  state = {
    email: '',
    nickname: '',
    number:'',
    name : "",
    birthday : "",
    loading : true,
    image: {},
    token:'',
    id:'',
    // password: '',
    // password_confirmation: '',
  };

  componentDidMount() {
    this.getToken();
    console.log(this.params)
  }

  getToken = async () => {
    let token = await AsyncStorage.getItem('token');
    this.state.token = token;
    this.initMyInfo();
  }

  initMyInfo() {
    this.state.email = this.params.post.email || "";
    this.state.nickname = this.params.post.nickname || "";
    this.state.name = this.params.post.name || "";
    this.state.number = this.params.post.number || "";
    this.state.birthday = this.params.post.birthday || "";
    this.state.image = this.params.post.image || "";
    this.state.id = this.params.post.id;
    console.log(this.state.image)
    this.setState({ loading: false }, () => {console.log(this.state)})
  }

  changeImage = (data) => {
    this.setState({ image: data })
    image_info.uri = data[0].sourceURL;
    image_info.type = data[0].mime;
    image_info.name = data[0].filename;
    console.log(image_info)
  }
  
  saveMyInfo() {
    formdata = new FormData()
    formdata.append('user[email]', this.state.email)
    formdata.append('user[nickname]', this.state.nickname)
    formdata.append('user[number]', this.state.number)
    formdata.append('user[name]', this.state.name)
    formdata.append('user[birthday]', this.state.birthday)
    if (image_info.uri != '') {
      formdata.append('user[image]', image_info)
    }
    console.log(formdata)
  }

  profileValidateCheck(){
    if(this.state.name.length > 6){
      Alert.alert("수정 실패", "실명은 6자까지 가능합니다.", [{ text: '확인', style: 'cancel' }])
      return false;
    }
    else if(this.state.nickname.length > 11){
      Alert.alert("수정 실패", "닉네임은 10자까지 가능합니다.", [{ text: '확인', style: 'cancel' }])
      return false;
    }
    else if(this.state.number.length > 12){
      Alert.alert("수정 실패", "연락처 형식을 확인해주세요.", [{ text: '확인', style: 'cancel' }])
      return false;
    }
    else if(this.state.birthday.length > 9){
      Alert.alert("수정 실패", "생년월일 형식을 확인해주세요.", [{ text: '확인', style: 'cancel' }])
      return false;
    }
    this.saveMyInfo()
    return true
  }

  updateRequest = async () => {
    this.setState({ loading : true })
    if(this.profileValidateCheck()){
      api
      .put(`/users/${this.state.id}`, (formdata),
      {
        headers:{
          Authorization: this.state.token
        }
      })
      .then((res) =>  {
        console.log('send data for registration');
        console.log(res)
        Alert.alert("정보 수정 완료", "회원정보 수정이 완료되었습니다.",[
          {text:'확인', style:'cancel',
            onPress: () => { this.props.navigation.navigate('Main') }}
        ])
      })
      .catch((err) =>  {
        console.log('fail to register');
        console.log(err.response)
        Alert.alert("요청 실패", err.response.data.message || err.response.data.error,[
          {text:'확인', style:'cancel',
            onPress: () => {this.setState({ loading : false })}}
        ])       
      });
    }
  };

  render() {
    if(this.state.loading){
      return (
        <Container>
        <Header style={{
          height: 60,
          backgroundColor: '#f8f8f8',
          justifyContent:'space-between'}}
          androidStatusBarColor='#000'
      >
        <Left>
          <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
            <Icon name = 'chevron-back' type = 'Ionicons'/>
          </TouchableOpacity>
        </Left>
        <Body><Title>프로필 수정</Title></Body>
        <Right></Right>
      </Header>
      <Spinner visible={this.state.loading} />
      </Container>
      )
    }else{
      return (
        <Container>
          <Header style={{
              height: 60,
              backgroundColor: '#f8f8f8',
              justifyContent:'space-between'}}
              androidStatusBarColor='#000'
          >
            <Left>
              <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
                <Icon name = 'chevron-back' type = 'Ionicons'/>
              </TouchableOpacity>
            </Left>
            <Body><Title>프로필 수정</Title></Body>
            <Right></Right>
          </Header>

          <Content>
            <TouchableWithoutFeedback>
              <KeyboardAvoidingView>
                <Form> 
                  <ImageSelect stateBus={this.changeImage} existing_image={[(this.state.image)]}
                      isProfile={true}>
                  </ImageSelect>


                  <Item floatingLabel>
                    <Label>이름(실명)</Label>
                    <Input autoCapitalize="none"
                      onChangeText = {(text) => {this.setState({name : text}) }}
                      value = {this.state.name}
                    />
                  </Item>

                  {/* nickname */}
                  <Item floatingLabel>
                    <Label>닉네임</Label>
                    <Input autoCapitalize="none"
                      onChangeText = {(name) => {this.setState({nickname : name}) }}
                      value = {this.state.nickname}
                    />
                  </Item>

                  {/* phone */}
                  <Item floatingLabel>
                    <Label>연락처{" ('-'을 제외하고 입력해주세요)"}</Label>
                    <Input autoCapitalize="none"
                      keyboardType="numeric"
                      onChangeText = {(text) => {this.setState({number : text}) }}
                      value = {this.state.number}
                    />
                  </Item>

                  <Item floatingLabel>
                    <Label>생년월일{" ('-' 제외, YYYYMMDD)"}</Label>
                    <Input autoCapitalize="none"
                      onChangeText = {(birthday) => {this.setState({birthday : birthday}) }}
                      value = {this.state.birthday}
                    />
                  </Item>
                </Form>
              </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
          </Content>
          <View style={styles.footer}>
            <Button transparent style={ styles.footerbutton }
              onPress={() => this.updateRequest()}>
              <Text style={styles.footerText}>수정하기</Text>
            </Button>
          </View>
        </Container>
      )
    }
  }
}

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    flex:0.1,
    left: 0,
    right: 0,
    bottom: -5,
    backgroundColor:'#ff3377',
    flexDirection:'row',
    height:80,
    alignItems:'center',
    paddingTop: 7
  },
  footerbutton: {
    alignItems:'center',
    justifyContent: 'center',
    flex:1,
  },
  footerText: {
    color:'white',
    fontWeight:'bold',
    alignItems:'center',
    fontSize: 20,
  },
});

export default SettingMyInfoScreen;