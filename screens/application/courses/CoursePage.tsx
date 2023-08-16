import { Dimensions, ScrollView, StatusBar, Text, View } from 'react-native'
import { styles } from '../../../constants/styles'
import rules from '../../../constants/rules'
import GradientText from '../../../components/GradientText'
import colors from '../../../constants/colors'
import { GetText } from '../../../functions/Functions'

const width = Dimensions.get('screen').width

export default function CoursePage({ navigation, route }: any) {
  return (
    <View style={styles.ViewCenter}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.White} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: '100%' }}
      >
        <View style={[styles.ViewStart, { paddingVertical: 20 }]}>
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
              backgroundColor: colors.LightGrey,
              marginVertical: 10,
            }}
          />
          {GetText(route.params.course.text)}
        </View>
      </ScrollView>
    </View>
  )
}
