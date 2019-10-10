/**
 *
 * Entry point for CANVAS EVE.
 *
 */

// Load SCSS modules
// - abstracts
import '../scss/abstracts/_variables.scss';
import '../scss/abstracts/_functions.scss';
import '../scss/abstracts/_mixins.scss';
import '../scss/abstracts/_placeholders.scss';
// - vendors
// import '../scss/vendors/_bootstrap.scss';
// import '../scss/vendors/_jquery-ui.scss';
// - base
import '../scss/base/_reset.scss';
import '../scss/base/_typography.scss';
import '../scss/base/_styles.scss';
// - layout
import '../scss/layout/_navigation.scss';
import '../scss/layout/_grid.scss';
import '../scss/layout/_header.scss';
import '../scss/layout/_footer.scss';
import '../scss/layout/_sidebar.scss';
import '../scss/layout/_forms.scss';
// - components
import '../scss/components/_canvas-eve.scss';
import '../scss/components/_colpick-eve.scss';
import '../scss/components/_oekaki-eve.scss';
import '../scss/components/_youtube-eve.scss';
// - pages
import '../scss/pages/_home.scss';
// - themes
import '../scss/themes/_theme.scss';
// a shame file
import '../scss/_shame.scss';

// Load JS modules
// import GlbEve from './common/global-eve';
import CommonEve from './common/common-eve';
import PlainEve from './eve-modules/plain-eve';
import ZoomEve from './eve-modules/zoom-eve';
import YoutubeEve from './eve-modules/youtube-eve';
import ThreeEve from './eve-modules/three-eve';
import OekakiEve from './eve-modules/oekaki-eve';

const common = new CommonEve();
const plain = new PlainEve();
const zoom = new ZoomEve();
const youtube = new YoutubeEve();
const three = new ThreeEve();
const oekakiContainer = document.getElementById('color-oekaki');
const oekaki = new OekakiEve(oekakiContainer);

common.load();
plain.load();
zoom.load();
youtube.load();
three.load();
oekaki.load();
