import React, {Component} from 'react';
import {StyleSheet, Platform, View, Text, Button, Alert} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
// import {Icon} from 'native-base';

export default class MainScreen extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      e_mail: '',
      pw: '',
      nickname: '',
      region: '',
      phone: '',
    };
  }

  _submit_mail(event) {
    let temp = this.state.e_mail;
    console.log('temp : ' + temp);
  }

  _check_avail_pw(event) {
    let temp = this.state.pw;
    console.log('temp : ' + temp);
  }

  _submit_nickname(event) {
    let temp = this.state.nickname;
    console.log('temp : ' + temp);
  }

  _find_region(event) {
    let temp = this.state.region;
    console.log('temp : ' + temp);
  }

  _submit_phoneNum(event) {
    let temp = this.state.phone;
    console.log('temp : ' + temp);
  }

  render() {
    console.log(this.state.e_mail);

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.bigBlue}>모두나눔</Text>
        </View>

        <View style={styles.backgroundImage}>
          {/* email */}
          <TextInput
            ref="e_mail"
            style={styles.textInput}
            placeholder="Enter your e-mail"
            onChangeText={(e_mail) => this.setState({e_mail})}
            value={this.state.e_mail}
          />
          <Button title="submit" onPress={this._submit_mail.bind(this)} />

          {/* pw */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter password"
            onChangeText={(pw) => this.setState({pw})}
          />
          <Button title="submit" onPress={this._check_avail_pw.bind(this)} />

          <TextInput
            style={styles.textInput}
            placeholder="Check password"
            onChangeText={(pw) => this.setState({pw})}
            //비밀번호 맞는지 다시 확인ㄴ
          />

          {/* nickname */}
          <TextInput
            style={styles.textInput}
            placeholder="Enter nickname"
            onChangeText={(nickname) => this.setState({nickname})}
          />
          <Button title="submit" onPress={this._submit_nickname.bind(this)} />

          {/* region */}
          <TextInput
            style={styles.textInput}
            placeholder="find region"
            onChangeText={(region) => this.setState({region})}
          />
          <Button title="submit" onPress={this._find_region.bind(this)} />

          {/* phone */}
          <TextInput
            style={styles.textInput}
            placeholder="input your password"
            onChangeText={(phone) => this.setState({phone})}
          />
          <Button title="submit" onPress={this._submit_phoneNum.bind(this)} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bigBlue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 30,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    flexDirection: 'column',
  },
  textInput: {
    alignItems: 'stretch',
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderLeftWidth: 3,
    height: 50,
    borderColor: 'black',
  },
});
