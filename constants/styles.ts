import { Dimensions, StyleSheet } from 'react-native'
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
  },
  Circle2: {
    width: height * 2,
    height: height * 2,
    borderRadius: height,
    position: 'absolute',
    top: -height * 1.15,
    left: -height,
    zIndex: 1,
  },
  Circle3: { width: '100%', height: '100%' },
  Circle4: { width: '100%', height: '100%' },
  Circle5: {
    width: height * 2,
    height: height * 2,
    borderRadius: height,
    position: 'absolute',
    bottom: -height * 1.3,
    right: -height,
    zIndex: 1,
  },
  Circle6: {
    width: height,
    height: height,
    borderRadius: height,
    position: 'absolute',
    bottom: -height * 0.75,
    right: -height / 3,
    zIndex: 2,
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

  // TEXTS

  BigTitle: {
    fontSize: 50,
    fontWeight: '700',
    letterSpacing: 2,
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
})
