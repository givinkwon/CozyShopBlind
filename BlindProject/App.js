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
			initPos: 0,
		}
	};

	setInitPos = () => {
		const randomInt = Math.floor(Math.random()*300);

		this.setState({
			initPos: randomInt
		});
	}

	handleDataTransfer(deviceId){
        BleManager.retrieveServices(deviceId).then((peripheralInfo) =>{
            console.log("Peripheral info: ", peripheralInfo);
            const sendData = stringToBytes("Hello Arduino");

            const serviceUUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
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
						initPos={this.state.initPos}
						onPressInit={this.setInitPos.bind(this)}
						onPressInit1={()=>this.handleDataTransfer("F8:30:02:3F:24:B9")}/>} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

export default App;