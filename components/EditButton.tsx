import { Text, TouchableOpacity } from 'react-native'
import rules from '../constants/rules'
import colors from '../constants/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { Feather } from '@expo/vector-icons'
export default function EditButton(props: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        props.action()
      }}
      style={{
        width: props.amountInARow === 2 ? '48%' : '31%',
        marginTop: 20,
        borderRadius: 8,
        overflow: 'hidden',
        borderColor:
          themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,

        borderWidth: 1,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
      }}
    >
      <Feather
        name={props.icon}
        size={20}
        color={
          themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText
        }
      />
      <Text
        style={{
          color:
            themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
          fontSize: 20,
          paddingTop: 5,
        }}
      >
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}
