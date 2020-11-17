import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity, RefreshControl, ScrollView} from 'react-native';
import BottomTab from '../shared/bottom_tab';
import { Container, Header, Left, Body, Right, Button, Icon, Title, Text, Thumbnail,
       Footer, FooterTab, Content, ListItem, List, Separator } from 'native-base';
import IconA from 'react-native-vector-icons/AntDesign';
import IconB from 'react-native-vector-icons/Feather';
import IconC from 'react-native-vector-icons/EvilIcons';
import api from '../shared/server_address';
import { CommonActions, StackActions } from '@react-navigation/native';
IconA.loadFont();
IconB.loadFont();
IconC.loadFont();

class MypageScreen extends Component {
  state = {
    token:'',
    myName:'',
    myLocation:'',
    myGroup:'',
    myImage:'',
    loading: false,
    refreshing : '',
  };

  _onRefresh = () => {
   
    console.log("refresh")
    this.setState({refreshing: true});
    this.getMyInfo();
    this.setState({refreshing: false});
  }

  goToSetLocation() {
    this.props.navigation.push('MyPage_Location');
  }

  Logout() {
    this.props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [{ name: 'Logins' },],
      })
    );
    //this.props.navigation.dispatch(StackActions.popToTop())

    // pop everything in stack navigation
  }

  ShowLikeList() {
    this.props.navigation.navigate('Like_List');
  }

  SettingGroup(){
    this.props.navigation.navigate('SettingGroup')
  }

  componentDidMount() {
    this.getMyInfo();
  }

  showReservation(){
    this.props.navigation.navigate('Reservation')
  }

  showMyItemList(){
    this.props.navigation.navigate('MyItemList')
  }

  getToken = async () => {
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  getMyInfo = () => {
    this.getToken().then(() => {

      api.get(`/users/mypage`,{
        headers: {
          Authorization: this.state.token,
        },
      })
      .then((res) => {
        this.state.myName = res.data.user_info.nickname;
        this.state.myLocation = res.data.user_info.location_title;
        this.state.myImage = res.data.user_info.image;
        this.state.myGroup = "ajou"
        this.setState({loading: true})

      })
      .catch((err) => {
        console.log("my page err")
        Alert.alert("요청 실패", err.response.data.error,[{text:'확인', style:'cancel'}])
      })
    })
  }

  getFCMToken = async() =>{
    let fcmToken = await AsyncStorage.getItem('fcmToken')
    await api
      .post('/users/add_device',
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
  
  render() {
    if(!this.state.loading) return null
    else{
    return (
      <Container>
        <Header>
          <Body>
            <Title>마이 페이지</Title>
          </Body>
          <Right>
            <TouchableOpacity>
              <Icon name="menu" />
            </TouchableOpacity>
          </Right>
        </Header>

        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh}/>}>
        <Content>
          <List>
            <ListItem
              thumbnail
              style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start', marginLeft: '5%', paddingTop:'3%'}}>
              <Thumbnail source={{uri: this.state.myImage}} />
              <View>
                <Body>
                  <Text>{this.state.myName}</Text>
                  <Text note numberOfLines={1}>
                    {this.state.myGroup}
                  </Text>
                  <Text note numberOfLines={2}>
                    {this.state.myLocation}
                  </Text>
                </Body>
              </View>
              <View></View>
            </ListItem>

            <ListItem
              style={{flexDirection: 'row', justifyContent: 'center', height: 100}}>
              <Button light style={styles.btn}
                onPress={() => {this.goToSetLocation()}}>
                <Icon type="AntDesign" name="home" />
                <Text style={{ paddingVertical : '8%', marginBottom: '4%' }}> 동네 설정</Text>
              </Button>

              <Button light style={styles.btn}>
                <Icon type="Feather" name="settings" />
                <Text style={{ paddingVertical : '8%', marginBottom: '4%' }}> 정보 수정</Text>
              </Button>

              <Button light style={styles.btn} onPress={() => {this.ShowLikeList();}}>
                <Icon type="Feather" name="heart" />
                <Text style={{ paddingVertical : '8%', marginBottom: '4%' }}> 관심 목록</Text>
              </Button>
            </ListItem>

            <Separator bordered></Separator>

            <ListItem button onPress = {()=>{this.getFCMToken();}}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text style={ styles.listText }> 기기 인증</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={()=>{this.SettingGroup()}}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text style={ styles.listText }> 소속 인증</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button>
              <Left>
                <Icon type="Feather" name="bell" />
                <Text style={ styles.listText }> 키워드 알림</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem>
              <Left>
                <Icon type="Feather" name="list" />
                <Text style={ styles.listText }> 거래 목록</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => {this.showMyItemList();}}>
              <Left>
                <Icon type="Ionicons" name="file-tray-stacked-outline" />
                <Text style={ styles.listText }> 내 글 관리</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem>
              <Left>
                <Icon type="EvilIcons" name="comment" />
                <Text style={ styles.listText }> 받은 리뷰</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => {this.showReservation();}}>
              <Left>
                <Icon type="AntDesign" name="calendar" />
                <Text style={ styles.listText }> 예약 관리</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => {
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
              dropFCMToken();
              this.Logout();
            }}>
              <Left>
                <Icon type="AntDesign" name="logout" />
                <Text style={ styles.listText }> 로그아웃</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>
          </List>
        </Content>
        </ScrollView>

        <Footer>
          <FooterTab>
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <BottomTab navigation={this.props.navigation}></BottomTab>
            </View>
          </FooterTab>
        </Footer>
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
  }
});
export default MypageScreen;
