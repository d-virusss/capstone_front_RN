import React, {Component} from 'react';
import { Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon, Badge } from 'native-base';
import { ScrollView, RefreshControl, DeviceEventEmitter, View, Alert} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import api from '../shared/server_address';
import number_delimiter from '../shared/number_delimiter'
import APP_KEY from '../../key'

var searchModel= {
  id : '', // category_id
  content : '',
}

class ProvideIndex extends Component {
  constructor(props){
    super(props)
    this.state={
      token: '',
      posts: [],
      refreshing: false,
      loading : true,
    }
  }
  
  getToken = async () => {
    let value = await AsyncStorage.getItem('token');
    this.state.token = value;
    this.sendIndexRequest();
  };

  componentDidMount() {
    this.getToken()
    this.eventListener = DeviceEventEmitter.addListener('categoryId', this.catetoryEventHandler);
    this.eventListener = DeviceEventEmitter.addListener('searchContent', this.searchEventHandler);
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this._onRefresh()
    });
    console.log('component did mount in post index --------')
    console.log(APP_KEY)
  }

  _onRefresh = () => {
    console.log("제공 게시물 refresh")
    this.setState({refreshing: true});
    this.sendIndexRequest();
    this.setState({refreshing: false});
  }

  makeIndexList() {
    return this.state.posts.map((post) => {
      return(
        <TouchableOpacity onPress={() =>{this.props.navigation.navigate('PostShow', { 
          post_id: post.post_info.id })}}
          key={post.post_info.id}>
          <ListItem thumbnail key = {post.post_info.id}>
            <Left style={{ marginLeft: '-2%' }}>
              <Thumbnail square style={{ width: 100, height: 100, borderRadius: 5 }} source={
                (post.post_info.image == "/image/default.png" ? require("../../assets/default.png") : {uri : post.post_info.image}) } />
            </Left>
            <Body style={{}}>
              <View style={{ flexDirection: 'row', width:'70%' }}>
                <Text    style={{ marginBottom : 5, fontWeight:'bold'}}>{post.post_info.title}</Text>
                <Text style={{  }} note numberOfLines={1}>{post.post_info.created_at_ago}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems:'center', width:'50%' }}>
                <Text numberOfLines={1} style={{ fontSize: 15, fontWeight:'300' }}>{post.user.user_info.nickname}</Text>
                <Text note numberOfLines={1} style={{ }}>{post.location_info.title} </Text>
              </View>
              <Text style={{ marginTop : 10, fontWeight: '300' }}>{number_delimiter(post.post_info.price)}원 / 일</Text>
            </Body>
            <Right style={{ flexDirection:'row',}}>
              {post.post_info.status === "unable" &&
              <Badge style={{ backgroundColor: '#ff9a00', position: 'absolute', right: '40%', bottom: '90%' }}>
                <Text style={{ fontWeight: 'bold', fontSize: 12 }}>대여중</Text>
              </Badge>}
              {post.user.user_info.is_company &&
                <Badge style={{ backgroundColor: '#ff3377', position: 'absolute', right: '40%', bottom: '90%' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: 12 }} >파트너</Text>
                </Badge>}
              <Icon name='heart-outline' type='MaterialCommunityIcons' style={{ fontSize:20 }}/>
              <Text style={{ marginLeft : 5 }}>
                {post.post_info.likes_count}
              </Text>
            </Right>
          </ListItem>
        </TouchableOpacity>
      )
    })
  }

  sendIndexRequest() {
    if(searchModel.id == 0){ //default
      api
      .get('/posts?post_type=provide', {
        headers: {
          Authorization: this.state.token,
        },
        params: {
          "q[title_or_body_or_user_nickname_cont]" : searchModel.content,
        },
      })
      .then((res) => {
        console.log(res)
        this.setState({posts: res.data, loading: false});
      })
      .catch(function (e) {
        console.log(e.response);
        this.setState({loading : false});
        Alert.alert("접근 실패", e.response.data.error,
          [
            {
            text:'확인', 
            onPress : () => this.props.navigation.navigate("Logins")
            }, 
            {
              style:'cancel'
            }
          ])
      }.bind(this));
      
    }else{
      api
        .get('/posts?post_type=provide', {
          headers: {
            Authorization: this.state.token,
          },
          params: {
            "q[category_id_eq]" : searchModel.id,
            "q[title_or_body_or_user_nickname_cont]" : searchModel.content,
            "user": searchModel.content,
          },
        })
        .then((res) => {
          console.log(res)
          this.setState({posts: res.data, loading : false});
        })
        .catch(function (e) {
          console.log('send post failed!!!!' + e);
          this.setState({loading : false});
          Alert.alert("접근 실패", e.data.response.error,
          [
            {
            text:'확인', 
            onPress : () => this.props.navigation.navigate("Logins")
            }, 
            {
              style:'cancel'
            }
          ])
        }.bind(this));
      }
  }

  componentWillUnmount(){
    //remove listener
    this.eventListener.remove();
  }

  catetoryEventHandler = (e) => {
    console.log("category event handler")
    searchModel.id = e.id;
    this.sendIndexRequest();
  }

  searchEventHandler = (e) => {
    console.log("search event handler");
    searchModel.content = e.search;
    this.sendIndexRequest();
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}/>}>
        <Spinner visible={this.state.loading} color="#ff3377"/>
        <Content>
          <List>{this.makeIndexList()}</List>
        </Content>
      </ScrollView>
    );
  }
}


export default ProvideIndex;
