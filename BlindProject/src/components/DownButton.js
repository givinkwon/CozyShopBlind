import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

class DownButton extends Component{
    render(){
        return(
            <TouchableOpacity>
                <Icon name="downcircle"
                size={50}
                color='lightskyblue'></Icon>
            </TouchableOpacity>
        );
    }
}

export default DownButton;