/*
	어플리케이션이 처음 실행될 때 거쳐가는 곳
	react-navigation/stack을 이용하여 구현했기 때문에 return되는 최상위 컴포넌트는 NavigationContainer
	NavigationContainer:
	└ Stack.Navigator: 3개의 Screen을 관리하는 컴포넌트로, initialRoute props을 통해 렌더링 될 첫 screen이 결정되며
	  │				   현재는 Bluetooth screen을 initial screen으로 설정해 둠
	  ├ Stack.Screen(Bluetooth): Stack Navigator에 Bluetooth Screen 컴포넌트를 Bluetooth라는 이름으로 Navigator에 등록
	  ├ Stack.Screen(Main): Stack Navigator에 Main Screen 컴포넌트를 Main이라는 이름으로 Navigator에 등록
	  └ Stack.Screen(Setting): Stack Navigator에 Setting Screen 컴포넌트를 Setting이라는 이름으로 Navigator에 등록
	  		=> Stack Navigator에 등록되어있는 Screen 컴포넌트들에는 자동적으로 navigation 객체가 props 형태로 전달되며
			   각각의 스크린에서 navigation 객체의 navigator 함수를 통해 다른 스크린으로 이동할 수 있음
			   (parameter: Stack.Screen으로 등록한 Screen의 name)

	- state ─ peripheralId: Bluetooth 페이지에서 연결된 기기의 Id값을 저장하는 state(현재 활용 x)
	
	- handleDataTransfer: 버튼 touch 시 적절한 데이터를 보내기 위한 함수
						  현재는 test용 데이터만 전송되도록 되어있음
						  데이터 전송시 convert-string의 stringToBytes함수를 이용해
						  보낼 데이터를 byte 형태로 보내야 함
	)
 */	

import React,  { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/screens/MainScreen';
import SettingScreen from './src/screens/SettingScreen';
import BluetoothScreen from './src/screens/BluetoothScreen';
import BleManager from 'react-native-ble-manager';
import { stringToBytes } from 'convert-string';

const Stack = createStackNavigator();

class App extends Component{

	constructor(props){
		super(props);
		this.state = {
			peripheralId: '',
		}
	};

	setPeripheralID = (deviceId) => {
		console.log("Parameter device Id: ", deviceId);
		this.setState({peripheralId: deviceId});
		console.log("App.js - peripheral Id: ", this.state.peripheralId);
		console.log("App.js - device Id: ", deviceId);
	}

	render(){
		return (
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Bluetooth"
				screenOptions={{
					headerShown: false
				}}>
					<Stack.Screen name="Bluetooth" children= {({navigation})=><BluetoothScreen navigation={navigation}
						setDeviceName={this.setPeripheralID} />} />
					<Stack.Screen name="Main" children={({navigation})=><MainScreen navigation={navigation} deviceId={this.state.peripheralId} />} />
					<Stack.Screen name="Setting" children= {({navigation})=><SettingScreen navigation={navigation}
						onPressInit={()=>this.handleDataTransfer(this.state.peripheralId)} deviceId={this.state.peripheralId}/>} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

export default App;