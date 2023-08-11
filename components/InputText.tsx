import { Dimensions, TextInput, TouchableOpacity, View } from 'react-native'
import { styles } from '../constants/styles'
import { useState } from 'react'
import colors from '../constants/colors'
import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons'
import rules from '../constants/rules'

const width = Dimensions.get('screen').width

export default function InputText(props: any) {
  const [hidePassword, setHidePassword] = useState<boolean>(
    props.type === 'password'
  )
  return (
    <View style={styles.textInput}>
      <View
        style={{
          width: 50,
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.White,
        }}
      >
        {props.type === 'email' ? (
          <Feather name="mail" size={24} color="black" />
        ) : props.type === 'password' ? (
          <Feather name="lock" size={24} color="black" />
        ) : props.type === 'name' ? (
          <Ionicons name="person-circle-outline" size={24} color="black" />
        ) : props.type === 'date' ? (
          <MaterialIcons name="date-range" size={24} color="black" />
        ) : (
          <></>
        )}
      </View>

      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        value={props.value}
        secureTextEntry={hidePassword}
        onChangeText={(text) => props.setValue(text)}
        style={{
          // flex: 1,
          fontSize: 20,
          padding: 5,
          color: colors.Black,
          width:
            props.type === 'password'
              ? width * rules.componentWidth - 50 * 2
              : width * rules.componentWidth - 50,
          height: '100%',
          backgroundColor: colors.White,
        }}
        placeholder={props.placeholder}
        placeholderTextColor={colors.Border}
      />
      {props.type === 'password' ? (
        <TouchableOpacity
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: 50,
            backgroundColor: colors.White,
          }}
          activeOpacity={0.8}
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Feather
            name={hidePassword ? 'eye-off' : 'eye'}
            size={24}
            color={colors.Black}
          />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  )
}
