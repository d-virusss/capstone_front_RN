import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {View, ScrollView, Image, StyleSheet, TouchableOpacity, Alert,} from 'react-native';
import {Text, Icon, Content, Form, Left, Item, Right, Button, Footer, FooterTab, Header, Body, Container, Title} from 'native-base';
import Popover from 'react-native-popover-view';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import api from '../shared/server_address'
import UserAgent from 'react-native-user-agent';
import number_delimiter from '../shared/number_delimiter'

let myID;
var is_your_post = false;

IconM.loadFont();
UserAgent.getUserAgent(); //synchronous

var user_id;
class PostShow extends Component{
  params = this.props.route.params;

  state = {
    login_user_id : "",
    token: "",
    post_id: 0,
    like_check: false,
    icon : "",
    title : "",
    price : 0,
    body : "",
    category : "",
    image : "",
    provider_name : "",
    provider_location : "",
    provider_id : "",
    provider_profile_image: "",
    rent_count : 0,
    show_popover : false,
    chat_id: 0,
    val: -1,
    loading:true
  };
  getToken = async () => {
    try{
      const value = await AsyncStorage.getItem('token');
      myID = await AsyncStorage.getItem('user_id');
      this.state.token = value
      user_id = await AsyncStorage.getItem('user_id')
    } catch (error){
      console.log("error : ", error);
    }
  }

  componentDidMount() {
    //init var
    is_your_post = true;
    console.log('------- enter post_show -------');
    this.getToken();
    this.setParams();
  }

  setParams = () => {
    this.setState({ 
      title: this.params.post.post_info.title,
      price: this.params.post.post_info.price,
      body: this.params.post.post_info.body,
      category: this.params.post.post_info.category,
      post_id : this.params.post.post_info.id,
      like_check : this.params.post.post_info.like_check,
      image: this.params.post.post_info.image,
      icon: this.params.post.post_info.like_check ? "heart" : "heart-outline",
      provider_name : this.params.post.user.user_info.nickname,
      provider_location : this.params.post.user.user_info.location_title,
      provider_id : this.params.post.user.user_info.id,
      provider_profile_image : this.params.post.user.user_info.image,
      rent_count : this.params.post.user.user_info.rent_count,
     }, () => {
      this.setState({ icon : this.state.like_check ? "heart" : "heart-outline" })
    }, () => {console.log("aa8304872394724028" + this.state)})
    is_your_post = this.params.post.user.user_info.id == parseInt(user_id) ? true : false;
    console.log("=-------------------")
    console.log(this.state)
    console.log(is_your_post)
    this.setState({loading : false})
  }

