/*
    ┌──────────────────────────────────┐
    │     블루투스 연결을 위한 screen    │
    └──────────────────────────────────┘
    Container: Screen을 관리하는 View
    ├ header: 스크린 상단에 표시되는 Cozyshop Logo를 관리하는 View
    ├ content1: 블라인드의 현재 길이를 표시하기 위한 View(flexDirection: row)
    │ └ ScrollView: Scan된 블루투스 기기를 관리하는 View
    │   └ FlatList: Scan되어 저장된 기기 목록을 renderItem props로 아이템별로 렌더링 진행
    ├ content2: 초기값 설정에 필요한 두 종류의 버튼을 관리하는 View(flexDirection: row)
    │ └ button: 기기 scan을 활성화하는 버튼
    └ footer: 현재 활성화 되어있는 스크린을 표시하고 이동할 스크린을 선택할 수 있는 버튼이 있는 View
      ├ HomeButton: touch 시 handleHomeButton이 호출되며 MainScreen으로 이동됨
      ├ BluetoothButton: touch 시 handleBluetoothButton이 호출되며 BluetoothScreen으로 이동됨
      └ SettingButton: touch 시 handleSettingButton이 호출되며 SettingScreen으로 이동됨
*/
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

        /*
            scanning: 현재 bluetooth device를 scan중인지의 여부 파악
            modalVisible: 기기와 연결을 요청하는 modal창의 활성화 여부 파악
            peripherals: scan된 주변 기기들의 advertising data모아 객체형태로 저장하는 공간
            connectedDeviceId: 현재 연결되어있는 deviceId(현재 활용 X)
            selDeviceId, Name, Rssi: 주변기기 목록 중 선택한 기기의 Id, Name, Rssi 정보
            connection: Modal 표시 시, 연결/해제 워딩 설정을 위해 현재 선택된 기기의 connection 상태를 가짐
            appState: 현재 앱이 foreground인지 background인지를 저장
        */
        this.state = {
            scanning: false,
            modalVisible: false,
            peripherals: new Map(),
            connectedDeviceId: '',
            selDeviceId: '',
            selDeviceName: '',
            selDeviceRssi: 0,
            connection: false,
            appState: '',
            // a: '',
        }
        this.handleAppStateChange = this.handleAppStateChange.bind(this);
        this.handleStopScan = this.handleStopScan.bind(this);
        this.handleDiscoverPeripheral = this.handleDiscoverPeripheral.bind(this);
        //this.handleConnectDevice = thish.andleConnectDevice.bind(this);
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

    /*
        생명주기 메소드. 해당 컴포넌트가 생성될 때 실행되는 함수로
        1. AppState를 등록
        2. BleManager start 함수 실행
        3. Bluetooth 연결과 관련된 이벤트리스너 추가
        4. Android API >= 29 -> ACCESS_FINE_LOCATION permission 요청
           Android API <= 28 -> ACCESS_COARSE_LOCATION permission 요청
           -> Bluetooth Scan을 위해 기기의 위치정보 필요
    */
    componentDidMount(){
        AppState.addEventListener('change', this.handleAppStateChange);

        BleManager.start().then(()=>{});

        this.handlerDiscover = bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handleDiscoverPeripheral);
        this.handlerStop = bleManagerEmitter.addListener('BleManagerStopScan', this.handleStopScan);
        
        
        if (Platform.OS === 'android' && Platform.Version >= 29) {
            this.getAndroidPermission(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
        }

        if (Platform.OS === 'android' && Platform.Version >= 23 && Platform.Version <= 28) {
            this.getAndroidPermission(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
        }
    }

    /*
        생명주기 메소드. 해당 컴포넌트가 사라질 때 호출되는 함수
    */
    componentWillUnmount() {
        this.handlerDiscover.remove();
        this.handlerStop.remove();
    }

    /*
        Android Permission을 요청하기 위해 작성한 함수
        param: request할 permission
        
        몇 가지 보안을 신경써야하는 permission을 제외한 permission들은
        AndroidManifest에서 uses-permission으로 작성하는 것 만으로도 permission이 허가되지만
        위치정보나 카메라, 전화번호부와 관련된 permission은 request를 보내줘야 함
    */
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

    /*
        AppState의 값이 변경될 때 발생되는 이벤트에 의해 호출되는 함수
        현재 앱의 상태가 background 상태이고, 다음 앱의 상태가 active일 때
        앱이 foreground로 돌아왔음을 알리고, 현재 연결/페어링 되어있는 기기들의 목록을 디버깅함
    */
    handleAppStateChange(nextAppState) {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!')
            BleManager.getConnectedPeripherals([]).then((peripheralsArray) => {
                peripheralsArray.forEach((device) => {
                    console.log("Connected Device: " , device);
                });
            });
            // BleManager.getBondedPeripherals([]).then((bondedDevice) => {
            //     bondedDevice.forEach((device) => {
            //         console.log("Bonded Device: ", device);
            //     })
            // })
        }
        this.setState({appState: nextAppState});
    }

    /*
        bluetooth 주변기기 scan을 시작하는 함수
        1. scan 시작 전 Bluetooth를 사용할 수 있는지 확인
        2. Bluetooth가 사용 가능할 경우 Scan 시작
           params
            [] : service UUID
            10 : scan 할 시간(초 단위). 10초 이후 scan stop 관련 이벤트 발생 및 이후 scan stop까지 좀 더 걸릴 수도
            false : duplicate(?) 관련 parameter
    */
    startScan(){
        BleManager.enableBluetooth().then(()=>{
            if(!this.state.scanning){
                this.setState({peripherals: new Map()});
                BleManager.scan([], 10, false).then((results) => {
                    // console.log('Scanning...');
                    this.setState({scanning: true});
                })
            }
        });
    }

    /*
        주변기기 Scan 이후 scan 시간이 다되어 Scan stop 관련 이벤트가 발생되면 이벤트 리스너에 의해 호출되는 함수
        scanning state를 false로 바꾸어 scan 버튼의 워딩을 바꿈
    */
    handleStopScan(){
        // console.log('Scan is stopped');
        this.setState({ scanning: false });
    }

    /*
        주변기기 Scan 중 주변기기가 발견될 때 이벤트가 발생되면 이벤트 리스너에 의해 호출되는 함수
        param: 기기의 advertising 정보
        발견된 주변기기 중 name이 null인 경우를 제외하고 screen component의 state에 해당 기기 정보 추가
    */
    handleDiscoverPeripheral(peripheral){
        var peripherals = this.state.peripherals;
        //console.log('Got ble peripheral', peripheral);
        if (!peripheral.name) {
            return;
        }
        peripherals.set(peripheral.id, peripheral);
        this.setState({ peripherals });
    }

    /*
        기기가 연결되어 있지 않았을 때 Modal창의 "예"를 선택했을 때 호출되는 함수
        param: connect 하려는 device ID
        connect 이후 connect가 되면 device 정보(객체)에 connected 필드를 추가한 후 true로 설정하고
        screen component의 state인 peripheral 정보 update
    */
    handleConnect = async (deviceId) => {
        /*
            connect: device(Id)와 블루투스 연결 시도. promise 객체를 반환함.
        */
        await BleManager.connect(deviceId).then(() => {
            console.log("Connected");
        })
        .catch((error) =>{
            console.log("Connect Error: ", error);
        });

        /*
            getConnectedPeripherals: 현재 어플리케이션과 연결되어 있는 블루투스 기기들의 객체 array를 반환
            param: serviceUUID
        */
        BleManager.getConnectedPeripherals([]).then((results) => {
            if (results.length == 0) {
                // console.log('No connected peripherals')
            } else {
                // 하나의 변수를 선언해 현재 peripherals state 저장
                var peripherals = this.state.peripherals;

                // 블루투스 기기들의 객체 array를 하나씩 검사
                for (var i = 0; i < results.length; i++) {
                    // 하나의 변수를 선언해 한 개의 블루투스 객체 저장
                    var peripheral = results[i];

                    // 해당 객체에 connected 필드를 추가해 연결이 되어있다는 의미로서 true로 초기화
                    peripheral.connected = true;

                    // peripherals map 객체를 기기의 id를 key값으로 하여 update
                    //  -> 연결된 peripheral들의 객체 정보에 connected = true 가 추가됨
                    peripherals.set(peripheral.id, peripheral);
                    
                    // peripherals를 컴포넌트의 state로 update
                    this.setState({ peripherals });
                }
            }
        });
        console.log("1. 전")
        this.props.setDeviceName(deviceId);
        console.log("2. 후")

    }

    /*
        기기가 연결되어 있을 때 Modal창의 "예"를 선택했을 때 호출되는 함수
        param: disconnect 하려는 device ID
        disconnect 이후 device 정보(객체) connected 필드값 false로 설정후
        screen component의 state인 peripheral 정보 update
    */
    handleDisconnect = async (deviceId) => {
        await BleManager.disconnect(deviceId).then(() => {
            console.log("Disconnected");
        })
        .catch((error) => {
            console.log("Disconnect Error : ", error);
        });
        // disconnect 후 connect와 반대 과정으로 
        let devices = this.state.peripherals;
        let d = devices.get(deviceId);
        if (d) {
          d.connected = false;
          devices.set(deviceId, d);
          this.setState({ peripherals: devices });
        }
    }

    /*
        주변기기 리스트 중 하나를 택했을 때 handleModal에 의해 실행되는 함수
        param: bonding 하려는 device 객체
        리스트 중 하나를 택했을 때 해당 기기가 기존에 bonding 되어있는 지 확인 후
        bonding이 되어있으면 아무 작업도 하지 않고
        bonding이 되어있지 않으면 페어링 진행
    */
    handleCreateBond = async (device) =>{
        let isBonded = false;
        /*
            getBondedPeripherals: 현재 device에 bonding/pairing 되어있는 기기들의 정보를 가져옴
            param: serviceUUID
            bonding 되어있는 기기들의 id를 하나씩 검사하면서 선택한 device와 id가 같은 기기가 있으면
            (기존에 boding이 되어있으면)
            선언해둔 isBonded를 true로 변경
        */
        await BleManager.getBondedPeripherals([]).then((bondedDevice) => {
            bondedDevice.forEach((bondedDevice) => {
                if(device.id === bondedDevice.id){
                    isBonded = true;
                }
            })
        })
        .catch((error) => {
            console.log("Get Bounded Device Error: ", error);
        });

        /*
            기기가 기존에 bonding 되어있는지 검사 후 bonding이 되어있지 않으면 bonding을 진행하고
            bonding이 되어있으면 아무런 작업도 하지 않음
        */
        if(!isBonded){
            /*
                creatBond: 기기의 id를 받아 bonding을 진행함. bonding 절차는 Android 기기 OS에 의존성을 두고 진행됨
                param: bonding을 진행하려는 device id
            */
            BleManager.createBond(device.id).then(()=>{
                console.log('CreatBond success');
                
            })
            .catch((error) => {
                console.log("Create Bond: ", error);
            })
        } else {
            console.log("Bonding is already done");
        }
    }
   
    /*
        주변기기 리스트 중 하나를 택했을 때 Modal 창을 띄우기 위해 실행되는 함수
        param: 선택한 device 객체
        modal component에 props 형태로 들어가는 visible의 값을 설정하기 전,
        1. bonding 여부를 파악하고
        2. 선택 기기의 렌더링 되는 색을 변경하기 위해 쓰이는 connection을 설정하고,
        3. 선택한 기기의 id, name, rssi를 받아 온 후
        4. setModalVisible을 호출해 현재 visible의 값과 반대로 설정(modal을 활성화하는 역할)
    */
    handleModal(peripheral){
        const visible = this.modalVisible;
        // this.handleCreateBond(peripheral);
        this.setState({ connection: peripheral.connected });
        this.setState({ selDeviceId: peripheral.id });
        this.setState({ selDeviceName: peripheral.name });
        this.setState({ selDeviceRssi: peripheral.rssi });
        this.setModalVisible(!visible);
    }

    /*
        device의 connection을 결정하는 함수, Modal창을 띄울 때, "예"를 터치하는 시점에 호출됨
        param: device의 Id
        "예"를 선택했을 때 device가 connect 되어있으면 handleConnect를 호출하고,
        device가 disconnect 되어있으면 handleDisconnect를 호출함.
    */
    setDeviceConnection(deviceId){
        BleManager.isPeripheralConnected(deviceId, []).then((isConnected) => {
            if (!isConnected) {
                // 선택한 기기가 연결되어 있지 않았을 경우
                this.handleConnect(deviceId);
            } else {
                // 선택한 기기가 연결되어 있는 경우
                this.handleDisconnect(deviceId);
            }
        });
    }

    /*
        scan 된 기기들을 렌더링 하는 함수. Flatlist의 props로 들어감
        param: item - Flatlist의 아이템 하나하나
        배경색과 글자색은 item 객체의 connected 필드값에 의해 결정됨
    */
    renderItem(item) {
        const backgroundcolor = item.connected ? '#87ceea' : '#f6f6f6';
        const textcolor = item.connected ? '#f0f9fd' : '#707070';
        return(
            <TouchableOpacity onPress={()=> this.handleModal(item) }>
                <View style={[styles.row, {margin: 9, backgroundColor: backgroundcolor,
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 12,
                            },
                            shadowOpacity: 0.58,
                            shadowRadius: 6.00,
                            elevation: 6, }]}>
                    <Text style={{fontSize: 16, textAlign: 'center', color: textcolor, fontFamily:'NotoSansKR-Bold', paddingTop: 5,}}>{item.name}</Text>
                    <Text style={{fontSize: 13, textAlign: 'center', color: textcolor, fontFamily:'NotoSansKR-Regular', paddingBottom: 5,}}>RSSI: {item.rssi}</Text>
                </View>
            </TouchableOpacity>
        );
    }
    
    /*
        visible을 받아 현재 state값으로 설정하는 함수
    */
    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }
    
    /*
        modal 창에서 "예"를 선택했을 시 실행되는 함수
        param: modal로 넘겨받은 deviceId
        connection을 결정한 후 modal visible도 설정(modal을 비활성화 하는 역할)
    */
    onPressPositive = (deviceId) => {
        const visible = this.state.modalVisible;
        this.setDeviceConnection(deviceId);
        this.setModalVisible(!visible);
    }

    /*
        modal 창에서 "아니오"를 선택했을 시 실행되는 함수
        modal visible 설정(modal을 비활성화 하는 역할)
     */
    onPressNegative = () => {
        const visible = this.state.modalVisible;
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
                            <Text style={{fontSize: 30, color: 'white', fontFamily: 'NotoSansKR-Medium'}}>{btnScanTitle}</Text> 
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
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 6,
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