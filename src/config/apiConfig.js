import Config from './ServiceConfig.json';

//let appHost;
let backendHost;
let hostName = window && window.location && window.location.hostname;

hostName = hostName.toUpperCase();

if (hostName.indexOf('LOCALHOST') > -1) {
  //appHost = Config.GatewayAppURL_LOCAL;
  backendHost = Config.GatewayApiURL_LOCAL;
} else if (hostName.indexOf('STAGEHR.VANKUKIL.COM') > -1) {
  //appHost = Config.GatewayAppURL_STG;
  backendHost = Config.GatewayApiURL_STG;
} else if (hostName.indexOf('HR.VANKUKIL.COM') > -1) {
  //appHost = Config.GatewayAppURL_STG;
  backendHost = Config.GatewayApiURL_PRD;
}

//const APP_ROOT = appHost;
const API_ROOT = backendHost;

export { API_ROOT };
