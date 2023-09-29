import { Animated, Text, TouchableOpacity, View, Vibration } from 'react-native'
import colors from '../constants/colors'
import rules from '../constants/rules'
import { Ionicons } from '@expo/vector-icons'
import { Swipeable } from 'react-native-gesture-handler'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

export default function SwipeToDelete(props: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const swipeRrenderRightActions = () => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor: themeColor === 'dark' ? colors.Black : colors.White,
          alignItems: 'center',
          justifyContent: 'center',
          width: '80%',
          height: '100%',
        }}
        onPress={() => {
          props.action()
        }}
      >
        <Text
          style={{
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
            fontSize: 20,
          }}
        >
          Confirm deleting
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={{
        width: rules.componentWidthPercent,
        height: 60,
        backgroundColor:
          themeColor === 'dark' ? colors.DarkBGDanger : colors.LightBGDanger,
        marginTop: 20,
        alignSelf: 'center',
        borderColor:
          themeColor === 'dark'
            ? colors.DarkDangerText
            : colors.LightDangerText,
        borderRadius: 8,
        borderWidth: 1,
        overflow: 'hidden',
      }}
    >
      <Swipeable
        renderRightActions={swipeRrenderRightActions}
        overshootLeft={true}
        overshootRight={true}
        overshootFriction={1}
        onSwipeableOpen={() => Vibration.vibrate(1, false)}
      >
        <Animated.View
          style={[
            {
              width: '100%',

              overflow: 'hidden',
              backgroundColor:
                themeColor === 'dark'
                  ? colors.DarkBGDanger
                  : colors.LightBGDanger,

              height: '100%',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: '6%',
            }}
          >
            <View></View>
            <Text
              style={{
                color:
                  themeColor === 'dark'
                    ? colors.DarkDangerText
                    : colors.LightDangerText,
                fontSize: 20,
              }}
            >
              {'<<<'} {props.title}
            </Text>
            <Ionicons
              name={props.icon}
              size={24}
              color={
                themeColor === 'dark'
                  ? colors.DarkDangerText
                  : colors.LightDangerText
              }
            />
          </View>
        </Animated.View>
      </Swipeable>
    </View>
  )
}
