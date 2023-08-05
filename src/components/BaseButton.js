import {TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';
import React from 'react';

import BaseText from './BaseText';

const BaseButton = ({
  title,
  onPress,
  children,
  disabled,
  loading,
  style,
  fontColor,
}) => {
  // props

  const isDisabled = () => disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.btnWrapper, isDisabled() && styles.disabled, style]}
      disabled={isDisabled()}>
      {loading ? (
        <ActivityIndicator color={'white'} size="small" />
      ) : children ? (
        {children}
      ) : (
        <BaseText color={'white'} size={'f16'}>
          {title}
        </BaseText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btnWrapper: {
    backgroundColor: '#aa0082',
    paddingVertical: 13,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default BaseButton;
