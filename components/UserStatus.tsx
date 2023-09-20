import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import colors from '../constants/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import GradientText from './GradientText'

export default function UserStatus(props: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  if (props.admin) {
    return (
      <LinearGradient
        colors={[colors.Black, colors.Black]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          height: 25,
          borderRadius: 50,
          width: 80,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: '900',
            fontStyle: 'italic',
            color: colors.White,
            textShadowColor: colors.White,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 5,

            letterSpacing: 1,
          }}
        >
          admin
        </Text>
      </LinearGradient>
    )
  }
  return (
    <GradientText
      onPress={() => {}}
      color1={props.mentor ? colors.Error : colors.Main}
      color2={props.mentor ? colors.Purple : colors.Green}
      style={{ fontSize: 18 }}
    >
      {props.mentor ? 'mentor' : 'student'}
    </GradientText>
  )
}
