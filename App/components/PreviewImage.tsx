import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';

export default function PreviewImage({photo, retakePicture, savePhoto}: any) {
    return (
        <View
          style={styles.container}
        >
          <ImageBackground
            source={{uri: photo && photo.uri}}
            style={styles.imageBackground}
          >
            <View
              style={styles.textContainer}
            >
              <View
                style={styles.buttonContainer}
              >
                <TouchableOpacity
                  onPress={retakePicture}
                  style={styles.button}
                >
                  <Text
                    style={styles.text}
                  >
                    Re-take
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={savePhoto}
                  style={styles.button}
                >
                  <Text
                    style={styles.text}
                  >
                    save photo
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
    },
    imageBackground: {
        flex: 1
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 15,
        justifyContent: 'flex-end'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        width: 130,
        height: 40,
        alignItems: 'center',
        borderRadius: 4
    },
    text: {
        color: '#fff',
        fontSize: 20
    },
  });