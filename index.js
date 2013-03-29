/**
 * Log formatted metrics
 *
 * @param {Object|String} metric
 * @param {String|Number|Object} value
 * @param {String} units
 * @return {String}
 * @api public
 */
module.exports = exports = function metric() {
  return exports.log(exports.format(defaults.apply(null, arguments)));
};

exports.profile = function(metric, props) {
  var start = Date.now();
  return function(otherProps) {
    return exports(metric, (Date.now() - start), "ms", merge(props||{}, otherProps));
  };
};

/**
 * Expose log function
 */
exports.log = console.log.bind(console);

/**
 * noop
 */
function noop () {};

/**
 * Apply a context to the logger
 *
 * @param {Object} context
 * @return {Logger}
 * @api public
 */
exports.context = function(obj) {
  function c() {
    return exports.log(exports.format(merge(c.inherit(), defaults.apply(null, arguments))));
  };
  c.use = function(parent) {
    c.parent = parent || {};
    return c;
  };
  c.inherit = function() {
    var parent = (c.parent.inherit || noop)() || clone(c.parent);
    return merge(parent, c._context);
  };
  c.profile = function(metric, props) {
    var start = Date.now();
    return function(otherProps) {
      return c(metric, (Date.now() - start), "ms", merge(props||{}, otherProps));
    };
  };
  c.context = function(obj) {
    return exports.context(obj).use(c);
  };
  c._context = obj || {};
  c.parent = {};
  return c;
};

exports.format = function (obj) {
  var out = Object.keys(obj).filter(function(key) {
    // Don't print 'key='
    return obj[key] !== '';
  }).map(function(key) {
    // Turn any objects into json
    var value = (typeof obj[key] === "object") ? JSON.stringify(obj[key]) : obj[key];
    // If we have a space or quote we need to surround it in quotes
    return key+"="+((/[\"\\ ]+/.test(value)) ? '"'+value.replace(/\\/g, '\\\\').replace(/"/g,'\\"')+'"' : value);
  }).join(" ");
  return out;
};

function defaults(metric, value, units, props) {
  if (typeof metric === "string") {
    var obj = {
      measure: metric,
      val: value
    };
    if(units) obj.units = units;
    return props ? merge(obj, props) : obj;
  }
  else {
    return metric;
  };
};

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function merge(a, b){
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }
  return a;
};
