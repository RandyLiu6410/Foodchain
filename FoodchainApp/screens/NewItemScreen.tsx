import * as React from 'react';
import moment from 'moment';
import { StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, View, TextInput } from '../components/Themed';

import { sha256 } from 'js-sha256';

export default function NewItemScreen() {
  const navigation = useNavigation();
  const [logno, setLogno] = React.useState('');
  const [logname, setLogname] = React.useState('');
  const [uploading, setUploading] = React.useState(false);
  const begin = moment().format('YYYY/MM/DD h:mm:ss');
  const logorg = "Group_10";

  const upload = async () => {
    setUploading(true);

    fetch(`http://54.226.5.241:5000/foodchain/foodlog?logno=${logno}&loghash=${sha256(logno)}&logname=${logname}&logorg=${logorg}&logdate=${begin}`, {
          method: 'POST'
    })
    .then((res) => {
      if(res.status === 200)
      {
        setUploading(false);
        navigation.goBack();
      }
      else
      {
        setUploading(false);
        alert('Failed');
      }
    })
    .catch((err) => {
        setUploading(false);
        alert('Failed');
    })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Information</Text>
        <View style={styles.dateContainer}>
          <TextInput 
            // lightColor="black"
            // darkColor="white"
            placeholderTextColor="gray"
            style={styles.textInput} 
            placeholder="Log no" 
            keyboardType="numeric" 
            value={logno} 
            onChangeText={text => setLogno(text)}/>
          <TextInput 
            // lightColor="black"
            // darkColor="white"
            placeholderTextColor="gray"
            style={styles.textInput} 
            placeholder="Log name" 
            value={logname} 
            onChangeText={text => setLogname(text)}/>
          <Text>{begin}</Text>
        </View>
        <TouchableOpacity style={uploading ? styles.disableduploadButton : styles.uploadButton} onPress={upload} disabled={uploading}>
          <Text style={styles.text}>Create</Text>
        </TouchableOpacity>
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
