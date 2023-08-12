import { Dimensions, Text, TouchableOpacity } from 'react-native'
import colors from '../constants/colors'
import { Ionicons } from '@expo/vector-icons'
const width = Dimensions.get('screen').width

export default function RenderReportCoursesItem({ item }: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => item.action()}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.RealWhite,
        width: width * 0.44,
        margin: width * 0.02,
        padding: 10,
        borderRadius: 8,
        // elevation: 5,
        borderColor: colors.LightGrey,
        borderWidth: 1,
        flexDirection: 'row',
      }}
    >
      <Ionicons name={item.icon} size={24} color={colors.Black} />
      <Text style={{ paddingLeft: 10, fontSize: 16 }}>{item.title}</Text>
    </TouchableOpacity>
  )
}
