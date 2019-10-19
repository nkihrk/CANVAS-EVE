/**
 *
 * Entry point for CANVAS EVE.
 *
 */

// Load SCSS modules
/**
 * - Abstracts
 *
 */
import '../scss/abstracts/_variables.scss';
import '../scss/abstracts/_functions.scss';
import '../scss/abstracts/_mixins.scss';
import '../scss/abstracts/_placeholders.scss';
/**
 * - Vendors
 *
 */
// import '../scss/vendors/_bootstrap.scss';
// import '../scss/vendors/_jquery-ui.scss';
/**
 * - Base
 *
 */
import '../scss/base/_reset.scss';
import '../scss/base/_typography.scss';
import '../scss/base/_styles.scss';
/**
 * - Layout
 *
 */
import '../scss/layout/_navigation.scss';
import '../scss/layout/_grid.scss';
import '../scss/layout/_header.scss';
import '../scss/layout/_footer.scss';
import '../scss/layout/_sidebar.scss';
import '../scss/layout/_forms.scss';
/**
 * - Components
 *
 */
import '../scss/components/_canvas-eve.scss';
import '../scss/components/_colpick-eve.scss';
import '../scss/components/_oekaki-eve.scss';
import '../scss/components/_youtube-eve.scss';
/**
 * - Pages
 *
 */
import '../scss/pages/_home.scss';
/**
 * - Themes
 *
 */
import '../scss/themes/_theme.scss';
/**
 * A shame file
 *
 */
import '../scss/_shame.scss';

// // Load JS modules
import EventEve from './event-eve';

const event = new EventEve();
event.load();
