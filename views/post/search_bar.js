import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import IconM from 'react-native-vector-icons/MaterialIcons';
import {Dimensions,  DeviceEventEmitter,  StyleSheet,  View,  Text,  StatusBar,  TouchableOpacity,} from 'react-native';
import ProvideIndex from './provide_index';
import AskIndex from './ask_index';
import {Button, Container, Tabs, Tab, TabHeading} from 'native-base'
import SearchHeader from 'react-native-search-header';
import Category from './categorymodal';

IconM.loadFont();
//https://www.npmjs.com/package/react-native-search-header
const DEVICE_WIDTH = Dimensions.get('window').width;

class Search_Bar extends React.Component {
  constructor(props) {
    super(props);
    this.searchHeaderRef = React.createRef();
    this.state = {
      search: '',
      suggestion_list: [
        `react-native-search-header`,
        `react-native`,
        `javascript`,
      ],
      location:'',
      category_id: 0,
    };
    this.handlerLongClick = () => {
      //handler for Long Click
      alert('Button Long Pressed');
    };
    this.handlerClick = () => {
      //handler for Long Click
      alert('Button Pressed');
    };
  }

  onPressHandler = (key) => (event) => {
    
  };

  myFunction() {
    this.state.suggestion_list.map((item, index) => {
      return (
        <TouchableOpacity key={index} onPress={this.onPressHandler(index)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      );
    });
  }

  getMyInfo = async() => {
    let location = await AsyncStorage.getItem("myLocation")
    this.setState({location : location})
  }

  componentDidMount(){
    this.myFunction();
    this.getMyInfo();
  }

  makeCategoryRequest(id){
    this.setState({category_id : id});
    DeviceEventEmitter.emit('categoryId', {id : id});
  }

  render() {
    return (
      <View style = {{flex : 1}}>
        <StatusBar barStyle="light-content" />
        <View style={styles.status} />
        <View style={styles.header}>
          <Button transparent>
            <IconM name = 'search' size = {25} style={{opacity : 0}}/>
          </Button>
          <Button
            transparent
            style = {{alignSelf : 'center'}}
          >
            <Text style = {{fontSize : 25, color: 'white', fontWeight:'500'}}>{this.state.location}</Text>
          </Button>
          <Button
            transparent
            style = {{alignSelf : 'center'}}
            onPress={() => this.searchHeaderRef.current.show()}
          >
            <IconM name = 'search' size = {30} style = {{margin : '1%'}}/>
          </Button>
        </View>
        <SearchHeader
          topOffset = {40}
          ref={this.searchHeaderRef}
          placeholder="Search..."
          placeholderColor="gray"
          pinnedSuggestions={this.state.suggestion_list}
          onClear={() => {
            console.log(`Clearing input!`);
          }}
          onSearch={(event) => {
            console.log(event.nativeEvent.text);
          }}
          onGetAutocompletions={async (text) => {
            //console.log('text : ' + text);
            // if (text) {
            //   const response = await fetch(
            //     `http://suggestqueries.google.com/complete/search?client=firefox&q=${text}`,
            //     {
            //       metho원: `get`,
            //     },
            //   );
            //   const data = await response.json();
            //   return data[1];
            // } else {
            //   return [];
            // }
          }}
        />

        <Category style={{ marginLeft: '40%' }} parentReference = {this.makeCategoryRequest.bind(this)}/>

        <Container>
          <Tabs style={{marginTop : '0%',}}>
            <Tab heading={ <TabHeading transparent><Text>제공</Text></TabHeading>}>
              <ProvideIndex navigation = {this.props.navigation}/>
            </Tab>
            <Tab heading={ <TabHeading transparent><Text>대여</Text></TabHeading>}>
              <AskIndex navigation={this.props.navigation}></AskIndex>
            </Tab>
          </Tabs>
        </Container>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  status: {
    zIndex: 10,
    elevation: 2,
    width: DEVICE_WIDTH,
    height: 30,
    backgroundColor: '#ff3377',
  },
  header: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: 56,
    backgroundColor: '#ff3377',
    flexDirection : 'row',
    paddingVertical: '8.5%'
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 40,
    marginTop: 40,
    borderRadius: 2,
    backgroundColor: `#ff5722`,
  },
});

export default Search_Bar;