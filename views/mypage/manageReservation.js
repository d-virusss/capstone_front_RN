
import React, {Component} from 'react';
import {TouchableOpacity, View, StyleSheet, DeviceEventEmitter,} from 'react-native';
import {Text, Header, Icon, Body, Container, Content, Left, 
  Right, Title, Tabs, Tab, TabHeading, Footer, Button } from 'native-base';
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
        <Header>
          <Left>
            <TouchableOpacity transparent onPress = {() => this.props.navigation.goBack()}>
              <Icon name = 'chevron-back' type = 'Ionicons'/>
            </TouchableOpacity>
          </Left>
          <Body><Title>예약 관리</Title></Body>
          <Right>
            <TouchableOpacity transparent onPress = {() => this.onRefresh()}>
              <Icon name = 'refresh' type = 'Ionicons'/>
            </TouchableOpacity>
          </Right>
        </Header>

        <Content>
          <Tabs Style={{marginTop : '0%',}}>
            <Tab heading={ <TabHeading transparent><Text>받은 예약</Text></TabHeading>}>
            <ReceiveList navigation={this.props.navigation}></ReceiveList>
          </Tab>
            <Tab heading={ <TabHeading transparent><Text>신청한 예약</Text></TabHeading>}>
            <SendList navigation={this.props.navigation}></SendList>
            </Tab>
          </Tabs>
        </Content>
        {/* <Footer>
          <Button><Text>dfasdf</Text></Button>
        </Footer> */}
      </Container>
    )
  };
};


const styles = StyleSheet.create({
 
 });

export default reservationScreen;