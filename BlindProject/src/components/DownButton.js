/*
    블라인드를 아래로 동작시키기 위한 Down 버튼
    버튼 터치 시 동작하는 함수와 버튼의 사이즈는 props 형태로 받아옴
    TouchableOpacity 및 react-native-vector-icon 사용
*/

import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';

class DownButton extends Component{
    render(){
        return(
            <TouchableOpacity style={styles.button} onPress={this.props.onPress}>
                <Icon name="downcircle"
                size={this.props.size}
                color='#87ceea'></Icon>
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