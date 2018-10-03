let request = require('request');
import { CONFIG } from './config';

export default class Feeder {
  constructor() {
    this.getHouses().then((houses) => {
      this.render(houses);
      this.hideLoader();
    }).catch((error) => {
      this.hideLoader();
      console.log('Error', error);
    });
  }

  private hideLoader() {
    document.getElementById('loader').style.display = 'none';
  }

  private getHouses() {
    return new Promise((resolve, reject) => {
      const opts = {
        url: `${CONFIG.apiUrl}/api/v1/houses`,
        json:true
      };
      request(opts, (error, response, body) => {
        if(!error && response.statusCode == 200){
          resolve(body);
        } else {
          reject(error);
        }
      });
    });
  }

  private render(houses) {
    document.getElementById('homes-wrapper').innerHTML = `
        <div class="row">
          ${houses.map((house, idx) => `
              <div class="col s12 m4">
                <div class="card">
                  <div class="card-image">
                    <img src="${house.image}">
                  </div>
                  <div class="card-content hoverable">
                    <a href="${house.link}">
                      <div class="card-title grey-text text-darken-4 truncate">${house.subtitle}</div>
                      <p class="blue-text">${house.title}</p>
                      <div class="grey-text text-darken-3 price">${house.price}</div>
                    </a>
                  </div>
                </div>
              </div>
          `).join('')}
        </div>
    `
  }

}