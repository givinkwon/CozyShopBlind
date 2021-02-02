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
    Image,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
import Icon from 'react-native-vector-icons/AntDesign';
import { stringToBytes } from 'convert-string';


const window = Dimensions.get('window');

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

class BluetoothScreen extends Component {

    constructor(props){
        super(props);
        this.state = {
            scanning: false,
            peripherals: new Map(),
            appState: '',
            connected: false,
            connectedDeviceId: '',
        }
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);

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
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
          });
        }

        if (Platform.OS === 'android' && Platform.Version >= 23 && Platform.Version <= 28) {
            PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                if (result) {
                    console.log("Permission is OK");
                } else {
                    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION).then((result) => {
                        if (result) {
                            console.log("User accept");
                        } else {
                            console.log("User refuse");
                        }
                    });
                }
          });
        }
    }

    componentWillUnmount() {
        this.handlerDiscover.remove();
    }

    handleAppStateChange(nextAppState) {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
                console.log('Connected peripherals: ' + peripheralsArray.length);
            });
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

    handleDataTransfer(deviceId){
        BleManager.retrieveServices(deviceId).then((peripheralInfo) =>{
            console.log("Peripheral info: ", peripheralInfo);
            const sendData = stringToBytes("$AUTOU;");

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


    handleDisconnect(deviceId){
        BleManager.disconnect(deviceId).then(() => {
            console.log("disconnected");
            var connected = this.state.connected;
            connected = false;
            this.setState({ connected });
        })
        .catch((error) => {
            console.log("Disconnect Error : ", error);
        });
    }

    handleConnect(peripheral){
        if(!this.state.connected){
            BleManager.connect(peripheral.id).then(() => {
                console.log("connected");
                var connected = this.state.connected;
                connected = true;
                this.setState({ connected });
                this.handleDataTransfer(peripheral.id);
            })
            .catch((error) => {
                console.log("Connect Error: ", error);
                this.handleDisconnect(peripheral.id);
            })
        } else{
            this.handleDisconnect(peripheral.id);
        }
        // BleManager.connect(peripheral.id).then(() => {
        //     console.log("connected");
        // })
        // .catch((error) => {
        //     console.log(error);
        // });

        // BleManager.isPeripheralConnected(peripheral.id, []).then((isConnected) => {
        //     if (isConnected) {
        //         console.log("Peripheral is Connected");
        //         var connected = this.state.connected;
        //         connected = true;
        //         this.setState({ connected });
        //     }
        // });
    }

    renderItem(item) {
        //const color = item.connected ? 'green' : '#ffffff';
        if(item.name !== null){
            return(
                <TouchableOpacity onPress={()=> this.handleConnect(item) }>
                    <View style={[styles.row, {margin: 1, backgroundColor: 'skyblue', }]}>
                        <Text style={{fontSize: 15, textAlign: 'center', color: '#333333', padding: 10, fontWeight: 'bold', color: 'white'}}>{item.name}</Text>
                        <Text style={{fontSize: 10, textAlign: 'center', color: '#333333', padding: 2, fontWeight: 'bold', color: 'white'}}>RSSI: {item.rssi}</Text>
                        <Text style={{fontSize: 8, textAlign: 'center', color: '#333333', padding: 2, paddingBottom: 20, fontWeight: 'bold', color: 'white'}}>{item.id}</Text>
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

    render(){
        const list = Array.from(this.state.peripherals.values());
        const btnScanTitle = '주변기기 ' + (this.state.scanning ? '검색 중...' : '검색');

        return(
            <View style={styles.container}>
                <View style={styles.content}>
                    <ScrollView style={styles.scroll}>
                        {(list.length == 0) &&
                            <View style={{flex: 1, margin: 20}}>
                                <Image style={styles.image} source={require('../pic/ic_empty.png')} />
                                <Text style={{textAlign: 'center', fontSize: 30}}>주변기기 없음</Text>
                            </View>
                        }
                        <FlatList
                            data={list}
                            renderItem={({ item }) => this.renderItem(item) }
                            keyExtractor={item => item.id}
                        />
                    </ScrollView>
                </View>

                <View style={styles.footer}>
                    <TouchableOpacity style={{marginRight: 50, marginLeft: 50, justifyContent: 'center'}}
                    onPress={()=>this.startScan()}>
                        <View style={styles.button}>
                            <Icon name='search1' size={40} color={'white'} />
                            <Text style={{fontSize: 30, color: 'white'}}>{btnScanTitle}</Text> 
                        </View>
                    </TouchableOpacity>
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
    },
    content:{
        height: '80%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    footer: {
        width: '100%',
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: '#aeaeae',
    },
    scroll:{
        // flex: 1,
        width: '90%',
        height: '100%',
    },
    button: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: 'steelblue',
        borderWidth: 2,
        borderColor: 'steelblue',
        borderRadius: 50,
        paddingVertical: 10,
        paddingHorizontal: 15,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    image:{
        width: '100%',
        resizeMode: 'contain',
    }
})

export default BluetoothScreen;