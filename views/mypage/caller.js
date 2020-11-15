import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import BottomTab from '../shared/bottom_tab';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Button,
  Icon,
  Title,
  Text,
  Thumbnail,
  Footer,
  FooterTab,
  Content,
  ListItem,
  List,
  Separator,
} from 'native-base';
import IconA from 'react-native-vector-icons/AntDesign';
import IconB from 'react-native-vector-icons/Feather';
import IconC from 'react-native-vector-icons/EvilIcons';
import api from '../shared/server_address';
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
  };

  goToSetLocation() {
    this.props.navigation.navigate('MyPage_Location');
    console.log('Navigation router run...');
  }

  Logout() {
    console.log(this.props)
    this.props.navigation.navigate('Logins');
  }

  ShowLikeList() {
    this.props.navigation.navigate('Like_List');
  }

  SettingGroup(){
    this.props.navigation.navigate('SettingGroup')
  }

  componentDidMount() {
    console.log('component did mount ---');
    this.getMyInfo();
  }

  showReservation(){
    this.props.navigation.navigate('Reservation')
  }

  showMyItemList(){
    this.props.navigation.navigate('MyItemList')
  }

  getToken = async () => {
    console.log("gettoken")
    let value = await AsyncStorage.getItem("token")
    this.state.token = value
  }

  getMyInfo = async () => {
    this.getToken().then(() => {
      console.log("getmyInfo");
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
        console.log(this.state.myName)
      })
      .catch((err) => {
        console.log("my page err")
      })
    })
  }

  render() {
    if(!this.state.loading) return null
    else{
    return (
      <Container>
        <Header>
          <Body>
            <Title>My Page</Title>
          </Body>
          <Right>
            <TouchableOpacity>
              <Icon name="menu" />
            </TouchableOpacity>
          </Right>
        </Header>

        <Content>
          <List>
            <ListItem
              thumbnail
              style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
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
              style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Button light style={styles.btn}
                onPress={() => {this.goToSetLocation()}}>
                <Icon type="AntDesign" name="home" />
                <Text> 동네 설정</Text>
              </Button>

              <Button light style={styles.btn}>
                <Icon type="Feather" name="settings" />
                <Text> 정보 수정</Text>
              </Button>

              <Button light style={styles.btn} onPress={() => {this.ShowLikeList();}}>
                <Icon type="Feather" name="heart" />
                <Text> 관심 목록</Text>
              </Button>
            </ListItem>

            <Separator bordered></Separator>

            <ListItem button onPress={()=>{this.SettingGroup()}}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text> 소속 인증</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button>
              <Left>
                <Icon type="Feather" name="bell" />
                <Text> 키워드 알림</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem>
              <Left>
                <Icon type="Feather" name="list" />
                <Text> 거래 목록</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => {this.showMyItemList();}}>
              <Left>
                <Icon type="Ionicons" name="file-tray-stacked-outline" />
                <Text> 글 관리</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem>
              <Left>
                <Icon type="EvilIcons" name="comment" />
                <Text> 받은 리뷰</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem button onPress={() => {this.showReservation();}}>
              <Left>
                <Icon type="AntDesign" name="calendar" />
                <Text> 예약 관리</Text>
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
                <Text> 로그아웃</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>
          </List>
        </Content>
        <Button onPress = {()=>{
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
          getFCMToken();
        }}>
          <Text>디버그(fcmtoken)</Text>
        </Button>
        <Button onPress={()=>{
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
        }}>
          <Text>해제</Text>
        </Button>
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
});
export default MypageScreen;
