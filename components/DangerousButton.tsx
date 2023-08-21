import { Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../constants/colors'
import MaskedView from '@react-native-masked-view/masked-view'

export default function DangerousButton(props: any) {
  return (
    <TouchableOpacity
      style={[
        {
          width: '90%',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
          marginTop: 15,
        },
        props.style,
      ]}
      activeOpacity={0.8}
      onPress={() => props.action()}
    >
      <Text style={{ fontSize: 18, color: colors.Error }}>{props.title}</Text>
    </TouchableOpacity>
  )
}
