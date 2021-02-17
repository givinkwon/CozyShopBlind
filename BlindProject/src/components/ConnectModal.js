/*
    블루투스 기기 목록 중 한 개의 기기를 선택했을 때 나타나는 안내 문구 창
    해당 기기와 연결/해제에 따른 예/아니오 선택지 제공
    아니오 선택 시 아무런 동작도 하지 않고
    예 선택 시 해당 기기와 connect or disconnect 기능 수행
 */

import React, { Component } from 'react';
import { Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

class ConnectModal extends Component {
    constructor(props) {
        super(props);
    };

    render() {
        const headerText = '아래 기기와 ' + (this.props.connected ? '해제' : '연결') + '하시겠습니까?';

        return (
                /*
                    Modal Component props
                    animationType: modal 창이 표시될 때의 animation 효과
                    trasparent: true modal View의 backgroundColor를 지정해주지 않았을 때 modal 창의 뒷편(기존창)이 보임
                    visible: visible이 true일 때 modal창이 표시됨
                    onRequestClose: 하드웨어의 back button을 눌러 modal을 close할 때 수행할 작업
                */
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.props.modalVisible}
                    onRequestClose={this.props.setModalVisible}
                >
                    {/*
                        Modal visible props이 true일 때 표시되는 View
                        
                        Container: 뒷 배경 blur 처리가 되는 것처럼 유사하게 하기 위해 만든 View
                        └ View: Modal창 중 안내 창의 최상위 View
                          ├ Header: 기기와 연결할 지 해지할지 질의하는 View
                          │ └ headerText: props 형태로 받아온 connected에 따라 워딩이 연결/해제로 변경됨
                          ├ Content: 연결/해지 할 기기의 정보를 표시하는 View
                          │ ├ contentName: device의 이름 - props 형태로 부모 컴포넌트로부터 받아옴
                          │ └ contentRssi: device의 신호 강도(rssi) - props 형태로 부모 컴포넌트로부터 받아옴
                          └ Footer: 예/아니요 버튼이 들어가는 View
                            ├ modalButtonPos: 예 버튼 - props 형태로 부모 컴포넌트로부터 onPress 함수를 받아옴
                            └ modalButtonNeg: 아니요 버튼 - props 형태로 부모 컴포넌트로부터 onPress 함수를 받아옴
                    */}
                    <View style={styles.modalContainer} >
                        <View style={styles.modalView}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.headerText}>{headerText}</Text>
                            </View>
                            <View style={styles.modalContent}>
                                <Text style={styles.contentName}>{this.props.deviceName}</Text>
                                <Text style={styles.contentRssi}>RSSI: {this.props.rssi}</Text>
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableOpacity style={styles.modalButtonPos}
                                    onPress={() => this.props.onPressPositive(this.props.deviceId)}>
                                        <Text style={styles.posButtonText}>예</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButtonNeg}
                                    onPress={() => this.props.onPressNegative()}>
                                        <Text style={styles.negButtonText}>아니요</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
        );
    };
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)'
    },
    modalView: {
        width: '90%',
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 12,
        borderRadius: 20,
    },
    modalHeader: {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingTop: 12,
    },
    headerText: {
        fontSize: 22,
        fontFamily: 'NotoSansKR-Bold',
        color: '#707070',
    },
    modalContent: {
        flex: 2,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentName: {
        fontFamily: 'NotoSansKR-Bold',
        fontSize: 20,
        color: '#707070',
    },
    contentRssi: {
        fontFamily: 'NotoSansKR-Regular',
        fontSize: 15,
        color: '#707070',
    },
    modalFooter: {
        flex: 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
    },
    modalButtonPos: {
        height: '55%',
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 53,
        backgroundColor: '#87ceea',
        marginLeft: 20,
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 3,
    },
    modalButtonNeg: {
        height: '55%',
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
        borderRadius: 53,
        borderWidth: 1,
        borderColor: '#87ceea',
        marginRight: 20,
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 3,
    },
    posButtonText: {
        fontFamily: 'NotoSansKR-Bold',
        fontSize: 20,
        color: '#ffffff',
    },
    negButtonText: {
        fontFamily: 'NotoSansKR-Bold',
        fontSize: 20,
        color: '#87ceea',
    },
});

export default ConnectModal;