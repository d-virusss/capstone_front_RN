import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

export default class CustomButton extends Component{
  static defaultProps = {
    title: 'untitled',
    buttonColor: '#000',
    titleColor: '#fff',
    onPress: () => null,
    alignItems : 'center',
    justifyContent : 'center',
    margintBottom : null,
    borderRadius : 5,
    fontSize : 20,
    flex : null,
    width : null,
    height : null,
  }

  constructor(props){
    super(props);
  }

  render(){
    return (
      <TouchableOpacity style={[
        {alignItems : this.props.alignItems,
        justifyContent : this.props.justifyContent,
        marginBottom : this.props.marginBottom,
        borderRadius : this.props.borderRadius,
        backgroundColor: this.props.buttonColor,
        flex : this.props.flex,
        width : this.props.width,
        height : this.props.height,
        }
      ]}
      onPress={this.props.onPress}>
        <Text style={[
            {   
                color: this.props.titleColor,
                fontSize : this.props.fontSize
            }
        ]}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }
}