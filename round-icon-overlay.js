#!/usr/bin/env node

const commander = require('commander')
const mustache = require('mustache')
const sharp = require('sharp')

const path = require('path')
const fs = require('fs')
const { promisify } = require('util')
const fsPromise = {
    readFile: promisify(fs.readFile),
    writeFile: promisify(fs.writeFile)
}

commander.version('1.1.0(20200417)').description('Android round launcher icon overlay image genarator')
    .option('-b, --build <BUILD_TYPE>', 'build-type')
    .option('-f, --flavor <PRODUCT_FLAVOR>', 'product-flavor')
    .option('-o, --output <FILE>', 'output file (default: stdout)')
    .option('-s, --size <SIZE>', 'size (px)', 512)
    .option('-F, --font <FONT>', 'font-family', 'sans-serif')
    .option('-S, --font-size <SIZE>', 'font-size (px)', 64)
    .option('-W, --font-weight <WEIGHT>', 'font-weight', 'normal')
    .option('--fg-color <COLOR>', 'text color', '#000')
    .option('--bg-color <COLOR>', 'background color', '#FFF')
    .option('--fg-opacity <OPACITY>', 'text opacity', 1)
    .option('--bg-opacity <OPACITY>', 'background opacity', 0.4)
    .option('--flavor-fg-color <COLOR>', 'product-flavor text color')
    .option('--flavor-fg-opacity <OPACITY>', 'product-flavor text opacity')
    .option('--flavor-bg-color <COLOR>', 'product-flavor background color')
    .option('--flavor-bg-opacity <OPACITY>', 'product-flavor background opacity')
    .option('--flavor-font <FONT>', 'product-flavor font-family')
    .option('--flavor-font-size <SIZE>', 'product-flavor font-size (px)')
    .option('--flavor-font-scale <SCALE>', 'product-flavor font scale', 1)
    .option('--flavor-font-weight <WEIGHT>', 'product-flavor font weight')
    .option('--flavor-text-offset <OFFSET>', 'product-flavor text position offset', 0)
    .option('--build-fg-color <COLOR>', 'build-type text color')
    .option('--build-fg-opacity <OPACITY>', 'build-type text opacity')
    .option('--build-bg-color <COLOR>', 'build-type background color')
    .option('--build-bg-opacity <OPACITY>', 'build-type background opacity')
    .option('--build-font <FONT>', 'build-type font-family')
    .option('--build-font-size <SIZE>', 'build-type font-size (px)')
    .option('--build-font-scale <SCALE>', 'build-type font scale', 1)
    .option('--build-font-weight <WEIGHT>', 'build-type font weight')
    .option('--build-text-offset <OFFSET>', 'build-type text position offset', 0)
    .parse(process.argv)

async function main(cli) {
    const template = await fsPromise.readFile(path.resolve(__dirname, './round-icon-overlay-template.svg'), {
        encoding: 'UTF-8'
    })

    const renderedSvg = mustache.render(template, {
        size: cli.size,
        flavor: {
            display: cli.flavor ? 'default' : 'none',
            text: cli.flavor,
            fgColor: cli.flavorFgColor || cli.fgColor,
            fgOpacity: cli.flavorFgOpacity || cli.fgOpacity,
            bgColor: cli.flavorBgColor || cli.bgColor,
            bgOpacity: cli.flavorBgOpacity || cli.bgOpacity,
            fontFamily: cli.flavorFont || cli.font,
            fontSize: (cli.flavorFontSize || cli.fontSize) * parseFloat(cli.flavorFontScale),
            fontWeight: (cli.flavorFontWeight || cli.fontWeight),
            y: 195.50923 + parseFloat(cli.flavorTextOffset)
        },
        build: {
            display: cli.build ? 'default' : 'none',
            text: cli.build,
            fgColor: cli.buildFgColor || cli.fgColor,
            fgOpacity: cli.buildFgOpacity || cli.fgOpacity,
            bgColor: cli.buildBgColor || cli.bgColor,
            bgOpacity: cli.buildBgOpacity || cli.bgOpacity,
            fontFamily: cli.buildFont || cli.font,
            fontSize: (cli.buildFontSize || cli.fontSize) * parseFloat(cli.buildFontScale),
            fontWeight: (cli.buildFontWeight || cli.fontWeight),
            y: 512.91174 + parseFloat(cli.buildTextOffset)
        }
    })

    if (!cli.output) {
        process.stdout.write(renderedSvg)
    } else if (cli.output && /.+\.svg$/i.test(cli.output)) {
        await fsPromise.writeFile(cli.output, renderedSvg)
    } else {
        const finalOutput = /.+\.png$/i.test(cli.output) ? cli.output : `${cli.output}.png`
        await sharp(Buffer.from(renderedSvg)).toFile(finalOutput)
    }
}

main(commander)
