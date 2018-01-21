(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/assert/assert.js":[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"util/":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/util/util.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/process/browser.js":[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/util/node_modules/inherits/inherits_browser.js":[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/util/support/isBufferBrowser.js":[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/util/util.js":[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./support/isBuffer":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/util/support/isBufferBrowser.js","_process":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/process/browser.js","inherits":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/util/node_modules/inherits/inherits_browser.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/catmath.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// にゃーん

var CatMath = {};

/**
 * adds a two vec
 * @param {array} a - vec
 * @param {array} b - vec
 */
CatMath.vecAdd = function (a, b) {
  return a.map(function (e, i) {
    return e + b[i];
  });
};

/**
 * substracts a vec from an another vec
 * @param {array} a - vec
 * @param {array} b - vec
 */
CatMath.vecSub = function (a, b) {
  return a.map(function (e, i) {
    return e - b[i];
  });
};

/**
 * returns a cross of two vec3s
 * @param {array} a - vec3
 * @param {array} b - vec3
 */
CatMath.vec3Cross = function (a, b) {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
};

/**
 * scales a vec by scalar
 * @param {number} s - scalar
 * @param {array} v - vec
 */
CatMath.vecScale = function (s, v) {
  return v.map(function (e) {
    return e * s;
  });
};

/**
 * returns length of a vec
 * @param {array} v - vec
 */
CatMath.vecLength = function (v) {
  return Math.sqrt(v.reduce(function (p, c) {
    return p + c * c;
  }, 0.0));
};

/**
 * normalizes a vec
 * @param {array} v - vec
 */
CatMath.vecNormalize = function (v) {
  return CatMath.vecScale(1.0 / CatMath.vecLength(v), v);
};

/**
 * applies two mat4s
 * @param {array} a - mat4
 * @param {array} b - mat4
 */
CatMath.mat4Apply = function (a, b) {
  return [a[0] * b[0] + a[4] * b[1] + a[8] * b[2] + a[12] * b[3], a[1] * b[0] + a[5] * b[1] + a[9] * b[2] + a[13] * b[3], a[2] * b[0] + a[6] * b[1] + a[10] * b[2] + a[14] * b[3], a[3] * b[0] + a[7] * b[1] + a[11] * b[2] + a[15] * b[3], a[0] * b[4] + a[4] * b[5] + a[8] * b[6] + a[12] * b[7], a[1] * b[4] + a[5] * b[5] + a[9] * b[6] + a[13] * b[7], a[2] * b[4] + a[6] * b[5] + a[10] * b[6] + a[14] * b[7], a[3] * b[4] + a[7] * b[5] + a[11] * b[6] + a[15] * b[7], a[0] * b[8] + a[4] * b[9] + a[8] * b[10] + a[12] * b[11], a[1] * b[8] + a[5] * b[9] + a[9] * b[10] + a[13] * b[11], a[2] * b[8] + a[6] * b[9] + a[10] * b[10] + a[14] * b[11], a[3] * b[8] + a[7] * b[9] + a[11] * b[10] + a[15] * b[11], a[0] * b[12] + a[4] * b[13] + a[8] * b[14] + a[12] * b[15], a[1] * b[12] + a[5] * b[13] + a[9] * b[14] + a[13] * b[15], a[2] * b[12] + a[6] * b[13] + a[10] * b[14] + a[14] * b[15], a[3] * b[12] + a[7] * b[13] + a[11] * b[14] + a[15] * b[15]];
};

/**
 * transpose a mat4
 * @param {array} m - mat4
 */
CatMath.mat4Transpose = function (m) {
  return [m[0], m[4], m[8], m[12], m[1], m[5], m[9], m[13], m[2], m[6], m[10], m[14], m[3], m[7], m[11], m[15]];
};

/**
 * returns an indentity mat4
 */
CatMath.mat4Identity = function () {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

CatMath.mat4Translate = function (v) {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, v[0], v[1], v[2], 1];
};

CatMath.mat4Scale = function (v) {
  return [v[0], 0, 0, 0, 0, v[1], 0, 0, 0, 0, v[2], 0, 0, 0, 0, 1];
};

CatMath.mat4ScaleXYZ = function (s) {
  return [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1];
};

CatMath.mat4RotateX = function (t) {
  return [1, 0, 0, 0, 0, Math.cos(t), -Math.sin(t), 0, 0, Math.sin(t), Math.cos(t), 0, 0, 0, 0, 1];
};

CatMath.mat4RotateY = function (t) {
  return [Math.cos(t), 0, Math.sin(t), 0, 0, 1, 0, 0, -Math.sin(t), 0, Math.cos(t), 0, 0, 0, 0, 1];
};

CatMath.mat4RotateZ = function (t) {
  return [Math.cos(t), -Math.sin(t), 0, 0, Math.sin(t), Math.cos(t), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

CatMath.mat4LookAt = function (pos, tar, air, rot) {
  var dir = CatMath.vecNormalize(CatMath.vecSub(tar, pos));
  var sid = CatMath.vecNormalize(CatMath.vec3Cross(dir, air));
  var top = CatMath.vec3Cross(sid, dir);
  sid = CatMath.vecAdd(CatMath.vecScale(Math.cos(rot), sid), CatMath.vecScale(Math.sin(rot), top));
  top = CatMath.vec3Cross(sid, dir);

  return [sid[0], top[0], dir[0], 0.0, sid[1], top[1], dir[1], 0.0, sid[2], top[2], dir[2], 0.0, -sid[0] * pos[0] - sid[1] * pos[1] - sid[2] * pos[2], -top[0] * pos[0] - top[1] * pos[1] - top[2] * pos[2], -dir[0] * pos[0] - dir[1] * pos[1] - dir[2] * pos[2], 1.0];
};

CatMath.mat4Perspective = function (fov, aspect, near, far) {
  var p = 1.0 / Math.tan(fov * Math.PI / 360.0);
  var d = far / (far - near);
  return [p / aspect, 0.0, 0.0, 0.0, 0.0, p, 0.0, 0.0, 0.0, 0.0, d, 1.0, 0.0, 0.0, -near * d, 0.0];
};

exports.default = CatMath;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/glcat-path-gui.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _glcatPath = require('./glcat-path');

var _glcatPath2 = _interopRequireDefault(_glcatPath);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var requiredFields = function requiredFields(object, nanithefuck, fields) {
  fields.map(function (field) {
    if (typeof object[field] === "undefined") {
      throw "GLCat-Path: " + field + " is required for " + nanithefuck;
    }
  });
};

var PathGUI = function (_Path) {
  _inherits(PathGUI, _Path);

  function PathGUI(glCat, params) {
    _classCallCheck(this, PathGUI);

    var _this = _possibleConstructorReturn(this, (PathGUI.__proto__ || Object.getPrototypeOf(PathGUI)).call(this, glCat, params));

    var it = _this;

    requiredFields(params, "params", ["canvas", "el"]);

    it.gui = { parent: it.params.el };

    it.gui.info = document.createElement("span");
    it.gui.parent.appendChild(it.gui.info);

    it.gui.range = document.createElement("input");
    it.gui.range.type = "range";
    it.gui.range.min = 0;
    it.gui.range.max = 0;
    it.gui.range.step = 1;
    it.gui.parent.appendChild(it.gui.range);

    it.timeList = new Array(30).fill(0);
    it.timeListIndex = 0;
    it.totalFrames = 0;
    it.fps = 0;
    it.currentIndex = 0;
    it.viewName = "";
    it.viewIndex = 0;

    var gl = glCat.gl;
    var vboQuad = glCat.createVertexbuffer([-1, -1, 1, -1, -1, 1, 1, 1]);
    it.add({
      __PathGuiReturn: {
        width: it.params.canvas.width,
        height: it.params.canvas.height,
        vert: "attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}",
        frag: "precision highp float;uniform vec2 r;uniform sampler2D s;void main(){gl_FragColor=texture2D(s,gl_FragCoord.xy/r);}",
        blend: [gl.ONE, gl.ONE],
        clear: [0.0, 0.0, 0.0, 1.0],
        func: function func(_p, params) {
          gl.viewport(0, 0, it.params.canvas.width, it.params.canvas.height);
          glCat.uniform2fv('r', [it.params.canvas.width, it.params.canvas.height]);

          glCat.attribute('p', vboQuad, 2);
          glCat.uniformTexture('s', params.input, 0);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        }
      }
    });
    return _this;
  }

  _createClass(PathGUI, [{
    key: 'begin',
    value: function begin() {
      var it = this;

      it.currentIndex = 0;
    }
  }, {
    key: 'end',
    value: function end() {
      var it = this;

      it.gui.range.max = Math.max(it.gui.range.max, it.currentIndex);
      it.currentIndex = 0;

      var now = +new Date() * 1E-3;
      it.timeList[it.timeListIndex] = now;
      it.timeListIndex = (it.timeListIndex + 1) % it.timeList.length;
      it.fps = ((it.timeList.length - 1) / (now - it.timeList[it.timeListIndex])).toFixed(1);

      it.totalFrames++;

      it.gui.info.innerText = "Path: " + it.viewName + " (" + it.viewIndex + ")\n" + it.fps + " FPS\n" + it.totalFrames + " frames\n";
    }
  }, {
    key: 'render',
    value: function render(name, params) {
      var it = this;

      it.currentIndex++;
      var view = parseInt(it.gui.range.value);

      if (it.currentIndex <= view || view === 0) {
        it.viewName = view === 0 ? "*Full*" : name;
        it.viewIndex = it.currentIndex;

        _get(PathGUI.prototype.__proto__ || Object.getPrototypeOf(PathGUI.prototype), 'render', this).call(this, name, params);

        if (it.currentIndex === view) {
          var t = params && params.target ? params.target : it.paths[name].framebuffer;
          if (t) {
            var i = t.textures ? t.textures[0] : t.texture;
            if (it.params.stretch) {
              _get(PathGUI.prototype.__proto__ || Object.getPrototypeOf(PathGUI.prototype), 'render', this).call(this, "__PathGuiReturn", {
                target: it.nullFb,
                input: i,
                width: it.params.canvas.width,
                height: it.params.canvas.height
              });
            } else {
              it.params.canvas.width = (params ? params.width : 0) || it.paths[name].width || it.params.width;
              it.params.canvas.height = (params ? params.height : 0) || it.paths[name].height || it.params.height;
              _get(PathGUI.prototype.__proto__ || Object.getPrototypeOf(PathGUI.prototype), 'render', this).call(this, "__PathGuiReturn", {
                target: it.nullFb,
                input: i
              });
            }
          }
        }
      }
    }
  }]);

  return PathGUI;
}(_glcatPath2.default);

exports.default = PathGUI;

},{"./glcat-path":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/glcat-path.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/glcat-path.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var requiredFields = function requiredFields(object, nanithefuck, fields) {
  fields.map(function (field) {
    if (typeof object[field] === "undefined") {
      throw "GLCat-Path: " + field + " is required for " + nanithefuck;
    }
  });
};

var Path = function () {
  function Path(glCat, params) {
    _classCallCheck(this, Path);

    var it = this;

    it.glCat = glCat;
    it.gl = glCat.gl;

    it.paths = {};
    it.globalFunc = function () {};
    it.params = params || {};
  }

  _createClass(Path, [{
    key: "add",
    value: function add(paths) {
      var it = this;

      for (var name in paths) {
        var path = paths[name];
        requiredFields(path, "path object", ["width", "height", "vert", "frag", "blend", "func"]);
        it.paths[name] = path;

        if (typeof path.depthTest === "undefined") {
          path.depthTest = true;
        }

        if (path.framebuffer) {
          if (path.drawbuffers) {
            path.framebuffer = it.glCat.createDrawBuffers(path.width, path.height, path.drawbuffers);
          } else if (path.float) {
            path.framebuffer = it.glCat.createFloatFramebuffer(path.width, path.height);
          } else {
            path.framebuffer = it.glCat.createFramebuffer(path.width, path.height);
          }
        }
        path.program = it.glCat.createProgram(path.vert, path.frag);
      }
    }
  }, {
    key: "render",
    value: function render(name, params) {
      var _it$gl;

      var it = this;

      var path = it.paths[name];
      if (!path) {
        throw "GLCat-Path: The path called " + name + " is not defined!";
      }

      if (!params) {
        params = {};
      }
      params.framebuffer = typeof params.target !== "undefined" ? params.target.framebuffer : path.framebuffer ? path.framebuffer.framebuffer : null;

      var width = params.width || path.width;
      var height = params.height || path.height;

      it.gl.viewport(0, 0, width, height);
      it.glCat.useProgram(path.program);
      it.gl.bindFramebuffer(it.gl.FRAMEBUFFER, params.framebuffer);
      if (it.params.drawbuffers) {
        it.glCat.drawBuffers(path.drawbuffers ? path.drawbuffers : params.framebuffer === null ? [it.gl.BACK] : [it.gl.COLOR_ATTACHMENT0]);
      }
      (_it$gl = it.gl).blendFunc.apply(_it$gl, _toConsumableArray(path.blend));
      if (path.clear) {
        var _it$glCat;

        (_it$glCat = it.glCat).clear.apply(_it$glCat, _toConsumableArray(path.clear));
      }
      path.depthTest ? it.gl.enable(it.gl.DEPTH_TEST) : it.gl.disable(it.gl.DEPTH_TEST);

      it.glCat.uniform2fv('resolution', [width, height]);
      it.globalFunc(path, params);
      path.func(path, params);
    }
  }, {
    key: "resize",
    value: function resize(name, width, height) {
      var it = this;

      var path = it.paths[name];

      path.width = width;
      path.height = height;

      if (path.framebuffer) {
        if (it.params.drawbuffers && path.drawbuffers) {
          path.framebuffer = it.glCat.createDrawBuffers(path.width, path.height, path.drawbuffers);
        } else if (path.float) {
          it.glCat.resizeFloatFramebuffer(path.framebuffer, path.width, path.height);
        } else {
          it.glCat.resizeFramebuffer(path.framebuffer, path.width, path.height);
        }
      }

      if (typeof path.onresize === "function") {
        path.onresize(path, width, height);
      }
    }
  }, {
    key: "setGlobalFunc",
    value: function setGlobalFunc(func) {
      this.globalFunc = func;
    }
  }, {
    key: "fb",
    value: function fb(name) {
      if (!this.paths[name]) {
        throw "glcat-path.fb: path called " + name + " is not defined";
      }
      if (!this.paths[name].framebuffer) {
        throw "glcat-path.fb: there is no framebuffer for the path " + name;
      }

      return this.paths[name].framebuffer;
    }
  }]);

  return Path;
}();

Path.nullFb = { framebuffer: null };

exports.default = Path;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/glcat.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GLCat = function () {
	function GLCat(_gl) {
		_classCallCheck(this, GLCat);

		var it = this;

		it.gl = _gl;
		var gl = it.gl;

		gl.enable(gl.DEPTH_TEST);
		gl.depthFunc(gl.LEQUAL);
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		it.extensions = {};

		it.currentProgram = null;
	}

	_createClass(GLCat, [{
		key: "getExtension",
		value: function getExtension(_name, _throw) {
			var it = this;
			var gl = it.gl;

			if ((typeof _name === "undefined" ? "undefined" : _typeof(_name)) === "object" && _name.isArray()) {
				return _name.every(function (name) {
					return it.getExtension(name, _throw);
				});
			} else if (typeof _name === "string") {
				if (it.extensions[_name]) {
					return it.extensions[_name];
				} else {
					it.extensions[_name] = gl.getExtension(_name);
					if (it.extensions[_name]) {
						return it.extensions[_name];
					} else {
						if (_throw) {
							throw console.error("The extension \"" + _name + "\" is not supported");
						}
						return false;
					}
				}
				return !!it.extensions[_name];
			} else {
				throw "GLCat.getExtension: _name must be string or array";
			}
		}
	}, {
		key: "createProgram",
		value: function createProgram(_vert, _frag, _onError) {
			var it = this;
			var gl = it.gl;

			var error = void 0;
			if (typeof _onError === 'function') {
				error = _onError;
			} else {
				error = function error(_str) {
					console.error(_str);
				};
			}

			var vert = gl.createShader(gl.VERTEX_SHADER);
			gl.shaderSource(vert, _vert);
			gl.compileShader(vert);
			if (!gl.getShaderParameter(vert, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(vert));
				return null;
			}

			var frag = gl.createShader(gl.FRAGMENT_SHADER);
			gl.shaderSource(frag, _frag);
			gl.compileShader(frag);
			if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
				error(gl.getShaderInfoLog(frag));
				return null;
			}

			var program = gl.createProgram();
			gl.attachShader(program, vert);
			gl.attachShader(program, frag);
			gl.linkProgram(program);
			if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
				program.locations = {};
				return program;
			} else {
				error(gl.getProgramInfoLog(program));
				return null;
			}
		}
	}, {
		key: "useProgram",
		value: function useProgram(_program) {
			var it = this;
			var gl = it.gl;

			gl.useProgram(_program);
			it.currentProgram = _program;
		}
	}, {
		key: "createVertexbuffer",
		value: function createVertexbuffer(_array) {
			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			if (_array) {
				it.setVertexbuffer(buffer, _array);
			}

			return buffer;
		}
	}, {
		key: "setVertexbuffer",
		value: function setVertexbuffer(_buffer, _array) {
			var it = this;
			var gl = it.gl;

			gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(_array), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			_buffer.length = _array.length;
		}
	}, {
		key: "createIndexbuffer",
		value: function createIndexbuffer(_array) {
			var it = this;
			var gl = it.gl;

			var buffer = gl.createBuffer();

			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(_array), gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			buffer.length = _array.length;
			return buffer;
		}
	}, {
		key: "getAttribLocation",
		value: function getAttribLocation(_name) {
			var it = this;
			var gl = it.gl;

			var location = void 0;
			if (it.currentProgram.locations[_name]) {
				location = it.currentProgram.locations[_name];
			} else {
				location = gl.getAttribLocation(it.currentProgram, _name);
				it.currentProgram.locations[_name] = location;
			}

			return location;
		}
	}, {
		key: "attribute",
		value: function attribute(_name, _buffer, _stride, _div) {
			var it = this;
			var gl = it.gl;

			if (_div) {
				it.getExtension("ANGLE_instanced_arrays", true);
			}

			var location = it.getAttribLocation(_name);

			gl.bindBuffer(gl.ARRAY_BUFFER, _buffer);
			gl.enableVertexAttribArray(location);
			gl.vertexAttribPointer(location, _stride, gl.FLOAT, false, 0, 0);

			var ext = it.getExtension("ANGLE_instanced_arrays");
			if (ext) {
				var div = _div || 0;
				ext.vertexAttribDivisorANGLE(location, div);
			}

			gl.bindBuffer(gl.ARRAY_BUFFER, null);
		}
	}, {
		key: "getUniformLocation",
		value: function getUniformLocation(_name) {
			var it = this;
			var gl = it.gl;

			var location = void 0;

			if (it.currentProgram.locations[_name]) {
				location = it.currentProgram.locations[_name];
			} else {
				location = gl.getUniformLocation(it.currentProgram, _name);
				it.currentProgram.locations[_name] = location;
			}

			return location;
		}
	}, {
		key: "uniform1i",
		value: function uniform1i(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1i(location, _value);
		}
	}, {
		key: "uniform1f",
		value: function uniform1f(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform1f(location, _value);
		}
	}, {
		key: "uniform2fv",
		value: function uniform2fv(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform2fv(location, _value);
		}
	}, {
		key: "uniform3fv",
		value: function uniform3fv(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform3fv(location, _value);
		}
	}, {
		key: "uniform4fv",
		value: function uniform4fv(_name, _value) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniform4fv(location, _value);
		}
	}, {
		key: "uniformMatrix4fv",
		value: function uniformMatrix4fv(_name, _value, _transpose) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.uniformMatrix4fv(location, _transpose || false, _value);
		}
	}, {
		key: "uniformCubemap",
		value: function uniformCubemap(_name, _texture, _number) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: "uniformTexture",
		value: function uniformTexture(_name, _texture, _number) {
			var it = this;
			var gl = it.gl;

			var location = it.getUniformLocation(_name);
			gl.activeTexture(gl.TEXTURE0 + _number);
			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.uniform1i(location, _number);
		}
	}, {
		key: "createTexture",
		value: function createTexture() {
			var it = this;
			var gl = it.gl;

			var texture = gl.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_2D, null);

			return texture;
		}
	}, {
		key: "textureFilter",
		value: function textureFilter(_texture, _filter) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, _filter);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, _filter);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "textureWrap",
		value: function textureWrap(_texture, _wrap) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, _wrap);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, _wrap);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "setTexture",
		value: function setTexture(_texture, _image) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _image);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "setTextureFromArray",
		value: function setTextureFromArray(_texture, _width, _height, _array) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(_array));
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "setTextureFromFloatArray",
		value: function setTextureFromFloatArray(_texture, _width, _height, _array) {
			var it = this;
			var gl = it.gl;

			it.getExtension("OES_texture_float", true);

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, new Float32Array(_array));
			if (!it.getExtension("OES_texture_float_linear")) {
				it.textureFilter(_texture, gl.NEAREST);
			}
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "copyTexture",
		value: function copyTexture(_texture, _width, _height) {
			var it = this;
			var gl = it.gl;

			gl.bindTexture(gl.TEXTURE_2D, _texture);
			gl.copyTexImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 0, 0, _width, _height, 0);
			gl.bindTexture(gl.TEXTURE_2D, null);
		}
	}, {
		key: "createCubemap",
		value: function createCubemap(_arrayOfImage) {
			var it = this;
			var gl = it.gl;

			// order : X+, X-, Y+, Y-, Z+, Z-
			var texture = gl.createTexture();

			gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
			for (var i = 0; i < 6; i++) {
				gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, _arrayOfImage[i]);
			}
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);

			return texture;
		}
	}, {
		key: "createFramebuffer",
		value: function createFramebuffer(_width, _height) {
			var it = this;
			var gl = it.gl;

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: "resizeFramebuffer",
		value: function resizeFramebuffer(_framebuffer, _width, _height) {
			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);

			gl.bindRenderbuffer(gl.RENDERBUFFER, _framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);

			gl.bindTexture(gl.TEXTURE_2D, _framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: "createFloatFramebuffer",
		value: function createFloatFramebuffer(_width, _height) {
			var it = this;
			var gl = it.gl;

			it.getExtension("OES_texture_float", true);

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.texture = it.createTexture();
			gl.bindTexture(gl.TEXTURE_2D, framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			if (!it.getExtension("OES_texture_float_linear")) {
				it.textureFilter(framebuffer.texture, gl.NEAREST);
			}
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, framebuffer.texture, 0);
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: "resizeFloatFramebuffer",
		value: function resizeFloatFramebuffer(_framebuffer, _width, _height) {
			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);

			gl.bindRenderbuffer(gl.RENDERBUFFER, _framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);

			gl.bindTexture(gl.TEXTURE_2D, _framebuffer.texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
			gl.bindTexture(gl.TEXTURE_2D, null);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: "createDrawBuffers",
		value: function createDrawBuffers(_width, _height, _numDrawBuffers) {
			var it = this;
			var gl = it.gl;

			it.getExtension('OES_texture_float', true);
			var ext = it.getExtension('WEBGL_draw_buffers', true);

			if (ext.MAX_DRAW_BUFFERS_WEBGL < _numDrawBuffers) {
				throw "createDrawBuffers: MAX_DRAW_BUFFERS_WEBGL is " + ext.MAX_DRAW_BUFFERS_WEBGL;
			}

			var framebuffer = {};
			framebuffer.framebuffer = gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer.framebuffer);

			framebuffer.depth = gl.createRenderbuffer();
			gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depth);

			framebuffer.textures = [];
			for (var i = 0; i < _numDrawBuffers; i++) {
				framebuffer.textures[i] = it.createTexture();
				gl.bindTexture(gl.TEXTURE_2D, framebuffer.textures[i]);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
				if (!it.getExtension("OES_texture_float_linear")) {
					it.textureFilter(framebuffer.textures[i], gl.NEAREST);
				}
				gl.bindTexture(gl.TEXTURE_2D, null);

				gl.framebufferTexture2D(gl.FRAMEBUFFER, ext.COLOR_ATTACHMENT0_WEBGL + i, gl.TEXTURE_2D, framebuffer.textures[i], 0);
			}

			var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
			if (status !== gl.FRAMEBUFFER_COMPLETE) {
				throw "createDrawBuffers: gl.checkFramebufferStatus( gl.FRAMEBUFFER ) returns " + status;
			}
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			return framebuffer;
		}
	}, {
		key: "resizeDrawBuffers",
		value: function resizeDrawBuffers(_framebuffer, _width, height) {
			var it = this;
			var gl = it.gl;

			gl.bindFramebuffer(gl.FRAMEBUFFER, _framebuffer.framebuffer);

			gl.bindRenderbuffer(gl.RENDERBUFFER, _framebuffer.depth);
			gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, _width, _height);
			gl.bindRenderbuffer(gl.RENDERBUFFER, null);

			for (var i = 0; i < _framebuffer.textures.length; i++) {
				gl.bindTexture(gl.TEXTURE_2D, _framebuffer.textures[i]);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, _width, _height, 0, gl.RGBA, gl.FLOAT, null);
				gl.bindTexture(gl.TEXTURE_2D, null);
			}

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		}
	}, {
		key: "drawBuffers",
		value: function drawBuffers(_numDrawBuffers) {
			var it = this;
			var gl = it.gl;

			var ext = it.getExtension("WEBGL_draw_buffers", true);

			var array = [];
			if (typeof _numDrawBuffers === "number") {
				for (var i = 0; i < _numDrawBuffers; i++) {
					array.push(ext.COLOR_ATTACHMENT0_WEBGL + i);
				}
			} else {
				array = array.concat(_numDrawBuffers);
			}
			ext.drawBuffersWEBGL(array);
		}
	}, {
		key: "clear",
		value: function clear(_r, _g, _b, _a, _d) {
			var it = this;
			var gl = it.gl;

			var r = _r || 0.0;
			var g = _g || 0.0;
			var b = _b || 0.0;
			var a = typeof _a === 'number' ? _a : 1.0;
			var d = typeof _d === 'number' ? _d : 1.0;

			gl.clearColor(r, g, b, a);
			gl.clearDepth(d);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}
	}]);

	return GLCat;
}();

exports.default = GLCat;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/step.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var step = function step(_obj) {
  var obj = _obj;
  var count = -1;

  var func = function func() {
    count++;
    if (typeof obj[count] === 'function') {
      obj[count](func);
    }
  };
  func();
};

exports.default = step;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/tweak.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tweak = function () {
  function Tweak(_el) {
    _classCallCheck(this, Tweak);

    var it = this;

    it.parent = _el;
    it.values = {};
    it.elements = {};
  }

  _createClass(Tweak, [{
    key: 'button',
    value: function button(_name, _props) {
      var it = this;

      var props = _props || {};

      if (typeof it.values[_name] === 'undefined') {
        var div = document.createElement('div');
        it.parent.appendChild(div);

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'button';
        input.value = _name;

        input.addEventListener('click', function () {
          it.values[_name] = true;
        });

        it.elements[_name] = {
          div: div,
          input: input
        };
      }

      var tempvalue = it.values[_name];
      it.values[_name] = false;
      if (typeof props.set === 'boolean') {
        it.values[_name] = props.set;
      }

      return tempvalue;
    }
  }, {
    key: 'checkbox',
    value: function checkbox(_name, _props) {
      var it = this;

      var props = _props || {};

      var value = void 0;

      if (typeof it.values[_name] === 'undefined') {
        value = props.value || false;

        var div = document.createElement('div');
        it.parent.appendChild(div);

        var name = document.createElement('span');
        div.appendChild(name);
        name.innerText = _name;

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'checkbox';
        input.checked = value;

        it.elements[_name] = {
          div: div,
          name: name,
          input: input
        };
      } else {
        value = it.elements[_name].input.checked;
      }

      if (typeof props.set === 'boolean') {
        value = props.set;
      }

      it.elements[_name].input.checked = value;
      it.values[_name] = value;

      return it.values[_name];
    }
  }, {
    key: 'range',
    value: function range(_name, _props) {
      var it = this;

      var props = _props || {};

      var value = void 0;

      if (typeof it.values[_name] === 'undefined') {
        var min = props.min || 0.0;
        var max = props.max || 1.0;
        var step = props.step || 0.001;
        value = props.value || min;

        var div = document.createElement('div');
        it.parent.appendChild(div);

        var name = document.createElement('span');
        div.appendChild(name);
        name.innerText = _name;

        var input = document.createElement('input');
        div.appendChild(input);
        input.type = 'range';
        input.value = value;
        input.min = min;
        input.max = max;
        input.step = step;

        var val = document.createElement('span');
        val.innerText = value.toFixed(3);
        div.appendChild(val);
        input.addEventListener('input', function (_event) {
          var value = parseFloat(input.value);
          val.innerText = value.toFixed(3);
        });

        it.elements[_name] = {
          div: div,
          name: name,
          input: input,
          val: val
        };
      } else {
        value = parseFloat(it.elements[_name].input.value);
      }

      if (typeof props.set === 'number') {
        value = props.set;
      }

      it.values[_name] = value;
      it.elements[_name].input.value = value;

      return it.values[_name];
    }
  }]);

  return Tweak;
}();

exports.default = Tweak;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/xorshift.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var seed = void 0;
var xorshift = function xorshift(_seed) {
  seed = _seed || seed || 1;
  seed = seed ^ seed << 13;
  seed = seed ^ seed >>> 17;
  seed = seed ^ seed << 5;
  return seed / Math.pow(2, 32) + 0.5;
};

exports.default = xorshift;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/main.js":[function(require,module,exports){
'use strict';

var _xorshift = require('./lib/xorshift');

var _xorshift2 = _interopRequireDefault(_xorshift);

var _glcat = require('./lib/glcat');

var _glcat2 = _interopRequireDefault(_glcat);

var _catmath = require('./lib/catmath');

var _catmath2 = _interopRequireDefault(_catmath);

var _glcatPathGui = require('./lib/glcat-path-gui');

var _glcatPathGui2 = _interopRequireDefault(_glcatPathGui);

var _step = require('./lib/step');

var _step2 = _interopRequireDefault(_step);

var _tweak = require('./lib/tweak');

var _tweak2 = _interopRequireDefault(_tweak);

var _octahedron = require('./octahedron');

var _octahedron2 = _interopRequireDefault(_octahedron);

var _monitorRecover = require('./monitor-recover');

var _monitorRecover2 = _interopRequireDefault(_monitorRecover);

var _assert = require('assert');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }



// ------

(0, _xorshift2.default)(347895017458906);

var clamp = function clamp(_value, _min, _max) {
  return Math.min(Math.max(_value, _min), _max);
};
var saturate = function saturate(_value) {
  return clamp(_value, 0.0, 1.0);
};

// ------

var frames = 200;
var automaton = new Automaton({
  gui: divAutomaton,
  fps: frames,
  data: '\n  {"rev":20170418,"length":1,"resolution":1000,"params":{"cameraRot":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}],"focus":[{"time":0,"value":1.849002511160713,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.07951070336391437,"value":16.31777912775675,"mode":4,"params":{"rate":87.51,"damp":1},"mods":[false,false,false,false]},{"time":0.25891946992864423,"value":5.684655321212041,"mode":4,"params":{"rate":87.51,"damp":1},"mods":[false,false,false,false]},{"time":0.4923547400611621,"value":9.428193046933128,"mode":4,"params":{"rate":87.51,"damp":1},"mods":[false,false,false,false]},{"time":0.7981651376146789,"value":6.110135829377761,"mode":4,"params":{"rate":87.51,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":2.577551941786524,"mode":2,"params":{},"mods":[false,false,false,false]}],"cameraX":[{"time":0,"value":1.580264486585346,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.8318042813455657,"value":9.819063391417341,"mode":4,"params":{"rate":18,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":-11.83736895152501,"mode":5,"params":{"gravity":420,"bounce":0.3},"mods":[false,false,false,false]}],"cameraY":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":2.11778629872628,"mode":4,"params":{"rate":8,"damp":1},"mods":[false,false,false,false]}],"cameraZ":[{"time":0,"value":38.34969060665796,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.2579001019367992,"value":13.153491821140062,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]},{"time":0.829459734964322,"value":4.3283915442425585,"mode":4,"params":{"rate":28.36,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":-9.902416705553017,"mode":5,"params":{"gravity":110.086,"bounce":0.3},"mods":[false,false,false,false]}],"cameraTX":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTY":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTZ":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"moshThreshold":[{"time":0,"value":0.9589370381735667,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.07849133537206937,"value":0.004761904761904745,"mode":4,"params":{"rate":7500.042,"damp":1},"mods":[false,false,false,false]},{"time":0.09276248725790011,"value":-0.023809523809523836,"mode":2,"params":{},"mods":[{"velocity":0},false,false,false]},{"time":0.5178389398572885,"value":0,"mode":2,"params":{},"mods":[{"velocity":0},false,false,false]},{"time":0.7573904179408767,"value":0.2654369535900294,"mode":4,"params":{"rate":240,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":1.412358225456306,"mode":5,"params":{"gravity":31,"bounce":0.3},"mods":[false,false,false,false]}],"recoverBar":[{"time":0,"value":0.20952380952380956,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.05708460754332314,"value":0.2142857142857142,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.15086646279306828,"value":1.019047619047619,"mode":4,"params":{"rate":4300,"damp":1},"mods":[false,false,false,false]},{"time":0.9001019367991845,"value":0,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0.04761904761904767,"mode":1,"params":{},"mods":[false,false,false,false]}],"recoverClose":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.2222222222222222,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.583078491335372,"value":0.9952380952380951,"mode":4,"params":{"rate":5800,"damp":1},"mods":[false,false,false,false]},{"time":0.9011213047910296,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":29000,"damp":1},"mods":[false,false,false,false]}],"circleRadius":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.109072375127421,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.8979806320081549,"value":0.5386718749999997,"mode":4,"params":{"rate":3000,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":13000,"damp":1},"mods":[false,false,false,false]}],"circleSpin":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.06931702344546381,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.48827726809378186,"value":1.7184151785714272,"mode":4,"params":{"rate":93,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":2.0313337053571425,"mode":1,"params":{},"mods":[false,false,false,false]}],"metaballRadius":[{"time":0,"value":-0.9214285714285715,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.1559633027522936,"value":-0.8797619047619046,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.3200815494393476,"value":1,"mode":4,"params":{"rate":5800,"damp":1},"mods":[false,false,false,false]},{"time":0.8786952089704383,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":-2.775687081473208,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}]},"gui":{"snap":{"enable":false,"bpm":"60","offset":"0"}}}\n'
});
var auto = automaton.auto;

// ------

var width = 400;
var height = 400;
canvas.width = width;
canvas.height = height;

var gl = canvas.getContext('webgl');
var glCat = new _glcat2.default(gl);
glCat.getExtension("OES_texture_float", true);
glCat.getExtension("OES_texture_float_linear", true);
glCat.getExtension("EXT_frag_depth", true);
glCat.getExtension("WEBGL_draw_buffers", true);

var glCatPath = new _glcatPathGui2.default(glCat, {
  drawbuffers: true,
  el: divPath,
  canvas: canvas,
  stretch: true
});

// ------

var tweak = new _tweak2.default(divTweak);

// ------

var totalFrames = 0;
var init = true;

// ------

