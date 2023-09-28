import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Dimensions, Linking, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StatusBar } from 'expo-status-bar';
import BarcodeMask from 'react-native-barcode-mask';
import axios from "axios"
const height=Dimensions.get('screen').height/2

export default function App() {
  const [Permission, setPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [queries,setQueries]=useState(null)

  console.log(queries)


  useEffect(() => {
    const getScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setPermission(status === 'granted');
    };

    getScannerPermissions();
  }, []);
  
  const handleClick=(data)=>setTimeout(() => Linking.openURL(data),200)
  const handleBarCodeScanned = async({ type, data }) => {
    if(!scanned){
      try {
        const res=await axios.get(data)
        setQueries(res?.data)
      } catch (error) {
        console.log(error)
      }
      setScanned(true);
      handleClick(data)
    }
  };

  if (Permission === null) {
    return <Text style={styles.text}>Request for Camera Permission</Text>;
  }
  if (Permission === false) {
    return <Text style={styles.text}>Not getting access to camera</Text>;
  }
  
  return (
    <View style={styles.container}>
      <BarCodeScanner
        
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      >
        <BarcodeMask edgeColor="#62B1F6" showAnimatedLine={false}/>
      </BarCodeScanner>
      {scanned && <Button title={'Click here to Scan Again'} onPress={() => setScanned(false)} />}
    <StatusBar style='auto'/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:"center"
  },
  text:{
    paddingTop:height,
    justifyContent: 'center',
    alignItems:"center"
  }
});






