import React from 'react'
import {
    View,
    Text,
    StyleSheet
} from 'react-native'

function BluetoothListLayout(props){
    return(
        <View style={styles.container}>
            <Text style={styles.title}>{props.title}</Text>
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 25,
        backgroundColor: 'white',
    },
    title:{
        marginLeft: 10,
        fontSize: 20,
        fontWeight: 'bold',
    }
})

export default BluetoothListLayout