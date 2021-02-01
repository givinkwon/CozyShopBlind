import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

class UpButton extends Component{
    render(){
        return(
            <TouchableOpacity>
                <Icon name="upcircle"
                size={50}
                color='lightskyblue'></Icon>
            </TouchableOpacity>
        );
    }
}

export default UpButton;