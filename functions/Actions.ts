import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, db, storage } from '../firebase'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { NewUser } from '../constants/dataConsts'
import {
  set,
  ref,
  getDatabase,
  get,
  onValue,
  update,
  remove,
} from 'firebase/database'
import { ref as refStorage, deleteObject } from 'firebase/storage'

// VERSION

export async function GetApplicationInfo() {
  try {
    const response = await get(ref(getDatabase(), 'info/'))
    return response.val()
  } catch (error) {
    console.log('GetApplicationInfo', error)
  }
}

// ACCOUNT

export async function Registration(email: string, password: string) {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password)
    await AsyncStorage.setItem('email', email)
    await AsyncStorage.setItem('password', password)
    await SetNewUser(email)
    return { response: response }
  } catch (error: any) {
    if (error.code.includes('email-already-in-use')) {
      return { error: 'email-already-in-use' }
    } else {
      return { error: 'error' }
    }
  }
}

export async function LogIn(email: string, password: string) {
  try {
    const response = await signInWithEmailAndPassword(auth, email, password)
    await AsyncStorage.setItem('email', email)
    await AsyncStorage.setItem('password', password)
    return { response: response }
  } catch (error: any) {
    if (error.code.includes('wrong-password')) {
      return { error: 'wrong-password' }
    } else if (error.code.includes('user-not-found')) {
      return { error: 'user-not-found' }
    } else {
      return { error: 'error' }
    }
  }
}

export async function LogOut() {
  try {
    const response = await signOut(auth)
    await AsyncStorage.setItem('email', '')
    await AsyncStorage.setItem('password', '')
    return { response: response }
  } catch (error: any) {
    return { error: 'error' }
  }
}

// USER

export async function SetNewUser(email: string) {
  try {
    await set(
      ref(getDatabase(), 'user/' + email.replace('.', ',')),
      NewUser(email)
    )
  } catch (error) {
    console.log('SetNewUser', error)
  }
}

export async function GetUser(email: string) {
  try {
    const response = await get(
      ref(getDatabase(), 'user/' + email.replace('.', ','))
    )
    return response.val()
  } catch (error) {
    console.log('GetUser', error)
  }
}

export async function UpdateUser(email: string, data: any) {
  try {
    update(ref(getDatabase(), 'user/' + email.replace('.', ',')), data)
  } catch (error) {
    console.log('UpdateUser', error)
  }
}

export async function DeleteUser(email: string) {
  try {
    await AsyncStorage.setItem('email', '')
    await AsyncStorage.setItem('password', '')
    await remove(ref(getDatabase(), 'user/' + email.replace('.', ',')))
    deleteObject(refStorage(storage, `user/${auth.currentUser?.email}`))

    auth.currentUser?.delete()
  } catch (error) {
    console.log('DeleteUser', error)
  }
}

// POSTS

export async function CreatePost(data: any) {
  try {
    await set(ref(getDatabase(), 'post/' + data.id), data)
  } catch (error) {
    console.log('CreatePost', error)
  }
}

export async function DeletePost(id: string) {
  try {
    remove(ref(getDatabase(), 'post/' + id))
  } catch (error) {
    console.log('DeletePost', error)
  }
}

// MESSAGES

export async function CreateMessage(chatID: string, data: any) {
  try {
    await set(ref(getDatabase(), 'chat/' + chatID + '/' + data.id), data)
  } catch (error) {
    console.log('CreateMessage', error)
  }
}

// PHOTO

export async function SetUserPhotoUpdate(email: string, time: string) {
  try {
    await set(
      ref(getDatabase(), 'user/' + email.replace('.', ',') + '/photo'),
      time
    )
  } catch (error) {
    console.log('SetUserPhotoUpdate', error)
  }
}

// TESTS

export async function CreateUserTestPoints(
  email: string,
  id: number,
  points: number,
  answers: any,
  title: string,
  level: number
) {
  try {
    await set(
      ref(getDatabase(), `user/${email.replace('.', ',')}/test/${id}`),
      {
        points: points,
        date: new Date().getTime(),
        id: id,
        answers: answers,
        title: title,
        level: level,
      }
    )
  } catch (error) {
    console.log('CreateUserTestPoints', error)
  }
}

export async function DeleteUserTestPoints(email: string, id: number) {
  try {
    remove(ref(getDatabase(), `user/${email.replace('.', ',')}/test/${id}`))
  } catch (error) {
    console.log('DeleteUserTestPoints', error)
  }
}

// TODO

export async function CreateTODO(email: string, data: any) {
  try {
    await set(
      ref(
        getDatabase(),
        `user/${email.replace('.', ',')}/todo/list/${data.id}`
      ),
      data
    )
  } catch (error) {
    console.log('CreateTODO', error)
  }
}

export async function ToggleTODO(email: string, data: any) {
  try {
    await update(
      ref(
        getDatabase(),
        `user/${email.replace('.', ',')}/todo/list/${data.id}`
      ),
      { done: !data.done, finished: new Date().getTime() }
    )
  } catch (error) {
    console.log('ToggleTODO', error)
  }
}

export async function DeleteTODO(email: string, id: any) {
  try {
    await remove(
      ref(getDatabase(), `user/${email.replace('.', ',')}/todo/list/${id}`)
    )
  } catch (error) {
    console.log('DeleteTODO', error)
  }
}
