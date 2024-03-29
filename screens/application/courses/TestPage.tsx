import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { styles } from '../../../constants/styles'
import rules from '../../../constants/rules'
import GradientText from '../../../components/GradientText'
import colors from '../../../constants/colors'
import { RootState } from '../../../redux'
import { useSelector } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import MainButton from '../../../components/MainButton'
import PieChart from 'react-native-pie-chart'
import { VictoryPie } from 'victory-native'
import { auth } from '../../../firebase'
import {
  CreateUserTestPoints,
  DeleteUserTestPoints,
} from '../../../functions/Actions'

const width = Dimensions.get('screen').width

export default function TestPage({ navigation, route }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  const [chosenOptions, setChosenOptions] = useState<any>([])
  const [userPoints, setUserPoints] = useState<number>(0)
  const [testFinished, setTestFinished] = useState<boolean>(false)
  const [userTests, setUserTests] = useState<any>(route.params.user.test || {})
  const scrollRef: any = useRef()

  async function CheckAnswers() {
    setTestFinished(true)

    let points: number = 0
    chosenOptions.forEach((i: any) => {
      if (
        route.params.test.question[i.test].options[
          route.params.test.question[i.test].answer
        ] === i.answer
      ) {
        points++
      }
    })

    setUserPoints(points)

    setUserTests((id: number) => ({
      [route.params.test.id]: {
        points: points,
        date: new Date().getTime(),
        id: route.params.test.id,
        answers: chosenOptions,
        title: route.params.test.title,
        level: route.params.test.level,
      },
    }))
    scrollRef.current?.scrollTo({
      y: 0,
      animated: true,
    })
    if (auth.currentUser && auth.currentUser.email) {
      await CreateUserTestPoints(
        auth.currentUser.email,
        route.params.test.id,
        points,
        chosenOptions,
        route.params.test.title,
        route.params.test.level
      )
    }
  }

  async function DeleteUserTestPointsFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      setTestFinished(false)
      setUserPoints(0)
      setChosenOptions([])
      let filteresTests = userTests
      delete filteresTests[route.params.test.id]
      setUserTests(filteresTests)
      await DeleteUserTestPoints(auth.currentUser.email, route.params.test.id)
    }
  }

  useEffect(() => {
    if (route.params.user && userTests && userTests[route.params.test.id]) {
      setUserPoints(userTests[route.params.test.id].points)
      setTestFinished(true)
    }
  }, [])

  function RenderTestItem({ item, index }: any) {
    let testIndex = index

    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          width: rules.componentWidthPercent,
          alignSelf: 'center',
          borderTopWidth: 1,
          borderTopColor:
            themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
          paddingTop: 10,
          marginTop: 15,
          padding: 5,
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
          borderRadius: 16,
          borderWidth: 1,
          borderColor:
            themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
          overflow: 'hidden',
        }}
      >
        <Text
          style={{
            paddingHorizontal: 10,
            fontSize: 12,
            color:
              themeColor === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
            textAlign: 'right',
            width: '100%',
          }}
        >
          {testIndex + 1}/{Object.values(route.params.test.question).length}
        </Text>
        <Text
          style={{
            paddingHorizontal: 10,
            fontSize: 20,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
          }}
        >
          {item.title}
        </Text>
        {Object.values(item.options).map((option: any, index: number) => (
          <TouchableOpacity
            disabled={testFinished}
            key={index}
            activeOpacity={0.8}
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,

              backgroundColor: testFinished
                ? userTests[route.params.test.id] &&
                  userTests[route.params.test.id].answers.find(
                    (i: any) => item.id === i.test
                  ).answer === option
                  ? themeColor === 'dark'
                    ? colors.DarkBorder
                    : colors.LightBorder
                  : themeColor === 'dark'
                  ? colors.DarkBG
                  : colors.LightBG
                : chosenOptions.find(
                    (i: any) => i.test === item.id && i.answer === option
                  )
                ? themeColor === 'dark'
                  ? colors.DarkBGComponent
                  : colors.LightBGComponent
                : themeColor === 'dark'
                ? colors.DarkBG
                : colors.LightBG,
              marginTop: 5,
              borderRadius: 10,
              opacity: chosenOptions.find(
                (i: any) => i.test === item.id && i.answer === option
              )
                ? 1
                : 0.5,
            }}
            onPress={() => {
              if (chosenOptions.find((i: any) => i.test === item.id)) {
                let oprionsarr = chosenOptions.filter(
                  (i: any) => i.test !== item.id
                )
                setChosenOptions([
                  ...oprionsarr,
                  { test: item.id, answer: option },
                ])
              } else {
                setChosenOptions([
                  ...chosenOptions,
                  { test: item.id, answer: option },
                ])
              }
            }}
          >
            <Ionicons
              name={
                chosenOptions.find(
                  (i: any) => i.test === item.id && i.answer === option
                ) ||
                (userTests &&
                  userTests[route.params.test.id] &&
                  userTests[route.params.test.id].answers.find(
                    (i: any) => item.id === i.test
                  ).answer === option)
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={24}
              color={
                testFinished
                  ? userTests[route.params.test.id] &&
                    userTests[route.params.test.id].answers.find(
                      (i: any) => item.id === i.test
                    ).answer === option &&
                    item.options[item.answer] !== option
                    ? themeColor === 'dark'
                      ? colors.DarkDangerText
                      : colors.LightDangerText
                    : item.options[item.answer] === option
                    ? themeColor === 'dark'
                      ? colors.DarkSuccessText
                      : colors.LightSuccessText
                    : themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                  : themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText
              }
            />
            <Text
              style={{
                fontSize: 20,
                color: testFinished
                  ? userTests[route.params.test.id] &&
                    userTests[route.params.test.id].answers.find(
                      (i: any) => item.id === i.test
                    ).answer === option &&
                    item.options[item.answer] !== option
                    ? themeColor === 'dark'
                      ? colors.DarkDangerText
                      : colors.LightDangerText
                    : item.options[item.answer] === option
                    ? themeColor === 'dark'
                      ? colors.DarkSuccessText
                      : colors.LightSuccessText
                    : themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                  : themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText,
                paddingLeft: 10,
              }}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    )
  }

  return (
    <View
      style={[
        styles.ViewCenter,
        {
          backgroundColor:
            themeColor === 'dark'
              ? colors.DarkBGComponent
              : colors.LightBGComponent,
        },
      ]}
    >
      <StatusBar
        barStyle={themeColor === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeColor === 'dark' ? colors.DarkBG : colors.LightBG}
      />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, width: '100%' }}
      >
        <View
          style={[
            styles.ViewStart,
            {
              paddingVertical: 20,
            },
          ]}
        >
          <GradientText
            onPress={() => {}}
            color1={rules.colors[rules.levels[route.params.test.level]][0]}
            color2={rules.colors[rules.levels[route.params.test.level]][1]}
            style={[styles.text30]}
          >
            {route.params.test.title}
          </GradientText>
          {testFinished ||
          (route.params.user &&
            userTests &&
            userTests[route.params.test.id]) ? (
            <>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: rules.componentWidthPercent,
                  marginTop: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 40,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                    flex: 1,
                    textAlign: 'center',
                  }}
                >
                  {userPoints}/
                  {Object.values(route.params.test.question).length}
                </Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={DeleteUserTestPointsFunc}
                  style={{
                    width: '50%',
                    backgroundColor:
                      themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
                    borderWidth: 1,
                    borderColor:
                      themeColor === 'dark'
                        ? colors.DarkBorder
                        : colors.LightBorder,
                    padding: 10,
                    paddingHorizontal: 15,
                    borderRadius: 16,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Ionicons
                    name="refresh-outline"
                    size={24}
                    color={
                      themeColor === 'dark'
                        ? colors.DarkCommentText
                        : colors.LightCommentText
                    }
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color:
                        themeColor === 'dark'
                          ? colors.DarkCommentText
                          : colors.LightCommentText,
                      paddingHorizontal: 4,
                    }}
                  >
                    Reset the test and{'\n'}try again
                  </Text>
                </TouchableOpacity>
              </View>

              <FlatList
                style={{ width: '100%' }}
                scrollEnabled={false}
                data={Object.values(route.params.test.question)}
                renderItem={RenderTestItem}
              />
            </>
          ) : (
            <>
              <View
                style={{
                  width: rules.componentWidthPercent,
                  height: 1,
                  backgroundColor:
                    themeColor === 'dark' ? colors.DarkBorder : colors.LightBG,
                  marginVertical: 10,
                }}
              />
              <Text
                style={{
                  fontSize: 20,
                  color:
                    themeColor === 'dark'
                      ? colors.DarkCommentText
                      : colors.LightCommentText,
                }}
              >
                {route.params.test.description}
              </Text>
              <FlatList
                style={{ width: '100%' }}
                scrollEnabled={false}
                data={Object.values(route.params.test.question)}
                renderItem={RenderTestItem}
              />
              <MainButton
                title="Save"
                disable={
                  Object.values(route.params.test.question).length !==
                  chosenOptions.length
                }
                action={CheckAnswers}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
