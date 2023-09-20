import { FlatList, Text, TouchableOpacity, View } from 'react-native'
import { styles } from '../../../constants/styles'
import colors from '../../../constants/colors'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'
import { Ionicons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { auth } from '../../../firebase'
import { getDatabase, onValue, ref } from 'firebase/database'
import rules from '../../../constants/rules'
import Toast from 'react-native-toast-message'
import UserStatus from '../../../components/UserStatus'

export default function FollowersScreen({ navigation, route }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  const [users, setUsers] = useState<any>({})
  const [followers, setFollowers] = useState<any>({})

  function GetUsersFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `user`)
      onValue(data, (snapshot) => {
        if (snapshot.val()) {
          setUsers(snapshot.val())
        }
      })
    }
  }

  function GetUserFollowers() {
    if (auth.currentUser && auth.currentUser.email) {
      let followersArr: any = []
      Object.values(route.params.followers).map((i: any, index: number) => {
        Object.values(i).map((k: any) => {
          if (k.email === auth.currentUser?.email) {
            followersArr.push(Object.keys(route.params.followers)[index])
          }
        })
      })
      setFollowers(followersArr)
    }
  }

  useEffect(() => {
    GetUsersFunc()
    if (auth.currentUser && auth.currentUser.email) {
      if (route.params.title === 'followers') {
        GetUserFollowers()
      } else {
        setFollowers(
          Object.keys(
            route.params.followers[auth.currentUser?.email?.replace('.', ',')]
          )
        )
      }
    }
  }, [])

  function RenderItem({ item }: any) {
    return (
      <TouchableOpacity
        style={{
          width: rules.componentWidthPercent,
          backgroundColor:
            themeColor === 'dark'
              ? colors.DarkBGComponent
              : colors.LightBGComponent,
          borderRadius: 8,
          marginVertical: 10,
          alignSelf: 'center',
          padding: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 15,
        }}
        activeOpacity={0.8}
        onPress={() => {
          if (users[item.replace('.', ',')]) {
            navigation.navigate('UserScreen', {
              user: users[item.replace('.', ',')].email,
            })
          } else {
            Toast.show({
              type: 'ToastMessage',
              props: {
                title: `You cannot open the profile of deleted account`,
              },
              position: 'bottom',
            })
          }
        }}
      >
        <View style={{ flexDirection: 'column' }}>
          <Text
            style={{
              fontSize: 24,

              color: users[item.replace('.', ',')]
                ? themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText
                : themeColor === 'dark'
                ? colors.DarkDangerText
                : colors.LightDangerText,
              opacity: users[item.replace('.', ',')] ? 1 : 0.5,
            }}
          >
            {users
              ? users[item.replace('.', ',')]
                ? users[item.replace('.', ',')].name
                : 'deleted user'
              : ''}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            {users ? (
              users[item.replace('.', ',')] ? (
                <UserStatus
                  mentor={users[item.replace('.', ',')].mentor}
                  admin={users[item.replace('.', ',')].admin}
                />
              ) : (
                <></>
              )
            ) : (
              <></>
            )}
            <Text
              style={{
                fontSize: 16,
                color:
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
                paddingLeft: 10,
              }}
            >
              {auth.currentUser && auth.currentUser?.email
                ? new Date(
                    route.params.followers[item.replace('.', ',')][
                      auth.currentUser?.email?.replace('.', ',')
                    ].date
                  ).toLocaleString()
                : ''}
            </Text>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={24}
          color={
            themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText
          }
        />
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
              themeColor === 'dark' ? colors.DarkMainText : colors.LightMainText
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
          {route.params.title === 'followers'
            ? 'Your followers'
            : 'Your followings'}
        </Text>
        <View style={{ width: 50 }} />
      </View>
      {followers ? (
        <FlatList
          style={{ width: '100%' }}
          data={followers}
          renderItem={RenderItem}
        />
      ) : (
        <Text
          style={{
            fontSize: 24,
            color:
              themeColor === 'dark'
                ? colors.DarkCommentText
                : colors.LightCommentText,
            paddingTop: '20%',
          }}
        >
          No followers yet
        </Text>
      )}
    </View>
  )
}
