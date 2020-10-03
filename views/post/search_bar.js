import { SearchBar } from 'react-native-elements';
import React from 'react';
import IconM from 'react-native-vector-icons/MaterialIcons';
IconM.loadFont();

class Search_Bar extends React.Component {
  state = {
    search: '',
  };

  updateSearch = (search) => {
    this.setState({ search });
  };

  render() {
    const { search } = this.state;

    return (
      <SearchBar
        placeholder="검색"
        onChangeText={this.updateSearch}
        value={search}
        platform = 'default'
        lightTheme = {true}
        containerStyle = {{backgroundColor : 'white', borderRadius : 20, shadowColor : 'gray', shadowRadius : 2, shadowOpacity : 0.5,shadowOffset: { width: 0, height: 2 },}}
        inputContainerStyle = {{backgroundColor : 'white'}}
        searchIcon = {{name : 'search', size : 30}}
      />
    );
  }
}
export default Search_Bar;