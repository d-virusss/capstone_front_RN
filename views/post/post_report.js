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

class PostReportScreen extends Component {
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

  render() {
    const uri =
      'https://facebook.github.io/react-native/docs/assets/favicon.png';

    return (
      <Container>
        <Content>
          <List>
          <ListItem
              button
              onPress={()=>{this.SettingGroup()}}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text> 사용자 신고</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <Separator bordered></Separator>

            <ListItem
              button
              onPress={()=>{this.SettingGroup()}}>
              <Left>
                <Icon type="AntDesign" name="addusergroup" />
                <Text> 신고 이유1</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem noIndent style={{backgroundColor: '#cde1f9'}}>
              <Left>
                <Icon type="Feather" name="bell" />
                <Text> 이유2</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem>
              <Left>
                <Icon type="Feather" name="list" />
                <Text> 이유3</Text>
              </Left>
              <Right>
                <Icon type="AntDesign" name="right" />
              </Right>
            </ListItem>

            <ListItem
              button
              onPress={() => {
                this.Logout();
              }}>
              <Left>
                <Icon type="AntDesign" name="logout" />
                <Text> 이유4</Text>
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
export default PostReportScreen;
