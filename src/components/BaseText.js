import React from 'react';
import {Text} from 'react-native';

const mapFonts = {
  f7: [7, 10],
  f9: [9, 15],
  f10: [10, 15],
  f11: [11, 15],
  f12: [12, 15],
  f14: [14, 20],
  f16: [16, 25],
  f18: [18, 28],
  f20: [20, 30],
  f21: [21, 31],
  f24: [24, 34],
  f26: [26, 36],
  f27: [27, 37],
  f30: [30, 40],
};

const BaseText = ({size, color = 'black', style, children, numberOfLines}) => {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          fontSize: size ? mapFonts[size][0] : 14,
          lineHeight: size ? mapFonts[size][1] : 20,
          color,
        },
        {...style},
      ]}>
      {children}
    </Text>
  );
};

export default BaseText;
