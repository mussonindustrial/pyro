const postcss = require('postcss')

const plugin = require('./')

async function run(input, output, options = {}) {
    const result = await postcss([plugin(options)]).process(input, {
        from: undefined,
    })
    expect(result.css).toEqual(output)
    expect(result.warnings()).toHaveLength(0)
}

it('should create single selector', async () => {
    run(
        '[psc="Folder1/class"] { color: black; }',
        '.psc-Folder1\\/class { color: black; }'
    )
})

it('should create nested folders', async () => {
    run(
        '[psc="Folder1/Folder2/class"] { color: black; }',
        '.psc-Folder1\\/Folder2\\/class { color: black; }'
    )
})

it('should accept non-default separator character', async () => {
    run(
        '[psc="Folder1-class"] { color: black; }',
        '.psc-Folder1\\/class { color: black; }',
        { separator: '-' }
    )
})

it('should support combination selectors', async () => {
    run(
        '[psc="Folder1/class1"][psc="Folder2/class2"] { color: black; }',
        '.psc-Folder1\\/class1.psc-Folder2\\/class2 { color: black; }'
    )
})

it('should support nested selectors', async () => {
    run(
        '[psc="Folder1/class1"] [psc="Folder2/class2"] { color: black; }',
        '.psc-Folder1\\/class1 .psc-Folder2\\/class2 { color: black; }'
    )
})

it('should ignore other attribute selectors', async () => {
    run(
        '[psc="Folder1/class1"][href="https://example.org"] { color: black; }',
        '.psc-Folder1\\/class1[href="https://example.org"] { color: black; }'
    )
})

it('should ignore other class selectors', async () => {
    run(
        '[psc="Folder1/class1"].otherClass1 .otherClass2 { color: black; }',
        '.psc-Folder1\\/class1.otherClass1 .otherClass2 { color: black; }'
    )
})

it('should support commas between selectors', async () => {
    run(
        '[psc="Folder1/class1"], [psc="Folder2/class2"] { color: black; }',
        '.psc-Folder1\\/class1, .psc-Folder2\\/class2 { color: black; }'
    )
})

it('should support single quote attributes', async () => {
    run(
        "[psc='Folder1/class1'], [psc='Folder2/class2'] { color: black; }",
        '.psc-Folder1\\/class1, .psc-Folder2\\/class2 { color: black; }'
    )
})

it('should warn on empty path', async () => {
    const input = '[psc=""] { color: black; }'
    const result = await postcss([plugin()]).process(input, { from: undefined })
    expect(result.warnings()).toHaveLength(1)
})

it('should warn on trailing separator', async () => {
    const input = '[psc="Folder1/Folder2/"] { color: black; }'
    const result = await postcss([plugin()]).process(input, { from: undefined })
    expect(result.warnings()).toHaveLength(1)
})

it('should provide Style Class list to callback function', async () => {
    const input =
        '[psc="Folder1/class1"][psc="Folder2/class2"].otherClass { color: black; }'

    const cb = async (styleClasses) => {
        expect(styleClasses).toEqual(['Folder1/class1', 'Folder2/class2'])
    }
    await postcss([plugin({ cb })]).process(input, { from: undefined })
})

it('should only provide unique Style Classes to callback function', async () => {
    const input =
        '[psc="Folder1/class1"][psc="Folder2/class2"].otherClass [psc="Folder2/class2"] { color: black; }'

    const cb = async (styleClasses) => {
        console.log(styleClasses)
        expect(styleClasses).toEqual(['Folder1/class1', 'Folder2/class2'])
    }
    await postcss([plugin({ cb })]).process(input, { from: undefined })
})
