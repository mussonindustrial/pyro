import type * as CSS from 'csstype'

import { newFolderResource } from '../../resources'

export const styleClass = newFolderResource<StyleClassFiles>('style-classes', {
    scope: 'G',
    version: 2,
})

type StyleClassFiles = {
    'style.json': StyleClass
}

export type StyleClass = {
    base: AnimatableStyle
    variants?: Variant[]
}

type AnimatableStyle =
    | {
          style: Style
      }
    | {
          animation: {
              keyframes: {
                  [key: string]: Style
              }
          }
      }

type PseudoClass = AnimatableStyle & {
    pseudo: PseudoName
}
type MediaQuery = AnimatableStyle & {
    feature: MediaFeature
    value: string
}
type Variant = PseudoClass | MediaQuery

type Style = Pick<CSS.Properties, PSCProperty>

type PSCProperty =
    | 'backgroundColor'
    | 'backgroundPosition'
    | 'borderColor'
    | 'borderStyle'
    | 'borderWidth'
    | 'borderTopLeftRadius'
    | 'borderTopRightRadius'
    | 'borderBottomLeftRadius'
    | 'borderBottomRightRadius'
    | 'boxShadow'
    | 'color'
    | 'fontSize'
    | 'fontWeight'
    | 'letterSpacing'
    | 'lineHeight'
    | 'marginBottom'
    | 'marginLeft'
    | 'marginRight'
    | 'marginTop'
    | 'opacity'
    | 'outlineColor'
    | 'outlineStyle'
    | 'outlineWidth'
    | 'overflow'
    | 'overflowWrap'
    | 'overflowX'
    | 'overflowY'
    | 'paddingBottom'
    | 'paddingLeft'
    | 'paddingRight'
    | 'paddingTop'
    | 'textIndent'
    | 'textShadow'
    | 'wordSpacing'
    | 'stroke'
    | 'strokeWidth'
    | 'fill'

type PseudoName =
    | 'active'
    | 'checked'
    | 'default'
    | 'disabled'
    | 'empty'
    | 'enabled'
    | 'first-child'
    | 'fullscreen'
    | 'focus'
    | 'hover'
    | 'in-range'
    | 'invalid'
    | 'last-child'
    | 'link'
    | 'only-child'
    | 'out-of-range'
    | 'read-only'
    | 'read-write'
    | 'required'
    | 'valid'
    | 'visited'

type MediaFeature =
    | 'minWidth'
    | 'maxWidth'
    | 'orientation'
    | 'minAspectRatio'
    | 'maxAspectRatio'
    | 'hover'
