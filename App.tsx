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
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import CheckBox from './components/Checkbox';
import Character from './components/Character';

let responseCharacters: object[] = [];

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
        let originName = item.name.includes('Earth') ? 'Earth' : 'unknown';
        if (origins.length && !status) {
          return (
            item.name.toLowerCase().includes(v.toLowerCase()) &&
            origins.includes(originName)
          );
        } else if (!origins.length && status) {
          return (
            item.name.toLowerCase().includes(v.toLowerCase()) &&
            item.status == status
          );
        }
        return (
          item.name.toLowerCase().includes(v.toLowerCase()) &&
          item.status == status &&
          origins.includes(originName)
        );
      } else {
        return item.name.toLowerCase().includes(v.toLowerCase());
      }
    });

    setCharacters(allCharacters);
  };

  useEffect(() => {
    getByStatus();
  }, [status]);

  const getByStatus = () => {
    setOrigins([]);
    axios
      .get(`https://rickandmortyapi.com/api/character/?status=${status}`)
      .then(res => {
        responseCharacters = res.data.results;
        setCharacters(res.data.results);
      })
      .catch(e => {
        Alert.alert('Beklenmedik hata oluştu');
      });
  };

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
          <CheckBox
            title="Canlı"
            value={status == 'Alive'}
            onPress={(v: boolean) => {
              setStatus(v ? 'Alive' : '');
            }}
          />
          <CheckBox
            value={status == 'Dead'}
            onPress={(v: string) => {
              setStatus(v ? 'Dead' : '');
            }}
            title="Ölü"
          />
          <CheckBox
            value={status == 'unknown'}
            onPress={(v: boolean) => {
              setStatus(v ? 'unknown' : '');
            }}
            title="Bilinmiyor"
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            justifyContent: 'space-between',
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
            title="Dünya"
          />

          <CheckBox
            value={origins.includes('unknown')}
            onPress={(v: string) => {
              if (origins.includes('unknown')) {
                setOrigins(origins.filter(item => item !== 'unknown'));
              } else {
                setOrigins([...origins, 'unknown']);
              }
            }}
            title="Bilinmiyor"
          />
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
  input: {
    width: '100%',
    height: 45,
    borderRadius: 99,
    borderWidth: 2,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});

export default App;
