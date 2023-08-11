import { View } from 'react-native'
import { styles } from '../constants/styles'

export default function BGCircles(props: any) {
  return (
    <View style={styles.ViewBackGround}>
      {props.type === 1 ? (
        <>
          <View style={styles.Circle1} />
          <View style={styles.Circle2} />
          <View style={styles.Circle3} />
        </>
      ) : (
        <>
          <View style={styles.Circle4} />
          <View style={styles.Circle5} />
          <View style={styles.Circle6} />
        </>
      )}
    </View>
  )
}
