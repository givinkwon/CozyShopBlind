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
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';

class SettingScreen extends Component {

    constructor(props){
        super(props);
        this.state={
            isUp: false,
            isDown: false,
        }
    }

    handleHomeButton() {
        this.props.navigation.navigate("Main");
    }

    handleSettingButton() {
        this.props.navigation.navigate("Setting");
    }
    
    handleBluetoothButton() {
        this.props.navigation.navigate("Bluetooth");
    }

    handleBlindUp = () => {
        const isUp = this.state.isUp;
        const isDown = this.state.isDown;
        if (!isUp && !isDown){
            this.dataTransfer('AUUPST');
            this.setState({isUp: true});
            console.log('AUUPST')
        } else if(isUp) {
            this.dataTransfer('AUUPSP');
            this.setState({isUp: false});
            console.log('AUUPSP')
        } else if(isDown) {
            this.dataTransfer('AUDNSP');
            this.setState({isDown: false});
            console.log('AUDNSP')
        }
    }

    handleBlindDown = () => {
        const isUp = this.state.isUp;
        const isDown = this.state.isDown;
        if (!isUp && !isDown){
            this.dataTransfer('AUDNST');
            this.setState({isDown: true});
            console.log('AUDNST')
        } else if(isUp) {
            this.dataTransfer('AUUPSP');
            this.setState({isUp: false});
            console.log('AUUPSP')
        } else if(isDown) {
            this.dataTransfer('AUDNSP');
            this.setState({isDown: false});
            console.log('AUDNSP')
        }
    }

    handleBlindSave = (value) => {
        if (value == "start"){
            this.dataTransfer('SAVEST');
            this.setState({isUp: false});
            console.log('SAVEST')
        } else if(value == "stop"){
            this.dataTransfer('SAVEEN');
            this.setState({isUp: false});
            console.log('SAVEEN')
        }
    }

	/*
		실제 데이터를 보내는 함수
		param: 데이터를 보내려는 device의 Id
		retrieveServices를 호출해 device의 advertising 정보가 아닌 service,characteristic UUID 정보를 검색한 후
		serial comm을 위한 service,characteristic UUID을 이용해 실제 데이터를 전송함.
		이 때, 데이터는 stringToBytes를 사용해 byte형으로 변경해준 후 전송해야 함.
	*/
	dataTransfer(data){
        /*
			retrieveServices: react-native-ble-manager에서 지원하는 함수 검색 대상 device가 지원하는 service, characteristic을 찾음
			param: device ID - format: "XX-XX-XX-XX-XX-XX"
			getBondedPeripheral 및 getConnectedPeripheral, Scan을 통해 얻은 device들의 정보들은 advertising data로,
			해당 기기가 어떤 service를 제공하는지 알 수 없다.
			retrieveServices를 호출하면 목표 기기의 service, characteristic UUID를 받을 수 있다.
			이 때, service와 characteristic UUID는 "XXXX"의 4바이트 씩 주어지는데
			"0000XXXX-0000-1000-8000-00805F9B34FB"의 XXXX 부분을 수정하면 serial communication을 제공하는 UUID가 된다(가정)
			해당 UUID를 write 함수에 매개변수로 넘겨주면, 해당 기기로 어플리케이션이 데이터를 전송할 수 있게 된다.
		*/

        const deviceId = this.props.deviceId;

		console.log(deviceId);

		BleManager.retrieveServices(deviceId).then((peripheralInfo) =>{
            console.log("Peripheral info: ", peripheralInfo);
			
			// Data Format: $XXXXXX;
            const prefix = "$";
			const suffix = ";";
			const sendData = stringToBytes(prefix + data + suffix);

			// serial comm을 위한 service UUID 
            const serviceUUID = '0000FFF0-0000-1000-8000-00805F9B34FB';
            
			// serial comm을 위한 characteristic UUID
			const characteristicUUID = '0000FFF1-0000-1000-8000-00805F9B34FB';

            console.log("service uuid: ", serviceUUID);
            console.log("characteristic uuid: ", characteristicUUID);
        
            BleManager.write(deviceId, serviceUUID, characteristicUUID, sendData).then(() => {
               console.log("Write: ", sendData); 
            })
            .catch((error) => {
                console.log("Write Error: ", error);
            });
        })
        .catch((error) => {
            console.log("RetrieveServices Error: ", error);
        });
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
                                <StartButton size={50} onPress={() => this.handleBlindSave("start")} />
                                <StopButton size={50} onPress={() => this.handleBlindSave("stop")} />
                            </View>
                            
                        </View>
                        <View style={styles.setting}>
                            <Text style={styles.buttonfont}>
                                높이 설정
                            </Text>
                            <View style={styles.buttonfield}>
                                <UpButton size={50} onPress={this.handleBlindUp} />
                                <DownButton size={50} onPress={this.handleBlindDown} />
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