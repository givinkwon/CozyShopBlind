/*
    ┌──────────────────────────────────┐
    │      초기값 설정을 위한 Screen     │
    └──────────────────────────────────┘
    Container: Screen을 관리하는 View
    ├ header: 스크린 상단에 표시되는 Cozyshop Logo를 관리하는 View
    ├ title: 블라인드 초기값 설정에 대한 워딩을 관리하는 View
    │ ├ text1: 초기값 설정 방법 워딩 제목
    │ └ text2: 초기값 설정 방법 워딩
    ├ content: 초기값 설정에 필요한 두 종류의 버튼을 관리하는 View(flexDirection: row)
    │ ├ view1: 초기값 설정 중 메모리 설정과 관련된 버튼을 관리하는 View
    │ │ ├ text: 메모리 설정 워딩
    │ │ └ button view: 2개의 버튼을 관리하는 View
    │ │   ├ start button: 
    │ │   └ stop button:
    │ └ view2: 초기값 설정 중 높이 설정과 관련된 버튼을 관리하는 View
    │   ├ text: 높이 설정 워딩
    │   └ button view: 2개의 버튼을 관리하는 View
    │     ├ up button
    │     └ down button
    └ footer: 현재 활성화 되어있는 스크린을 표시하고 이동할 스크린을 선택할 수 있는 버튼이 있는 View
      ├ HomeButton: touch 시 handleHomeButton이 호출되며 MainScreen으로 이동됨
      ├ BluetoothButton: touch 시 handleBluetoothButton이 호출되며 BluetoothScreen으로 이동됨
      └ SettingButton: touch 시 handleSettingButton이 호출되며 SettingScreen으로 이동됨
*/

import React, { Component } from 'react';
import { Text, View, StyleSheet, Image } from 'react-native';
import UpButton from '../components/UpButton';
import DownButton from '../components/DownButton';
import StartButton from '../components/StartButton';
import StopButton from '../components/StopButton';
import HomeButton from '../components/HomeButton';
import BluetoothButton from '../components/BluetoothButton';
import SettingButton from '../components/SettingButton';

class SettingScreen extends Component {

    handleHomeButton() {
        this.props.navigation.navigate("Main");
    }

    handleSettingButton() {
        this.props.navigation.navigate("Setting");
    }
    
    handleBluetoothButton() {
        this.props.navigation.navigate("Bluetooth");
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={require('../pic/ic_logo.png')} style={styles.image} />
                </View>
                <View style={styles.title}>
                        <Text style={styles.titletext1}>블라인드 자동작동 설정 방법</Text>
                        <Text style={styles.titletext2}>
                            1. 높이설정 {<UpButton size={14} />} 버튼을 눌러 블라인드를 최소 지점까지 올려주세요.{'\n'}
                            2. 메모리 설정 {<StartButton size={14} />} 버튼을 1회 눌러 현재 지점을 저장해 주세요.{'\n'}
                            3. 높이설정 {<DownButton size={14} />} 버튼을 눌러 블라인드를 최대 지점까지 내려주세요.{'\n'}
                            4. 블라인드가 원하는 지점까지 내려왔을 때, 메모리 설정 {<StopButton size={14} />} 버튼을 1회 누르면 셋팅이 완료됩니다.
                        </Text>
                    </View>
                <View style={styles.content}>
                        <View style={styles.setting}>
                            <Text style={styles.buttonfont}>
                                메모리 설정
                            </Text>
                            <View style={styles.buttonfield}>
                                <StartButton size={50} onPress={this.props.onPressInit1}/>
                                <StopButton size={50} />
                            </View>
                            
                        </View>
                        <View style={styles.setting}>
                            <Text style={styles.buttonfont}>
                                높이 설정
                            </Text>
                            <View style={styles.buttonfield}>
                                <UpButton size={50} />
                                <DownButton size={50}/>
                            </View>
                            
                        </View>
                    </View>
                <View style={styles.footer}>
                    <HomeButton onPress={this.handleHomeButton.bind(this)} isSelected={false} />
                    <BluetoothButton onPress={this.handleBluetoothButton.bind(this)} isSelected={false} />
                    <SettingButton onPress={this.handleSettingButton.bind(this)} isSelected={true} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
    title:{
        flex: 1,
        width: '80%',
        marginTop: 25,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 6,
    },
    titletext1: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        fontFamily: "NotoSansKR-Bold",
        lineHeight: 50,
        paddingBottom: 10,
    },
    titletext2: {
        fontSize: 14,
        fontFamily: "NotoSansKR-Regular",
        textAlign: 'auto',
        lineHeight: 25,
        paddingBottom: 15,
    },
    content: {
        flex: 1,
        width: '80%',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 40,
        
    },
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
    setting:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    buttonfield:{
        flex: 1,
        width: '60%',
        backgroundColor: '#f6f6f6',
        borderRadius: 53,
        marginTop: 15,
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
    buttonfont:{
        fontSize: 20,
        fontFamily: "NotoSansKR-Medium",
    },
    footer:{
        flexDirection: 'row',
        width: '100%',
        height: '8%',
        backgroundColor: '#f2f2f2'
    },
})

export default SettingScreen;