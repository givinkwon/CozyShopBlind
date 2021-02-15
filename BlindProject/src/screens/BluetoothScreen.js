import React, { Component } from 'react';
import { FlatList,
    View,
    ScrollView,
    Text,
    StyleSheet,
    TouchableOpacity,
    NativeEventEmitter,
    Dimensions,
    NativeModules,
    AppState,
    Platform,
    PermissionsAndroid,
    Image
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import ConnectMoal from '../components/ConnectModal';
import { stringToBytes } from 'convert-string';
import HomeButton from '../components/HomeButton';
import BluetoothButton from '../components/BluetoothButton';
import SettingButton from '../components/SettingButton';


const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class BluetoothScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            scanning: false,
            //connected: false,
            modalVisible: false,
            peripherals: new Map(),
            connectedDeviceId: '',
            selDeviceId: '',
            selDeviceName: '',
            selDeviceRssi: 0,
            connection: false,
            appState: '',
        }
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
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

    componentDidMount(){
        console.log("===== Start componentDidMount =====");

        AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start().then(()=>{
            console.log("BleManager Start!");
        })

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        
        if (Platform.OS === 'android' && Platform.Version >= 29) {
            this.getAndroidPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        }

        if (Platform.OS === 'android' && Platform.Version >= 23 && Platform.Version <= 28) {
            this.getAndroidPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        }

        BleManager.getBondedPeripherals([]).then((devices) => {
            if(devices.length != 0){
                devices.forEach((device) => {
                    console.log("Bonded Device INFO: ", device);
                });
            } else {
                console.log("No Bonded Device");
            }
        })
        .catch((err) => {
            console.log("Get Bonded Peripherals Error: ", err);
        });

        // const getBondedDevice = async () => {
        //     try{
        //         const devices = await BleManager.getBondedPeripherals([]);
        //         if(devices.length != 0){
        //             devices.forEach((device) => {
        //                 console.log("Bonded Device INFO: ", device);
        //             });
        //         } else {
        //             console.log("No Bonded Device");
        //         }
        //         console.log("try End");
        //         console.log(devices);
        //     } catch(err) {
        //         console.log("Get Bonded Peripherals Error: ", err);
        //     }
        // };

        // getBondedDevice();
        
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
    }

    getAndroidPermission(per){
        PermissionsAndroid.check(per).then((result) =>{
            if (result){
                console.log("Permission is OK")
            } else {
                PermissionsAndroid.request(per).then((result) => {
                    if (result) {
                        console.log("User accept permission");
                    } else {
                        console.log("User reject permission");
                    }
                });
            }
        });
    }

    handleAppStateChange(nextAppState) {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
                peripheralsArray.forEach((device) => {
                    console.log("Connected Device: " , device);
                });
            });
            BleManager.getBondedPeripherals([]).then((bondedDevice) => {
                bondedDevice.forEach((device) => {
                    console.log("Bonded Device: ", device);
                })
            })
        }
        this.setState({appState: nextAppState});
    }

    startScan(){
        BleManager.enableBluetooth().then(()=>{
            if(!this.state.scanning){
                this.setState({peripherals: new Map()});
                BleManager.scan([], 10, false).then((results) => {
                    console.log('Scanning...');
                    this.setState({scanning: true});
                })
            }
        });
    }

    handleStopScan(){
        console.log('Scan is stopped');
        this.setState({ scanning: false });
    }

    handleDiscoverPeripheral(peripheral){
        var peripherals = this.state.peripherals;
        //console.log('Got ble peripheral', peripheral);
        if (!peripheral.name) {
            return;
        }
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
    }

    // handleDataTransfer(deviceId){
    //     BleManager.retrieveServices(deviceId).then((peripheralInfo) =>{
    //         console.log("Peripheral info: ", peripheralInfo);
    //         const sendData = stringToBytes("Hello Arduino");

    //         const serviceUUID = '0000FFE0-0000-1000-8000-00805F9B34FB';
    //         const characteristicUUID = '0000FFE1-0000-1000-8000-00805F9B34FB';

    //         console.log("service uuid: ", serviceUUID);
    //         console.log("characteristic uuid: ", characteristicUUID);
        
    //         BleManager.write(deviceId, serviceUUID, characteristicUUID, sendData).then(() => {
    //            console.log("Write: ", sendData); 
    //         })
    //         .catch((error) => {
    //             console.log("Write Error: ", error);
    //         });
    //     })
    //     .catch((error) => {
    //         console.log("RetrieveServices Error: ", error);
    //     });
    // }

    handleConnect = async (deviceId) => {
        await BleManager.connect(deviceId).then(() => {
            console.log("Connected");
        })
        .catch((error) =>{
            console.log("Connect Error: ", error);
        });

        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                console.log('No connected peripherals')
            }
            console.log(results);
            var peripherals = this.state.peripherals;
            for (var i = 0; i < results.length; i++) {
                var peripheral = results[i];
                peripheral.connected = true;
                peripherals.set(peripheral.id, peripheral);
                this.setState({ peripherals });
            }
        });
    }

    handleDisconnect = async (deviceId) => {
        BleManager.disconnect(deviceId).then(() => {
            console.log("Disconnected");
        })
        .catch((error) => {
            console.log("Disconnect Error : ", error);
        });
        let devices = this.state.peripherals;
        let d = devices.get(deviceId);
        if (d) {
          d.connected = false;
          devices.set(deviceId, d);
          this.setState({ peripherals: devices });
        }
    }

    handleCreateBond = async (device) =>{
        let isBonded = false;
        await BleManager.getBondedPeripherals([]).then((bondedDevice) => {
            bondedDevice.forEach((bondedDevice) => {
                if(device.id === bondedDevice.id){
                    isBonded = true;
                    //console.log("isBonded is true");
                }
            })
        })
        .catch((error) => {
            console.log("Get Bounded Device Error: ", error);
        });
        //console.log("isBonded: ", isBonded);
        if(!isBonded){
            BleManager.createBond(device.id, "000000").then(()=>{
                console.log('CreatBond success');
                
            })
            .catch((error) => {
                console.log("Create Bond: ", error);
            })
        } else {
            console.log("Bonding is already done");
        }
    }

    handleRetrieveServices(device){
        BleManager.retrieveServices(device.id).then((peripheralInfo) =>{
            console.log("Peripheral Info: ", peripheralInfo);
        })
        .catch((error) => {
            console.log("retrieveServices Error: ", error);
        })
    }
    

    handleModal(peripheral){
        const visible = this.modalVisible;
        // if(!this.state.connected){
        //     BleManager.connect(peripheral.id).then(() => {
        //         console.log("connected");
        //         var connected = this.state.connected;
        //         connected = true;
        //         this.setState({ connected });
        //         //this.handleDataTransfer(peripheral.id);
        //         BleManager.createBond(peripheral.id, "000000").then(() => {
        //             console.log("create bond success or there is already an existing one");
        //         })
        //         .catch((error) => {
        //             console.log("fail to bond[" + error + "]")
        //             this.handleDisconnect(peripheral.id);
        //         });
        //     })
        //     .catch((error) => {
        //         console.log("Connect Error: ", error);
        //         this.handleDisconnect(peripheral.id);
        //     });
        // } else{
        //     BleManager.removeBond(peripheral.id).then(() => {
        //         console.log("Remove bonded device success");
        //     })
        //     .catch((error) => {
        //         console.log("Remove Bond Error: ", error);
        //     });
        //     this.handleDisconnect(peripheral.id);
        // }
        this.handleCreateBond(peripheral);
        console.log("Connection state: ", peripheral.connected);
        this.setState({ connection: peripheral.connected });
        this.setState({ selDeviceId: peripheral.id });
        this.setState({ selDeviceName: peripheral.name });
        this.setState({ selDeviceRssi: peripheral.rssi });
        this.setModalVisible(!visible);
    }

    setDeviceConnection(deviceId){
        BleManager.isPeripheralConnected(deviceId, []).then((isConnected) => {
            if (!isConnected) {
                // Device is not connected
                this.handleConnect(deviceId);
            } else {
                this.handleDisconnect(deviceId);
            }
        });
    }

    renderItem(item) {
        const backgroundcolor = item.connected ? '#87ceea' : '#f6f6f6';
        const textcolor = item.connected ? '#f0f9fd' : '#707070';
        if(item.name !== null){
            return(
                <TouchableOpacity onPress={()=> this.handleModal(item) }>
                    <View style={[styles.row, {margin: 9, backgroundColor: backgroundcolor,
                                shadowColor: "#000",
                                shadowOffset: {
                                    width: 0,
                                    height: 6,
                                },
                                shadowOpacity: 0.58,
                                shadowRadius: 6.00,
                                elevation: 3, }]}>
                        <Text style={{fontSize: 16, textAlign: 'center', color: textcolor, fontWeight: 'bold', paddingVertical: 15,}}>{item.name}</Text>
                        {/* <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2, fontWeight: 'bold', color: 'black'}}></Text> */}
                        <Text style={{fontSize: 13, textAlign: 'center', color: textcolor, paddingBottom: 15,}}>RSSI: {item.rssi}</Text>
                    </View>
                </TouchableOpacity>
            );
        }
        //else {
        //     return(
        //         <TouchableOpacity onPress={()=> this.handleConnect() }>
        //             <View style={[styles.row, {margin: 1, backgroundColor: 'skyblue', }]}>
        //                 <Text style={{fontSize: 15, textAlign: 'center', color: '#333333', padding: 10, fontWeight: 'bold', color: 'white'}}>{item.id}</Text>
        //                 <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20, fontWeight: 'bold', color: 'white'}}>RSSI: {item.rssi}</Text>
        //             </View>
        //         </TouchableOpacity>
        //     );
        // } 
    }
    
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    
    onPressPositive = (deviceId) => {
        const visible = this.state.modalVisible;
        //console.log("Id: ", deviceId);
        this.setDeviceConnection(deviceId);

        this.setModalVisible(!visible);
    }

    onPressNegative = () => {
        const visible = this.state.modalVisible;
        //console.log("아니요");
        this.setModalVisible(!visible);
    }

    render(){
        const list = Array.from(this.state.peripherals.values());
        const btnScanTitle = '주변 기기 ' + (this.state.scanning ? '검색 중...' : '검색하기');

        return(
            <View style={styles.container}>
                <ConnectMoal
                    modalVisible={this.state.modalVisible}
                    setModalVisible={this.setModalVisible.bind(this)}
                    deviceName={this.state.selDeviceName}
                    rssi={this.state.selDeviceRssi}
                    deviceId={this.state.selDeviceId}
                    connected={this.state.connection}
                    onPressPositive={this.onPressPositive.bind(this)}
                    onPressNegative={this.onPressNegative.bind(this)}
                />
                <View style={styles.header}>
                    <Image source={require('../pic/ic_logo.png')} style={styles.image} />
                </View>
                <View style={styles.content1}>
                    <ScrollView style={styles.scroll}>
                        {(list.length == 0) &&
                            <View style={{flex: 1}}>
                                {/* <Image style={styles.image} source={require('../pic/ic_empty.png')} />
                                <Text style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>주변기기 없음</Text> */}
                            </View>
                        }
                        <FlatList
                            data={list}
                            renderItem={({ item }) => this.renderItem(item) }
                            keyExtractor={item => item.id}
                        />
                    </ScrollView>
                </View>

                <View style={styles.content2}>
                    <TouchableOpacity style={styles.button}
                    onPress={()=>this.startScan()}> 
                        <View>
                            <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold',}}>{btnScanTitle}</Text> 
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <HomeButton onPress={this.handleHomeButton.bind(this)} isSelected={false} />
                    <BluetoothButton onPress={this.handleBluetoothButton.bind(this)} isSelected={true} />
                    <SettingButton onPress={this.handleSettingButton.bind(this)} isSelected={false} />
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
    content1:{
        flex: 1,
        marginTop: 30,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content2: {
        width: '100%',
        height: '17%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll:{
        flex: 1,
        width: '90%',
    },
    button: {
        width: '70%',
        height: '50%',
        backgroundColor: '#87ceea',
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    image:{
        width: '100%',
        resizeMode: 'contain',
    },
    footer:{
        flexDirection: 'row',
        width: '100%',
        height: '8%',
        backgroundColor: '#f2f2f2'
    },
})

export default BluetoothScreen;