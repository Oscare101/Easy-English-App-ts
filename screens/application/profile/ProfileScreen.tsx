import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { styles } from '../../../constants/styles'
import MainButton from '../../../components/MainButton'
import { DeletePost, LogOut } from '../../../functions/Actions'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { auth, db } from '../../../firebase'
import { getDatabase, onValue, ref, remove, update } from 'firebase/database'
import { User } from '../../../constants/interfaces'
import { MaterialIcons } from '@expo/vector-icons'
import colors from '../../../constants/colors'
import GradientText from '../../../components/GradientText'
import SecondaryButton from '../../../components/SecondaryButton'
import rules from '../../../constants/rules'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import text from '../../../constants/text'
const width = Dimensions.get('screen').width

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User>({} as User)
  const [usersPosts, setUsersPost] = useState<any>([])
  const [post, setPost] = useState<any>({})

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [300], [])
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setPost({})
    }
  }, [])
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

  function GetUserPostsFunc(email: string) {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `post`)
      onValue(data, (snapshot) => {
        if (snapshot.val()) {
          setUsersPost(
            Object.values(snapshot.val())
              .filter((post: any) => post.authorEmail === email)
              .reverse()
          )
        }
      })
    }
  }

  async function DeletePostFunc() {
    DeletePost(post.key)
    setUsersPost(usersPosts.filter((i: any) => i.key !== post.key))
    setPost({})
    bottomSheetModalRef.current?.dismiss()
  }

  useEffect(() => {
    GetUserFunc()
  }, [])

  useEffect(() => {
    GetUserPostsFunc(user.email)
  }, [user])

  function renderUserPost({ item }: any) {
    return (
      <View
        style={[
          styles.Card,
          {
            width: rules.componentWidthPercent,
            alignSelf: 'center',
            borderRadius: 8,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'center',
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ fontSize: 18, color: colors.Black }}
            >
              {item.author}
            </Text>
            <Text style={{ fontSize: 14, color: colors.DarkGrey }}>
              {new Date(item.date).toLocaleString()}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 7,
            }}
            onPress={() => {
              setPost(item)
              bottomSheetModalRef.current?.present()
              // navigation.navigate('ProfileSettings')
            }}
          >
            {[0, 1, 2].map((_: any, index: number) => (
              <View
                key={index}
                style={{
                  width: 4,
                  height: 4,
                  backgroundColor: colors.DarkGrey,
                  borderRadius: 4,
                  margin: 2,
                }}
              />
            ))}
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 18, color: colors.Black }}>{item.text}</Text>
      </View>
    )
  }

  const userCard = (
    <>
      <View style={styles.Card}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <View
            style={{
              width: width * 0.2,
              height: width * 0.2,
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            {user && user.photo ? (
              <></>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: colors.Grey,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons
                  name="insert-photo"
                  size={width * 0.15}
                  color={colors.LightGrey}
                />
              </View>
            )}
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              overflow: 'hidden',
              flex: 1,
              paddingLeft: 16,
            }}
          >
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textName}
            >
              {user ? user.name : ''}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.textFollowers}
            >
              <Text style={styles.textFollowersNumber}>
                {user && user.followers ? user.followers.length : 0}
              </Text>{' '}
              followers
            </Text>
            <GradientText
              onPress={() => {}}
              color1={user && user.mentor ? colors.Error : colors.Main}
              color2={user && user.mentor ? colors.Purple : colors.Green}
              style={[styles.text18]}
            >
              {user && user.mentor ? 'mentor' : 'student'}
            </GradientText>
          </View>
          <View
            style={{
              width: 30,
              height: '100%',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,
              }}
              onPress={() => {
                navigation.navigate('ProfileSettings')
              }}
            >
              {[0, 1, 2].map((_: any, index: number) => (
                <View
                  key={index}
                  style={{
                    width: 5,
                    height: 5,
                    backgroundColor: colors.DarkGrey,
                    borderRadius: 5,
                    margin: 2,
                  }}
                />
              ))}
            </TouchableOpacity>
          </View>
        </View>
        {user && user.description ? (
          <>
            <Text style={{ fontSize: 14, paddingTop: 8, color: colors.Grey }}>
              bio
            </Text>
            <Text style={{ fontSize: 14, color: colors.Black }}>
              {user ? user.description : ''}
            </Text>
          </>
        ) : (
          <></>
        )}
      </View>
      <SecondaryButton
        title="Create new post"
        action={() => {
          navigation.navigate('NewPostScreen', { user: user })
        }}
        style={{ marginTop: 8 }}
      />
    </>
  )

  const postCard = (
    <FlatList
      scrollEnabled={false}
      style={{ width: '100%', paddingBottom: 20 }}
      data={usersPosts}
      renderItem={renderUserPost}
    />
  )

  function renderProfileScreenItem({ item }: any) {
    return (
      <View style={styles.ViewStart}>{item === 0 ? userCard : postCard}</View>
    )
  }

  return (
    <BottomSheetModalProvider>
      <View style={styles.ViewStart}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.White} />

        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: '100%' }}
          data={[0, 1]}
          renderItem={renderProfileScreenItem}
        />
      </View>
      {/* BottomSheet */}
      <BottomSheetModal
        backgroundStyle={{ backgroundColor: colors.White }}
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={({ style }) => (
          <TouchableWithoutFeedback
            onPress={() => bottomSheetModalRef.current?.dismiss()}
          >
            <View style={[style, { backgroundColor: colors.ShadowBG }]}>
              <StatusBar backgroundColor={colors.ShadowBG} />
            </View>
          </TouchableWithoutFeedback>
        )}
      >
        <View style={{ backgroundColor: colors.White, flex: 1 }}>
          <View
            style={{
              borderColor: colors.LightGrey,
              borderBottomWidth: 1,
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
              }}
            >
              {post && post.text ? post.text.replace(/\n/g, ' ') : ''}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              paddingVertical: 10,
              color: colors.DarkGrey,
            }}
          >
            {text.DeletingPost}
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={DeletePostFunc}
            style={{
              width: rules.componentWidthPercent,
              marginTop: 20,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: colors.White,
              borderColor: colors.Error,
              borderWidth: 2,
              height: 60,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
            }}
          >
            <Text style={{ color: colors.Error, fontSize: 20 }}>
              Delete post
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}