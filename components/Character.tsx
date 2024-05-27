import {Image, StyleSheet, Text, View} from 'react-native';

type Character = {
  name: String;
  status: String;
  image: String;
  originName: String;
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

const styles = StyleSheet.create({
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
export default Character;
