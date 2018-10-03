import * as fs from 'fs';
const phantom = require('phantom');

interface IHouse {
  image: string;
  link: string;
  title: string;
  subtitle: string;
  price: string;
}

const AIRBNB_URL = 'https://www.airbnb.es';

export default class Scraper {

  private houses: IHouse[];
  constructor() {
    this.houses = [];
  }

  public getHouses(): Promise<any> {
    return (async () => {
        const instance = await phantom.create();
        const page = await instance.createPage();
        const status = await page.open(`${AIRBNB_URL}/s/plus_homes`);

        this.houses = await page.evaluate((airbnbUrl) => {
            let houses = [];
            const elements = Array.prototype.slice.call(document.querySelectorAll('._fhph4u > div._1jqsr8vu'));
            elements.forEach((element) => {
                houses.push({
                    link: `${airbnbUrl}${element.querySelector('div._1szwzht a').getAttribute('href')}`,
                    image: element.querySelector('div._1df8dftk').style.backgroundImage.replace('url(','').replace(')',''),
                    title: element.querySelector('._jnrahhr').innerHTML,
                    subtitle: '',
                    price: element.querySelector('div._ncmdki > div._1yarz4r').innerText.replace('Precio', '')
                });
            });
            return houses;
        }, AIRBNB_URL);

        fs.writeFile('./dist/server/houses.json', JSON.stringify(this.houses), (err) => {
            if (err) throw err;
            console.log('Houses saved!');
        });
        return this.houses;
    })();
  }

}