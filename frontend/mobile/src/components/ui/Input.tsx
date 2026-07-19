import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants/tokens';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error ? styles.inputError : null,
          style
        ]}
        placeholderTextColor={colors.shade[40]}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: spacing[16],
  },
  label: {
    ...typography.body[14],
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: spacing[4],
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderRadius: radius[8],
    paddingHorizontal: spacing[12],
    backgroundColor: colors.brand.white,
    ...typography.body[16],
    color: colors.text.primary,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    ...typography.body[12],
    color: 'red',
    marginTop: spacing[4],
  },
});
