import React from 'react'
import { Text } from 'react-native'
import MaskedView from '@react-native-masked-view/masked-view'
import { LinearGradient } from 'expo-linear-gradient'

export default function GradientText(props: any) {
  return (
    <MaskedView
      androidRenderingMode="software"
      maskElement={<Text {...props} />}
    >
      <LinearGradient
        colors={[props.color1, props.color2]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  )
}
