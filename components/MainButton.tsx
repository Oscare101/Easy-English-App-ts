import { Text, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../constants/colors'
import rules from '../constants/rules'

export default function MainButton(props: any) {
  return (
    <TouchableOpacity
      style={[
        {
          width: rules.componentWidthPercent,
          opacity: props.disable ? 0.5 : 1,
          marginTop: 8,
          borderRadius: 8,
          overflow: 'hidden',
        },
        props.style,
      ]}
      activeOpacity={0.8}
      disabled={props.disable}
      onPress={() => props.action()}
    >
      <LinearGradient
        // Button Linear Gradient
        colors={[colors.Main, colors.Main]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          padding: 10,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          height: 60,
        }}
      >
        <Text style={{ fontSize: 18, color: colors.White }}>{props.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}
