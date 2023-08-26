import { Text, TouchableOpacity } from 'react-native'
import rules from '../constants/rules'
import colors from '../constants/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

export default function EditButton(props: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        props.action()
      }}
      style={{
        width: rules.componentWidthPercent,
        marginTop: 20,
        borderRadius: 8,
        overflow: 'hidden',
        borderColor:
          themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,

        borderWidth: 1,
        height: 60,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Text
        style={{
          color:
            themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
          fontSize: 20,
        }}
      >
        Edit
      </Text>
    </TouchableOpacity>
  )
}
