import 'react-native-gesture-handler'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Text, View, StatusBar } from 'react-native'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import { useSelector } from 'react-redux'
import { RootState } from './redux'
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native'
import Toast from 'react-native-toast-message'
import colors from './constants/colors'
import MainNavigation from './navigation/MainNavigation'
import rules from './constants/rules'
import 'expo-dev-client'

export default function App() {
  const toastConfig = {
    successToast: ({ props }: any) => (
      <View
        style={{
          width: rules.componentWidthPercent,
          backgroundColor: colors.Black,
          padding: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 40,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color: colors.White,
            textAlign: 'left',
          }}
        >
          {props.title}
        </Text>
      </View>
    ),
  }

  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer theme={DefaultTheme}>
          <StatusBar barStyle="dark-content" backgroundColor={colors.White} />
          <MainNavigation />
        </NavigationContainer>
      </GestureHandlerRootView>
      <Toast config={toastConfig} />
    </Provider>
  )
}
