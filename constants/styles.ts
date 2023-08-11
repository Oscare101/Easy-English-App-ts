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
    backgroundColor: colors.White,
  },
  ViewBetween: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
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

  // TEXTS

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
