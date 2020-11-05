import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import React, { Component } from 'react';
import {View, ScrollView, Image, StyleSheet} from 'react-native';
import {Text, Form, Textarea, Item, Input, Button, Footer, FooterTab, Row,} from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import DB2 from '../../assets/ddbb2.jpg'
Icon.loadFont();
import api from '../shared/server_address'

class PostShow extends Component{

  params = this.props.route.params;

  state = {
    token: "",
    post_id: "",
    like_check: false,
    icon : "",
    title : "",
    price : 0,
    body : "",
    category : "",
    image : "",
    user_name : "",
    user_location : "",
    user_id : "",
  };

  getToken = async () => {
    try{
      const value = await AsyncStorage.getItem('token');
      this.state.token = value
      console.log(this.state.token)
    } catch (error){
      console.log("error : ", error);
    }
  }

  componentDidMount(){
    console.log('------- enter post_show -------');
    this.getToken();
    this.setParams()
  }

  setParams = () => {
    console.log(this.params)
    this.setState({ 
      title: this.params.post.post_info.title,
      price: this.params.post.post_info.price,
      body: this.params.post.post_info.body,
      category: this.params.post.post_info.category,
      post_id : this.params.post.post_info.id,
      like_check : this.params.post.post_info.like_check,
      image: this.params.post.post_info.image,
      icon: this.params.post.post_info.like_check ? "heart" : "heart-outline",
      user_name : this.params.post.user.user_info.nickname,
      user_location : this.params.post.user.user_info.location_title,
      user_id : this.params.post.user.user_info.id,
     }, () => {
      if(this.state.like_check){
        this.state.icon = "heart"
      }
      else this.state.icon = "heart-outline"
    })
  }

  chatCreateRequset(){
    api
      .post(`/chats?post_id=${2}`, null,{ headers : {
        'Authorization': this.token
      }})
      .then((response) => {
        console.log('success');
        console.log(this.token);
        console.log(response);
      })
      .catch((err) => console.log("err : ", err))
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
      })
  }

  makeCallchat_navigate(){
    this.chatCreateRequset();
    this.props.navigation.navigate('ChatRoom', {postId : 2, check : 0,});
  }

  render(){
    return(
      <View style={{flex : 1}}>
        <ScrollView style={styles.container} >
          <View style = {styles.imageArea}>
            <Image source={{ uri : this.state.image || "empty" }} style={styles.imageView} />
          </View>
          <View>
            <View>
              <Form>
                <Item regular style={styles.providerBar}>
                  <View style={styles.providerProfile}>
                    <Text style={styles.providerName}>{this.state.user_name}</Text>
                    <Text style={styles.providerLocation}>{this.state.user_location}</Text>
                  </View>
                </Item>
                <Item regular style={styles.componentMargin}>
                    <Text style={styles.fontView}>{this.state.title}</Text>
                </Item>
                <Item regular style={styles.componentMargin}>
                    <Text style={styles.fontView}>{this.state.category}</Text>
                </Item>
                <Item regular style = {styles.componentMargin}>
                    <Text style={styles.fontView}>1일 / {this.state.price + '원'}</Text>
                </Item>
                <Item regular style = {styles.componentMargin}>
                    <Text style={styles.fontView}>{this.state.body}</Text>
                </Item>
              </Form>
            </View>
          </View>
        </ScrollView>
        <View>
          <Footer>
            <FooterTab>
              <Button style={{marginLeft:-30}} onPress={ () => this.likeRequest()}>
                <Icon name={this.state.icon  || "heart-outline"} style={styles.likeIcon} />
              </Button>
              <Text style={{width: '30%', alignSelf: "center"}}>
                3,000원 / 1 일
              </Text>
              <Button bordered warning onPress={() => { this.makeCallchat_navigate()}}
                      style={{flexDirection: 'row', width:'40%', marginTop:10}}>
                <Text>채팅으로 대여하기</Text>
              </Button>
            </FooterTab>
          </Footer>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    paddingBottom : 50,
  },
  imageArea : {
    width: '95%',
    height : '50%',
    justifyContent : 'center',
    alignItems : 'center',
    alignSelf : 'center'
  },
  providerBar : {
    flexDirection : "row",
    borderBottomWidth : 0
  },
  providerProfile : {
    width: '30%',
    marginLeft : "10%"
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
  componentMargin : {
    marginBottom : '3%',
  },
  fontView : {
    fontSize : 17,
    margin : '5%'
  },
  imageView : {
    width: '90%',
    height: 300
  },
  likeIcon : {
    color : 'red',
    fontSize : 25
  }
})

export default PostShow;