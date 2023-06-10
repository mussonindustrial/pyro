// options is { separator, cb }
export default (options = {}) => {
    const { separator, cb } = Object.assign(
        {},
        {
            separator: '/',
            cb: undefined,
        },
        options
    )

    let styleClasses: string[] = []

    return {
        postcssPlugin: 'postcss-perspective-style-class',

        Rule(rule, { result }) {
            if (!rule.selector.includes('[psc=')) {
                return
            }

            // Match entire attributes.
            const newSelector = rule.selector.replace(
                /(?=\[psc=).*?]/gm,
                (match: string) => {
                    // Determine attribute contents, and replace entire attribute.
                    /* eslint-disable-next-line */
                    const classPath = match.match(/(?<=\[psc=)(.*?)(?=])/gm)[0]

                    if (!classPath) {
                        rule.warn(result, 'empty Style Class path')
                        return
                    }
                    if (classPath.slice(-separator.length) === separator) {
                        rule.warn(result, 'trailing separator found')
                        return
                    }

                    styleClasses.push(classPath)

                    return `.psc-${classPath.replaceAll(separator, '\\/')}`
                }
            )

            const replacement = rule.clone({})
            replacement.selector = newSelector
            rule.replaceWith(replacement)
        },

        OnceExit() {
            styleClasses = Array.from(new Set(styleClasses))
            if (cb) cb(styleClasses)
        },
    }
}
