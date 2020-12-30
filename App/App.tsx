import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Remote debugger']);
LogBox.ignoreAllLogs(true);
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import UserContext from './services/UserContext';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import Login from './screens/Login';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [authorized, setAuthorized] = React.useState(true);
  const [username, setUsername] = React.useState('');
  const [logorg, setLogorg] = React.useState(0);

  if (!isLoadingComplete) {
    return null;
  } else {
    if(authorized)
    {
      return(
      <UserContext.Provider value={{
        name: username, logorg: logorg
      }}>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </UserContext.Provider>
      )
    }
    else{
      return(
        <Login login={(auth: boolean, _username: string, _logorg: number) => {
          setAuthorized(auth);
          setUsername(_username);
          setLogorg(_logorg);
        }}/>
      )
    }
  }
}
