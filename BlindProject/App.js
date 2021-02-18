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

	/*
		실제 데이터를 보내는 함수
		param: 데이터를 보내려는 device의 Id
		retrieveServices를 호출해 device의 advertising 정보가 아닌 service,characteristic UUID 정보를 검색한 후
		serial comm을 위한 service,characteristic UUID을 이용해 실제 데이터를 전송함.
		이 때, 데이터는 stringToBytes를 사용해 byte형으로 변경해준 후 전송해야 함.
	*/
	handleDataTransfer(deviceId){
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
		BleManager.retrieveServices(deviceId).then((peripheralInfo) =>{
            console.log("Peripheral info: ", peripheralInfo);
			
            const sendData = stringToBytes("Hello Arduino");
			
			// serial comm을 위한 service UUID 
            const serviceUUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
            
			// serial comm을 위한 characteristic UUID
			const characteristicUUID = '0000FFE1-0000-1000-8000-00805F9B34FB';

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
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Bluetooth"
				screenOptions={{
					headerShown: false
				}}>
					<Stack.Screen name="Bluetooth" component={BluetoothScreen} />
					<Stack.Screen name="Main" component={MainScreen} />
					<Stack.Screen name="Setting" children= {({navigation})=><SettingScreen navigation={navigation}
						onPressInit1={()=>this.handleDataTransfer("F8:30:02:3F:24:B9")}/>} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

export default App;