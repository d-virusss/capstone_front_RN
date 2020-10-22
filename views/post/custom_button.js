import React, {Component} from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

export default class CustomButton extends Component {
  static defaultProps = {
    title: 'untitled',
    titleColor: '#fff',
    onPress: () => null,
    alignItems: 'center',
    justifyContent: 'center',
    margintBottom: null,
    borderRadius: 5,
    fontSize: 20,
    flex: null,
    width: null,
    height: null,
    marginRight: null,
    marginLeft: null,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TouchableOpacity
        style={[
          {
            alignItems: this.props.alignItems,
            justifyContent: this.props.justifyContent,
            marginBottom: this.props.marginBottom,
            borderRadius: this.props.borderRadius,
            backgroundColor: this.props.buttonColor,
            flex: this.props.flex,
            width: this.props.width,
            height: this.props.height,
            marginRight: this.props.marginRight,
            marginLeft: this.props.marginLeft,
          },
        ]}
        onPress={this.props.onPress}>
        <Text
          style={[
            {
              color: this.props.titleColor,
              fontSize: this.props.fontSize,
            },
          ]}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    );
  }
}
