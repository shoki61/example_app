/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import axios from 'axios';
import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

let responseCharacters: object[] = [];

type Character = {
  name: String;
  status: String;
  image: String;
  originName: String;
};

const CheckBox = ({
  onPress = () => {},
  value,
}: {
  onPress: Function;
  value: boolean;
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  return (
    <TouchableOpacity
      onPress={() => {
        onPress(!currentValue);
        setCurrentValue(prev => !prev);
      }}
      style={{
        width: 40,
        height: 40,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: currentValue ? 'purple' : '#ccc',
      }}>
      <Text>✓</Text>
    </TouchableOpacity>
  );
};

const Character = ({name, status, image, originName}: Character) => {
  return (
    <View style={styles.characterContainer}>
      <Image style={styles.image} source={{uri: image}} />
      <View style={{padding: 10}}>
        <Text style={{marginBottom: 10}}>{name}</Text>
        <Text>{status}</Text>
        <Text>{originName}</Text>
      </View>
    </View>
  );
};

function App(): React.JSX.Element {
  const [characters, setCharacters] = useState<object[]>([]);
  const [status, setStatus] = useState('');
  const [origins, setOrigins] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get('https://rickandmortyapi.com/api/character')
      .then(res => {
        responseCharacters = res.data.results;
        setCharacters(res.data.results);
      })
      .catch(e => {
        Alert.alert('Beklenmedik hata oluştu');
      });
  }, []);

  const renderItem = ({item}) => {
    return (
      <Character
        name={item.name}
        status={item.status}
        image={item.image}
        originName={item.origin.name}
      />
    );
  };

  const search = (v: string) => {
    let allCharacters = [...responseCharacters].filter(item => {
      if (status || origins.length) {
        if (origins.length) {
          return (
            item.name.toLowerCase().includes(v.toLowerCase()) &&
            item.status == status &&
            origins.includes(item.name)
          );
        } else {
          return (
            item.name.toLowerCase().includes(v.toLowerCase()) &&
            item.status == status
          );
        }
      } else {
        return item.name.toLowerCase().includes(v.toLowerCase());
      }
    });

    setCharacters(allCharacters);
  };

  useEffect(() => {
    if (!status && !origins.length) {
      return setCharacters(responseCharacters);
    }
    if (origins.length && !status) {
      setCharacters(
        responseCharacters.filter(item => {
          let originName = item.origin.name.includes('Earth')
            ? 'Earth'
            : 'unknown';
          return origins.includes(originName);
        }),
      );
    } else {
      setCharacters(responseCharacters.filter(item => item.status == status));
    }
  }, [status]);

  useEffect(() => {
    let result: object[] = [];
    if (!origins.length) {
      return setCharacters(
        status.length
          ? responseCharacters.filter(item => item.status == status)
          : responseCharacters,
      );
    }
    for (let i = 0; i < responseCharacters.length; i++) {
      let originName = responseCharacters[i].origin.name.includes('Earth')
        ? 'Earth'
        : 'unknown';
      if (origins.includes(originName)) {
        if (status.length) {
          if (responseCharacters[i].status == status) {
            result.push(responseCharacters[i]);
          }
        } else {
          result.push(responseCharacters[i]);
        }
      }
    }
    setCharacters(result);
  }, [origins]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{width: '100%', flex: 1, padding: 20}}>
        <View style={{width: '100%'}}>
          <TextInput
            onChangeText={search}
            style={styles.input}
            placeholder="search"
            placeholderTextColor={'#444'}
          />
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox
                value={status == 'Alive'}
                onPress={(v: boolean) => {
                  setStatus(v ? 'Alive' : '');
                }}
              />
              <Text style={{marginLeft: 5}}>Canlı{status}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox
                value={status == 'Dead'}
                onPress={(v: string) => {
                  setStatus(v ? 'Dead' : '');
                }}
              />
              <Text style={{marginLeft: 5}}>Ölü</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <CheckBox
                value={status == 'unknown'}
                onPress={(v: boolean) => {
                  setStatus(v ? 'unknown' : '');
                }}
              />
              <Text style={{marginLeft: 5}}>Bilinmiyor</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox
                value={origins.includes('Earth')}
                onPress={(v: boolean) => {
                  if (origins.includes('Earth')) {
                    setOrigins(origins.filter(item => item !== 'Earth'));
                  } else {
                    setOrigins([...origins, 'Earth']);
                  }
                }}
              />
              <Text style={{marginLeft: 5}}>Dünya</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CheckBox
                value={origins.includes('unknown')}
                onPress={(v: string) => {
                  if (origins.includes('unknown')) {
                    setOrigins(origins.filter(item => item !== 'unknown'));
                  } else {
                    setOrigins([...origins, 'unknown']);
                  }
                }}
              />
              <Text style={{marginLeft: 5}}>Bilinmiyor</Text>
            </View>
          </View>
        </View>
        <FlatList
          columnWrapperStyle={{justifyContent: 'space-between'}}
          numColumns={2}
          data={characters}
          renderItem={renderItem}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    width: '100%',
    height: 45,
    borderRadius: 99,
    borderWidth: 2,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  characterContainer: {
    width: '47%',
    height: 200,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: '50%',
  },
});

export default App;
