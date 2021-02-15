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
                            1. 높이설정 {<UpButton size={14} />} 버튼을 눌러 자동으로 멈추길 원하는 지점까지 블라인드를 올려주세요.{'\n'}
                            2. 메모리 설정 {<StartButton size={14} />} 버튼을 1회 눌러 현재 지점을 저장해 주세요.{'\n'}
                            3. 높이설정 {<DownButton size={14} />} 버튼을 눌러 자동으로 멈추길 원하는 지점까지 블라인드를 내려주세요.{'\n'}
                            4. 블라인드가 원하는 지점까지 내려왔을 때, 메모리 설정 {<StopButton size={14} />} 버튼을 1회 누르면 셋팅이 완료됩니다.
                        </Text>
                    </View>
                <View style={styles.content1}>
                    <View style={{width:'65%',}}>
                        <Text style={{fontSize:32, color: '#ffffff'}}> 현재 설정값  : </Text>
                    </View>
                    <View style={{width:'35%', alignItems: 'flex-end',}}>
                        <Text style={{fontSize:32, color: '#ffffff'}}> {this.props.initPos/100} m</Text>
                    </View>
                </View>
                <View style={styles.content2}>
                        <View style={styles.setting}>
                            <Text style={styles.buttonfont}>
                                메모리 설정
                            </Text>
                            <View style={styles.buttonfield}>
                                <StartButton size={50} onPress={this.props.onPressInit1}/>
                                <StopButton size={50} onPress={this.props.onPressInit} />
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
        marginVertical: 25,
        paddingTop: 5,
        paddingBottom: 20,
        paddingHorizontal: 25,
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
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        lineHeight: 50,
    },
    titletext2: {
        fontSize: 14,
        textAlign: 'auto',
        lineHeight: 25,
    },
    content1:{
        flexDirection: 'row',
        height: '8%',
        width: '80%',
        paddingHorizontal: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 53,
        backgroundColor: '#87ceea',
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 12,
        },
        shadowOpacity: 1,
        shadowRadius: 16,
        elevation: 6,
    },
    content2: {
        flex: 1,
        width: '80%',
        flexDirection: 'row',
        marginVertical: 25,
        
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
    },
    footer:{
        flexDirection: 'row',
        width: '100%',
        height: '8%',
        backgroundColor: '#f2f2f2'
    },
})

export default SettingScreen;