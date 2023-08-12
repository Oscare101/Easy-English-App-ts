import colors from './colors'

const rules: any = {
  // DESIGN
  componentWidthPercent: '92%',
  componentWidth: 0.92,
  bottomTabHeight: 70,
  maxBioLength: 200,
  maxPostLength: 500,

  colors: {
    beginner: [colors.Green, colors.Main],
    intermediate: [colors.Main, colors.Error],
    advanced: [colors.Purple, colors.Error],
  },
  levels: {
    1: 'beginner',
    2: 'intermediate',
    3: 'advanced',
  },

  // USER

  passwordMinLengh: 6,
  email: /^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]{2,6}$/,
}

export default rules
