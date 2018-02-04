import * as request from 'request';
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
      }
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
                  <div class="card-content">
                    <span class="card-title grey-text text-darken-4">${house.title}</span>
                    <p>${house.subtitle}</p>
                    <div>${house.price}</div>
                    <p><a href="${house.link}">Ir a Airbnb...</a></p>
                  </div>
                </div>
              </div>
          `).join('')}
        </div>
    `
  }

}