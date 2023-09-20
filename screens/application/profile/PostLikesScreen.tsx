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

export default function PostLikesScreen({ navigation, route }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  const [users, setUsers] = useState<any>({})

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

  useEffect(() => {
    GetUsersFunc()
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
          if (users[item.email.replace('.', ',')]) {
            navigation.navigate('UserScreen', {
              user: item.email,
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

              color: users[item.email.replace('.', ',')]
                ? themeColor === 'dark'
                  ? colors.DarkMainText
                  : colors.LightMainText
                : themeColor === 'dark'
                ? colors.DarkDangerText
                : colors.LightDangerText,
              opacity: users[item.email.replace('.', ',')] ? 1 : 0.5,
            }}
          >
            {users
              ? users[item.email.replace('.', ',')]
                ? users[item.email.replace('.', ',')].name
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
              users[item.email.replace('.', ',')] ? (
                <UserStatus
                  mentor={users[item.email.replace('.', ',')].mentor}
                  admin={users[item.email.replace('.', ',')].admin}
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
              {new Date(item.date).toLocaleString()}
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
          Post likes
        </Text>
        <View style={{ width: 50 }} />
      </View>
      {route.params.post.likes ? (
        <FlatList
          style={{ width: '100%' }}
          data={Object.values(route.params.post.likes)}
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
          No likes yet
        </Text>
      )}
    </View>
  )
}
