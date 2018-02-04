import * as cheerio from 'cheerio';
import * as request from 'request';
import * as fs from 'fs';

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
    return new Promise((resolve, reject) => {
      request(`${AIRBNB_URL}/s/homes`, (error, response, body) => {
        if(!error && response.statusCode == 200){
          const $ = cheerio.load(body);
          $('._1mpo9ida', '._fhph4u').each((i, element) => {
            const piece = $('a._15ns6vh > div',element);
            this.houses.push({
              link: `${AIRBNB_URL}${$('div._1szwzht a',element).prop('href')}`,
              image: $('div._1fdzqn44',element).prop('style')['background-image'].replace('url(','').replace(')',''),
              title: piece.eq(0).find('div div span').text().replace(' ·  · ',''),
              subtitle: piece.eq(1).find('._1qp0hqb').text(),
              price: piece.eq(2).find('div._1yarz4r').html(),
              price: `${piece.eq(2).find('div._1yarz4r span div._36rlri > span._hylizj6').text()} ${piece.eq(2).find('div._1yarz4r > span > span').eq(0).children().eq(1).children().eq(0).children().eq(1).text()} ${piece.eq(2).find('div._1yarz4r > span').children().eq(1).text().toLowerCase()}`
            });
          });
          fs.writeFile('./dist/server/houses.json', JSON.stringify(this.houses));
          resolve(this.houses);
        } else {
          let rawHouses = fs.readFileSync('./dist/server/houses.json');
          resolve(JSON.parse(rawHouses));
        }
      });
    });
  }

}