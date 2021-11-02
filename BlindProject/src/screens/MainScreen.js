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
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';

class MainScreen extends Component {

    constructor(props){
        super(props);
        this.state={
            isUp: false,
            isDown: false,
        }

    }

    handleHomeButton(){
        this.props.navigation.navigate("Main");
    }

    handleSettingButton(){
        this.props.navigation.navigate("Setting");
    }
        
    handleBluetoothButton(){
        this.props.navigation.navigate("Bluetooth");
    }

	handleBlindUp = () => {
        console.log(this.props.deviceId);
        const isUp = this.state.isUp;
        const isDown = this.state.isDown;
        this.dataTransfer('AUTOUP');
        // if (!isUp && !isDown){
        //     this.dataTransfer('AUUPST');
        //     this.setState({isUp: true});
        // } else if(isUp) {
        //     this.dataTransfer('AUUPSP');
        //     this.setState({isUp: false});
        // } else if(isDown) {
        //     this.dataTransfer('AUDNSP');
        //     this.setState({isDown: false});
        // }
    }

    handleBlindDown = () => {
        const isUp = this.state.isUp;
        const isDown = this.state.isDown;
        this.dataTransfer('AUTODN');
        // if (!isUp && !isDown){
        //     this.dataTransfer('AUDNST');
        //     this.setState({isDown: true});
        // } else if(isUp) {
        //     this.dataTransfer('AUUPSP');
        //     this.setState({isUp: false});
        // } else if(isDown) {
        //     this.dataTransfer('AUDNSP');
        //     this.setState({isDown: false});
        // }
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
                <View style={styles.content}>
                    <ImageBackground source={require('../pic/ic_background.png')} style={styles.bgimage} resizeMode='contain'>
                        <View style={styles.buttonfield}>
                            <UpButton size={50} onPress={this.handleBlindUp} />
                            <DownButton size={50} onPress={this.handleBlindDown} />
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