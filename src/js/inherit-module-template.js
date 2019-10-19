/**
 *
 * hogehoge for CANVAS EVE
 *
 * Dependencies
 * - none
 *
 */

function Hoge() {}

Object.assign(Hoge.prototype, {
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

export default Hoge;
