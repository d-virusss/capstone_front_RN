import React, {Component} from 'react';
import {
  View, Container, Header, Content, Form, Item, Button, Text, Left, Right, 
  Body, Icon, Title, List, ListItem, Thumbnail, Card, CardItem,
} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler'
import AsyncStorage from '@react-native-community/async-storage';
import api from '../shared/server_address';
import number_delimiter from '../shared/number_delimiter';

class Partner_page extends Component{
  constructor(props){
    super(props);
    this.state.company_id = this.props.route.params.company_id;
  }

  state={
    token:AsyncStorage.getItem('token'),
    posts:[],
    company:{},
    company_name:'',
    message:'',
    description:'',
    user_id:-1,
    image:'',
  }

  getToken = async()=>{
    this.state.token = AsyncStorage.getItem('token');
  }
  getCompanyInfo = async() =>{
    this.state.token = await AsyncStorage.getItem('token');
    await api
            .get(`companies/${this.state.company_id}`,
            {
              headers:{'Authorization': this.state.token}
            })
            .then((response)=>{
              console.log(response)
              this.state.company = response.data.company_info,
              this.state.user_id= response.data.user.user_info.id,
              this.state.image=response.data.user.user_info.image,
              this.state.company_name= response.data.company_info.name,
              this.state.message=response.data.company_info.message,
              this.setState({description:data.company_info.description})
            })
            .catch(error=>console.log(error))
  }

  getPostInfo = async()=>{
    this.state.token = await AsyncStorage.getItem('token');
    await api
            .get(`/users/${this.state.user_id}/list?post_type=provide`,{
              headers:{'Authorization': this.state.token}
            })
            .then(response=>{
              this.setState({posts: response.data})
              console.log(this.state.posts)
            })
            .catch(error=>console.log(error))
  }

  makeIndexList() {
    console.log("make index list")
    return this.state.posts.map((post) => {
      return(
        <TouchableOpacity onPress={() =>{this.props.navigation.navigate('PostShow', { post: post }) }}>
          <ListItem thumbnail key = {post.post_info.id}>
            <Left>
              <Thumbnail square source={{ uri: post.post_info.image }} />
            </Left>
            <Body>
              <Text style={{ marginBottom : 5 }}>{post.post_info.title}</Text>
              <Text note numberOfLines={1}>{post.post_info.created_at_ago}</Text>
              <Text style={{ marginTop : 10 }}>{number_delimiter(post.post_info.price)}원 / 일</Text>
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

  //component did mount를 어싱크로 실행
  asyncExequte= async()=>{
    await this.getToken();
    await this.getCompanyInfo();
    await this.getPostInfo();
  }

  componentDidMount(){
    this.asyncExequte();
  }

  render(){
    return(
      <Container>
        <Header style={{
          height: 60,
          backgroundColor: '#f8f8f8',
        }} androidStatusBarColor='black'>
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title style={{ color: 'black', alignSelf: 'center', fontSize: 20}}>파트너 페이지</Title></Body>
          <Right></Right>
        </Header>
        <Card style={{width:'95%', alignSelf:'center'}}>
          <CardItem key={1}>
            <Thumbnail source={{uri: this.state.image}}/>
            <Text style={{padding:'3%'}}>{this.state.company_name}</Text>
          </CardItem>
          <CardItem key={2}>
            <Text note style = {{padding:'3%'}}>{this.state.message}</Text>
          </CardItem>
          <CardItem key = {3}>
          <Text style = {{padding:'3%'}}>{this.state.company.description}</Text>
          </CardItem>
        </Card>
        <Content>
          <List>{this.makeIndexList()}</List>
        </Content>
      </Container>

    )
  }
}

export default Partner_page;