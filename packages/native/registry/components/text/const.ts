import type { TextTheme } from './types'

const DEFAULT_THEME: TextTheme = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    muted: '#8E8E93',
    white: '#FFFFFF',
    black: '#000000',
  },
  headingSizes: {
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
  },
  fontWeights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  // FusionUI's default typeface is Poppins. React Native resolves each weight to a
  // weight-specific family (this is how `@expo-google-fonts/poppins` names its
  // exports), so load the matching faces in your app — e.g. Poppins_400Regular,
  // Poppins_700Bold. Italic appends `_Italic` (Poppins_700Bold_Italic). If the
  // faces aren't loaded the component falls back to the system font at the right
  // weight, so it degrades gracefully.
  fontFamilies: {
    thin: 'Poppins_100Thin',
    extralight: 'Poppins_200ExtraLight',
    light: 'Poppins_300Light',
    normal: 'Poppins_400Regular',
    medium: 'Poppins_500Medium',
    semibold: 'Poppins_600SemiBold',
    bold: 'Poppins_700Bold',
    extrabold: 'Poppins_800ExtraBold',
    black: 'Poppins_900Black',
  },
  defaultColor: '#FFFFFF',
  defaultSize: 18,
  defaultWeight: 'bold',
}

export { DEFAULT_THEME }
