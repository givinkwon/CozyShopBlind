import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import UpButton from '../components/UpButton';
import DownButton from '../components/DownButton';
import HomeButton from '../components/HomeButton';
import BluetoothButton from '../components/BluetoothButton';
import SettingButton from '../components/SettingButton';
import Icon from 'react-native-vector-icons/AntDesign';

class SettingScreen extends Component {

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
                <View style={styles.content}>
                    <View style={styles.title}>
                        <Text style={{fontSize: 15}}>
                            1. 수동 Up 버튼을 통해 블라인더를 모두 올려주세요.{"\n"}
                            2. 설정값 셋팅 시작하기 버튼을 눌러주세요{"\n"}
                            3. 블라인더가 설치된 창문에 적절하게 내려왔을 때 Stop 버튼을 눌러주세요
                        </Text>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', alignItems: 'center',  borderColor: 'skyblue', backgroundColor:'skyblue', borderRadius: 50, marginBottom: 30}}>
                        <View style={{height: '100%', width:'60%', alignItems: 'center', justifyContent: 'center', paddingLeft: 30}}>
                            <Text style={{fontSize:40, color: 'white'}}> 현재 설정값: </Text>
                        </View>
                        <View style={{width:'40%', height: '100%', alignItems: 'flex-end',justifyContent:'center', paddingRight: 30}}>
                            <Text style={{fontSize:35, fontWeight: 'bold', color: 'white'}}> {this.props.initPos/100} m</Text>
                        </View>
                    </View>
                    <View style={{width: '100%', height: '45%', flexDirection: 'row'}}>
                        <View style={styles.setting}>
                            <Text style={styles.buttonfont}>
                                설정값 세팅
                            </Text>
                            <TouchableOpacity>
                                <Icon name="play"
                                size={50}
                                color='lightskyblue' />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Icon name="closecircle"
                                size={50}
                                color='lightskyblue'
                                onPress = {this.props.onPressInit}
                            />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.auto}>
                            <Text style={styles.buttonfont}>
                                수동
                            </Text>
                            <UpButton />
                            <DownButton />
                        </View>
                    </View>
                </View>
                <View style={styles.footer}>
                    <HomeButton onPress={this.handleHomeButton.bind(this)} isSelected={false} />
                    <BluetoothButton onPress={this.handleBluetoothButton.bind(this)} isSelected={false} />
                    <SettingButton onPress={this.handleSettingButton.bind(this)} isSelected={true} />
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
    title:{
        height: '20%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'skyblue',
        marginTop: 50,
        marginBottom: 30,
        borderRadius: 50,
        
    },
    content:{
        flex: 1,
        padding: 20,
    },
    button:{
        flexDirection: 'row',
    },
    auto:{
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
    },
    setting:{
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
        backgroundColor: '#f2f2f2'
    },
})

export default SettingScreen;