import type { ViewProps } from 'react-native';
import { View } from 'react-native';

import { useTheme } from '../hooks/use-theme';

export function ThemedView({
  style,
  type = 'background',
  ...props
}: ViewProps & { type?: 'background' | 'backgroundElement' }) {
  const theme = useTheme();
  return <View style={[{ backgroundColor: theme[type] }, style]} {...props} />;
}
