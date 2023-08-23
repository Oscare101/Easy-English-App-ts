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
import { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import MainButton from '../../../components/MainButton'
import PieChart from 'react-native-pie-chart'
import { VictoryPie } from 'victory-native'
import { auth } from '../../../firebase'
import { CreateUserTestPoints } from '../../../functions/Actions'

const width = Dimensions.get('screen').width

export default function TestPage({ navigation, route }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  const [chosenOptions, setChosenOptions] = useState<any>([])
  const [userPoints, setUserPoints] = useState<number>(0)
  const [testFinished, setTestFinished] = useState<boolean>(false)
  const [pieChartData, setPieChartData] = useState<any>([0, 100])
  const [pointNumber, setPointNumber] = useState<number>(0)
  async function CheckAnswers() {
    setTestFinished(true)
    let points: number = 0
    Object.values(route.params.test.test).forEach((i: any, index: number) => {
      let usersChoise = chosenOptions.find((i: any) => {
        return i.test === index
      })

      if (i.options[i.answer] === usersChoise.answer) {
        points++
      }
    })
    setUserPoints(points)
    if (auth.currentUser && auth.currentUser.email)
      await CreateUserTestPoints(
        auth.currentUser.email,
        route.params.test.testID,
        points
      )
  }

  useEffect(() => {
    let number = 0
    const incrementer = setInterval(() => {
      if (
        number ===
        Math.ceil(
          (userPoints / Object.values(route.params.test.test).length) * 100
        )
      ) {
        clearInterval(incrementer)
      } else {
        number++

        setPieChartData([number, 100 - number])
        setPointNumber(number)
      }
    }, 2)
  }, [testFinished])

  useEffect(() => {
    if (
      route.params.user &&
      route.params.user.test &&
      route.params.user.test[route.params.test.testID]
    ) {
      setUserPoints(route.params.user.test[route.params.test.testID].points)
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
          paddingTop: 15,
          marginTop: 15,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            color:
              themeColor === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
          }}
        >
          {item.rule}
        </Text>
        <Text
          style={{
            fontSize: 20,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
          }}
        >
          {item.question}
        </Text>
        {Object.values(item.options).map((option: any, index: number) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={{
              width: '100%',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              backgroundColor:
                themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
              marginTop: 5,
              borderRadius: 5,
            }}
            onPress={() => {
              if (chosenOptions.find((i: any) => i.test === testIndex)) {
                let oprionsarr = chosenOptions.filter(
                  (i: any) => i.test !== testIndex
                )
                setChosenOptions([
                  ...oprionsarr,
                  { test: testIndex, answer: option },
                ])
              } else {
                setChosenOptions([
                  ...chosenOptions,
                  { test: testIndex, answer: option },
                ])
              }
            }}
          >
            <Ionicons
              name={
                chosenOptions.find(
                  (i: any) => i.test === testIndex && i.answer === option
                )
                  ? 'radio-button-on'
                  : 'radio-button-off'
              }
              size={24}
              color={
                themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText
              }
            />
            <Text
              style={{
                fontSize: 20,
                color:
                  themeColor === 'dark'
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
            route.params.user.test &&
            route.params.user.test[route.params.test.testID]) ? (
            <>
              <Text
                style={{
                  marginVertical: 30,
                  fontSize: 20,
                  color:
                    themeColor === 'dark'
                      ? colors.DarkMainText
                      : colors.LightMainText,
                }}
              >
                You have already passed this test
              </Text>
              <View
                style={{
                  width: width * 0.6,
                  height: width * 0.6,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <PieChart
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                  widthAndHeight={width * 0.6}
                  series={pieChartData}
                  sliceColor={[
                    themeColor === 'dark'
                      ? colors.DarkSuccessText
                      : colors.LightSuccessText,
                    themeColor === 'dark'
                      ? colors.DarkBGDanger
                      : colors.LightBGDanger,
                  ]}
                  coverRadius={0.8}
                  coverFill={
                    themeColor === 'dark'
                      ? colors.DarkBGComponent
                      : colors.LightBGComponent
                  }
                />
                <PieChart
                  style={{
                    position: 'absolute',
                    top: (width * 0.6 - width * 0.6 * 0.8) / 2,
                    left: (width * 0.6 - width * 0.6 * 0.8) / 2,
                    opacity: 0.3,
                  }}
                  widthAndHeight={width * 0.6 * 0.8}
                  series={pieChartData}
                  sliceColor={[
                    themeColor === 'dark'
                      ? colors.DarkSuccessText
                      : colors.LightSuccessText,
                    themeColor === 'dark'
                      ? colors.DarkBGDanger
                      : colors.LightBGDanger,
                  ]}
                  coverRadius={0.8}
                  coverFill={
                    themeColor === 'dark'
                      ? colors.DarkBGComponent
                      : colors.LightBGComponent
                  }
                />
                <Text
                  style={{
                    fontSize: 40,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                  }}
                >
                  {/* TODO this about it */}
                  {/* {Math.floor(
                  (pointNumber * Object.values(route.params.test.test).length) /
                    100
                )}
                /{Object.values(route.params.test.test).length} */}
                  {userPoints}/{Object.values(route.params.test.test).length}
                </Text>
              </View>
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
                data={Object.values(route.params.test.test)}
                renderItem={RenderTestItem}
              />
              <MainButton
                title="Save"
                disable={
                  Object.values(route.params.test.test).length !==
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
