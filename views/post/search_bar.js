import React from 'react';
import IconM from 'react-native-vector-icons/MaterialIcons';
import {
  Dimensions,
  AppRegistry,
  StyleSheet,
  View,
  Text,
  Button,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import SearchHeader from 'react-native-search-header';
IconM.loadFont();
//https://www.npmjs.com/package/react-native-search-header
const DEVICE_WIDTH = Dimensions.get('window').width;

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
    height: 21,
    backgroundColor: '#0097a7',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    width: DEVICE_WIDTH,
    height: 56,
    marginBottom: 6,
    backgroundColor: '#00bcd4',
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
    console.log('here : ' + key + event);
  };

  myFunction() {
    this.state.suggestion_list.map((item, index) => {
      console.log('!!!' + item + index);
      return (
        <TouchableOpacity key={index} onPress={this.onPressHandler(index)}>
          <Text>{item}</Text>
        </TouchableOpacity>
      );
    });
  }

  render() {
    // console.log(this.state.suggestion_list);
    this.myFunction();
    return (
      <View>
        <StatusBar barStyle="light-content" />
        <View style={styles.status} />
        <View style={styles.header}>
          <Button
            title="Search"
            color="#f5fcff"
            onPress={() => this.searchHeaderRef.current.show()}
          />
        </View>
        <SearchHeader
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
            //       method: `get`,
            //     },
            //   );
            //   const data = await response.json();
            //   return data[1];
            // } else {
            //   return [];
            // }
          }}
        />
      </View>
    );
  }
}
export default Search_Bar;