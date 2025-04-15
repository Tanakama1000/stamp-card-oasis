
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        coffee: {
          dark: '#5271ff',
          medium: '#5271ff',
          light: '#5271ff',
        },
        cream: {
          DEFAULT: '#F5F5DC',
          light: '#FFFDD0',
        },
        orange: {
          DEFAULT: '#D2691E',
          light: '#FF8C00',
        },
        brand: {
          purple: '#9b87f5',
          lavender: '#7E69AB',
          magenta: '#D946EF',
          pink: '#FF719A',
        },
        ocean: {
          DEFAULT: '#0EA5E9',
          light: '#7DD3FC',
          dark: '#0369A1',
        },
        forest: {
          DEFAULT: '#22C55E',
          light: '#86EFAC',
          dark: '#166534',
        },
        sunset: {
          orange: '#F97316',
          red: '#EF4444',
          yellow: '#FBBF24',
        },
        neutral: {
          gray: '#8E9196',
          slate: '#64748B',
          stone: '#78716C',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        jewel: {
          emerald: '#50C878',
          sapphire: '#0F52BA',
          ruby: '#E0115F',
          amethyst: '#9966CC',
          topaz: '#FFC87C',
        },
        earth: {
          moss: '#8A9A5B',
          clay: '#B76F56',
          sand: '#F4A460',
          stone: '#8B7355',
          terracotta: '#E2725B',
        },
        pastel: {
          mint: '#98FB98',
          lavender: '#E6E6FA',
          peach: '#FFDAB9',
          sky: '#87CEEB',
          rose: '#FFB6C1',
        },
        neon: {
          pink: '#FF6EC7',
          blue: '#00FFFF',
          green: '#39FF14',
          orange: '#FF9E00',
          yellow: '#FFFF00',
        },
        vibrant: {
          red: '#FF0000',
          blue: '#0000FF',
          green: '#00FF00',
          purple: '#8000FF',
          yellow: '#FFFF00',
        },
        matte: {
          black: '#28282B',
          gray: '#808080',
          white: '#F5F5F5',
          beige: '#F5F5DC',
          brown: '#964B00',
        },
        metallic: {
          gold: '#FFD700',
          silver: '#C0C0C0',
          bronze: '#CD7F32',
          copper: '#B87333',
          steel: '#71797E',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
