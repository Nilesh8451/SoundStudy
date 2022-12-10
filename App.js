import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import TrackPlayer from 'react-native-track-player';
import DocumentPicker from 'react-native-document-picker';

const App = () => {
  const [music, setMusic] = useState(null);

  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();
  };

  useEffect(() => {
    setupPlayer();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const selectAudio = async () => {
    DocumentPicker.pick({
      type: [
        'audio/aac',
        'application/x-cdf',
        'audio/midi',
        'audio/x-midi',
        'audio/mpeg',
        'audio/ogg',
        'audio/opus',
        'audio/wav',
        'audio/webm',
      ],
    }).then(async res => {
      console.log('result', res);
      let obj = {
        ...res?.[0],
        url: res?.[0]?.uri,
      };
      setMusic(obj);

      await TrackPlayer.add(obj);
      const playMusic = await TrackPlayer.play();

      console.log('playMusic', playMusic);
    });
  };

  return (
    <SafeAreaView
      style={{backgroundColor: 'white', flex: 1, alignItems: 'center'}}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {music?.name ? (
        <>
          <Text
            style={{
              color: 'black',
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 100,
            }}>
            Selected Music
          </Text>
          <Text style={{color: 'black', fontSize: 20}}>{music?.name}</Text>

          <View style={{flexDirection: 'row', marginTop: 30}}>
            <TouchableOpacity
              style={{
                width: 100,
                height: 50,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => {
                TrackPlayer.play();
              }}>
              <Text style={{color: 'white'}}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 100,
                height: 50,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 50,
              }}
              onPress={() => {
                TrackPlayer.pause();
              }}>
              <Text style={{color: 'white'}}>Pause</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}

      <TouchableOpacity
        style={{
          width: 200,
          height: 50,
          marginTop: 100,
          backgroundColor: 'black',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        onPress={() => {
          selectAudio();
        }}>
        <Text style={{color: 'white'}}>
          {music?.name ? 'Select Another Audio' : 'Select Audio'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default App;
