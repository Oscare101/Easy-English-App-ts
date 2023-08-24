import { Linking, StatusBar, Text, TouchableOpacity, View } from 'react-native'
import colors from '../../constants/colors'
import { styles } from '../../constants/styles'
import BGCircles from '../../components/BGCircles'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux'
import text from '../../constants/text'
import rules from '../../constants/rules'
import GradientText from '../../components/GradientText'

export default function ForceUpdateScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  return (
    <View style={styles.ViewCenter}>
      <StatusBar
        barStyle={themeColor === 'dark' ? 'dark-content' : 'light-content'}
        backgroundColor={
          themeColor === 'dark' ? colors.DarkTextBlue : colors.LightTextBlue
        }
      />
      <BGCircles type={2} />

      <View style={styles.ViewBetween}>
        <View></View>
        <View style={{ width: '100%', flexDirection: 'column' }}>
          <Text
            style={{
              fontSize: 20,
              color:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
              width: rules.componentWidthPercent,
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            {text.ForceUpdateText}
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              Linking.openURL('https://t.me/+tbk3HfCoN_NkOGIy')
            }}
            style={{ padding: 10 }}
          >
            <Text
              style={{
                fontSize: 20,

                width: rules.componentWidthPercent,
                alignSelf: 'center',
                textAlign: 'center',
              }}
            >
              ✈️
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 20,
              color:
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
              width: rules.componentWidthPercent,
              alignSelf: 'center',
              textAlign: 'center',
            }}
          >
            {text.ForceUpdateWhere}
          </Text>
        </View>

        <View></View>
      </View>
    </View>
  )
}
