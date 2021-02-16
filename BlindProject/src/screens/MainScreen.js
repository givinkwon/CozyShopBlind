/*
    ┌─────────────────────────────────┐
    │ 블라인드를 작동시키기 위한 Screen │
    └─────────────────────────────────┘
    Container: Screen을 관리하는 View
    ├ header: 스크린 상단에 표시되는 Cozyshop Logo를 관리하는 View
    ├ content: 배경 이미지와 버튼을 관리하는 View
    │ └ ImageBackground: 배경 이미지. 이미지의 자식 컴포넌트로 버튼이 있어야 하기 때문에 ImageBackground로 구현
    │   └ View: 2개의 버튼을 관리하는 View
    │     ├ up button
    │     └ down button
    └ footer: 현재 활성화 되어있는 스크린을 표시하고 이동할 스크린을 선택할 수 있는 버튼이 있는 View
      ├ HomeButton: touch 시 handleHomeButton이 호출되며 MainScreen으로 이동됨
      ├ BluetoothButton: touch 시 handleBluetoothButton이 호출되며 BluetoothScreen으로 이동됨
      └ SettingButton: touch 시 handleSettingButton이 호출되며 SettingScreen으로 이동됨
*/

import React, { Component } from 'react';
import { View, StyleSheet, Image, ImageBackground } from 'react-native';
import HomeButton from '../components/HomeButton';
import SettingButton from '../components/SettingButton';
import BluetoothButton from '../components/BluetoothButton';
import UpButton from '../components/UpButton';
import DownButton from '../components/DownButton';

class MainScreen extends Component {

    handleHomeButton(){
        this.props.navigation.navigate("Main");
    }

    handleSettingButton(){
        this.props.navigation.navigate("Setting");
    }
        
    handleBluetoothButton(){
        this.props.navigation.navigate("Bluetooth");
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={require('../pic/ic_logo.png')} style={styles.image} />
                </View>
                <View style={styles.content}>
                    <ImageBackground source={require('../pic/ic_background.png')} style={styles.bgimage} resizeMode='contain'>
                        <View style={styles.buttonfield}>
                            <UpButton size={50} />
                            <DownButton size={50} />
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.footer}>
                    <HomeButton onPress={this.handleHomeButton.bind(this)} isSelected={true} />
                    <BluetoothButton onPress={this.handleBluetoothButton.bind(this)} isSelected={false} />
                    <SettingButton onPress={this.handleSettingButton.bind(this)} isSelected={false} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#ffffff',
    },
    header: {
        width: '100%',
        height: '8%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f2f2f2',
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
    },
    image: {
        flex: 1,
        resizeMode: 'contain',
    },
    content:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 40,
    },
    bgimage: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonfield:{
        width: 80,
        height: 210,
        position: 'absolute',
        backgroundColor: '#f6f6f6',
        borderRadius: 53,
        top: 210,
        left: 205,
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 4,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    footer:{
        flexDirection: 'row',
        width: '100%',
        height: '8%',
        backgroundColor: '#f2f2f2'
    },
    
})

export default MainScreen;