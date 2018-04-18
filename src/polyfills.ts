import 'core-js/es6';
import 'core-js/es7/reflect';
require('zone.js/dist/zone');

//import 'core-js/client/shim.min.js';
//import 'zone.js/dist/zone.js';
//require('systemjs/dist/system.src.js');
import './systemjs.config.js';

if (process.env.ENV === 'production') {
  // Production
} else {
  // Development and test
  Error['stackTraceLimit'] = Infinity;
  require('zone.js/dist/long-stack-trace-zone');
}