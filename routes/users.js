"use strict";
//const {JSDOM} = jsdom;
// const jsdom = require('jsdom');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

var express = require('express');
var router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const { Parser } = require('json2csv');
const app = require('../app');


/* GET users listing. */
router.post('/product', function(req, res, next) {

  class getData {
    constructor() {
        this.bestBuy();
    }

    async bestBuy() {
        try {
            
            const keyWord = req.body.naessss;

            const productCount = req.body.productCountss;
            const minprices = req.body.minpricess;
            const maxprices = req.body.maxpricess;
            const Linklocation = req.body.Linklocations;
            
            const urls = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${keyWord}&_sacat=0&_ipg=${productCount}&rt=nc&_udlo=${minprices}&_udhi=${maxprices}&rt=nc&LH_PrefLoc=${Linklocation}`;

            axios.get(urls)
            .then((response) => {

                let $ = cheerio.load(response.data);

                let devtoList = [];
                $('li.s-item ').each(function(i, elem) {
                    devtoList[i] = {
                        title: $(this).find('h3.s-item__title').text(),
                        price: $(this).find('span.s-item__price').text(),
                        location: $(this).find('span.s-item__location').text(),
                        image: $(this).find('img.s-item__image-img').attr('src'),
                        link: $(this).find('a').attr('href'),
                    }      
                });

                devtoList.shift();

                res.render('product', { 
                  devtoLists: devtoList
                });

                const devtoListTrimmed = devtoList.filter(n => n != undefined )

                fs.writeFile('./data/data.json', 
                              JSON.stringify(devtoList, null, 4), 
                              (err)=> console.log('File successfully written!'))

                const fields = ['title', 'price', 'location', 'image', 'link'];

                const json2csvParser = new Parser({ fields });
                const csv = json2csvParser.parse(devtoList);

                fs.writeFileSync('./data/data.csv', csv, "utf-8")

                console.log(devtoList);
    
            })

        } catch (error) {
            console.error(error);
        }
    }

}

new getData();

});

router.get('/downloadCsv', (req, res ,next) => {
      res.download('./data/data.csv');
      res.status(200);
})

module.exports = router;