import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    dark: {
      900: '#000000',
      800: '#121212',
      700: '#1A1A1A',
      600: '#2D2D2D',
      500: '#3D3D3D',
      400: '#4D4D4D',
      300: '#606060',
      200: '#757575',
      100: '#A3A3A3',
      50: '#C1C1C1',
    },
    neon: {
      gold: '#FFD700',
      blue: '#00FFFF',
      purple: '#8A2BE2',
      white: '#EAEAEA',
    },
    gold: {
      50: '#FFF9E6',
      100: '#FFEDB3',
      200: '#FFE180',
      300: '#FFD54D',
      400: '#FFC91A',
      500: '#E6B000',
      600: '#B38600',
      700: '#805D00',
      800: '#4D3700',
      900: '#1A1100',
    },
    customRed: {
      500: '#F06292',
      600: '#EC407A',
    },
    customBlue: {
      500: '#4D9FFF',
      600: '#3385FF',
    },
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: 'dark.900',
        color: 'neon.white',
      },
      '::-webkit-scrollbar': {
        width: '10px',
      },
      '::-webkit-scrollbar-track': {
        bg: 'dark.800',
      },
      '::-webkit-scrollbar-thumb': {
        bg: 'dark.600',
        borderRadius: '5px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        bg: 'dark.500',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
      },
      variants: {
        solid: {
          bg: 'gold.400',
          color: 'gray.800',
          _hover: {
            bg: 'gold.500',
            _disabled: {
              bg: 'gold.300',
            },
          },
          _active: {
            bg: 'gold.600',
          },
          _disabled: {
            bg: 'gold.300',
            opacity: 0.6,
          },
        },
        outline: {
          borderColor: 'gold.400',
          color: 'gold.400',
          _hover: {
            bg: 'whiteAlpha.100',
          },
          _active: {
            bg: 'whiteAlpha.200',
          },
        },
        ghost: {
          color: 'whiteAlpha.900',
          _hover: {
            bg: 'whiteAlpha.100',
          },
          _active: {
            bg: 'whiteAlpha.200',
          },
        },
        neon: {
          bg: 'transparent',
          border: '2px solid',
          borderColor: 'neon.blue',
          color: 'neon.blue',
          textShadow: '0 0 10px #00FFFF',
          boxShadow: '0 0 10px #00FFFF',
          _hover: {
            bg: 'rgba(0, 255, 255, 0.1)',
            boxShadow: '0 0 20px #00FFFF',
          },
          _active: {
            bg: 'rgba(0, 255, 255, 0.2)',
          },
        },
        neonGold: {
          bg: 'transparent',
          border: '2px solid',
          borderColor: 'neon.gold',
          color: 'neon.gold',
          textShadow: '0 0 10px #FFD700',
          boxShadow: '0 0 10px #FFD700',
          _hover: {
            bg: 'rgba(255, 215, 0, 0.1)',
            boxShadow: '0 0 20px #FFD700',
          },
          _active: {
            bg: 'rgba(255, 215, 0, 0.2)',
          },
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'dark.800',
            _hover: {
              bg: 'dark.700',
            },
            _focus: {
              bg: 'dark.700',
              borderColor: 'gold.400',
            },
          },
        },
        outline: {
          field: {
            borderColor: 'whiteAlpha.300',
            _hover: {
              borderColor: 'whiteAlpha.400',
            },
            _focus: {
              borderColor: 'gold.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-gold-400)',
            },
          },
        },
      },
    },
    Select: {
      variants: {
        filled: {
          field: {
            bg: 'dark.800',
            _hover: {
              bg: 'dark.700',
            },
            _focus: {
              bg: 'dark.700',
              borderColor: 'gold.400',
            },
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        color: 'whiteAlpha.900',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'dark.800',
          borderColor: 'whiteAlpha.200',
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'dark.800',
          borderColor: 'whiteAlpha.200',
        },
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: 'dark.800',
          borderColor: 'whiteAlpha.200',
        },
      },
    },
    Tooltip: {
      baseStyle: {
        bg: 'dark.700',
        color: 'whiteAlpha.900',
      },
    },
  },
});

export default theme;