import { View } from 'react-native'
import { styles } from '../constants/styles'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import colors from '../constants/colors'

export default function BGCircles(props: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  return (
    <View style={styles.ViewBackGround}>
      {props.type === 1 ? (
        <>
          <View
            style={[
              styles.Circle1,
              {
                backgroundColor:
                  themeColor === 'dark'
                    ? colors.DarkTextBlue
                    : colors.LightTextBlue,
              },
            ]}
          />
          <View
            style={[
              styles.Circle2,
              {
                backgroundColor:
                  themeColor === 'dark'
                    ? colors.DarkBGBlue
                    : colors.LightBGBlue,
              },
            ]}
          />
          <View
            style={[
              styles.Circle3,
              {
                backgroundColor:
                  themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
              },
            ]}
          />
        </>
      ) : (
        <>
          <View
            style={[
              styles.Circle4,
              {
                backgroundColor:
                  themeColor === 'dark'
                    ? colors.DarkTextBlue
                    : colors.LightTextBlue,
              },
            ]}
          />
          <View
            style={[
              styles.Circle5,
              {
                backgroundColor:
                  themeColor === 'dark'
                    ? colors.DarkBGBlue
                    : colors.LightBGBlue,
              },
            ]}
          />
          <View
            style={[
              styles.Circle6,
              {
                backgroundColor:
                  themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
              },
            ]}
          />
        </>
      )}
    </View>
  )
}
