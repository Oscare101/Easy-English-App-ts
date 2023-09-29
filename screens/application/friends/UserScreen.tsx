import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Vibration,
  View,
} from 'react-native'
import { styles } from '../../../constants/styles'
import {
  FollowUser,
  UnFollowUser,
  UpdatePostLikes,
} from '../../../functions/Actions'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { auth, db, storage } from '../../../firebase'
import { ref as refStorage, getDownloadURL } from 'firebase/storage'
import * as Clipboard from 'expo-clipboard'
import { getDatabase, onValue, ref } from 'firebase/database'
import { User } from '../../../constants/interfaces'
import { MaterialIcons } from '@expo/vector-icons'
import colors from '../../../constants/colors'
import GradientText from '../../../components/GradientText'
import rules from '../../../constants/rules'
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import text from '../../../constants/text'
import { RootState } from '../../../redux'
import { useSelector } from 'react-redux'
import EditButton from '../../../components/EditButton'
import ImageView from 'react-native-image-viewing'
import { Ionicons } from '@expo/vector-icons'
import UserStatus from '../../../components/UserStatus'

const width = Dimensions.get('screen').width

export default function UserScreen({ navigation, route }: any) {
  const { themeColor } = useSelector((state: RootState) => state.themeColor)

  const [user, setUser] = useState<User>({} as User)
  const [followers, setFollowers] = useState<any>({})
  const [usersPosts, setUsersPost] = useState<any>([])
  const [postInfo, setPostInfo] = useState<any>({})
  const [image, setImage] = useState<any>('')
  const [imageVisible, setImageVisible] = useState<boolean>(false)

  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const snapPoints = useMemo(() => [300], [])
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setPostInfo({})
    }
  }, [])

  function GetUserFunc() {
    const data = ref(
      getDatabase(),
      `user/` + route.params.user.replace('.', ',')
    )
    onValue(data, (snapshot) => {
      setUser(snapshot.val() as User)
    })
  }

  function GetFollowersFunc() {
    const data = ref(getDatabase(), `followers/`)
    onValue(data, (snapshot) => {
      setFollowers(snapshot.val())
    })
  }

  async function GetUserPhoto() {
    const img = refStorage(storage, `user/${route.params.user}`)
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

  function GetUserPostsFunc(email: string) {
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

  async function FollowFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      let data: any = { email: user.email, date: new Date().getTime() }
      Vibration.vibrate(1, false)

      const response = await FollowUser(
        auth.currentUser.email.replace('.', ','),
        data
      )
    }
  }

  async function UnFollowFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      Vibration.vibrate(1, false)

      const response = await UnFollowUser(
        auth.currentUser.email.replace('.', ','),
        user.email.replace('.', ',')
      )
    }
  }

  function FollowersAmount() {
    let amount: number = 0
    Object.values(followers).map((i: any) => {
      Object.values(i).map((k: any) => {
        if (k.email === user.email) {
          amount++
        }
      })
    })
    return amount
  }

  function IsFollowing() {
    if (auth.currentUser && auth.currentUser.email) {
      return (
        followers &&
        followers[auth.currentUser?.email.replace('.', ',')] &&
        followers[auth.currentUser?.email.replace('.', ',')][
          user.email.replace('.', ',')
        ]
      )
    }
  }

  useEffect(() => {
    GetUserFunc()
    GetFollowersFunc()
  }, [])

  useEffect(() => {
    if (user) {
      GetUserPostsFunc(user.email)
    }
  }, [user])

  useEffect(() => {
    GetUserPhoto()
  }, [user && user.photo])

  async function LikePostFunc(post: any) {
    if (auth.currentUser && auth.currentUser.email) {
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

      const response = await UpdatePostLikes(post.id, data)
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
                color:
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText,
              }}
            >
              {user ? user.name : ''}
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
        <ImageView
          images={[{ uri: image }]}
          imageIndex={0}
          visible={imageVisible}
          onRequestClose={() => setImageVisible(false)}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}
        >
          <TouchableOpacity
            activeOpacity={0}
            disabled
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
          </TouchableOpacity>
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
                {followers ? FollowersAmount() : 0}
              </Text>{' '}
              followers
            </Text>
            <UserStatus
              mentor={user && user.mentor}
              admin={user && user.admin}
            />
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
      <TouchableOpacity
        style={{
          width: rules.componentWidthPercent,
          height: 60,
          opacity: 1,
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor:
            themeColor === 'dark' ? colors.DarkBGBlue : colors.LightBGBlue,
          borderRadius: 6,
          marginTop: 8,
        }}
        activeOpacity={0.8}
        onPress={IsFollowing() ? UnFollowFunc : FollowFunc}
      >
        <Text
          style={{
            fontSize: 18,
            color: IsFollowing()
              ? themeColor === 'dark'
                ? colors.DarkDangerText
                : colors.LightDangerText
              : themeColor === 'dark'
              ? colors.DarkTextBlue
              : colors.LightTextBlue,
          }}
        >
          {IsFollowing() ? 'Unfollow' : 'Follow'}
        </Text>
      </TouchableOpacity>
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
        backgroundColor={
          imageVisible
            ? '#000'
            : themeColor === 'dark'
            ? colors.DarkBG
            : colors.LightBG
        }
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
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: rules.componentWidthPercent,
            alignSelf: 'center',
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              navigation.goBack()
            }}
            style={{
              height: 50,
              flexDirection: 'row',
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
            <Text
              style={{
                fontSize: 20,
                color:
                  themeColor === 'dark'
                    ? colors.DarkMainText
                    : colors.LightMainText,
              }}
            >
              back
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: '100%' }}
          data={[0, 1]}
          renderItem={renderProfileScreenItem}
        />
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
                amountInARow={2}
                title="Copy"
                icon="copy"
                action={() => {
                  Clipboard.setStringAsync(postInfo.text)
                  bottomSheetModalRef.current?.dismiss()
                }}
              />

              <EditButton
                amountInARow={2}
                title="Report"
                icon="alert-octagon"
                action={() => {
                  Alert.alert('will be implemented in the next global version')
                  // navigation.navigate('NewPostScreen', { post: postInfo })
                  // bottomSheetModalRef.current?.dismiss()
                }}
              />
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
                {text.OtherUserPost}
              </Text>
            </View>
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  )
}
