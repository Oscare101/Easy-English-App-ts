import { Text, TouchableOpacity, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../constants/colors'
import MaskedView from '@react-native-masked-view/masked-view'
import rules from '../constants/rules'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

export default function SecondaryButton(props: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  return (
    <TouchableOpacity
      style={[{ width: rules.componentWidthPercent }, props.style]}
      activeOpacity={0.8}
      onPress={() => props.action()}
    >
      {/* <LinearGradient
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
      > */}
      <View
        style={{
          flex: 1,
          height: 60,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',

          backgroundColor:
            themeColor === 'dark' ? colors.DarkBGBlue : colors.LightBGBlue,

          borderRadius: 6,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color:
              themeColor === 'dark'
                ? colors.DarkTextBlue
                : colors.LightTextBlue,
          }}
        >
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
      {/* </LinearGradient> */}
    </TouchableOpacity>
  )
}
