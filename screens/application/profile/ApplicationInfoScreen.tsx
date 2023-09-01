import {
  FlatList,
  Linking,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { styles } from '../../../constants/styles'
import { Ionicons } from '@expo/vector-icons'
import colors from '../../../constants/colors'
import text from '../../../constants/text'
import rules from '../../../constants/rules'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'
import { useDispatch } from 'react-redux'
import app from '../../../app.json'
export default function ApplicationInfoScreen({ navigation }: any) {
  const dispatch = useDispatch()
  const { authentication } = useSelector(
    (state: RootState) => state.authentication
  )
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const applicationData = [
    {
      type: 'title',
      title: text.AboutApplication,
    },
    {
      type: 'button',
      title: 'Contact me',
      icon: 'chatbubble-ellipses-outline',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        Linking.openURL('https://t.me/funny_like_panda')
      },
    },
    {
      type: 'button',
      title: 'Channel with all updates',
      icon: 'phone-portrait-outline',
      color: themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText,
      action: () => {
        Linking.openURL('https://t.me/+tbk3HfCoN_NkOGIy')
      },
    },
    {
      type: 'title',
      title: `Application version ${app.expo.version}`,
    },
  ]

  function RenderSettingsItem({ item }: any) {
    const title = (
      <View
        style={{
          width: rules.componentWidthPercent,
          alignSelf: 'center',
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color:
              themeColor === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
          }}
        >
          {item.title}
        </Text>
      </View>
    )
    const button = (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => item.action()}
        style={{
          borderColor:
            themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
          borderBottomWidth: 1,
          width: rules.componentWidthPercent,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: item.icon ? 'space-between' : 'center',
          paddingVertical: 15,
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            fontSize: 20,
            color: item.color,
          }}
        >
          {item.title}
        </Text>
        <Ionicons name={item.icon} size={24} color={item.color} />
      </TouchableOpacity>
    )

    return <>{item.type === 'title' ? title : button}</>
  }

  return (
    <View
      style={[
        styles.ViewCenter,
        {
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
        },
      ]}
    >
      <StatusBar
        barStyle={themeColor === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeColor === 'dark' ? colors.DarkBG : colors.LightBG}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: '100%' }}
      >
        <View style={[styles.ViewStart, { paddingVertical: 20 }]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderColor:
                themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
              borderBottomWidth: 1,
              borderStyle: 'dashed',
              paddingVertical: 10,
              paddingBottom: 20,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                navigation.goBack()
              }}
              style={{
                height: 50,
                width: 50,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                }
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 24,
                color:
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText,
              }}
            >
              Application info
            </Text>
            <View style={{ width: 50 }} />
          </View>

          <FlatList
            style={{ flex: 1, width: '100%' }}
            scrollEnabled={false}
            data={applicationData}
            renderItem={RenderSettingsItem}
          />

          {/* BottomSheet */}
        </View>
      </ScrollView>
    </View>
  )
}
