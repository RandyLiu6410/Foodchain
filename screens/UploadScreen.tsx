import * as React from 'react';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, RefreshControl } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as FileSystem from 'expo-file-system';
import * as Crypto from 'expo-crypto';
import { sha256 } from 'js-sha256';

import useColorScheme from '../hooks/useColorScheme';
import { Text, View, ScrollView, TextInput } from '../components/Themed';
import { TextInputMask } from 'react-native-masked-text';
import PreviewImage from '../components/PreviewImage';

import { PhotoContext } from '../services/PhotoContext';

import { RNS3 } from 'react-native-aws3';

export default function UploadScreen() {
  const theme = useColorScheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [context, setContext] = React.useContext(PhotoContext);
  const [hasPermission, setHasPermission] = React.useState(false);
  const [lognos, setLognos] = React.useState([]);
  const [log, setLog] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const begin = moment().format('YYYY/MM/DD h:mm:ss');
  var datetimeFieldRef = null;
  const logorg = "0xc0c14cb0b4861e945998154c47ef39994cce89856998bee7c14fea8af0762270";

  var options = {
    keyPrefix: "Image/Group10/",
    bucket: "ai-blockchain-group10",
    region: "ap-southeast-1",
    accessKey: "AKIARXLW7RAC7J25R6XQ",
    secretKey: "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",
    successActionStatus: 201
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    _cacheResourcesAsync().then(() => setRefreshing(false));
  }, []);

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
    if(title === '') {
      setMessage('Title is empty')
      return;
    }
    if(!datetimeFieldRef.isValid()) {
      setMessage('Datetime is wrong or empty')
      return;
    }

    setMessage('');
    setUploading(true);

    const filename = `${log}_${title}_${begin}.jpg`;

    const file = {
      uri: context.uri,
      name: filename,
      type: 'image/jpeg'
    }

    RNS3.put(file, options)
    .then(async response => {
      if (response.status === 201)
      {
        FileSystem.readAsStringAsync(context.uri, {
          encoding: "base64"
        })
        .then(data => {
          Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            data,
            { encoding: Crypto.CryptoEncoding.HEX}
          )
          .then(hash => {
            const url = 'https://ai-blockchain-group10.s3-ap-southeast-1.amazonaws.com/Image/Group10/' + filename;
            
            fetch(`http://54.226.5.241:5000/foodchain/newfoodlogsection?logno=${log}&title=${title}&begin=${begin}&end=${end}&url=${url}&urlhash=${sha256(url)}&filehash=${hash}`, {
                method: 'POST'
            })
            .then(res => {
              if(res.status === 200)
              {
                alert('Success');
              }
              else
              {
                alert('Failed');
              }
              setUploading(false);
              setContext(null);
            })
          })
          .catch(err => {
            alert(err);
            setUploading(false);
          })
        })
        .catch(err => {
          alert(err);
          setUploading(false);
        })
      }
    })
  }

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  if (!isReady) {
    return (
      <AppLoading
        startAsync={_cacheResourcesAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
  ); }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <TouchableOpacity style={styles.newitem} onPress={() => navigation.navigate('NewItemScreen')}>
          <AntDesign name="pluscircleo" size={24} color={theme === 'light' ? 'black' : 'white'} />
          <Text>  New Item</Text>
        </TouchableOpacity>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <Text style={styles.title}>Log</Text>
        <DropDownPicker
          items={lognos}
          defaultValue={log}
          containerStyle={{height: 40}}
          style={{backgroundColor: '#fafafa'}}
          itemStyle={{
              justifyContent: 'flex-start'
          }}
          dropDownStyle={{backgroundColor: '#fafafa'}}
          onChangeItem={item => {
            setLog(item.value);
          }}
        />
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        {
          log !== '' ?
            context ? 
            <ScrollView style={styles.content}>
              <View style={styles.dateContainer}>
                <TextInput 
                placeholderTextColor="gray"
                style={styles.textInput} 
                placeholder="title" 
                value={title} 
                onChangeText={text => setTitle(text)}/>
                <Text>{begin}</Text>
                <Text>To</Text>
                <TextInputMask
                  placeholder="YYYY/MM/DD HH:mm:ss"
                  placeholderTextColor="gray"
                  type={'datetime'}
                  options={{
                    format: 'YYYY/MM/DD HH:mm:ss'
                  }}
                  value={end}
                  onChangeText={text => setEnd(text)}
                  style={styles.textInput}
                  ref={(ref) => datetimeFieldRef = ref}
                />
                <Text style={{color: 'red'}}>{message}</Text>
              </View>
              <PreviewImage photo={context} savePhoto={__savePhoto} retakePicture={__retakePicture} /> 
              <TouchableOpacity style={uploading ? styles.disableduploadButton : styles.uploadButton} onPress={upload} disabled={uploading}>
                <Text style={styles.text}>Upload</Text>
              </TouchableOpacity>
            </ScrollView>
            :
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('CameraScreen')}>
              <Ionicons size={100} style={styles.icon} name="camera-outline" />
            </TouchableOpacity>
          :
          <View />
        }
        
        {/* <EditScreenInfo path="/screens/UploadScreen.tsx" /> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );

  async function _cacheResourcesAsync() {
    const cache = await fetch(`http://54.226.5.241:5000/foodchain/logno?START_BLOCK=173298&logorg=${logorg}`)
    .then((res) => res.json())
    .then(data => {
      setLognos(data.map(d => {
        return {label: d, value: d}
      }));
    });
    
    setRefreshing(false);
    return cache;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  content: {
    // margin: 20
  },
  newitem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'white',
    height: 30,
    width: 300,
    borderColor: 'gray',
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    color: 'black'
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  refreshButton: {
    backgroundColor: 'gray',
    width: 60,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
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
  disableduploadButton: {
    backgroundColor: 'gray',
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
