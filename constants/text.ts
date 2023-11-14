interface Text {
  [key: string]: string
}

const text: Text = {
  'email-already-in-use': 'This email is already in use',
  'wrong-password': 'Wrong password',
  'user-not-found': 'No such user',
  error: 'Something went wrong',
  coursesComment:
    'These lessons are available for self-study, you can go through them in your free time and do not forget about practice:)',
  testsComment:
    'This is a practical component of training, the more tests you complete, the higher your level will be',
  ConfirmDeletingAccount:
    'By confirming the action, you agree to the permanent deletion of the account from the application database',
  DeletingPost:
    'By deleting this post, you agree that it will be permanently deleted from the application database',
  SecurityRulesText:
    'These settings will affect the security of your account. Choose a format convenient for you',
  ThemeRulesText: 'Сolor theme is how the application will look',
  ImageText:
    'You can change your profile picture at any time. All other users will be able to see it',
  ForceUpdateText:
    'The app has become better and your version is no longer supported, please update the app',
  ForceUpdateWhere:
    'Tap on the plane to download the updated app from telegram',
  TechnicalPause:
    'Hello, the server is undergoing technical work, please wait. The application will launch automatically as soon as everything is configured. If you think that the technical break is too long, you can write to me in Telegram',
  OtherUserPost:
    'This post was posted by another user, if you find it offensive, you can report it',
  AboutApplication:
    "This application was developed as part of a master's thesis by a 5th-year student of KPI.\n\nThe main goal of this application is to facilitate and popularize self-study and practice of the English language\n\nif you find any inaccuracy in the application, or you want to offer me your idea, you can write to me in Telegram\n\nThere is also a Telegram channel in which I publish all updates regarding the application",
  BePoliteInChat:
    'be respectful in the chat, and never send personal information to other chat members',
  MailForPasswordReset:
    'You will receive an email with all the instructions for changing your password. So go to your mail app and follow the steps',
  EmptyStatisticText:
    "Come back when you've completed at least one test. Here will beyour statistic from practical tasks",
  DeletedUserPost:
    "This is a post by a deleted user, you can't do anything with it except copy",
  PersonalChatsTitle: 'Here are your personal chats with other users',
  BirthDateInput:
    'This information will be displayed on the certificate, none of the users will see it',
}

export default text
