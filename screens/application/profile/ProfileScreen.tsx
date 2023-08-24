import {
  Dimensions,
  FlatList,
  Image,
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
import { auth, db, storage } from '../../../firebase'
import { ref as refStorage, getDownloadURL } from 'firebase/storage'

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
import { GetTheme } from '../../../functions/Functions'
import { RootState } from '../../../redux'
import { useSelector } from 'react-redux'
const width = Dimensions.get('screen').width

export default function ProfileScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [user, setUser] = useState<User>({} as User)
  const [usersPosts, setUsersPost] = useState<any>([])
  const [post, setPost] = useState<any>({})
  const [image, setImage] = useState<any>('')
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [360], [])
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

  async function GetUserPhoto() {
    if (auth.currentUser && auth.currentUser.email) {
      const img = refStorage(storage, `user/${auth.currentUser?.email}`)
      await getDownloadURL(img)
        .then((i) => {
          setImage(i)
        })
        .catch((e) => {
          if (e.code.includes('storage/object-not-found')) {
            setImage('')
          }
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

  useEffect(() => {
    GetUserPhoto()
  }, [user.photo])

  function renderUserPost({ item }: any) {
    return (
      <View
        style={[
          styles.Card,
          {
            width: rules.componentWidthPercent,
            alignSelf: 'center',
            borderRadius: 8,
            backgroundColor:
              themeColor === 'dark'
                ? colors.DarkBGComponent
                : colors.LightBGComponent,
            borderWidth: 1,
            borderColor:
              themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
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
              style={{
                fontSize: 18,
                color:
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText,
              }}
            >
              {user.name}
            </Text>
            <Text
              style={{
                fontSize: 14,
                color:
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
              }}
            >
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
                  backgroundColor:
                    themeColor === 'dark'
                      ? colors.DarkCommentText
                      : colors.LightCommentText,
                  borderRadius: 4,
                  margin: 2,
                }}
              />
            ))}
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontSize: 18,
            color:
              themeColor === 'dark'
                ? colors.DarkMainText
                : colors.LightMainText,
          }}
        >
          {item.text}
        </Text>
        {item.lastEdited ? (
          <Text
            style={{
              fontSize: 12,
              color:
                themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText,
              textAlign: 'right',
            }}
          >
            edited {new Date(item.lastEdited).toLocaleString()}
          </Text>
        ) : (
          <></>
        )}
      </View>
    )
  }

  const userCard = (
    <>
      <View
        style={[
          styles.Card,
          {
            backgroundColor:
              themeColor === 'dark'
                ? colors.DarkBGComponent
                : colors.LightBGComponent,
          },
        ]}
      >
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
            {image ? (
              <Image
                style={{ width: '100%', height: '100%' }}
                source={{
                  uri: image,
                }}
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor:
                    themeColor === 'dark'
                      ? colors.DarkCommentText
                      : colors.LightCommentText,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialIcons
                  name="insert-photo"
                  size={width * 0.15}
                  color={
                    themeColor === 'dark'
                      ? colors.DarkBorder
                      : colors.LightBorder
                  }
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
              style={{
                fontSize: 22,
                color:
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText,
              }}
            >
              {user ? user.name : ''}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 14,
                color:
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
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
                    backgroundColor:
                      themeColor === 'dark'
                        ? colors.DarkCommentText
                        : colors.LightCommentText,
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
            <Text
              style={{
                fontSize: 14,
                paddingTop: 8,
                color:
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
              }}
            >
              bio
            </Text>
            <Text
              style={{
                fontSize: 14,
                color:
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
              }}
            >
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
      <StatusBar
        barStyle={themeColor === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={themeColor === 'dark' ? colors.DarkBG : colors.LightBG}
      />
      <View
        style={[
          styles.ViewStart,
          {
            backgroundColor:
              themeColor === 'dark' ? colors.DarkBG : colors.LightBG,
          },
        ]}
      >
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: '100%' }}
          data={[0, 1]}
          renderItem={renderProfileScreenItem}
        />
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
        onChange={handleSheetChanges}
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
              {post && post.text ? post.text.replace(/\n/g, ' ') : ''}
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.navigate('NewPostScreen', { post: post })
              bottomSheetModalRef.current?.dismiss()
            }}
            style={{
              width: rules.componentWidthPercent,
              marginTop: 20,
              borderRadius: 8,
              overflow: 'hidden',
              borderColor:
                themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,

              borderWidth: 1,
              height: 60,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
                fontSize: 20,
              }}
            >
              Edit
            </Text>
          </TouchableOpacity>
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
              {text.DeletingPost}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={DeletePostFunc}
            style={{
              width: rules.componentWidthPercent,
              marginTop: 20,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor:
                themeColor === 'dark'
                  ? colors.DarkBGDanger
                  : colors.LightBGDanger,

              borderColor:
                themeColor === 'dark'
                  ? colors.DarkDangerText
                  : colors.LightDangerText,

              borderWidth: 1,
              height: 60,
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 2,
            }}
          >
            <Text
              style={{
                color:
                  themeColor === 'dark'
                    ? colors.DarkDangerText
                    : colors.LightDangerText,
                fontSize: 20,
              }}
            >
              Delete post
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}
