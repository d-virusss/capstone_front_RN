import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  StatusBar, TextInput,
  TouchableOpacity 
} from "react-native";
import CustomButton from './custom_button';
import { Container, Header, Footer, FooterTab, Badge, Button,Text, Icon,Tabs, Tab, TabHeading, ActionSheet, Root } from 'native-base';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Search_Bar from './search_bar';
import {Overlay} from 'react-native-elements';
import ProvidingList from './providerindex';
import A_F_Rent from './ask_for_rent';
import Example from './categorymodal';
import FootTab from '../shared/bottom_tab'
IconM.loadFont();

var BUTTONS = ["제공 글쓰기", "대여요청 글쓰기", "취소"];
var CANCEL_INDEX = 2;

class PostListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render () {
    return(
      <View style = {{flex : 1, backgroundColor : 'white'}}>
        <View style = {{flex : 1}} >
          <Search_Bar navigation = {this.props.navigation}></Search_Bar>
        </View>
        <Footer>
          <FooterTab>
            <Button vertical onPress={() => this.props.navigation.navigate('PLScreen')}>
              <Icon name="home"/>
              <Text>홈</Text>
            </Button>
            <Root vertical transparent>
              <Button 
                transparent
                vertical 
                style = {{alignSelf : 'center'}}
                onPress = {() =>
                ActionSheet.show(
                  {
                    options: BUTTONS,
                    cancelButtonIndex: CANCEL_INDEX,
                    title: "글쓰기"
                  },
                  buttonIndex => {
                    if (buttonIndex === 0) {
                        this.props.navigation.navigate('P_W_p');
                    }
                    if (buttonIndex === 1) {
                      this.props.navigation.navigate('P_W_c');
                    }
                  },
                )}
              >
                <Icon name="pencil" style = {{color : '#6b6b6b'}}/>
                <Text style = {{fontSize : 14, color : '#6b6b6b'}}>글쓰기</Text>
              </Button>
            </Root>
            <Button badge vertical onPress = {() => {
              this.props.navigation.navigate('Chats')}
            }>
              <Badge ><Text>51</Text></Badge>
              <Icon name="chatbubble" />
              <Text>채팅</Text>
            </Button>
            <Button vertical onPress={() => this.props.navigation.navigate('Logins')}>
              <Icon name="person" />
              <Text>Mypage</Text>
            </Button>
          </FooterTab>
        </Footer>
      </View>
    );
  }
}

export default PostListScreen;