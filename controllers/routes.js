var express = require('express')
    , routes = express.Router()
    , i = 0

var tools = require('../utils/tools.js');

const url = 'https://www.instagram.com/m.jurkiewicz_m.sulecki/?hl=en'

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

routes.get('/list', async function (req, res) {
    var time = Date.now()
    await tools.getAllPostsHrefs(url)
        .then(async function (hrefs) {
            console.log('Looking for ' + hrefs.length + ' photos...')
            while (Object.keys(tools.photos).length < hrefs.length) {
                if (i <= hrefs.length) {
                    if (!Object.keys(tools.photos).includes(i)) {
                        try {
                            await tools.getPhoto(hrefs, i)
                        } catch (error) {
                            console.log('getPhoto() failed ...                                ')
                            try {
                                await sleep(1000)
                            } catch (error) {
                                console.log('sleep error')
                            }
                        }
                    }
                    i = i + 1
                } else {
                    i = 0
                }
            }
            console.log(tools.photos)
            console.log('Done in: ' + ((Date.now() - time) / 1000))
            res.send(tools.photos)
        })
});

module.exports = routes