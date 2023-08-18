import { Dimensions, ScrollView, StatusBar, Text, View } from 'react-native'
import { styles } from '../../../constants/styles'
import rules from '../../../constants/rules'
import GradientText from '../../../components/GradientText'
import colors from '../../../constants/colors'
import { GetText } from '../../../functions/Functions'
import { RootState } from '../../../redux'
import { useSelector } from 'react-redux'

const width = Dimensions.get('screen').width

export default function CoursePage({ navigation, route }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  return (
    <View
      style={[
        styles.ViewCenter,
        {
          backgroundColor:
            themeColor === 'dark'
              ? colors.DarkBGComponent
              : colors.LightBGComponent,
        },
      ]}
    >
      <StatusBar
        barStyle={themeColor === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeColor === 'dark' ? colors.DarkBG : colors.LightBG}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: '100%' }}
      >
        <View
          style={[
            styles.ViewStart,
            {
              paddingVertical: 20,
            },
          ]}
        >
          <GradientText
            onPress={() => {}}
            color1={rules.colors[rules.levels[route.params.course.level]][0]}
            color2={rules.colors[rules.levels[route.params.course.level]][1]}
            style={[styles.text30]}
          >
            {route.params.course.title}
          </GradientText>
          <View
            style={{
              width: rules.componentWidthPercent,
              height: 1,
              backgroundColor:
                themeColor === 'dark' ? colors.DarkBorder : colors.LightBG,
              marginVertical: 10,
            }}
          />
          {GetText(route.params.course.text)}
        </View>
      </ScrollView>
    </View>
  )
}
