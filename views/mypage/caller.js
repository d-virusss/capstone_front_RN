import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
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
  Card,
  CardItem,
} from 'native-base';
import IconA from 'react-native-vector-icons/AntDesign';
import IconB from 'react-native-vector-icons/Feather';
import IconC from 'react-native-vector-icons/EvilIcons';
IconA.loadFont();
IconB.loadFont();
IconC.loadFont();

class InitMypageScreen extends Component {
  render() {
    const uri =
      'https://facebook.github.io/react-native/docs/assets/favicon.png';

    const goToSetLocation = () => {
      this.props.navigation.navigate('MyPage_Location');
      console.log('Navigation router run...');
    };

    const Logout = () => {
      this.props.navigation.navigate('Logins');
    };

    const ShowLikeList = () => {
      this.props.navigation.navigate('Like_List');
    };

    return (
      <Container>
        <Header>
          <Body>
            <Title>My Page</Title>
          </Body>
          <Right>
            <Button transparent>
              <Icon name="menu" />
            </Button>
          </Right>
        </Header>

        <Content>
          <List>
            <ListItem
              thumbnail
              style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
              <Thumbnail source={{uri: uri}} />
              <View>
                <Body>
                  <Text>user1</Text>
                  <Text note numberOfLines={1}>
                    group
                  </Text>
                  <Text note numberOfLines={2}>
                    location
                  </Text>
                </Body>
              </View>
              <View></View>
            </ListItem>

            <ListItem
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Button light style={styles.btn}>
                <Icon type="AntDesign" name="home" />
                <Text> 동네 설정</Text>
              </Button>

              <Button light style={styles.btn}>
                <Icon type="Feather" name="settings" />
                <Text> 정보 수정</Text>
              </Button>

              <Button
                light
                style={styles.btn}
                onPress={() => {
                  ShowLikeList();
                }}>
                <Icon type="Feather" name="heart" />
                <Text> 관심 목록</Text>
              </Button>
            </ListItem>

            <Separator bordered></Separator>
            <ListItem
              button
              onPress={() => {
                goToSetLocation();
              }}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text> 소속 인증</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem noIndent style={{backgroundColor: '#cde1f9'}}>
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

            <ListItem>
              <Left>
                <Icon type="EvilIcons" name="comment" />
                <Text> 받은 리뷰</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem
              button
              onPress={() => {
                Logout();
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

        <Footer>
          <FooterTab>
            <View style={{flex: 1, backgroundColor: 'white'}}>
              <BottomTab navigation={this.props.navigation}></BottomTab>
            </View>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'transparent',
  },
});
export default InitMypageScreen;
