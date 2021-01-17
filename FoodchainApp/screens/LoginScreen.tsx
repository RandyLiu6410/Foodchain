import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text, View, TextInput, KeyboardAvoidingView } from '../components/Themed';
import BottomSheet from 'reanimated-bottom-sheet';

export interface LoginProps {
    login: any;
}

const Login: React.FC<LoginProps> = (props) => {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [username_su, setUsername_su] = React.useState('');
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
      <View style={styles.bottomSheet} lightColor="black" darkColor="white">
        <Text style={styles.appNameLarge_bs} lightColor="white" darkColor="black">FOODCHAIN</Text>
        <TextInput 
          lightColor="black" 
          darkColor="white"
          placeholderTextColor="gray"
          style={styles.textInput_bs}
          onChangeText={text => setUsername_su(text)}
          value={username_su}
          placeholder={'Username'}
          textContentType='username'
          autoFocus = {true}
        />
        <TextInput 
          lightColor="black" 
          darkColor="white"
          placeholderTextColor="gray"
          style={styles.textInput_bs}
          onChangeText={text => setPassword_su(text)}
          value={password_su}
          placeholder={'Password'}
          secureTextEntry={true}
        />
        <TextInput
          lightColor="black" 
          darkColor="white"
          placeholderTextColor="gray"
          style={styles.textInput_bs}
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
            <View lightColor="white" darkColor="black" style={styles.loginview}>
            <Text lightColor="black" darkColor="white" style={styles.appNameLarge}>FOODCHAIN</Text>
            <TextInput 
                placeholderTextColor="gray"
                style={styles.textInput}
                onChangeText={text => setUsername(text)}
                value={username}
                placeholder={'Username'}
                textContentType='username'
            />
            <TextInput 
                placeholderTextColor="gray"
                style={styles.textInput}
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder={'Password'}
                secureTextEntry={true}
            />
            <TouchableOpacity onPress={login} disabled={username === '' && password === ''}>
                <View style={username === '' || password === '' ? styles.loginButton_disable : styles.loginButton}>
                <Text style={styles.loginText}>Login</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openBottomSheet()}>
                <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
            <Text style={styles.message}>{message}</Text>
            </View>
            <BottomSheet
            ref={sheetRef}
            snapPoints={[350, 0]}
            borderRadius={25}
            renderContent={renderContent}
            initialSnap={1}
            />
        </KeyboardAvoidingView>
    );
  
    async function login() {
      await fetch(`http://54.226.5.241:5000/user/login?username=${username}&password=${password}`, {
        method: 'POST'
      })
      .then(res => {
        res.json()
        .then((m) => {
            props.login(res.ok, m.logorg);
            setMessage(m.status);
        });
      })
    }
  
    async function signup() {
      await fetch(`http://54.226.5.241:5000/user?username=${username_su}&password=${password_su}`, {
        method: 'POST'
      })
      .then((res) => {
        res.json().then((m) => setMessage_su(m));
  
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
    },
    loginview: {
      marginHorizontal: "20%",
      marginVertical: "50%"
    },
    appNameLarge: {
      fontSize: 30,
      alignSelf: 'center',
      marginBottom: 5
    },
    textInput: {
      height: 40,
      width: '100%',
      borderWidth: 1,
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
    signupText: {
      color: '#246bbd',
      fontSize: 15,
      marginVertical: 10,
      alignContent: 'center',
      alignSelf: 'center'
    },
    bottomSheet: {
      padding: 30
    },
    appNameLarge_bs: {
      fontSize: 30,
      alignSelf: 'center',
      marginTop: 10
    },
    textInput_bs: {
      height: 40,
      width: '100%',
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