var vboQuad = glCat.createVertexbuffer([-1, -1, 1, -1, -1, 1, 1, 1]);
var vboQuadUV = glCat.createVertexbuffer([0, 0, 1, 0, 0, 1, 1, 1]);
var vboQuad3 = glCat.createVertexbuffer([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);

var oct = (0, _octahedron2.default)(1);
var textureOctPos = glCat.createTexture();
glCat.setTextureFromFloatArray(textureOctPos, oct.pos.length / 4, 1, oct.pos);
var textureOctNor = glCat.createTexture();
glCat.setTextureFromFloatArray(textureOctNor, oct.pos.length / 4, 1, oct.nor);

var particlePixels = 3;
var particlesSqrt = 128;
var particles = particlesSqrt * particlesSqrt;
var vertsPerParticle = oct.pos.length / 4;

var vboParticle = glCat.createVertexbuffer(function () {
  var ret = [];
  for (var i = 0; i < particlesSqrt * particlesSqrt * vertsPerParticle; i++) {
    var ix = Math.floor(i / vertsPerParticle) % particlesSqrt;
    var iy = Math.floor(i / particlesSqrt / vertsPerParticle);
    var iz = i % vertsPerParticle;

    ret.push(ix * particlePixels);
    ret.push(iy);
    ret.push(iz);
  }
  return ret;
}());

// ------

var textureRandomSize = 256;

var textureRandomUpdate = function textureRandomUpdate(_tex) {
  glCat.setTextureFromArray(_tex, textureRandomSize, textureRandomSize, function () {
    var len = textureRandomSize * textureRandomSize * 4;
    var ret = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
      ret[i] = Math.floor((0, _xorshift2.default)() * 256.0);
    }
    return ret;
  }());
};

var textureRandomStatic = glCat.createTexture();
glCat.textureWrap(textureRandomStatic, gl.REPEAT);
textureRandomUpdate(textureRandomStatic);

var textureRandom = glCat.createTexture();
glCat.textureWrap(textureRandom, gl.REPEAT);

var textureMonitorRecover = glCat.createTexture();
glCat.setTexture(textureMonitorRecover, _monitorRecover2.default);

// ------

var framebuffersGauss = [glCat.createFloatFramebuffer(width / 4, height / 4), glCat.createFloatFramebuffer(width / 4, height / 4), glCat.createFloatFramebuffer(width / 4, height / 4)];

var framebufferPreDof = glCat.createFloatFramebuffer(width, height);

var framebufferMotionPrev = glCat.createFramebuffer(width, height);
var framebufferMotionMosh = glCat.createFramebuffer(width, height);

// ------

var renderA = document.createElement('a');

var saveFrame = function saveFrame() {
  renderA.href = canvas.toDataURL('image/jpeg');
  renderA.download = ('0000' + totalFrames).slice(-5) + '.jpg';
  renderA.click();
};

// ------

var mouseX = 0.0;
var mouseY = 0.0;

// ------

var cameraPos = [0.0, 0.0, 0.0];
var cameraTar = [0.0, 0.0, 0.0];
var cameraRot = 0.0;
var cameraFov = 90.0;

var cameraNear = 0.01;
var cameraFar = 100.0;

var lightPos = [10.0, 10.0, 10.0];

var matP = void 0;
var matV = void 0;
var matPL = void 0;
var matVL = void 0;

var updateMatrices = function updateMatrices() {
  matP = _catmath2.default.mat4Perspective(cameraFov, width / height, cameraNear, cameraFar);
  matV = _catmath2.default.mat4LookAt(cameraPos, cameraTar, [0.0, 1.0, 0.0], cameraRot);

  matPL = _catmath2.default.mat4Perspective(70.0, 1.0, cameraNear, cameraFar);
  matVL = _catmath2.default.mat4LookAt(lightPos, cameraTar, [0.0, 1.0, 0.0], 0.0);
};
updateMatrices();

// ------

var bgColor = [0.4, 0.4, 0.4, 1.0];

// ------

glCatPath.setGlobalFunc(function () {
  glCat.uniform1i('init', init);
  glCat.uniform1f('time', automaton.time);
  glCat.uniform1f('deltaTime', automaton.deltaTime);
  glCat.uniform3fv('cameraPos', cameraPos);
  glCat.uniform1f('cameraRot', cameraRot);
  glCat.uniform1f('cameraFov', cameraFov);
  glCat.uniform1f('cameraNear', cameraNear);
  glCat.uniform1f('cameraFar', cameraFar);
  glCat.uniform3fv('lightPos', lightPos);
  glCat.uniform1f('particlesSqrt', particlesSqrt);
  glCat.uniform1f('particlePixels', particlePixels);
  glCat.uniform1f('frame', automaton.frame % frames);
  glCat.uniform1f('frames', frames);
  glCat.uniform1f('vertsPerParticle', vertsPerParticle);
  glCat.uniformMatrix4fv('matP', matP);
  glCat.uniformMatrix4fv('matV', matV);
  glCat.uniformMatrix4fv('matPL', matPL);
  glCat.uniformMatrix4fv('matVL', matVL);
  glCat.uniform4fv('bgColor', bgColor);
});

