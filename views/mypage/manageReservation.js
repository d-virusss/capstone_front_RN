
import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, DeviceEventEmitter,} from 'react-native';
import {Text, Header, Icon, Body, Container, Left, 
  Right, Title, Tabs, Tab, TabHeading, Footer, FooterTab } from 'native-base';
import IconM from 'react-native-vector-icons/Ionicons'
import ReceiveList from './reservationReceive'
import SendList from './reservationSend'
IconM.loadFont()

class reservationScreen extends Component{

  makeRefreshRequest(){
    DeviceEventEmitter.emit('refreshList');
  }

  onRefresh(){
    console.log("상태 refresh")
    this.makeRefreshRequest();
  }

  render(){
    return(
      <Container>
        <Header style={{
            height: 60,
            backgroundColor: '#f8f8f8',
            justifyContent:'space-between'}}
            androidStatusBarColor='#000'
        >
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title style={{ fontSize: 20 }}>예약 관리</Title></Body>
          <Right>
            <TouchableOpacity transparent onPress = {() => this.onRefresh()}>
              <Icon name = 'refresh' type = 'Ionicons'/>
            </TouchableOpacity>
          </Right>
        </Header>
          
        <Tabs Style={{marginTop : '0%',}}>
          <Tab heading={ <TabHeading transparent><Text>받은 예약</Text></TabHeading>}>
            <FooterTab scrollEnabled={false}>
                <ReceiveList navigation={this.props.navigation}></ReceiveList>
            </FooterTab>
          </Tab>
          <Tab heading={ <TabHeading transparent><Text>신청한 예약</Text></TabHeading>}>
            <Footer>
              <SendList navigation={this.props.navigation}></SendList>
            </Footer>
          </Tab>
        </Tabs>

      </Container>
        
      )
    
  };
};


const styles = StyleSheet.create({
 
 });

export default reservationScreen;