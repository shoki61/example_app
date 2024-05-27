import {useEffect, useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';

const CheckBox = ({
  onPress = () => {},
  value,
  title,
}: {
  onPress: Function;
  value: boolean;
  title: string;
}) => {
  const [currentValue, setCurrentValue] = useState(value);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
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
      <Text style={{marginLeft: 5}}>{title}</Text>
    </View>
  );
};

export default CheckBox;
