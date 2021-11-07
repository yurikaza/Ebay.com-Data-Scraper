"use strict";
//const {JSDOM} = jsdom;
// const jsdom = require('jsdom');
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const json2csv = require('json2csv')

class getData {
    constructor() {
        this.bestBuy();
    }

    async bestBuy() {
        try {
            
            const keyWord = 'laptop';

            const productCount = '200'
            
            const urls = `https://www.ebay.com/sch/i.html?_from=R40&_nkw=${keyWord}&_sacat=0&_ipg=${productCount}`;

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

                const devtoListTrimmed = devtoList.filter(n => n != undefined )

                fs.writeFile('./data/data.json', 
                              JSON.stringify(devtoListTrimmed, null, 4), 
                              (err)=> console.log('File successfully written!'))


                console.log(devtoList);
    
            })

        } catch (error) {
            console.error(error);
        }
    }

}


new getData();