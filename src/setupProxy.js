import { Proxy } from '@domoinc/ryuu-proxy';
import manifest from '../public/manifest.json';

const config = {
  manifest,
};
const proxy = new Proxy(config);

export default function (app) {
  app.use(proxy.express());
}
