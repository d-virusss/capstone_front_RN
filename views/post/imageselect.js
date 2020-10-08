import React, {Component} from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { View, Image } from 'react-native';
//find example of image-crop-picker
class ImageSelect extends Component{
  constructor(props){
    super(props)
    this.state={
      image : ""
    }
  }
  doPickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image);
      this.setState({image : image.path})
    });
  }
  render(){
    return(
      <View style ={{flex : 1}}>
          <TouchableOpacity 
          style = {{width : 100, height : 100,}}
          onPress = {
            () => this.doPickImage()
          }
          >
            {this.state.image != ''&& (
            <Image source={{ uri: this.state.image}} style = {{widht : 100, height: 100}}/>
            )}
          </TouchableOpacity>
      </View>
    );
  }
} 

export default ImageSelect;