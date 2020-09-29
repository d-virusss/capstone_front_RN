import React, { Component, Fragment } from "react";
import {
  StyleSheet,
  View,
  StatusBar, TextInput, 
} from "react-native";
import CustomButton from './custom_button';
import { Container, Header, Content, Form, Item, Input, Footer, FooterTab, Badge, Button,Text, Icon,Tabs, Tab, TabHeading } from 'native-base';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import Search_Bar from './search_bar';
import ProvidingList from './providerindex';
import A_F_Rent from './ask_for_rent';
IconM.loadFont();

class PostListScreen extends Component {
  render () {
    return(
      <View style = {{flex : 1, backgroundColor : 'white'}}>
        <View style = {{flex : 3, alignItems : 'center', }}>
          <View style = {{width : '95%', height : '30%', marginTop : '2%'}}>
            <Search_Bar style={{width : '100%',}}></Search_Bar>
          </View>
          <View style = {{width : '90%', height : '35%', flexDirection : 'row',}}>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', justifyContent : 'center'}}>
              <IconM name = 'dishwasher' size = {60}/>
              <Text style = {{color : '#000'}}>가전</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'tent' size = {60}/>
              <Text style = {{color : '#000'}}>캠핑</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'fish' size = {60}/>
              <Text style = {{color : '#000'}}>낚시</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{width : '22%', height : '80%', alignSelf : 'center', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'bread-slice' size = {60}/>
              <Text style = {{color : '#000'}}>제빵</Text>
            </Button>
          </View>
          <View style = {{width : '90%', height : '35%', flexDirection : 'row'}}>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', justifyContent : 'center'}}>
              <IconM name = 'gamepad-variant-outline' size = {60}/>
              <Text style = {{color : '#000'}}>게임</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'camera' size = {60}/>
              <Text style = {{color : '#000'}}>카메라</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginRight : '2%', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'bike' size = {60}/>
              <Text style = {{color : '#000'}}>자전거</Text>
            </Button>
            <Button onPress = {() => this.props.navigation.navigate('C_index')}vertical transparent style = {{ width : '22%', height : '80%', alignSelf : 'center', marginLeft : '2%', justifyContent : 'center'}}>
              <IconM name = 'tablet-ipad' size = {60}/>
              <Text style = {{color : '#000'}}>패드</Text>
            </Button>
          </View>
      </View>
      <View style = {{flex : 5,}}>
        <View style={{flex:1}}>
          <Container>
            <Tabs style={{marginTop : '2%',}}>
              <Tab heading={ <TabHeading transparent><Icon name="camera" /><Text>제공</Text></TabHeading>}>
                <ProvidingList></ProvidingList>
              </Tab>
              <Tab heading={ <TabHeading transparent><Text>대여</Text></TabHeading>}>
                <A_F_Rent></A_F_Rent>
              </Tab>
            </Tabs>
          </Container>
        </View>
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