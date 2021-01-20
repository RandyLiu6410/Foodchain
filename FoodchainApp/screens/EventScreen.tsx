import * as React from 'react';
import { StyleSheet, RefreshControl } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import AppLoading from 'expo-app-loading';

import EventItem from '../components/EventItem';
import { Text, View, ScrollView } from '../components/Themed';

export default function EventScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [isReady, setIsReady] = React.useState(false);
  const [lognos, setLognos] = React.useState([]);
  const [log, setLog] = React.useState('');
  const [section, setSection] = React.useState({});
  const logorg = "0xc0c14cb0b4861e945998154c47ef39994cce89856998bee7c14fea8af0762270";

  if (!isReady) {
    return (
      <AppLoading
        startAsync={_cacheResourcesAsync}
        onFinish={() => setIsReady(true)}
        onError={console.warn}
      />
  ); }

  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);

  //   fetch(`http://54.226.5.241:5000/foodchain/newfoodsection?logno=${log}`)
  //   .then((res) => res.json())
  //   .then(data => {
  //     setSection(data);
  //     setRefreshing(false);
  //   })
  // }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          fetch(`http://54.226.5.241:5000/foodchain/newfoodsection?logno=${item.value}&START_BLOCK=0`)
          .then((res) => res.json())
          .then(data => {
            setSection(data);
          });
          setLog(item.value);
        }}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      {
        section.section ?
        <View>
          <Text style={styles.title}>{section.content[0].logname}</Text>
          <ScrollView>
          {
            section.section.map(s => {
              return <EventItem section={s}/>
            })
          }
          </ScrollView>
        </View>
        :
        <View />
      }
    </ScrollView>
  );

  async function _cacheResourcesAsync() {
    const cache = await fetch(`http://54.226.5.241:5000/foodchain/logno?START_BLOCK=173298&logorg=${logorg}`)
    .then((res) => res.json())
    .then(data => {
      setLognos(data.map(d => {
        return {label: d, value: d}
      }));
    });
    return cache;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'center',
    paddingBottom: 10
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});
