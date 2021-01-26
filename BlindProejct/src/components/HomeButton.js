import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class HomeButton extends Component {

    render() {
        return(
            <TouchableOpacity style={styles.button}
            onPress={this.props.onPress}>
                <View>
                    <FontAwesome name="home"
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

export default HomeButton;