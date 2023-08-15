import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithCredential,
} from 'firebase/auth'
import { auth, db } from '../firebase'
import { collection, getDocs, doc, setDoc } from 'firebase/firestore/lite'

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
import { firebase } from '@react-native-firebase/database'
import database from '@react-native-firebase/database'

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
    remove(ref(getDatabase(), 'user/' + email.replace('.', ',')))
    auth.currentUser?.delete()
  } catch (error) {
    console.log('DeleteUser', error)
  }
}

// POSTS

export async function CreatePost(email: string, data: any) {
  try {
    await set(ref(getDatabase(), 'post/' + data.key), data)
  } catch (error) {
    console.log('SetNewUser', error)
  }
}

export async function DeletePost(key: string) {
  try {
    remove(ref(getDatabase(), 'post/' + key))
  } catch (error) {
    console.log('DeleteUser', error)
  }
}

// MESSAGES

export async function CreateMessage(chatID: string, data: any) {
  try {
    await set(ref(getDatabase(), 'chat/' + chatID + '/' + data.key), data)
  } catch (error) {
    console.log('SetNewUser', error)
  }
}
