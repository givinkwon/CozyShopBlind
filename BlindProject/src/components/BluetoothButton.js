import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

class BluetoothButton extends Component {

    constructor(props){
        super(props);
    }

    render() {
        const borderwidth = this.props.isSelected ? 4 : 0;
        const bordercolor = this.props.isSelected ? '#87ceea' : '';
        const iconcolor = this.props.isSelected ?  '#87ceea' : '#c4c4c4';
        return(
            <TouchableOpacity style={[styles.button, {borderTopWidth:borderwidth, borderTopColor:bordercolor}]}
            onPress={this.props.onPress}>
                <View>
                    <Feather name="bluetooth"
                    size={40}
                    color={iconcolor}/>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default BluetoothButton;