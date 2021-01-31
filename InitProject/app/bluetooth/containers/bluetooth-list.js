import React, { useState, useEffect }from 'react';
import {
    ScrollView,
    Text,
    FlatList,
    InteractionManager,
    PermissionsAndroid,
    Platform
} from 'react-native';
import BluetoothListLayout from '../components/bluetooth-list-layout';
import Empty from '../components/empty';
import Toggle from '../components/toggle';
import Subtitle from '../components/subtitle';
import Device from '../components/device';
import BluetoothSerial from 'react-native-bluetooth-serial-next';

function BluetoothList(props){
    const [list, setList] = useState([]);
    const [unpairedList, setUnpairedList] = useState([]);
    const [bolEnable, setBolEnable] = useState(false);
    
    useEffect(()=>{

        async function init(){
            
            if (Platform.OS === 'android' && Platform.Version >= 23){
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                    if (result) {
                        console.log("Permission is OK");
                    } else {
                        PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then((result) => {
                            if (result) {
                                console.log("User accept Location Permission");
                            } else {
                                console.log("User refure Location Permission");
                            }
                        });
                    }
                });
            }

            // try{
            //     const enable = await BluetoothSerial.requestEnable();
            //     setBolEnable(enable);
            //     console.log("Can Use Bluetooth");
            //     const list = await BluetoothSerial.list();
            //     console.log(list);
            //     const unpairedList = await BluetoothSerial.discoverUnpairedDevices();
            //     console.log(unpairedList);
            //     await BluetoothSerial.stopScanning();
            //     setList(list);
            //     setUnpairedList(unpairedList);
            //     console.log(list);
            // } catch(error){
            //     console.log(error);
            // }
            
        }

        init();

        return() => {
            async function remove() {
                await BluetoothSerial.stopScanning();
                console.log('Terminate scanner');
            }

            remove();
        }
    }, [])

    const enableBluetooth = async () => {
        try {
            await BluetoothSerial.enable();
            setBolEnable(true);
            console.log("Can Use Bluetooth");
            const list = await BluetoothSerial.list();
            console.log("Pairing device: ", list);
            setList(list);
            const unpairedDevice = await BluetoothSerial.discoverUnpairedDevices();
            await BluetoothSerial.stopScanning();

            let unpairedList = [];
            let temp = [];

            unpairedDevice.forEach((element) => {
                if(element.name != null){
                    console.log(element);
                    temp.push(element);
                }
            });

            unpairedList.push(temp[0]);

            temp.forEach((element) => {
                let bolPush = true;
                for(var i = 0; i < unpairedList.length; i++){
                    if (element.id === unpairedList[i].id){
                        bolPush = false;
                        break;
                    }
                }
                if(bolPush){
                    unpairedList.push(element);
                }
            });
            setUnpairedList(unpairedList);
        } catch (error) {
            console.log(error);
        }
    };

    const disableBluetooth = async () => {
        try {
            await BluetoothSerial.disable();
            await BluetoothSerial.stopScanning();
            setBolEnable(false);
            setList([]);
            setUnpairedList([]);
        } catch (error) {
            console.log(error);
        }
    };

    const renderEmpty = () => <Empty text='주변기기 없음' />
    const renderItem = ({item}) => {
        return <Device {...item} iconLeft={require('../../icons/ic_laptop.png')} iconRight={require('../../icons/ic_settings.png')} />
    };

    const toggleBluetooth = value => {
        if (value) {
            return enableBluetooth();
        }
        disableBluetooth();
    }


    return(
        <BluetoothListLayout title='Bluetooth'>
            <Toggle value={bolEnable} onValueChange={toggleBluetooth}/>
            <Subtitle title='주변기기 목록'/>
            <ScrollView style={{flex: 1, paddingBottom: 30,}}>
                <FlatList
                    data={list}
                    ListEmptyComponent={renderEmpty}
                    renderItem={renderItem}
                    />
                
                <FlatList
                    data={unpairedList}
                    renderItem={renderItem}
                />
            </ScrollView>
            
        </BluetoothListLayout>
    );
}

export default BluetoothList;