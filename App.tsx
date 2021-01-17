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

import Login from './screens/LoginScreen';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [authorized, setAuthorized] = React.useState(false);
  const [logorg, setLogorg] = React.useState('');

  if (!isLoadingComplete) {
    return null;
  } else {
    if(authorized)
    {
      return(
      <UserContext.Provider value={{
        logorg: logorg
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

        <SafeAreaProvider>
          <Login login={(auth: boolean, _logorg: string) => {
            setAuthorized(auth);
            setLogorg(_logorg);
          }}/>
        </SafeAreaProvider>
      )
    }
  }
}
