import React,  { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainScreen from './src/screens/MainScreen';
import SettingScreen from './src/screens/SettingScreen';
import InitScreen from './src/screens/InitScreen';
import BluetoothScreen from './src/screens/BluetoothScreen';

const Stack = createStackNavigator();

class App extends Component{

	constructor(props){
		super(props);
		this.state = {
			peripheralId: '',
			writeData: '',
			initPos: 0,
		}
	};

	setInitPos = () => {
		const randomInt = Math.floor(Math.random()*300);

		this.setState({
			initPos: randomInt
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
					<Stack.Screen name="Setting" component={SettingScreen} />
					{/* <Stack.Screen name="Init" component={({navigation})=><InitScreen initPos={this.state.initPos}/>}/> */}
					<Stack.Screen name="Init" children= {({navigation})=><InitScreen navigation={navigation} initPos={this.state.initPos} onPressInit = {this.setInitPos.bind(this)}/>}/>
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}

export default App;