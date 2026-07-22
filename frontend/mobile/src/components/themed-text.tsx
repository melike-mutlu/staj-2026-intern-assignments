import type { TextProps } from 'react-native';
import { Text } from 'react-native';

import { useTheme } from '../hooks/use-theme';

export function ThemedText({ style, type: _type, ...props }: TextProps & { type?: 'small' }) {
  const theme = useTheme();
  return <Text style={[{ color: theme.text }, style]} {...props} />;
}
