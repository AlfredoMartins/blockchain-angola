import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button, TouchableOpacity, Platform, StatusBar } from "react-native";
import { CameraView, Camera } from "expo-camera";
import { CaretLeft } from "phosphor-react-native";

export default function CameraQR({ navigation, route}: any) {
  const { secret } = route.params;

  const [hasPermission, setHasPermission] = useState<any>(null);
  const [scanned, setScanned] = useState<any>(false);

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: any) => {
    setScanned(true);
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);

    if (data === secret) {
      alert(`VERIFIED :)! Your vote is valid.`); // Type ${type} and data ${data} were scanned!
    } else {
      alert(`FAILED :(`);
    }

  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const onPressBack = () => {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>


      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr", "pdf417"],
        }}
        style={StyleSheet.absoluteFillObject}
      />
            <View style={styles.topBar}>
        <TouchableOpacity onPress={onPressBack}>
          <CaretLeft size={36} color="white" />
        </TouchableOpacity>
      </View>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
  }, topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    marginRight: 10,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 40,
    position: 'absolute'
  },
});