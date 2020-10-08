import React, {Component} from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
//find example of image-crop-picker
class ImageSelect extends Component{
  render(){
    return(
      <View>
          <TouchableOpacity 
          onPress = {
            () => {
              ImagePicker.openPicker({
                multiple: true
              }).then(images => {
                console.log(images);
              });
            }
          }
          >

          </TouchableOpacity>
      </View>
    );
  }
} 

export default ImageSelect;