const cheerio = require('cheerio')
    , puppeteer = require('puppeteer')



module.exports = {
    getAllPostsHrefs: async function (url) {
        const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
            , page = await browser.newPage()
        var hrefs = []
        await page.goto(url)
        await page.setViewport({
            width: 1365,
            height: 945
        })
        let html = await page.content()
        var $ = cheerio.load(html)
        const number = Number($('a[class="-nal3 "]').find($('span[class="g47SY "]')).slice(0, 1).text());
        console.log('Scrolling to get ' + number + ' posts...')
        process.stdout.write('Fetched: ' + hrefs.length + ' photos of ' + number + ' \033[0G')
        while (hrefs.length < number) {
            let current = await page.content()
            $ = cheerio.load(current)
            let allOnPage = $('a > .eLAPa').toArray()
            await allOnPage.forEach(function (element) {
                if (!hrefs.includes(element.parent.attribs.href)) {
                    hrefs.push(element.parent.attribs.href)
                }
            });
            scroll(page)
            process.stdout.write('Fetched: ' + hrefs.length + ' posts of ' + number + ' \033[0G')
        }
        return hrefs;
    },
    photos: {},
    getPhoto: async function (hrefs, i) {
        const prefix = 'https://www.instagram.com'
            , browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
        require('events').EventEmitter.defaultMaxListeners = hrefs.length * 2
        try {
            const page = await browser.newPage()
            await page.setViewport({
                width: 1365,
                height: 945
            })
            try {
                await page.goto(prefix + hrefs[i])
            } catch (error) {
                console.log('page.goto')
            }
            let html = await page.content()
            var $ = await cheerio.load(html)
            page.close()
            let photo = $('img[class="FFVAD"]')[0].attribs.src
            if (!Object.values(module.exports.photos).includes(photo)) {
                module.exports.photos[i] = photo
            }
            process.stdout.write('Fetched: ' + Object.keys(module.exports.photos).length + ' photos of ' + hrefs.length + ' \033[0G')
            // if (Object.keys(module.exports.photos).length == hrefs.length || i == hrefs.length) {
            //     process.stdout.write('Fetched: ' + Object.keys(module.exports.photos).length + ' photos of ' + hrefs.length + ' \033[0G')
            //     console.log('')
            // }
        } catch (error) {
            console.log('error idk')
        }

        // await hrefs.forEach(async function (element) {
        //     try {
        //         const page = await browser.newPage()
        //         await page.setViewport({
        //             width: 1365,
        //             height: 945
        //         })
        //         await page.goto(prefix + element)
        //         let html = await page.content()
        //         var $ = await cheerio.load(html)
        //         page.close()
        //         let photo = $('img[class="FFVAD"]')[0].attribs.src
        //         await module.exports.photos.push(photo)
        //         process.stdout.write('Fetched: ' + module.exports.photos.length + ' photos of ' + hrefs.length + ' \033[0G')
        //         if (module.exports.photos.length == hrefs.length) {
        //             process.stdout.write('Fetched: ' + module.exports.photos.length + ' photos of ' + hrefs.length + ' \033[0G')
        //             console.log('')
        //         }
        //     } catch (error) {
        //         console.log('error idk')
        //     }
        // })
    }
}

async function scroll(page) {
    try {
        await page.evaluate(async () => {
            await new Promise((resolve, reject) => {
                var distance = 1500;
                window.scrollBy(0, distance);
                resolve();
            });
        });
    } catch (error) {
        console.log('evaluate')
    }
}