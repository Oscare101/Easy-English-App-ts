interface Text {
  [key: string]: string
}

const text: Text = {
  'email-already-in-use': 'This email is already in use',
  'wrong-password': 'Wrong password',
  'user-not-found': 'No such user',
  error: 'Something went wrong',
  coursesComment:
    'these lessons are available for self-study, the more lessons you complete, the higher your level will be',
  ConfirmDeletingAccount:
    'By confirming the action, you agree to the permanent deletion of the account from the application database',
  DeletingPost:
    'By deleting this post, you agree that it will be permanently deleted from the application database',
}

export default text
