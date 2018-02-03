
export default class Feeder {

  constructor() {
    console.log('Feed');
  }

  private hideLoader() {
    document.getElementById('loader').style.display = 'none';
  }

}