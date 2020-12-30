import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, View, TouchableOpacity, Dimensions, processColor, KeyboardAvoidingView, Platform } from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';

export interface LoginProps {
    login: any;
  }
  
const Login: React.FC<LoginProps> = (props) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username_su, setUsername_su] = React.useState('');
    const [logorg_su, setLogorg_su] = React.useState(0);
    const [password_su, setPassword_su] = React.useState('');
    const [confirmpassword_su, setConfirmpassword_su] = React.useState('');
    const [message, setMessage] = React.useState('');
    const [message_su, setMessage_su] = React.useState('');
    const [color, setColor] = React.useState('gray');
    const sheetRef = React.useRef(null);
  
    function openBottomSheet() {
      sheetRef.current.snapTo(0)
      setUsername_su('');
      setPassword_su('');
      setConfirmpassword_su('');
      setMessage_su('');
      setColor('gray');
    }
  
    const renderContent = () => (
      <View style={styles.bottomSheet}>
        <Text style={styles.appNameLarge_bs}>TIMELINE</Text>
        <TextInput 
          style={styles.textInput_bs}
          onChangeText={text => setUsername_su(text)}
          value={username_su}
          placeholder={'Username'}
          textContentType='username'
          autoFocus = {true}
        />
        <TextInput 
          style={styles.textInput_bs}
          onChangeText={text => setLogorg_su(parseInt(text))}
          value={logorg_su}
          placeholder={'0'}
          autoFocus = {true}
          keyboardType='number-pad'
        />
        <TextInput 
          style={styles.textInput_bs}
          onChangeText={text => setPassword_su(text)}
          value={password_su}
          placeholder={'Password'}
          secureTextEntry={true}
        />
        <TextInput
          style={[styles.textInput_bs, {borderColor: color}]}
          onChangeText={text => {
            setConfirmpassword_su(text);
            
            if (text === '')
            {
              setColor('gray')
              setMessage_su('')
            }
            else if(text !== password_su)
            {
              setColor('red')
              setMessage_su('Passwords need to match.')
            }
            else
            {
              setColor('#32CD32')
              setMessage_su('')
            }
          }}
          value={confirmpassword_su}
          placeholder={'Confirm Password'}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={signup} disabled={username_su === '' || password_su === '' || confirmpassword_su === '' || password_su !== confirmpassword_su}>
        <View style={username_su === '' || password_su === '' || confirmpassword_su === '' || password_su !== confirmpassword_su ? styles.loginButton_disable : styles.loginButton}>
            <Text style={styles.loginText}>Sign Up</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.message}>{message_su}</Text>
      </View>
    );
  
    return (
        <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.container}>
            <View style={styles.loginview}>
              <Text style={styles.appNameLarge}>Foodchain</Text>
              <TextInput 
                style={styles.textInput}
                onChangeText={text => setUsername(text)}
                value={username}
                placeholder={'Username'}
                placeholderTextColor={'white'}
                textContentType='username'
              />
              <TextInput 
                style={styles.textInput}
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder={'Password'}
                placeholderTextColor={'white'}
                secureTextEntry={true}
              />
              <TouchableOpacity onPress={login} disabled={username === '' && password === ''}>
                <View style={username === '' || password === '' ? styles.loginButton_disable : styles.loginButton}>
                  <Text style={styles.loginText}>Login</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openBottomSheet()}>
                <Text style={styles.loginText}>Sign up</Text>
              </TouchableOpacity>
              <Text style={styles.message}>{message}</Text>
            </View>
            <BottomSheet
              ref={sheetRef}
              snapPoints={[400, 0]}
              borderRadius={25}
              renderContent={renderContent}
              initialSnap={1}
            />
          </KeyboardAvoidingView>
      );
  
    async function login() {
      await fetch(`http://localhost:8080/user/login?username=${username}&password=${password}`, {
        method: 'POST'
      })
      .then((res) => {
        if(res.ok)
        {
        
        res.json().then((m) => {
            props.login(res.ok, username, m.logorg);
            setMessage(m.status);
        });
        }
      })
      .catch((err) => {
        // throw new Error(err);
        
      })
    }
  
    async function signup() {
      await fetch(`http://localhost:8080/user?username=${username_su}&password=${password_su}&logorg=${logorg_su}`, {
        method: 'POST'
      })
      .then((res) => {
        if(res.ok)
        {
          setTimeout(() => sheetRef.current.snapTo(1), 1000);
          setUsername_su('');
          setPassword_su('');
          setConfirmpassword_su('');
          setMessage_su('');
          setColor('gray');
        }
      })
      .catch((err) => {
        // throw new Error(err);
      })
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#101010'
    },
    loginview: {
      marginHorizontal: "20%",
      marginVertical: "50%"
    },
    appNameLarge: {
      fontSize: 30,
      color: "#FFFFFF",
      alignSelf: 'center',
      marginBottom: 5
    },
    textInput: {
      height: 40,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      color: 'white',
      padding: 10,
      marginTop: 10,
      borderRadius: 10
    },
    loginButton: {
      backgroundColor: '#7B40DC',
      alignItems: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      width: '50%',
      marginTop: 26,
      marginVertical: 10,
      height: 40,
      borderRadius: 20,
    },
    loginButton_disable: {
      backgroundColor: 'gray',
      alignItems: 'center',
      alignSelf: 'center',
      alignContent: 'center',
      width: '50%',
      marginTop: 26,
      marginVertical: 10,
      height: 40,
      borderRadius: 20,
    },
    loginText: {
      color: 'white',
      fontSize: 15,
      marginVertical: 10,
      alignContent: 'center',
      alignSelf: 'center'
    },
    bottomSheet: {
      backgroundColor: "#FFFFFF",
      padding: 30
    },
    appNameLarge_bs: {
      fontSize: 30,
      color: "black",
      alignSelf: 'center',
      marginTop: 10
    },
    textInput_bs: {
      height: 40,
      width: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      color: 'black',
      padding: 10,
      marginTop: 10,
      borderRadius: 10
    },
    message: {
      color: 'red',
      fontSize: 15,
      marginTop: 8,
      marginVertical: 10,
      alignContent: 'center',
      alignSelf: 'center'
    }
});
  
export default Login;