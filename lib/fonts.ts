import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

// Google Fonts
export const inter = Inter({ subsets: ['latin'], variable: '--font-inter-custom' })

// Local Fonts (from public/src/assets/fonts/)
export const calfinedemo = localFont({
    src: '../public/src/assets/fonts/Calfinedemo.otf',
    variable: '--font-calfinedemo-custom',
})

export const harmondExtraBold = localFont({
    src: '../public/src/assets/fonts/Harmond-ExtraBoldExpanded.otf',
    variable: '--font-harmond-extrabold-custom',
})

export const harmondSemiBoldItalic = localFont({
    src: '../public/src/assets/fonts/Harmond-SemBdItaCond.otf',
    variable: '--font-harmond-semibold-italic-custom',
})

export const mamenchisa = localFont({
    src: '../public/src/assets/fonts/Mamenchisa.otf',
    variable: '--font-mamenchisa-custom',
})

export const milkyWalky = localFont({
    src: '../public/src/assets/fonts/MilkyWalky-Regular.otf',
    variable: '--font-milkywalky-custom',
})

export const eagle = localFont({
    src: '../public/src/assets/fonts/EagleHorizonP.ttf',
    variable: '--font-eagle-custom',
})

export const FONTS = {
    inter,
    localFonts: {
        calfinedemo,
        harmondExtraBold,
        harmondSemiBoldItalic,
        mamenchisa,
        milkyWalky,
        eagle,
    }
} as const;

export type LocalFontName = keyof typeof FONTS.localFonts;
