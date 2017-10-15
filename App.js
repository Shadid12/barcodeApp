import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import axios from 'axios';

export default class BarcodeScannerExample extends React.Component {
  state = {
    hasCameraPermission: null,
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({hasCameraPermission: status === 'granted'});
    }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={{ flex: 1 }}>
          <BarCodeScanner
            onBarCodeRead={this._handleBarCodeRead}
            style={StyleSheet.absoluteFill}
          />
          <Text>Some Text</Text>
        </View>
      );
    }
  }

  _cancel() {
    console.log("Pressed Cancel");
  }

  _sendData(data) {
        axios.post('https://shadid12.herokuapp.com/item', {
          geocode: data
        })
        .then(function (response) {
          Alert.alert('Successfully sent !!', 'Barcode sent to database',
            [
              { text: 'OK', onPress: () => console.log('successfull') }
            ]
          )
        })
        .catch(function (error) {
          console.log(error);
        });
  }

  _handleBarCodeRead = ({ type, data }) => {
    Alert.alert(
      'Barcode Scanned',
      `Bar code with type ${type} and data ${data} has been scanned!`,
      [
        {text: 'Cancel', onPress: () => this._cancel()},
        {text: 'Send', onPress: () => this._sendData(data)},
      ],
      { cancelable: false }
    )
  }
}