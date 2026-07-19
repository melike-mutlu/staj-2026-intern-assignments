import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/tokens';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  title: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth,
  loading,
  title,
  style,
  disabled,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';

  const getBackgroundColor = () => {
    if (disabled && isPrimary) return colors.shade[30];
    if (isPrimary) return colors.brand.black;
    if (isSecondary) return colors.brand.white;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled && isPrimary) return colors.shade[60];
    if (isPrimary) return colors.brand.white;
    if (isSecondary) return colors.brand.black;
    return colors.text.primary;
  };

  const getHeight = () => {
    if (size === 'sm') return 32;
    if (size === 'lg') return 48;
    return 40;
  };

  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: isSecondary ? colors.border.light : 'transparent',
          borderWidth: isSecondary ? 1 : 0,
          height: getHeight(),
          width: fullWidth ? '100%' : 'auto',
          opacity: disabled ? 0.6 : 1,
        },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor(), fontSize: size === 'sm' ? 14 : 16 }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: radius[8],
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[16],
    flexDirection: 'row',
  },
  text: {
    ...typography.body[16],
    fontWeight: '500',
  },
});
