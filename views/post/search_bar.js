import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Dimensions,  DeviceEventEmitter,  StyleSheet, Text, TextInput} from 'react-native';
import ProvideIndex from './provide_index';
import AskIndex from './ask_index';
import {Container, Tabs, Tab, TabHeading, Header, Item, Icon, Title, Input} from 'native-base'
import Category from './categorymodal';
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
    this.eventListener = DeviceEventEmitter.addListener('updateMypage', this.updateEventHandler);
  }

  updateEventHandler = (e) => {
		console.log("listen update mypage event")
		this.setState({location : e.location})
	}

  componentWillUnmount() {
    //remove listener
    this.eventListener.remove();
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
            <Title style={{fontSize: 20, color: 'black',alignSelf: 'center', fontWeight: '500'}}>{this.state.location}</Title>
        </Header>

        <Item style={{backgroundColor:'#ffffff',borderColor: '#aaaaaa' }}>
          <Item style={{width : DEVICE_WIDTH*0.7, marginLeft: '4%', borderColor: 'transparent'}}>
            <Icon name="ios-search"/>
            <Input placeholder="Search" onChangeText = {(content) => this.state.search = content}
            onSubmitEditing={() => this.searchRequest()}
            ref={input => { this.textInput = input }}/>
            <Icon name="close" type="Ionicons" onPress={() => this.clear()}/>
          </Item>
          <Item style={{ marginLeft: '3%', borderColor: 'transparent'}}>
          <Category parentReference = {this.makeCategoryRequest.bind(this)}/>
          </Item>
        </Item>
      

        <Tabs tabBarUnderlineStyle={{backgroundColor:'#ff3377'}} style={{marginTop : '0%',}}>
          <Tab heading="대여" activeTextStyle={{ color: '#ff3377' }} tabStyle={{ backgroundColor:'white' }}>
            <ProvideIndex navigation = {this.props.navigation}/>
          </Tab>
          <Tab heading="요청" activeTextStyle={{ color: '#ff3377' }} tabStyle={{ backgroundColor: 'white' }}>
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
    backgroundColor: '#f8f8f8f8',
    borderBottomColor: '#aaaaaa',
    borderTopColor: 'transparent'
  },
});

export default Search_Bar;
