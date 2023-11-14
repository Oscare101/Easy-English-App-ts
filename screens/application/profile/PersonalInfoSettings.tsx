import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import { styles } from '../../../constants/styles'
import MainButton from '../../../components/MainButton'
import InputText from '../../../components/InputText'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { User } from '../../../constants/interfaces'
import { auth } from '../../../firebase'
import { get, getDatabase, onValue, ref } from 'firebase/database'
import { UpdateUser } from '../../../functions/Actions'
import { Ionicons, Feather } from '@expo/vector-icons'
import colors from '../../../constants/colors'
import rules from '../../../constants/rules'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import text from '../../../constants/text'
import EditButton from '../../../components/EditButton'
import SecondaryButton from '../../../components/SecondaryButton'
const width = Dimensions.get('screen').width

export default function PersonalInfoSettings({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [name, setName] = useState<string>('')
  const [surname, setSurname] = useState<string>('')
  const [birthDate, setBirthDate] = useState<any>('')
  const [gender, setGender] = useState<any>('')
  const [description, setDescription] = useState<string>('')
  const [region, setRegion] = useState<any>('')
  const [phone, setPhone] = useState<any>('')

  const [loading, setLoading] = useState<boolean>(false)

  function GetUserFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const dataRef = ref(
        getDatabase(),
        `user/` + auth.currentUser.email.replace('.', ',')
      )

      get(dataRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setName(snapshot.val().name)
            setSurname(snapshot.val().surname)
            setDescription(snapshot.val().description)
            setGender(snapshot.val().gender)
            setBirthDate(snapshot.val().birthDate || '')
          } else {
            // dont reread data if it updates on server
          }
        })
        .catch((error) => {
          console.error('Error fetching data:', error)
        })
    }
  }

  async function UpdateUserFunc() {
    setLoading(true)
    if (auth.currentUser && auth.currentUser.email) {
      const data = {
        name: name,
        surname: surname,
        gender: gender || '',
        description: description,
        region: region,
        phone: phone,
        birthDate: birthDate,
      }
      await UpdateUser(auth.currentUser?.email, data)
      navigation.goBack()
    }
  }

  useEffect(() => {
    GetUserFunc()
  }, [])

  const genders = [
    {
      title: 'male',
      icon: 'male',
      action: () => {
        if (gender === 'male') {
          setGender('')
        } else {
          setGender('male')
        }
      },
    },
    {
      title: 'other',
      icon: 'male-female',
      action: () => {
        if (gender === 'other') {
          setGender('')
        } else {
          setGender('other')
        }
      },
    },
    {
      title: 'female',
      icon: 'female',
      action: () => {
        if (gender === 'female') {
          setGender('')
        } else {
          setGender('female')
        }
      },
    },
  ]

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [420], [])
  const handleSheetChanges = useCallback((index: number, birthDate: any) => {
    if (index === 0) {
      const currentYear: number = +new Date()
        .toISOString()
        .split('T')[0]
        .split('-')[0]
      const currentMonth: number = +new Date()
        .toISOString()
        .split('T')[0]
        .split('-')[1]
      const currentDate: number = +new Date()
        .toISOString()
        .split('T')[0]
        .split('-')[2]

      if (birthDate && currentYear !== +birthDate.split('-')[0]) {
        flatListRefYear.current?.scrollToIndex({
          index: currentYear - birthDate.split('-')[0] - 1,
          animated: true,
        })
      }
      if (
        birthDate &&
        birthDate.split('-')[1] &&
        +birthDate.split('-')[1] !== 1
      ) {
        setMonth(+birthDate.split('-')[1] - 1)
        flatListRefMonth.current?.scrollToIndex({
          index: birthDate.split('-')[1] - 2,
          animated: true,
        })
      }
      if (birthDate && birthDate.split('-')[2]) {
        flatListRefDate.current?.scrollToIndex({
          index: birthDate.split('-')[2] - 2,
          animated: true,
        })
      }
    }

    if (index === -1) {
    }
  }, [])

  const flatListRefYear = useRef<any>(null)
  const flatListRefMonth = useRef<any>(null)
  const flatListRefDate = useRef<any>(null)

  const calendarItemHeight: number = 50
  const [year, setYear] = useState<number>(
    +new Date().toISOString().split('T')[0].split('-')[0]
  )
  const [month, setMonth] = useState<number>(
    +new Date().toISOString().split('T')[0].split('-')[1] - 1
  )

  const [date, setDate] = useState<number>(
    +new Date().toISOString().split('T')[0].split('-')[2]
  )

  function GetYearsArr() {
    const currentYear: number = +new Date()
      .toISOString()
      .split('T')[0]
      .split('-')[0]
    let arr: any = []
    for (let i = 0; i < 100; i++) {
      arr.push(currentYear - i)
    }
    return arr
  }

  function GetMonthArr() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    const currentYear: number = +new Date()
      .toISOString()
      .split('T')[0]
      .split('-')[0]
    const currentMonth: number = +new Date()
      .toISOString()
      .split('T')[0]
      .split('-')[1]

    if (year === currentYear) {
      return months.splice(0, currentMonth)
    }
    return months
  }

  function GetDaysArr() {
    const currentYear: number = +new Date()
      .toISOString()
      .split('T')[0]
      .split('-')[0]
    const currentMonth: number = +new Date()
      .toISOString()
      .split('T')[0]
      .split('-')[1]
    const currentDate: number = +new Date()
      .toISOString()
      .split('T')[0]
      .split('-')[2]
    let arr: any = []

    for (let i = 1; i <= new Date(year, month + 1, 0).getDate(); i++) {
      arr.push(i)
    }

    if (year === currentYear && month + 1 === currentMonth) {
      return arr.slice(0, currentDate)
    }
    return arr
  }

  function RenderYearItem({ item, index }: any) {
    return (
      <View
        style={{
          height: calendarItemHeight,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',

          // marginTop: index ? 0 : calendarItemHeight / 2,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
          }}
        >
          {item}
        </Text>
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
                }}
              >
                Personal info settings
              </Text>
              <View style={{ width: 50 }} />
            </View>

            <InputText
              colorState={2}
              type="name"
              value={name}
              setValue={(value: string) => setName(value)}
              placeholder="name *"
            />
            <InputText
              colorState={2}
              type="name"
              value={surname}
              setValue={(value: string) => setSurname(value)}
              placeholder="surname"
            />
            <InputText
              colorState={2}
              type="region"
              value={region}
              setValue={(value: string) => setRegion(value)}
              placeholder="region (will be shown in pdf)"
            />
            <InputText
              colorState={2}
              type="phone"
              numeric
              value={phone}
              setValue={(value: string) => {
                if (value.length > 19) return false
                const formattedPhoneNumber = value.replace(/[^0-9]/g, '')

                if (
                  formattedPhoneNumber.length > 0 &&
                  formattedPhoneNumber[0] !== '+'
                ) {
                  setPhone('+' + formattedPhoneNumber)
                } else {
                  setPhone(formattedPhoneNumber)
                }
              }}
              placeholder="phone (will be shown in pdf)"
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => bottomSheetModalRef.current?.present()}
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
              <View
                style={{
                  width: 50,
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather
                  name="calendar"
                  size={24}
                  color={
                    themeColor === 'dark'
                      ? colors.DarkBorder
                      : colors.LightCommentText
                  }
                />
              </View>
              <Text
                style={{
                  color: birthDate
                    ? themeColor === 'dark'
                      ? colors.DarkMainText
                      : colors.LightMainText
                    : themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
                  fontSize: 20,
                  padding: 5,
                  width: width * rules.componentWidth - 50,
                }}
              >
                {birthDate ? birthDate : 'birth date'}
                {/* {`${year}-${month + 1}-${date}`} */}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                color:
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
                textAlign: 'left',
                alignSelf: 'flex-start',
                paddingLeft: '4%',
              }}
            >
              Gender
            </Text>
            <View
              style={{
                width: rules.componentWidthPercent,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {genders.map((item: any, index: number) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => item.action()}
                  key={index}
                  style={{
                    width: (width * rules.componentWidth - 32) / 3,
                    borderWidth: 2,
                    borderColor:
                      gender === item.title
                        ? item.title === 'male'
                          ? colors.Main
                          : item.title === 'female'
                          ? colors.Purple
                          : colors.Green
                        : themeColor === 'dark'
                        ? colors.DarkBorder
                        : colors.LightCommentText,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 60,
                    marginVertical: 8,
                    // opacity: gender === item.title ? 1 : 0.3,
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={24}
                    color={
                      gender === item.title
                        ? item.title === 'male'
                          ? colors.Main
                          : item.title === 'female'
                          ? colors.Purple
                          : colors.Green
                        : themeColor === 'dark'
                        ? colors.DarkBorder
                        : colors.LightCommentText
                    }
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: rules.componentWidthPercent,
                borderColor:
                  themeColor === 'dark'
                    ? colors.DarkBorder
                    : colors.LightCommentText,
                borderWidth: 2,
                borderRadius: 8,
                marginVertical: 8,
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
                value={description}
                onChangeText={(text) => setDescription(text)}
                placeholder="description"
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
              {description.length}/{rules.maxBioLength}
            </Text>
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
                title="Save"
                disable={
                  !name ||
                  !(
                    (phone.length < 20 && phone.length > 12) ||
                    phone.length === 0
                  )
                }
                action={UpdateUserFunc}
              />
            )}
          </View>
        </ScrollView>
      </View>
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
        onChange={(index: number) => handleSheetChanges(index, birthDate)}
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
                  themeColor === 'dark' ? colors.DarkBG : colors.LightShadow
                }
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      >
        <View
          style={{
            backgroundColor:
              themeColor === 'dark' ? colors.DarkBGModal : colors.LightBGModal,
            flex: 1,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              borderColor:
                themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
              borderBottomWidth: 1,
              backgroundColor:
                themeColor === 'dark'
                  ? colors.DarkBGComponent
                  : colors.LightBGComponent,
              width: '100%',
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 20,
                textAlign: 'center',
                paddingVertical: 10,
                width: rules.componentWidthPercent,
                alignSelf: 'center',
                color:
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText,
              }}
            >
              Set your birth date
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: rules.componentWidthPercent,
              alignSelf: 'center',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                // backgroundColor:
                //   themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
                height: calendarItemHeight * 3,
                width: '100%',
              }}
            >
              <View
                style={{
                  height: calendarItemHeight * 3,
                  width: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                    height: 5,
                    width: 5,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
              <FlatList
                ref={flatListRefYear}
                onScrollToIndexFailed={() => {}}
                data={[...GetYearsArr()]}
                renderItem={RenderYearItem}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                snapToAlignment="center"
                decelerationRate={'fast'}
                snapToInterval={calendarItemHeight}
                snapToOffsets={[...GetYearsArr()].map(
                  (x, i) => i * calendarItemHeight
                )}
                contentContainerStyle={{ alignItems: 'center' }}
                onScroll={(event: any) => {
                  const currentYear: number = +new Date()
                    .toISOString()
                    .split('T')[0]
                    .split('-')[0]
                  const newYear: number =
                    currentYear -
                    Math.ceil(
                      event.nativeEvent.contentOffset.y / calendarItemHeight -
                        0.02
                    )

                  if (year !== newYear) {
                    setYear(newYear)
                  }
                }}
                ListHeaderComponent={() => (
                  <View
                    style={{
                      width: '100%',
                      height: calendarItemHeight,
                      backgroundColor: 'black',
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View
                    style={{
                      width: '100%',
                      height: calendarItemHeight,
                      backgroundColor: 'black',
                    }}
                  />
                )}
              />
              <View
                style={{
                  height: calendarItemHeight * 3,
                  width: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                    height: 5,
                    width: 5,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
              <FlatList
                ref={flatListRefMonth}
                data={[...GetMonthArr()]}
                renderItem={RenderYearItem}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                decelerationRate={'fast'}
                snapToInterval={calendarItemHeight}
                snapToOffsets={[...GetMonthArr()].map(
                  (x, i) => i * calendarItemHeight
                )}
                contentContainerStyle={{ alignItems: 'center' }}
                onScroll={(event: any) => {
                  const newMonth: number = Math.ceil(
                    event.nativeEvent.contentOffset.y / calendarItemHeight -
                      0.02
                  )

                  if (month !== newMonth && newMonth < 13) {
                    setMonth(newMonth)
                  }
                }}
                ListHeaderComponent={() => (
                  <View
                    style={{
                      width: '100%',
                      height: calendarItemHeight,
                      backgroundColor: 'black',
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View
                    style={{
                      width: '100%',
                      height: calendarItemHeight,
                      backgroundColor: 'black',
                    }}
                  />
                )}
              />
              <View
                style={{
                  height: calendarItemHeight * 3,
                  width: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                    height: 5,
                    width: 5,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
              <FlatList
                // scrollEnabled={false}
                ref={flatListRefDate}
                data={[...GetDaysArr()]}
                renderItem={RenderYearItem}
                // initialScrollIndex={2}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                pagingEnabled
                // snapToAlignment="center"
                decelerationRate={'fast'}
                snapToInterval={calendarItemHeight + 0.1}
                snapToOffsets={[...GetYearsArr()].map(
                  (x, i) => i * calendarItemHeight
                )}
                contentContainerStyle={{ alignItems: 'center' }}
                onScroll={(event: any) => {
                  const newDate: number =
                    1 +
                    +Math.ceil(
                      event.nativeEvent.contentOffset.y / calendarItemHeight
                    )

                  if (+date !== +newDate) {
                    setDate(newDate)
                  }
                }}
                ListHeaderComponent={() => (
                  <View
                    style={{
                      width: '100%',
                      height: calendarItemHeight,
                      backgroundColor: 'black',
                    }}
                  />
                )}
                ListFooterComponent={() => (
                  <View
                    style={{
                      width: '100%',
                      height: calendarItemHeight,
                      backgroundColor: 'black',
                    }}
                  />
                )}
              />
              <View
                style={{
                  height: calendarItemHeight * 3,
                  width: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                    height: 5,
                    width: 5,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
            </View>

            {/* <EditButton
              amountInARow={1}
              title="Delete"
              icon="copy"
              action={() => {
                // Clipboard.setStringAsync(post.text)
                bottomSheetModalRef.current?.dismiss()
              }}
            /> */}
          </View>

          <View
            style={{
              width: rules.componentWidthPercent,
              alignSelf: 'center',
              marginTop: 16,
              borderRadius: 8,
              backgroundColor:
                themeColor === 'dark'
                  ? colors.DarkBGComponent
                  : colors.LightBGComponent,
              padding: 8,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                textAlign: 'center',
                paddingVertical: 10,
                color:
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
              }}
            >
              {text.BirthDateInput}
            </Text>
          </View>
          <SecondaryButton
            title="Save"
            action={() => {
              setBirthDate(`${year}-${month + 1}-${date}`)
              bottomSheetModalRef.current?.dismiss()
            }}
            style={{ marginTop: 20 }}
          />
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}
