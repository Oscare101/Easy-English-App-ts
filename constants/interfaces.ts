export interface userInterest {
  title: string
}

export interface userPost {
  title: string
  text: string
  time: string
  likes: any
  comments: any
}

export interface User {
  name: string
  surname: string
  email: string
  birthDate: string
  level: number
  followers: any[]
  mentor: boolean
  admin: boolean
  lastOnline?: string
  onLine?: boolean
  photo?: any
  description?: string
  interests?: userInterest[]
  courses?: any
  posts?: userPost[]
  phone?: string
  test?: any
  // chats?:userChats[]
}
