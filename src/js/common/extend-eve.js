/**
 * Vanilla JS jQuery.parents() realisation.
 * https://gist.github.com/ziggi/2f15832b57398649ee9b
 *
 * @param {string} selector - The name of a selector
 * @returns {elements} Return the elements
 */
// Element.prototype.parentsTest = selector => {
//   const elements = [];
//   let elem = this;
//   const ishaveselector = selector !== undefined;

//   while (elem !== null) {
//     if (elem.nodeType !== Node.ELEMENT_NODE) {
//       // eslint-disable-next-line no-continue
//       continue;
//     }

//     if (!ishaveselector || elem.matches(selector)) {
//       elements.push(elem);
//     }
//     elem = elem.parentElement;
//   }

//   return elements;
// };

// /**
//  * Vanilla JS jQuery.removeClass() realisation.
//  * https://www.jamesbaum.co.uk/blether/vanilla-js-equivalent-jquery-find-parent-data-remove-class-empty-append/#parent
//  *
//  * @param {string} selector - The name of a selector
//  */
// Element.prototype.hasClassTest = selector => {
//   const elem = this;
//   elem.classList.add(selector);
//   console.log('aaaaaaaaaa');
// };
