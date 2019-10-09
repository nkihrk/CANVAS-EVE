/**
 *
 * hogehoge
 *
 * Dependencies
 * - jQuery 3.4.1
 *
 */

// import $ from 'jquery';

function hoge() {}

Object.assign(hoge.prototype, {
  /**
   * Do hogehoge
   *
   * @param {string} hogehoge - hogehoge
   */
  hogehoge(hogehoge) {
    const msg = `${hogehoge}`;
    console.log(`It's ${msg}`);
  }
});

export default hoge;
