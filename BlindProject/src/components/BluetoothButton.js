import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

class BluetoothButton extends Component {

    render() {
        return(
            <TouchableOpacity style={styles.button}
            onPress={this.props.onPress}>
                <View>
                    <Feather name="bluetooth"
                    size={50}
                    color="white"/>
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
        backgroundColor: 'tan',
    }
})

export default BluetoothButton;