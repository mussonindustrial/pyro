import { default as themeAuto } from '../output/themes/joy-auto.css'
import { default as themeDark } from '../output/themes/joy-dark.css'
import { default as themeLight } from '../output/themes/joy-light.css'

export type Theme = 'auto' | 'dark' | 'light'
export function getTheme(theme: Theme) {
    switch (theme) {
        case 'auto':
            return themeAuto
        case 'dark':
            return themeDark
        case 'light':
            return themeLight
    }
}
