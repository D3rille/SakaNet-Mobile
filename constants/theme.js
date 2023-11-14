import { Dimensions } from 'react-native'
const { height, width } = Dimensions.get('window');

const COLORS = {
  green: "#2E603A",
  greenHover: '#286652',
  orange: '#FE8C47',
  pageBg: '#F6F6F6',
  black:'#2D2C2D',
  offWhite: "#F8FAF8",
  white: "#FFFFFF",
};

const SIZES = {
  xSmall: 10,
  small: 12,
  small2: 15,
  medium: 20,
  large: 24,
  xLarge: 44,
  height,
  width
};

const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5.84,
    elevation: 5,
  },
};

export { COLORS, SIZES, SHADOWS };
