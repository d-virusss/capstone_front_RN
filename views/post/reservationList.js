
import React, {Component} from 'react';
import {TouchableOpacity, View, StyleSheet, DeviceEventEmitter,} from 'react-native';
import {Text, Header, Icon, Body, Container, Content, Left, 
  Right, Title, Tabs, Tab, TabHeading, Footer, Button, FooterTab } from 'native-base';
import IconM from 'react-native-vector-icons/Ionicons'
import ReceiveList from '../mypage/reservationReceive'
IconM.loadFont()

class reservationListScreen extends Component{

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
          <Body><Title>예약 목록 확인</Title></Body>
          <Right>
            <TouchableOpacity transparent onPress = {() => this.onRefresh()}>
              <Icon name = 'refresh' type = 'Ionicons'/>
            </TouchableOpacity>
          </Right>
        </Header>
          
        <FooterTab scrollEnabled={false}>
            <ReceiveList navigation={this.props.navigation}></ReceiveList>
        </FooterTab>
         

      </Container>
        
      )
    
  };
};


const styles = StyleSheet.create({
 
 });

export default reservationListScreen;