import * as React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

export default function PreviewImage({photo, retakePicture, savePhoto}: any) {
    return (
        <View
          style={photo.width > photo.height ? styles.container_h : styles.container_v}
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
                  <MaterialCommunityIcons name="replay" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={savePhoto}
                  style={styles.button}
                >
                  <MaterialCommunityIcons name="download" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    container_v: {
        backgroundColor: 'transparent',
        flex: 1,
        maxWidth: 200,
        maxHeight: 400,
        alignSelf: 'center',
    },
    container_h: {
        backgroundColor: 'transparent',
        flex: 1,
        maxWidth: 400,
        maxHeight: 200,
    },
    imageBackground: {
        flex: 1,
        resizeMode: "contain",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 25,
        justifyContent: 'flex-end',
        width: '100%'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        width: 100,
        height: 40,
        alignItems: 'center',
        borderRadius: 4
    },
    text: {
        color: '#fff',
        fontSize: 25,
    },
  });