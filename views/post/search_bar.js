import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import {Dimensions,  DeviceEventEmitter,  StyleSheet, Text,} from 'react-native';
import ProvideIndex from './provide_index';
import AskIndex from './ask_index';
import {Container, Tabs, Tab, TabHeading, Header, Item, Icon, Input, Title} from 'native-base'
import Category from './categorymodal';

const DEVICE_WIDTH = Dimensions.get('window').width;

class Search_Bar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      location:'',
      category_id: 0,
    };
  }


  getMyInfo = async() => {
    let location = await AsyncStorage.getItem("my_location")
    console.log("get my location=-----------------")
    console.log(location)
    this.setState({location : location})
  }

  componentDidMount(){
    this.getMyInfo();
  }

  makeCategoryRequest(id){
    this.setState({category_id : id});
    DeviceEventEmitter.emit('categoryId', {id : id});
  }

  render() {
    return (
        <Container>
        <Header style={styles.header}>
            <Title style={{fontSize: 20, color: 'white'}}>{this.state.location}</Title>
        </Header>

          <Item style={{backgroundColor:'#ffffff', marginLeft: '4%', borderColor: 'transparent' }}>
            <Icon name="ios-search" />
            <Input placeholder="Search" />
            <Category style={styles.category} parentReference = {this.makeCategoryRequest.bind(this)}/>
          </Item>

        

          <Tabs style={{marginTop : '0%',}}>
            <Tab heading={ <TabHeading transparent><Text>제공</Text></TabHeading>}>
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
    height: 40,
    backgroundColor: '#ff3377',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent'
  },
  categoty:{
    marginLeft: '40%', 
  }
});

export default Search_Bar;
