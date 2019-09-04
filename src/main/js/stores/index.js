import Uploads from './Uploads';
import Security from './Security';
import Thumbnails from './Thumbnails';

const security = new Security();
const uploads = new Uploads(security);
const thumbnails = new Thumbnails();

security.checkLoggedIn();

export default {
  security,
  uploads,
  thumbnails,
};