  chatCreateRequset = async()=> {
    await api
      .post(`/chats?post_id=${this.state.post_id}`, null,
      { 
        headers : {'Authorization': this.state.token}
      })
      .then((response) => {
        console.log('success');
        console.log(response);
        this.state.chat_id = response.data.chat_info.id;
        console.log(this.state.chat_id)
        this.setState({val:0})
      })
      .catch((err) => {
        this.setState({val:1})
        console.log("err : ", err)
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  likeRequest = () => {
    console.log(this.state)
    if (this.state.like_check) {
      this.setState({ icon: 'heart-outline', like_check: false })
    }
    else this.setState({ icon: "heart", like_check: true })
    api
      .post('/users/like', { like: { target_id: (this.state.post_id), target_type: 'post' } }, {
        headers: {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log(res)
        // state 변경해서 icon 변경
      })
      .catch((e) => {
        console.log(e)
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }
  makeCallchat_navigate(){
    this.chatCreateRequset().then(()=>{
      console.log(this.state.val);
      this.checkNavigate();
    })
  }
  
  checkNavigate(){
    if(this.state.val === 0)
      this.props.navigation.navigate('ChatRoom', {chat_id: this.state.chat_id, post_id: this.state.post_id,nickname:this.state.provider_name,avatar:this.state.provider_profile_image});
    if(this.state.val === 1) {
      Alert.alert(
        "오류",
        "옳바르지 않은 대상입니다.",
      );
    }
  }

  gochangeRequest(){
    this.props.navigation.navigate('PostUpdate', { my_post : this.params.post.post_info})
  }

  destroyRequest(){
    api
      .delete(`/posts/${this.state.post_id}`, {
        headers : {
          'Authorization': this.state.token
        }
      })
      .then((res) => {
        console.log(res)
      })
      .catch((e) => {
        console.log(e)
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  showstate() {
    console.log(this.state)
  }

  renderUpdateandDelete(){
    if(is_your_post)
    return(
      <View>
        <TouchableOpacity
          onPress={() => this.setState({ show_popover : false }, 
          () => { this.props.navigation.navigate("PostUpdate", { my_post : this.params.post.post_info } ) }) }>
          <Text style={styles.popoverel}>수정</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setState({ show_popover : false }, () => { this.destroyRequest()}) }>
          <Text style={styles.popoverel}>삭제</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderFooter(){
    if(is_your_post){
      return (
        <FooterTab>
          <Button transparent onPress={() => { this.props.navigation.navigate("Contract", { my_post : this.params.post.post_info }) }}>
            <Text style={{ color: '#ff0055', fontWeight: 'bold', fontSize: 17, paddingVertical: 5}}>계약서 수정</Text>
          </Button>
          <Button transparent
            onPress={() => { this.props.navigation.navigate('Reservation') }} >
            <Text style={{ fontWeight: 'bold', fontSize: 17, paddingVertical: 5 }}>예약 목록 확인</Text>
          </Button>
        </FooterTab>
      )
    }
    else{
      return(
        <FooterTab>
          <Button style={{ marginLeft: -30, width : '20%' }} onPress={() => this.likeRequest()}>
            <Icon name={this.state.icon || "heart-outline"} style={styles.likeIcon} />
          </Button>
          <Button transparent onPress={() => { this.makeCallchat_navigate() }}>
            <Text style={{color: 'orange', fontWeight : 'bold', fontSize:17}}>채팅</Text>
          </Button>
          <Button transparent
            onPress={() => { this.props.navigation.navigate('Booking', { post_id: this.state.post_id, }) }} >
            <Text style={{ fontWeight: 'bold', fontSize: 17 }}>예약</Text>
          </Button>
        </FooterTab>
      )
    }
  }

  render(){
    console.log("reder")
    console.log(this.state.rent_count)
    console.log(is_your_post)
    if(this.state.loading) return null;
    else{
    return(
      <Container>
        <Header>
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title>{this.state.title}</Title></Body>
          <Right>
            <Popover
              isVisible = {this.state.show_popover}
              onRequestClose = {() => this.setState({ show_popover: false })}
              from={(
                <TouchableOpacity onPress={() => this.setState({ show_popover: true })}>
                  <Icon name="menu" />
                </TouchableOpacity>
              )}>
              <TouchableOpacity
                  onPress={() => this.setState({ show_popover: false }, () => { this.props.navigation.navigate('PostReport')})}>
                <Text style={styles.popoverel}>신고하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({ show_popover: false }, () => { Alert.alert("신고하지마요 ㅜ") })}>
                <Text style={styles.popoverel}>가짜신고하기</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert("집에가고 싶나?")}>
                <Text style={styles.popoverel}>힘들 떄</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert("히히 못가")}>
                <Text style={styles.popoverel}>집가기</Text>
              </TouchableOpacity>
              {this.renderUpdateandDelete()}
            </Popover>
          </Right>
        </Header>

        <Content style={{flex : 1}}>
          <ScrollView style={styles.container}>
            <View style = {styles.imageArea}>
              <Image source={{ uri : this.state.image || "empty" }} style={styles.imageView} />
            </View>
            <View>
              <View>
                <Form>
                  <Item regular style={styles.providerBar}>
                    <Image source={{ uri: this.state.provider_profile_image || "empty " }} style={styles.providerProfileiimage}></Image>
                    <View style={styles.providerProfile}>
                      <Text style={styles.providerName}>{this.state.provider_name}</Text>
                      <Text style={styles.providerLocation}>{this.state.provider_location}</Text>
                    </View>
                  
                    <Right style={styles.rentCountArea}>
                        <Text style={styles.providerLocation}>최근 대여 수 : {this.state.rent_count}</Text>
                    </Right>
                  </Item>
                  <Item regular style={styles.postbody}>
                      <Text style={styles.post_category}>{this.state.category}</Text>
                      <Text style={styles.post_title}>{this.state.title}</Text>
                      <Text style={styles.post_price}>{number_delimiter(this.state.price)}원 / 1일</Text>
                      <Text style={styles.post_body}>{this.state.body}</Text>
                  </Item>
                </Form>
              </View>
            </View>
          </ScrollView>
        </Content>

        <View>
          <Footer style={{}}>
            {this.renderFooter()}
          </Footer>
        </View>
      </Container>
    );}
  }
}

const styles = StyleSheet.create({
  container : {
    paddingBottom : 50,
  },
  imageArea : {
    width: '100%',
    height : '60%',
  },
  providerBar : {
    flexDirection : "row",
    borderBottomWidth : 0,
    paddingVertical: '3%'
  },
  providerProfileiimage :{
    width : 50,
    height : 50,
    borderRadius : 10,
    marginLeft: '3%',
  },
  providerProfile : {
    width: '30%',
    marginLeft : '3%'
  },
  providerName : {
    fontSize : 20,
    fontWeight : "bold",
    padding : '5%'
  },
  providerLocation : {
    fontSize : 13,
    color : 'grey',
    padding : '5%'
  },
  rentCountArea : {
    width: '30%',
    marginRight : '8%',
    marginTop : '10%',
  },
  fontView : {
    fontSize : 17,
    margin : '5%'
  },
  imageView : {
    width: '100%',
    height: 350,
  },
  likeIcon : {
    color : 'red',
    fontSize : 25
  },
  popoverel : {
    paddingVertical : 10,
    paddingHorizontal : 15,
    margin : 5,
  },
  postbody: {
    paddingVertical : '5%',
    paddingHorizontal : '5%',
    flexDirection: 'column',
    alignItems : 'flex-start'
  },
  post_title :{
    fontSize : 25,
    fontWeight : "bold",
    paddingVertical : '3%'
  },
  post_category :{
    fontSize: 15,
    color: 'grey',
  },
  post_price : {
    fontSize : 20,
    fontWeight : "500",
  },
  post_body : {
    marginTop : '10%'
  }
})

export default PostShow;