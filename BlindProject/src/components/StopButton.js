import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

class DownButton extends Component{
    render(){
        return(
            <TouchableOpacity style={styles.button}
            onPress = {this.props.onPress}>
                <Icon name="pausecircle"
                size={this.props.size}
                color='#87ceea' />
            </TouchableOpacity>
        );
    }
}

const styles=StyleSheet.create({
    button:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
        borderRadius: 50,
        backgroundColor: '#f6f6f6',
    },
})

export default DownButton;