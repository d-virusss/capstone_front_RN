import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {View, ScrollView, Image, StyleSheet, TouchableOpacity, Alert,
  DeviceEventEmitter, Dimensions} from 'react-native';
import {Text, Icon, Content, Form, Left, Item, Right, Button, Footer, 
  FooterTab, Header, Body, Container, Title, Tab, Tabs, TabHeading} from 'native-base';
import Popover from 'react-native-popover-view';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import api from '../shared/server_address'
import UserAgent from 'react-native-user-agent';
import number_delimiter from '../shared/number_delimiter'
import { CommonActions, StackActions } from '@react-navigation/native';
import { SliderBox } from "react-native-image-slider-box";

IconM.loadFont();
UserAgent.getUserAgent(); //synchronous

let updateFlag = 0;
var user_id;
const windowHeight = Dimensions.get('window').height;

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
    loading:true,
    is_your_post:'',
    isBooked: null,
    contract: '',
    images : [],
  };

  getToken = async () => {
    try{
      const value = await AsyncStorage.getItem('token');
      this.state.token = value
      user_id = await AsyncStorage.getItem('user_id')
    } catch (error){
      console.log("error : ", error);
    }
  }
 
  getPostInfo = async () => {
    api
      .get(`/posts/${this.state.post_id}`,{
        headers:{
          'Authorization' : this.state.token,
        }
      })
      .then((response)=>{
        this.setState({
          title: response.data.post_info.title,
          price: response.data.post_info.price,
          body: response.data.post_info.body,
          category: response.data.post_info.category,
          icon: response.data.post_info.like_check ? "heart" : "heart-outline",
          image: response.data.post_info.image,
          provider_location:response.data.post_info.location_title,
          rent_count : response.data.post_info.rent_count,
          isBooked: response.data.post_info.is_booked,
          contract : response.data.post_info.contract,
        }, () => {console.log(this.state); console.log("update하기 위해 getPostinfo Call ---------")})
      })
  }

  componentDidMount() {
    console.log('------- enter post_show -------');
    console.log(this.params)
    this.getToken().then(() => {
      this.setParams();
      this.getReviewList();
    })
    this.eventListener = DeviceEventEmitter.addListener('updateContent', this.updateEventHandler);
    
  }

  componentWillUnmount(){
    //remove listener
    this.eventListener.remove();
}

  updateEventHandler = (e) => {
    console.log("update event handler333")
    this.getPostInfo();
  }

  setParams() {
    this.state.title = this.params.post.post_info.title,
    this.state.price = this.params.post.post_info.price,
    this.state.body = this.params.post.post_info.body,
    this.state.category = this.params.post.post_info.category,
    this.state.post_id = this.params.post.post_info.id,
    this.state.like_check = this.params.post.post_info.like_check,
    this.state.image = this.params.post.post_info.image,
    this.state.icon = this.params.post.post_info.like_check ? "heart" : "heart-outline",
    this.state.provider_name = this.params.post.user.user_info.nickname,
    this.state.provider_location = this.params.post.user.user_info.location_title,
    this.state.provider_id = this.params.post.user.user_info.id,
    this.state.provider_profile_image = this.params.post.user.user_info.image,
    this.state.rent_count = this.params.post.post_info.rent_count,
    this.state.isBooked = this.params.post.post_info.is_booked,
    this.state.contract = this.params.post.post_info.contract,
    this.state.is_your_post = this.params.post.user.user_info.id == parseInt(user_id) ? true : false;
    this.state.images = this.params.post.post_info.image_detail

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
        this.state.chat_id = response.data.chat_info.id;
        this.setState({val:0})
      })
      .catch((err) => {
        this.setState({val:1})
        console.log("err : ", err)
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  getReviewList () {
    api.get(`reviews?post_id=${this.state.post_id}`, {
      headers : {'Authorization': this.state.token}
    }).then((res) => {
      console.log("get review ")
      console.log(res);
    }).catch((err) => {
      console.log(err)
    })
  }

  makeReviewList() {
    
  }

  likeRequest = () => {
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
    if(this.state.val === 0){
      updateFlag = 1;
      this.props.navigation.navigate('ChatRoom', {chat_id: this.state.chat_id, post_id: this.state.post_id,nickname:this.state.provider_name,avatar:this.state.provider_profile_image});
    }
    if(this.state.val === 1) {
      Alert.alert(
        "오류",
        "옳바르지 않은 대상입니다.",
      );
    }
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
        Alert.alert("삭제 완료", "", [{text:'확인', style:'cancel'}])
        updateFlag = 1;
        this.props.navigation.navigate('Main')
      })
      .catch((e) => {
        console.log(e)
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      })
  }

  renderUpdateandDelete(){
    if(this.state.is_your_post){
      return (
        <View>
          <TouchableOpacity
            onPress={() => this.setState({ show_popover: false },
              () => { updateFlag = 1; this.props.navigation.navigate("PostUpdate", { my_post: this.params.post.post_info }) })}>
            <Text style={styles.popoverel}>수정</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.setState({ show_popover: false }, () => { this.destroyRequest() })}>
            <Text style={styles.popoverel}>삭제</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else{
      return(
        <View>
          <TouchableOpacity
            onPress={() => this.setState({ show_popover: false }, () => {
              updateFlag = 1; this.props.navigation.navigate('PostReport', {
                onGoBack: () => { this.getPostInfo(); },
                post: this.params.post
              })
            })}>
            <Text style={styles.popoverel}>신고하기</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }

  renderFooter(){
    if(this.state.is_your_post){
      return (
        <FooterTab style={{backgroundColor:'#F8F8F8'}}>
          <Button transparent onPress={() => { updateFlag = 1; this.props.navigation.navigate("Contract", { my_post : this.state, onGoBack: ()=>{this.getPostInfo();} }) }}>
            <Text style={{ color: '#ff0055', fontWeight: 'bold', fontSize: 17, paddingVertical: 5}}>계약서 수정</Text>
          </Button>
          <Button transparent
            onPress={() => { updateFlag = 1; this.props.navigation.navigate('Reservation',{ onGoBack: ()=>{this.getPostInfo();} }) }} >
            <Text style={{ fontWeight: 'bold', fontSize: 17, paddingVertical: 5 }}>예약 목록 확인</Text>
          </Button>
        </FooterTab>
      )
    }
    else{
      return(
        <FooterTab style={{backgroundColor:'#F8F8F8',}}>
          <Button vertical style={{ marginLeft: -30, width : '20%', }} onPress={() => this.likeRequest()}>
            <Icon name={this.state.icon || "heart-outline"} style={styles.likeIcon} />
          </Button>
          <Button vertical transparent onPress={() => { this.makeCallchat_navigate() }}>
            <Text style={{color: 'orange', fontWeight : 'bold', fontSize:14}}>채팅</Text>
          </Button>
          {this.state.isBooked == false && (<Button vertical transparent
            onPress={() => { updateFlag = 1; this.props.navigation.navigate('Booking', { post_info: this.params.post.post_info, onGoBack: ()=>{this.getPostInfo(); }}) }} >
            <Text style={{ fontWeight: 'bold', fontSize:14}}>예약</Text>
          </Button>)}
          {this.state.isBooked == true && (<Button vertical transparent
            onPress={() => { updateFlag = 1; this.props.navigation.navigate('Booking', { post_info: this.params.post.post_info, onGoBack: ()=>{this.getPostInfo(); }}) }} >
            <Text style={{ fontWeight: 'bold',}}>예약취소</Text>
          </Button>)}
        </FooterTab>
      )
    }
  }

  render(){
    if(this.state.loading) return null;
    else{
    return(
      <Container>
        <Header style={{
          height: 60,
          backgroundColor: '#f8f8f8',
        }} androidStatusBarColor='black'>
          <Left style={{flex : 1}}>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body style={{flex : 8}}><Title style={{color:'black', alignSelf:'center'}}>{this.state.title}</Title></Body>
          <Right style={{flex : 1}}>
            <Popover
              isVisible = {this.state.show_popover}
              onRequestClose = {() => this.setState({ show_popover: false })}
              from={(
                <TouchableOpacity onPress={() => this.setState({ show_popover: true })}>
                  <Icon name="menu" />
                </TouchableOpacity>
              )}>
              {this.renderUpdateandDelete()}
            </Popover>
          </Right>
        </Header>

        <Content style={{flex : 1}}>
          <ScrollView style={styles.container}>
            
            <SliderBox style={styles.swiper}
              images={this.state.images}
              onCurrentImagePressed={() => this.doPickImage()}
              sliderBoxHeight={300}
              inactiveDotColor="#ffccdd"
              dotColor="#ff3377" />
            <View>
              <Form>
                <Item regular style={styles.providerBar}>
                  <Image source={{ uri: this.state.provider_profile_image || "empty " }} style={styles.providerProfileiimage}></Image>
                  <View style={styles.providerProfile}>
                    <Text style={styles.providerName}>{this.state.provider_name}</Text>
                    <Text style={styles.providerLocation}>{this.state.provider_location}</Text>
                  </View>
                
                  <Right style={styles.rentCountArea}>
                    <Text style={styles.providerLocation}>지난 대여 {this.state.rent_count}</Text>
                  </Right>
                </Item>

                <Tabs tabBarUnderlineStyle={{backgroundColor:'#007aff'}}>
                  <Tab heading={ <TabHeading activeTextStyle={{backgroundColor:'#007aff'}} transparent style={{backgroundColor : 'white'}}><Text style={{color:'black'}}>상세 정보</Text></TabHeading>}>
                    <Item regular style={styles.postbody}>
                      <Text style={styles.post_category}>{this.state.category}</Text>
                      <Text style={styles.post_title}>{this.state.title}</Text>
                      <Text style={styles.post_price}>{number_delimiter(this.state.price)}원 / 일</Text>
                      <Text style={styles.post_body}>{this.state.body}</Text>
                    </Item>
                  </Tab>

                  <Tab heading={ <TabHeading transparent style={{backgroundColor : 'white'}}><Text style={{color:'black'}}>리뷰</Text></TabHeading>}>
                    <Item regular style={styles.postbody}>
                      <Text style={styles.post_title}>사용 후기</Text>
                      <Text> 총평점</Text>
                      {this.makeReviewList()}
                    </Item>
                  </Tab>
                </Tabs>
              </Form>
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
    height : windowHeight * (0.4),
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
    height: windowHeight * (0.4),
  },
  likeIcon : {
    color : 'red',
    fontSize : 30
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
  },
  swiper: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignSelf: 'center',
  },
})

export default PostShow;