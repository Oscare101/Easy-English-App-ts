import { Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../constants/colors'
import MaskedView from '@react-native-masked-view/masked-view'

export default function SecondaryButton(props: any) {
  return (
    <TouchableOpacity
      style={[{ width: '90%' }, props.style]}
      activeOpacity={0.8}
      onPress={() => props.action()}
    >
      <LinearGradient
        // Button Linear Gradient
        colors={[colors.Main, colors.Main]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 8,
          padding: 2,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          height: 60,
        }}
      >
        <View
          style={{
            flex: 1,
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.White,
            borderRadius: 6,
          }}
        >
          <Text style={{ fontSize: 18, color: colors.Main }}>
            {props.title}
          </Text>
          {/* <MaskedView
            style={{ height: 24 }}
            maskElement={
              <Text style={{ fontSize: 18, color: colors.White }}>
                {props.title}
              </Text>
            }
          >
            <LinearGradient
              colors={['cadetblue', '#fabada']}
              start={{ x: 1, y: 1 }}
              end={{ x: 0, y: 0.33 }}
              style={{ flex: 1 }}
            />
          </MaskedView> */}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}
