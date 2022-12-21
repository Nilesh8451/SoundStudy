import React, {useEffect, useState} from 'react';
import {
  PermissionsAndroid,
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
import MusicFiles from 'react-native-get-music-files';

const App = () => {
  const [music, setMusic] = useState(null);

  const setupPlayer = async () => {
    await TrackPlayer.setupPlayer();
  };

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


  const getMusicFile =async ()=>{
    try{
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "Cool Photo App Camera Permission",
        message:
          "Cool Photo App needs access to your camera " +
          "so you can take awesome pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
      MusicFiles.getAll({
        blured : true, // works only when 'cover' is set to true
        artist : true,
        duration : true, //default : true
        cover : false, //default : true,
        genre : true,
        title : true,
        cover : true,
        minimumSongDuration : 10000, // get songs bigger than 10000 miliseconds duration,
        fields : ['title','albumTitle','genre','lyrics','artwork','duration'] // for iOs Version
    }).then(tracks => {
      console.log("Track files........",tracks)
        // do your stuff...
    }).catch(error => {
      console.log("Track files error........",error)

        // catch the error
    })
  
    } else {
      console.log("Camera permission denied");
    }
  } catch (err) {
  }
  }
  
  useEffect(()=>{

   
    // getMusicFile()
    MusicFiles.getAll({
      blured : true, // works only when 'cover' is set to true
      artist : true,
      // duration : true, //default : true
      // cover : false, //default : true,
      // genre : true,
      // title : true,
      // cover : true,
      // minimumSongDuration : 10000, // get songs bigger than 10000 miliseconds duration,
      // fields : ['title','albumTitle','genre','lyrics','artwork','duration'] // for iOs Version
      }).then(tracks => {
      console.log("Track files........",tracks)
        // do your stuff...
    }).catch(error => {
      console.log("Track files error........",error)

        // catch the error
    })



    
  },[])

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
