import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { styles } from '../../../constants/styles'
import MainButton from '../../../components/MainButton'
import { useEffect, useMemo, useRef, useState } from 'react'
import { auth } from '../../../firebase'
import { get, getDatabase, onValue, ref } from 'firebase/database'
import { Ionicons } from '@expo/vector-icons'
import colors from '../../../constants/colors'
import rules from '../../../constants/rules'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { ScrollView, Swipeable } from 'react-native-gesture-handler'
import { CreateTODO, DeleteTODO, ToggleTODO } from '../../../functions/Actions'
import Animated from 'react-native-reanimated'
const width = Dimensions.get('screen').width

export default function PersonalTodoScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [todoTitle, setTodoTitle] = useState<string>('')
  const [todoList, setTodoList] = useState<any>({})
  const [itemTitle, setItemTitle] = useState<string>('')
  const [itemIcon, setItemIcon] = useState<any>('')
  const [itemColor, setItemColor] = useState<number>(1)

  const [loading, setLoading] = useState<boolean>(false)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [400, '100%'], [])

  function GetUserTODOFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(
        getDatabase(),
        `user/${auth.currentUser.email.replace('.', ',')}/todo/list`
      )
      onValue(data, (snapshot) => {
        setTodoList(snapshot.val())
      })
    }

    if (auth.currentUser && auth.currentUser.email) {
      const dataRef = ref(
        getDatabase(),
        `user/${auth.currentUser.email.replace('.', ',')}/todo`
      )

      get(dataRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().title) {
              setTodoTitle(snapshot.val().title)
            }
          } else {
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }

  async function UpdateUserTODOFunc() {
    setLoading(true)
    const data = {
      id: new Date().getTime().toString(),
      title: itemTitle,
      icon: itemIcon,
      color: itemColor,
      created: new Date().getTime(),
      done: false,
    }
    if (auth.currentUser && auth.currentUser.email) {
      await CreateTODO(auth.currentUser.email, data)
      // await UpdateUser(auth.currentUser?.email, data)
      // navigation.goBack()
      setItemColor(1)
      setItemTitle('')
      setItemIcon('')
    }
    setLoading(false)
  }

  function ToggleTODOFunc(item: any) {
    if (auth.currentUser && auth.currentUser.email) {
      ToggleTODO(auth.currentUser.email, item)
    }
  }

  function DeleteTODOFunc(item: any) {
    if (auth.currentUser && auth.currentUser.email) {
      DeleteTODO(auth.currentUser.email, item.id)
    }
  }

  useEffect(() => {
    GetUserTODOFunc()
  }, [])

  const iconData = [
    { title: 'airplane-outline' },
    { title: 'alarm-outline' },
    { title: 'add' },
    { title: 'alert' },
    { title: 'attach' },
    { title: 'bar-chart-outline' },
    { title: 'basketball-outline' },
    { title: 'battery-half' },
    { title: 'bed-outline' },
    { title: 'beer-outline' },
    { title: 'bicycle-outline' },
    { title: 'bonfire-outline' },
    { title: 'book-outline' },
    { title: 'bookmark-outline' },
    { title: 'briefcase-outline' },
    { title: 'brush-outline' },
    { title: 'bulb-outline' },
    { title: 'bus-outline' },
    { title: 'business-outline' },
    { title: 'cafe-outline' },
    { title: 'call-outline' },
    { title: 'camera-outline' },
    { title: 'car-outline' },
    { title: 'card-outline' },
    { title: 'cart-outline' },
    { title: 'cash-outline' },
    { title: 'chatbubble-ellipses-outline' },
    { title: 'clipboard-outline' },
    { title: 'cloud-outline' },
    { title: 'code-slash-outline' },
    { title: 'color-palette-outline' },
    { title: 'construct-outline' },
    { title: 'document-text-outline' },
    { title: 'earth' },
    { title: 'fast-food-outline' },
    { title: 'flag-outline' },
    { title: 'flask-outline' },
    { title: 'game-controller-outline' },
    { title: 'gift-outline' },
    { title: 'headset-outline' },
    { title: 'help' },
    { title: 'home-outline' },
    { title: 'key-outline' },
    { title: 'language-outline' },
    { title: 'laptop-outline' },
    { title: 'library-outline' },
  ]

  const colorData = [
    { color: 1, title: 'default' },
    { color: 2, title: 'red' },
    { color: 3, title: 'yellow' },
    { color: 4, title: 'green' },
    { color: 5, title: 'blue' },
  ]

  function GetItemColor(color: number) {
    switch (color) {
      case 1:
        return themeColor === 'dark'
          ? colors.DarkMainText
          : colors.LightMainText
      case 2:
        return themeColor === 'dark'
          ? colors.DarkDangerText
          : colors.LightDangerText
      case 3:
        return themeColor === 'dark'
          ? colors.DarkWarningText
          : colors.LightWarningText
      case 4:
        return themeColor === 'dark'
          ? colors.DarkSuccessText
          : colors.LightSuccessText
      case 5:
        return themeColor === 'dark'
          ? colors.DarkTextBlue
          : colors.LightTextBlue
    }
  }

  function RenderColorItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.18,
          height: 40,
          margin: width * 0.01,
          borderWidth: 1,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor: GetItemColor(item.color),
          backgroundColor: GetItemColor(item.color),
        }}
        activeOpacity={0.8}
        onPress={() => setItemColor(item.color)}
      ></TouchableOpacity>
    )
  }

  function RenderIconItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          width: width * 0.18,
          height: width * 0.18,
          margin: width * 0.01,
          borderWidth: 1,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
          borderColor:
            itemIcon === item.title
              ? GetItemColor(itemColor)
              : themeColor === 'dark'
              ? colors.DarkCommentText
              : colors.LightCommentText,
          opacity: itemIcon === item.title ? 1 : 0.5,
        }}
        activeOpacity={0.8}
        onPress={() => setItemIcon(item.title)}
      >
        <Ionicons
          name={item.title}
          size={width * 0.12}
          color={GetItemColor(itemColor)}
        />
      </TouchableOpacity>
    )
  }

  const [swipeableRef, setSwipeableRef] = useState<any>(null)
  let row: Array<any> = []
  let prevOpenedRow: any
  const onSwipeableOpen = (index: any) => {
    if (swipeableRef) {
      swipeableRef.close()
    }
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close()
    }
    prevOpenedRow = row[index]
  }

  const swipeRrenderRightActions = (item: any) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBorder : colors.LightBGComponent,
          alignItems: 'center',
          justifyContent: 'center',
          width: '20%',
          height: '100%',
          borderRadius: 8,
          marginRight: '4%',
        }}
        onPress={() => {
          if (prevOpenedRow) {
            prevOpenedRow.close()
          }
          DeleteTODOFunc(item)
        }}
      >
        <Ionicons
          name="trash-bin-outline"
          size={24}
          color={
            themeColor === 'dark'
              ? colors.DarkDangerText
              : colors.LightDangerText
          }
        />
      </TouchableOpacity>
    )
  }

  const swipeRenderLeftActions = (item: any) => {
    return (
      <TouchableOpacity
        style={{
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBorder : colors.LightBGComponent,
          alignItems: 'center',
          justifyContent: 'center',
          width: '20%',
          height: '100%',
          borderRadius: 8,
          marginLeft: '4%',
        }}
        onPress={() => {
          if (prevOpenedRow) {
            prevOpenedRow.close()
          }
          ToggleTODOFunc(item)
        }}
      >
        <Ionicons
          name={item.done ? 'square-outline' : 'ios-checkbox-outline'}
          size={24}
          color={
            themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText
          }
        />
      </TouchableOpacity>
    )
  }

  function RenderTodoItem({ item, index }: any) {
    return (
      <View
        style={{
          width: '100%',
          marginTop: 8,
          // backgroundColor: 'red',
          alignSelf: 'center',
        }}
      >
        <Swipeable
          ref={(ref) => (row[index] = ref)}
          renderRightActions={() => swipeRrenderRightActions(item)}
          renderLeftActions={() => swipeRenderLeftActions(item)}
          // overshootLeft={true}
          // overshootRight={true}
          overshootFriction={1}
          onSwipeableOpen={() => {
            onSwipeableOpen(index)
          }}
        >
          <Animated.View
            style={[
              {
                width: rules.componentWidthPercent,
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                borderWidth: 1,
                borderColor:
                  themeColor === 'dark'
                    ? colors.DarkBorder
                    : colors.LightBorder,
                alignSelf: 'center',
                borderRadius: 8,
                padding: 8,

                backgroundColor:
                  themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
              },
            ]}
          >
            <Ionicons
              name={item.icon || 'help'}
              size={30}
              color={GetItemColor(item.color)}
            />
            <View
              style={{
                width: 1,
                height: '100%',
                backgroundColor:
                  themeColor === 'dark'
                    ? colors.DarkBorder
                    : colors.LightBorder,
                marginLeft: 4,
                marginRight: 8,
              }}
            />
            <View style={{ flex: 1, opacity: item.done ? 0.5 : 1 }}>
              <Text
                style={{
                  fontSize: 20,
                  color: GetItemColor(item.color),
                  textDecorationLine: item.done ? 'line-through' : 'none',
                }}
              >
                {item.title}
              </Text>
              {item.done ? (
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkCommentText
                        : colors.LightCommentText,
                    textAlign: 'right',
                  }}
                >
                  {`finished ${new Date(item.finished).toLocaleString()}`}
                </Text>
              ) : (
                <></>
              )}
            </View>
          </Animated.View>
        </Swipeable>
      </View>
    )
  }

  return (
    <BottomSheetModalProvider>
      <View
        style={[
          styles.ViewCenter,
          {
            backgroundColor:
              themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
          },
        ]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
          keyboardShouldPersistTaps={'handled'}
        >
          <View style={[styles.ViewStart, { paddingVertical: 20 }]}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
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
                  paddingBottom: 20,
                }}
              >
                ToDo
              </Text>
              <View style={{ width: 50 }} />
            </View>

            {/* <View
              style={{
                width: rules.componentWidthPercent,
                borderColor:
                  themeColor === 'dark'
                    ? colors.DarkBorder
                    : colors.LightBorder,
                borderBottomWidth: 1,
                paddingBottom: 10,
                marginBottom: 10,
                borderStyle: 'dashed',
                
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignSelf: 'center',
                  borderColor:
                    themeColor === 'dark'
                      ? colors.DarkBorder
                      : colors.LightCommentText,
                  borderWidth: 2,
                  borderRadius: 8,
                  marginBottom: 8,
                  overflow: 'hidden',
                  paddingHorizontal: 10,
                  minHeight: 60,
                }}
              >
                <TextInput
                  style={{
                    fontSize: 18,
                    width: '100%',
                    color:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                  }}
                  editable
                  multiline
                  maxLength={rules.maxBioLength}
                  numberOfLines={4}
                  value={todoTitle}
                  onChangeText={(text) => setTodoTitle(text)}
                  placeholder="your thoughts here:)"
                  placeholderTextColor={
                    themeColor === 'dark'
                      ? colors.DarkCommentText
                      : colors.LightCommentText
                  }
                />
              </View>
              <Text
                style={{
                  textAlign: 'right',
                  alignSelf: 'flex-end',
                  paddingRight: '4%',
                  color:
                    themeColor === 'dark'
                      ? colors.DarkCommentText
                      : colors.LightCommentText,
                }}
              >
                {todoTitle ? todoTitle.length : 0}/{rules.maxBioLength}
              </Text>
            </View> */}

            <Text
              style={{
                fontSize: 20,
                color:
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
                width: rules.componentWidthPercent,
                textAlign: 'left',
              }}
            >
              Your items
            </Text>
            <View
              style={[
                styles.textInput,
                {
                  borderColor:
                    themeColor === 'dark'
                      ? colors.DarkBorder
                      : colors.LightCommentText,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                  Keyboard.dismiss()
                  bottomSheetModalRef.current?.present()
                }}
                style={{
                  width: 50,
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#00000000',
                }}
              >
                <Ionicons
                  name={itemIcon || 'help'}
                  size={24}
                  color={GetItemColor(itemColor)}
                />
              </TouchableOpacity>

              <TextInput
                autoCapitalize="none"
                autoComplete="email"
                value={itemTitle}
                onChangeText={(text) => setItemTitle(text)}
                style={{
                  // flex: 1,
                  fontSize: 20,
                  padding: 5,
                  color:
                    themeColor === 'dark'
                      ? colors.DarkMainText
                      : colors.LightMainText,
                  width: width * rules.componentWidth - 50,
                  height: '100%',
                  backgroundColor: '#00000000',
                }}
                placeholder="todo title"
                placeholderTextColor={
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText
                }
              />
            </View>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: 68,
                marginBottom: 4,
              }}
            >
              {loading ? (
                <View
                  style={{
                    height: 60,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ActivityIndicator size={'large'} />
                </View>
              ) : (
                <MainButton
                  title="Add item"
                  disable={!itemTitle || !itemIcon}
                  action={UpdateUserTODOFunc}
                />
              )}
            </View>

            {todoList ? (
              <FlatList
                style={{ width: '100%' }}
                data={[
                  ...Object.values(todoList).filter((i: any) => !i.done),
                  ...Object.values(todoList).filter((i: any) => i.done),
                ]}
                renderItem={RenderTodoItem}
                scrollEnabled={false}
              />
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color:
                    themeColor === 'dark'
                      ? colors.DarkCommentText
                      : colors.LightCommentText,
                  width: rules.componentWidthPercent,
                  textAlign: 'left',
                }}
              >
                No Todo items yet
              </Text>
            )}
            {/* BottomSheet */}
            <BottomSheetModal
              backgroundStyle={{
                backgroundColor:
                  themeColor === 'dark'
                    ? colors.DarkBGComponent
                    : colors.LightBGComponent,
              }}
              ref={bottomSheetModalRef}
              snapPoints={snapPoints}
              backdropComponent={({ style }) => (
                <TouchableWithoutFeedback
                  onPress={() => bottomSheetModalRef.current?.dismiss()}
                >
                  <View
                    style={[
                      style,
                      {
                        backgroundColor:
                          themeColor === 'dark'
                            ? colors.DarkShadow
                            : colors.LightShadow,
                      },
                    ]}
                  >
                    <StatusBar
                      backgroundColor={
                        themeColor === 'dark'
                          ? colors.DarkBG
                          : colors.LightShadow
                      }
                    />
                  </View>
                </TouchableWithoutFeedback>
              )}
            >
              <View
                style={{
                  backgroundColor:
                    themeColor === 'dark'
                      ? colors.DarkBGComponent
                      : colors.LightBGComponent,
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    alignSelf: 'center',
                    color:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                  }}
                >
                  Choose icon and color for your todo item
                </Text>
                <View style={{ flexDirection: 'row' }}>
                  <FlatList
                    style={{ width: '100%' }}
                    horizontal
                    scrollEnabled={false}
                    data={colorData}
                    renderItem={RenderColorItem}
                  />
                </View>
                <ScrollView
                  // horizontal={true}
                  style={{ flex: 1, width: '100%' }}
                >
                  <FlatList
                    style={{}}
                    scrollEnabled={false}
                    numColumns={5}
                    data={iconData}
                    renderItem={RenderIconItem}
                  />
                </ScrollView>
              </View>
            </BottomSheetModal>
          </View>
        </ScrollView>
      </View>
    </BottomSheetModalProvider>
  )
}
