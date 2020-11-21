import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Dimensions,  DeviceEventEmitter,  StyleSheet, Text, TextInput} from 'react-native';
import ProvideIndex from './provide_index';
import AskIndex from './ask_index';
import {Container, Tabs, Tab, TabHeading, Header, Item, Icon, Title, Input} from 'native-base'
import Category from './categorymodal';
import api from '../shared/server_address';
import IconI from 'react-native-vector-icons/Ionicons';

const DEVICE_WIDTH = Dimensions.get('window').width;
IconI.loadFont();

class Search_Bar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      location:'',
      category_id: 0,
      token:'',
    };
  }


  getMyInfo = async() => {
    let location = await AsyncStorage.getItem("my_location");
    let token = await AsyncStorage.getItem("token");
    this.setState({location : location, token : token})
  }

  componentDidMount(){
    this.getMyInfo();
  }

  makeCategoryRequest(id){
    this.setState({category_id : id});
    if(id == 0){
      DeviceEventEmitter.emit('categoryId', {id : ''});
    }
    else{
      DeviceEventEmitter.emit('categoryId', {id : id});
    }
   
  }

  searchRequest() {
    DeviceEventEmitter.emit('searchContent', {search : this.state.search});
  }

  clear(){
    this.textInput._root.clear();
    this.state.search = '';
    DeviceEventEmitter.emit('searchContent', {search : this.state.search});
  }

  render() {
    return (
        <Container>
          <Header style={styles.header}>
              <Title style={{fontSize: 20, color: 'white', alignSelf: 'center'}}>{this.state.location}</Title>
          </Header>

          <Item style={{backgroundColor:'#ffffff',borderColor: 'transparent' }}>
            <Item style={{width : DEVICE_WIDTH*0.7, marginLeft: '4%', borderColor: 'transparent'}}>
              <Icon name="ios-search" onPress = {() => this.searchRequest()}/>
              <Input placeholder="Search" onChangeText = {(content) => this.state.search = content}
              ref={input => { this.textInput = input }}/>
              <Icon name="close" type="Ionicons" onPress={() => this.clear()}/>
            </Item>
            <Item style={{ marginLeft: '3%', borderColor: 'transparent'}}>
            <Category parentReference = {this.makeCategoryRequest.bind(this)}/>
            </Item>
          </Item>
        

          <Tabs style={{marginTop : '0%',}}>
            <Tab heading={ <TabHeading transparent><Text>제공</Text></TabHeading>}
            style={{ color: '#ff3377' }}>
              <ProvideIndex navigation = {this.props.navigation}/>
            </Tab>
            <Tab heading={ <TabHeading transparent><Text>대여</Text></TabHeading>}>
              <AskIndex navigation={this.props.navigation}></AskIndex>
            </Tab>
          </Tabs>
        </Container>

    );
  }
}

const styles = StyleSheet.create({

  header: {
    width: DEVICE_WIDTH,
    height: 60,
    backgroundColor: '#ff3377',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },
});

export default Search_Bar;
