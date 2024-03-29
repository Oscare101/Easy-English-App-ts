import {
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native'
import { styles } from '../../../constants/styles'
import { auth } from '../../../firebase'
import { getDatabase, onValue, ref } from 'firebase/database'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import colors from '../../../constants/colors'
import rules from '../../../constants/rules'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { UpdatePostLikes, DeletePost } from '../../../functions/Actions'
import text from '../../../constants/text'
import SwipeToDelete from '../../../components/SwipeToDelete'
import EditButton from '../../../components/EditButton'
import * as Clipboard from 'expo-clipboard'
import { Ionicons } from '@expo/vector-icons'
import Toast from 'react-native-toast-message'
import GradientText from '../../../components/GradientText'

export default function PostsScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  const [postInfo, setPostInfo] = useState<any>({})
  const [posts, setPosts] = useState<any>([])
  const [users, setUsers] = useState<any>({})
  const [page, setPage] = useState<string>('global')

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [360], [])
  const snapPointsForOtherUsers = useMemo(() => [300], [])
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setPostInfo({})
    }
  }, [])

  function GetUserPostsFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const data = ref(getDatabase(), `post`)
      onValue(data, (snapshot) => {
        if (snapshot.val()) {
          setPosts(Object.values(snapshot.val()).reverse())
        }
      })
    }
  }

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

  async function DeletePostFunc() {
    DeletePost(postInfo.id)
    setPosts(posts.filter((i: any) => i.id !== postInfo.id))
    setPostInfo({})
    bottomSheetModalRef.current?.dismiss()
  }

  const postsData: any = [
    {
      title: 'global',
      action: () => {
        setPage('global')
      },
      colors: [colors.Main, colors.Purple],
    },
    {
      title: 'friends',
      action: () => {
        setPage('friends')
      },
      colors: [colors.Green, colors.Main],
    },
  ]

  useEffect(() => {
    GetUserPostsFunc()
    GetUsersFunc()
  }, [])

  async function LikePostFunc(post: any) {
    if (auth.currentUser && auth.currentUser.email) {
      if (post.authorEmail === auth.currentUser.email) {
        Toast.show({
          type: 'ToastMessage',
          props: {
            title: `You cannot like your own post`,
          },
          position: 'bottom',
        })
      } else {
        let data: any = {}
        if (post.likes) {
          data = post.likes
          if (data[auth.currentUser.email.replace('.', ',')]) {
            delete data[auth.currentUser.email.replace('.', ',')]
          } else {
            data[auth.currentUser.email.replace('.', ',')] = {
              email: auth.currentUser.email,
              date: new Date().getTime(),
            }
          }
        } else {
          data[auth.currentUser.email.replace('.', ',')] = {
            email: auth.currentUser.email,
            date: new Date().getTime(),
          }
        }
        Vibration.vibrate(1, false)

        const response = await UpdatePostLikes(post.id, data)
      }
    }
  }

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
                color: users[item.authorEmail.replace('.', ',')]
                  ? themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                  : themeColor === 'dark'
                  ? colors.DarkDangerText
                  : colors.LightDangerText,
                opacity: users[item.authorEmail.replace('.', ',')] ? 0.7 : 0.5,
              }}
            >
              {users
                ? users[item.authorEmail.replace('.', ',')]
                  ? users[item.authorEmail.replace('.', ',')].name
                  : 'deleted user'
                : ''}
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
              setPostInfo(item)
              bottomSheetModalRef.current?.present()
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
        {auth.currentUser &&
        auth.currentUser.email &&
        item.authorEmail === auth.currentUser.email ? (
          <Text
            onPress={() => {
              navigation.navigate('PostLikesScreen', {
                post: item,
              })
            }}
            style={{
              fontSize: 14,
              color:
                themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText,
              textAlign: 'right',
            }}
          >
            {item.likes ? Object.values(item.likes).length : 0} likes
          </Text>
        ) : (
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              padding: 5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
            activeOpacity={0.8}
            onPress={() => LikePostFunc(item)}
          >
            <Text
              style={{
                fontSize: 14,
                color:
                  item.likes &&
                  auth.currentUser &&
                  auth.currentUser.email &&
                  item.likes[auth.currentUser.email.replace('.', ',')]
                    ? themeColor === 'dark'
                      ? colors.DarkMainText
                      : colors.LightMainText
                    : themeColor === 'dark'
                    ? colors.DarkCommentText
                    : colors.LightCommentText,
                textAlign: 'right',
                paddingRight: 10,
              }}
            >
              {item.likes ? Object.values(item.likes).length : 0}
            </Text>
            <Ionicons
              name="heart"
              size={24}
              color={
                item.likes &&
                auth.currentUser &&
                auth.currentUser.email &&
                item.likes[auth.currentUser.email.replace('.', ',')]
                  ? themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText
                  : themeColor === 'dark'
                  ? colors.DarkCommentText
                  : colors.LightCommentText
              }
            />
          </TouchableOpacity>
        )}
      </View>
    )
  }

  return (
    <BottomSheetModalProvider>
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
            justifyContent: 'space-around',
            width: '100%',
            borderBottomWidth: 1,
            borderColor:
              themeColor === 'dark' ? colors.DarkBorder : colors.LightBorder,
          }}
        >
          {postsData.map((item: any, index: number) => (
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
              {page === item.title ? (
                <GradientText
                  onPress={() => {}}
                  color1={item.colors[0]}
                  color2={item.colors[1]}
                  style={{ fontSize: 20, fontWeight: '700', letterSpacing: 1 }}
                >
                  {item.title}
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
        {posts.length ? (
          <FlatList
            style={{ width: '100%', paddingBottom: 20 }}
            data={posts}
            renderItem={renderUserPost}
            ListFooterComponent={() => <View style={{ height: 10 }} />}
          />
        ) : (
          <></>
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
          snapPoints={
            postInfo.authorEmail === auth.currentUser?.email
              ? snapPoints
              : snapPointsForOtherUsers
          }
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
                themeColor === 'dark'
                  ? colors.DarkBGModal
                  : colors.LightBGModal,
              flex: 1,
            }}
          >
            <View
              style={{
                borderColor:
                  themeColor === 'dark'
                    ? colors.DarkBorder
                    : colors.LightBorder,
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
                {postInfo && postInfo.text
                  ? postInfo.text.replace(/\n/g, ' ')
                  : ''}
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
              <EditButton
                amountInARow={3}
                title="Copy"
                icon="copy"
                action={() => {
                  Clipboard.setStringAsync(postInfo.text)
                  bottomSheetModalRef.current?.dismiss()
                }}
              />
              {users &&
              postInfo &&
              postInfo.authorEmail &&
              users[postInfo.authorEmail.replace('.', ',')] ? (
                postInfo.authorEmail === auth.currentUser?.email ? (
                  <>
                    <EditButton
                      amountInARow={3}
                      title="Edit"
                      icon="edit"
                      action={() => {
                        navigation.navigate('NewPostScreen', { post: postInfo })
                        bottomSheetModalRef.current?.dismiss()
                      }}
                    />
                    <EditButton
                      amountInARow={3}
                      title={
                        postInfo.likes
                          ? Object.values(postInfo.likes).length + ' likes'
                          : 0 + ' likes'
                      }
                      icon="heart"
                      action={() => {
                        navigation.navigate('PostLikesScreen', {
                          post: postInfo,
                        })
                        bottomSheetModalRef.current?.dismiss()
                      }}
                    />
                  </>
                ) : (
                  <>
                    <EditButton
                      amountInARow={3}
                      title="Profile"
                      icon="user"
                      action={() => {
                        navigation.navigate('UserScreen', {
                          user: postInfo.authorEmail,
                        })
                        bottomSheetModalRef.current?.dismiss()
                      }}
                    />
                    <EditButton
                      amountInARow={3}
                      title="Report"
                      icon="alert-octagon"
                      action={() => {
                        Alert.alert(
                          'will be implemented in the next global version'
                        )
                      }}
                    />
                  </>
                )
              ) : (
                <></>
              )}
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
                {users &&
                postInfo &&
                postInfo.authorEmail &&
                users[postInfo.authorEmail.replace('.', ',')]
                  ? postInfo.authorEmail === auth.currentUser?.email
                    ? text.DeletingPost
                    : text.OtherUserPost
                  : text.DeletedUserPost}
              </Text>
            </View>
            {postInfo.authorEmail === auth.currentUser?.email ? (
              <SwipeToDelete
                title="Swipe to delete"
                action={DeletePostFunc}
                icon="trash-outline"
              />
            ) : (
              <></>
            )}
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}
