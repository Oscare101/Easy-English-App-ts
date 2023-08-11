import { Text, View } from 'react-native'
import { styles } from '../../constants/styles'
import MainButton from '../../components/MainButton'
import { LogOut } from '../../functions/Actions'
import { useEffect, useState } from 'react'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'
import { auth, db } from '../../firebase'
import { getDatabase, onValue, ref, remove, update } from 'firebase/database'
import { User } from '../../constants/interfaces'

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<User>({} as User)
  async function LogOutFunc() {
    const response = await LogOut()
    if (!response.error) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'LaunchScreen' }],
      })
    } else {
    }
  }

  // update(
  //   ref(getDatabase(), 'user/' + auth.currentUser.email.replace('.', ',')),
  //   {
  //     name: 'name',
  //   }
  // )

  // remove(
  //   ref(getDatabase(), 'posts/' + auth.currentUser.email.replace('.', ','))
  // )

  function GetUserFunc() {
    if (auth.currentUser && auth.currentUser.email) {
      const dataChat = ref(
        getDatabase(),
        `user/` + auth.currentUser.email.replace('.', ',')
      )
      onValue(dataChat, (snapshot) => {
        setUser(snapshot.val() as User)
      })
    }
  }

  useEffect(() => {
    GetUserFunc()
  }, [])

  return (
    <View style={styles.ViewCenter}>
      <Text style={[styles.text40, styles.textBlack]}>Profile {user.name}</Text>
      <MainButton
        title="LogOut"
        disable={false}
        action={() => {
          LogOutFunc()
        }}
      />
    </View>
  )
}
