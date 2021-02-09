import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import HomeButton from '../components/HomeButton';
import SettingButton from '../components/SettingButton';
import UpButton from '../components/UpButton';
import DownButton from '../components/DownButton';
import BluetoothButton from '../components/BluetoothButton';

class MainScreen extends Component {

    handleHomeButton(){
        this.props.navigation.navigate("Main");
    }

    handleSettingButton(){
        this.props.navigation.navigate("Setting");
    }
        
    handleBluetoothButton(){
        this.props.navigation.navigate("Bluetooth");
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text>로고</Text>
                    <Image source={{uri:'https://pds.saramin.co.kr/company/logo/202011/09/qjijdt_urc5-1cs92y6_logo.jpg'}}
                    style={{height:'100%', width: '100%', resizeMode: 'contain'}}/>
                </View>
                <View style={styles.title}>
                    <Text>이미지 및 설명</Text>
                    <Image source={{uri:'https://www.cozyshop.kr/shop/data/editor/godo_mall/blind/2020_dexter_wood/dexter_wood_02.jpg'}}
                        style={{height:'100%', width:'100%', resizeMode:'contain'}}
                        />
                </View>
                <View style={styles.content}>
                    <View style={styles.auto}>
                        <Text style={styles.buttonfont}>자동</Text>
                        <UpButton />
                        <DownButton />
                    </View>
                    <View style={styles.manu}>
                        <Text style={styles.buttonfont}>수동</Text>
                        <UpButton />
                        <DownButton />
                    </View>
                </View>
                <View style={styles.footer}>
                    <HomeButton onPress={this.handleHomeButton.bind(this)}/>
                    <BluetoothButton onPress={this.handleBluetoothButton.bind(this)} />
                    <SettingButton onPress={this.handleSettingButton.bind(this)}/>
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
        height: '10%',
        paddingRight: 200,
        alignItems: 'center',
    },
    title:{
        width: '100%',
        height: '40%',
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content:{
        flex: 1,
        flexDirection: 'row',
    },
    auto:{
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    manu:{
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    buttonfont:{
        fontSize: 30,
    },
    footer:{
        flexDirection: 'row',
        width: '100%',
        height: '8%',
        marginTop: 50,
    }
})

export default MainScreen;