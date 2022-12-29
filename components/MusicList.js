import React from 'react';
import {Dimensions, FlatList, Image, Text, View} from 'react-native';
import {useSelector} from 'react-redux';

export const MusicList = () => {
  const musics = useSelector(state => state.MusicReducer.musics);

  const _renderItem = ({item, index}) => {
    return (
      <View
        style={{
          width: Dimensions.get('window').width,
          flexDirection: 'row',
          paddingVertical: 10,
          justifyContent: 'flex-start',
          borderBottomColor:'gray',
          borderBottomWidth:1,paddingHorizontal:10
        }}>
        <View style={{}}>
          <Image
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTubpkPUNnZ32gPuChF3ZCRxlccl3fFNssJEVJwBHtJQ9L0K0Z6Zxz8PiRo0CiQRsnVPhE&usqp=CAU',
            }}
            style={{width: 50, height: 50, borderRadius: 5}}
          />
        </View>
        <View style={{marginLeft: 10}}>
          <Text style={{color: 'black',fontWeight:'bold'}}>
            {
              item
                .split('/')
                .slice(item.split('/')?.length - 1)[0]
                .split('.')[0]
            }
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList data={musics} renderItem={_renderItem} />
    </View>
  );
};
