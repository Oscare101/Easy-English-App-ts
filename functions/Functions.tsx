import { Dimensions, Text, View } from 'react-native'
import colors from '../constants/colors'
import { styles } from '../constants/styles'
const width = Dimensions.get('screen').width

export function GetText(text: string) {
  function ParseText(text: string) {
    const parts = text
      .split(/(#T#|#R#|#Y#|#G#|#I#|#B#|#C#|#E#)/)
      .filter((i: string) => i.trim().length > 0)

    return parts.map((part: any, index: any) => {
      if (part === '#T#' && !!parts[index + 1] && parts[index + 2] === '#T#') {
        return (
          <Text key={index} style={styles.textCourseText}>
            {parts[index + 1]}{' '}
          </Text>
        )
      }
      if (part === '#R#' && !!parts[index + 1] && parts[index + 2] === '#R#') {
        return (
          <Text key={index} style={styles.textCourseRed}>
            {parts[index + 1]}{' '}
          </Text>
        )
      }
      if (part === '#Y#' && !!parts[index + 1] && parts[index + 2] === '#Y#') {
        return (
          <Text key={index} style={styles.textCourseYellow}>
            {parts[index + 1]}{' '}
          </Text>
        )
      }
      if (part === '#G#' && !!parts[index + 1] && parts[index + 2] === '#G#') {
        return (
          <Text key={index} style={styles.textCourseGreen}>
            {parts[index + 1]}{' '}
          </Text>
        )
      }
      if (part === '#B#' && !!parts[index + 1] && parts[index + 2] === '#B#') {
        return (
          <Text key={index} style={styles.textCourseBold}>
            {parts[index + 1]}{' '}
          </Text>
        )
      }
      if (part === '#I#' && !!parts[index + 1] && parts[index + 2] === '#I#') {
        return (
          <Text key={index} style={styles.textCourseItalic}>
            {parts[index + 1]}{' '}
          </Text>
        )
      }
      if (part === '#C#' && !!parts[index + 1] && parts[index + 2] === '#C#') {
        return (
          <Text key={index} style={styles.textCourseComment}>
            {parts[index + 1]}{' '}
          </Text>
        )
      }
    })
  }

  function GetParagraphs(text: string) {
    const parts = text.split(/(#N#)/).filter((i: any) => i !== '#N#')

    return parts.map((part: any, index: any) => {
      return (
        <View key={index} style={{ marginBottom: 5, width: '100%' }}>
          <Text>{ParseText(part)}</Text>
        </View>
      )
    })
  }

  function GetBlocks(text: string) {
    const parts = text
      .split(/(#X#|#P#)/)
      .filter((i: string) => i.trim().length > 0)

    return parts.map((part: any, index: any) => {
      if (part === '#X#' && !!parts[index + 1] && parts[index + 2] === '#X#') {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'column',
              width: '98%',
              backgroundColor: colors.RealWhite,
              paddingLeft: 20,
              borderRadius: 4,
              elevation: 2,
              marginVertical: 5,
            }}
          >
            <Text
              style={{
                color: colors.Grey,
                textAlign: 'right',
                paddingRight: 20,
              }}
            >
              example
            </Text>
            {GetParagraphs(parts[index + 1])}
          </View>
        )
      } else if (
        part === '#P#' &&
        !!parts[index + 1] &&
        parts[index + 2] === '#P#'
      ) {
        return (
          <View style={{ width: width * 0.98 - 40 }} key={index}>
            {GetParagraphs(parts[index + 1])}
          </View>
        )
      }
    })
  }

  return GetBlocks(text)
}

export function GetTheme(systemTheme: any, theme: string) {
  if (theme === 'system') {
    return systemTheme
  } else {
    return theme
  }
}

export function GetThemeOpposite(systemTheme: any, theme: string) {
  if (theme === 'system') {
    return systemTheme === 'dakt' ? 'light' : 'dark'
  } else {
    return theme === 'dark' ? 'light' : 'dark'
  }
}