glCatPath.add({
  return: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( sampler0, uv );\n}\n",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 1.0],
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('sampler0', params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  こんにちは: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#extension GL_EXT_frag_depth : require\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec4 bgColor;\n\n// ------\n\nvoid main() {\n  gl_FragData[ 0 ] = bgColor;\n  gl_FragData[ 1 ] = vec4( 1.0, 0.0, 0.0, 1.0 );\n  gl_FragDepthEXT = 1.0;\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 1.0],
    framebuffer: true,
    drawbuffers: 2,
    float: true,
    func: function func() {
      glCat.attribute('p', vboQuad, 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  particlesComputeReturn: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  gl_FragColor = texture2D( sampler0, uv );\n}\n",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func() {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('texture', glCatPath.fb("particlesCompute").texture, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  particlesCompute: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define PARTICLE_LIFE_SPEED 1.0\n\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n#define lofir(i,m) (floor((i)/(m)+.5)*(m))\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform float particlesSqrt;\nuniform float particlePixels;\nuniform float frame;\nuniform float frames;\nuniform float charShuffle;\nuniform bool init;\nuniform float deltaTime;\nuniform vec2 resolution;\nuniform vec3 cameraPos;\n\nuniform sampler2D textureReturn;\nuniform sampler2D textureRandom;\n\n// ------\n\nvec2 vInvert( vec2 _uv ) {\n  return vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * _uv;\n}\n\n// ------\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvec4 random( vec2 _uv ) {\n  return texture2D( textureRandom, _uv );\n}\n\n//\n// Description : Array and textureless GLSL 2D/3D/4D simplex\n//               noise functions.\n//      Author : Ian McEwan, Ashima Arts.\n//  Maintainer : ijm\n//     Lastmod : 20110822 (ijm)\n//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.\n//               Distributed under the MIT License. See LICENSE file.\n//               https://github.com/ashima/webgl-noise\n//\n\nvec4 mod289(vec4 x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nfloat mod289(float x) {\n  return x - floor(x * (1.0 / 289.0)) * 289.0; }\n\nvec4 permute(vec4 x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nfloat permute(float x) {\n     return mod289(((x*34.0)+1.0)*x);\n}\n\nvec4 taylorInvSqrt(vec4 r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nfloat taylorInvSqrt(float r)\n{\n  return 1.79284291400159 - 0.85373472095314 * r;\n}\n\nvec4 grad4(float j, vec4 ip)\n  {\n  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);\n  vec4 p,s;\n\n  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;\n  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);\n  s = vec4(lessThan(p, vec4(0.0)));\n  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;\n\n  return p;\n  }\n\n// (sqrt(5) - 1)/4 = F4, used once below\n#define F4 0.309016994374947451\n\nfloat snoise(vec4 v)\n  {\n  const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4\n                        0.276393202250021,  // 2 * G4\n                        0.414589803375032,  // 3 * G4\n                       -0.447213595499958); // -1 + 4 * G4\n\n// First corner\n  vec4 i  = floor(v + dot(v, vec4(F4)) );\n  vec4 x0 = v -   i + dot(i, C.xxxx);\n\n// Other corners\n\n// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)\n  vec4 i0;\n  vec3 isX = step( x0.yzw, x0.xxx );\n  vec3 isYZ = step( x0.zww, x0.yyz );\n//  i0.x = dot( isX, vec3( 1.0 ) );\n  i0.x = isX.x + isX.y + isX.z;\n  i0.yzw = 1.0 - isX;\n//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );\n  i0.y += isYZ.x + isYZ.y;\n  i0.zw += 1.0 - isYZ.xy;\n  i0.z += isYZ.z;\n  i0.w += 1.0 - isYZ.z;\n\n  // i0 now contains the unique values 0,1,2,3 in each channel\n  vec4 i3 = clamp( i0, 0.0, 1.0 );\n  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );\n  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );\n\n  //  x0 = x0 - 0.0 + 0.0 * C.xxxx\n  //  x1 = x0 - i1  + 1.0 * C.xxxx\n  //  x2 = x0 - i2  + 2.0 * C.xxxx\n  //  x3 = x0 - i3  + 3.0 * C.xxxx\n  //  x4 = x0 - 1.0 + 4.0 * C.xxxx\n  vec4 x1 = x0 - i1 + C.xxxx;\n  vec4 x2 = x0 - i2 + C.yyyy;\n  vec4 x3 = x0 - i3 + C.zzzz;\n  vec4 x4 = x0 + C.wwww;\n\n// Permutations\n  i = mod289(i);\n  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);\n  vec4 j1 = permute( permute( permute( permute (\n             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))\n           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))\n           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))\n           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));\n\n// Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope\n// 7*7*6 = 294, which is close to the ring size 17*17 = 289.\n  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;\n\n  vec4 p0 = grad4(j0,   ip);\n  vec4 p1 = grad4(j1.x, ip);\n  vec4 p2 = grad4(j1.y, ip);\n  vec4 p3 = grad4(j1.z, ip);\n  vec4 p4 = grad4(j1.w, ip);\n\n// Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n  p4 *= taylorInvSqrt(dot(p4,p4));\n\n// Mix contributions from the five corners\n  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);\n  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);\n  m0 = m0 * m0;\n  m1 = m1 * m1;\n  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))\n               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;\n\n  }\n\nfloat GPURnd(inout vec4 n)\n{\n\t// Based on the post http://gpgpu.org/forums/viewtopic.php?t=2591&sid=17051481b9f78fb49fba5b98a5e0f1f3\n\t// (The page no longer exists as of March 17th, 2015. Please let me know if you see why this code works.)\n\tconst vec4 q = vec4(   1225.0,    1585.0,    2457.0,    2098.0);\n\tconst vec4 r = vec4(   1112.0,     367.0,      92.0,     265.0);\n\tconst vec4 a = vec4(   3423.0,    2646.0,    1707.0,    1999.0);\n\tconst vec4 m = vec4(4194287.0, 4194277.0, 4194191.0, 4194167.0);\n\n\tvec4 beta = floor(n / q);\n\tvec4 p = a * (n - beta * q) - beta * r;\n\tbeta = (sign(-p) + vec4(1.0)) * vec4(0.5) * m;\n\tn = (p + beta);\n\n\treturn fract(dot(n / m, vec4(1.0, -1.0, 1.0, -1.0)));\n}\n\nvec3 randomSphere( inout vec4 seed ) {\n  vec3 v;\n  for ( int i = 0; i < 10; i ++ ) {\n    v = vec3(\n      GPURnd( seed ),\n      GPURnd( seed ),\n      GPURnd( seed )\n    ) * 2.0 - 1.0;\n    if ( length( v ) < 1.0 ) { break; }\n  }\n  return v;\n}\n\nvec2 randomCircle( inout vec4 seed ) {\n  vec2 v;\n  for ( int i = 0; i < 10; i ++ ) {\n    v = vec2(\n      GPURnd( seed ),\n      GPURnd( seed )\n    ) * 2.0 - 1.0;\n    if ( length( v ) < 1.0 ) { break; }\n  }\n  return v;\n}\n\nvec3 randomBox( inout vec4 seed ) {\n  vec3 v;\n  v = vec3(\n    GPURnd( seed ),\n    GPURnd( seed ),\n    GPURnd( seed )\n  ) * 2.0 - 1.0;\n  return v;\n}\n\n// ------\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 puv = vec2( ( floor( gl_FragCoord.x / particlePixels ) * particlePixels + 0.5 ) / resolution.x, uv.y );\n  float number = ( ( gl_FragCoord.x - 0.5 ) / particlePixels ) + ( ( gl_FragCoord.y - 0.5 ) * particlesSqrt );\n  float mode = mod( gl_FragCoord.x, particlePixels );\n  vec2 dpix = vec2( 1.0 ) / resolution;\n\n  vec4 seed = texture2D( textureRandom, puv );\n  GPURnd( seed );\n\n  vec4 pos = texture2D( textureReturn, puv );\n  vec4 vel = texture2D( textureReturn, puv + dpix * vec2( 1.0, 0.0 ) );\n  vec4 rot = texture2D( textureReturn, puv + dpix * vec2( 2.0, 0.0 ) );\n\n  float dt = deltaTime;\n    \n  float timing = number / particlesSqrt / particlesSqrt * frames / PARTICLE_LIFE_SPEED;\n  float timingI = floor( timing );\n  float timingF = fract( timing );\n  if ( timingI == mod( frame, frames / PARTICLE_LIFE_SPEED ) ) {\n    pos.xyz = 3.0 * randomSphere( seed );\n    pos.w = 1.0;\n\n    vel.xyz = 1.0 * randomSphere( seed );\n    vel.w = pow( GPURnd( seed ), 6.0 );\n\n    if ( vel.w < 0.2 ) { pos.xyz *= 3.0; }\n\n    rot = vec4(\n      6.0 * GPURnd( seed ),\n      6.0 * GPURnd( seed ),\n      20.0 * ( GPURnd( seed ) - 0.5 ),\n      20.0 * ( GPURnd( seed ) - 0.5 )\n    );\n\n    dt = deltaTime * ( 1.0 - timingF );\n  }\n\n  vel.xyz += ( 0.2 < vel.w ? 1E2 : 4E1 ) * dt * vec3(\n    snoise( vec4( pos.xyz * 0.37 + 61.51 + 0.1 * sin( 2.0 * PI * time ), 20.04 ) ),\n    snoise( vec4( pos.xyz * 0.37 + 15.31 + 0.1 * sin( 2.0 * PI * time ), 41.21 ) ),\n    snoise( vec4( pos.xyz * 0.37 + 28.79 + 0.1 * sin( 2.0 * PI * time ), 32.95 ) )\n  );\n  if ( 0.2 < vel.w ) { vel.xyz += -10.0 * pos.xyz * dt; }\n\n  pos.xyz += vel.xyz * dt;\n  pos.w -= dt * PARTICLE_LIFE_SPEED;\n\n  if ( 0.2 < vel.w ) { \n    pos.yz = rotate2D( 6.0 * dt ) * pos.yz;\n    pos.zx = rotate2D( 4.0 * dt ) * pos.zx;\n    vel.yz = rotate2D( 6.0 * dt ) * vel.yz;\n    vel.zx = rotate2D( 4.0 * dt ) * vel.zx;\n  }\n\n  rot.xy += dt * rot.zw;\n\n  gl_FragColor = (\n    mode < 1.0 ? pos :\n    mode < 2.0 ? vel :\n    rot\n  );\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func() {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('textureReturn', glCatPath.fb("particlesComputeReturn").texture, 0);
      glCat.uniformTexture('textureRandom', textureRandom, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  particlesShadow: {
    width: 1024,
    height: 1024,
    vert: "#define GLSLIFY 1\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nattribute vec3 vuv;\n\nvarying vec3 vPos;\nvarying vec3 vNor;\nvarying float vLife;\nvarying vec2 vShadowCoord;\n\nuniform vec2 resolution;\nuniform vec2 resolutionPcompute;\nuniform vec3 cameraPos;\nuniform float cameraRot;\nuniform float cameraFov;\nuniform float vertsPerParticle;\nuniform mat4 matP;\nuniform mat4 matV;\nuniform mat4 matPL;\nuniform mat4 matVL;\n\nuniform sampler2D texturePcompute;\nuniform sampler2D textureOctPos;\nuniform sampler2D textureOctNor;\n\n// ------\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvoid main() {\n  vec2 puv = ( vuv.xy + 0.5 ) / resolutionPcompute;\n  vec2 dppix = vec2( 1.0 ) / resolutionPcompute;\n\n  vec4 pos = texture2D( texturePcompute, puv );\n  vec4 vel = texture2D( texturePcompute, puv + dppix * vec2( 1.0, 0.0 ) );\n  vec4 rot = texture2D( texturePcompute, puv + dppix * vec2( 2.0, 0.0 ) );\n\n  vec3 octPos = texture2D( textureOctPos, vec2( ( vuv.z + 0.5 ) / vertsPerParticle, 0.5 ) ).xyz;\n  vec3 octNor = texture2D( textureOctNor, vec2( ( vuv.z + 0.5 ) / vertsPerParticle, 0.5 ) ).xyz;\n\n  octPos.yz = rotate2D( rot.x ) * octPos.yz;\n  octPos.zx = rotate2D( rot.y ) * octPos.zx;\n  octNor.yz = rotate2D( rot.x ) * octNor.yz;\n  octNor.zx = rotate2D( rot.y ) * octNor.zx;\n\n  octPos.xyz *= 0.5 * (\n    vel.w * sin( PI * pos.w ) *\n    ( 1.0 - exp( -length( cameraPos - pos.xyz ) ) )\n  );\n  pos.xyz += octPos.xyz;\n\n  vPos = pos.xyz;\n  vNor = octNor.xyz;\n  vLife = pos.w;\n\n  vec4 posFromLight = matPL * matVL * vec4( pos.xyz, 1.0 );\n  vShadowCoord = posFromLight.xy / posFromLight.w * 0.5 + 0.5;\n\n  vec4 outPos = matP * matV * vec4( pos.xyz, 1.0 );\n  gl_Position = outPos;\n}",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nvarying float vLife;\nvarying vec3 vPos;\nuniform vec3 lightPos;\n\nuniform float cameraNear;\nuniform float cameraFar;\n\n// ------\n\nvoid main() {\n  if ( vLife <= 0.0 ) { discard; }\n\n  gl_FragColor = vec4( length( vPos - lightPos ), 0.0, 0.0, 1.0 );\n}",
    framebuffer: true,
    float: true,
    clear: [0.0, 0.0, 0.0, 1.0],
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    func: function func() {
      glCat.attribute('vuv', vboParticle, 3);
      glCat.uniformMatrix4fv('matV', matVL);
      glCat.uniformMatrix4fv('matP', matPL);
      glCat.uniform2fv('resolutionPcompute', [particlesSqrt * particlePixels, particlesSqrt]);
      glCat.uniformTexture('texturePcompute', glCatPath.fb("particlesCompute").texture, 0);
      glCat.uniformTexture('textureOctPos', textureOctPos, 2);
      glCat.uniformTexture('textureOctNor', textureOctNor, 3);
      gl.drawArrays(gl.TRIANGLES, 0, particles * vertsPerParticle);
    }
  },

  particlesRender: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nattribute vec3 vuv;\n\nvarying vec3 vPos;\nvarying vec3 vNor;\nvarying float vLife;\nvarying vec2 vShadowCoord;\n\nuniform vec2 resolution;\nuniform vec2 resolutionPcompute;\nuniform vec3 cameraPos;\nuniform float cameraRot;\nuniform float cameraFov;\nuniform float vertsPerParticle;\nuniform mat4 matP;\nuniform mat4 matV;\nuniform mat4 matPL;\nuniform mat4 matVL;\n\nuniform sampler2D texturePcompute;\nuniform sampler2D textureOctPos;\nuniform sampler2D textureOctNor;\n\n// ------\n\nmat2 rotate2D( float _t ) {\n  return mat2( cos( _t ), sin( _t ), -sin( _t ), cos( _t ) );\n}\n\nvoid main() {\n  vec2 puv = ( vuv.xy + 0.5 ) / resolutionPcompute;\n  vec2 dppix = vec2( 1.0 ) / resolutionPcompute;\n\n  vec4 pos = texture2D( texturePcompute, puv );\n  vec4 vel = texture2D( texturePcompute, puv + dppix * vec2( 1.0, 0.0 ) );\n  vec4 rot = texture2D( texturePcompute, puv + dppix * vec2( 2.0, 0.0 ) );\n\n  vec3 octPos = texture2D( textureOctPos, vec2( ( vuv.z + 0.5 ) / vertsPerParticle, 0.5 ) ).xyz;\n  vec3 octNor = texture2D( textureOctNor, vec2( ( vuv.z + 0.5 ) / vertsPerParticle, 0.5 ) ).xyz;\n\n  octPos.yz = rotate2D( rot.x ) * octPos.yz;\n  octPos.zx = rotate2D( rot.y ) * octPos.zx;\n  octNor.yz = rotate2D( rot.x ) * octNor.yz;\n  octNor.zx = rotate2D( rot.y ) * octNor.zx;\n\n  octPos.xyz *= 0.5 * (\n    vel.w * sin( PI * pos.w ) *\n    ( 1.0 - exp( -length( cameraPos - pos.xyz ) ) )\n  );\n  pos.xyz += octPos.xyz;\n\n  vPos = pos.xyz;\n  vNor = octNor.xyz;\n  vLife = pos.w;\n\n  vec4 posFromLight = matPL * matVL * vec4( pos.xyz, 1.0 );\n  vShadowCoord = posFromLight.xy / posFromLight.w * 0.5 + 0.5;\n\n  vec4 outPos = matP * matV * vec4( pos.xyz, 1.0 );\n  gl_Position = outPos;\n}",
    frag: "#define PARTICLE_LIFE_SPEED 2.0\n\n#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n\n// ------\n\n#extension GL_EXT_draw_buffers : require\nprecision highp float;\n#define GLSLIFY 1\n\nvarying vec3 vPos;\nvarying vec3 vNor;\nvarying float vLife;\nvarying vec2 vShadowCoord;\n\nuniform vec3 color;\nuniform vec3 cameraPos;\nuniform float cameraNear;\nuniform float cameraFar;\nuniform vec3 lightPos;\n\nuniform sampler2D textureShadow;\n\n// ------\n\nfloat shadow( float d ) {\n  float dc = length( vPos - lightPos );\n  float ret = 0.0;\n  for ( int iy = -1; iy <= 1; iy ++ ) {\n    for ( int ix = -1; ix <= 1; ix ++ ) {\n      vec2 uv = vShadowCoord + vec2( float( ix ), float ( iy ) ) * 0.001;\n      float proj = texture2D( textureShadow, uv ).x;\n      float bias = 1E-3 + ( 1.0 - d ) * 0.3;\n\n      float dif = step( ( dc - proj ), bias );\n      ret += dif / 9.0;\n    }\n  }\n  return ret;\n}\n\nvoid main() {\n  if ( vLife <= 0.0 ) { discard; }\n\n  float depth = length( vPos - cameraPos );\n  vec3 ld = normalize( vPos - lightPos );\n  vec3 dif = 150.0 * vec3( 1.0 ) * (\n    saturate( dot( -vNor, ld ) )\n    / pow( length( vPos - lightPos ), 2.0 )\n    * mix( 0.2, 1.0, shadow( dot( -vNor, ld ) ) )\n  );\n  vec3 rd = normalize( vPos - cameraPos );\n  vec3 spe = 0.0 * vec3( 1.0 ) * vec3(\n    pow( saturate( dot( -vNor, normalize( ld + rd ) ) ), 50.0 )\n    / pow( length( vPos - lightPos ), 2.0 )\n    * shadow( dot( -vNor, ld ) )\n  );\n\n  gl_FragData[ 0 ] = vec4( dif + spe, 1.0 );\n  gl_FragData[ 1 ] = vec4( depth, 0.0, 0.0, 1.0 );\n}",
    drawbuffers: 2,
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    func: function func() {
      glCat.attribute('vuv', vboParticle, 3);
      glCat.uniform2fv('resolutionPcompute', [particlesSqrt * particlePixels, particlesSqrt]);
      glCat.uniformTexture('texturePcompute', glCatPath.fb("particlesCompute").texture, 0);
      glCat.uniformTexture('textureShadow', glCatPath.fb("particlesShadow").texture, 1);
      glCat.uniformTexture('textureOctPos', textureOctPos, 2);
      glCat.uniformTexture('textureOctNor', textureOctNor, 3);
      gl.drawArrays(gl.TRIANGLES, 0, particles * vertsPerParticle);
    }
  },

  gauss: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define saturate(i) clamp(i,0.,1.)\n#define PI 3.14159265\n#define SAMPLES 20\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform bool isVert;\nuniform sampler2D sampler0;\n\nuniform float var;\n\nfloat gaussian( float _x, float _v ) {\n  return 1.0 / sqrt( 2.0 * PI * _v ) * exp( - _x * _x / 2.0 / _v );\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) ) / resolution;\n\n  vec3 sum = vec3( 0.0 );\n  for ( int i = -SAMPLES; i <= SAMPLES; i ++ ) {\n    vec2 v = saturate( uv + bv * float( i ) );\n    vec3 tex = texture2D( sampler0, v ).xyz;\n    float mul = gaussian( abs( float( i ) ), var );\n    sum += tex * mul;\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n}\n",
    clear: [0.0, 0.0, 0.0, 1.0],
    tempFb: glCat.createFloatFramebuffer(width, height),
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    func: function func(path, params) {
      if (params.width && params.height) {
        glCat.resizeFloatFramebuffer(path.tempFb, params.width, params.height);
      }

      gl.bindFramebuffer(gl.FRAMEBUFFER, path.tempFb.framebuffer);
      glCat.clear.apply(glCat, _toConsumableArray(path.clear));

      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('sampler0', params.input, 0);
      glCat.uniform1f('var', params.var);
      glCat.uniform1i('isVert', 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      gl.bindFramebuffer(gl.FRAMEBUFFER, params.framebuffer);

      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('sampler0', path.tempFb.texture, 0);
      glCat.uniform1f('var', params.var);
      glCat.uniform1i('isVert', 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  dof: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define BOKEH 20.0\n#define BOKEH_MAX 3.0\n#define FOG 0.01\n#define SAMPLES 4\n#define SAMPLE_INTERVAL 4.0\n#define R_SAMPLES 6\n#define R_INTERVAL 1.0\n#define T_SAMPLES 6\n\n#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,j) floor((i)/(j))*(j)\n#define PI 3.14159265\n#define TAU 6.28318531\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D sampler0;\nuniform sampler2D samplerPreDof;\nuniform sampler2D samplerDepth;\nuniform vec4 bgColor;\nuniform float focus;\n\nfloat gaussian( float _x, float _v ) {\n  return 1.0 / sqrt( 2.0 * PI * _v ) * exp( - _x * _x / 2.0 / _v );\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  vec3 sum = V.xxx;\n  vec3 ccol = vec3( 0.0 );\n  float clen = 1E9;\n  for ( int ir = 0; ir < R_SAMPLES; ir ++ ) {\n    for ( int it = 0; it < T_SAMPLES; it ++ ) {\n      float theta = TAU * float( it ) / float( T_SAMPLES );\n      vec2 delta = R_INTERVAL * float( ir ) * vec2( cos( theta ), sin( theta ) );\n      bool center = ir == 0;\n      vec2 v = saturate( uv + SAMPLE_INTERVAL * delta / resolution );\n\n      float len = texture2D( samplerDepth, v ).x;\n      float crate = smoothstep( 0.0, 1.0, len - clen );\n      len = mix( len, clen, crate );\n\n      float gauss = min( BOKEH * abs( 1.0 / focus - 1.0 / len ), BOKEH_MAX );\n      float mul = mix(\n        center ? 1.0 : 0.0,\n        gaussian( abs( delta.x ), gauss ) * gaussian( abs( delta.y ), gauss ),\n        saturate( gauss )\n      );\n\n      vec3 tex = mix(\n        texture2D( samplerPreDof, v ),\n        texture2D( sampler0, v ),\n        smoothstep( 0.0, 0.2, mul )\n      ).xyz;\n      vec3 col = mix(\n        mix( bgColor.xyz, tex, exp( -len * FOG ) ),\n        ccol,\n        crate\n      );\n\n      sum += col * saturate( mul );\n\n      if ( center ) {\n        clen = len;\n        ccol = col;\n        break;\n      }\n    }\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n}\n",
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1f('focus', auto('focus'));
      glCat.uniformTexture('samplerDry', params.dry, 0);
      glCat.uniformTexture('samplerPreDof', params.predof, 1);
      glCat.uniformTexture('samplerDepth', params.depth, 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  "Gowrock - bloom": {
    width: width / 4.0,
    height: height / 4.0,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define V vec2(0.,1.)\n#define saturate(i) clamp(i,0.,1.)\n#define PI 3.14159265\n#define SAMPLES 20\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform bool isVert;\nuniform sampler2D sampler0;\nuniform sampler2D samplerDry;\n\nuniform float gaussVar;\n\nfloat gaussian( float _x, float _v ) {\n  return 1.0 / sqrt( 2.0 * PI * _v ) * exp( - _x * _x / 2.0 / _v );\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) ) / resolution;\n\n  vec3 sum = V.xxx;\n  for ( int i = -SAMPLES; i <= SAMPLES; i ++ ) {\n    vec2 v = saturate( uv + bv * float( i ) );\n    vec3 tex = texture2D( sampler0, v ).xyz;\n    float mul = gaussian( abs( float( i ) ), gaussVar );\n    sum += tex * mul;\n  }\n\n  gl_FragColor = vec4( sum, 1.0 );\n}\n",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    tempFb: glCat.createFloatFramebuffer(width / 4.0, height / 4.0),
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      for (var i = 0; i < 3; i++) {
        var gaussVar = [5.0, 15.0, 40.0][i];
        gl.bindFramebuffer(gl.FRAMEBUFFER, _p.tempFb.framebuffer);
        glCat.clear.apply(glCat, _toConsumableArray(_p.clear));

        glCat.attribute('p', vboQuad, 2);
        glCat.uniform1i('isVert', false);
        glCat.uniform1f('gaussVar', gaussVar);
        glCat.uniformTexture('sampler0', params.input, 0);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        gl.bindFramebuffer(gl.FRAMEBUFFER, params.framebuffer);

        glCat.attribute('p', vboQuad, 2);
        glCat.uniform1i('isVert', true);
        glCat.uniform1f('gaussVar', gaussVar);
        glCat.uniformTexture('sampler0', _p.tempFb.texture, 0);
        glCat.uniformTexture('samplerDry', params.input, 1);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      }
    }
  },

  bloomFinalize: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform sampler2D samplerDry;\nuniform sampler2D samplerWet;\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec3 dry = texture2D( samplerDry, uv ).xyz;\n  vec3 wet = texture2D( samplerWet, uv ).xyz;\n  gl_FragColor.xyz = (\n    dry +\n    max( vec3( 0.0 ), ( wet - 0.8 ) / 4.0 )\n  );\n  gl_FragColor.w = 1.0;\n}\n",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('samplerDry', params.dry, 0);
      glCat.uniformTexture('samplerWet', params.wet, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  おたくはすぐポストエフェクトを挿す: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define HUGE 9E16\n#define PI 3.14159265\n#define V vec3(0.,1.,-1.)\n#define saturate(i) clamp(i,0.,1.)\n#define lofi(i,m) (floor((i)/(m))*(m))\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float time;\nuniform vec2 resolution;\n\nuniform sampler2D sampler0;\n\n// ------\n\nvec3 barrel( float amp, vec2 uv ) {\n\tfloat corn = length( vec2( 0.5 ) );\n\tfloat a = min( 3.0 * sqrt( amp ), corn * PI );\n\tfloat zoom = corn / ( tan( corn * a ) + corn );\n\tvec2 p = saturate(\n    ( uv + normalize( uv - 0.5 ) * tan( length( uv - 0.5 ) * a ) ) * zoom +\n    0.5 * ( 1.0 - zoom )\n  );\n\treturn texture2D( sampler0, vec2( p.x, p.y ) ).xyz;\n}\n\n// ------\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n  vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / resolution.y;\n  float vig = 1.14 - length( p ) * 0.4;\n\n  vec3 tex = vec3( 0.0 );\n\n  for ( int i = 0; i < 10; i ++ ) {\n    float fi = float( i ) / 9.0;\n    vec3 a = saturate( vec3(\n      fi < 1.0 / 6.0 ? 1.0 : 1.0 - 3.0 * abs( 1.0 / 6.0 - fi ),\n      1.0 - 3.0 * abs( 1.0 / 2.0 - fi ),\n      5.0 / 6.0 < fi ? 1.0 : 1.0 - 3.0 * abs( 5.0 / 6.0 - fi )\n    ) ) / 10.0 * 3.0;\n    tex += a * barrel( 0.0 + 0.05 * fi, uv );\n  }\n\n  tex = mix(\n    vec3( 0.0 ),\n    tex,\n    vig\n  );\n\n  vec3 col = pow( saturate( tex.xyz ), vec3( 1.0 / 2.2 ) );\n  col = vec3(\n    smoothstep( -0.1, 1.1, col.x ),\n    smoothstep( 0.0, 1.0, col.y ),\n    smoothstep( -0.3, 1.3, col.z )\n  );\n\n  gl_FragColor = vec4( col, 1.0 );\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('sampler0', params.input, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  monitor: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define PI 3.14159265\n#define saturate(i) clamp(i,0.,1.)\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform float recoverBar;\nuniform float recoverClose;\nuniform float circleRadius;\nuniform float circleSpin;\nuniform float metaballRadius;\n\nuniform float time;\nuniform float frames;\nuniform vec2 resolution;\n\nuniform sampler2D samplerMonitorRecover;\n\nbool uvvalid( vec2 v ) { return abs( v.x - 0.5 ) < 0.5 && abs( v.y - 0.5 ) < 0.5; }\nvec2 uvflip( vec2 v ) { return vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * v; }\n\n// ------\n\nfloat v2random( vec2 co ) {\n    return fract( sin( dot( co.xy, vec2( 2.9898, 7.233 ) ) ) * 4838.5453 );\n}\n\n// ------\n\nfloat smin( float a, float b, float k ) {\n  float h = clamp( 0.5 + 0.5 * ( b - a ) / k, 0.0, 1.0 );\n  return mix( b, a, h ) - k * h * ( 1.0 - h );\n}\n\nvec3 lissajous( vec3 _m ) {\n  vec3 m = _m * PI * 2.0 * time;\n  return vec3(\n    sin( m.x ),\n    sin( m.y ),\n    sin( m.z )\n  );\n}\n\nfloat distFunc( vec3 p ) {\n  float ret = 1E9;\n  float k = 0.7;\n  ret = smin( ret, length( p - lissajous( vec3( 1.0, 2.0, 3.0 ) ) ) - metaballRadius, k );\n  ret = smin( ret, length( p - lissajous( vec3( 3.0, -1.0, -1.0 ) ) ) - metaballRadius, k );\n  ret = smin( ret, length( p - lissajous( vec3( -2.0, 3.0, -1.0 ) ) ) - metaballRadius, k );\n  ret = smin( ret, length( p - lissajous( vec3( 4.0, -3.0, -2.0 ) ) ) - metaballRadius, k );\n  ret = smin( ret, length( p - lissajous( vec3( 1.0, -4.0, 3.0 ) ) ) - metaballRadius, k );\n  ret = smin( ret, length( p - lissajous( vec3( -3.0, 1.0, 4.0 ) ) ) - metaballRadius, k );\n  return ret;\n}\n\nvec3 normalFunc( vec3 p ) {\n  vec2 d = vec2( 0.0, 1E-3 );\n  return normalize( vec3(\n    distFunc( p + d.yxx ) - distFunc( p - d.yxx ),\n    distFunc( p + d.xyx ) - distFunc( p - d.xyx ),\n    distFunc( p + d.xxy ) - distFunc( p - d.xxy )\n  ) );\n}\n\nfloat raymarch( vec2 p ) {\n  vec3 rd = normalize( vec3( p, -1.0 ) );\n  vec3 ro = vec3( 0.0, 0.0, 4.0 );\n  float rl = 1E-2;\n  vec3 rp = ro + rl * rd;\n\n  float dist = 0.0;\n  for ( int i = 0; i < 50; i ++ ) {\n    dist = distFunc( rp );\n    rl += dist * 0.8;\n    rp = ro + rl * rd;\n    if ( dist < 1E-3 || 10.0 < rl ) { break; }\n  }\n\n  if ( dist < 1E-2 ) {\n    vec3 n = normalFunc( rp );\n    return saturate( 0.3 + 0.7 * dot( n, normalize( vec3( 1.0 ) ) ) );\n  }\n  return 0.0;\n}\n\n// ------\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution;\n\n  float ret = 0.0;\n\n  // recovering...\n  if ( recoverClose < 0.9 ) {\n    vec2 barI = vec2( 0.4, 0.03 - 0.06 * recoverClose );\n    vec2 barOI = barI + 0.015;\n    vec2 barOO = barI + 0.02;\n\n    if ( all( lessThan( abs( uv - 0.5 ), barI ) ) ) {\n      float recovering = texture2D( samplerMonitorRecover, uvflip( uv ) ).x;\n      ret += uv.x < ( 0.1 + recoverBar * 0.8 ) ? 1.0 - recovering : recovering;\n    }\n\n    if (\n      any( lessThan( barOI, abs( uv - 0.5 ) ) )\n      && all( lessThan( abs( uv - 0.5 ), barOO ) )\n      && sin( 200.0 * ( uv.x - uv.y - 0.3 * time ) ) < 0.9\n    ) {\n      ret += 1.0;\n    }\n  }\n\n  // saint pepsi - winners circle\n  {\n    float layer = 90.0 * ( circleRadius - length( uv - 0.5 ) );\n    if ( 0.0 < circleRadius && 0.0 < layer && layer < 9.0 ) {\n      float layerI = floor( layer );\n      float layerF = layer - layerI;\n\n      float theta = ( atan( uv.y - 0.5, uv.x - 0.5 ) + PI ) / 2.0 / PI;\n      float vel = ( v2random( vec2( layerI, 3.155 ) ) - 0.5 );\n      float freq = 1.0 + floor( 64.0 * pow( v2random( vec2( layerI, 2.456 ) ), 2.0 ) );\n\n      float phase = fract( ( theta + vel * circleSpin ) * 3.0 ) * freq;\n      float phaseI = floor( phase );\n      float phaseF = fract( phase );\n\n      ret += 0.5 * (\n        smoothstep( 0.0, 0.1, layerF ) * smoothstep( 0.7, 0.6, layerF )\n        * v2random( vec2( layerI, phaseI ) ) < 0.5 ? 0.0 : 1.0\n      );\n    }\n  }\n\n  // metaball is fun\n  {\n    vec2 p = 12.0 * ( abs( uv - 0.5 ) - vec2( 0.40, 0.40 ) ) / ( 0.8 + 0.2 * saturate( metaballRadius ) );\n    if ( all( lessThan( abs( p ), vec2( 1.0 ) ) ) ) {\n      float rett = raymarch( p );\n\n      if ( any( lessThan( vec2( 0.97 ), abs( p ) ) ) ) {\n        rett = 1.0;\n      }\n\n      if (\n        0.7 < min( abs( p.x ), abs( p.y ) )\n        && 0.92 < max( abs( p.x ), abs( p.y ) )\n      ) {\n        rett = 1.0;\n      }\n\n      ret = mix( ret, rett, saturate( metaballRadius ) );\n    }\n  }\n\n  gl_FragColor = vec4( vec3( 1.0 ), ret );\n}\n",
    blend: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
    depthTest: false,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1f('recoverBar', auto("recoverBar"));
      glCat.uniform1f('recoverClose', auto("recoverClose"));
      glCat.uniform1f('circleRadius', auto("circleRadius"));
      glCat.uniform1f('circleSpin', auto("circleSpin"));
      glCat.uniform1f('metaballRadius', auto("metaballRadius"));
      glCat.uniformTexture('samplerMonitorRecover', textureMonitorRecover, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  motion: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define BLOCK_SIZE 8\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\n\nuniform sampler2D sampler0;\nuniform sampler2D samplerP;\n\n// ------\n\nvec3 rgb2yuv( vec3 rgb ) {\n  return vec3(\n      0.299 * rgb.x + 0.587 * rgb.y + 0.114 * rgb.z,\n    - 0.14713 * rgb.x - 0.28886 * rgb.y + 0.436 * rgb.z + 0.5,\n      0.615 * rgb.x - 0.51499 * rgb.y - 0.10001 * rgb.z + 0.5\n  );\n}\n\nvec3 yuv2rgb( vec3 yuv ) {\n  return vec3(\n    yuv.x + 1.13983 * yuv.z,\n    yuv.x - 0.39465 * yuv.y - 0.58060 * yuv.z,\n    yuv.x + 2.03211 * yuv.y\n  );\n}\n\nvoid main() {\n  vec2 currOrig = 0.5 + floor( gl_FragCoord.xy / float( BLOCK_SIZE ) ) * float( BLOCK_SIZE );\n  \n  vec4 sum = vec4( 0.0 );\n\n  for ( int iy = 0; iy < BLOCK_SIZE; iy ++ ) {\n    for ( int ix = 0; ix < BLOCK_SIZE; ix ++ ) {\n      vec2 pDelta = vec2( float( ix ), float( iy ) );\n\n      vec2 prevUv = ( gl_FragCoord.xy + pDelta - float( BLOCK_SIZE / 2 ) ) / resolution;\n      vec2 currUv = ( currOrig + pDelta ) / resolution;\n\n      vec3 prevTex = rgb2yuv( texture2D( samplerP, prevUv ).xyz );\n      vec3 currTex = rgb2yuv( texture2D( sampler0, currUv ).xyz );\n\n      sum += vec4(\n        ( currTex - prevTex ),\n        pow( length( currTex - prevTex ), 2.0 )\n      ) / float( BLOCK_SIZE * BLOCK_SIZE );\n    }\n  }\n\n  gl_FragColor = sum;\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniformTexture('sampler0', params.input, 0);
      glCat.uniformTexture('samplerP', params.prev, 1);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  },

  motionSel: {
    width: width,
    height: height,
    vert: "#define GLSLIFY 1\nattribute vec2 p;\n\nvoid main() {\n  gl_Position = vec4( p, 0.0, 1.0 );\n}\n",
    frag: "#define BLOCK_SIZE 8\n\n// ------\n\nprecision highp float;\n#define GLSLIFY 1\n\nuniform vec2 resolution;\nuniform float threshold;\n\nuniform sampler2D samplerMotion;\nuniform sampler2D samplerDry;\nuniform sampler2D samplerMosh;\n\n// ------\n\nvec3 yuv2rgb( vec3 yuv ) {\n  return vec3(\n    yuv.x + 1.13983 * yuv.z,\n    yuv.x - 0.39465 * yuv.y - 0.58060 * yuv.z,\n    yuv.x + 2.03211 * yuv.y\n  );\n}\n\nvoid main() {\n  vec2 uv = floor( gl_FragCoord.xy ) / resolution;\n  vec2 orig = 0.5 + floor( gl_FragCoord.xy / float( BLOCK_SIZE ) ) * float( BLOCK_SIZE );\n\n  if ( threshold != 0.0 ) {\n    float minV = 9E9;\n    vec2 minP = vec2( 0.0 );\n    vec3 minC = vec3( 0.0 );\n\n    for ( int iy = 0; iy < BLOCK_SIZE; iy ++ ) {\n      for ( int ix = 0; ix < BLOCK_SIZE; ix ++ ) {\n        vec2 pDelta = vec2( float( ix ), float( iy ) );\n\n        vec2 currUv = ( orig + pDelta ) / resolution;\n\n        vec4 tex = texture2D( samplerMotion, currUv );\n        float com = tex.w;\n        if ( !( ix == BLOCK_SIZE / 2 && iy == BLOCK_SIZE / 2 ) ) {\n          com += 1E-4;\n        }\n\n        if ( com < minV ) {\n          minV = com;\n          minP = vec2( float( ix ), float( iy ) ) - float( BLOCK_SIZE / 2 );\n          minC = tex.xyz;\n        }\n      }\n    }\n\n    if ( minV < threshold ) {\n      vec3 tex = texture2D( samplerMosh, ( gl_FragCoord.xy + minP ) / resolution ).xyz;\n      tex += yuv2rgb( minC );\n      gl_FragColor = vec4( tex, 1.0 );\n      return;\n    }\n  }\n\n  gl_FragColor = texture2D( samplerDry, uv );\n  \n  // float mCol = max( gl_FragColor.x, max( gl_FragColor.y, gl_FragColor.z ) );\n  // if ( mCol < 0.1 + 1.0 * smoothstep( 0.9, 1.0, time ) ) {\n  //   gl_FragColor = texture2D( textureImage, vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * uv );\n  // }\n}",
    blend: [gl.ONE, gl.ONE],
    clear: [0.0, 0.0, 0.0, 0.0],
    framebuffer: true,
    float: true,
    func: function func(_p, params) {
      glCat.attribute('p', vboQuad, 2);
      glCat.uniform1f('threshold', 0.1 * auto("moshThreshold"));
      glCat.uniformTexture('samplerDry', params.dry, 0);
      glCat.uniformTexture('samplerMosh', params.mosh, 1);
      glCat.uniformTexture('samplerMotion', glCatPath.fb("motion").texture, 2);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }
});

// ------

var updateUI = function updateUI() {
  var now = new Date();
  var deadline = new Date(2018, 0, 19, 0, 0);

  divCountdown.innerText = "Deadline: " + Math.floor((deadline - now) / 1000);
};

// ------

var update = function update() {
  if (automaton.time === 0) {
    (0, _xorshift2.default)(347189057829056);
  }

  if (!tweak.checkbox('play', { value: true })) {
    setTimeout(update, 10);
    return;
  }

  textureRandomUpdate(textureRandom);

  updateUI();

  updateMatrices();

  automaton.update();

  cameraPos = [auto("cameraX"), auto("cameraY"), auto("cameraZ")];
  cameraTar = [auto("cameraTX"), auto("cameraTY"), auto("cameraTZ")];
  cameraRot = auto("cameraRot");

  glCatPath.begin();

  glCatPath.render("こんにちは");

  // glCatPath.render( "monitor", { target: glCatPath.fb( "こんにちは" ) } );

  glCatPath.render("particlesComputeReturn");
  glCatPath.render("particlesCompute");
  glCatPath.render("particlesShadow");
  glCatPath.render("particlesRender", {
    target: glCatPath.fb("こんにちは")
  });

  glCatPath.render("gauss", {
    target: framebufferPreDof,
    input: glCatPath.fb("こんにちは").textures[0],
    width: width,
    height: height,
    var: 5.0
  });

  glCatPath.render("dof", {
    dry: glCatPath.fb("こんにちは").textures[0],
    predof: framebufferPreDof.texture,
    depth: glCatPath.fb("こんにちは").textures[1]
  });

  glCatPath.render("Gowrock - bloom", {
    input: framebufferPreDof.texture
  });
  glCatPath.render("bloomFinalize", {
    dry: glCatPath.fb("dof").texture,
    wet: glCatPath.fb("Gowrock - bloom").texture
  });

  glCatPath.render("おたくはすぐポストエフェクトを挿す", {
    input: glCatPath.fb("bloomFinalize").texture
  });

  glCatPath.render("monitor", {
    target: glCatPath.fb("おたくはすぐポストエフェクトを挿す")
  });

  glCatPath.render("motion", {
    input: glCatPath.fb("おたくはすぐポストエフェクトを挿す").texture,
    prev: framebufferMotionPrev.texture
  });
  glCatPath.render("motionSel", {
    dry: glCatPath.fb("おたくはすぐポストエフェクトを挿す").texture,
    mosh: framebufferMotionMosh.texture
  });
  glCatPath.render("return", {
    target: framebufferMotionMosh,
    input: glCatPath.fb("motionSel").texture,
    width: width,
    height: height
  });
  glCatPath.render("return", {
    target: glCatPath.nullFb,
    input: glCatPath.fb("motionSel").texture,
    width: width,
    height: height
  });

  glCatPath.render("return", {
    target: framebufferMotionPrev,
    input: glCatPath.fb("おたくはすぐポストエフェクトを挿す").texture,
    width: width,
    height: height
  });

  glCatPath.end();

  init = false;
  totalFrames++;

  if (tweak.checkbox('save', { value: false })) {
    saveFrame();
  }

  requestAnimationFrame(update);
};

// ------

(0, _step2.default)({
  0: function _(done) {
    update();
  }
});

window.addEventListener('keydown', function (_e) {
  if (_e.which === 27) {
    tweak.checkbox('play', { set: false });
  }
});

window.addEventListener('mousemove', function (event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
});

},{"./lib/catmath":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/catmath.js","./lib/glcat":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/glcat.js","./lib/glcat-path-gui":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/glcat-path-gui.js","./lib/step":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/step.js","./lib/tweak":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/tweak.js","./lib/xorshift":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/lib/xorshift.js","./monitor-recover":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/monitor-recover.js","./octahedron":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/octahedron.js","assert":"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/node_modules/assert/assert.js"}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/monitor-recover.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var canvas = document.createElement('canvas');
var canvasSize = 1024;
canvas.width = canvasSize;
canvas.height = canvasSize;

var context = canvas.getContext('2d');
context.textAlign = 'center';
context.textBaseline = 'middle';
context.font = '900 ' + canvasSize / 20.0 + 'px Times New Roman';

context.fillStyle = '#000';
context.fillRect(0, 0, canvasSize, canvasSize);

context.fillStyle = '#fff';
context.fillText("R  E  C  O  V  E  R  I  N  G", canvasSize / 2, canvasSize / 2);

exports.default = canvas;

},{}],"/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/octahedron.js":[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var octahedron = function octahedron(_div) {
  var pos = [];
  var nor = [];

  for (var ii = 0; ii < 2; ii++) {
    for (var iq = 0; iq < 4; iq++) {
      for (var iy = 0; iy < _div + 1; iy++) {
        for (var ix = 0; ix < iy + 1; ix++) {
          var lat0 = (ii * 2.0 + iy / (_div + 1)) * Math.PI / 2.0;
          var lat1 = (ii * 2.0 + (iy + 1) / (_div + 1)) * Math.PI / 2.0;

          var lon0 = (ii * 2.0 - 1.0) * ((ix - 1) / Math.max(1, iy) + iq) * Math.PI / 2.0;
          var lon1 = (ii * 2.0 - 1.0) * (ix / (iy + 1) + iq) * Math.PI / 2.0;
          var lon2 = (ii * 2.0 - 1.0) * (ix / Math.max(1, iy) + iq) * Math.PI / 2.0;
          var lon3 = (ii * 2.0 - 1.0) * ((ix + 1) / (iy + 1) + iq) * Math.PI / 2.0;

          if (ix !== 0) {
            var x1 = Math.sin(lat0) * Math.cos(lon0);pos.push(x1);
            var y1 = Math.cos(lat0);pos.push(y1);
            var z1 = Math.sin(lat0) * Math.sin(lon0);pos.push(z1);
            pos.push(1.0);

            var x2 = Math.sin(lat1) * Math.cos(lon1);pos.push(x2);
            var y2 = Math.cos(lat1);pos.push(y2);
            var z2 = Math.sin(lat1) * Math.sin(lon1);pos.push(z2);
            pos.push(1.0);

            var x3 = Math.sin(lat0) * Math.cos(lon2);pos.push(x3);
            var y3 = Math.cos(lat0);pos.push(y3);
            var z3 = Math.sin(lat0) * Math.sin(lon2);pos.push(z3);
            pos.push(1.0);

            {
              var x = x1 + x2 + x3;
              var y = y1 + y2 + y3;
              var z = z1 + z2 + z3;
              var l = Math.sqrt(x * x + y * y + z * z);

              for (var i = 0; i < 3; i++) {
                nor.push(x / l);
                nor.push(y / l);
                nor.push(z / l);
                nor.push(1.0);
              }
            }
          }

          {
            var _x = Math.sin(lat0) * Math.cos(lon2);pos.push(_x);
            var _y = Math.cos(lat0);pos.push(_y);
            var _z = Math.sin(lat0) * Math.sin(lon2);pos.push(_z);
            pos.push(1.0);

            var _x2 = Math.sin(lat1) * Math.cos(lon1);pos.push(_x2);
            var _y2 = Math.cos(lat1);pos.push(_y2);
            var _z2 = Math.sin(lat1) * Math.sin(lon1);pos.push(_z2);
            pos.push(1.0);

            var _x3 = Math.sin(lat1) * Math.cos(lon3);pos.push(_x3);
            var _y3 = Math.cos(lat1);pos.push(_y3);
            var _z3 = Math.sin(lat1) * Math.sin(lon3);pos.push(_z3);
            pos.push(1.0);

            {
              var _x4 = _x + _x2 + _x3;
              var _y4 = _y + _y2 + _y3;
              var _z4 = _z + _z2 + _z3;
              var _l = Math.sqrt(_x4 * _x4 + _y4 * _y4 + _z4 * _z4);

              for (var _i = 0; _i < 3; _i++) {
                nor.push(_x4 / _l);
                nor.push(_y4 / _l);
                nor.push(_z4 / _l);
                nor.push(1.0);
              }
            }
          }
        }
      }
    }
  }

  return {
    pos: pos,
    nor: nor
  };
};

exports.default = octahedron;

},{}]},{},["/Users/Yutaka/Dropbox/pro/_Projects/_eom/20180119/src/script/main.js"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNyYy9zY3JpcHQvbGliL2NhdG1hdGguanMiLCJzcmMvc2NyaXB0L2xpYi9nbGNhdC1wYXRoLWd1aS5qcyIsInNyYy9zY3JpcHQvbGliL2dsY2F0LXBhdGguanMiLCJzcmMvc2NyaXB0L2xpYi9nbGNhdC5qcyIsInNyYy9zY3JpcHQvbGliL3N0ZXAuanMiLCJzcmMvc2NyaXB0L2xpYi90d2Vhay5qcyIsInNyYy9zY3JpcHQvbGliL3hvcnNoaWZ0LmpzIiwic3JjL3NjcmlwdC9tYWluLmpzIiwic3JjL3NjcmlwdC9tb25pdG9yLXJlY292ZXIuanMiLCJzcmMvc2NyaXB0L29jdGFoZWRyb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDMWtCQTs7QUFFQSxJQUFJLFVBQVUsRUFBZDs7QUFFQTs7Ozs7QUFLQSxRQUFRLE1BQVIsR0FBaUIsVUFBRSxDQUFGLEVBQUssQ0FBTDtBQUFBLFNBQVksRUFBRSxHQUFGLENBQU8sVUFBRSxDQUFGLEVBQUssQ0FBTDtBQUFBLFdBQVksSUFBSSxF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QVY7QUFDOUMsZ0JBQUksTUFBSyxLQUFLLEdBQUwsQ0FBVSxJQUFWLENBQVQsQ0FBMkIsSUFBSSxJQUFKLENBQVUsR0FBVjtBQUMzQixnQkFBSSxNQUFLLEtBQUssR0FBTCxDQUFVLElBQVYsSUFBbUIsS0FBSyxHQUFMLENBQVUsSUFBVixDQUE1QixDQUE4QyxJQUFJLElBQUosQ0FBVSxHQUFWO0FBQzlDLGdCQUFJLElBQUosQ0FBVSxHQUFWOztBQUVBO0FBQ0Usa0JBQUksTUFBSSxLQUFLLEdBQUwsR0FBVSxHQUFsQjtBQUNBLGtCQUFJLE1BQUksS0FBSyxHQUFMLEdBQVUsR0FBbEI7QUFDQSxrQkFBSSxNQUFJLEtBQUssR0FBTCxHQUFVLEdBQWxCO0FBQ0Esa0JBQUksS0FBSSxLQUFLLElBQUwsQ0FBVyxNQUFJLEdBQUosR0FBUSxNQUFJLEdBQVosR0FBZ0IsTUFBSSxHQUEvQixDQUFSOztBQUVBLG1CQUFNLElBQUksS0FBSSxDQUFkLEVBQWlCLEtBQUksQ0FBckIsRUFBd0IsSUFBeEIsRUFBK0I7QUFDN0Isb0JBQUksSUFBSixDQUFVLE1BQUksRUFBZDtBQUNBLG9CQUFJLElBQUosQ0FBVSxNQUFJLEVBQWQ7QUFDQSxvQkFBSSxJQUFKLENBQVUsTUFBSSxFQUFkO0FBQ0Esb0JBQUksSUFBSixDQUFVLEdBQVY7QUFDRDtBQUNGO0FBQ0Y7QUFDRjtBQUNGO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPO0FBQ0wsU0FBSyxHQURBO0FBRUwsU0FBSztBQUZBLEdBQVA7QUFJRCxDQXRGRDs7a0JBd0ZlLFUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb21wYXJlIGFuZCBpc0J1ZmZlciB0YWtlbiBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2Jsb2IvNjgwZTllNWU0ODhmMjJhYWMyNzU5OWE1N2RjODQ0YTYzMTU5MjhkZC9pbmRleC5qc1xuLy8gb3JpZ2luYWwgbm90aWNlOlxuXG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5mdW5jdGlvbiBjb21wYXJlKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIHZhciB4ID0gYS5sZW5ndGg7XG4gIHZhciB5ID0gYi5sZW5ndGg7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV07XG4gICAgICB5ID0gYltpXTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkge1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBpZiAoeSA8IHgpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuICByZXR1cm4gMDtcbn1cbmZ1bmN0aW9uIGlzQnVmZmVyKGIpIHtcbiAgaWYgKGdsb2JhbC5CdWZmZXIgJiYgdHlwZW9mIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZ2xvYmFsLkJ1ZmZlci5pc0J1ZmZlcihiKTtcbiAgfVxuICByZXR1cm4gISEoYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyKTtcbn1cblxuLy8gYmFzZWQgb24gbm9kZSBhc3NlcnQsIG9yaWdpbmFsIG5vdGljZTpcblxuLy8gaHR0cDovL3dpa2kuY29tbW9uanMub3JnL3dpa2kvVW5pdF9UZXN0aW5nLzEuMFxuLy9cbi8vIFRISVMgSVMgTk9UIFRFU1RFRCBOT1IgTElLRUxZIFRPIFdPUksgT1VUU0lERSBWOCFcbi8vXG4vLyBPcmlnaW5hbGx5IGZyb20gbmFyd2hhbC5qcyAoaHR0cDovL25hcndoYWxqcy5vcmcpXG4vLyBDb3B5cmlnaHQgKGMpIDIwMDkgVGhvbWFzIFJvYmluc29uIDwyODBub3J0aC5jb20+XG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGEgY29weVxuLy8gb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGUgJ1NvZnR3YXJlJyksIHRvXG4vLyBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZVxuLy8gcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yXG4vLyBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEICdBUyBJUycsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTlxuLy8gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTlxuLy8gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbnZhciB1dGlsID0gcmVxdWlyZSgndXRpbC8nKTtcbnZhciBoYXNPd24gPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHBTbGljZSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBmdW5jdGlvbnNIYXZlTmFtZXMgPSAoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24gZm9vKCkge30ubmFtZSA9PT0gJ2Zvbyc7XG59KCkpO1xuZnVuY3Rpb24gcFRvU3RyaW5nIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xufVxuZnVuY3Rpb24gaXNWaWV3KGFycmJ1Zikge1xuICBpZiAoaXNCdWZmZXIoYXJyYnVmKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIGdsb2JhbC5BcnJheUJ1ZmZlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAodHlwZW9mIEFycmF5QnVmZmVyLmlzVmlldyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBBcnJheUJ1ZmZlci5pc1ZpZXcoYXJyYnVmKTtcbiAgfVxuICBpZiAoIWFycmJ1Zikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoYXJyYnVmIGluc3RhbmNlb2YgRGF0YVZpZXcpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAoYXJyYnVmLmJ1ZmZlciAmJiBhcnJidWYuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG4vLyAxLiBUaGUgYXNzZXJ0IG1vZHVsZSBwcm92aWRlcyBmdW5jdGlvbnMgdGhhdCB0aHJvd1xuLy8gQXNzZXJ0aW9uRXJyb3IncyB3aGVuIHBhcnRpY3VsYXIgY29uZGl0aW9ucyBhcmUgbm90IG1ldC4gVGhlXG4vLyBhc3NlcnQgbW9kdWxlIG11c3QgY29uZm9ybSB0byB0aGUgZm9sbG93aW5nIGludGVyZmFjZS5cblxudmFyIGFzc2VydCA9IG1vZHVsZS5leHBvcnRzID0gb2s7XG5cbi8vIDIuIFRoZSBBc3NlcnRpb25FcnJvciBpcyBkZWZpbmVkIGluIGFzc2VydC5cbi8vIG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IoeyBtZXNzYWdlOiBtZXNzYWdlLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdHVhbDogYWN0dWFsLFxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cGVjdGVkOiBleHBlY3RlZCB9KVxuXG52YXIgcmVnZXggPSAvXFxzKmZ1bmN0aW9uXFxzKyhbXlxcKFxcc10qKVxccyovO1xuLy8gYmFzZWQgb24gaHR0cHM6Ly9naXRodWIuY29tL2xqaGFyYi9mdW5jdGlvbi5wcm90b3R5cGUubmFtZS9ibG9iL2FkZWVlZWM4YmZjYzYwNjhiMTg3ZDdkOWZiM2Q1YmIxZDNhMzA4OTkvaW1wbGVtZW50YXRpb24uanNcbmZ1bmN0aW9uIGdldE5hbWUoZnVuYykge1xuICBpZiAoIXV0aWwuaXNGdW5jdGlvbihmdW5jKSkge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzKSB7XG4gICAgcmV0dXJuIGZ1bmMubmFtZTtcbiAgfVxuICB2YXIgc3RyID0gZnVuYy50b1N0cmluZygpO1xuICB2YXIgbWF0Y2ggPSBzdHIubWF0Y2gocmVnZXgpO1xuICByZXR1cm4gbWF0Y2ggJiYgbWF0Y2hbMV07XG59XG5hc3NlcnQuQXNzZXJ0aW9uRXJyb3IgPSBmdW5jdGlvbiBBc3NlcnRpb25FcnJvcihvcHRpb25zKSB7XG4gIHRoaXMubmFtZSA9ICdBc3NlcnRpb25FcnJvcic7XG4gIHRoaXMuYWN0dWFsID0gb3B0aW9ucy5hY3R1YWw7XG4gIHRoaXMuZXhwZWN0ZWQgPSBvcHRpb25zLmV4cGVjdGVkO1xuICB0aGlzLm9wZXJhdG9yID0gb3B0aW9ucy5vcGVyYXRvcjtcbiAgaWYgKG9wdGlvbnMubWVzc2FnZSkge1xuICAgIHRoaXMubWVzc2FnZSA9IG9wdGlvbnMubWVzc2FnZTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBnZXRNZXNzYWdlKHRoaXMpO1xuICAgIHRoaXMuZ2VuZXJhdGVkTWVzc2FnZSA9IHRydWU7XG4gIH1cbiAgdmFyIHN0YWNrU3RhcnRGdW5jdGlvbiA9IG9wdGlvbnMuc3RhY2tTdGFydEZ1bmN0aW9uIHx8IGZhaWw7XG4gIGlmIChFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSkge1xuICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHN0YWNrU3RhcnRGdW5jdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgLy8gbm9uIHY4IGJyb3dzZXJzIHNvIHdlIGNhbiBoYXZlIGEgc3RhY2t0cmFjZVxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoKTtcbiAgICBpZiAoZXJyLnN0YWNrKSB7XG4gICAgICB2YXIgb3V0ID0gZXJyLnN0YWNrO1xuXG4gICAgICAvLyB0cnkgdG8gc3RyaXAgdXNlbGVzcyBmcmFtZXNcbiAgICAgIHZhciBmbl9uYW1lID0gZ2V0TmFtZShzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICAgICAgdmFyIGlkeCA9IG91dC5pbmRleE9mKCdcXG4nICsgZm5fbmFtZSk7XG4gICAgICBpZiAoaWR4ID49IDApIHtcbiAgICAgICAgLy8gb25jZSB3ZSBoYXZlIGxvY2F0ZWQgdGhlIGZ1bmN0aW9uIGZyYW1lXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gc3RyaXAgb3V0IGV2ZXJ5dGhpbmcgYmVmb3JlIGl0IChhbmQgaXRzIGxpbmUpXG4gICAgICAgIHZhciBuZXh0X2xpbmUgPSBvdXQuaW5kZXhPZignXFxuJywgaWR4ICsgMSk7XG4gICAgICAgIG91dCA9IG91dC5zdWJzdHJpbmcobmV4dF9saW5lICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc3RhY2sgPSBvdXQ7XG4gICAgfVxuICB9XG59O1xuXG4vLyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3IgaW5zdGFuY2VvZiBFcnJvclxudXRpbC5pbmhlcml0cyhhc3NlcnQuQXNzZXJ0aW9uRXJyb3IsIEVycm9yKTtcblxuZnVuY3Rpb24gdHJ1bmNhdGUocywgbikge1xuICBpZiAodHlwZW9mIHMgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHMubGVuZ3RoIDwgbiA/IHMgOiBzLnNsaWNlKDAsIG4pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzO1xuICB9XG59XG5mdW5jdGlvbiBpbnNwZWN0KHNvbWV0aGluZykge1xuICBpZiAoZnVuY3Rpb25zSGF2ZU5hbWVzIHx8ICF1dGlsLmlzRnVuY3Rpb24oc29tZXRoaW5nKSkge1xuICAgIHJldHVybiB1dGlsLmluc3BlY3Qoc29tZXRoaW5nKTtcbiAgfVxuICB2YXIgcmF3bmFtZSA9IGdldE5hbWUoc29tZXRoaW5nKTtcbiAgdmFyIG5hbWUgPSByYXduYW1lID8gJzogJyArIHJhd25hbWUgOiAnJztcbiAgcmV0dXJuICdbRnVuY3Rpb24nICsgIG5hbWUgKyAnXSc7XG59XG5mdW5jdGlvbiBnZXRNZXNzYWdlKHNlbGYpIHtcbiAgcmV0dXJuIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5hY3R1YWwpLCAxMjgpICsgJyAnICtcbiAgICAgICAgIHNlbGYub3BlcmF0b3IgKyAnICcgK1xuICAgICAgICAgdHJ1bmNhdGUoaW5zcGVjdChzZWxmLmV4cGVjdGVkKSwgMTI4KTtcbn1cblxuLy8gQXQgcHJlc2VudCBvbmx5IHRoZSB0aHJlZSBrZXlzIG1lbnRpb25lZCBhYm92ZSBhcmUgdXNlZCBhbmRcbi8vIHVuZGVyc3Rvb2QgYnkgdGhlIHNwZWMuIEltcGxlbWVudGF0aW9ucyBvciBzdWIgbW9kdWxlcyBjYW4gcGFzc1xuLy8gb3RoZXIga2V5cyB0byB0aGUgQXNzZXJ0aW9uRXJyb3IncyBjb25zdHJ1Y3RvciAtIHRoZXkgd2lsbCBiZVxuLy8gaWdub3JlZC5cblxuLy8gMy4gQWxsIG9mIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zIG11c3QgdGhyb3cgYW4gQXNzZXJ0aW9uRXJyb3Jcbi8vIHdoZW4gYSBjb3JyZXNwb25kaW5nIGNvbmRpdGlvbiBpcyBub3QgbWV0LCB3aXRoIGEgbWVzc2FnZSB0aGF0XG4vLyBtYXkgYmUgdW5kZWZpbmVkIGlmIG5vdCBwcm92aWRlZC4gIEFsbCBhc3NlcnRpb24gbWV0aG9kcyBwcm92aWRlXG4vLyBib3RoIHRoZSBhY3R1YWwgYW5kIGV4cGVjdGVkIHZhbHVlcyB0byB0aGUgYXNzZXJ0aW9uIGVycm9yIGZvclxuLy8gZGlzcGxheSBwdXJwb3Nlcy5cblxuZnVuY3Rpb24gZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCBvcGVyYXRvciwgc3RhY2tTdGFydEZ1bmN0aW9uKSB7XG4gIHRocm93IG5ldyBhc3NlcnQuQXNzZXJ0aW9uRXJyb3Ioe1xuICAgIG1lc3NhZ2U6IG1lc3NhZ2UsXG4gICAgYWN0dWFsOiBhY3R1YWwsXG4gICAgZXhwZWN0ZWQ6IGV4cGVjdGVkLFxuICAgIG9wZXJhdG9yOiBvcGVyYXRvcixcbiAgICBzdGFja1N0YXJ0RnVuY3Rpb246IHN0YWNrU3RhcnRGdW5jdGlvblxuICB9KTtcbn1cblxuLy8gRVhURU5TSU9OISBhbGxvd3MgZm9yIHdlbGwgYmVoYXZlZCBlcnJvcnMgZGVmaW5lZCBlbHNld2hlcmUuXG5hc3NlcnQuZmFpbCA9IGZhaWw7XG5cbi8vIDQuIFB1cmUgYXNzZXJ0aW9uIHRlc3RzIHdoZXRoZXIgYSB2YWx1ZSBpcyB0cnV0aHksIGFzIGRldGVybWluZWRcbi8vIGJ5ICEhZ3VhcmQuXG4vLyBhc3NlcnQub2soZ3VhcmQsIG1lc3NhZ2Vfb3B0KTtcbi8vIFRoaXMgc3RhdGVtZW50IGlzIGVxdWl2YWxlbnQgdG8gYXNzZXJ0LmVxdWFsKHRydWUsICEhZ3VhcmQsXG4vLyBtZXNzYWdlX29wdCk7LiBUbyB0ZXN0IHN0cmljdGx5IGZvciB0aGUgdmFsdWUgdHJ1ZSwgdXNlXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwodHJ1ZSwgZ3VhcmQsIG1lc3NhZ2Vfb3B0KTsuXG5cbmZ1bmN0aW9uIG9rKHZhbHVlLCBtZXNzYWdlKSB7XG4gIGlmICghdmFsdWUpIGZhaWwodmFsdWUsIHRydWUsIG1lc3NhZ2UsICc9PScsIGFzc2VydC5vayk7XG59XG5hc3NlcnQub2sgPSBvaztcblxuLy8gNS4gVGhlIGVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBzaGFsbG93LCBjb2VyY2l2ZSBlcXVhbGl0eSB3aXRoXG4vLyA9PS5cbi8vIGFzc2VydC5lcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5lcXVhbCA9IGZ1bmN0aW9uIGVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPSBleHBlY3RlZCkgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQuZXF1YWwpO1xufTtcblxuLy8gNi4gVGhlIG5vbi1lcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgZm9yIHdoZXRoZXIgdHdvIG9iamVjdHMgYXJlIG5vdCBlcXVhbFxuLy8gd2l0aCAhPSBhc3NlcnQubm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQubm90RXF1YWwgPSBmdW5jdGlvbiBub3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPScsIGFzc2VydC5ub3RFcXVhbCk7XG4gIH1cbn07XG5cbi8vIDcuIFRoZSBlcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgYSBkZWVwIGVxdWFsaXR5IHJlbGF0aW9uLlxuLy8gYXNzZXJ0LmRlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5kZWVwRXF1YWwgPSBmdW5jdGlvbiBkZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgZmFsc2UpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcEVxdWFsJywgYXNzZXJ0LmRlZXBFcXVhbCk7XG4gIH1cbn07XG5cbmFzc2VydC5kZWVwU3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBkZWVwU3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoIV9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdkZWVwU3RyaWN0RXF1YWwnLCBhc3NlcnQuZGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBzdHJpY3QsIG1lbW9zKSB7XG4gIC8vIDcuMS4gQWxsIGlkZW50aWNhbCB2YWx1ZXMgYXJlIGVxdWl2YWxlbnQsIGFzIGRldGVybWluZWQgYnkgPT09LlxuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgJiYgaXNCdWZmZXIoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUoYWN0dWFsLCBleHBlY3RlZCkgPT09IDA7XG5cbiAgLy8gNy4yLiBJZiB0aGUgZXhwZWN0ZWQgdmFsdWUgaXMgYSBEYXRlIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBEYXRlIG9iamVjdCB0aGF0IHJlZmVycyB0byB0aGUgc2FtZSB0aW1lLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNEYXRlKGFjdHVhbCkgJiYgdXRpbC5pc0RhdGUoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGFjdHVhbC5nZXRUaW1lKCkgPT09IGV4cGVjdGVkLmdldFRpbWUoKTtcblxuICAvLyA3LjMgSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgUmVnRXhwIG9iamVjdCwgdGhlIGFjdHVhbCB2YWx1ZSBpc1xuICAvLyBlcXVpdmFsZW50IGlmIGl0IGlzIGFsc28gYSBSZWdFeHAgb2JqZWN0IHdpdGggdGhlIHNhbWUgc291cmNlIGFuZFxuICAvLyBwcm9wZXJ0aWVzIChgZ2xvYmFsYCwgYG11bHRpbGluZWAsIGBsYXN0SW5kZXhgLCBgaWdub3JlQ2FzZWApLlxuICB9IGVsc2UgaWYgKHV0aWwuaXNSZWdFeHAoYWN0dWFsKSAmJiB1dGlsLmlzUmVnRXhwKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuc291cmNlID09PSBleHBlY3RlZC5zb3VyY2UgJiZcbiAgICAgICAgICAgYWN0dWFsLmdsb2JhbCA9PT0gZXhwZWN0ZWQuZ2xvYmFsICYmXG4gICAgICAgICAgIGFjdHVhbC5tdWx0aWxpbmUgPT09IGV4cGVjdGVkLm11bHRpbGluZSAmJlxuICAgICAgICAgICBhY3R1YWwubGFzdEluZGV4ID09PSBleHBlY3RlZC5sYXN0SW5kZXggJiZcbiAgICAgICAgICAgYWN0dWFsLmlnbm9yZUNhc2UgPT09IGV4cGVjdGVkLmlnbm9yZUNhc2U7XG5cbiAgLy8gNy40LiBPdGhlciBwYWlycyB0aGF0IGRvIG5vdCBib3RoIHBhc3MgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnLFxuICAvLyBlcXVpdmFsZW5jZSBpcyBkZXRlcm1pbmVkIGJ5ID09LlxuICB9IGVsc2UgaWYgKChhY3R1YWwgPT09IG51bGwgfHwgdHlwZW9mIGFjdHVhbCAhPT0gJ29iamVjdCcpICYmXG4gICAgICAgICAgICAgKGV4cGVjdGVkID09PSBudWxsIHx8IHR5cGVvZiBleHBlY3RlZCAhPT0gJ29iamVjdCcpKSB7XG4gICAgcmV0dXJuIHN0cmljdCA/IGFjdHVhbCA9PT0gZXhwZWN0ZWQgOiBhY3R1YWwgPT0gZXhwZWN0ZWQ7XG5cbiAgLy8gSWYgYm90aCB2YWx1ZXMgYXJlIGluc3RhbmNlcyBvZiB0eXBlZCBhcnJheXMsIHdyYXAgdGhlaXIgdW5kZXJseWluZ1xuICAvLyBBcnJheUJ1ZmZlcnMgaW4gYSBCdWZmZXIgZWFjaCB0byBpbmNyZWFzZSBwZXJmb3JtYW5jZVxuICAvLyBUaGlzIG9wdGltaXphdGlvbiByZXF1aXJlcyB0aGUgYXJyYXlzIHRvIGhhdmUgdGhlIHNhbWUgdHlwZSBhcyBjaGVja2VkIGJ5XG4gIC8vIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgKGFrYSBwVG9TdHJpbmcpLiBOZXZlciBwZXJmb3JtIGJpbmFyeVxuICAvLyBjb21wYXJpc29ucyBmb3IgRmxvYXQqQXJyYXlzLCB0aG91Z2gsIHNpbmNlIGUuZy4gKzAgPT09IC0wIGJ1dCB0aGVpclxuICAvLyBiaXQgcGF0dGVybnMgYXJlIG5vdCBpZGVudGljYWwuXG4gIH0gZWxzZSBpZiAoaXNWaWV3KGFjdHVhbCkgJiYgaXNWaWV3KGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgIHBUb1N0cmluZyhhY3R1YWwpID09PSBwVG9TdHJpbmcoZXhwZWN0ZWQpICYmXG4gICAgICAgICAgICAgIShhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDMyQXJyYXkgfHxcbiAgICAgICAgICAgICAgIGFjdHVhbCBpbnN0YW5jZW9mIEZsb2F0NjRBcnJheSkpIHtcbiAgICByZXR1cm4gY29tcGFyZShuZXcgVWludDhBcnJheShhY3R1YWwuYnVmZmVyKSxcbiAgICAgICAgICAgICAgICAgICBuZXcgVWludDhBcnJheShleHBlY3RlZC5idWZmZXIpKSA9PT0gMDtcblxuICAvLyA3LjUgRm9yIGFsbCBvdGhlciBPYmplY3QgcGFpcnMsIGluY2x1ZGluZyBBcnJheSBvYmplY3RzLCBlcXVpdmFsZW5jZSBpc1xuICAvLyBkZXRlcm1pbmVkIGJ5IGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoYXMgdmVyaWZpZWRcbiAgLy8gd2l0aCBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwpLCB0aGUgc2FtZSBzZXQgb2Yga2V5c1xuICAvLyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSwgZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5XG4gIC8vIGNvcnJlc3BvbmRpbmcga2V5LCBhbmQgYW4gaWRlbnRpY2FsICdwcm90b3R5cGUnIHByb3BlcnR5LiBOb3RlOiB0aGlzXG4gIC8vIGFjY291bnRzIGZvciBib3RoIG5hbWVkIGFuZCBpbmRleGVkIHByb3BlcnRpZXMgb24gQXJyYXlzLlxuICB9IGVsc2UgaWYgKGlzQnVmZmVyKGFjdHVhbCkgIT09IGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSBlbHNlIHtcbiAgICBtZW1vcyA9IG1lbW9zIHx8IHthY3R1YWw6IFtdLCBleHBlY3RlZDogW119O1xuXG4gICAgdmFyIGFjdHVhbEluZGV4ID0gbWVtb3MuYWN0dWFsLmluZGV4T2YoYWN0dWFsKTtcbiAgICBpZiAoYWN0dWFsSW5kZXggIT09IC0xKSB7XG4gICAgICBpZiAoYWN0dWFsSW5kZXggPT09IG1lbW9zLmV4cGVjdGVkLmluZGV4T2YoZXhwZWN0ZWQpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9zLmFjdHVhbC5wdXNoKGFjdHVhbCk7XG4gICAgbWVtb3MuZXhwZWN0ZWQucHVzaChleHBlY3RlZCk7XG5cbiAgICByZXR1cm4gb2JqRXF1aXYoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNBcmd1bWVudHMob2JqZWN0KSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqZWN0KSA9PSAnW29iamVjdCBBcmd1bWVudHNdJztcbn1cblxuZnVuY3Rpb24gb2JqRXF1aXYoYSwgYiwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykge1xuICBpZiAoYSA9PT0gbnVsbCB8fCBhID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuICAvLyBpZiBvbmUgaXMgYSBwcmltaXRpdmUsIHRoZSBvdGhlciBtdXN0IGJlIHNhbWVcbiAgaWYgKHV0aWwuaXNQcmltaXRpdmUoYSkgfHwgdXRpbC5pc1ByaW1pdGl2ZShiKSlcbiAgICByZXR1cm4gYSA9PT0gYjtcbiAgaWYgKHN0cmljdCAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYSkgIT09IE9iamVjdC5nZXRQcm90b3R5cGVPZihiKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIHZhciBhSXNBcmdzID0gaXNBcmd1bWVudHMoYSk7XG4gIHZhciBiSXNBcmdzID0gaXNBcmd1bWVudHMoYik7XG4gIGlmICgoYUlzQXJncyAmJiAhYklzQXJncykgfHwgKCFhSXNBcmdzICYmIGJJc0FyZ3MpKVxuICAgIHJldHVybiBmYWxzZTtcbiAgaWYgKGFJc0FyZ3MpIHtcbiAgICBhID0gcFNsaWNlLmNhbGwoYSk7XG4gICAgYiA9IHBTbGljZS5jYWxsKGIpO1xuICAgIHJldHVybiBfZGVlcEVxdWFsKGEsIGIsIHN0cmljdCk7XG4gIH1cbiAgdmFyIGthID0gb2JqZWN0S2V5cyhhKTtcbiAgdmFyIGtiID0gb2JqZWN0S2V5cyhiKTtcbiAgdmFyIGtleSwgaTtcbiAgLy8gaGF2aW5nIHRoZSBzYW1lIG51bWJlciBvZiBvd25lZCBwcm9wZXJ0aWVzIChrZXlzIGluY29ycG9yYXRlc1xuICAvLyBoYXNPd25Qcm9wZXJ0eSlcbiAgaWYgKGthLmxlbmd0aCAhPT0ga2IubGVuZ3RoKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy90aGUgc2FtZSBzZXQgb2Yga2V5cyAoYWx0aG91Z2ggbm90IG5lY2Vzc2FyaWx5IHRoZSBzYW1lIG9yZGVyKSxcbiAga2Euc29ydCgpO1xuICBrYi5zb3J0KCk7XG4gIC8vfn5+Y2hlYXAga2V5IHRlc3RcbiAgZm9yIChpID0ga2EubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAoa2FbaV0gIT09IGtiW2ldKVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vZXF1aXZhbGVudCB2YWx1ZXMgZm9yIGV2ZXJ5IGNvcnJlc3BvbmRpbmcga2V5LCBhbmRcbiAgLy9+fn5wb3NzaWJseSBleHBlbnNpdmUgZGVlcCB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAga2V5ID0ga2FbaV07XG4gICAgaWYgKCFfZGVlcEVxdWFsKGFba2V5XSwgYltrZXldLCBzdHJpY3QsIGFjdHVhbFZpc2l0ZWRPYmplY3RzKSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gOC4gVGhlIG5vbi1lcXVpdmFsZW5jZSBhc3NlcnRpb24gdGVzdHMgZm9yIGFueSBkZWVwIGluZXF1YWxpdHkuXG4vLyBhc3NlcnQubm90RGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdERlZXBFcXVhbCA9IGZ1bmN0aW9uIG5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ25vdERlZXBFcXVhbCcsIGFzc2VydC5ub3REZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQubm90RGVlcFN0cmljdEVxdWFsID0gbm90RGVlcFN0cmljdEVxdWFsO1xuZnVuY3Rpb24gbm90RGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgdHJ1ZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwU3RyaWN0RXF1YWwnLCBub3REZWVwU3RyaWN0RXF1YWwpO1xuICB9XG59XG5cblxuLy8gOS4gVGhlIHN0cmljdCBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc3RyaWN0IGVxdWFsaXR5LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbi8vIGFzc2VydC5zdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5zdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIHN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCAhPT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICc9PT0nLCBhc3NlcnQuc3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG4vLyAxMC4gVGhlIHN0cmljdCBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciBzdHJpY3QgaW5lcXVhbGl0eSwgYXNcbi8vIGRldGVybWluZWQgYnkgIT09LiAgYXNzZXJ0Lm5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdFN0cmljdEVxdWFsID0gZnVuY3Rpb24gbm90U3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09PSBleHBlY3RlZCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJyE9PScsIGFzc2VydC5ub3RTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpIHtcbiAgaWYgKCFhY3R1YWwgfHwgIWV4cGVjdGVkKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChleHBlY3RlZCkgPT0gJ1tvYmplY3QgUmVnRXhwXScpIHtcbiAgICByZXR1cm4gZXhwZWN0ZWQudGVzdChhY3R1YWwpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAoYWN0dWFsIGluc3RhbmNlb2YgZXhwZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIElnbm9yZS4gIFRoZSBpbnN0YW5jZW9mIGNoZWNrIGRvZXNuJ3Qgd29yayBmb3IgYXJyb3cgZnVuY3Rpb25zLlxuICB9XG5cbiAgaWYgKEVycm9yLmlzUHJvdG90eXBlT2YoZXhwZWN0ZWQpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGV4cGVjdGVkLmNhbGwoe30sIGFjdHVhbCkgPT09IHRydWU7XG59XG5cbmZ1bmN0aW9uIF90cnlCbG9jayhibG9jaykge1xuICB2YXIgZXJyb3I7XG4gIHRyeSB7XG4gICAgYmxvY2soKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGVycm9yID0gZTtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59XG5cbmZ1bmN0aW9uIF90aHJvd3Moc2hvdWxkVGhyb3csIGJsb2NrLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICB2YXIgYWN0dWFsO1xuXG4gIGlmICh0eXBlb2YgYmxvY2sgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJsb2NrXCIgYXJndW1lbnQgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gIH1cblxuICBpZiAodHlwZW9mIGV4cGVjdGVkID09PSAnc3RyaW5nJykge1xuICAgIG1lc3NhZ2UgPSBleHBlY3RlZDtcbiAgICBleHBlY3RlZCA9IG51bGw7XG4gIH1cblxuICBhY3R1YWwgPSBfdHJ5QmxvY2soYmxvY2spO1xuXG4gIG1lc3NhZ2UgPSAoZXhwZWN0ZWQgJiYgZXhwZWN0ZWQubmFtZSA/ICcgKCcgKyBleHBlY3RlZC5uYW1lICsgJykuJyA6ICcuJykgK1xuICAgICAgICAgICAgKG1lc3NhZ2UgPyAnICcgKyBtZXNzYWdlIDogJy4nKTtcblxuICBpZiAoc2hvdWxkVGhyb3cgJiYgIWFjdHVhbCkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ01pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgdmFyIHVzZXJQcm92aWRlZE1lc3NhZ2UgPSB0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZyc7XG4gIHZhciBpc1Vud2FudGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIHV0aWwuaXNFcnJvcihhY3R1YWwpO1xuICB2YXIgaXNVbmV4cGVjdGVkRXhjZXB0aW9uID0gIXNob3VsZFRocm93ICYmIGFjdHVhbCAmJiAhZXhwZWN0ZWQ7XG5cbiAgaWYgKChpc1Vud2FudGVkRXhjZXB0aW9uICYmXG4gICAgICB1c2VyUHJvdmlkZWRNZXNzYWdlICYmXG4gICAgICBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHxcbiAgICAgIGlzVW5leHBlY3RlZEV4Y2VwdGlvbikge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgJ0dvdCB1bndhbnRlZCBleGNlcHRpb24nICsgbWVzc2FnZSk7XG4gIH1cblxuICBpZiAoKHNob3VsZFRocm93ICYmIGFjdHVhbCAmJiBleHBlY3RlZCAmJlxuICAgICAgIWV4cGVjdGVkRXhjZXB0aW9uKGFjdHVhbCwgZXhwZWN0ZWQpKSB8fCAoIXNob3VsZFRocm93ICYmIGFjdHVhbCkpIHtcbiAgICB0aHJvdyBhY3R1YWw7XG4gIH1cbn1cblxuLy8gMTEuIEV4cGVjdGVkIHRvIHRocm93IGFuIGVycm9yOlxuLy8gYXNzZXJ0LnRocm93cyhibG9jaywgRXJyb3Jfb3B0LCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC50aHJvd3MgPSBmdW5jdGlvbihibG9jaywgLypvcHRpb25hbCovZXJyb3IsIC8qb3B0aW9uYWwqL21lc3NhZ2UpIHtcbiAgX3Rocm93cyh0cnVlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuLy8gRVhURU5TSU9OISBUaGlzIGlzIGFubm95aW5nIHRvIHdyaXRlIG91dHNpZGUgdGhpcyBtb2R1bGUuXG5hc3NlcnQuZG9lc05vdFRocm93ID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3MoZmFsc2UsIGJsb2NrLCBlcnJvciwgbWVzc2FnZSk7XG59O1xuXG5hc3NlcnQuaWZFcnJvciA9IGZ1bmN0aW9uKGVycikgeyBpZiAoZXJyKSB0aHJvdyBlcnI7IH07XG5cbnZhciBvYmplY3RLZXlzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24gKG9iaikge1xuICB2YXIga2V5cyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKGhhc093bi5jYWxsKG9iaiwga2V5KSkga2V5cy5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIGtleXM7XG59O1xuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImlmICh0eXBlb2YgT2JqZWN0LmNyZWF0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAvLyBpbXBsZW1lbnRhdGlvbiBmcm9tIHN0YW5kYXJkIG5vZGUuanMgJ3V0aWwnIG1vZHVsZVxuICBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGluaGVyaXRzKGN0b3IsIHN1cGVyQ3Rvcikge1xuICAgIGN0b3Iuc3VwZXJfID0gc3VwZXJDdG9yXG4gICAgY3Rvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKHN1cGVyQ3Rvci5wcm90b3R5cGUsIHtcbiAgICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBjdG9yLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xufSBlbHNlIHtcbiAgLy8gb2xkIHNjaG9vbCBzaGltIGZvciBvbGQgYnJvd3NlcnNcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIHZhciBUZW1wQ3RvciA9IGZ1bmN0aW9uICgpIHt9XG4gICAgVGVtcEN0b3IucHJvdG90eXBlID0gc3VwZXJDdG9yLnByb3RvdHlwZVxuICAgIGN0b3IucHJvdG90eXBlID0gbmV3IFRlbXBDdG9yKClcbiAgICBjdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IGN0b3JcbiAgfVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0J1ZmZlcihhcmcpIHtcbiAgcmV0dXJuIGFyZyAmJiB0eXBlb2YgYXJnID09PSAnb2JqZWN0J1xuICAgICYmIHR5cGVvZiBhcmcuY29weSA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcuZmlsbCA9PT0gJ2Z1bmN0aW9uJ1xuICAgICYmIHR5cGVvZiBhcmcucmVhZFVJbnQ4ID09PSAnZnVuY3Rpb24nO1xufSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgZm9ybWF0UmVnRXhwID0gLyVbc2RqJV0vZztcbmV4cG9ydHMuZm9ybWF0ID0gZnVuY3Rpb24oZikge1xuICBpZiAoIWlzU3RyaW5nKGYpKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgb2JqZWN0cy5wdXNoKGluc3BlY3QoYXJndW1lbnRzW2ldKSk7XG4gICAgfVxuICAgIHJldHVybiBvYmplY3RzLmpvaW4oJyAnKTtcbiAgfVxuXG4gIHZhciBpID0gMTtcbiAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gIHZhciBsZW4gPSBhcmdzLmxlbmd0aDtcbiAgdmFyIHN0ciA9IFN0cmluZyhmKS5yZXBsYWNlKGZvcm1hdFJlZ0V4cCwgZnVuY3Rpb24oeCkge1xuICAgIGlmICh4ID09PSAnJSUnKSByZXR1cm4gJyUnO1xuICAgIGlmIChpID49IGxlbikgcmV0dXJuIHg7XG4gICAgc3dpdGNoICh4KSB7XG4gICAgICBjYXNlICclcyc6IHJldHVybiBTdHJpbmcoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVkJzogcmV0dXJuIE51bWJlcihhcmdzW2krK10pO1xuICAgICAgY2FzZSAnJWonOlxuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShhcmdzW2krK10pO1xuICAgICAgICB9IGNhdGNoIChfKSB7XG4gICAgICAgICAgcmV0dXJuICdbQ2lyY3VsYXJdJztcbiAgICAgICAgfVxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHg7XG4gICAgfVxuICB9KTtcbiAgZm9yICh2YXIgeCA9IGFyZ3NbaV07IGkgPCBsZW47IHggPSBhcmdzWysraV0pIHtcbiAgICBpZiAoaXNOdWxsKHgpIHx8ICFpc09iamVjdCh4KSkge1xuICAgICAgc3RyICs9ICcgJyArIHg7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciArPSAnICcgKyBpbnNwZWN0KHgpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gc3RyO1xufTtcblxuXG4vLyBNYXJrIHRoYXQgYSBtZXRob2Qgc2hvdWxkIG5vdCBiZSB1c2VkLlxuLy8gUmV0dXJucyBhIG1vZGlmaWVkIGZ1bmN0aW9uIHdoaWNoIHdhcm5zIG9uY2UgYnkgZGVmYXVsdC5cbi8vIElmIC0tbm8tZGVwcmVjYXRpb24gaXMgc2V0LCB0aGVuIGl0IGlzIGEgbm8tb3AuXG5leHBvcnRzLmRlcHJlY2F0ZSA9IGZ1bmN0aW9uKGZuLCBtc2cpIHtcbiAgLy8gQWxsb3cgZm9yIGRlcHJlY2F0aW5nIHRoaW5ncyBpbiB0aGUgcHJvY2VzcyBvZiBzdGFydGluZyB1cC5cbiAgaWYgKGlzVW5kZWZpbmVkKGdsb2JhbC5wcm9jZXNzKSkge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBleHBvcnRzLmRlcHJlY2F0ZShmbiwgbXNnKS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH1cblxuICBpZiAocHJvY2Vzcy5ub0RlcHJlY2F0aW9uID09PSB0cnVlKSB7XG4gICAgcmV0dXJuIGZuO1xuICB9XG5cbiAgdmFyIHdhcm5lZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBkZXByZWNhdGVkKCkge1xuICAgIGlmICghd2FybmVkKSB7XG4gICAgICBpZiAocHJvY2Vzcy50aHJvd0RlcHJlY2F0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtc2cpO1xuICAgICAgfSBlbHNlIGlmIChwcm9jZXNzLnRyYWNlRGVwcmVjYXRpb24pIHtcbiAgICAgICAgY29uc29sZS50cmFjZShtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihtc2cpO1xuICAgICAgfVxuICAgICAgd2FybmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICByZXR1cm4gZGVwcmVjYXRlZDtcbn07XG5cblxudmFyIGRlYnVncyA9IHt9O1xudmFyIGRlYnVnRW52aXJvbjtcbmV4cG9ydHMuZGVidWdsb2cgPSBmdW5jdGlvbihzZXQpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKGRlYnVnRW52aXJvbikpXG4gICAgZGVidWdFbnZpcm9uID0gcHJvY2Vzcy5lbnYuTk9ERV9ERUJVRyB8fCAnJztcbiAgc2V0ID0gc2V0LnRvVXBwZXJDYXNlKCk7XG4gIGlmICghZGVidWdzW3NldF0pIHtcbiAgICBpZiAobmV3IFJlZ0V4cCgnXFxcXGInICsgc2V0ICsgJ1xcXFxiJywgJ2knKS50ZXN0KGRlYnVnRW52aXJvbikpIHtcbiAgICAgIHZhciBwaWQgPSBwcm9jZXNzLnBpZDtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBtc2cgPSBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCclcyAlZDogJXMnLCBzZXQsIHBpZCwgbXNnKTtcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlYnVnc1tzZXRdID0gZnVuY3Rpb24oKSB7fTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlYnVnc1tzZXRdO1xufTtcblxuXG4vKipcbiAqIEVjaG9zIHRoZSB2YWx1ZSBvZiBhIHZhbHVlLiBUcnlzIHRvIHByaW50IHRoZSB2YWx1ZSBvdXRcbiAqIGluIHRoZSBiZXN0IHdheSBwb3NzaWJsZSBnaXZlbiB0aGUgZGlmZmVyZW50IHR5cGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBwcmludCBvdXQuXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0cyBPcHRpb25hbCBvcHRpb25zIG9iamVjdCB0aGF0IGFsdGVycyB0aGUgb3V0cHV0LlxuICovXG4vKiBsZWdhY3k6IG9iaiwgc2hvd0hpZGRlbiwgZGVwdGgsIGNvbG9ycyovXG5mdW5jdGlvbiBpbnNwZWN0KG9iaiwgb3B0cykge1xuICAvLyBkZWZhdWx0IG9wdGlvbnNcbiAgdmFyIGN0eCA9IHtcbiAgICBzZWVuOiBbXSxcbiAgICBzdHlsaXplOiBzdHlsaXplTm9Db2xvclxuICB9O1xuICAvLyBsZWdhY3kuLi5cbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gMykgY3R4LmRlcHRoID0gYXJndW1lbnRzWzJdO1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSA0KSBjdHguY29sb3JzID0gYXJndW1lbnRzWzNdO1xuICBpZiAoaXNCb29sZWFuKG9wdHMpKSB7XG4gICAgLy8gbGVnYWN5Li4uXG4gICAgY3R4LnNob3dIaWRkZW4gPSBvcHRzO1xuICB9IGVsc2UgaWYgKG9wdHMpIHtcbiAgICAvLyBnb3QgYW4gXCJvcHRpb25zXCIgb2JqZWN0XG4gICAgZXhwb3J0cy5fZXh0ZW5kKGN0eCwgb3B0cyk7XG4gIH1cbiAgLy8gc2V0IGRlZmF1bHQgb3B0aW9uc1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LnNob3dIaWRkZW4pKSBjdHguc2hvd0hpZGRlbiA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmRlcHRoKSkgY3R4LmRlcHRoID0gMjtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5jb2xvcnMpKSBjdHguY29sb3JzID0gZmFsc2U7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY3VzdG9tSW5zcGVjdCkpIGN0eC5jdXN0b21JbnNwZWN0ID0gdHJ1ZTtcbiAgaWYgKGN0eC5jb2xvcnMpIGN0eC5zdHlsaXplID0gc3R5bGl6ZVdpdGhDb2xvcjtcbiAgcmV0dXJuIGZvcm1hdFZhbHVlKGN0eCwgb2JqLCBjdHguZGVwdGgpO1xufVxuZXhwb3J0cy5pbnNwZWN0ID0gaW5zcGVjdDtcblxuXG4vLyBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUjZ3JhcGhpY3Ncbmluc3BlY3QuY29sb3JzID0ge1xuICAnYm9sZCcgOiBbMSwgMjJdLFxuICAnaXRhbGljJyA6IFszLCAyM10sXG4gICd1bmRlcmxpbmUnIDogWzQsIDI0XSxcbiAgJ2ludmVyc2UnIDogWzcsIDI3XSxcbiAgJ3doaXRlJyA6IFszNywgMzldLFxuICAnZ3JleScgOiBbOTAsIDM5XSxcbiAgJ2JsYWNrJyA6IFszMCwgMzldLFxuICAnYmx1ZScgOiBbMzQsIDM5XSxcbiAgJ2N5YW4nIDogWzM2LCAzOV0sXG4gICdncmVlbicgOiBbMzIsIDM5XSxcbiAgJ21hZ2VudGEnIDogWzM1LCAzOV0sXG4gICdyZWQnIDogWzMxLCAzOV0sXG4gICd5ZWxsb3cnIDogWzMzLCAzOV1cbn07XG5cbi8vIERvbid0IHVzZSAnYmx1ZScgbm90IHZpc2libGUgb24gY21kLmV4ZVxuaW5zcGVjdC5zdHlsZXMgPSB7XG4gICdzcGVjaWFsJzogJ2N5YW4nLFxuICAnbnVtYmVyJzogJ3llbGxvdycsXG4gICdib29sZWFuJzogJ3llbGxvdycsXG4gICd1bmRlZmluZWQnOiAnZ3JleScsXG4gICdudWxsJzogJ2JvbGQnLFxuICAnc3RyaW5nJzogJ2dyZWVuJyxcbiAgJ2RhdGUnOiAnbWFnZW50YScsXG4gIC8vIFwibmFtZVwiOiBpbnRlbnRpb25hbGx5IG5vdCBzdHlsaW5nXG4gICdyZWdleHAnOiAncmVkJ1xufTtcblxuXG5mdW5jdGlvbiBzdHlsaXplV2l0aENvbG9yKHN0ciwgc3R5bGVUeXBlKSB7XG4gIHZhciBzdHlsZSA9IGluc3BlY3Quc3R5bGVzW3N0eWxlVHlwZV07XG5cbiAgaWYgKHN0eWxlKSB7XG4gICAgcmV0dXJuICdcXHUwMDFiWycgKyBpbnNwZWN0LmNvbG9yc1tzdHlsZV1bMF0gKyAnbScgKyBzdHIgK1xuICAgICAgICAgICAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzFdICsgJ20nO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBzdHI7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBzdHlsaXplTm9Db2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICByZXR1cm4gc3RyO1xufVxuXG5cbmZ1bmN0aW9uIGFycmF5VG9IYXNoKGFycmF5KSB7XG4gIHZhciBoYXNoID0ge307XG5cbiAgYXJyYXkuZm9yRWFjaChmdW5jdGlvbih2YWwsIGlkeCkge1xuICAgIGhhc2hbdmFsXSA9IHRydWU7XG4gIH0pO1xuXG4gIHJldHVybiBoYXNoO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFZhbHVlKGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcykge1xuICAvLyBQcm92aWRlIGEgaG9vayBmb3IgdXNlci1zcGVjaWZpZWQgaW5zcGVjdCBmdW5jdGlvbnMuXG4gIC8vIENoZWNrIHRoYXQgdmFsdWUgaXMgYW4gb2JqZWN0IHdpdGggYW4gaW5zcGVjdCBmdW5jdGlvbiBvbiBpdFxuICBpZiAoY3R4LmN1c3RvbUluc3BlY3QgJiZcbiAgICAgIHZhbHVlICYmXG4gICAgICBpc0Z1bmN0aW9uKHZhbHVlLmluc3BlY3QpICYmXG4gICAgICAvLyBGaWx0ZXIgb3V0IHRoZSB1dGlsIG1vZHVsZSwgaXQncyBpbnNwZWN0IGZ1bmN0aW9uIGlzIHNwZWNpYWxcbiAgICAgIHZhbHVlLmluc3BlY3QgIT09IGV4cG9ydHMuaW5zcGVjdCAmJlxuICAgICAgLy8gQWxzbyBmaWx0ZXIgb3V0IGFueSBwcm90b3R5cGUgb2JqZWN0cyB1c2luZyB0aGUgY2lyY3VsYXIgY2hlY2suXG4gICAgICAhKHZhbHVlLmNvbnN0cnVjdG9yICYmIHZhbHVlLmNvbnN0cnVjdG9yLnByb3RvdHlwZSA9PT0gdmFsdWUpKSB7XG4gICAgdmFyIHJldCA9IHZhbHVlLmluc3BlY3QocmVjdXJzZVRpbWVzLCBjdHgpO1xuICAgIGlmICghaXNTdHJpbmcocmV0KSkge1xuICAgICAgcmV0ID0gZm9ybWF0VmFsdWUoY3R4LCByZXQsIHJlY3Vyc2VUaW1lcyk7XG4gICAgfVxuICAgIHJldHVybiByZXQ7XG4gIH1cblxuICAvLyBQcmltaXRpdmUgdHlwZXMgY2Fubm90IGhhdmUgcHJvcGVydGllc1xuICB2YXIgcHJpbWl0aXZlID0gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpO1xuICBpZiAocHJpbWl0aXZlKSB7XG4gICAgcmV0dXJuIHByaW1pdGl2ZTtcbiAgfVxuXG4gIC8vIExvb2sgdXAgdGhlIGtleXMgb2YgdGhlIG9iamVjdC5cbiAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyh2YWx1ZSk7XG4gIHZhciB2aXNpYmxlS2V5cyA9IGFycmF5VG9IYXNoKGtleXMpO1xuXG4gIGlmIChjdHguc2hvd0hpZGRlbikge1xuICAgIGtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh2YWx1ZSk7XG4gIH1cblxuICAvLyBJRSBkb2Vzbid0IG1ha2UgZXJyb3IgZmllbGRzIG5vbi1lbnVtZXJhYmxlXG4gIC8vIGh0dHA6Ly9tc2RuLm1pY3Jvc29mdC5jb20vZW4tdXMvbGlicmFyeS9pZS9kd3c1MnNidCh2PXZzLjk0KS5hc3B4XG4gIGlmIChpc0Vycm9yKHZhbHVlKVxuICAgICAgJiYgKGtleXMuaW5kZXhPZignbWVzc2FnZScpID49IDAgfHwga2V5cy5pbmRleE9mKCdkZXNjcmlwdGlvbicpID49IDApKSB7XG4gICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIC8vIFNvbWUgdHlwZSBvZiBvYmplY3Qgd2l0aG91dCBwcm9wZXJ0aWVzIGNhbiBiZSBzaG9ydGN1dHRlZC5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgICB2YXIgbmFtZSA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKCdbRnVuY3Rpb24nICsgbmFtZSArICddJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gICAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGN0eC5zdHlsaXplKFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdyZWdleHAnKTtcbiAgICB9XG4gICAgaWYgKGlzRGF0ZSh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ2RhdGUnKTtcbiAgICB9XG4gICAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgICByZXR1cm4gZm9ybWF0RXJyb3IodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBiYXNlID0gJycsIGFycmF5ID0gZmFsc2UsIGJyYWNlcyA9IFsneycsICd9J107XG5cbiAgLy8gTWFrZSBBcnJheSBzYXkgdGhhdCB0aGV5IGFyZSBBcnJheVxuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICBhcnJheSA9IHRydWU7XG4gICAgYnJhY2VzID0gWydbJywgJ10nXTtcbiAgfVxuXG4gIC8vIE1ha2UgZnVuY3Rpb25zIHNheSB0aGF0IHRoZXkgYXJlIGZ1bmN0aW9uc1xuICBpZiAoaXNGdW5jdGlvbih2YWx1ZSkpIHtcbiAgICB2YXIgbiA9IHZhbHVlLm5hbWUgPyAnOiAnICsgdmFsdWUubmFtZSA6ICcnO1xuICAgIGJhc2UgPSAnIFtGdW5jdGlvbicgKyBuICsgJ10nO1xuICB9XG5cbiAgLy8gTWFrZSBSZWdFeHBzIHNheSB0aGF0IHRoZXkgYXJlIFJlZ0V4cHNcbiAgaWYgKGlzUmVnRXhwKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBkYXRlcyB3aXRoIHByb3BlcnRpZXMgZmlyc3Qgc2F5IHRoZSBkYXRlXG4gIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIERhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodmFsdWUpO1xuICB9XG5cbiAgLy8gTWFrZSBlcnJvciB3aXRoIG1lc3NhZ2UgZmlyc3Qgc2F5IHRoZSBlcnJvclxuICBpZiAoaXNFcnJvcih2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgZm9ybWF0RXJyb3IodmFsdWUpO1xuICB9XG5cbiAgaWYgKGtleXMubGVuZ3RoID09PSAwICYmICghYXJyYXkgfHwgdmFsdWUubGVuZ3RoID09IDApKSB7XG4gICAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyBicmFjZXNbMV07XG4gIH1cblxuICBpZiAocmVjdXJzZVRpbWVzIDwgMCkge1xuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW09iamVjdF0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuXG4gIGN0eC5zZWVuLnB1c2godmFsdWUpO1xuXG4gIHZhciBvdXRwdXQ7XG4gIGlmIChhcnJheSkge1xuICAgIG91dHB1dCA9IGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpO1xuICB9IGVsc2Uge1xuICAgIG91dHB1dCA9IGtleXMubWFwKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpO1xuICAgIH0pO1xuICB9XG5cbiAgY3R4LnNlZW4ucG9wKCk7XG5cbiAgcmV0dXJuIHJlZHVjZVRvU2luZ2xlU3RyaW5nKG91dHB1dCwgYmFzZSwgYnJhY2VzKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRQcmltaXRpdmUoY3R4LCB2YWx1ZSkge1xuICBpZiAoaXNVbmRlZmluZWQodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcpO1xuICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgdmFyIHNpbXBsZSA9ICdcXCcnICsgSlNPTi5zdHJpbmdpZnkodmFsdWUpLnJlcGxhY2UoL15cInxcIiQvZywgJycpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpICsgJ1xcJyc7XG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKHNpbXBsZSwgJ3N0cmluZycpO1xuICB9XG4gIGlmIChpc051bWJlcih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdudW1iZXInKTtcbiAgaWYgKGlzQm9vbGVhbih2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCcnICsgdmFsdWUsICdib29sZWFuJyk7XG4gIC8vIEZvciBzb21lIHJlYXNvbiB0eXBlb2YgbnVsbCBpcyBcIm9iamVjdFwiLCBzbyBzcGVjaWFsIGNhc2UgaGVyZS5cbiAgaWYgKGlzTnVsbCh2YWx1ZSkpXG4gICAgcmV0dXJuIGN0eC5zdHlsaXplKCdudWxsJywgJ251bGwnKTtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRFcnJvcih2YWx1ZSkge1xuICByZXR1cm4gJ1snICsgRXJyb3IucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpICsgJ10nO1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdEFycmF5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleXMpIHtcbiAgdmFyIG91dHB1dCA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbCA9IHZhbHVlLmxlbmd0aDsgaSA8IGw7ICsraSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eSh2YWx1ZSwgU3RyaW5nKGkpKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBTdHJpbmcoaSksIHRydWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0LnB1c2goJycpO1xuICAgIH1cbiAgfVxuICBrZXlzLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgaWYgKCFrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICBvdXRwdXQucHVzaChmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLFxuICAgICAgICAgIGtleSwgdHJ1ZSkpO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cywga2V5LCBhcnJheSkge1xuICB2YXIgbmFtZSwgc3RyLCBkZXNjO1xuICBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih2YWx1ZSwga2V5KSB8fCB7IHZhbHVlOiB2YWx1ZVtrZXldIH07XG4gIGlmIChkZXNjLmdldCkge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tHZXR0ZXIvU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChkZXNjLnNldCkge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tTZXR0ZXJdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFoYXNPd25Qcm9wZXJ0eSh2aXNpYmxlS2V5cywga2V5KSkge1xuICAgIG5hbWUgPSAnWycgKyBrZXkgKyAnXSc7XG4gIH1cbiAgaWYgKCFzdHIpIHtcbiAgICBpZiAoY3R4LnNlZW4uaW5kZXhPZihkZXNjLnZhbHVlKSA8IDApIHtcbiAgICAgIGlmIChpc051bGwocmVjdXJzZVRpbWVzKSkge1xuICAgICAgICBzdHIgPSBmb3JtYXRWYWx1ZShjdHgsIGRlc2MudmFsdWUsIG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCByZWN1cnNlVGltZXMgLSAxKTtcbiAgICAgIH1cbiAgICAgIGlmIChzdHIuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgICBpZiAoYXJyYXkpIHtcbiAgICAgICAgICBzdHIgPSBzdHIuc3BsaXQoJ1xcbicpLm1hcChmdW5jdGlvbihsaW5lKSB7XG4gICAgICAgICAgICByZXR1cm4gJyAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJykuc3Vic3RyKDIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0ciA9ICdcXG4nICsgc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICAnICsgbGluZTtcbiAgICAgICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0NpcmN1bGFyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmIChpc1VuZGVmaW5lZChuYW1lKSkge1xuICAgIGlmIChhcnJheSAmJiBrZXkubWF0Y2goL15cXGQrJC8pKSB7XG4gICAgICByZXR1cm4gc3RyO1xuICAgIH1cbiAgICBuYW1lID0gSlNPTi5zdHJpbmdpZnkoJycgKyBrZXkpO1xuICAgIGlmIChuYW1lLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKSkge1xuICAgICAgbmFtZSA9IG5hbWUuc3Vic3RyKDEsIG5hbWUubGVuZ3RoIC0gMik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ25hbWUnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZSA9IG5hbWUucmVwbGFjZSgvJy9nLCBcIlxcXFwnXCIpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXFxcXCIvZywgJ1wiJylcbiAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLyheXCJ8XCIkKS9nLCBcIidcIik7XG4gICAgICBuYW1lID0gY3R4LnN0eWxpemUobmFtZSwgJ3N0cmluZycpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lICsgJzogJyArIHN0cjtcbn1cblxuXG5mdW5jdGlvbiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcykge1xuICB2YXIgbnVtTGluZXNFc3QgPSAwO1xuICB2YXIgbGVuZ3RoID0gb3V0cHV0LnJlZHVjZShmdW5jdGlvbihwcmV2LCBjdXIpIHtcbiAgICBudW1MaW5lc0VzdCsrO1xuICAgIGlmIChjdXIuaW5kZXhPZignXFxuJykgPj0gMCkgbnVtTGluZXNFc3QrKztcbiAgICByZXR1cm4gcHJldiArIGN1ci5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZywgJycpLmxlbmd0aCArIDE7XG4gIH0sIDApO1xuXG4gIGlmIChsZW5ndGggPiA2MCkge1xuICAgIHJldHVybiBicmFjZXNbMF0gK1xuICAgICAgICAgICAoYmFzZSA9PT0gJycgPyAnJyA6IGJhc2UgKyAnXFxuICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgb3V0cHV0LmpvaW4oJyxcXG4gICcpICtcbiAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgYnJhY2VzWzFdO1xuICB9XG5cbiAgcmV0dXJuIGJyYWNlc1swXSArIGJhc2UgKyAnICcgKyBvdXRwdXQuam9pbignLCAnKSArICcgJyArIGJyYWNlc1sxXTtcbn1cblxuXG4vLyBOT1RFOiBUaGVzZSB0eXBlIGNoZWNraW5nIGZ1bmN0aW9ucyBpbnRlbnRpb25hbGx5IGRvbid0IHVzZSBgaW5zdGFuY2VvZmBcbi8vIGJlY2F1c2UgaXQgaXMgZnJhZ2lsZSBhbmQgY2FuIGJlIGVhc2lseSBmYWtlZCB3aXRoIGBPYmplY3QuY3JlYXRlKClgLlxuZnVuY3Rpb24gaXNBcnJheShhcikge1xuICByZXR1cm4gQXJyYXkuaXNBcnJheShhcik7XG59XG5leHBvcnRzLmlzQXJyYXkgPSBpc0FycmF5O1xuXG5mdW5jdGlvbiBpc0Jvb2xlYW4oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnYm9vbGVhbic7XG59XG5leHBvcnRzLmlzQm9vbGVhbiA9IGlzQm9vbGVhbjtcblxuZnVuY3Rpb24gaXNOdWxsKGFyZykge1xuICByZXR1cm4gYXJnID09PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGwgPSBpc051bGw7XG5cbmZ1bmN0aW9uIGlzTnVsbE9yVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09IG51bGw7XG59XG5leHBvcnRzLmlzTnVsbE9yVW5kZWZpbmVkID0gaXNOdWxsT3JVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5leHBvcnRzLmlzTnVtYmVyID0gaXNOdW1iZXI7XG5cbmZ1bmN0aW9uIGlzU3RyaW5nKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N0cmluZyc7XG59XG5leHBvcnRzLmlzU3RyaW5nID0gaXNTdHJpbmc7XG5cbmZ1bmN0aW9uIGlzU3ltYm9sKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ3N5bWJvbCc7XG59XG5leHBvcnRzLmlzU3ltYm9sID0gaXNTeW1ib2w7XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5leHBvcnRzLmlzVW5kZWZpbmVkID0gaXNVbmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzUmVnRXhwKHJlKSB7XG4gIHJldHVybiBpc09iamVjdChyZSkgJiYgb2JqZWN0VG9TdHJpbmcocmUpID09PSAnW29iamVjdCBSZWdFeHBdJztcbn1cbmV4cG9ydHMuaXNSZWdFeHAgPSBpc1JlZ0V4cDtcblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5leHBvcnRzLmlzT2JqZWN0ID0gaXNPYmplY3Q7XG5cbmZ1bmN0aW9uIGlzRGF0ZShkKSB7XG4gIHJldHVybiBpc09iamVjdChkKSAmJiBvYmplY3RUb1N0cmluZyhkKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xufVxuZXhwb3J0cy5pc0RhdGUgPSBpc0RhdGU7XG5cbmZ1bmN0aW9uIGlzRXJyb3IoZSkge1xuICByZXR1cm4gaXNPYmplY3QoZSkgJiZcbiAgICAgIChvYmplY3RUb1N0cmluZyhlKSA9PT0gJ1tvYmplY3QgRXJyb3JdJyB8fCBlIGluc3RhbmNlb2YgRXJyb3IpO1xufVxuZXhwb3J0cy5pc0Vycm9yID0gaXNFcnJvcjtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5leHBvcnRzLmlzRnVuY3Rpb24gPSBpc0Z1bmN0aW9uO1xuXG5mdW5jdGlvbiBpc1ByaW1pdGl2ZShhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbCB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnbnVtYmVyJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3N0cmluZycgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnIHx8ICAvLyBFUzYgc3ltYm9sXG4gICAgICAgICB0eXBlb2YgYXJnID09PSAndW5kZWZpbmVkJztcbn1cbmV4cG9ydHMuaXNQcmltaXRpdmUgPSBpc1ByaW1pdGl2ZTtcblxuZXhwb3J0cy5pc0J1ZmZlciA9IHJlcXVpcmUoJy4vc3VwcG9ydC9pc0J1ZmZlcicpO1xuXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyhvKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobyk7XG59XG5cblxuZnVuY3Rpb24gcGFkKG4pIHtcbiAgcmV0dXJuIG4gPCAxMCA/ICcwJyArIG4udG9TdHJpbmcoMTApIDogbi50b1N0cmluZygxMCk7XG59XG5cblxudmFyIG1vbnRocyA9IFsnSmFuJywgJ0ZlYicsICdNYXInLCAnQXByJywgJ01heScsICdKdW4nLCAnSnVsJywgJ0F1ZycsICdTZXAnLFxuICAgICAgICAgICAgICAnT2N0JywgJ05vdicsICdEZWMnXTtcblxuLy8gMjYgRmViIDE2OjE5OjM0XG5mdW5jdGlvbiB0aW1lc3RhbXAoKSB7XG4gIHZhciBkID0gbmV3IERhdGUoKTtcbiAgdmFyIHRpbWUgPSBbcGFkKGQuZ2V0SG91cnMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldE1pbnV0ZXMoKSksXG4gICAgICAgICAgICAgIHBhZChkLmdldFNlY29uZHMoKSldLmpvaW4oJzonKTtcbiAgcmV0dXJuIFtkLmdldERhdGUoKSwgbW9udGhzW2QuZ2V0TW9udGgoKV0sIHRpbWVdLmpvaW4oJyAnKTtcbn1cblxuXG4vLyBsb2cgaXMganVzdCBhIHRoaW4gd3JhcHBlciB0byBjb25zb2xlLmxvZyB0aGF0IHByZXBlbmRzIGEgdGltZXN0YW1wXG5leHBvcnRzLmxvZyA9IGZ1bmN0aW9uKCkge1xuICBjb25zb2xlLmxvZygnJXMgLSAlcycsIHRpbWVzdGFtcCgpLCBleHBvcnRzLmZvcm1hdC5hcHBseShleHBvcnRzLCBhcmd1bWVudHMpKTtcbn07XG5cblxuLyoqXG4gKiBJbmhlcml0IHRoZSBwcm90b3R5cGUgbWV0aG9kcyBmcm9tIG9uZSBjb25zdHJ1Y3RvciBpbnRvIGFub3RoZXIuXG4gKlxuICogVGhlIEZ1bmN0aW9uLnByb3RvdHlwZS5pbmhlcml0cyBmcm9tIGxhbmcuanMgcmV3cml0dGVuIGFzIGEgc3RhbmRhbG9uZVxuICogZnVuY3Rpb24gKG5vdCBvbiBGdW5jdGlvbi5wcm90b3R5cGUpLiBOT1RFOiBJZiB0aGlzIGZpbGUgaXMgdG8gYmUgbG9hZGVkXG4gKiBkdXJpbmcgYm9vdHN0cmFwcGluZyB0aGlzIGZ1bmN0aW9uIG5lZWRzIHRvIGJlIHJld3JpdHRlbiB1c2luZyBzb21lIG5hdGl2ZVxuICogZnVuY3Rpb25zIGFzIHByb3RvdHlwZSBzZXR1cCB1c2luZyBub3JtYWwgSmF2YVNjcmlwdCBkb2VzIG5vdCB3b3JrIGFzXG4gKiBleHBlY3RlZCBkdXJpbmcgYm9vdHN0cmFwcGluZyAoc2VlIG1pcnJvci5qcyBpbiByMTE0OTAzKS5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHdoaWNoIG5lZWRzIHRvIGluaGVyaXQgdGhlXG4gKiAgICAgcHJvdG90eXBlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gc3VwZXJDdG9yIENvbnN0cnVjdG9yIGZ1bmN0aW9uIHRvIGluaGVyaXQgcHJvdG90eXBlIGZyb20uXG4gKi9cbmV4cG9ydHMuaW5oZXJpdHMgPSByZXF1aXJlKCdpbmhlcml0cycpO1xuXG5leHBvcnRzLl9leHRlbmQgPSBmdW5jdGlvbihvcmlnaW4sIGFkZCkge1xuICAvLyBEb24ndCBkbyBhbnl0aGluZyBpZiBhZGQgaXNuJ3QgYW4gb2JqZWN0XG4gIGlmICghYWRkIHx8ICFpc09iamVjdChhZGQpKSByZXR1cm4gb3JpZ2luO1xuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXMoYWRkKTtcbiAgdmFyIGkgPSBrZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGktLSkge1xuICAgIG9yaWdpbltrZXlzW2ldXSA9IGFkZFtrZXlzW2ldXTtcbiAgfVxuICByZXR1cm4gb3JpZ2luO1xufTtcblxuZnVuY3Rpb24gaGFzT3duUHJvcGVydHkob2JqLCBwcm9wKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn1cbiIsIi8vIOOBq+OCg+ODvOOCk1xyXG5cclxubGV0IENhdE1hdGggPSB7fTtcclxuXHJcbi8qKlxyXG4gKiBhZGRzIGEgdHdvIHZlY1xyXG4gKiBAcGFyYW0ge2FycmF5fSBhIC0gdmVjXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGIgLSB2ZWNcclxuICovXHJcbkNhdE1hdGgudmVjQWRkID0gKCBhLCBiICkgPT4gYS5tYXAoICggZSwgaSApID0+IGUgKyBiW2ldICk7XHJcblxyXG4vKipcclxuICogc3Vic3RyYWN0cyBhIHZlYyBmcm9tIGFuIGFub3RoZXIgdmVjXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGEgLSB2ZWNcclxuICogQHBhcmFtIHthcnJheX0gYiAtIHZlY1xyXG4gKi9cclxuQ2F0TWF0aC52ZWNTdWIgPSAoIGEsIGIgKSA9PiBhLm1hcCggKCBlLCBpICkgPT4gZSAtIGJbaV0gKTtcclxuXHJcbi8qKlxyXG4gKiByZXR1cm5zIGEgY3Jvc3Mgb2YgdHdvIHZlYzNzXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGEgLSB2ZWMzXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGIgLSB2ZWMzXHJcbiAqL1xyXG5DYXRNYXRoLnZlYzNDcm9zcyA9ICggYSwgYiApID0+IFtcclxuICBhWzFdICogYlsyXSAtIGFbMl0gKiBiWzFdLFxyXG4gIGFbMl0gKiBiWzBdIC0gYVswXSAqIGJbMl0sXHJcbiAgYVswXSAqIGJbMV0gLSBhWzFdICogYlswXVxyXG5dO1xyXG5cclxuLyoqXHJcbiAqIHNjYWxlcyBhIHZlYyBieSBzY2FsYXJcclxuICogQHBhcmFtIHtudW1iZXJ9IHMgLSBzY2FsYXJcclxuICogQHBhcmFtIHthcnJheX0gdiAtIHZlY1xyXG4gKi9cclxuQ2F0TWF0aC52ZWNTY2FsZSA9ICggcywgdiApID0+IHYubWFwKCBlID0+IGUgKiBzICk7XHJcblxyXG4vKipcclxuICogcmV0dXJucyBsZW5ndGggb2YgYSB2ZWNcclxuICogQHBhcmFtIHthcnJheX0gdiAtIHZlY1xyXG4gKi9cclxuQ2F0TWF0aC52ZWNMZW5ndGggPSB2ID0+IE1hdGguc3FydCggdi5yZWR1Y2UoICggcCwgYyApID0+IHAgKyBjICogYywgMC4wICkgKTtcclxuXHJcbi8qKlxyXG4gKiBub3JtYWxpemVzIGEgdmVjXHJcbiAqIEBwYXJhbSB7YXJyYXl9IHYgLSB2ZWNcclxuICovXHJcbkNhdE1hdGgudmVjTm9ybWFsaXplID0gdiA9PiBDYXRNYXRoLnZlY1NjYWxlKCAxLjAgLyBDYXRNYXRoLnZlY0xlbmd0aCggdiApLCB2ICk7XHJcblxyXG4vKipcclxuICogYXBwbGllcyB0d28gbWF0NHNcclxuICogQHBhcmFtIHthcnJheX0gYSAtIG1hdDRcclxuICogQHBhcmFtIHthcnJheX0gYiAtIG1hdDRcclxuICovXHJcbkNhdE1hdGgubWF0NEFwcGx5ID0gKCBhLCBiICkgPT4ge1xyXG4gIHJldHVybiBbXHJcbiAgICBhWyAwXSAqIGJbIDBdICsgYVsgNF0gKiBiWyAxXSArIGFbIDhdICogYlsgMl0gKyBhWzEyXSAqIGJbIDNdLFxyXG4gICAgYVsgMV0gKiBiWyAwXSArIGFbIDVdICogYlsgMV0gKyBhWyA5XSAqIGJbIDJdICsgYVsxM10gKiBiWyAzXSxcclxuICAgIGFbIDJdICogYlsgMF0gKyBhWyA2XSAqIGJbIDFdICsgYVsxMF0gKiBiWyAyXSArIGFbMTRdICogYlsgM10sXHJcbiAgICBhWyAzXSAqIGJbIDBdICsgYVsgN10gKiBiWyAxXSArIGFbMTFdICogYlsgMl0gKyBhWzE1XSAqIGJbIDNdLFxyXG5cclxuICAgIGFbIDBdICogYlsgNF0gKyBhWyA0XSAqIGJbIDVdICsgYVsgOF0gKiBiWyA2XSArIGFbMTJdICogYlsgN10sXHJcbiAgICBhWyAxXSAqIGJbIDRdICsgYVsgNV0gKiBiWyA1XSArIGFbIDldICogYlsgNl0gKyBhWzEzXSAqIGJbIDddLFxyXG4gICAgYVsgMl0gKiBiWyA0XSArIGFbIDZdICogYlsgNV0gKyBhWzEwXSAqIGJbIDZdICsgYVsxNF0gKiBiWyA3XSxcclxuICAgIGFbIDNdICogYlsgNF0gKyBhWyA3XSAqIGJbIDVdICsgYVsxMV0gKiBiWyA2XSArIGFbMTVdICogYlsgN10sXHJcblxyXG4gICAgYVsgMF0gKiBiWyA4XSArIGFbIDRdICogYlsgOV0gKyBhWyA4XSAqIGJbMTBdICsgYVsxMl0gKiBiWzExXSxcclxuICAgIGFbIDFdICogYlsgOF0gKyBhWyA1XSAqIGJbIDldICsgYVsgOV0gKiBiWzEwXSArIGFbMTNdICogYlsxMV0sXHJcbiAgICBhWyAyXSAqIGJbIDhdICsgYVsgNl0gKiBiWyA5XSArIGFbMTBdICogYlsxMF0gKyBhWzE0XSAqIGJbMTFdLFxyXG4gICAgYVsgM10gKiBiWyA4XSArIGFbIDddICogYlsgOV0gKyBhWzExXSAqIGJbMTBdICsgYVsxNV0gKiBiWzExXSxcclxuICAgIFxyXG4gICAgYVsgMF0gKiBiWzEyXSArIGFbIDRdICogYlsxM10gKyBhWyA4XSAqIGJbMTRdICsgYVsxMl0gKiBiWzE1XSxcclxuICAgIGFbIDFdICogYlsxMl0gKyBhWyA1XSAqIGJbMTNdICsgYVsgOV0gKiBiWzE0XSArIGFbMTNdICogYlsxNV0sXHJcbiAgICBhWyAyXSAqIGJbMTJdICsgYVsgNl0gKiBiWzEzXSArIGFbMTBdICogYlsxNF0gKyBhWzE0XSAqIGJbMTVdLFxyXG4gICAgYVsgM10gKiBiWzEyXSArIGFbIDddICogYlsxM10gKyBhWzExXSAqIGJbMTRdICsgYVsxNV0gKiBiWzE1XVxyXG4gIF07XHJcbn07XHJcblxyXG4vKipcclxuICogdHJhbnNwb3NlIGEgbWF0NFxyXG4gKiBAcGFyYW0ge2FycmF5fSBtIC0gbWF0NFxyXG4gKi9cclxuQ2F0TWF0aC5tYXQ0VHJhbnNwb3NlID0gbSA9PiBbXHJcbiAgbVsgMF0sbVsgNF0sbVsgOF0sbVsxMl0sXHJcbiAgbVsgMV0sbVsgNV0sbVsgOV0sbVsxM10sXHJcbiAgbVsgMl0sbVsgNl0sbVsxMF0sbVsxNF0sXHJcbiAgbVsgM10sbVsgN10sbVsxMV0sbVsxNV1cclxuXTtcclxuXHJcbi8qKlxyXG4gKiByZXR1cm5zIGFuIGluZGVudGl0eSBtYXQ0XHJcbiAqL1xyXG5DYXRNYXRoLm1hdDRJZGVudGl0eSA9ICgpID0+IFsxLDAsMCwwLDAsMSwwLDAsMCwwLDEsMCwwLDAsMCwxXTtcclxuXHJcbkNhdE1hdGgubWF0NFRyYW5zbGF0ZSA9ICggdiApID0+IFsxLDAsMCwwLDAsMSwwLDAsMCwwLDEsMCx2WzBdLHZbMV0sdlsyXSwxXTtcclxuXHJcbkNhdE1hdGgubWF0NFNjYWxlID0gKCB2ICkgPT4gW1xyXG4gIHZbMF0sMCwwLDAsXHJcbiAgMCx2WzFdLDAsMCxcclxuICAwLDAsdlsyXSwwLFxyXG4gIDAsMCwwLDFcclxuXTtcclxuXHJcbkNhdE1hdGgubWF0NFNjYWxlWFlaID0gKCBzICkgPT4gW1xyXG4gIHMsMCwwLDAsXHJcbiAgMCxzLDAsMCxcclxuICAwLDAscywwLFxyXG4gIDAsMCwwLDFcclxuXTtcclxuXHJcbkNhdE1hdGgubWF0NFJvdGF0ZVggPSAoIHQgKSA9PiBbXHJcbiAgMSwwLDAsMCxcclxuICAwLE1hdGguY29zKHQpLC1NYXRoLnNpbih0KSwwLFxyXG4gIDAsTWF0aC5zaW4odCksTWF0aC5jb3ModCksMCxcclxuICAwLDAsMCwxXHJcbl07XHJcblxyXG5DYXRNYXRoLm1hdDRSb3RhdGVZID0gKCB0ICkgPT4gW1xyXG4gIE1hdGguY29zKHQpLDAsTWF0aC5zaW4odCksMCxcclxuICAwLDEsMCwwLFxyXG4gIC1NYXRoLnNpbih0KSwwLE1hdGguY29zKHQpLDAsXHJcbiAgMCwwLDAsMVxyXG5dO1xyXG5cclxuQ2F0TWF0aC5tYXQ0Um90YXRlWiA9ICggdCApID0+IFtcclxuICBNYXRoLmNvcyh0KSwtTWF0aC5zaW4odCksMCwwLFxyXG4gIE1hdGguc2luKHQpLE1hdGguY29zKHQpLDAsMCxcclxuICAwLDAsMSwwLFxyXG4gIDAsMCwwLDFcclxuXTtcclxuXHJcbkNhdE1hdGgubWF0NExvb2tBdCA9ICggcG9zLCB0YXIsIGFpciwgcm90ICkgPT4ge1xyXG4gIGxldCBkaXIgPSBDYXRNYXRoLnZlY05vcm1hbGl6ZSggQ2F0TWF0aC52ZWNTdWIoIHRhciwgcG9zICkgKTtcclxuICBsZXQgc2lkID0gQ2F0TWF0aC52ZWNOb3JtYWxpemUoIENhdE1hdGgudmVjM0Nyb3NzKCBkaXIsIGFpciApICk7XHJcbiAgbGV0IHRvcCA9IENhdE1hdGgudmVjM0Nyb3NzKCBzaWQsIGRpciApO1xyXG4gIHNpZCA9IENhdE1hdGgudmVjQWRkKFxyXG4gICAgQ2F0TWF0aC52ZWNTY2FsZSggTWF0aC5jb3MoIHJvdCApLCBzaWQgKSxcclxuICAgIENhdE1hdGgudmVjU2NhbGUoIE1hdGguc2luKCByb3QgKSwgdG9wIClcclxuICApO1xyXG4gIHRvcCA9IENhdE1hdGgudmVjM0Nyb3NzKCBzaWQsIGRpciApO1xyXG5cclxuICByZXR1cm4gW1xyXG4gICAgc2lkWzBdLCB0b3BbMF0sIGRpclswXSwgMC4wLFxyXG4gICAgc2lkWzFdLCB0b3BbMV0sIGRpclsxXSwgMC4wLFxyXG4gICAgc2lkWzJdLCB0b3BbMl0sIGRpclsyXSwgMC4wLFxyXG4gICAgLSBzaWRbMF0gKiBwb3NbMF0gLSBzaWRbMV0gKiBwb3NbMV0gLSBzaWRbMl0gKiBwb3NbMl0sXHJcbiAgICAtIHRvcFswXSAqIHBvc1swXSAtIHRvcFsxXSAqIHBvc1sxXSAtIHRvcFsyXSAqIHBvc1syXSxcclxuICAgIC0gZGlyWzBdICogcG9zWzBdIC0gZGlyWzFdICogcG9zWzFdIC0gZGlyWzJdICogcG9zWzJdLFxyXG4gICAgMS4wXHJcbiAgXTtcclxufTtcclxuXHJcbkNhdE1hdGgubWF0NFBlcnNwZWN0aXZlID0gKCBmb3YsIGFzcGVjdCwgbmVhciwgZmFyICkgPT4ge1xyXG4gIGxldCBwID0gMS4wIC8gTWF0aC50YW4oIGZvdiAqIE1hdGguUEkgLyAzNjAuMCApO1xyXG4gIGxldCBkID0gZmFyIC8gKCBmYXIgLSBuZWFyICk7XHJcbiAgcmV0dXJuIFtcclxuICAgIHAgLyBhc3BlY3QsIDAuMCwgMC4wLCAwLjAsXHJcbiAgICAwLjAsIHAsIDAuMCwgMC4wLFxyXG4gICAgMC4wLCAwLjAsIGQsIDEuMCxcclxuICAgIDAuMCwgMC4wLCAtbmVhciAqIGQsIDAuMFxyXG4gIF07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDYXRNYXRoOyIsImltcG9ydCBQYXRoIGZyb20gJy4vZ2xjYXQtcGF0aCc7XG5cbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCAnZ2xzbGlmeScgKTtcblxubGV0IHJlcXVpcmVkRmllbGRzID0gKCBvYmplY3QsIG5hbml0aGVmdWNrLCBmaWVsZHMgKSA9PiB7XG4gIGZpZWxkcy5tYXAoIGZpZWxkID0+IHtcbiAgICBpZiAoIHR5cGVvZiBvYmplY3RbIGZpZWxkIF0gPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICB0aHJvdyBcIkdMQ2F0LVBhdGg6IFwiICsgZmllbGQgKyBcIiBpcyByZXF1aXJlZCBmb3IgXCIgKyBuYW5pdGhlZnVjaztcbiAgICB9XG4gIH0gKTtcbn07XG5cbmxldCBQYXRoR1VJID0gY2xhc3MgZXh0ZW5kcyBQYXRoIHtcbiAgY29uc3RydWN0b3IoIGdsQ2F0LCBwYXJhbXMgKSB7XG4gICAgc3VwZXIoIGdsQ2F0LCBwYXJhbXMgKTtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgcmVxdWlyZWRGaWVsZHMoIHBhcmFtcywgXCJwYXJhbXNcIiwgW1xuICAgICAgXCJjYW52YXNcIixcbiAgICAgIFwiZWxcIlxuICAgIF0gKTtcblxuICAgIGl0Lmd1aSA9IHsgcGFyZW50OiBpdC5wYXJhbXMuZWwgfTtcblxuICAgIGl0Lmd1aS5pbmZvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggXCJzcGFuXCIgKTtcbiAgICBpdC5ndWkucGFyZW50LmFwcGVuZENoaWxkKCBpdC5ndWkuaW5mbyApO1xuICAgIFxuICAgIGl0Lmd1aS5yYW5nZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwiaW5wdXRcIiApO1xuICAgIGl0Lmd1aS5yYW5nZS50eXBlID0gXCJyYW5nZVwiO1xuICAgIGl0Lmd1aS5yYW5nZS5taW4gPSAwO1xuICAgIGl0Lmd1aS5yYW5nZS5tYXggPSAwO1xuICAgIGl0Lmd1aS5yYW5nZS5zdGVwID0gMTtcbiAgICBpdC5ndWkucGFyZW50LmFwcGVuZENoaWxkKCBpdC5ndWkucmFuZ2UgKTtcblxuICAgIGl0LnRpbWVMaXN0ID0gbmV3IEFycmF5KCAzMCApLmZpbGwoIDAgKTtcbiAgICBpdC50aW1lTGlzdEluZGV4ID0gMDtcbiAgICBpdC50b3RhbEZyYW1lcyA9IDA7XG4gICAgaXQuZnBzID0gMDtcbiAgICBpdC5jdXJyZW50SW5kZXggPSAwO1xuICAgIGl0LnZpZXdOYW1lID0gXCJcIjtcbiAgICBpdC52aWV3SW5kZXggPSAwO1xuXG4gICAgbGV0IGdsID0gZ2xDYXQuZ2w7XG4gICAgbGV0IHZib1F1YWQgPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoIFsgLTEsIC0xLCAxLCAtMSwgLTEsIDEsIDEsIDEgXSApO1xuICAgIGl0LmFkZCgge1xuICAgICAgX19QYXRoR3VpUmV0dXJuOiB7XG4gICAgICAgIHdpZHRoOiBpdC5wYXJhbXMuY2FudmFzLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IGl0LnBhcmFtcy5jYW52YXMuaGVpZ2h0LFxuICAgICAgICB2ZXJ0OiBcImF0dHJpYnV0ZSB2ZWMyIHA7dm9pZCBtYWluKCl7Z2xfUG9zaXRpb249dmVjNChwLDAsMSk7fVwiLFxuICAgICAgICBmcmFnOiBcInByZWNpc2lvbiBoaWdocCBmbG9hdDt1bmlmb3JtIHZlYzIgcjt1bmlmb3JtIHNhbXBsZXIyRCBzO3ZvaWQgbWFpbigpe2dsX0ZyYWdDb2xvcj10ZXh0dXJlMkQocyxnbF9GcmFnQ29vcmQueHkvcik7fVwiLFxuICAgICAgICBibGVuZDogWyBnbC5PTkUsIGdsLk9ORSBdLFxuICAgICAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAxLjAgXSxcbiAgICAgICAgZnVuYzogKCBfcCwgcGFyYW1zICkgPT4ge1xuICAgICAgICAgIGdsLnZpZXdwb3J0KCAwLCAwLCBpdC5wYXJhbXMuY2FudmFzLndpZHRoLCBpdC5wYXJhbXMuY2FudmFzLmhlaWdodCApO1xuICAgICAgICAgIGdsQ2F0LnVuaWZvcm0yZnYoICdyJywgWyBpdC5wYXJhbXMuY2FudmFzLndpZHRoLCBpdC5wYXJhbXMuY2FudmFzLmhlaWdodCBdICk7XG4gICAgXG4gICAgICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3MnLCBwYXJhbXMuaW5wdXQsIDAgKTtcbiAgICAgICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgIH0gKTtcbiAgfVxuXG4gIGJlZ2luKCkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBpdC5jdXJyZW50SW5kZXggPSAwO1xuICB9XG5cbiAgZW5kKCkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBpdC5ndWkucmFuZ2UubWF4ID0gTWF0aC5tYXgoIGl0Lmd1aS5yYW5nZS5tYXgsIGl0LmN1cnJlbnRJbmRleCApO1xuICAgIGl0LmN1cnJlbnRJbmRleCA9IDA7XG5cbiAgICBsZXQgbm93ID0gK25ldyBEYXRlKCkgKiAxRS0zO1xuICAgIGl0LnRpbWVMaXN0WyBpdC50aW1lTGlzdEluZGV4IF0gPSBub3c7XG4gICAgaXQudGltZUxpc3RJbmRleCA9ICggaXQudGltZUxpc3RJbmRleCArIDEgKSAlIGl0LnRpbWVMaXN0Lmxlbmd0aDtcbiAgICBpdC5mcHMgPSAoXG4gICAgICAoIGl0LnRpbWVMaXN0Lmxlbmd0aCAtIDEgKVxuICAgICAgLyAoIG5vdyAtIGl0LnRpbWVMaXN0WyBpdC50aW1lTGlzdEluZGV4IF0gKVxuICAgICkudG9GaXhlZCggMSApO1xuICAgIFxuICAgIGl0LnRvdGFsRnJhbWVzICsrO1xuXG4gICAgaXQuZ3VpLmluZm8uaW5uZXJUZXh0ID0gKFxuICAgICAgXCJQYXRoOiBcIiArIGl0LnZpZXdOYW1lICsgXCIgKFwiICsgaXQudmlld0luZGV4ICsgXCIpXFxuXCJcbiAgICAgICsgaXQuZnBzICsgXCIgRlBTXFxuXCJcbiAgICAgICsgaXQudG90YWxGcmFtZXMgKyBcIiBmcmFtZXNcXG5cIlxuICAgICk7XG4gIH1cblxuICByZW5kZXIoIG5hbWUsIHBhcmFtcyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuICAgIFxuICAgIGl0LmN1cnJlbnRJbmRleCArKztcbiAgICBsZXQgdmlldyA9IHBhcnNlSW50KCBpdC5ndWkucmFuZ2UudmFsdWUgKTtcblxuICAgIGlmICggaXQuY3VycmVudEluZGV4IDw9IHZpZXcgfHwgdmlldyA9PT0gMCApIHtcbiAgICAgIGl0LnZpZXdOYW1lID0gdmlldyA9PT0gMCA/IFwiKkZ1bGwqXCIgOiBuYW1lO1xuICAgICAgaXQudmlld0luZGV4ID0gaXQuY3VycmVudEluZGV4O1xuXG4gICAgICBzdXBlci5yZW5kZXIoIG5hbWUsIHBhcmFtcyApO1xuXG4gICAgICBpZiAoIGl0LmN1cnJlbnRJbmRleCA9PT0gdmlldyApIHtcbiAgICAgICAgbGV0IHQgPSAoXG4gICAgICAgICAgcGFyYW1zICYmIHBhcmFtcy50YXJnZXRcbiAgICAgICAgICA/IHBhcmFtcy50YXJnZXRcbiAgICAgICAgICA6IGl0LnBhdGhzWyBuYW1lIF0uZnJhbWVidWZmZXJcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKCB0ICkge1xuICAgICAgICAgIGxldCBpID0gdC50ZXh0dXJlcyA/IHQudGV4dHVyZXNbIDAgXSA6IHQudGV4dHVyZTtcbiAgICAgICAgICBpZiAoIGl0LnBhcmFtcy5zdHJldGNoICkge1xuICAgICAgICAgICAgc3VwZXIucmVuZGVyKCBcIl9fUGF0aEd1aVJldHVyblwiLCB7XG4gICAgICAgICAgICAgIHRhcmdldDogaXQubnVsbEZiLFxuICAgICAgICAgICAgICBpbnB1dDogaSxcbiAgICAgICAgICAgICAgd2lkdGg6IGl0LnBhcmFtcy5jYW52YXMud2lkdGgsXG4gICAgICAgICAgICAgIGhlaWdodDogaXQucGFyYW1zLmNhbnZhcy5oZWlnaHRcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaXQucGFyYW1zLmNhbnZhcy53aWR0aCA9ICggcGFyYW1zID8gcGFyYW1zLndpZHRoIDogMCApIHx8IGl0LnBhdGhzWyBuYW1lIF0ud2lkdGggfHwgaXQucGFyYW1zLndpZHRoO1xuICAgICAgICAgICAgaXQucGFyYW1zLmNhbnZhcy5oZWlnaHQgPSAoIHBhcmFtcyA/IHBhcmFtcy5oZWlnaHQgOiAwICkgfHwgaXQucGF0aHNbIG5hbWUgXS5oZWlnaHQgfHwgaXQucGFyYW1zLmhlaWdodDtcbiAgICAgICAgICAgIHN1cGVyLnJlbmRlciggXCJfX1BhdGhHdWlSZXR1cm5cIiwge1xuICAgICAgICAgICAgICB0YXJnZXQ6IGl0Lm51bGxGYixcbiAgICAgICAgICAgICAgaW5wdXQ6IGlcbiAgICAgICAgICAgIH0gKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBhdGhHVUk7IiwiY29uc3QgZ2xzbGlmeSA9IHJlcXVpcmUoICdnbHNsaWZ5JyApO1xuXG5sZXQgcmVxdWlyZWRGaWVsZHMgPSAoIG9iamVjdCwgbmFuaXRoZWZ1Y2ssIGZpZWxkcyApID0+IHtcbiAgZmllbGRzLm1hcCggZmllbGQgPT4ge1xuICAgIGlmICggdHlwZW9mIG9iamVjdFsgZmllbGQgXSA9PT0gXCJ1bmRlZmluZWRcIiApIHtcbiAgICAgIHRocm93IFwiR0xDYXQtUGF0aDogXCIgKyBmaWVsZCArIFwiIGlzIHJlcXVpcmVkIGZvciBcIiArIG5hbml0aGVmdWNrO1xuICAgIH1cbiAgfSApO1xufTtcblxubGV0IFBhdGggPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCBnbENhdCwgcGFyYW1zICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBpdC5nbENhdCA9IGdsQ2F0O1xuICAgIGl0LmdsID0gZ2xDYXQuZ2w7XG5cbiAgICBpdC5wYXRocyA9IHt9O1xuICAgIGl0Lmdsb2JhbEZ1bmMgPSAoKSA9PiB7fTtcbiAgICBpdC5wYXJhbXMgPSBwYXJhbXMgfHwge307XG4gIH1cblxuICBhZGQoIHBhdGhzICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBmb3IgKCBsZXQgbmFtZSBpbiBwYXRocyApIHtcbiAgICAgIGxldCBwYXRoID0gcGF0aHNbIG5hbWUgXTtcbiAgICAgIHJlcXVpcmVkRmllbGRzKCBwYXRoLCBcInBhdGggb2JqZWN0XCIsIFtcbiAgICAgICAgXCJ3aWR0aFwiLFxuICAgICAgICBcImhlaWdodFwiLFxuICAgICAgICBcInZlcnRcIixcbiAgICAgICAgXCJmcmFnXCIsXG4gICAgICAgIFwiYmxlbmRcIixcbiAgICAgICAgXCJmdW5jXCJcbiAgICAgIF0gKTtcbiAgICAgIGl0LnBhdGhzWyBuYW1lIF0gPSBwYXRoO1xuXG4gICAgICBpZiAoIHR5cGVvZiBwYXRoLmRlcHRoVGVzdCA9PT0gXCJ1bmRlZmluZWRcIiApIHsgcGF0aC5kZXB0aFRlc3QgPSB0cnVlOyB9XG4gICAgICBcbiAgICAgIGlmICggcGF0aC5mcmFtZWJ1ZmZlciApIHtcbiAgICAgICAgaWYgKCBwYXRoLmRyYXdidWZmZXJzICkge1xuICAgICAgICAgIHBhdGguZnJhbWVidWZmZXIgPSBpdC5nbENhdC5jcmVhdGVEcmF3QnVmZmVycyggcGF0aC53aWR0aCwgcGF0aC5oZWlnaHQsIHBhdGguZHJhd2J1ZmZlcnMgKTtcbiAgICAgICAgfSBlbHNlIGlmICggcGF0aC5mbG9hdCApIHtcbiAgICAgICAgICBwYXRoLmZyYW1lYnVmZmVyID0gaXQuZ2xDYXQuY3JlYXRlRmxvYXRGcmFtZWJ1ZmZlciggcGF0aC53aWR0aCwgcGF0aC5oZWlnaHQgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXRoLmZyYW1lYnVmZmVyID0gaXQuZ2xDYXQuY3JlYXRlRnJhbWVidWZmZXIoIHBhdGgud2lkdGgsIHBhdGguaGVpZ2h0ICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHBhdGgucHJvZ3JhbSA9IGl0LmdsQ2F0LmNyZWF0ZVByb2dyYW0oIHBhdGgudmVydCwgcGF0aC5mcmFnICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCBuYW1lLCBwYXJhbXMgKSB7XG4gICAgbGV0IGl0ID0gdGhpcztcbiBcbiAgICBsZXQgcGF0aCA9IGl0LnBhdGhzWyBuYW1lIF07XG4gICAgaWYgKCAhcGF0aCApIHsgdGhyb3cgXCJHTENhdC1QYXRoOiBUaGUgcGF0aCBjYWxsZWQgXCIgKyBuYW1lICsgXCIgaXMgbm90IGRlZmluZWQhXCI7IH1cblxuICAgIGlmICggIXBhcmFtcyApIHsgcGFyYW1zID0ge307IH1cbiAgICBwYXJhbXMuZnJhbWVidWZmZXIgPSB0eXBlb2YgcGFyYW1zLnRhcmdldCAhPT0gXCJ1bmRlZmluZWRcIiA/IHBhcmFtcy50YXJnZXQuZnJhbWVidWZmZXIgOiBwYXRoLmZyYW1lYnVmZmVyID8gcGF0aC5mcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciA6IG51bGw7XG5cbiAgICBsZXQgd2lkdGggPSBwYXJhbXMud2lkdGggfHwgcGF0aC53aWR0aDtcbiAgICBsZXQgaGVpZ2h0ID0gcGFyYW1zLmhlaWdodCB8fCBwYXRoLmhlaWdodDtcbiAgICBcbiAgICBpdC5nbC52aWV3cG9ydCggMCwgMCwgd2lkdGgsIGhlaWdodCApO1xuICAgIGl0LmdsQ2F0LnVzZVByb2dyYW0oIHBhdGgucHJvZ3JhbSApO1xuICAgIGl0LmdsLmJpbmRGcmFtZWJ1ZmZlciggaXQuZ2wuRlJBTUVCVUZGRVIsIHBhcmFtcy5mcmFtZWJ1ZmZlciApO1xuICAgIGlmICggaXQucGFyYW1zLmRyYXdidWZmZXJzICkge1xuICAgICAgaXQuZ2xDYXQuZHJhd0J1ZmZlcnMoIHBhdGguZHJhd2J1ZmZlcnMgPyBwYXRoLmRyYXdidWZmZXJzIDogcGFyYW1zLmZyYW1lYnVmZmVyID09PSBudWxsID8gWyBpdC5nbC5CQUNLIF0gOiBbIGl0LmdsLkNPTE9SX0FUVEFDSE1FTlQwIF0gKTtcbiAgICB9XG4gICAgaXQuZ2wuYmxlbmRGdW5jKCAuLi5wYXRoLmJsZW5kICk7XG4gICAgaWYgKCBwYXRoLmNsZWFyICkgeyBpdC5nbENhdC5jbGVhciggLi4ucGF0aC5jbGVhciApOyB9XG4gICAgcGF0aC5kZXB0aFRlc3QgPyBpdC5nbC5lbmFibGUoIGl0LmdsLkRFUFRIX1RFU1QgKSA6IGl0LmdsLmRpc2FibGUoIGl0LmdsLkRFUFRIX1RFU1QgKTtcbiBcbiAgICBpdC5nbENhdC51bmlmb3JtMmZ2KCAncmVzb2x1dGlvbicsIFsgd2lkdGgsIGhlaWdodCBdICk7XG4gICAgaXQuZ2xvYmFsRnVuYyggcGF0aCwgcGFyYW1zICk7XG4gICAgcGF0aC5mdW5jKCBwYXRoLCBwYXJhbXMgKTtcbiAgfVxuXG4gIHJlc2l6ZSggbmFtZSwgd2lkdGgsIGhlaWdodCApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgbGV0IHBhdGggPSBpdC5wYXRoc1sgbmFtZSBdO1xuXG4gICAgcGF0aC53aWR0aCA9IHdpZHRoO1xuICAgIHBhdGguaGVpZ2h0ID0gaGVpZ2h0O1xuXG4gICAgaWYgKCBwYXRoLmZyYW1lYnVmZmVyICkge1xuICAgICAgaWYgKCBpdC5wYXJhbXMuZHJhd2J1ZmZlcnMgJiYgcGF0aC5kcmF3YnVmZmVycyApIHtcbiAgICAgICAgcGF0aC5mcmFtZWJ1ZmZlciA9IGl0LmdsQ2F0LmNyZWF0ZURyYXdCdWZmZXJzKCBwYXRoLndpZHRoLCBwYXRoLmhlaWdodCwgcGF0aC5kcmF3YnVmZmVycyApO1xuICAgICAgfSBlbHNlIGlmICggcGF0aC5mbG9hdCApIHtcbiAgICAgICAgaXQuZ2xDYXQucmVzaXplRmxvYXRGcmFtZWJ1ZmZlciggcGF0aC5mcmFtZWJ1ZmZlciwgcGF0aC53aWR0aCwgcGF0aC5oZWlnaHQgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGl0LmdsQ2F0LnJlc2l6ZUZyYW1lYnVmZmVyKCBwYXRoLmZyYW1lYnVmZmVyLCBwYXRoLndpZHRoLCBwYXRoLmhlaWdodCApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICggdHlwZW9mIHBhdGgub25yZXNpemUgPT09IFwiZnVuY3Rpb25cIiApIHtcbiAgICAgIHBhdGgub25yZXNpemUoIHBhdGgsIHdpZHRoLCBoZWlnaHQgKTtcbiAgICB9XG4gIH1cblxuICBzZXRHbG9iYWxGdW5jKCBmdW5jICkgeyB0aGlzLmdsb2JhbEZ1bmMgPSBmdW5jOyB9XG5cbiAgZmIoIG5hbWUgKSB7XG4gICAgaWYgKCAhdGhpcy5wYXRoc1sgbmFtZSBdICkgeyB0aHJvdyBcImdsY2F0LXBhdGguZmI6IHBhdGggY2FsbGVkIFwiICsgbmFtZSArIFwiIGlzIG5vdCBkZWZpbmVkXCI7IH1cbiAgICBpZiAoICF0aGlzLnBhdGhzWyBuYW1lIF0uZnJhbWVidWZmZXIgKSB7IHRocm93IFwiZ2xjYXQtcGF0aC5mYjogdGhlcmUgaXMgbm8gZnJhbWVidWZmZXIgZm9yIHRoZSBwYXRoIFwiICsgbmFtZTsgfVxuXG4gICAgcmV0dXJuIHRoaXMucGF0aHNbIG5hbWUgXS5mcmFtZWJ1ZmZlcjtcbiAgfVxufTtcblxuUGF0aC5udWxsRmIgPSB7IGZyYW1lYnVmZmVyOiBudWxsIH07XG5cbmV4cG9ydCBkZWZhdWx0IFBhdGg7IiwibGV0IEdMQ2F0ID0gY2xhc3Mge1xuXHRjb25zdHJ1Y3RvciggX2dsICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cblx0XHRpdC5nbCA9IF9nbDtcbiAgICBsZXQgZ2wgPSBpdC5nbDtcblxuXHQgIGdsLmVuYWJsZSggZ2wuREVQVEhfVEVTVCApO1xuXHQgIGdsLmRlcHRoRnVuYyggZ2wuTEVRVUFMICk7XG5cdCAgZ2wuZW5hYmxlKCBnbC5CTEVORCApO1xuXHQgIGdsLmJsZW5kRnVuYyggZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBICk7XG5cblx0XHRpdC5leHRlbnNpb25zID0ge307XG5cblx0XHRpdC5jdXJyZW50UHJvZ3JhbSA9IG51bGw7XG5cdH1cblxuXHRnZXRFeHRlbnNpb24oIF9uYW1lLCBfdGhyb3cgKSB7XG4gICAgbGV0IGl0ID0gdGhpcztcbiAgICBsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGlmICggdHlwZW9mIF9uYW1lID09PSBcIm9iamVjdFwiICYmIF9uYW1lLmlzQXJyYXkoKSApIHtcblx0XHRcdHJldHVybiBfbmFtZS5ldmVyeSggbmFtZSA9PiBpdC5nZXRFeHRlbnNpb24oIG5hbWUsIF90aHJvdyApICk7XG5cdFx0fSBlbHNlIGlmICggdHlwZW9mIF9uYW1lID09PSBcInN0cmluZ1wiICkge1xuXHRcdFx0aWYgKCBpdC5leHRlbnNpb25zWyBfbmFtZSBdICkge1xuXHRcdFx0XHRyZXR1cm4gaXQuZXh0ZW5zaW9uc1sgX25hbWUgXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGl0LmV4dGVuc2lvbnNbIF9uYW1lIF0gPSBnbC5nZXRFeHRlbnNpb24oIF9uYW1lICk7XG5cdFx0XHRcdGlmICggaXQuZXh0ZW5zaW9uc1sgX25hbWUgXSApIHtcblx0XHRcdFx0XHRyZXR1cm4gaXQuZXh0ZW5zaW9uc1sgX25hbWUgXTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAoIF90aHJvdyApIHtcblx0XHRcdFx0XHRcdHRocm93IGNvbnNvbGUuZXJyb3IoIFwiVGhlIGV4dGVuc2lvbiBcXFwiXCIgKyBfbmFtZSArIFwiXFxcIiBpcyBub3Qgc3VwcG9ydGVkXCIgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gISEoIGl0LmV4dGVuc2lvbnNbIF9uYW1lIF0gKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgXCJHTENhdC5nZXRFeHRlbnNpb246IF9uYW1lIG11c3QgYmUgc3RyaW5nIG9yIGFycmF5XCJcblx0XHR9XG5cdH1cblxuXHRjcmVhdGVQcm9ncmFtKCBfdmVydCwgX2ZyYWcsIF9vbkVycm9yICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgZXJyb3I7XG5cdFx0aWYgKCB0eXBlb2YgX29uRXJyb3IgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0XHRlcnJvciA9IF9vbkVycm9yO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvciA9ICggX3N0ciApID0+IHsgY29uc29sZS5lcnJvciggX3N0ciApOyB9XG5cdFx0fVxuXG5cdFx0bGV0IHZlcnQgPSBnbC5jcmVhdGVTaGFkZXIoIGdsLlZFUlRFWF9TSEFERVIgKTtcblx0XHRnbC5zaGFkZXJTb3VyY2UoIHZlcnQsIF92ZXJ0ICk7XG5cdFx0Z2wuY29tcGlsZVNoYWRlciggdmVydCApO1xuXHRcdGlmICggIWdsLmdldFNoYWRlclBhcmFtZXRlciggdmVydCwgZ2wuQ09NUElMRV9TVEFUVVMgKSApIHtcblx0XHRcdGVycm9yKCBnbC5nZXRTaGFkZXJJbmZvTG9nKCB2ZXJ0ICkgKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldCBmcmFnID0gZ2wuY3JlYXRlU2hhZGVyKCBnbC5GUkFHTUVOVF9TSEFERVIgKTtcblx0XHRnbC5zaGFkZXJTb3VyY2UoIGZyYWcsIF9mcmFnICk7XG5cdFx0Z2wuY29tcGlsZVNoYWRlciggZnJhZyApO1xuXHRcdGlmICggIWdsLmdldFNoYWRlclBhcmFtZXRlciggZnJhZywgZ2wuQ09NUElMRV9TVEFUVVMgKSApIHtcblx0XHRcdGVycm9yKCBnbC5nZXRTaGFkZXJJbmZvTG9nKCBmcmFnICkgKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGxldCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuXHRcdGdsLmF0dGFjaFNoYWRlciggcHJvZ3JhbSwgdmVydCApO1xuXHRcdGdsLmF0dGFjaFNoYWRlciggcHJvZ3JhbSwgZnJhZyApO1xuXHRcdGdsLmxpbmtQcm9ncmFtKCBwcm9ncmFtICk7XG5cdFx0aWYgKCBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKCBwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyApICkge1xuXHQgICAgcHJvZ3JhbS5sb2NhdGlvbnMgPSB7fTtcblx0XHRcdHJldHVybiBwcm9ncmFtO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRlcnJvciggZ2wuZ2V0UHJvZ3JhbUluZm9Mb2coIHByb2dyYW0gKSApO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG5cblx0dXNlUHJvZ3JhbSggX3Byb2dyYW0gKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLnVzZVByb2dyYW0oIF9wcm9ncmFtICk7XG5cdFx0aXQuY3VycmVudFByb2dyYW0gPSBfcHJvZ3JhbTtcblx0fVxuXG5cdGNyZWF0ZVZlcnRleGJ1ZmZlciggX2FycmF5ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0ICBsZXQgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cblx0XHRpZiAoIF9hcnJheSApIHsgaXQuc2V0VmVydGV4YnVmZmVyKCBidWZmZXIsIF9hcnJheSApOyB9XG5cblx0ICByZXR1cm4gYnVmZmVyO1xuXHR9XG5cblx0c2V0VmVydGV4YnVmZmVyKCBfYnVmZmVyLCBfYXJyYXkgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHQgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgX2J1ZmZlciApO1xuXHQgIGdsLmJ1ZmZlckRhdGEoIGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheSggX2FycmF5ICksIGdsLlNUQVRJQ19EUkFXICk7XG5cdCAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCBudWxsICk7XG5cblx0ICBfYnVmZmVyLmxlbmd0aCA9IF9hcnJheS5sZW5ndGg7XG5cdH1cblxuXHRjcmVhdGVJbmRleGJ1ZmZlciggX2FycmF5ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0ICBsZXQgYnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG5cblx0ICBnbC5iaW5kQnVmZmVyKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgYnVmZmVyICk7XG5cdCAgZ2wuYnVmZmVyRGF0YSggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG5ldyBJbnQxNkFycmF5KCBfYXJyYXkgKSwgZ2wuU1RBVElDX0RSQVcgKTtcblx0ICBnbC5iaW5kQnVmZmVyKCBnbC5FTEVNRU5UX0FSUkFZX0JVRkZFUiwgbnVsbCApO1xuXG5cdCAgYnVmZmVyLmxlbmd0aCA9IF9hcnJheS5sZW5ndGg7XG5cdCAgcmV0dXJuIGJ1ZmZlcjtcblx0fVxuXG5cdGdldEF0dHJpYkxvY2F0aW9uKCBfbmFtZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGxvY2F0aW9uO1xuXHQgIGlmICggaXQuY3VycmVudFByb2dyYW0ubG9jYXRpb25zWyBfbmFtZSBdICkge1xuXHQgICAgbG9jYXRpb24gPSBpdC5jdXJyZW50UHJvZ3JhbS5sb2NhdGlvbnNbIF9uYW1lIF07XG5cdCAgfSBlbHNlIHtcblx0ICAgIGxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oIGl0LmN1cnJlbnRQcm9ncmFtLCBfbmFtZSApO1xuXHQgICAgaXQuY3VycmVudFByb2dyYW0ubG9jYXRpb25zWyBfbmFtZSBdID0gbG9jYXRpb247XG5cdCAgfVxuXG5cdFx0cmV0dXJuIGxvY2F0aW9uO1xuXHR9XG5cblx0YXR0cmlidXRlKCBfbmFtZSwgX2J1ZmZlciwgX3N0cmlkZSwgX2RpdiApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0aWYgKCBfZGl2ICkge1xuXHRcdFx0aXQuZ2V0RXh0ZW5zaW9uKCBcIkFOR0xFX2luc3RhbmNlZF9hcnJheXNcIiwgdHJ1ZSApO1xuXHRcdH1cblxuXHQgIGxldCBsb2NhdGlvbiA9IGl0LmdldEF0dHJpYkxvY2F0aW9uKCBfbmFtZSApO1xuXG5cdCAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCBfYnVmZmVyICk7XG5cdCAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoIGxvY2F0aW9uICk7XG5cdCAgZ2wudmVydGV4QXR0cmliUG9pbnRlciggbG9jYXRpb24sIF9zdHJpZGUsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCApO1xuXG5cdFx0bGV0IGV4dCA9IGl0LmdldEV4dGVuc2lvbiggXCJBTkdMRV9pbnN0YW5jZWRfYXJyYXlzXCIgKTtcblx0XHRpZiAoIGV4dCApIHtcblx0XHRcdGxldCBkaXYgPSBfZGl2IHx8IDA7XG5cdFx0XHRleHQudmVydGV4QXR0cmliRGl2aXNvckFOR0xFKCBsb2NhdGlvbiwgZGl2ICk7XG5cdFx0fVxuXG5cdCAgZ2wuYmluZEJ1ZmZlciggZ2wuQVJSQVlfQlVGRkVSLCBudWxsICk7XG5cdH1cblxuXHRnZXRVbmlmb3JtTG9jYXRpb24oIF9uYW1lICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0ICBsZXQgbG9jYXRpb247XG5cblx0ICBpZiAoIGl0LmN1cnJlbnRQcm9ncmFtLmxvY2F0aW9uc1sgX25hbWUgXSApIHtcblx0XHRcdGxvY2F0aW9uID0gaXQuY3VycmVudFByb2dyYW0ubG9jYXRpb25zWyBfbmFtZSBdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRsb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbiggaXQuY3VycmVudFByb2dyYW0sIF9uYW1lICk7XG5cdFx0XHRpdC5jdXJyZW50UHJvZ3JhbS5sb2NhdGlvbnNbIF9uYW1lIF0gPSBsb2NhdGlvbjtcblx0XHR9XG5cblx0ICByZXR1cm4gbG9jYXRpb247XG5cdH1cblxuXHR1bmlmb3JtMWkoIF9uYW1lLCBfdmFsdWUgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbiA9IGl0LmdldFVuaWZvcm1Mb2NhdGlvbiggX25hbWUgKTtcblx0XHRnbC51bmlmb3JtMWkoIGxvY2F0aW9uLCBfdmFsdWUgKTtcblx0fVxuXG5cdHVuaWZvcm0xZiggX25hbWUsIF92YWx1ZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gaXQuZ2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApO1xuXHRcdGdsLnVuaWZvcm0xZiggbG9jYXRpb24sIF92YWx1ZSApO1xuXHR9XG5cblx0dW5pZm9ybTJmdiggX25hbWUsIF92YWx1ZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gaXQuZ2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApO1xuXHRcdGdsLnVuaWZvcm0yZnYoIGxvY2F0aW9uLCBfdmFsdWUgKTtcblx0fVxuXG5cdHVuaWZvcm0zZnYoIF9uYW1lLCBfdmFsdWUgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbiA9IGl0LmdldFVuaWZvcm1Mb2NhdGlvbiggX25hbWUgKTtcblx0XHRnbC51bmlmb3JtM2Z2KCBsb2NhdGlvbiwgX3ZhbHVlICk7XG5cdH1cblxuXHR1bmlmb3JtNGZ2KCBfbmFtZSwgX3ZhbHVlICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgbG9jYXRpb24gPSBpdC5nZXRVbmlmb3JtTG9jYXRpb24oIF9uYW1lICk7XG5cdFx0Z2wudW5pZm9ybTRmdiggbG9jYXRpb24sIF92YWx1ZSApO1xuXHR9XG5cblx0dW5pZm9ybU1hdHJpeDRmdiggX25hbWUsIF92YWx1ZSwgX3RyYW5zcG9zZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gaXQuZ2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApO1xuXHRcdGdsLnVuaWZvcm1NYXRyaXg0ZnYoIGxvY2F0aW9uLCBfdHJhbnNwb3NlIHx8IGZhbHNlLCBfdmFsdWUgKTtcblx0fVxuXG5cdHVuaWZvcm1DdWJlbWFwKCBfbmFtZSwgX3RleHR1cmUsIF9udW1iZXIgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbiA9IGl0LmdldFVuaWZvcm1Mb2NhdGlvbiggX25hbWUgKTtcblx0ICBnbC5hY3RpdmVUZXh0dXJlKCBnbC5URVhUVVJFMCArIF9udW1iZXIgKTtcblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgX3RleHR1cmUgKTtcblx0ICBnbC51bmlmb3JtMWkoIGxvY2F0aW9uLCBfbnVtYmVyICk7XG5cdH1cblxuXHR1bmlmb3JtVGV4dHVyZSggX25hbWUsIF90ZXh0dXJlLCBfbnVtYmVyICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgbG9jYXRpb24gPSBpdC5nZXRVbmlmb3JtTG9jYXRpb24oIF9uYW1lICk7XG5cdCAgZ2wuYWN0aXZlVGV4dHVyZSggZ2wuVEVYVFVSRTAgKyBfbnVtYmVyICk7XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF90ZXh0dXJlICk7XG5cdCAgZ2wudW5pZm9ybTFpKCBsb2NhdGlvbiwgX251bWJlciApO1xuXHR9XG5cblx0Y3JlYXRlVGV4dHVyZSgpIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIHRleHR1cmUgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUiApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfTUlOX0ZJTFRFUiwgZ2wuTElORUFSICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSApO1xuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cblx0XHRyZXR1cm4gdGV4dHVyZTtcblx0fVxuXG5cdHRleHR1cmVGaWx0ZXIoIF90ZXh0dXJlLCBfZmlsdGVyICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX3RleHR1cmUgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01BR19GSUxURVIsIF9maWx0ZXIgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIF9maWx0ZXIgKTtcblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXHR9XG5cblx0dGV4dHVyZVdyYXAoIF90ZXh0dXJlLCBfd3JhcCApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF90ZXh0dXJlICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1MsIF93cmFwICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIF93cmFwICk7XG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblx0fVxuXG5cdHNldFRleHR1cmUoIF90ZXh0dXJlLCBfaW1hZ2UgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfdGV4dHVyZSApO1xuXHRcdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIF9pbWFnZSApO1xuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cdH1cblxuXHRzZXRUZXh0dXJlRnJvbUFycmF5KCBfdGV4dHVyZSwgX3dpZHRoLCBfaGVpZ2h0LCBfYXJyYXkgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfdGV4dHVyZSApO1xuXHRcdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIF93aWR0aCwgX2hlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbmV3IFVpbnQ4QXJyYXkoIF9hcnJheSApICk7XG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblx0fVxuXG5cdHNldFRleHR1cmVGcm9tRmxvYXRBcnJheSggX3RleHR1cmUsIF93aWR0aCwgX2hlaWdodCwgX2FycmF5ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRpdC5nZXRFeHRlbnNpb24oIFwiT0VTX3RleHR1cmVfZmxvYXRcIiwgdHJ1ZSApO1xuXG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF90ZXh0dXJlICk7XG5cdFx0Z2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgX3dpZHRoLCBfaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5GTE9BVCwgbmV3IEZsb2F0MzJBcnJheSggX2FycmF5ICkgKTtcblx0XHRpZiAoICFpdC5nZXRFeHRlbnNpb24oIFwiT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyXCIgKSApIHsgaXQudGV4dHVyZUZpbHRlciggX3RleHR1cmUsIGdsLk5FQVJFU1QgKTsgfVxuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cdH1cblxuXHRjb3B5VGV4dHVyZSggX3RleHR1cmUsIF93aWR0aCwgX2hlaWdodCApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF90ZXh0dXJlICk7XG5cdFx0Z2wuY29weVRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIDAsIDAsIF93aWR0aCwgX2hlaWdodCwgMCApO1xuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cdH1cblxuXHRjcmVhdGVDdWJlbWFwKCBfYXJyYXlPZkltYWdlICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHQvLyBvcmRlciA6IFgrLCBYLSwgWSssIFktLCBaKywgWi1cblx0XHRsZXQgdGV4dHVyZSA9IGdsLmNyZWF0ZVRleHR1cmUoKTtcblxuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFX0NVQkVfTUFQLCB0ZXh0dXJlICk7XG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgNjsgaSArKyApIHtcblx0XHRcdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfQ1VCRV9NQVBfUE9TSVRJVkVfWCArIGksIDAsIGdsLlJHQkEsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIF9hcnJheU9mSW1hZ2VbIGkgXSApO1xuXHRcdH1cblx0XHRnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUiApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfTUFHX0ZJTFRFUiwgZ2wuTElORUFSICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1MsIGdsLkNMQU1QX1RPX0VER0UgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX1dSQVBfVCwgZ2wuQ0xBTVBfVE9fRURHRSApO1xuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFX0NVQkVfTUFQLCBudWxsICk7XG5cblx0XHRyZXR1cm4gdGV4dHVyZTtcblx0fVxuXG5cdGNyZWF0ZUZyYW1lYnVmZmVyKCBfd2lkdGgsIF9oZWlnaHQgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHQgIGxldCBmcmFtZWJ1ZmZlciA9IHt9O1xuXHRcdGZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0ICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciApO1xuXG5cdFx0ZnJhbWVidWZmZXIuZGVwdGggPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcblx0XHRnbC5iaW5kUmVuZGVyYnVmZmVyKCBnbC5SRU5ERVJCVUZGRVIsIGZyYW1lYnVmZmVyLmRlcHRoICk7XG5cdFx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZSggZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgX3dpZHRoLCBfaGVpZ2h0ICk7XG5cdCAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIGZyYW1lYnVmZmVyLmRlcHRoICk7XG5cblx0XHRmcmFtZWJ1ZmZlci50ZXh0dXJlID0gaXQuY3JlYXRlVGV4dHVyZSgpO1xuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBmcmFtZWJ1ZmZlci50ZXh0dXJlICk7XG5cdCAgZ2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgX3dpZHRoLCBfaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsICk7XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblxuXHQgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKCBnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIGZyYW1lYnVmZmVyLnRleHR1cmUsIDAgKTtcblx0ICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBudWxsICk7XG5cblx0ICByZXR1cm4gZnJhbWVidWZmZXI7XG5cdH1cblxuXHRyZXNpemVGcmFtZWJ1ZmZlciggX2ZyYW1lYnVmZmVyLCBfd2lkdGgsIF9oZWlnaHQgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIF9mcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciApO1xuXG5cdFx0Z2wuYmluZFJlbmRlcmJ1ZmZlciggZ2wuUkVOREVSQlVGRkVSLCBfZnJhbWVidWZmZXIuZGVwdGggKTtcblx0XHRnbC5yZW5kZXJidWZmZXJTdG9yYWdlKCBnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCBfd2lkdGgsIF9oZWlnaHQgKTtcblx0XHRnbC5iaW5kUmVuZGVyYnVmZmVyKCBnbC5SRU5ERVJCVUZGRVIsIG51bGwgKTtcblx0XHRcblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX2ZyYW1lYnVmZmVyLnRleHR1cmUgKTtcblx0XHRnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBfd2lkdGgsIF9oZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIG51bGwgKTtcblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXHRcdFxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIG51bGwgKTtcblx0fVxuXG5cdGNyZWF0ZUZsb2F0RnJhbWVidWZmZXIoIF93aWR0aCwgX2hlaWdodCApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0aXQuZ2V0RXh0ZW5zaW9uKCBcIk9FU190ZXh0dXJlX2Zsb2F0XCIsIHRydWUgKTtcblxuXHQgIGxldCBmcmFtZWJ1ZmZlciA9IHt9O1xuXHRcdGZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyID0gZ2wuY3JlYXRlRnJhbWVidWZmZXIoKTtcblx0ICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBmcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciApO1xuXG5cdFx0ZnJhbWVidWZmZXIuZGVwdGggPSBnbC5jcmVhdGVSZW5kZXJidWZmZXIoKTtcblx0XHRnbC5iaW5kUmVuZGVyYnVmZmVyKCBnbC5SRU5ERVJCVUZGRVIsIGZyYW1lYnVmZmVyLmRlcHRoICk7XG5cdFx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZSggZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgX3dpZHRoLCBfaGVpZ2h0ICk7XG5cdCAgZ2wuZnJhbWVidWZmZXJSZW5kZXJidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBnbC5ERVBUSF9BVFRBQ0hNRU5ULCBnbC5SRU5ERVJCVUZGRVIsIGZyYW1lYnVmZmVyLmRlcHRoICk7XG5cblx0XHRmcmFtZWJ1ZmZlci50ZXh0dXJlID0gaXQuY3JlYXRlVGV4dHVyZSgpO1xuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBmcmFtZWJ1ZmZlci50ZXh0dXJlICk7XG5cdCAgZ2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgX3dpZHRoLCBfaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5GTE9BVCwgbnVsbCApO1xuXHRcdGlmICggIWl0LmdldEV4dGVuc2lvbiggXCJPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXJcIiApICkgeyBpdC50ZXh0dXJlRmlsdGVyKCBmcmFtZWJ1ZmZlci50ZXh0dXJlLCBnbC5ORUFSRVNUICk7IH1cblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXG5cdCAgZ2wuZnJhbWVidWZmZXJUZXh0dXJlMkQoIGdsLkZSQU1FQlVGRkVSLCBnbC5DT0xPUl9BVFRBQ0hNRU5UMCwgZ2wuVEVYVFVSRV8yRCwgZnJhbWVidWZmZXIudGV4dHVyZSwgMCApO1xuXHQgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIG51bGwgKTtcblxuXHQgIHJldHVybiBmcmFtZWJ1ZmZlcjtcblx0fVxuXG5cdHJlc2l6ZUZsb2F0RnJhbWVidWZmZXIoIF9mcmFtZWJ1ZmZlciwgX3dpZHRoLCBfaGVpZ2h0ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBfZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgKTtcblxuXHRcdGdsLmJpbmRSZW5kZXJidWZmZXIoIGdsLlJFTkRFUkJVRkZFUiwgX2ZyYW1lYnVmZmVyLmRlcHRoICk7XG5cdFx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZSggZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgX3dpZHRoLCBfaGVpZ2h0ICk7XG5cdFx0Z2wuYmluZFJlbmRlcmJ1ZmZlciggZ2wuUkVOREVSQlVGRkVSLCBudWxsICk7XG5cdFx0XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF9mcmFtZWJ1ZmZlci50ZXh0dXJlICk7XG5cdFx0Z2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgX3dpZHRoLCBfaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5GTE9BVCwgbnVsbCApO1xuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cdFx0XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgbnVsbCApO1xuXHR9XG5cblx0Y3JlYXRlRHJhd0J1ZmZlcnMoIF93aWR0aCwgX2hlaWdodCwgX251bURyYXdCdWZmZXJzICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRpdC5nZXRFeHRlbnNpb24oICdPRVNfdGV4dHVyZV9mbG9hdCcsIHRydWUgKTtcblx0XHRsZXQgZXh0ID0gaXQuZ2V0RXh0ZW5zaW9uKCAnV0VCR0xfZHJhd19idWZmZXJzJywgdHJ1ZSApO1xuXG5cdFx0aWYgKCBleHQuTUFYX0RSQVdfQlVGRkVSU19XRUJHTCA8IF9udW1EcmF3QnVmZmVycyApIHtcblx0XHRcdHRocm93IFwiY3JlYXRlRHJhd0J1ZmZlcnM6IE1BWF9EUkFXX0JVRkZFUlNfV0VCR0wgaXMgXCIgKyBleHQuTUFYX0RSQVdfQlVGRkVSU19XRUJHTDtcblx0XHR9XG5cblx0XHRsZXQgZnJhbWVidWZmZXIgPSB7fTtcblx0XHRmcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgKTtcblxuXHRcdGZyYW1lYnVmZmVyLmRlcHRoID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKCk7XG5cdFx0Z2wuYmluZFJlbmRlcmJ1ZmZlciggZ2wuUkVOREVSQlVGRkVSLCBmcmFtZWJ1ZmZlci5kZXB0aCApO1xuXHRcdGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoIGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfQ09NUE9ORU5UMTYsIF93aWR0aCwgX2hlaWdodCApO1xuXHRcdGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCBmcmFtZWJ1ZmZlci5kZXB0aCApO1xuXG5cdFx0ZnJhbWVidWZmZXIudGV4dHVyZXMgPSBbXTtcblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBfbnVtRHJhd0J1ZmZlcnM7IGkgKysgKSB7XG5cdFx0XHRmcmFtZWJ1ZmZlci50ZXh0dXJlc1sgaSBdID0gaXQuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIGZyYW1lYnVmZmVyLnRleHR1cmVzWyBpIF0gKTtcblx0XHRcdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIF93aWR0aCwgX2hlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuRkxPQVQsIG51bGwgKTtcblx0XHRcdGlmICggIWl0LmdldEV4dGVuc2lvbiggXCJPRVNfdGV4dHVyZV9mbG9hdF9saW5lYXJcIiApICkgeyBpdC50ZXh0dXJlRmlsdGVyKCBmcmFtZWJ1ZmZlci50ZXh0dXJlc1sgaSBdLCBnbC5ORUFSRVNUICk7IH1cblx0XHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cblx0XHQgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKCBnbC5GUkFNRUJVRkZFUiwgZXh0LkNPTE9SX0FUVEFDSE1FTlQwX1dFQkdMICsgaSwgZ2wuVEVYVFVSRV8yRCwgZnJhbWVidWZmZXIudGV4dHVyZXNbIGkgXSwgMCApO1xuXHRcdH1cblxuXHRcdGxldCBzdGF0dXMgPSBnbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKCBnbC5GUkFNRUJVRkZFUiApO1xuXHRcdGlmICggc3RhdHVzICE9PSBnbC5GUkFNRUJVRkZFUl9DT01QTEVURSApIHtcblx0XHRcdHRocm93IFwiY3JlYXRlRHJhd0J1ZmZlcnM6IGdsLmNoZWNrRnJhbWVidWZmZXJTdGF0dXMoIGdsLkZSQU1FQlVGRkVSICkgcmV0dXJucyBcIiArIHN0YXR1cztcblx0XHR9XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgbnVsbCApO1xuXG5cdFx0cmV0dXJuIGZyYW1lYnVmZmVyO1xuXHR9XG5cblx0cmVzaXplRHJhd0J1ZmZlcnMoIF9mcmFtZWJ1ZmZlciwgX3dpZHRoLCBoZWlnaHQgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIF9mcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciApO1xuXG5cdFx0Z2wuYmluZFJlbmRlcmJ1ZmZlciggZ2wuUkVOREVSQlVGRkVSLCBfZnJhbWVidWZmZXIuZGVwdGggKTtcblx0XHRnbC5yZW5kZXJidWZmZXJTdG9yYWdlKCBnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCBfd2lkdGgsIF9oZWlnaHQgKTtcblx0XHRnbC5iaW5kUmVuZGVyYnVmZmVyKCBnbC5SRU5ERVJCVUZGRVIsIG51bGwgKTtcblx0XHRcblx0XHRmb3IgKCBsZXQgaSA9IDA7IGkgPCBfZnJhbWVidWZmZXIudGV4dHVyZXMubGVuZ3RoOyBpICsrICkge1xuXHRcdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF9mcmFtZWJ1ZmZlci50ZXh0dXJlc1sgaSBdICk7XG5cdFx0XHRnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBfd2lkdGgsIF9oZWlnaHQsIDAsIGdsLlJHQkEsIGdsLkZMT0FULCBudWxsICk7XG5cdFx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXHRcdH1cblx0XHRcblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBudWxsICk7XG5cdH1cblxuXHRkcmF3QnVmZmVycyggX251bURyYXdCdWZmZXJzICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cdFx0XG5cdFx0bGV0IGV4dCA9IGl0LmdldEV4dGVuc2lvbiggXCJXRUJHTF9kcmF3X2J1ZmZlcnNcIiwgdHJ1ZSApO1xuXG5cdFx0bGV0IGFycmF5ID0gW107XG5cdFx0aWYgKCB0eXBlb2YgX251bURyYXdCdWZmZXJzID09PSBcIm51bWJlclwiICkge1xuXHRcdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgX251bURyYXdCdWZmZXJzOyBpICsrICkge1xuXHRcdFx0XHRhcnJheS5wdXNoKCBleHQuQ09MT1JfQVRUQUNITUVOVDBfV0VCR0wgKyBpICk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdGFycmF5ID0gYXJyYXkuY29uY2F0KCBfbnVtRHJhd0J1ZmZlcnMgKTtcblx0XHR9XG5cdFx0ZXh0LmRyYXdCdWZmZXJzV0VCR0woIGFycmF5ICk7XG5cdH1cblxuXHRjbGVhciggX3IsIF9nLCBfYiwgX2EsIF9kICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgciA9IF9yIHx8IDAuMDtcblx0XHRsZXQgZyA9IF9nIHx8IDAuMDtcblx0XHRsZXQgYiA9IF9iIHx8IDAuMDtcblx0XHRsZXQgYSA9IHR5cGVvZiBfYSA9PT0gJ251bWJlcicgPyBfYSA6IDEuMDtcblx0XHRsZXQgZCA9IHR5cGVvZiBfZCA9PT0gJ251bWJlcicgPyBfZCA6IDEuMDtcblxuXHQgIGdsLmNsZWFyQ29sb3IoIHIsIGcsIGIsIGEgKTtcblx0ICBnbC5jbGVhckRlcHRoKCBkICk7XG5cdCAgZ2wuY2xlYXIoIGdsLkNPTE9SX0JVRkZFUl9CSVQgfCBnbC5ERVBUSF9CVUZGRVJfQklUICk7XG5cdH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdMQ2F0O1xuIiwibGV0IHN0ZXAgPSAoIF9vYmogKSA9PiB7XG4gIGxldCBvYmogPSBfb2JqO1xuICBsZXQgY291bnQgPSAtMTtcblxuICBsZXQgZnVuYyA9ICgpID0+IHtcbiAgICBjb3VudCArKztcbiAgICBpZiAoIHR5cGVvZiBvYmpbIGNvdW50IF0gPT09ICdmdW5jdGlvbicgKSB7XG4gICAgICBvYmpbIGNvdW50IF0oIGZ1bmMgKTtcbiAgICB9XG4gIH07XG4gIGZ1bmMoKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHN0ZXA7XG4iLCJsZXQgVHdlYWsgPSBjbGFzcyB7XG4gIGNvbnN0cnVjdG9yKCBfZWwgKSB7XG4gICAgbGV0IGl0ID0gdGhpcztcblxuICAgIGl0LnBhcmVudCA9IF9lbDtcbiAgICBpdC52YWx1ZXMgPSB7fTtcbiAgICBpdC5lbGVtZW50cyA9IHt9O1xuICB9XG5cbiAgYnV0dG9uKCBfbmFtZSwgX3Byb3BzICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBsZXQgcHJvcHMgPSBfcHJvcHMgfHwge307XG5cbiAgICBpZiAoIHR5cGVvZiBpdC52YWx1ZXNbIF9uYW1lIF0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgICBpdC5wYXJlbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXG4gICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoIGlucHV0ICk7XG4gICAgICBpbnB1dC50eXBlID0gJ2J1dHRvbic7XG4gICAgICBpbnB1dC52YWx1ZSA9IF9uYW1lO1xuXG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCAnY2xpY2snLCAoKSA9PiB7XG4gICAgICAgIGl0LnZhbHVlc1sgX25hbWUgXSA9IHRydWU7XG4gICAgICB9ICk7XG5cbiAgICAgIGl0LmVsZW1lbnRzWyBfbmFtZSBdID0ge1xuICAgICAgICBkaXY6IGRpdixcbiAgICAgICAgaW5wdXQ6IGlucHV0XG4gICAgICB9O1xuICAgIH1cblxuICAgIGxldCB0ZW1wdmFsdWUgPSBpdC52YWx1ZXNbIF9uYW1lIF07XG4gICAgaXQudmFsdWVzWyBfbmFtZSBdID0gZmFsc2U7XG4gICAgaWYgKCB0eXBlb2YgcHJvcHMuc2V0ID09PSAnYm9vbGVhbicgKSB7XG4gICAgICBpdC52YWx1ZXNbIF9uYW1lIF0gPSBwcm9wcy5zZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRlbXB2YWx1ZTtcbiAgfVxuXG4gIGNoZWNrYm94KCBfbmFtZSwgX3Byb3BzICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBsZXQgcHJvcHMgPSBfcHJvcHMgfHwge307XG5cbiAgICBsZXQgdmFsdWU7XG5cbiAgICBpZiAoIHR5cGVvZiBpdC52YWx1ZXNbIF9uYW1lIF0gPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgdmFsdWUgPSBwcm9wcy52YWx1ZSB8fCBmYWxzZTtcblxuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgICBpdC5wYXJlbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXG4gICAgICBsZXQgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKCBuYW1lICk7XG4gICAgICBuYW1lLmlubmVyVGV4dCA9IF9uYW1lO1xuXG4gICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoIGlucHV0ICk7XG4gICAgICBpbnB1dC50eXBlID0gJ2NoZWNrYm94JztcbiAgICAgIGlucHV0LmNoZWNrZWQgPSB2YWx1ZTtcblxuICAgICAgaXQuZWxlbWVudHNbIF9uYW1lIF0gPSB7XG4gICAgICAgIGRpdjogZGl2LFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBpbnB1dDogaW5wdXRcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlID0gaXQuZWxlbWVudHNbIF9uYW1lIF0uaW5wdXQuY2hlY2tlZDtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiBwcm9wcy5zZXQgPT09ICdib29sZWFuJyApIHtcbiAgICAgIHZhbHVlID0gcHJvcHMuc2V0O1xuICAgIH1cblxuICAgIGl0LmVsZW1lbnRzWyBfbmFtZSBdLmlucHV0LmNoZWNrZWQgPSB2YWx1ZTtcbiAgICBpdC52YWx1ZXNbIF9uYW1lIF0gPSB2YWx1ZTtcblxuICAgIHJldHVybiBpdC52YWx1ZXNbIF9uYW1lIF07XG4gIH1cblxuICByYW5nZSggX25hbWUsIF9wcm9wcyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgbGV0IHByb3BzID0gX3Byb3BzIHx8IHt9O1xuXG4gICAgbGV0IHZhbHVlO1xuXG4gICAgaWYgKCB0eXBlb2YgaXQudmFsdWVzWyBfbmFtZSBdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIGxldCBtaW4gPSBwcm9wcy5taW4gfHwgMC4wO1xuICAgICAgbGV0IG1heCA9IHByb3BzLm1heCB8fCAxLjA7XG4gICAgICBsZXQgc3RlcCA9IHByb3BzLnN0ZXAgfHwgMC4wMDE7XG4gICAgICB2YWx1ZSA9IHByb3BzLnZhbHVlIHx8IG1pbjtcblxuICAgICAgbGV0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdkaXYnICk7XG4gICAgICBpdC5wYXJlbnQuYXBwZW5kQ2hpbGQoIGRpdiApO1xuXG4gICAgICBsZXQgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKCBuYW1lICk7XG4gICAgICBuYW1lLmlubmVyVGV4dCA9IF9uYW1lO1xuXG4gICAgICBsZXQgaW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnaW5wdXQnICk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoIGlucHV0ICk7XG4gICAgICBpbnB1dC50eXBlID0gJ3JhbmdlJztcbiAgICAgIGlucHV0LnZhbHVlID0gdmFsdWU7XG4gICAgICBpbnB1dC5taW4gPSBtaW47XG4gICAgICBpbnB1dC5tYXggPSBtYXg7XG4gICAgICBpbnB1dC5zdGVwID0gc3RlcDtcblxuICAgICAgbGV0IHZhbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdzcGFuJyApO1xuICAgICAgdmFsLmlubmVyVGV4dCA9IHZhbHVlLnRvRml4ZWQoIDMgKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZCggdmFsICk7XG4gICAgICBpbnB1dC5hZGRFdmVudExpc3RlbmVyKCAnaW5wdXQnLCAoIF9ldmVudCApID0+IHtcbiAgICAgICAgbGV0IHZhbHVlID0gcGFyc2VGbG9hdCggaW5wdXQudmFsdWUgKTtcbiAgICAgICAgdmFsLmlubmVyVGV4dCA9IHZhbHVlLnRvRml4ZWQoIDMgKTtcbiAgICAgIH0gKTtcblxuICAgICAgaXQuZWxlbWVudHNbIF9uYW1lIF0gPSB7XG4gICAgICAgIGRpdjogZGl2LFxuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBpbnB1dDogaW5wdXQsXG4gICAgICAgIHZhbDogdmFsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IHBhcnNlRmxvYXQoIGl0LmVsZW1lbnRzWyBfbmFtZSBdLmlucHV0LnZhbHVlICk7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgcHJvcHMuc2V0ID09PSAnbnVtYmVyJyApIHtcbiAgICAgIHZhbHVlID0gcHJvcHMuc2V0O1xuICAgIH1cblxuICAgIGl0LnZhbHVlc1sgX25hbWUgXSA9IHZhbHVlO1xuICAgIGl0LmVsZW1lbnRzWyBfbmFtZSBdLmlucHV0LnZhbHVlID0gdmFsdWU7XG5cbiAgICByZXR1cm4gaXQudmFsdWVzWyBfbmFtZSBdO1xuICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgVHdlYWs7XG4iLCJsZXQgc2VlZDtcbmxldCB4b3JzaGlmdCA9ICggX3NlZWQgKSA9PiB7XG4gIHNlZWQgPSBfc2VlZCB8fCBzZWVkIHx8IDE7XG4gIHNlZWQgPSBzZWVkIF4gKCBzZWVkIDw8IDEzICk7XG4gIHNlZWQgPSBzZWVkIF4gKCBzZWVkID4+PiAxNyApO1xuICBzZWVkID0gc2VlZCBeICggc2VlZCA8PCA1ICk7XG4gIHJldHVybiBzZWVkIC8gTWF0aC5wb3coIDIsIDMyICkgKyAwLjU7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB4b3JzaGlmdDtcbiIsImltcG9ydCB4b3JzaGlmdCBmcm9tICcuL2xpYi94b3JzaGlmdCc7XG5pbXBvcnQgR0xDYXQgZnJvbSAnLi9saWIvZ2xjYXQnO1xuaW1wb3J0IENhdE1hdGggZnJvbSAnLi9saWIvY2F0bWF0aCc7XG5pbXBvcnQgUGF0aCBmcm9tICcuL2xpYi9nbGNhdC1wYXRoLWd1aSc7XG5pbXBvcnQgc3RlcCBmcm9tICcuL2xpYi9zdGVwJztcbmltcG9ydCBUd2VhayBmcm9tICcuL2xpYi90d2Vhayc7XG5cbmltcG9ydCBvY3RhaGVkcm9uIGZyb20gJy4vb2N0YWhlZHJvbic7XG5pbXBvcnQgbW9uaXRvclJlY292ZXIgZnJvbSAnLi9tb25pdG9yLXJlY292ZXInO1xuaW1wb3J0IHsgZmFpbCB9IGZyb20gJ2Fzc2VydCc7XG5cbmNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCAnZ2xzbGlmeScgKTtcblxuLy8gLS0tLS0tXG5cbnhvcnNoaWZ0KCAzNDc4OTUwMTc0NTg5MDYgKTtcblxuY29uc3QgY2xhbXAgPSAoIF92YWx1ZSwgX21pbiwgX21heCApID0+IE1hdGgubWluKCBNYXRoLm1heCggX3ZhbHVlLCBfbWluICksIF9tYXggKTtcbmNvbnN0IHNhdHVyYXRlID0gKCBfdmFsdWUgKSA9PiBjbGFtcCggX3ZhbHVlLCAwLjAsIDEuMCApO1xuXG4vLyAtLS0tLS1cblxubGV0IGZyYW1lcyA9IDIwMDtcbmxldCBhdXRvbWF0b24gPSBuZXcgQXV0b21hdG9uKCB7XG4gIGd1aTogZGl2QXV0b21hdG9uLFxuICBmcHM6IGZyYW1lcyxcbiAgZGF0YTogYFxuICB7XCJyZXZcIjoyMDE3MDQxOCxcImxlbmd0aFwiOjEsXCJyZXNvbHV0aW9uXCI6MTAwMCxcInBhcmFtc1wiOntcImNhbWVyYVJvdFwiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo1MDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwiZm9jdXNcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjEuODQ5MDAyNTExMTYwNzEzLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC4wNzk1MTA3MDMzNjM5MTQzNyxcInZhbHVlXCI6MTYuMzE3Nzc5MTI3NzU2NzUsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo4Ny41MSxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC4yNTg5MTk0Njk5Mjg2NDQyMyxcInZhbHVlXCI6NS42ODQ2NTUzMjEyMTIwNDEsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo4Ny41MSxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC40OTIzNTQ3NDAwNjExNjIxLFwidmFsdWVcIjo5LjQyODE5MzA0NjkzMzEyOCxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjg3LjUxLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjc5ODE2NTEzNzYxNDY3ODksXCJ2YWx1ZVwiOjYuMTEwMTM1ODI5Mzc3NzYxLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6ODcuNTEsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjIuNTc3NTUxOTQxNzg2NTI0LFwibW9kZVwiOjIsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJjYW1lcmFYXCI6W3tcInRpbWVcIjowLFwidmFsdWVcIjoxLjU4MDI2NDQ4NjU4NTM0NixcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuODMxODA0MjgxMzQ1NTY1NyxcInZhbHVlXCI6OS44MTkwNjMzOTE0MTczNDEsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjoxOCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MSxcInZhbHVlXCI6LTExLjgzNzM2ODk1MTUyNTAxLFwibW9kZVwiOjUsXCJwYXJhbXNcIjp7XCJncmF2aXR5XCI6NDIwLFwiYm91bmNlXCI6MC4zfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJjYW1lcmFZXCI6W3tcInRpbWVcIjowLFwidmFsdWVcIjowLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MSxcInZhbHVlXCI6Mi4xMTc3ODYyOTg3MjYyOCxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjgsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwiY2FtZXJhWlwiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6MzguMzQ5NjkwNjA2NjU3OTYsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjI1NzkwMDEwMTkzNjc5OTIsXCJ2YWx1ZVwiOjEzLjE1MzQ5MTgyMTE0MDA2MixcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjUwMCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC44Mjk0NTk3MzQ5NjQzMjIsXCJ2YWx1ZVwiOjQuMzI4MzkxNTQ0MjQyNTU4NSxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjI4LjM2LFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjotOS45MDI0MTY3MDU1NTMwMTcsXCJtb2RlXCI6NSxcInBhcmFtc1wiOntcImdyYXZpdHlcIjoxMTAuMDg2LFwiYm91bmNlXCI6MC4zfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJjYW1lcmFUWFwiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo1MDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W3tcInZlbG9jaXR5XCI6MH0sZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJjYW1lcmFUWVwiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo1MDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W3tcInZlbG9jaXR5XCI6MH0sZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJjYW1lcmFUWlwiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19XSxcIm1vc2hUaHJlc2hvbGRcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAuOTU4OTM3MDM4MTczNTY2NyxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuMDc4NDkxMzM1MzcyMDY5MzcsXCJ2YWx1ZVwiOjAuMDA0NzYxOTA0NzYxOTA0NzQ1LFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NzUwMC4wNDIsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuMDkyNzYyNDg3MjU3OTAwMTEsXCJ2YWx1ZVwiOi0wLjAyMzgwOTUyMzgwOTUyMzgzNixcIm1vZGVcIjoyLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W3tcInZlbG9jaXR5XCI6MH0sZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC41MTc4Mzg5Mzk4NTcyODg1LFwidmFsdWVcIjowLFwibW9kZVwiOjIsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbe1widmVsb2NpdHlcIjowfSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjc1NzM5MDQxNzk0MDg3NjcsXCJ2YWx1ZVwiOjAuMjY1NDM2OTUzNTkwMDI5NCxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjI0MCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MSxcInZhbHVlXCI6MS40MTIzNTgyMjU0NTYzMDYsXCJtb2RlXCI6NSxcInBhcmFtc1wiOntcImdyYXZpdHlcIjozMSxcImJvdW5jZVwiOjAuM30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwicmVjb3ZlckJhclwiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6MC4yMDk1MjM4MDk1MjM4MDk1NixcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuMDU3MDg0NjA3NTQzMzIzMTQsXCJ2YWx1ZVwiOjAuMjE0Mjg1NzE0Mjg1NzE0MixcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuMTUwODY2NDYyNzkzMDY4MjgsXCJ2YWx1ZVwiOjEuMDE5MDQ3NjE5MDQ3NjE5LFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NDMwMCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC45MDAxMDE5MzY3OTkxODQ1LFwidmFsdWVcIjowLFwibW9kZVwiOjAsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MSxcInZhbHVlXCI6MC4wNDc2MTkwNDc2MTkwNDc2NyxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwicmVjb3ZlckNsb3NlXCI6W3tcInRpbWVcIjowLFwidmFsdWVcIjowLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC4yMjIyMjIyMjIyMjIyMjIyLFwidmFsdWVcIjowLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC41ODMwNzg0OTEzMzUzNzIsXCJ2YWx1ZVwiOjAuOTk1MjM4MDk1MjM4MDk1MSxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjU4MDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuOTAxMTIxMzA0NzkxMDI5NixcInZhbHVlXCI6MSxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjoyOTAwMCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJjaXJjbGVSYWRpdXNcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjEwOTA3MjM3NTEyNzQyMSxcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuODk3OTgwNjMyMDA4MTU0OSxcInZhbHVlXCI6MC41Mzg2NzE4NzQ5OTk5OTk3LFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6MzAwMCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MSxcInZhbHVlXCI6MCxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjEzMDAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19XSxcImNpcmNsZVNwaW5cIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjA2OTMxNzAyMzQ0NTQ2MzgxLFwidmFsdWVcIjowLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC40ODgyNzcyNjgwOTM3ODE4NixcInZhbHVlXCI6MS43MTg0MTUxNzg1NzE0MjcyLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6OTMsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjIuMDMxMzMzNzA1MzU3MTQyNSxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwibWV0YWJhbGxSYWRpdXNcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOi0wLjkyMTQyODU3MTQyODU3MTUsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjE1NTk2MzMwMjc1MjI5MzYsXCJ2YWx1ZVwiOi0wLjg3OTc2MTkwNDc2MTkwNDYsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjMyMDA4MTU0OTQzOTM0NzYsXCJ2YWx1ZVwiOjEsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo1ODAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjg3ODY5NTIwODk3MDQzODMsXCJ2YWx1ZVwiOjEsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjotMi43NzU2ODcwODE0NzMyMDgsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo1MDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dfSxcImd1aVwiOntcInNuYXBcIjp7XCJlbmFibGVcIjpmYWxzZSxcImJwbVwiOlwiNjBcIixcIm9mZnNldFwiOlwiMFwifX19XG5gXG59ICk7XG5sZXQgYXV0byA9IGF1dG9tYXRvbi5hdXRvO1xuXG4vLyAtLS0tLS1cblxubGV0IHdpZHRoID0gNDAwO1xubGV0IGhlaWdodCA9IDQwMDtcbmNhbnZhcy53aWR0aCA9IHdpZHRoO1xuY2FudmFzLmhlaWdodCA9IGhlaWdodDtcblxubGV0IGdsID0gY2FudmFzLmdldENvbnRleHQoICd3ZWJnbCcgKTtcbmxldCBnbENhdCA9IG5ldyBHTENhdCggZ2wgKTtcbmdsQ2F0LmdldEV4dGVuc2lvbiggXCJPRVNfdGV4dHVyZV9mbG9hdFwiLCB0cnVlICk7XG5nbENhdC5nZXRFeHRlbnNpb24oIFwiT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyXCIsIHRydWUgKTtcbmdsQ2F0LmdldEV4dGVuc2lvbiggXCJFWFRfZnJhZ19kZXB0aFwiLCB0cnVlICk7XG5nbENhdC5nZXRFeHRlbnNpb24oIFwiV0VCR0xfZHJhd19idWZmZXJzXCIsIHRydWUgKTtcblxubGV0IGdsQ2F0UGF0aCA9IG5ldyBQYXRoKCBnbENhdCwge1xuICBkcmF3YnVmZmVyczogdHJ1ZSxcbiAgZWw6IGRpdlBhdGgsXG4gIGNhbnZhczogY2FudmFzLFxuICBzdHJldGNoOiB0cnVlXG59ICk7XG5cbi8vIC0tLS0tLVxuXG5sZXQgdHdlYWsgPSBuZXcgVHdlYWsoIGRpdlR3ZWFrICk7XG5cbi8vIC0tLS0tLVxuXG5sZXQgdG90YWxGcmFtZXMgPSAwO1xubGV0IGluaXQgPSB0cnVlO1xuXG4vLyAtLS0tLS1cblxubGV0IHZib1F1YWQgPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoIFsgLTEsIC0xLCAxLCAtMSwgLTEsIDEsIDEsIDEgXSApO1xubGV0IHZib1F1YWRVViA9IGdsQ2F0LmNyZWF0ZVZlcnRleGJ1ZmZlciggWyAwLCAwLCAxLCAwLCAwLCAxLCAxLCAxIF0gKTtcbmxldCB2Ym9RdWFkMyA9IGdsQ2F0LmNyZWF0ZVZlcnRleGJ1ZmZlciggWyAtMSwgLTEsIDAsIDEsIC0xLCAwLCAtMSwgMSwgMCwgMSwgMSwgMCBdICk7XG5cbmxldCBvY3QgPSBvY3RhaGVkcm9uKCAxICk7XG5sZXQgdGV4dHVyZU9jdFBvcyA9IGdsQ2F0LmNyZWF0ZVRleHR1cmUoKTtcbmdsQ2F0LnNldFRleHR1cmVGcm9tRmxvYXRBcnJheSggdGV4dHVyZU9jdFBvcywgb2N0LnBvcy5sZW5ndGggLyA0LCAxLCBvY3QucG9zICk7XG5sZXQgdGV4dHVyZU9jdE5vciA9IGdsQ2F0LmNyZWF0ZVRleHR1cmUoKTtcbmdsQ2F0LnNldFRleHR1cmVGcm9tRmxvYXRBcnJheSggdGV4dHVyZU9jdE5vciwgb2N0LnBvcy5sZW5ndGggLyA0LCAxLCBvY3Qubm9yICk7XG5cbmxldCBwYXJ0aWNsZVBpeGVscyA9IDM7XG5sZXQgcGFydGljbGVzU3FydCA9IDEyODtcbmxldCBwYXJ0aWNsZXMgPSBwYXJ0aWNsZXNTcXJ0ICogcGFydGljbGVzU3FydDtcbmxldCB2ZXJ0c1BlclBhcnRpY2xlID0gb2N0LnBvcy5sZW5ndGggLyA0O1xuXG5sZXQgdmJvUGFydGljbGUgPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoICggKCkgPT4ge1xuICBsZXQgcmV0ID0gW107XG4gIGZvciAoIGxldCBpID0gMDsgaSA8IHBhcnRpY2xlc1NxcnQgKiBwYXJ0aWNsZXNTcXJ0ICogdmVydHNQZXJQYXJ0aWNsZTsgaSArKyApIHtcbiAgICBsZXQgaXggPSBNYXRoLmZsb29yKCBpIC8gdmVydHNQZXJQYXJ0aWNsZSApICUgcGFydGljbGVzU3FydDtcbiAgICBsZXQgaXkgPSBNYXRoLmZsb29yKCBpIC8gcGFydGljbGVzU3FydCAvIHZlcnRzUGVyUGFydGljbGUgKTtcbiAgICBsZXQgaXogPSBpICUgdmVydHNQZXJQYXJ0aWNsZTtcbiAgICBcbiAgICByZXQucHVzaCggaXggKiBwYXJ0aWNsZVBpeGVscyApO1xuICAgIHJldC5wdXNoKCBpeSApO1xuICAgIHJldC5wdXNoKCBpeiApO1xuICB9XG4gIHJldHVybiByZXQ7XG59ICkoKSApO1xuXG4vLyAtLS0tLS1cblxubGV0IHRleHR1cmVSYW5kb21TaXplID0gMjU2O1xuXG5sZXQgdGV4dHVyZVJhbmRvbVVwZGF0ZSA9ICggX3RleCApID0+IHtcbiAgZ2xDYXQuc2V0VGV4dHVyZUZyb21BcnJheSggX3RleCwgdGV4dHVyZVJhbmRvbVNpemUsIHRleHR1cmVSYW5kb21TaXplLCAoICgpID0+IHtcbiAgICBsZXQgbGVuID0gdGV4dHVyZVJhbmRvbVNpemUgKiB0ZXh0dXJlUmFuZG9tU2l6ZSAqIDQ7XG4gICAgbGV0IHJldCA9IG5ldyBVaW50OEFycmF5KCBsZW4gKTtcbiAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBsZW47IGkgKysgKSB7XG4gICAgICByZXRbIGkgXSA9IE1hdGguZmxvb3IoIHhvcnNoaWZ0KCkgKiAyNTYuMCApO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9ICkoKSApO1xufTtcblxubGV0IHRleHR1cmVSYW5kb21TdGF0aWMgPSBnbENhdC5jcmVhdGVUZXh0dXJlKCk7XG5nbENhdC50ZXh0dXJlV3JhcCggdGV4dHVyZVJhbmRvbVN0YXRpYywgZ2wuUkVQRUFUICk7XG50ZXh0dXJlUmFuZG9tVXBkYXRlKCB0ZXh0dXJlUmFuZG9tU3RhdGljICk7XG5cbmxldCB0ZXh0dXJlUmFuZG9tID0gZ2xDYXQuY3JlYXRlVGV4dHVyZSgpO1xuZ2xDYXQudGV4dHVyZVdyYXAoIHRleHR1cmVSYW5kb20sIGdsLlJFUEVBVCApO1xuXG5sZXQgdGV4dHVyZU1vbml0b3JSZWNvdmVyID0gZ2xDYXQuY3JlYXRlVGV4dHVyZSgpO1xuZ2xDYXQuc2V0VGV4dHVyZSggdGV4dHVyZU1vbml0b3JSZWNvdmVyLCBtb25pdG9yUmVjb3ZlciApO1xuXG4vLyAtLS0tLS1cblxubGV0IGZyYW1lYnVmZmVyc0dhdXNzID0gW1xuICBnbENhdC5jcmVhdGVGbG9hdEZyYW1lYnVmZmVyKCB3aWR0aCAvIDQsIGhlaWdodCAvIDQgKSxcbiAgZ2xDYXQuY3JlYXRlRmxvYXRGcmFtZWJ1ZmZlciggd2lkdGggLyA0LCBoZWlnaHQgLyA0ICksXG4gIGdsQ2F0LmNyZWF0ZUZsb2F0RnJhbWVidWZmZXIoIHdpZHRoIC8gNCwgaGVpZ2h0IC8gNCApXG5dO1xuXG5sZXQgZnJhbWVidWZmZXJQcmVEb2YgPSBnbENhdC5jcmVhdGVGbG9hdEZyYW1lYnVmZmVyKCB3aWR0aCwgaGVpZ2h0ICk7XG5cbmxldCBmcmFtZWJ1ZmZlck1vdGlvblByZXYgPSBnbENhdC5jcmVhdGVGcmFtZWJ1ZmZlciggd2lkdGgsIGhlaWdodCApO1xubGV0IGZyYW1lYnVmZmVyTW90aW9uTW9zaCA9IGdsQ2F0LmNyZWF0ZUZyYW1lYnVmZmVyKCB3aWR0aCwgaGVpZ2h0ICk7XG5cbi8vIC0tLS0tLVxuXG5sZXQgcmVuZGVyQSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoICdhJyApO1xuXG5sZXQgc2F2ZUZyYW1lID0gKCkgPT4ge1xuICByZW5kZXJBLmhyZWYgPSBjYW52YXMudG9EYXRhVVJMKCAnaW1hZ2UvanBlZycgKTtcbiAgcmVuZGVyQS5kb3dubG9hZCA9ICggJzAwMDAnICsgdG90YWxGcmFtZXMgKS5zbGljZSggLTUgKSArICcuanBnJztcbiAgcmVuZGVyQS5jbGljaygpO1xufTtcblxuLy8gLS0tLS0tXG5cbmxldCBtb3VzZVggPSAwLjA7XG5sZXQgbW91c2VZID0gMC4wO1xuXG4vLyAtLS0tLS1cblxubGV0IGNhbWVyYVBvcyA9IFsgMC4wLCAwLjAsIDAuMCBdO1xubGV0IGNhbWVyYVRhciA9IFsgMC4wLCAwLjAsIDAuMCBdO1xubGV0IGNhbWVyYVJvdCA9IDAuMDtcbmxldCBjYW1lcmFGb3YgPSA5MC4wO1xuXG5sZXQgY2FtZXJhTmVhciA9IDAuMDE7XG5sZXQgY2FtZXJhRmFyID0gMTAwLjA7XG5cbmxldCBsaWdodFBvcyA9IFsgMTAuMCwgMTAuMCwgMTAuMCBdO1xuXG5sZXQgbWF0UDtcbmxldCBtYXRWO1xubGV0IG1hdFBMO1xubGV0IG1hdFZMO1xuXG5sZXQgdXBkYXRlTWF0cmljZXMgPSAoKSA9PiB7XG4gIG1hdFAgPSBDYXRNYXRoLm1hdDRQZXJzcGVjdGl2ZSggY2FtZXJhRm92LCB3aWR0aCAvIGhlaWdodCwgY2FtZXJhTmVhciwgY2FtZXJhRmFyICk7XG4gIG1hdFYgPSBDYXRNYXRoLm1hdDRMb29rQXQoIGNhbWVyYVBvcywgY2FtZXJhVGFyLCBbIDAuMCwgMS4wLCAwLjAgXSwgY2FtZXJhUm90ICk7XG5cbiAgbWF0UEwgPSBDYXRNYXRoLm1hdDRQZXJzcGVjdGl2ZSggNzAuMCwgMS4wLCBjYW1lcmFOZWFyLCBjYW1lcmFGYXIgKTtcbiAgbWF0VkwgPSBDYXRNYXRoLm1hdDRMb29rQXQoIGxpZ2h0UG9zLCBjYW1lcmFUYXIsIFsgMC4wLCAxLjAsIDAuMCBdLCAwLjAgKTtcbn07XG51cGRhdGVNYXRyaWNlcygpO1xuXG4vLyAtLS0tLS1cblxubGV0IGJnQ29sb3IgPSBbIDAuNCwgMC40LCAwLjQsIDEuMCBdO1xuXG4vLyAtLS0tLS1cblxuZ2xDYXRQYXRoLnNldEdsb2JhbEZ1bmMoICgpID0+IHtcbiAgZ2xDYXQudW5pZm9ybTFpKCAnaW5pdCcsIGluaXQgKTtcbiAgZ2xDYXQudW5pZm9ybTFmKCAndGltZScsIGF1dG9tYXRvbi50aW1lICk7XG4gIGdsQ2F0LnVuaWZvcm0xZiggJ2RlbHRhVGltZScsIGF1dG9tYXRvbi5kZWx0YVRpbWUgKTtcbiAgZ2xDYXQudW5pZm9ybTNmdiggJ2NhbWVyYVBvcycsIGNhbWVyYVBvcyApO1xuICBnbENhdC51bmlmb3JtMWYoICdjYW1lcmFSb3QnLCBjYW1lcmFSb3QgKTtcbiAgZ2xDYXQudW5pZm9ybTFmKCAnY2FtZXJhRm92JywgY2FtZXJhRm92ICk7XG4gIGdsQ2F0LnVuaWZvcm0xZiggJ2NhbWVyYU5lYXInLCBjYW1lcmFOZWFyICk7XG4gIGdsQ2F0LnVuaWZvcm0xZiggJ2NhbWVyYUZhcicsIGNhbWVyYUZhciApO1xuICBnbENhdC51bmlmb3JtM2Z2KCAnbGlnaHRQb3MnLCBsaWdodFBvcyApO1xuICBnbENhdC51bmlmb3JtMWYoICdwYXJ0aWNsZXNTcXJ0JywgcGFydGljbGVzU3FydCApO1xuICBnbENhdC51bmlmb3JtMWYoICdwYXJ0aWNsZVBpeGVscycsIHBhcnRpY2xlUGl4ZWxzICk7XG4gIGdsQ2F0LnVuaWZvcm0xZiggJ2ZyYW1lJywgYXV0b21hdG9uLmZyYW1lICUgZnJhbWVzICk7XG4gIGdsQ2F0LnVuaWZvcm0xZiggJ2ZyYW1lcycsIGZyYW1lcyApO1xuICBnbENhdC51bmlmb3JtMWYoICd2ZXJ0c1BlclBhcnRpY2xlJywgdmVydHNQZXJQYXJ0aWNsZSApO1xuICBnbENhdC51bmlmb3JtTWF0cml4NGZ2KCAnbWF0UCcsIG1hdFAgKTtcbiAgZ2xDYXQudW5pZm9ybU1hdHJpeDRmdiggJ21hdFYnLCBtYXRWICk7XG4gIGdsQ2F0LnVuaWZvcm1NYXRyaXg0ZnYoICdtYXRQTCcsIG1hdFBMICk7XG4gIGdsQ2F0LnVuaWZvcm1NYXRyaXg0ZnYoICdtYXRWTCcsIG1hdFZMICk7XG4gIGdsQ2F0LnVuaWZvcm00ZnYoICdiZ0NvbG9yJywgYmdDb2xvciApO1xufSApO1xuXG5nbENhdFBhdGguYWRkKCB7XG4gIHJldHVybjoge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB2ZXJ0OiBnbHNsaWZ5KCAnLi9zaGFkZXIvcXVhZC52ZXJ0JyApLFxuICAgIGZyYWc6IGdsc2xpZnkoICcuL3NoYWRlci9yZXR1cm4uZnJhZycgKSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLk9ORSBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDEuMCBdLFxuICAgIGZ1bmM6ICggX3AsIHBhcmFtcyApID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXIwJywgcGFyYW1zLmlucHV0LCAwICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcblxuICDjgZPjgpPjgavjgaHjga86IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvYmcuZnJhZycgKSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLk9ORSBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDEuMCBdLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGRyYXdidWZmZXJzOiAyLFxuICAgIGZsb2F0OiB0cnVlLFxuICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcblxuICBwYXJ0aWNsZXNDb21wdXRlUmV0dXJuOiB7XG4gICAgd2lkdGg6IHBhcnRpY2xlc1NxcnQgKiBwYXJ0aWNsZVBpeGVscyxcbiAgICBoZWlnaHQ6IHBhcnRpY2xlc1NxcnQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvcmV0dXJuLmZyYWcnICksXG4gICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5PTkUgXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAwLjAgXSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoICdwJywgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICd0ZXh0dXJlJywgZ2xDYXRQYXRoLmZiKCBcInBhcnRpY2xlc0NvbXB1dGVcIiApLnRleHR1cmUsIDAgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxuXG4gIHBhcnRpY2xlc0NvbXB1dGU6IHtcbiAgICB3aWR0aDogcGFydGljbGVzU3FydCAqIHBhcnRpY2xlUGl4ZWxzLFxuICAgIGhlaWdodDogcGFydGljbGVzU3FydCxcbiAgICB2ZXJ0OiBnbHNsaWZ5KCAnLi9zaGFkZXIvcXVhZC52ZXJ0JyApLFxuICAgIGZyYWc6IGdsc2xpZnkoICcuL3NoYWRlci9wYXJ0aWNsZXMtY29tcHV0ZS5mcmFnJyApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuT05FIF0sXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMC4wIF0sXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZmxvYXQ6IHRydWUsXG4gICAgZnVuYzogKCkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAndGV4dHVyZVJldHVybicsIGdsQ2F0UGF0aC5mYiggXCJwYXJ0aWNsZXNDb21wdXRlUmV0dXJuXCIgKS50ZXh0dXJlLCAwICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3RleHR1cmVSYW5kb20nLCB0ZXh0dXJlUmFuZG9tLCAxICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcbiAgXG4gIHBhcnRpY2xlc1NoYWRvdzoge1xuICAgIHdpZHRoOiAxMDI0LFxuICAgIGhlaWdodDogMTAyNCxcbiAgICB2ZXJ0OiBnbHNsaWZ5KCAnLi9zaGFkZXIvcGFydGljbGVzLXJlbmRlci52ZXJ0JyApLFxuICAgIGZyYWc6IGdsc2xpZnkoICcuL3NoYWRlci9wYXJ0aWNsZXMtc2hhZG93LmZyYWcnICksXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZmxvYXQ6IHRydWUsXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMS4wIF0sXG4gICAgYmxlbmQ6IFsgZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBIF0sXG4gICAgZnVuYzogKCkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAndnV2JywgdmJvUGFydGljbGUsIDMgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1NYXRyaXg0ZnYoICdtYXRWJywgbWF0VkwgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1NYXRyaXg0ZnYoICdtYXRQJywgbWF0UEwgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm0yZnYoICdyZXNvbHV0aW9uUGNvbXB1dGUnLCBbIHBhcnRpY2xlc1NxcnQgKiBwYXJ0aWNsZVBpeGVscywgcGFydGljbGVzU3FydCBdICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3RleHR1cmVQY29tcHV0ZScsIGdsQ2F0UGF0aC5mYiggXCJwYXJ0aWNsZXNDb21wdXRlXCIgKS50ZXh0dXJlLCAwICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3RleHR1cmVPY3RQb3MnLCB0ZXh0dXJlT2N0UG9zLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3RleHR1cmVPY3ROb3InLCB0ZXh0dXJlT2N0Tm9yLCAzICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRVMsIDAsIHBhcnRpY2xlcyAqIHZlcnRzUGVyUGFydGljbGUgKTtcbiAgICB9XG4gIH0sXG4gIFxuICBwYXJ0aWNsZXNSZW5kZXI6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3BhcnRpY2xlcy1yZW5kZXIudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvcGFydGljbGVzLXJlbmRlci5mcmFnJyApLFxuICAgIGRyYXdidWZmZXJzOiAyLFxuICAgIGJsZW5kOiBbIGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSBdLFxuICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3Z1dicsIHZib1BhcnRpY2xlLCAzICk7XG4gICAgICBnbENhdC51bmlmb3JtMmZ2KCAncmVzb2x1dGlvblBjb21wdXRlJywgWyBwYXJ0aWNsZXNTcXJ0ICogcGFydGljbGVQaXhlbHMsIHBhcnRpY2xlc1NxcnQgXSApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICd0ZXh0dXJlUGNvbXB1dGUnLCBnbENhdFBhdGguZmIoIFwicGFydGljbGVzQ29tcHV0ZVwiICkudGV4dHVyZSwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICd0ZXh0dXJlU2hhZG93JywgZ2xDYXRQYXRoLmZiKCBcInBhcnRpY2xlc1NoYWRvd1wiICkudGV4dHVyZSwgMSApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICd0ZXh0dXJlT2N0UG9zJywgdGV4dHVyZU9jdFBvcywgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICd0ZXh0dXJlT2N0Tm9yJywgdGV4dHVyZU9jdE5vciwgMyApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVTLCAwLCBwYXJ0aWNsZXMgKiB2ZXJ0c1BlclBhcnRpY2xlICk7XG4gICAgfVxuICB9LFxuICBcbiAgZ2F1c3M6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvZ2F1c3MuZnJhZycgKSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAxLjAgXSxcbiAgICB0ZW1wRmI6IGdsQ2F0LmNyZWF0ZUZsb2F0RnJhbWVidWZmZXIoIHdpZHRoLCBoZWlnaHQgKSxcbiAgICBibGVuZDogWyBnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEgXSxcbiAgICBmdW5jOiAoIHBhdGgsIHBhcmFtcyApID0+IHtcbiAgICAgIGlmICggcGFyYW1zLndpZHRoICYmIHBhcmFtcy5oZWlnaHQgKSB7XG4gICAgICAgIGdsQ2F0LnJlc2l6ZUZsb2F0RnJhbWVidWZmZXIoIHBhdGgudGVtcEZiLCBwYXJhbXMud2lkdGgsIHBhcmFtcy5oZWlnaHQgKTtcbiAgICAgIH1cblxuICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgcGF0aC50ZW1wRmIuZnJhbWVidWZmZXIgKTtcbiAgICAgIGdsQ2F0LmNsZWFyKCAuLi5wYXRoLmNsZWFyICk7XG5cbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXIwJywgcGFyYW1zLmlucHV0LCAwICk7XG4gICAgICBnbENhdC51bmlmb3JtMWYoICd2YXInLCBwYXJhbXMudmFyICk7XG4gICAgICBnbENhdC51bmlmb3JtMWkoICdpc1ZlcnQnLCAwICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgICAgXG4gICAgICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBwYXJhbXMuZnJhbWVidWZmZXIgKTtcblxuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlcjAnLCBwYXRoLnRlbXBGYi50ZXh0dXJlLCAwICk7XG4gICAgICBnbENhdC51bmlmb3JtMWYoICd2YXInLCBwYXJhbXMudmFyICk7XG4gICAgICBnbENhdC51bmlmb3JtMWkoICdpc1ZlcnQnLCAxICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcbiAgXG4gIGRvZjoge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB2ZXJ0OiBnbHNsaWZ5KCAnLi9zaGFkZXIvcXVhZC52ZXJ0JyApLFxuICAgIGZyYWc6IGdsc2xpZnkoICcuL3NoYWRlci9kb2YuZnJhZycgKSxcbiAgICBibGVuZDogWyBnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEgXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAwLjAgXSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoIF9wLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoICdwJywgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFmKCAnZm9jdXMnLCBhdXRvKCAnZm9jdXMnICkgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlckRyeScsIHBhcmFtcy5kcnksIDAgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlclByZURvZicsIHBhcmFtcy5wcmVkb2YsIDEgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlckRlcHRoJywgcGFyYW1zLmRlcHRoLCAyICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcbiAgXG4gIFwiR293cm9jayAtIGJsb29tXCI6IHtcbiAgICB3aWR0aDogd2lkdGggLyA0LjAsXG4gICAgaGVpZ2h0OiBoZWlnaHQgLyA0LjAsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvYmxvb20uZnJhZycgKSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLk9ORSBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDAuMCBdLFxuICAgIHRlbXBGYjogZ2xDYXQuY3JlYXRlRmxvYXRGcmFtZWJ1ZmZlciggd2lkdGggLyA0LjAsIGhlaWdodCAvIDQuMCApLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGZsb2F0OiB0cnVlLFxuICAgIGZ1bmM6ICggX3AsIHBhcmFtcyApID0+IHtcbiAgICAgIGZvciAoIGxldCBpID0gMDsgaSA8IDM7IGkgKysgKSB7XG4gICAgICAgIGxldCBnYXVzc1ZhciA9IFsgNS4wLCAxNS4wLCA0MC4wIF1bIGkgXTtcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgX3AudGVtcEZiLmZyYW1lYnVmZmVyICk7XG4gICAgICAgIGdsQ2F0LmNsZWFyKCAuLi5fcC5jbGVhciApO1xuXG4gICAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICAgIGdsQ2F0LnVuaWZvcm0xaSggJ2lzVmVydCcsIGZhbHNlICk7XG4gICAgICAgIGdsQ2F0LnVuaWZvcm0xZiggJ2dhdXNzVmFyJywgZ2F1c3NWYXIgKTtcbiAgICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyMCcsIHBhcmFtcy5pbnB1dCwgMCApO1xuICAgICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgICAgICBcbiAgICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgcGFyYW1zLmZyYW1lYnVmZmVyICk7XG5cbiAgICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgICAgZ2xDYXQudW5pZm9ybTFpKCAnaXNWZXJ0JywgdHJ1ZSApO1xuICAgICAgICBnbENhdC51bmlmb3JtMWYoICdnYXVzc1ZhcicsIGdhdXNzVmFyICk7XG4gICAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlcjAnLCBfcC50ZW1wRmIudGV4dHVyZSwgMCApO1xuICAgICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXJEcnknLCBwYXJhbXMuaW5wdXQsIDEgKTtcbiAgICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIFxuICBibG9vbUZpbmFsaXplOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9xdWFkLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL2Jsb29tLWZpbmFsaXplLmZyYWcnICksXG4gICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5PTkUgXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAwLjAgXSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoIF9wLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoICdwJywgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyRHJ5JywgcGFyYW1zLmRyeSwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyV2V0JywgcGFyYW1zLndldCwgMSApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG4gIFxuICDjgYrjgZ/jgY/jga/jgZnjgZDjg53jgrnjg4jjgqjjg5Xjgqfjgq/jg4jjgpLmjL/jgZk6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvcG9zdC5mcmFnJyApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuT05FIF0sXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMC4wIF0sXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZnVuYzogKCBfcCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlcjAnLCBwYXJhbXMuaW5wdXQsIDAgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxuXG4gIG1vbml0b3I6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvbW9uaXRvci5mcmFnJyApLFxuICAgIGJsZW5kOiBbIGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSBdLFxuICAgIGRlcHRoVGVzdDogZmFsc2UsXG4gICAgZnVuYzogKCBfcCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm0xZiggJ3JlY292ZXJCYXInLCBhdXRvKCBcInJlY292ZXJCYXJcIiApICk7XG4gICAgICBnbENhdC51bmlmb3JtMWYoICdyZWNvdmVyQ2xvc2UnLCBhdXRvKCBcInJlY292ZXJDbG9zZVwiICkgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm0xZiggJ2NpcmNsZVJhZGl1cycsIGF1dG8oIFwiY2lyY2xlUmFkaXVzXCIgKSApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFmKCAnY2lyY2xlU3BpbicsIGF1dG8oIFwiY2lyY2xlU3BpblwiICkgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm0xZiggJ21ldGFiYWxsUmFkaXVzJywgYXV0byggXCJtZXRhYmFsbFJhZGl1c1wiICkgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlck1vbml0b3JSZWNvdmVyJywgdGV4dHVyZU1vbml0b3JSZWNvdmVyLCAwICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcblxuICBtb3Rpb246IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvbW90aW9uLmZyYWcnICksXG4gICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5PTkUgXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAwLjAgXSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoIF9wLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoICdwJywgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyMCcsIHBhcmFtcy5pbnB1dCwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyUCcsIHBhcmFtcy5wcmV2LCAxICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcblxuICBtb3Rpb25TZWw6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvbW90aW9uc2VsLmZyYWcnICksXG4gICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5PTkUgXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAwLjAgXSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoIF9wLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoICdwJywgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFmKCAndGhyZXNob2xkJywgMC4xICogYXV0byggXCJtb3NoVGhyZXNob2xkXCIgKSApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyRHJ5JywgcGFyYW1zLmRyeSwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyTW9zaCcsIHBhcmFtcy5tb3NoLCAxICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXJNb3Rpb24nLCBnbENhdFBhdGguZmIoIFwibW90aW9uXCIgKS50ZXh0dXJlLCAyICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcbn0gKTtcblxuLy8gLS0tLS0tXG5cbmxldCB1cGRhdGVVSSA9ICgpID0+IHtcbiAgbGV0IG5vdyA9IG5ldyBEYXRlKCk7XG4gIGxldCBkZWFkbGluZSA9IG5ldyBEYXRlKCAyMDE4LCAwLCAxOSwgMCwgMCApO1xuXG4gIGRpdkNvdW50ZG93bi5pbm5lclRleHQgPSBcIkRlYWRsaW5lOiBcIiArIE1hdGguZmxvb3IoICggZGVhZGxpbmUgLSBub3cgKSAvIDEwMDAgKTtcbn07XG5cbi8vIC0tLS0tLVxuXG5sZXQgdXBkYXRlID0gKCkgPT4ge1xuICBpZiAoIGF1dG9tYXRvbi50aW1lID09PSAwICkgeyB4b3JzaGlmdCggMzQ3MTg5MDU3ODI5MDU2ICk7IH1cblxuICBpZiAoICF0d2Vhay5jaGVja2JveCggJ3BsYXknLCB7IHZhbHVlOiB0cnVlIH0gKSApIHtcbiAgICBzZXRUaW1lb3V0KCB1cGRhdGUsIDEwICk7XG4gICAgcmV0dXJuO1xuICB9XG4gIFxuICB0ZXh0dXJlUmFuZG9tVXBkYXRlKCB0ZXh0dXJlUmFuZG9tICk7XG5cbiAgdXBkYXRlVUkoKTtcblxuICB1cGRhdGVNYXRyaWNlcygpO1xuICBcbiAgYXV0b21hdG9uLnVwZGF0ZSgpO1xuXG4gIGNhbWVyYVBvcyA9IFtcbiAgICBhdXRvKCBcImNhbWVyYVhcIiApLFxuICAgIGF1dG8oIFwiY2FtZXJhWVwiICksXG4gICAgYXV0byggXCJjYW1lcmFaXCIgKVxuICBdO1xuICBjYW1lcmFUYXIgPSBbXG4gICAgYXV0byggXCJjYW1lcmFUWFwiICksXG4gICAgYXV0byggXCJjYW1lcmFUWVwiICksXG4gICAgYXV0byggXCJjYW1lcmFUWlwiIClcbiAgXVxuICBjYW1lcmFSb3QgPSBhdXRvKCBcImNhbWVyYVJvdFwiICk7XG5cbiAgZ2xDYXRQYXRoLmJlZ2luKCk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCLjgZPjgpPjgavjgaHjga9cIiApO1xuXG4gIC8vIGdsQ2F0UGF0aC5yZW5kZXIoIFwibW9uaXRvclwiLCB7IHRhcmdldDogZ2xDYXRQYXRoLmZiKCBcIuOBk+OCk+OBq+OBoeOBr1wiICkgfSApO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicGFydGljbGVzQ29tcHV0ZVJldHVyblwiICk7XG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicGFydGljbGVzQ29tcHV0ZVwiICk7XG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicGFydGljbGVzU2hhZG93XCIgKTtcbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJwYXJ0aWNsZXNSZW5kZXJcIiwge1xuICAgIHRhcmdldDogZ2xDYXRQYXRoLmZiKCBcIuOBk+OCk+OBq+OBoeOBr1wiIClcbiAgfSApO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwiZ2F1c3NcIiwge1xuICAgIHRhcmdldDogZnJhbWVidWZmZXJQcmVEb2YsXG4gICAgaW5wdXQ6IGdsQ2F0UGF0aC5mYiggXCLjgZPjgpPjgavjgaHjga9cIiApLnRleHR1cmVzWyAwIF0sXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZhcjogNS4wXG4gIH0gKTtcblxuICBnbENhdFBhdGgucmVuZGVyKCBcImRvZlwiLCB7XG4gICAgZHJ5OiBnbENhdFBhdGguZmIoIFwi44GT44KT44Gr44Gh44GvXCIgKS50ZXh0dXJlc1sgMCBdLFxuICAgIHByZWRvZjogZnJhbWVidWZmZXJQcmVEb2YudGV4dHVyZSxcbiAgICBkZXB0aDogZ2xDYXRQYXRoLmZiKCBcIuOBk+OCk+OBq+OBoeOBr1wiICkudGV4dHVyZXNbIDEgXVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJHb3dyb2NrIC0gYmxvb21cIiwge1xuICAgIGlucHV0OiBmcmFtZWJ1ZmZlclByZURvZi50ZXh0dXJlLFxuICB9ICk7XG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwiYmxvb21GaW5hbGl6ZVwiLCB7XG4gICAgZHJ5OiBnbENhdFBhdGguZmIoIFwiZG9mXCIgKS50ZXh0dXJlLFxuICAgIHdldDogZ2xDYXRQYXRoLmZiKCBcIkdvd3JvY2sgLSBibG9vbVwiICkudGV4dHVyZVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCLjgYrjgZ/jgY/jga/jgZnjgZDjg53jgrnjg4jjgqjjg5Xjgqfjgq/jg4jjgpLmjL/jgZlcIiwge1xuICAgIGlucHV0OiBnbENhdFBhdGguZmIoIFwiYmxvb21GaW5hbGl6ZVwiICkudGV4dHVyZVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJtb25pdG9yXCIsIHtcbiAgICB0YXJnZXQ6IGdsQ2F0UGF0aC5mYiggXCLjgYrjgZ/jgY/jga/jgZnjgZDjg53jgrnjg4jjgqjjg5Xjgqfjgq/jg4jjgpLmjL/jgZlcIiApXG4gIH0gKTtcblxuICBnbENhdFBhdGgucmVuZGVyKCBcIm1vdGlvblwiLCB7XG4gICAgaW5wdXQ6IGdsQ2F0UGF0aC5mYiggXCLjgYrjgZ/jgY/jga/jgZnjgZDjg53jgrnjg4jjgqjjg5Xjgqfjgq/jg4jjgpLmjL/jgZlcIiApLnRleHR1cmUsXG4gICAgcHJldjogZnJhbWVidWZmZXJNb3Rpb25QcmV2LnRleHR1cmVcbiAgfSApO1xuICBnbENhdFBhdGgucmVuZGVyKCBcIm1vdGlvblNlbFwiLCB7XG4gICAgZHJ5OiBnbENhdFBhdGguZmIoIFwi44GK44Gf44GP44Gv44GZ44GQ44Od44K544OI44Ko44OV44Kn44Kv44OI44KS5oy/44GZXCIgKS50ZXh0dXJlLFxuICAgIG1vc2g6IGZyYW1lYnVmZmVyTW90aW9uTW9zaC50ZXh0dXJlXG4gIH0gKTtcbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJyZXR1cm5cIiwge1xuICAgIHRhcmdldDogZnJhbWVidWZmZXJNb3Rpb25Nb3NoLFxuICAgIGlucHV0OiBnbENhdFBhdGguZmIoIFwibW90aW9uU2VsXCIgKS50ZXh0dXJlLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9ICk7XG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicmV0dXJuXCIsIHtcbiAgICB0YXJnZXQ6IGdsQ2F0UGF0aC5udWxsRmIsXG4gICAgaW5wdXQ6IGdsQ2F0UGF0aC5mYiggXCJtb3Rpb25TZWxcIiApLnRleHR1cmUsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH0gKTtcblxuICBnbENhdFBhdGgucmVuZGVyKCBcInJldHVyblwiLCB7XG4gICAgdGFyZ2V0OiBmcmFtZWJ1ZmZlck1vdGlvblByZXYsXG4gICAgaW5wdXQ6IGdsQ2F0UGF0aC5mYiggXCLjgYrjgZ/jgY/jga/jgZnjgZDjg53jgrnjg4jjgqjjg5Xjgqfjgq/jg4jjgpLmjL/jgZlcIiApLnRleHR1cmUsXG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0XG4gIH0gKTtcblxuICBnbENhdFBhdGguZW5kKCk7XG5cbiAgaW5pdCA9IGZhbHNlO1xuICB0b3RhbEZyYW1lcyArKztcblxuICBpZiAoIHR3ZWFrLmNoZWNrYm94KCAnc2F2ZScsIHsgdmFsdWU6IGZhbHNlIH0gKSApIHtcbiAgICBzYXZlRnJhbWUoKTtcbiAgfVxuICBcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB1cGRhdGUgKTtcbn07XG5cbi8vIC0tLS0tLVxuXG5zdGVwKCB7XG4gIDA6ICggZG9uZSApID0+IHtcbiAgICB1cGRhdGUoKTtcbiAgfVxufSApO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCAoIF9lICkgPT4ge1xuICBpZiAoIF9lLndoaWNoID09PSAyNyApIHtcbiAgICB0d2Vhay5jaGVja2JveCggJ3BsYXknLCB7IHNldDogZmFsc2UgfSApO1xuICB9XG59ICk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgZXZlbnQgPT4ge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZO1xufSApOyIsImxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xyXG5sZXQgY2FudmFzU2l6ZSA9IDEwMjQ7XHJcbmNhbnZhcy53aWR0aCA9IGNhbnZhc1NpemU7XHJcbmNhbnZhcy5oZWlnaHQgPSBjYW52YXNTaXplO1xyXG5cclxubGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xyXG5jb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG5jb250ZXh0LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xyXG5jb250ZXh0LmZvbnQgPSAnOTAwICcgKyBjYW52YXNTaXplIC8gMjAuMCArICdweCBUaW1lcyBOZXcgUm9tYW4nO1xyXG5cclxuY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMCc7XHJcbmNvbnRleHQuZmlsbFJlY3QoIDAsIDAsIGNhbnZhc1NpemUsIGNhbnZhc1NpemUgKTtcclxuXHJcbmNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmYnO1xyXG5jb250ZXh0LmZpbGxUZXh0KFxyXG4gIFwiUiAgRSAgQyAgTyAgViAgRSAgUiAgSSAgTiAgR1wiLFxyXG4gIGNhbnZhc1NpemUgLyAyLFxyXG4gIGNhbnZhc1NpemUgLyAyXHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYW52YXM7XHJcbiIsImxldCBvY3RhaGVkcm9uID0gKCBfZGl2ICkgPT4ge1xuICBsZXQgcG9zID0gW107XG4gIGxldCBub3IgPSBbXTtcblxuICBmb3IgKCBsZXQgaWkgPSAwOyBpaSA8IDI7IGlpICsrICkge1xuICAgIGZvciAoIGxldCBpcSA9IDA7IGlxIDwgNDsgaXEgKysgKSB7XG4gICAgICBmb3IgKCBsZXQgaXkgPSAwOyBpeSA8IF9kaXYgKyAxOyBpeSArKyApIHtcbiAgICAgICAgZm9yICggbGV0IGl4ID0gMDsgaXggPCBpeSArIDE7IGl4ICsrICkge1xuICAgICAgICAgIGxldCBsYXQwID0gKCBpaSAqIDIuMCArIGl5IC8gKCBfZGl2ICsgMSApICkgKiBNYXRoLlBJIC8gMi4wO1xuICAgICAgICAgIGxldCBsYXQxID0gKCBpaSAqIDIuMCArICggaXkgKyAxICkgLyAoIF9kaXYgKyAxICkgKSAqIE1hdGguUEkgLyAyLjA7XG5cbiAgICAgICAgICBsZXQgbG9uMCA9ICggaWkgKiAyLjAgLSAxLjAgKSAqICggKCBpeCAtIDEgKSAvIE1hdGgubWF4KCAxLCBpeSApICsgaXEgKSAqIE1hdGguUEkgLyAyLjA7XG4gICAgICAgICAgbGV0IGxvbjEgPSAoIGlpICogMi4wIC0gMS4wICkgKiAoIGl4IC8gKCBpeSArIDEgKSArIGlxICkgKiBNYXRoLlBJIC8gMi4wO1xuICAgICAgICAgIGxldCBsb24yID0gKCBpaSAqIDIuMCAtIDEuMCApICogKCBpeCAvIE1hdGgubWF4KCAxLCBpeSApICsgaXEgKSAqIE1hdGguUEkgLyAyLjA7XG4gICAgICAgICAgbGV0IGxvbjMgPSAoIGlpICogMi4wIC0gMS4wICkgKiAoICggaXggKyAxICkgLyAoIGl5ICsgMSApICsgaXEgKSAqIE1hdGguUEkgLyAyLjA7XG5cbiAgICAgICAgICBpZiAoIGl4ICE9PSAwICkge1xuICAgICAgICAgICAgbGV0IHgxID0gTWF0aC5zaW4oIGxhdDAgKSAqIE1hdGguY29zKCBsb24wICk7IHBvcy5wdXNoKCB4MSApO1xuICAgICAgICAgICAgbGV0IHkxID0gTWF0aC5jb3MoIGxhdDAgKTsgcG9zLnB1c2goIHkxICk7XG4gICAgICAgICAgICBsZXQgejEgPSBNYXRoLnNpbiggbGF0MCApICogTWF0aC5zaW4oIGxvbjAgKTsgcG9zLnB1c2goIHoxICk7XG4gICAgICAgICAgICBwb3MucHVzaCggMS4wICk7XG5cbiAgICAgICAgICAgIGxldCB4MiA9IE1hdGguc2luKCBsYXQxICkgKiBNYXRoLmNvcyggbG9uMSApOyBwb3MucHVzaCggeDIgKTtcbiAgICAgICAgICAgIGxldCB5MiA9IE1hdGguY29zKCBsYXQxICk7IHBvcy5wdXNoKCB5MiApO1xuICAgICAgICAgICAgbGV0IHoyID0gTWF0aC5zaW4oIGxhdDEgKSAqIE1hdGguc2luKCBsb24xICk7IHBvcy5wdXNoKCB6MiApO1xuICAgICAgICAgICAgcG9zLnB1c2goIDEuMCApO1xuXG4gICAgICAgICAgICBsZXQgeDMgPSBNYXRoLnNpbiggbGF0MCApICogTWF0aC5jb3MoIGxvbjIgKTsgcG9zLnB1c2goIHgzICk7XG4gICAgICAgICAgICBsZXQgeTMgPSBNYXRoLmNvcyggbGF0MCApOyBwb3MucHVzaCggeTMgKTtcbiAgICAgICAgICAgIGxldCB6MyA9IE1hdGguc2luKCBsYXQwICkgKiBNYXRoLnNpbiggbG9uMiApOyBwb3MucHVzaCggejMgKTtcbiAgICAgICAgICAgIHBvcy5wdXNoKCAxLjAgKTtcblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsZXQgeCA9IHgxICsgeDIgKyB4MztcbiAgICAgICAgICAgICAgbGV0IHkgPSB5MSArIHkyICsgeTM7XG4gICAgICAgICAgICAgIGxldCB6ID0gejEgKyB6MiArIHozO1xuICAgICAgICAgICAgICBsZXQgbCA9IE1hdGguc3FydCggeCAqIHggKyB5ICogeSArIHogKiB6ICk7XG5cbiAgICAgICAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgMzsgaSArKyApIHtcbiAgICAgICAgICAgICAgICBub3IucHVzaCggeCAvIGwgKTtcbiAgICAgICAgICAgICAgICBub3IucHVzaCggeSAvIGwgKTtcbiAgICAgICAgICAgICAgICBub3IucHVzaCggeiAvIGwgKTtcbiAgICAgICAgICAgICAgICBub3IucHVzaCggMS4wICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB7XG4gICAgICAgICAgICBsZXQgeDEgPSBNYXRoLnNpbiggbGF0MCApICogTWF0aC5jb3MoIGxvbjIgKTsgcG9zLnB1c2goIHgxICk7XG4gICAgICAgICAgICBsZXQgeTEgPSBNYXRoLmNvcyggbGF0MCApOyBwb3MucHVzaCggeTEgKTtcbiAgICAgICAgICAgIGxldCB6MSA9IE1hdGguc2luKCBsYXQwICkgKiBNYXRoLnNpbiggbG9uMiApOyBwb3MucHVzaCggejEgKTtcbiAgICAgICAgICAgIHBvcy5wdXNoKCAxLjAgKTtcblxuICAgICAgICAgICAgbGV0IHgyID0gTWF0aC5zaW4oIGxhdDEgKSAqIE1hdGguY29zKCBsb24xICk7IHBvcy5wdXNoKCB4MiApO1xuICAgICAgICAgICAgbGV0IHkyID0gTWF0aC5jb3MoIGxhdDEgKTsgcG9zLnB1c2goIHkyICk7XG4gICAgICAgICAgICBsZXQgejIgPSBNYXRoLnNpbiggbGF0MSApICogTWF0aC5zaW4oIGxvbjEgKTsgcG9zLnB1c2goIHoyICk7XG4gICAgICAgICAgICBwb3MucHVzaCggMS4wICk7XG5cbiAgICAgICAgICAgIGxldCB4MyA9IE1hdGguc2luKCBsYXQxICkgKiBNYXRoLmNvcyggbG9uMyApOyBwb3MucHVzaCggeDMgKTtcbiAgICAgICAgICAgIGxldCB5MyA9IE1hdGguY29zKCBsYXQxICk7IHBvcy5wdXNoKCB5MyApO1xuICAgICAgICAgICAgbGV0IHozID0gTWF0aC5zaW4oIGxhdDEgKSAqIE1hdGguc2luKCBsb24zICk7IHBvcy5wdXNoKCB6MyApO1xuICAgICAgICAgICAgcG9zLnB1c2goIDEuMCApO1xuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxldCB4ID0geDEgKyB4MiArIHgzO1xuICAgICAgICAgICAgICBsZXQgeSA9IHkxICsgeTIgKyB5MztcbiAgICAgICAgICAgICAgbGV0IHogPSB6MSArIHoyICsgejM7XG4gICAgICAgICAgICAgIGxldCBsID0gTWF0aC5zcXJ0KCB4ICogeCArIHkgKiB5ICsgeiAqIHogKTtcblxuICAgICAgICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCAzOyBpICsrICkge1xuICAgICAgICAgICAgICAgIG5vci5wdXNoKCB4IC8gbCApO1xuICAgICAgICAgICAgICAgIG5vci5wdXNoKCB5IC8gbCApO1xuICAgICAgICAgICAgICAgIG5vci5wdXNoKCB6IC8gbCApO1xuICAgICAgICAgICAgICAgIG5vci5wdXNoKCAxLjAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcG9zOiBwb3MsXG4gICAgbm9yOiBub3JcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG9jdGFoZWRyb247Il19
