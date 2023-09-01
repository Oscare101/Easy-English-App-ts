import {
  View,
  Text,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'
import colors from '../../../constants/colors'
import { styles } from '../../../constants/styles'
import PieChart from 'react-native-pie-chart'
import { useEffect, useState } from 'react'
import rules from '../../../constants/rules'
import { auth } from '../../../firebase'
import { getDatabase, onValue, ref } from 'firebase/database'
import { Ionicons } from '@expo/vector-icons'
import text from '../../../constants/text'
const width = Dimensions.get('screen').width

export default function StatisticScreen({ navigation, route }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  const [statistic, setStatistic] = useState<any[]>([])
  const [tests, setTests] = useState<any>({})
  const [userTests, setUserTests] = useState<any>([])
  const [user, serUser] = useState<any>(route.params.user)

  function GetUserStatistic() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(
        getDatabase(),
        `user/${auth.currentUser.email.replace('.', ',')}`
      )
      onValue(data, (snapshot) => {
        if (snapshot.val().test) {
          setUserTests(Object.values(snapshot.val().test))
          serUser(snapshot.val())
          let questionsAmount = 0
          let rightAnswers = 0
          Object.values(snapshot.val().test).forEach((i: any) => {
            questionsAmount += i.answers.length
            rightAnswers += i.points
          })
          setStatistic([rightAnswers, questionsAmount - rightAnswers])
        } else {
          setStatistic([])
        }
      })
    }
  }

  async function GetTestsData() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `test/`)
      onValue(data, (snapshot) => {
        setTests(snapshot.val())
      })
    }
  }

  useEffect(() => {
    GetUserStatistic()
    GetTestsData()
  }, [])

  function RenderUserTestItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingVertical: 15,
        }}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('TestPage', {
            test: tests[item.id],
            user: user,
          })
        }}
      >
        <Text
          style={{
            fontSize: 16,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
            width: '65%',
          }}
        >
          {item.title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
            width: '15%',
          }}
        >
          {item.points}/{Object.values(item.answers).length}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
            width: '25%',
          }}
        >
          {new Date(item.date).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View
      style={[
        styles.ViewStart,
        {
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
        },
      ]}
    >
      <ScrollView style={{ width: '100%' }}>
        <View style={styles.ViewStart}>
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
              Your results
            </Text>
            <View style={{ width: 50 }} />
          </View>

          {statistic.length && Object.values(tests).length ? (
            <>
              <View
                style={{
                  width: width * 0.6,
                  height: width * 0.6,
                  marginVertical: 70,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
              >
                <PieChart
                  widthAndHeight={width * 0.6}
                  series={statistic}
                  sliceColor={[
                    themeColor === 'dark'
                      ? colors.DarkSuccessText
                      : colors.LightSuccessText,
                    themeColor === 'dark'
                      ? colors.DarkDangerText
                      : colors.LightDangerText,
                  ]}
                  coverRadius={0.69}
                  coverFill={
                    themeColor === 'dark' ? colors.DarkBG : colors.LightBG
                  }
                />
                <PieChart
                  style={{
                    position: 'absolute',
                    top: width * 0.6 * 0.15,
                    left: width * 0.6 * 0.15,
                    opacity: 0.8,
                  }}
                  widthAndHeight={width * 0.6 * 0.7}
                  series={statistic}
                  sliceColor={[
                    themeColor === 'dark'
                      ? colors.DarkSuccessText
                      : colors.LightSuccessText,
                    themeColor === 'dark'
                      ? colors.DarkDangerText
                      : colors.LightDangerText,
                  ]}
                  coverRadius={0.8}
                  coverFill={
                    themeColor === 'dark' ? colors.DarkBG : colors.LightBG
                  }
                />
                <Text
                  style={{
                    fontSize: 24,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkCommentText
                        : colors.LightCommentText,
                    position: 'absolute',
                  }}
                >
                  {statistic[0]}/{statistic[0] + statistic[1]}
                </Text>
              </View>
              <View
                style={{
                  backgroundColor:
                    themeColor === 'dark'
                      ? colors.DarkBGComponent
                      : colors.LightBGComponent,
                  padding: 15,
                  width: width * rules.componentWidth,
                  borderRadius: 15,
                  marginBottom: 2,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                    width: '65%',
                  }}
                >
                  test name
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                    width: '15%',
                  }}
                >
                  points
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkMainText
                        : colors.LightMainText,
                    width: '25%',
                  }}
                >
                  date
                </Text>
              </View>
              <FlatList
                style={{
                  backgroundColor:
                    themeColor === 'dark'
                      ? colors.DarkBGComponent
                      : colors.LightBGComponent,
                  paddingHorizontal: 15,
                  width: width * rules.componentWidth,
                  borderRadius: 15,
                }}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      width: '100%',
                      height: 1,
                      backgroundColor:
                        themeColor === 'dark'
                          ? colors.DarkBorder
                          : colors.LightBorder,
                    }}
                  />
                )}
                scrollEnabled={false}
                data={userTests}
                renderItem={RenderUserTestItem}
              />
            </>
          ) : (
            <>
              <Text
                style={{
                  fontSize: 24,
                  color:
                    themeColor === 'dark'
                      ? colors.DarkCommentText
                      : colors.LightCommentText,
                  paddingTop: 100,
                }}
              >
                No tests passed yet
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  color:
                    themeColor === 'dark'
                      ? colors.DarkCommentText
                      : colors.LightCommentText,
                  paddingTop: 20,
                  textAlign: 'center',
                  width: rules.componentWidthPercent,
                }}
              >
                {text.EmptyStatisticText}
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  )
}
