import React, {Component} from 'react';
import { Content, List, ListItem, Thumbnail, Text, Left, Body, Right, Button, Icon } from 'native-base';
import { ScrollView, RefreshControl, DeviceEventEmitter, View, Alert} from "react-native";
import {TouchableOpacity} from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage';
import Spinner from 'react-native-loading-spinner-overlay';
import api from '../shared/server_address';
import number_delimiter from '../shared/number_delimiter'

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

  _onRefresh = () => {
   
    console.log("제공 게시물 refresh")
    
    this.setState({refreshing: true});
    this.sendIndexRequest();
    this.setState({refreshing: false});
  }

  makeIndexList() {
    return this.state.posts.map((post) => {
      return(
        <TouchableOpacity onPress={() =>{this.props.navigation.navigate('PostShow', { post_id: post.post_info.id }) }}>
          <ListItem thumbnail key = {post.post_info.id}>
            <Left style={{ flex: 3, marginLeft: '-2%' }}>
              <Thumbnail square style={{ width: 90, height: 90, borderRadius: 5 }} source={{ uri: post.post_info.image }} />
            </Left>
            <Body style={{ flex: 9 }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginBottom : 5, fontWeight:'bold' }}>{post.post_info.title}</Text>
                {post.user.user_info.is_company && 
                <Button small disabled style={{ backgroundColor: '#ff3377', 
                    position:'absolute', right:'5%', bottom: '5%', }}>
                  <Text style={{ fontWeight:'bold' }}>파트너</Text>
                </Button>}
                <Text style={{ position:'absolute', right: '-18%' }} note numberOfLines={1}>{post.post_info.created_at_ago}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems:'center' }}>
                <Text style={{ fontSize: 15, fontWeight:'300' }}>{post.user.user_info.nickname}</Text>
                <Text note numberOfLines={1} style={{ }}>{post.location_info.title} </Text>
              </View>
              <Text style={{ marginTop : 10, fontWeight: '500' }}>{number_delimiter(post.post_info.price)}원 / 일</Text>
            </Body>
            <Right style={{ flexDirection:'row'}}>
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
    if(searchModel.id == 0){
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
        if(e.response.data.error == "expired"){
          console.log(this)
          Alert.alert("세션 만료", "로그인을 다시해주세요",
          [{text:'확인', onPress : () => this.props.navigation.navigate("Logins")}, 
          {style:'cancel'}])
        }else{
          Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
        }
        
      }.bind(this));

      return;
    }
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
        this.setState({posts: res.data});
      })
      .catch(function (e) {
        console.log('send post failed!!!!' + e);
        Alert.alert("요청 실패", e.response.data.error,[{text:'확인', style:'cancel'}])
      });
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem('token');
    this.state.token = value;
    this.sendIndexRequest();
  };

  componentDidMount(){
    this.getToken()
    this.eventListener = DeviceEventEmitter.addListener('categoryId', this.catetoryEventHandler);
    this.eventListener = DeviceEventEmitter.addListener('searchContent', this.searchEventHandler);
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
        <Spinner visible={this.state.loading} color="#ff3377"></Spinner>
        <Content>
          <List>{this.makeIndexList()}</List>
        </Content>
      </ScrollView>
    );
  }
}


export default ProvideIndex;
