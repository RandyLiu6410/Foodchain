import * as React from 'react';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInputMask } from 'react-native-masked-text';
import DropDownPicker from 'react-native-dropdown-picker';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import PreviewImage from '../components/PreviewImage';

import { PhotoContext } from '../services/PhotoContext';

export default function UploadScreen() {
  const navigation = useNavigation();
  const [context, setContext] = React.useContext(PhotoContext);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [log, setLog] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [dateValid, setDateValid] = React.useState(true);
  const begin = moment().format('YYYY/MM/DD h:mm:ss');
  var datetimeFieldRef = null;

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const __savePhoto = () => {}

  const __retakePicture = () => {
    navigation.navigate('CameraScreen');
  }

  const upload = () => {
    setDateValid(datetimeFieldRef.isValid());
    if(!datetimeFieldRef.isValid()) return;

  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Log</Text>
        <DropDownPicker
          items={[
              {label: 'USA', value: 'usa'},
              {label: 'UK', value: 'uk'},
              {label: 'France', value: 'france'}
          ]}
          defaultValue={log}
          containerStyle={{height: 40}}
          style={{backgroundColor: '#fafafa'}}
          itemStyle={{
              justifyContent: 'flex-start'
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          onChangeItem={item => setLog(item.value)}
        />
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {
          context ? 
          <PreviewImage photo={context} savePhoto={__savePhoto} retakePicture={__retakePicture} /> 
          :
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('CameraScreen')}>
            <Ionicons size={100} style={styles.icon} name="camera-outline" />
          </TouchableOpacity>
        }
        <View style={styles.dateContainer}>
          <TextInput style={styles.textInput} placeholder="title" value={title} onChangeText={text => setTitle(text)}/>
          <Text>{begin}</Text>
          <Text>To</Text>
          <TextInputMask
            type={'datetime'}
            options={{
              format: 'YYYY/MM/DD HH:mm:ss'
            }}
            value={end}
            onChangeText={text => setEnd(text)}
            style={styles.textInput}
            ref={(ref) => datetimeFieldRef = ref}
          />
          {
            dateValid ? <View /> : <Text>Date formate is wrong</Text>
          }
        </View>
        <TouchableOpacity style={styles.uploadButton} onPress={upload}>
          <Text style={styles.text}>Upload</Text>
        </TouchableOpacity>
        {/* <EditScreenInfo path="/screens/UploadScreen.tsx" /> */}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
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
  button: {
    height: '30%',
    width: '90%',
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  icon: {
    color: 'white'
  },
  textInput: {
    height: 30,
    width: 300,
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  uploadButton: {
    backgroundColor: 'blue',
    width: 60,
    height: 30,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 10
  },
  text: {
    color: 'white'
  }
});
