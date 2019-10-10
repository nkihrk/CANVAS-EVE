// Load JS modules
// import GlbEve from './common/global-eve';
import CommonEve from './common/common-eve';
import PlainEve from './eve-modules/plain-eve';
import ZoomEve from './eve-modules/zoom-eve';
import ThreeEve from './eve-modules/three-eve';
import OekakiEve from './eve-modules/oekaki-eve';

// Load SCSS modules
import '../scss/common/Reboot.scss';
import '../scss/common/styles.scss';
import '../scss/scss-modules/canvas-eve.scss';
import '../scss/scss-modules/colpick-eve.scss';
import '../scss/scss-modules/oekaki-eve.scss';
import '../scss/scss-modules/youtube-eve.scss';

const common = new CommonEve();
const plain = new PlainEve();
const zoom = new ZoomEve();
const three = new ThreeEve();
const oekakiContainer = document.getElementById('color-oekaki');
const oekaki = new OekakiEve(oekakiContainer);

common.load();
plain.load();
zoom.load();
three.load();
oekaki.load();
