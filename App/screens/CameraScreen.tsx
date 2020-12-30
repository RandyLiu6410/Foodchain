import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 

import { Text, View } from '../components/Themed';

import { PhotoContext } from '../services/PhotoContext';

export default function CameraScreen() {
  let camera: Camera;
  const navigation = useNavigation();

  const [context, setContext] = React.useContext(PhotoContext);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [type, setType] = React.useState(Camera.Constants.Type.back);
  const [capturedImage, setCapturedImage] = React.useState<any>(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const __takePicture = async () => {
    if (!camera) return;
    const photo = await camera.takePictureAsync();
    setCapturedImage(photo);
    setContext({image: photo})
    navigation.goBack();
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    // <PhotoContext.Provider value={{
    //     image: capturedImage
    // }}>
        <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={(r) => {camera = r}}>
            <View style={styles.buttonContainer}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => {
                setType(
                    type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
                }}>
                <Ionicons size={35} style={styles.flipicon} name="camera-reverse-outline" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={__takePicture}>
                <MaterialIcons name="camera" size={50} color="white" />
            </TouchableOpacity>
            </View>
        </Camera>
        </View>
    // </PhotoContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10
  },
  separator: {
    marginVertical: 30,
    height: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    marginVertical: 20,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  flipicon: {
    color: 'white',
  },
  shoticon: {
    color: 'black',
    backgroundColor: 'white'
  }
});
