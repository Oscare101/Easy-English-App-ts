import React from 'react'
import { ScrollView, View, useColorScheme } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import colors from '../constants/colors'

export default function ViewCustom({ style, children }: any) {
  const { theme } = useSelector((state: RootState) => state.theme)
  let system = useColorScheme()
  let colorScheme = theme === 'system' ? system : theme

  return (
    <ScrollView style={{ flexGrow: 1, backgroundColor: colors.White }}>
      <View
        style={[
          {
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          },
          style,
        ]}
      >
        {children}
      </View>
    </ScrollView>
  )
}
