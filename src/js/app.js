// Load JS modules
import {
    CommonEve
} from './common/common-eve';

// Load SCSS modules
import '../scss/common/Reboot.scss';
import '../scss/common/styles.scss';
import '../scss/scss-modules/canvas-eve.scss';
import '../scss/scss-modules/colpick-eve.scss';
import '../scss/scss-modules/oekaki-eve.scss';
import '../scss/scss-modules/youtube-eve.scss';


const common = new CommonEve();
common.load();