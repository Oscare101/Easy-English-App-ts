import {
  Alert,
  FlatList,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import { DeletePost } from '../../../functions/Actions'
import text from '../../../constants/text'
import SwipeToDelete from '../../../components/SwipeToDelete'
import EditButton from '../../../components/EditButton'
import * as Clipboard from 'expo-clipboard'

export default function PostsScreen({ navigation }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)
  const [postInfo, setPostInfo] = useState<any>({})
  const [posts, setPosts] = useState<any>([])
  const [users, setUsers] = useState<any>({})
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

  useEffect(() => {
    GetUserPostsFunc()
    GetUsersFunc()
  }, [])

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
                    ? colors.DarkCommentText
                    : colors.LightCommentText
                  : themeColor === 'dark'
                  ? colors.DarkDangerText
                  : colors.LightDangerText,
                opacity: users[item.authorEmail.replace('.', ',')] ? 1 : 0.5,
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
        {posts.length ? (
          <FlatList
            style={{ width: '100%', paddingBottom: 20 }}
            data={posts}
            renderItem={renderUserPost}
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
                amountInARow={
                  postInfo.authorEmail === auth.currentUser?.email ? 2 : 3
                }
                title="Copy"
                icon="copy"
                action={() => {
                  Clipboard.setStringAsync(postInfo.text)
                  bottomSheetModalRef.current?.dismiss()
                }}
              />
              {postInfo.authorEmail === auth.currentUser?.email ? (
                <EditButton
                  amountInARow={2}
                  title="Edit"
                  icon="edit"
                  action={() => {
                    navigation.navigate('NewPostScreen', { post: postInfo })
                    bottomSheetModalRef.current?.dismiss()
                  }}
                />
              ) : (
                <>
                  <EditButton
                    amountInARow={3}
                    title="Profile"
                    icon="user"
                    action={() => {
                      Alert.alert(
                        'will be implemented in the next global version'
                      )
                      // navigation.navigate('NewPostScreen', { post: postInfo })
                      // bottomSheetModalRef.current?.dismiss()
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
                      // navigation.navigate('NewPostScreen', { post: postInfo })
                      // bottomSheetModalRef.current?.dismiss()
                    }}
                  />
                </>
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
                {postInfo.authorEmail === auth.currentUser?.email
                  ? text.DeletingPost
                  : text.OtherUserPost}
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
