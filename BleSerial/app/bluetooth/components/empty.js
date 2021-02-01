import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet
} from 'react-native';

function Empty(props){
    return(
        <View style={styles.container}>
            <Image style={styles.icon} source={require('../../icons/ic_empty.png') } resizeMode='contain' />
            <Text style={styles.text}>{props.text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    icon:{
        width: 200,
        height: 200,
        marginVertical: 50,
    },
    text: {
        fontSize: 30,
    }
})

export default Empty;