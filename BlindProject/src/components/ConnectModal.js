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
                <Modal
                    animationType='fade'
                    transparent={true}
                    visible={this.props.modalVisible}
                    onRequestClose={this.props.setModalVisible}
                >
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
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    },
    modalView: {
        width: '90%',
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f6f6',
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        borderRadius: 20,
    },
    modalHeader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        //backgroundColor: 'green',
        paddingTop: 24,
    },
    headerText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#707070',
    },
    modalContent: {
        flex: 3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: 'blue',
    },
    contentName: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#707070',
    },
    contentRssi: {
        fontSize: 17,
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
        height: '60%',
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 53,
        backgroundColor: '#87ceea',
        marginLeft: 20,
    },
    modalButtonNeg: {
        height: '60%',
        width: '35%',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 53,
        borderWidth: 1,
        borderColor: '#87ceea',
        marginRight: 20,

    },
    posButtonText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#ffffff',
    },
    negButtonText: {
        fontWeight: 'bold',
        fontSize: 22,
        color: '#87ceea',
    },
});

export default ConnectModal;