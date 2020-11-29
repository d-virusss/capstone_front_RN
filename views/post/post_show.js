import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {View, ScrollView, Image, StyleSheet, TouchableOpacity, Alert,
  DeviceEventEmitter, Dimensions} from 'react-native';
import {Text, Icon, Content, Form, Left, Item, Right, Button, Footer, Card,
  FooterTab, Header, Body, Container, Title, Tab, Tabs, TabHeading, CardItem, Thumbnail} from 'native-base';
import Popover from 'react-native-popover-view';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons'
import api from '../shared/server_address'
import UserAgent from 'react-native-user-agent';
import number_delimiter from '../shared/number_delimiter'
import {Rating} from 'react-native-elements'
import { SliderBox } from "react-native-image-slider-box";

IconM.loadFont();
UserAgent.getUserAgent(); //synchronous


var user_id;
var reviewList = [];
var postForm = {}; // for navigation props

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
    category_id : '',
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
		rating : 0,
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
        //post info
        console.log(response)
				this.state.title = response.data.post_info.title
				this.state.price = response.data.post_info.price
				this.state.body = response.data.post_info.body
				this.state.category = response.data.post_info.category
				this.state.like_check = response.data.post_info.like_check
				this.state.icon = response.data.post_info.like_check ? "heart" : "heart-outline"
				this.state.contract = response.data.post_info.contract
				this.state.rating = response.data.post_info.rating
        this.state.rent_count = response.data.post_info.rent_count
        if(response.data.post_info.image_detail.length === 0){
          this.state.images = [response.data.post_info.image];
        }
        else{
          this.state.images = response.data.post_info.image_detail
        }
        this.state.isBooked = response.data.post_info.is_booked
        this.state.category_id = response.data.post_info.category_id
        
				//writer info
				this.state.provider_name = response.data.user.user_info.nickname,
				this.state.provider_location = response.data.user.user_info.location_title,
				this.state.provider_id = response.data.user.user_info.id,
				this.state.provider_profile_image = response.data.user.user_info.image
				this.state.is_your_post = response.data.user.user_info.id == parseInt(user_id) ? true : false;
        
        
        //fill postForm
        postForm = response.data;
        this.setState({loading : false})

      }).catch((err) => {
				console.log(err);
      })
  }

  componentDidMount() {
    console.log('------- enter post_show -------');
    console.log(this.params)
		this.state.post_id = this.params.post_id
    this.getToken().then(() => {
			//순서 지키기 rendering 속도
			this.getReviewList();
			this.getPostInfo();
			//
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
			reviewList = res.data;
		}).catch((err) => {
			console.log(err)
		})
	}
  //make review list
  makeReviewList() {
    if(reviewList.length == 0)
      return(<Card><CardItem><Title>등록된 리뷰가 없습니다.</Title></CardItem></Card>)
    return reviewList.map((ele) => {
      let year = ele.review_info.created_at.substr(0, 4);
      let month =ele.review_info.created_at.substr(6, 2) ;
      let day=ele.review_info.created_at.substr(10, 2) ;
      let date = year+"."+month+"."+day
      return (
        <Card style={{margin:30}}>
          <CardItem style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', paddingTop:'3%'}}
          button onPress={() => { /*link to user profile show*/}}>
            <TouchableOpacity onPress={() => {this.props.navigation.navigate("ProfileShow", {} )}}>
              <Thumbnail source={{uri: ele.review_info.user_image}} />
            </TouchableOpacity>
            <Body style={{marginLeft : '5%'}} >
              <View style={{flexDirection: 'row'}}>
                <Rating readonly
                  startingValue={ele.review_info.rating}
                  ratingCount={5}
                  imageSize={18}
                  style={{ paddingVertical: 10 }}/>
                <Title style={{margin : '3%'}}> {ele.review_info.rating}</Title>
              </View>
              <View>
                <Text style={styles.post_category}>{ele.review_info.user_nickname} / {date}</Text>
              </View>
            </Body>
          </CardItem>
          
          <CardItem>
              <Body>
                  <Text>{ele.review_info.body}</Text>
              </Body>
          </CardItem>
        </Card>
      );
    });
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
              () => { this.props.navigation.navigate("PostUpdate", { my_post: postForm }) })}>
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
                this.props.navigation.navigate('PostReport', {
                onGoBack: () => { this.getPostInfo(); },
                post: postForm
              })
            })}>
            <Text style={styles.popoverel}>신고하기</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }

  renderFooter(){
    console.log("------------------")
    console.log(postForm)
    if(this.state.is_your_post){
      return (
        <FooterTab style={{backgroundColor:'#F8F8F8'}}>
          <Button transparent onPress={() => { this.props.navigation.navigate("Contract", { my_post : this.state, onGoBack: ()=>{this.getPostInfo();} }) }}>
            <Text style={{ color: '#ff0055', fontWeight: 'bold', fontSize: 17, paddingVertical: 5}}>계약서 수정</Text>
          </Button>
          <Button transparent
            onPress={() => { this.props.navigation.navigate('Reservation',{ onGoBack: ()=>{this.getPostInfo();} }) }} >
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
            <Text style={{color: 'orange', fontWeight : 'bold', fontSize:17}}>채팅</Text>
          </Button>
          {this.state.isBooked == false && (<Button vertical transparent
            onPress={() => { this.props.navigation.navigate('Booking', { post_info: postForm.post_info, onGoBack: ()=>{this.getPostInfo(); }}) }} >
            <Text style={{ fontWeight: 'bold', fontSize:17}}>예약</Text>
          </Button>)}
          {this.state.isBooked == true && (<Button vertical transparent
            onPress={() => {this.props.navigation.navigate('Booking', { post_info: postForm.post_info, onGoBack: ()=>{this.getPostInfo(); }}) }} >
            <Text style={{ fontWeight: 'bold', fontSize:17}}>예약 취소</Text>
          </Button>)}
        </FooterTab>
      )
    }
  }

  render(){
    if(this.state.loading) return null;
    else{
      console.log("render start")
      return(
        <Container>
          <Header style={{height: 60, backgroundColor: '#f8f8f8',}} androidStatusBarColor='black'>
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
              <View>
              <SliderBox style={styles.swiper}
                images={this.state.images}
                sliderBoxHeight={300}
                inactiveDotColor="#ffccdd"
                dotColor="#ff3377" />
                </View>
              <View>
                <Form>
                  <Item regular style={styles.providerBar}>
                    <TouchableOpacity style={{ marginLeft: '3%' }}
                    onPress={() => { this.props.navigation.navigate("ProfileShow", { user_id : this.state.provider_id }) } }>
                      <Image source={{ uri: this.state.provider_profile_image || "empty " }} style={styles.providerProfileiimage}></Image>
                    </TouchableOpacity>
                    <View style={styles.providerProfile}>
                      <Text style={styles.providerName}>{this.state.provider_name}</Text>
                      <Text style={styles.providerLocation}>{this.state.provider_location}</Text>
                    </View>
                  
                    <Right style={styles.rentCountArea}>
                      <Text style={styles.providerLocation}>지난 대여 {this.state.rent_count}</Text>
                    </Right>
                  </Item>

                  <Tabs tabBarUnderlineStyle={{backgroundColor:'#ff3377'}}>
                    <Tab heading="상세 정보" activeTextStyle={{ color:'#ff3377' }} tabStyle={{ backgroundColor:'white' }}>
                      <Item regular style={styles.postbody}>
                        <Text style={styles.post_category}>{this.state.category}</Text>
                        <Text style={styles.post_title}>{this.state.title}</Text>
                        <Text style={styles.post_price}>{number_delimiter(this.state.price)}원 / 일</Text>
                        <Text style={styles.post_body}>{this.state.body}</Text>
                      </Item>
                    </Tab>

                    <Tab heading="리뷰" activeTextStyle={{ color: '#ff3377' }} tabStyle={{ backgroundColor: 'white' }}>
                      <Item style={styles.review_header}>
                        <Title>사용자 총 평점</Title>
                        <Text style={styles.reviewNumberRating}>{this.state.rating}</Text>
                        <Rating
                          readonly
                          startingValue={this.state.rating}
                          ratingCount={5}
                          imageSize={30}
                          style={{ paddingVertical: 10 }}
                          />
                      </Item>
                      <View style={{ padding: '3%' }}>
                        {this.makeReviewList()}
                      </View>
                    </Tab>
                  </Tabs>
                </Form>
              </View>
            </ScrollView>
          </Content>

          <Footer style={{}}>
            {this.renderFooter()}
          </Footer>
        </Container>
      )
    }
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
    paddingVertical: '3%',
    marginTop: '3%'
  },
  providerProfileiimage :{
    width : 50,
    height : 50,
    borderRadius : 10,
    marginLeft: '1%',
  },
  providerProfile : {
    width: '50%',
    marginLeft : '3%'
  },
  providerName : {
    fontSize : 20,
    fontWeight : "bold",
  },
  providerLocation : {
    fontSize : 13,
    color : 'grey',
    marginTop: '3%',
  },
  rentCountArea : {
    width: '30%',
    marginRight : '8%',
    marginTop : '7%',
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
  review_header: {
    paddingVertical : '5%',
    paddingHorizontal : '5%',
    flexDirection: 'column',
    alignItems : 'center',
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
  reviewNumberRating : {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: '2%',
  }
})

export default PostShow;