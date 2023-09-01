import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { styles } from '../../../constants/styles'
import MainButton from '../../../components/MainButton'
import { LogOut } from '../../../functions/Actions'
import { useEffect, useState } from 'react'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { auth, db } from '../../../firebase'
import { getDatabase, onValue, ref, remove, update } from 'firebase/database'
import { User } from '../../../constants/interfaces'
import colors from '../../../constants/colors'
import GradientText from '../../../components/GradientText'
import rules from '../../../constants/rules'
import RenderReportCoursesItem from '../../../components/RenderReportCoursesItem'
import text from '../../../constants/text'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'

const width = Dimensions.get('screen').width

export default function CoursesScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [courses, setCourses] = useState<any>([])
  const [tests, setTests] = useState<any>([])
  const [pageTitle, setPageTitle] = useState<string>('Courses')
  const [page, setPage] = useState<string>('course')
  const [topCardHeight, setTopCardHeight] = useState<number>(232.38)
  const [user, setUser] = useState<User>({} as User)

  async function GetCourses() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `course/`)
      onValue(data, (snapshot) => {
        setCourses(Object.values(snapshot.val()))
      })
    }
  }

  async function GetTests() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `test/`)
      onValue(data, (snapshot) => {
        setTests(Object.values(snapshot.val()))
      })
    }
  }

  function GetUserFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(
        getDatabase(),
        `user/` + auth.currentUser.email.replace('.', ',')
      )
      onValue(data, (snapshot) => {
        setUser(snapshot.val() as User)
      })
    }
  }

  useEffect(() => {
    GetCourses()
    GetTests()
    GetUserFunc()
  }, [])

  const reportCoursesData = [
    {
      icon: 'pie-chart-outline',
      title: 'statistics',
      action: () => {
        navigation.navigate('StatisticScreen', { user: user })
      },
    },
    {
      icon: 'documents-outline',
      title: 'PDF',
      action: () => {
        navigation.navigate('PDFScreen')
      },
    },
  ]

  const coursesTestsData = [
    {
      title: 'Courses',
      action: () => {
        setPage('course')
        setPageTitle('Courses')
      },
      colors: [colors.Main, colors.Purple],
    },
    {
      title: 'Tests',
      action: () => {
        setPage('test')
        setPageTitle('Tests')
      },
      colors: [colors.Green, colors.Main],
    },
  ]

  function RenderCourseItem({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          padding: 10,
          width: width * 0.44,
          borderColor:
            themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
          borderWidth: 1,
          borderRadius: 8,
          margin: width * 0.02,
        }}
        onPress={() => {
          navigation.navigate('CoursePage', { course: item })
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
          }}
        >
          {item.title}
        </Text>
        <GradientText
          onPress={() => navigation.navigate('CoursePage', { course: item })}
          color1={rules.colors[rules.levels[item.level]][0]}
          color2={rules.colors[rules.levels[item.level]][1]}
          style={[styles.text16]}
        >
          {rules.levels[item.level]}
        </GradientText>
      </TouchableOpacity>
    )
  }

  function RenderTestItem({ item }: any) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          padding: 10,
          width: width * 0.44,
          borderColor:
            themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
          borderWidth: 1,
          borderRadius: 8,
          margin: width * 0.02,
        }}
        onPress={() => {
          navigation.navigate('TestPage', { test: item, user: user })
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
          }}
        >
          {item.title}
        </Text>
        <GradientText
          onPress={() =>
            navigation.navigate('TestPage', { test: item, user: user })
          }
          color1={rules.colors[rules.levels[item.level]][0]}
          color2={rules.colors[rules.levels[item.level]][1]}
          style={[styles.text16]}
        >
          {rules.levels[item.level]}
        </GradientText>
        {user.test && user.test[item.id] ? (
          <Text
            style={{
              fontSize: 18,
              color:
                themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText,
            }}
          >
            passed: {user.test[item.id].points}/
            {Object.values(item.question).length}
          </Text>
        ) : (
          <></>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{
        flex: 1,
        backgroundColor:
          themeColor === 'dark'
            ? colors.DarkBGComponent
            : colors.LightBGComponent,
      }}
    >
      <View
        onLayout={(event) => {
          setTopCardHeight(event.nativeEvent.layout.height)
        }}
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
          paddingVertical: 20,
        }}
      >
        <View
          style={{
            position: 'absolute',
            backgroundColor:
              themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
            height: 50,
            width: '100%',
            top: topCardHeight,
          }}
        />
        <StatusBar
          barStyle={themeColor === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={
            themeColor === 'dark' ? colors.DarkBG : colors.LightBG
          }
        />
        <GradientText
          onPress={() => {}}
          color1={pageTitle === 'Courses' ? colors.Main : colors.Green}
          color2={pageTitle === 'Courses' ? colors.Purple : colors.Main}
          style={[styles.BigTitle]}
        >
          {pageTitle}
        </GradientText>
        <Text
          style={{
            padding: 15,
            color:
              themeColor === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
            textAlign: 'center',
            fontSize: 12,
          }}
        >
          {pageTitle === 'Courses' ? text.coursesComment : text.testsComment}
        </Text>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: width * 0.02,
          }}
        >
          {reportCoursesData.map((item: any, index: number) => (
            <RenderReportCoursesItem key={index} item={item} />
          ))}
        </View>
      </View>
      <View
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          borderRadius: 24,
          borderBottomRightRadius: 0,
          borderBottomLeftRadius: 0,
          backgroundColor:
            themeColor === 'dark'
              ? colors.DarkBGComponent
              : colors.LightBGComponent,
          elevation: 25,
          padding: width * 0.02,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: '100%',
            borderBottomWidth: 1,
            borderColor:
              themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
            marginBottom: 10,
          }}
        >
          {coursesTestsData.map((item: any, index: number) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => item.action()}
              style={{
                width: '40%',
                padding: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              key={index}
            >
              {pageTitle === item.title ? (
                <GradientText
                  onPress={() => {}}
                  color1={item.colors[0]}
                  color2={item.colors[1]}
                  style={{ fontSize: 20, fontWeight: '700', letterSpacing: 1 }}
                >
                  {pageTitle}
                </GradientText>
              ) : (
                <Text
                  style={{
                    fontSize: 20,
                    letterSpacing: 1,
                    color:
                      themeColor === 'dark'
                        ? colors.DarkCommentText
                        : colors.LightCommentText,
                  }}
                >
                  {item.title}
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
        {pageTitle === 'Courses' ? (
          <FlatList
            scrollEnabled={false}
            numColumns={2}
            style={{ height: '100%', flex: 1 }}
            data={courses}
            renderItem={RenderCourseItem}
          />
        ) : (
          <FlatList
            scrollEnabled={false}
            numColumns={2}
            style={{ height: '100%', flex: 1 }}
            data={tests}
            renderItem={RenderTestItem}
          />
        )}
      </View>
    </ScrollView>
  )
}
