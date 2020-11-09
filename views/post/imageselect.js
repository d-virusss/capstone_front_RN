import React, {Component} from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImagePicker from 'react-native-image-crop-picker';
import { View, Image } from 'react-native';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
IconM.loadFont();

//find example of image-crop-picker
class ImageSelect extends Component{
  constructor(props){
    super(props)
    this.state={
      image : this.props.existing_image===undefined ? "" : this.props.existing_image,
    }
  }

  componentDidMount(){
    console.log(this.state)
    console.log('in imageselect')
  }

  doPickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      this.setState({ image: image.sourceURL })
      this.props.stateBus(image)
    });
  }

  render(){
    return(
      <View style ={{flex : 1, justifyContent : 'center'}} >
          <TouchableOpacity 
          style = {{flex : 1, justifyContent : 'center'}}
          onPress = { () => this.doPickImage() } >
            {this.state.image == ''&& (
              <IconM name = 'image-multiple' size = {100}/>
            )}
            {this.state.image != ''&& (
            <Image source={{ uri: this.state.image}} style = {{width : 250, height: 250}}/>
            )}
          </TouchableOpacity>
      </View>
    );
  }
} 

export default ImageSelect;