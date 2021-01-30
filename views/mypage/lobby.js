import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, RefreshControl, ScrollView, Alert, DeviceEventEmitter} from 'react-native';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text, Thumbnail,
       Footer, FooterTab, Content, ListItem, List, Separator } from 'native-base';
import { CommonActions, } from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import api from '../shared/server_address';
import Fire from '../shared/Fire';
import IconM from 'react-native-vector-icons/MaterialIcons';
import IconFe from 'react-native-vector-icons/Feather';
import SQLite from 'react-native-sqlite-storage';
IconFe.loadFont();
IconM.loadFont();

var posts = [];
var myInfo;

class MypageScreen extends Component {
  state = {
    token:'',
    myName:'',
    myLocation:'',
    myGroup:'',
    myImage:'',
    loading: false,
    refreshing : false,
    show_popover : false,
    isCompany: false,
    company_id:null,
    myId : 0,
  };

  _onRefresh = () => {
    console.log("refresh")
    this.setState({refreshing: true});
    this.getMyInfo();
    this.setState({refreshing: false});
  }

  Logout() {
    SQLite.deleteDatabase({name: 'testDB.db'})
    this.dropFCMToken();
    AsyncStorage.removeItem('token');
    //순서 중요
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
       routes: [{ name: 'Logins' },],
     })
   ); // pop everything in stack navigation
    Alert.alert("로그아웃", "정상적으로 로그아웃 되었습니다.",[{text:'확인'}, {style:'cancel'}])
    //순서 중요
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
    this.getMyInfo(); 
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.getToken();
    });
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  getMyInfo = () => {
    api.get(`/users/mypage`,{
      headers: {
        Authorization: this.state.token,
      },
    })
    .then((res) => {
      console.log(res)
      this.state.myName = res.data.user_info.nickname;
      this.state.myLocation = res.data.user_info.location_title;
      this.state.myImage = res.data.user_info.image;
      
      if(res.data.user_info.group != null){
        this.state.myGroup = res.data.user_info.group;
      }else{
        this.state.myGroup = "소속 인증 필요"
      }
      posts = res.data.user_info;

      if(res.data.user_info.company_id != null){
        this.state.company_id = res.data.user_info.company_id;
      }

      this.state.isCompany = res.data.user_info.is_company;
      this.setState({loading: true})
    })
    .catch((err) => {
      console.log("my page err")
      console.log(err.response)
      Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
    })
  }

 
  
  dropFCMToken = async() =>{
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    await api
      .post('/users/remove_device',
      {
        user:{
          device_token: fcmToken
        }
      },
      {
        headers:{
          'Authorization': this.state.token
        }
      }
    )
    .then((response)=>console.log(response))
    .then((error)=>console.log(error))
  }

  partnerCheckNavigate() {
    if(this.state.company_id != null){
      if(this.state.isCompany){
        //navigate to partner_page
        this.props.navigation.navigate('Partner_Page',{company_id:this.state.company_id});
      }
      else{
        this.props.navigation.navigate('Partner_Waiting',{company_id:this.state.company_id});
      }
    }
    else if(this.state.company_id == null) this.props.navigation.navigate('Partner_Apply');
  }

  renderPopover(){
    return(
      <Popover
        isVisible={this.state.show_popover}
        onRequestClose={() => this.setState({ show_popover: false })}
        from={(
          <TouchableOpacity onPress={() => this.setState({ show_popover: true })}>
            <Icon name="menu" />
          </TouchableOpacity>
        )}>
        <TouchableOpacity
          onPress={() => this.setState({ show_popover: false }, () => {
            this.props.navigation.navigate("SettingMyInfo", {post: posts})
          })}>
          <Text style={styles.popoverel}>프로필 수정</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.setState({ show_popover: false }, () => {
            this.props.navigation.push('SettingGroup')
          })}>
          <Text style={styles.popoverel}>소속 인증</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => this.setState({ show_popover: false }, () => {
            this.partnerCheckNavigate()
          })}>
          <Text style={styles.popoverel}>파트너 신청</Text>
        </TouchableOpacity>
        
      </Popover>
    )
  }

  render() {
    if(!this.state.loading) return null
    else{
      return (
        <Container>
          <Header style={{
            height: 60,
            backgroundColor: '#f8f8f8',
          }} androidStatusBarColor='black'>
            <Left><Button transparent></Button></Left>
            <Body>
              <Title style={{fontSize: 20, color: 'black', alignSelf: 'center'}}>마이페이지</Title>
            </Body>
            <Right>
              {this.renderPopover()}
            </Right>
          </Header>

          <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>}>
          <Content>
            <List>
              <ListItem
                thumbnail
                style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: '5%', paddingTop:'3%'}}>
                <TouchableOpacity style={{ flexDirection: 'row' }}>
                  <Thumbnail source={this.state.myImage=='/image/default.png' ? require('../../assets/default.png') :{uri: this.state.myImage}} />
                  <Body style={{ marginLeft : '5%' }}>
                    <View style={{ flexDirection : 'row', width:'60%' }}>
                      <Text numberOfLines={1}>{this.state.myName}</Text>
                      <Text note numberOfLines={1}>
                        {this.state.myGroup}
                      </Text>
                    </View>
                    <View sylte={{ flexDirection: 'row' }}>
                      <Text note numberOfLines={2} style={{ paddingTop: '2%' }}>
                        {this.state.myLocation}
                      </Text>
                    </View>
                    <Button small bordered style={{ position: 'absolute', top:'40%', left : '65%', 
                    backgroundColor: 'white', borderColor: 'black',width:100, justifyContent:'center'}}
                      onPress={() => this.props.navigation.navigate('ProfileShow', {user_id : posts.id})}>
                      <Text style={{ color: 'black',fontWeight:'bold'}}>프로필 보기</Text>
                    </Button>
                  </Body>
                </TouchableOpacity>
              </ListItem>

              <ListItem
                style={{flexDirection: 'row', justifyContent: 'center', height: 100, marginTop: '3%'}}>

                <Button transparent style={styles.btn} onPress={() => { this.props.navigation.navigate('MyItemList') }}>
                  <Icon type="Ionicons" name="file-tray-stacked-outline" style={{ color: 'black' }} />
                  <Text style={{ paddingVertical: '8%', marginBottom: '4%', color: 'black' }}>내 글</Text>
                </Button>

                <Button transparent style={styles.btn}
                  onPress={() => {this.props.navigation.navigate('ProviderRentList')}}>
                  <Icon type="MaterialCommunityIcons" name="receipt" style={{color:'black'}}/>
                  <Text style={{ paddingVertical : '8%', marginBottom: '4%',color:'black' }}>제공자</Text>
                </Button>

                <Button transparent style={styles.btn}
                  onPress={() => {this.props.navigation.navigate('ConsumerRentList')}}>
                  <Icon type="Ionicons" name="basket-sharp" style={{color:'black'}}/>
                  <Text style={{ paddingVertical : '8%', marginBottom: '4%',color:'black' }}>소비자</Text>
                </Button>

              </ListItem>

              <Separator bordered style={{ height: '1%'}}></Separator>

              <ListItem button onPress={() => { {this.props.navigation.navigate('MyPage_Location')} }}>
                <Left>
                  <Icon type="Ionicons" name="location-sharp" />
                  <Text style={styles.listText}> 동네 인증</Text>
                </Left>
                <Right>
                  <Icon type="AntDesign" name="right" />
                </Right>
                </ListItem>

              <ListItem button onPress={() => { this.props.navigation.navigate('Like_List') }}>
                <Left>
                  <Icon type="Ionicons" name="heart" style={{ color: 'black' }} />
                  <Text style={styles.listText}> 관심 목록</Text>
                </Left>
                <Right>
                  <Icon type="AntDesign" name="right" />
                </Right>
              </ListItem>

              <ListItem button onPress={() => { this.props.navigation.navigate("Keyword") }}>
                <Left>
                  <Icon type="Feather" name="bell" />
                  <Text style={styles.listText}> 키워드 알림</Text>
                </Left>
                <Right>
                  <Icon type="AntDesign" name="right" />
                </Right>
              </ListItem>

              <ListItem button onPress={() => { this.props.navigation.navigate('Review') }}>
                <Left>
                  <Icon type="MaterialCommunityIcons" name="comment-outline" />
                  <Text style={styles.listText}> 리뷰 관리</Text>
                </Left>
                <Right>
                  <Icon type="AntDesign" name="right" />
                </Right>
              </ListItem>

                <ListItem button onPress={() => {
                    this.Logout()
                   }}>
                <Left>
                  <Icon type="Ionicons" name="power-sharp" />
                  <Text style={styles.listText}> 로그아웃</Text>
                </Left>
                <Right>
                  <Icon type="AntDesign" name="right" />
                </Right>
              </ListItem>

            </List>
          </Content>
          </ScrollView>
        </Container>
    );}
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
  listText : {
    marginLeft: '3%',
  },
  popoverel: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    margin: 5,
  },
});
export default MypageScreen;
