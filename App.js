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
import MusicControl from 'react-native-music-control';
import {Command} from 'react-native-music-control';
import RNFetchBlob from 'rn-fetch-blob';
import RNFS from 'react-native-fs';
import {PERMISSIONS, request} from 'react-native-permissions';

const audioDirectory = '/storage/emulated/0/Music';

import {useDispatch, useSelector} from 'react-redux';
import {AddSONG} from './redux/action';

const App = () => {
  const [music, setMusic] = useState(null);
  const [musicsArr, setMusicArr] = useState([]);

  const dispatch = useDispatch();

  const musics = useSelector(state => state.MusicReducer.musics);

  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();

    // let obj={
    //   url:'file:///storage/emulated/0/Music/SpotiFlyer/Tracks/Ik_Mulaqaat.mp3',
    //   name:"EK Mulakat"
    // }
    //     setMusic(obj)
    //      TrackPlayer.add(obj);
    //      TrackPlayer.play();
  };

  const fetchData = path => {
    console.log('PAth', path);
    if (path?.includes('mp3')) {
      console.log('inside if', path);
      // const arr = [...musicsArr];

      // arr.push(path);

      dispatch(AddSONG(path));

      // setMusicArr([...arr]);
    } else {
      console.log('Called in else....');
      RNFS.readDir(path).then(res => {
        console.log('RES____', res);
        if (res?.path?.includes('mp3')) {
          console.log('INSIDE IF>>>>>>>');
        } else {
          console.log('inside else....', res);
          res.map(res2 => {
            if (res2.path) {
              console.log('Called in else if');
              fetchData(res2.path);
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    request(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO).then(result => {
      // …

      console.log('Result.....', result);
      RNFS.readDir(audioDirectory)
        .then(result => {
          console.log('GOT RESULT', result);

          // filter the files by extension
          const audioFiles = result.filter(file => file);

          return audioFiles;
        })
        .then(audioFiles => {
          console.log('AUDIO FILES:', audioFiles);
          //  RNFS.readDir(audioFiles[2].path).then((res)=>{
          //   console.log('res',res)
          //   RNFS.readDir(res[0].path).then((res2)=>{
          //     console.log('res 2',res2)
          //    })
          //  })

          audioFiles.map(res => {
            console.log('RES.PATH', res.path);
            fetchData(res.path);
          });
        })
        .catch(err => {
          console.log(err.message, err.code);
        });
    });
  }, []);

  useEffect(() => {
    setupPlayer();
  }, []);

  useEffect(() => {
    MusicControl.setNowPlaying({
      title: 'Billie Jean',
      artwork: 'https://i.imgur.com/e1cpwdo.png', // URL or RN's image require()
      artist: 'Michael Jackson',
      album: 'Thriller',
      genre: 'Post-disco, Rhythm and Blues, Funk, Dance-pop',
      duration: 300, // (Seconds)
      description: '', // Android Only
      color: 0xffffff, // Android Only - Notification Color
      colorized: true, // Android 8+ Only - Notification Color extracted from the artwork. Set to false to use the color property instead
      date: '1983-01-02T00:00:00Z', // Release Date (RFC 3339) - Android Only
      rating: 84, // Android Only (Boolean or Number depending on the type)
      notificationIcon: 'my_custom_icon', // Android Only (String), Android Drawable resource name for a custom notification icon
      isLiveStream: true, // iOS Only (Boolean), Show or hide Live Indicator instead of seekbar on lock screen for live streams. Default value is false.
    });

    MusicControl.enableControl('play', true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableBackgroundMode(true);
    MusicControl.enableControl('nextTrack', true);
    MusicControl.enableControl('previousTrack', false);
    // MusicControl.enableControl('stop', false)
    // MusicControl.enableControl('nextTrack', true)
    // MusicControl.enableControl('previousTrack', false)

    // MusicControl.enableControl('changePlaybackPosition', true)
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

      MusicControl.updatePlayback({
        state: MusicControl.STATE_PLAYING, // (STATE_ERROR, STATE_STOPPED, STATE_PLAYING, STATE_PAUSED, STATE_BUFFERING)
        speed: 1, // Playback Rate
        elapsedTime: 5, // (Seconds)
        bufferedTime: 200, // Android Only (Seconds)
        volume: 10, // Android Only (Number from 0 to maxVolume) - Only used when remoteVolume is enabled
        maxVolume: 10, // Android Only (Number) - Only used when remoteVolume is enabled
        rating: MusicControl.RATING_PERCENTAGE, // Android Only (RATING_HEART, RATING_THUMBS_UP_DOWN, RATING_3_STARS, RATING_4_STARS, RATING_5_STARS, RATING_PERCENTAGE)
      });

      MusicControl.on(Command.play, async () => {
        // this.props.dispatch(playRemoteControl());
        TrackPlayer.play();
      });

      MusicControl.on(Command.pause, () => {
        // this.props.dispatch(pauseRemoteControl());
        TrackPlayer.pause();
      });

      // console.log('playMusic', playMusic);
    });
  };

  useEffect(() => {
    const musicPath = RNFetchBlob.fs.dirs.MusicDir;

    RNFetchBlob.fs
      .ls(musicPath)
      .then(files => {
        console.log('Music files:', files);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <SafeAreaView
      style={{backgroundColor: 'white', flex: 1, alignItems: 'center'}}>
      {console.log('musics', musics)}
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
                // MusicControl.on(Command.pause, ()=> {
                TrackPlayer.play();
                // })
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
                // MusicControl.on(Command.pause, ()=> {
                // this.props.dispatch(pauseRemoteControl());
                TrackPlayer.pause();
                // })
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
