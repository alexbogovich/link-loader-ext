import { handlerProvider } from './utils/proxy-provider'
import {PromisifiedSDK} from "~/sdk";

const psdk = new Proxy({}, handlerProvider()) as PromisifiedSDK;
export { psdk }
