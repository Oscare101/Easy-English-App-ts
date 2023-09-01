import { Dimensions, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../constants/styles'
import { useState } from 'react'
import colors from '../constants/colors'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import rules from '../constants/rules'
import themeColor from '../redux/themeColor'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

const width = Dimensions.get('screen').width

export default function InputText(props: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [hidePassword, setHidePassword] = useState<boolean>(
    props.type === 'password'
  )

  function GetColorBG() {
    if (props.colorState === 1) {
      return themeColor === 'dark' ? colors.DarkBGBlue : colors.LightBGBlue
    } else {
      return '#00000000'
    }
  }

  function GetColorComment() {
    if (true) {
      return themeColor === 'dark'
        ? colors.DarkCommentText
        : colors.LightCommentText
    }
  }

  function GetColorBorder() {
    if (props.colorState === 1) {
      return themeColor === 'dark' ? colors.DarkTextBlue : colors.LightTextBlue
    } else if (props.colorState === 2) {
      return themeColor === 'dark' ? colors.DarkBorder : colors.LightCommentText
    }
  }

  function GetColorText() {
    if (true) {
      return themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText
    }
  }

  return (
    <View style={[styles.textInput, { borderColor: GetColorBorder() }]}>
      <View
        style={{
          width: 50,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: GetColorBG(),
        }}
      >
        {props.type === 'email' ? (
          <Feather name="mail" size={24} color={GetColorBorder()} />
        ) : props.type === 'password' ? (
          <Feather name="lock" size={24} color={GetColorBorder()} />
        ) : props.type === 'name' ? (
          <Ionicons
            name="person-circle-outline"
            size={24}
            color={GetColorBorder()}
          />
        ) : props.type === 'date' ? (
          <MaterialIcons name="date-range" size={24} color={GetColorBorder()} />
        ) : props.type === 'region' ? (
          <Ionicons name="earth-sharp" size={24} color={GetColorBorder()} />
        ) : props.type === 'phone' ? (
          <Ionicons
            name="phone-portrait-outline"
            size={24}
            color={GetColorBorder()}
          />
        ) : (
          <></>
        )}
      </View>

      <TextInput
        keyboardType={props.numeric ? 'number-pad' : 'default'}
        autoCapitalize="none"
        autoComplete={props.type === 'email' ? 'email' : 'off'}
        value={props.value}
        secureTextEntry={hidePassword}
        onChangeText={(text) => props.setValue(text)}
        style={{
          // flex: 1,
          fontSize: 20,
          padding: 5,
          color: GetColorText(),
          width:
            props.type === 'password'
              ? width * rules.componentWidth - 50 * 2
              : width * rules.componentWidth - 50,
          height: '100%',
          backgroundColor: GetColorBG(),
        }}
        placeholder={props.placeholder}
        placeholderTextColor={GetColorComment()}
      />
      {props.type === 'password' ? (
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: 50,
            backgroundColor: GetColorBG(),
          }}
          activeOpacity={0.8}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Feather
            name={hidePassword ? 'eye-off' : 'eye'}
            size={24}
            color={GetColorBorder()}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  )
}
