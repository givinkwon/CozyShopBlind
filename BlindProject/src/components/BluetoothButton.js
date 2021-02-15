/*
    어플리케이션 가장 하단에 표시되는
    현재 활성화 되어있는 스크린을 표시하고 해당 스크린으로 이동하기 위한
    버튼 컴포넌트
    TouchableOpacity 및 react-native-vector-icons 사용
*/

import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

class BluetoothButton extends Component {

    constructor(props){
        super(props);
    }

    render() {
        /*
            현재 활성화 되어있는 스크린에 따라 해당 스크린과 맞는 버튼
            및 상단 외곽선의 색만 다르게 설정되도록 변수 설정
            
            스크린의 활성화 여부는 각 스크린에서 버튼 컴포넌트 생성 시
            isSelected props을 true/false로 넘겨줌으로서 판단
        */
        const borderwidth = this.props.isSelected ? 4 : 0;
        const bordercolor = this.props.isSelected ? '#87ceea' : '';
        const iconcolor = this.props.isSelected ?  '#87ceea' : '#c4c4c4';
        return(
            <TouchableOpacity style={[styles.button, {borderTopWidth:borderwidth, borderTopColor:bordercolor}]}
            onPress={this.props.onPress}>
                <View>
                    <FontAwesome name="bluetooth-b"
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