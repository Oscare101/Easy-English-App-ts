import { Dimensions, StyleSheet } from 'react-native'
import colors from './colors'
import rules from './rules'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height
export const styles = StyleSheet.create({
  // VIEWS

  ViewCenter: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewBetween: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  ViewStart: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ViewAbsolute: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  ViewBackGround: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
  Circle1: {
    width: height,
    height: height,
    borderRadius: height,
    position: 'absolute',
    top: -height * 0.75,
    left: -height / 3,
    zIndex: 2,
    backgroundColor: colors.Main,
  },
  Circle2: {
    width: height * 2,
    height: height * 2,
    borderRadius: height,
    position: 'absolute',
    top: -height * 1.15,
    left: -height,
    zIndex: 1,
    backgroundColor: colors.White,
  },
  Circle3: { width: '100%', height: '100%', backgroundColor: colors.Border },
  Circle4: { width: '100%', height: '100%', backgroundColor: colors.Main },
  Circle5: {
    width: height * 2,
    height: height * 2,
    borderRadius: height,
    position: 'absolute',
    bottom: -height * 1.3,
    right: -height,
    zIndex: 1,
    backgroundColor: colors.White,
  },
  Circle6: {
    width: height,
    height: height,
    borderRadius: height,
    position: 'absolute',
    bottom: -height * 0.75,
    right: -height / 3,
    zIndex: 2,
    backgroundColor: colors.Border,
  },
  center100: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  Card: {
    width: rules.componentWidthPercent,
    padding: 16,
    borderRadius: 16,
    elevation: 1,
    marginTop: 10,
  },

  textInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: rules.componentWidthPercent,
    height: 60,
    borderColor: colors.Border,
    borderWidth: 2,
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },

  // CHAT

  messageBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 5,
  },
  messageItem: {
    maxWidth: width * 0.8,
    padding: 10,
    borderRadius: 16,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  messageAuthor: { fontSize: 14, color: colors.DarkGrey },

  // TEXTS

  textCourseText: {
    fontSize: 20,
    color: colors.Black,
  },
  textCourseRed: {
    fontSize: 20,
    color: colors.Error,
  },
  textCourseYellow: {
    fontSize: 20,
    color: colors.Yellow,
  },
  textCourseGreen: {
    fontSize: 20,
    color: colors.Green,
  },
  textCourseBold: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.Black,
  },
  textCourseItalic: {
    fontSize: 20,
    fontStyle: 'italic',
    color: colors.Black,
  },
  textCourseComment: {
    fontSize: 20,
    fontFamily: 'monospace',
    color: colors.Black,
  },

  BigTitle: {
    fontSize: 50,
    fontWeight: '700',
    letterSpacing: 2,
  },
  commentText: {
    fontSize: 12,
    color: colors.Grey,
    textAlign: 'center',
  },

  text8: {
    fontSize: 8,
  },
  text10: {
    fontSize: 10,
  },
  text12: {
    fontSize: 12,
  },
  text16: {
    fontSize: 16,
  },
  text18: {
    fontSize: 18,
  },
  text20: {
    fontSize: 20,
  },
  text30: {
    fontSize: 30,
  },
  text40: {
    fontSize: 40,
  },

  textTitle: {
    letterSpacing: 1,
    fontWeight: '700',
  },

  textBlack: {
    color: colors.Black,
  },
  textWhite: {
    color: colors.White,
  },
  ErrorText: {
    color: colors.Error,
  },
})
