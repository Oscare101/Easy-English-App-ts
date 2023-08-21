export function NewUser(email: string) {
  return {
    name: '',
    surname: '',
    email: email,
    birthDate: '',
    level: 0,
    mentor: false,
    admin: false,
    lastOnline: '',
    onLine: false,
    photo: '',
    description: '',
    phone: '',
  }
}
