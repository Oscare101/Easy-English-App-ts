import { Text, View } from 'react-native'
import { styles } from '../../../constants/styles'
import MainButton from '../../../components/MainButton'
import { getDatabase, onValue, ref } from 'firebase/database'
import { User } from '../../../constants/interfaces'
import { auth } from '../../../firebase'
import { useEffect, useState } from 'react'

export default function ChatsScreen({ navigation }: any) {
  const [user, setUser] = useState<User>({} as User)

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
    GetUserFunc()
  }, [])

  return (
    <View style={styles.ViewStart}>
      <Text>Chats</Text>
      <MainButton
        title="Global chat"
        disable={false}
        action={() => {
          navigation.navigate('GlobalChatScreen', { chatID: '001', user: user })
        }}
      />
    </View>
  )
}
