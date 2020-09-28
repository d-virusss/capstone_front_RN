import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  StatusBar, TextInput, 
} from "react-native";
import CustomButton from './custom_button';
import { Container, Header, Content, Form, Item, Input, Footer, FooterTab, Badge, Button,Text, Icon } from 'native-base';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
//import TabBottom from './tab';
IconM.loadFont();

class PostListScreen extends Component {
  render () {
    return(
      <View style = {{flex : 1}}>
        <View style = {{flex : 1, alignItems : 'center',}}>
          <View style = {{height : '20%'}}>
            <Text>Im a search bar</Text>
          </View>
          <View style = {{width : '90%', height : '40%', flexDirection : 'row',}}>
            <Button vertical style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%'}}>
              <IconM name = 'dishwasher'/>
            </Button>
            <Button vertical style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%'}}>
              <IconM name = 'dishwasher'/>
            </Button>
            <Button vertical style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%'}}>
              <IconM name = 'dishwasher'/>
            </Button>
            <Button vertical style = {{width : '22%', height : '80%', alignSelf : 'center', marginLeft : '2%'}}>
              <IconM name = 'dishwasher'/>
            </Button>
          </View>
          <View style = {{width : '90%', height : '40%', flexDirection : 'row'}}>
          <Button vertical style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%'}}>
              <IconM name = 'dishwasher'/>
            </Button>
            <Button vertical style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%'}}>
              <IconM name = 'dishwasher'/>
            </Button>
            <Button vertical style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%'}}>
              <IconM name = 'dishwasher'/>
            </Button>
            <Button vertical style = {{width : '22%', height : '80%', alignSelf : 'center', marginLeft : '2%'}}>
              <IconM name = 'dishwasher'/>
            </Button>
          </View>
      </View>
      <View style = {{flex : 2, justifyContent : 'center'}}>
          <Text style = {{textAlign : 'center', fontSize : 25}}>List</Text>
      </View>
      <Footer>
          <FooterTab>
            <Button vertical onPress={() => this.props.navigation.navigate('PLScreen')}>
              <Icon name="newspaper"/>
              <Text>리스트</Text>
            </Button>
            <Button vertical onPress = {() => this.props.navigation.navigate('Logins')}>
              <Icon name="pencil" />
              <Text>글쓰기</Text>
            </Button>
            <Button badge vertical onPress = {() => this.props.navigation.navigate('Logins')}>
              <Badge ><Text>51</Text></Badge>
              <Icon name="chatbubble" />
              <Text>채팅</Text>
            </Button>
            <Button vertical onPress = {() => this.props.navigation.navigate('Logins')}>
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