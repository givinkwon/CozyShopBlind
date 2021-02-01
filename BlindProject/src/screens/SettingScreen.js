import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import HomeButton from '../components/HomeButton';
import SettingButton from '../components/SettingButton';


class SettingScreen extends Component{

    handleHomeButton(){
        this.props.navigation.navigate("Main");
    }

    handleSettingButton(){
        this.props.navigation.navigate("Setting");
    }

    render(){
        return (
            <View style={styles.container}>
                <View style={styles.content}>

                    <View style={styles.image}>
                        <Text>코지샵 설명 및 이미지</Text>
                        <Image source={{uri:'https://image-se.ycrowdy.com/20200720/CROWDY_0_202007201010390054_BNSzTGL5TF.jpg'}}
                        style={{width:'100%', height:'100%', resizeMode: 'contain'}}/>
                    </View>
                    
                    <View style={styles.image}>
                        <Text>코지샵 홈페이지 확인하기</Text>
                        <Image source={{uri:'https://magazine.hankyung.com/magazinedata/images/photo/201610/04f58ba60df3617913675c235d9ac398.jpg'}}
                        style={{width:'100%', height:'100%', resizeMode: 'contain'}}/>
                    </View>

                    <View style={{flex: 1}}>
                        <TouchableOpacity style={{flex:1, alignItems: 'center', justifyContent: 'center'}}
                        onPress={() => this.props.navigation.navigate("Init")}>
                            <View style={styles.button}>
                                <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}>초기값 설정 페이지</Text> 
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flex:1, alignItems: 'center', justifyContent: 'center'}}
                        onPress={()=>alert('블라인드 정보')}>
                            <View style={styles.button}>
                                <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}>기기 정보 확인하기</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.footer}>
                    <HomeButton onPress={this.handleHomeButton.bind(this)}/>
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
    content:{
        flex: 1,
        width:'100%',
    },
    image:{
        flex: 1,
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button:{
        width: '90%',
        height: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50,
        backgroundColor: 'skyblue',
    },
    footer:{
        flexDirection: 'row',
        width: '100%',
        height: '8%',
        //marginTop: 50,
    }
})

export default SettingScreen;