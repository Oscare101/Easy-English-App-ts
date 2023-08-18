import { Dimensions, Text, TouchableOpacity } from 'react-native'
import colors from '../constants/colors'
import { Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
const width = Dimensions.get('screen').width

export default function RenderReportCoursesItem({ item }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => item.action()}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:
          themeColor === 'dark'
            ? colors.DarkBGComponent
            : colors.LightBGComponent,
        width: width * 0.44,
        margin: width * 0.02,
        padding: 10,
        borderRadius: 8,
        // elevation: 5,
        borderColor:
          themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
        borderWidth: 1,
        flexDirection: 'row',
      }}
    >
      <Ionicons
        name={item.icon}
        size={24}
        color={
          themeColor === 'dark'
            ? colors.DarkCommentText
            : colors.LightCommentText
        }
      />
      <Text
        style={{
          paddingLeft: 10,
          fontSize: 16,
          color:
            themeColor === 'dark'
              ? colors.DarkCommentText
              : colors.LightCommentText,
        }}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  )
}
