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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYXNzZXJ0L2Fzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJub2RlX21vZHVsZXMvdXRpbC9ub2RlX21vZHVsZXMvaW5oZXJpdHMvaW5oZXJpdHNfYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy91dGlsL3N1cHBvcnQvaXNCdWZmZXJCcm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL3V0aWwvdXRpbC5qcyIsInNyYy9zY3JpcHQvbGliL2NhdG1hdGguanMiLCJzcmMvc2NyaXB0L2xpYi9nbGNhdC1wYXRoLWd1aS5qcyIsInNyYy9zY3JpcHQvbGliL2dsY2F0LXBhdGguanMiLCJzcmMvc2NyaXB0L2xpYi9nbGNhdC5qcyIsInNyYy9zY3JpcHQvbGliL3N0ZXAuanMiLCJzcmMvc2NyaXB0L2xpYi90d2Vhay5qcyIsInNyYy9zY3JpcHQvbGliL3hvcnNoaWZ0LmpzIiwic3JjL3NjcmlwdC9tYWluLmpzIiwic3JjL3NjcmlwdC9tb25pdG9yLXJlY292ZXIuanMiLCJzcmMvc2NyaXB0L29jdGFoZWRyb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzFlQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDMWtCQTs7QUFFQSxJQUFJLFVBQVUsRUFBZDs7QUFFQTs7Ozs7QUFLQSxRQUFRLE1BQVIsR0FBaUIsVUFBRSxDQUFGLEVBQUssQ0FBTDtBQUFBLFNBQVksRUFBRSxHQUFGLENBQU8sVUFBRSxDQUFGLEVBQUssQ0FBTDtBQUFBLFdBQVksSUFBSSxF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QzlDLGdCQUFJLE1BQUssS0FBSyxHQUFMLENBQVUsSUFBVixDQUFULENBQTJCLElBQUksSUFBSixDQUFVLEdBQVY7QUFDM0IsZ0JBQUksTUFBSyxLQUFLLEdBQUwsQ0FBVSxJQUFWLElBQW1CLEtBQUssR0FBTCxDQUFVLElBQVYsQ0FBNUIsQ0FBOEMsSUFBSSxJQUFKLENBQVUsR0FBVjtBQUM5QyxnQkFBSSxJQUFKLENBQVUsR0FBVjs7QUFFQTtBQUNFLGtCQUFJLE1BQUksS0FBSyxHQUFMLEdBQVUsR0FBbEI7QUFDQSxrQkFBSSxNQUFJLEtBQUssR0FBTCxHQUFVLEdBQWxCO0FBQ0Esa0JBQUksTUFBSSxLQUFLLEdBQUwsR0FBVSxHQUFsQjtBQUNBLGtCQUFJLEtBQUksS0FBSyxJQUFMLENBQVcsTUFBSSxHQUFKLEdBQVEsTUFBSSxHQUFaLEdBQWdCLE1BQUksR0FBL0IsQ0FBUjs7QUFFQSxtQkFBTSxJQUFJLEtBQUksQ0FBZCxFQUFpQixLQUFJLENBQXJCLEVBQXdCLElBQXhCLEVBQStCO0FBQzdCLG9CQUFJLElBQUosQ0FBVSxNQUFJLEVBQWQ7QUFDQSxvQkFBSSxJQUFKLENBQVUsTUFBSSxFQUFkO0FBQ0Esb0JBQUksSUFBSixDQUFVLE1BQUksRUFBZDtBQUNBLG9CQUFJLElBQUosQ0FBVSxHQUFWO0FBQ0Q7QUFDRjtBQUNGO0FBQ0Y7QUFDRjtBQUNGO0FBQ0Y7O0FBRUQsU0FBTztBQUNMLFNBQUssR0FEQTtBQUVMLFNBQUs7QUFGQSxHQUFQO0FBSUQsQ0F0RkQ7O2tCQXdGZSxVIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxuLy8gY29tcGFyZSBhbmQgaXNCdWZmZXIgdGFrZW4gZnJvbSBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9ibG9iLzY4MGU5ZTVlNDg4ZjIyYWFjMjc1OTlhNTdkYzg0NGE2MzE1OTI4ZGQvaW5kZXguanNcbi8vIG9yaWdpbmFsIG5vdGljZTpcblxuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuZnVuY3Rpb24gY29tcGFyZShhLCBiKSB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICB2YXIgeCA9IGEubGVuZ3RoO1xuICB2YXIgeSA9IGIubGVuZ3RoO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldO1xuICAgICAgeSA9IGJbaV07XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgaWYgKHkgPCB4KSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5mdW5jdGlvbiBpc0J1ZmZlcihiKSB7XG4gIGlmIChnbG9iYWwuQnVmZmVyICYmIHR5cGVvZiBnbG9iYWwuQnVmZmVyLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGdsb2JhbC5CdWZmZXIuaXNCdWZmZXIoYik7XG4gIH1cbiAgcmV0dXJuICEhKGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlcik7XG59XG5cbi8vIGJhc2VkIG9uIG5vZGUgYXNzZXJ0LCBvcmlnaW5hbCBub3RpY2U6XG5cbi8vIGh0dHA6Ly93aWtpLmNvbW1vbmpzLm9yZy93aWtpL1VuaXRfVGVzdGluZy8xLjBcbi8vXG4vLyBUSElTIElTIE5PVCBURVNURUQgTk9SIExJS0VMWSBUTyBXT1JLIE9VVFNJREUgVjghXG4vL1xuLy8gT3JpZ2luYWxseSBmcm9tIG5hcndoYWwuanMgKGh0dHA6Ly9uYXJ3aGFsanMub3JnKVxuLy8gQ29weXJpZ2h0IChjKSAyMDA5IFRob21hcyBSb2JpbnNvbiA8Mjgwbm9ydGguY29tPlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlICdTb2Z0d2FyZScpLCB0b1xuLy8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGVcbi8vIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vclxuLy8gc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCAnQVMgSVMnLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4vLyBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbi8vIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuLy8gQVVUSE9SUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU5cbi8vIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT05cbi8vIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwvJyk7XG52YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbnZhciBwU2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG52YXIgZnVuY3Rpb25zSGF2ZU5hbWVzID0gKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGZvbygpIHt9Lm5hbWUgPT09ICdmb28nO1xufSgpKTtcbmZ1bmN0aW9uIHBUb1N0cmluZyAob2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKTtcbn1cbmZ1bmN0aW9uIGlzVmlldyhhcnJidWYpIHtcbiAgaWYgKGlzQnVmZmVyKGFycmJ1ZikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBnbG9iYWwuQXJyYXlCdWZmZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKHR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQXJyYXlCdWZmZXIuaXNWaWV3KGFycmJ1Zik7XG4gIH1cbiAgaWYgKCFhcnJidWYpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKGFycmJ1ZiBpbnN0YW5jZW9mIERhdGFWaWV3KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKGFycmJ1Zi5idWZmZXIgJiYgYXJyYnVmLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuLy8gMS4gVGhlIGFzc2VydCBtb2R1bGUgcHJvdmlkZXMgZnVuY3Rpb25zIHRoYXQgdGhyb3dcbi8vIEFzc2VydGlvbkVycm9yJ3Mgd2hlbiBwYXJ0aWN1bGFyIGNvbmRpdGlvbnMgYXJlIG5vdCBtZXQuIFRoZVxuLy8gYXNzZXJ0IG1vZHVsZSBtdXN0IGNvbmZvcm0gdG8gdGhlIGZvbGxvd2luZyBpbnRlcmZhY2UuXG5cbnZhciBhc3NlcnQgPSBtb2R1bGUuZXhwb3J0cyA9IG9rO1xuXG4vLyAyLiBUaGUgQXNzZXJ0aW9uRXJyb3IgaXMgZGVmaW5lZCBpbiBhc3NlcnQuXG4vLyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHsgbWVzc2FnZTogbWVzc2FnZSxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3R1YWw6IGFjdHVhbCxcbi8vICAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3RlZDogZXhwZWN0ZWQgfSlcblxudmFyIHJlZ2V4ID0gL1xccypmdW5jdGlvblxccysoW15cXChcXHNdKilcXHMqLztcbi8vIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9samhhcmIvZnVuY3Rpb24ucHJvdG90eXBlLm5hbWUvYmxvYi9hZGVlZWVjOGJmY2M2MDY4YjE4N2Q3ZDlmYjNkNWJiMWQzYTMwODk5L2ltcGxlbWVudGF0aW9uLmpzXG5mdW5jdGlvbiBnZXROYW1lKGZ1bmMpIHtcbiAgaWYgKCF1dGlsLmlzRnVuY3Rpb24oZnVuYykpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGZ1bmN0aW9uc0hhdmVOYW1lcykge1xuICAgIHJldHVybiBmdW5jLm5hbWU7XG4gIH1cbiAgdmFyIHN0ciA9IGZ1bmMudG9TdHJpbmcoKTtcbiAgdmFyIG1hdGNoID0gc3RyLm1hdGNoKHJlZ2V4KTtcbiAgcmV0dXJuIG1hdGNoICYmIG1hdGNoWzFdO1xufVxuYXNzZXJ0LkFzc2VydGlvbkVycm9yID0gZnVuY3Rpb24gQXNzZXJ0aW9uRXJyb3Iob3B0aW9ucykge1xuICB0aGlzLm5hbWUgPSAnQXNzZXJ0aW9uRXJyb3InO1xuICB0aGlzLmFjdHVhbCA9IG9wdGlvbnMuYWN0dWFsO1xuICB0aGlzLmV4cGVjdGVkID0gb3B0aW9ucy5leHBlY3RlZDtcbiAgdGhpcy5vcGVyYXRvciA9IG9wdGlvbnMub3BlcmF0b3I7XG4gIGlmIChvcHRpb25zLm1lc3NhZ2UpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2U7XG4gICAgdGhpcy5nZW5lcmF0ZWRNZXNzYWdlID0gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5tZXNzYWdlID0gZ2V0TWVzc2FnZSh0aGlzKTtcbiAgICB0aGlzLmdlbmVyYXRlZE1lc3NhZ2UgPSB0cnVlO1xuICB9XG4gIHZhciBzdGFja1N0YXJ0RnVuY3Rpb24gPSBvcHRpb25zLnN0YWNrU3RhcnRGdW5jdGlvbiB8fCBmYWlsO1xuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBzdGFja1N0YXJ0RnVuY3Rpb24pO1xuICB9IGVsc2Uge1xuICAgIC8vIG5vbiB2OCBicm93c2VycyBzbyB3ZSBjYW4gaGF2ZSBhIHN0YWNrdHJhY2VcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCk7XG4gICAgaWYgKGVyci5zdGFjaykge1xuICAgICAgdmFyIG91dCA9IGVyci5zdGFjaztcblxuICAgICAgLy8gdHJ5IHRvIHN0cmlwIHVzZWxlc3MgZnJhbWVzXG4gICAgICB2YXIgZm5fbmFtZSA9IGdldE5hbWUoc3RhY2tTdGFydEZ1bmN0aW9uKTtcbiAgICAgIHZhciBpZHggPSBvdXQuaW5kZXhPZignXFxuJyArIGZuX25hbWUpO1xuICAgICAgaWYgKGlkeCA+PSAwKSB7XG4gICAgICAgIC8vIG9uY2Ugd2UgaGF2ZSBsb2NhdGVkIHRoZSBmdW5jdGlvbiBmcmFtZVxuICAgICAgICAvLyB3ZSBuZWVkIHRvIHN0cmlwIG91dCBldmVyeXRoaW5nIGJlZm9yZSBpdCAoYW5kIGl0cyBsaW5lKVxuICAgICAgICB2YXIgbmV4dF9saW5lID0gb3V0LmluZGV4T2YoJ1xcbicsIGlkeCArIDEpO1xuICAgICAgICBvdXQgPSBvdXQuc3Vic3RyaW5nKG5leHRfbGluZSArIDEpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnN0YWNrID0gb3V0O1xuICAgIH1cbiAgfVxufTtcblxuLy8gYXNzZXJ0LkFzc2VydGlvbkVycm9yIGluc3RhbmNlb2YgRXJyb3JcbnV0aWwuaW5oZXJpdHMoYXNzZXJ0LkFzc2VydGlvbkVycm9yLCBFcnJvcik7XG5cbmZ1bmN0aW9uIHRydW5jYXRlKHMsIG4pIHtcbiAgaWYgKHR5cGVvZiBzID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBzLmxlbmd0aCA8IG4gPyBzIDogcy5zbGljZSgwLCBuKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcztcbiAgfVxufVxuZnVuY3Rpb24gaW5zcGVjdChzb21ldGhpbmcpIHtcbiAgaWYgKGZ1bmN0aW9uc0hhdmVOYW1lcyB8fCAhdXRpbC5pc0Z1bmN0aW9uKHNvbWV0aGluZykpIHtcbiAgICByZXR1cm4gdXRpbC5pbnNwZWN0KHNvbWV0aGluZyk7XG4gIH1cbiAgdmFyIHJhd25hbWUgPSBnZXROYW1lKHNvbWV0aGluZyk7XG4gIHZhciBuYW1lID0gcmF3bmFtZSA/ICc6ICcgKyByYXduYW1lIDogJyc7XG4gIHJldHVybiAnW0Z1bmN0aW9uJyArICBuYW1lICsgJ10nO1xufVxuZnVuY3Rpb24gZ2V0TWVzc2FnZShzZWxmKSB7XG4gIHJldHVybiB0cnVuY2F0ZShpbnNwZWN0KHNlbGYuYWN0dWFsKSwgMTI4KSArICcgJyArXG4gICAgICAgICBzZWxmLm9wZXJhdG9yICsgJyAnICtcbiAgICAgICAgIHRydW5jYXRlKGluc3BlY3Qoc2VsZi5leHBlY3RlZCksIDEyOCk7XG59XG5cbi8vIEF0IHByZXNlbnQgb25seSB0aGUgdGhyZWUga2V5cyBtZW50aW9uZWQgYWJvdmUgYXJlIHVzZWQgYW5kXG4vLyB1bmRlcnN0b29kIGJ5IHRoZSBzcGVjLiBJbXBsZW1lbnRhdGlvbnMgb3Igc3ViIG1vZHVsZXMgY2FuIHBhc3Ncbi8vIG90aGVyIGtleXMgdG8gdGhlIEFzc2VydGlvbkVycm9yJ3MgY29uc3RydWN0b3IgLSB0aGV5IHdpbGwgYmVcbi8vIGlnbm9yZWQuXG5cbi8vIDMuIEFsbCBvZiB0aGUgZm9sbG93aW5nIGZ1bmN0aW9ucyBtdXN0IHRocm93IGFuIEFzc2VydGlvbkVycm9yXG4vLyB3aGVuIGEgY29ycmVzcG9uZGluZyBjb25kaXRpb24gaXMgbm90IG1ldCwgd2l0aCBhIG1lc3NhZ2UgdGhhdFxuLy8gbWF5IGJlIHVuZGVmaW5lZCBpZiBub3QgcHJvdmlkZWQuICBBbGwgYXNzZXJ0aW9uIG1ldGhvZHMgcHJvdmlkZVxuLy8gYm90aCB0aGUgYWN0dWFsIGFuZCBleHBlY3RlZCB2YWx1ZXMgdG8gdGhlIGFzc2VydGlvbiBlcnJvciBmb3Jcbi8vIGRpc3BsYXkgcHVycG9zZXMuXG5cbmZ1bmN0aW9uIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgb3BlcmF0b3IsIHN0YWNrU3RhcnRGdW5jdGlvbikge1xuICB0aHJvdyBuZXcgYXNzZXJ0LkFzc2VydGlvbkVycm9yKHtcbiAgICBtZXNzYWdlOiBtZXNzYWdlLFxuICAgIGFjdHVhbDogYWN0dWFsLFxuICAgIGV4cGVjdGVkOiBleHBlY3RlZCxcbiAgICBvcGVyYXRvcjogb3BlcmF0b3IsXG4gICAgc3RhY2tTdGFydEZ1bmN0aW9uOiBzdGFja1N0YXJ0RnVuY3Rpb25cbiAgfSk7XG59XG5cbi8vIEVYVEVOU0lPTiEgYWxsb3dzIGZvciB3ZWxsIGJlaGF2ZWQgZXJyb3JzIGRlZmluZWQgZWxzZXdoZXJlLlxuYXNzZXJ0LmZhaWwgPSBmYWlsO1xuXG4vLyA0LiBQdXJlIGFzc2VydGlvbiB0ZXN0cyB3aGV0aGVyIGEgdmFsdWUgaXMgdHJ1dGh5LCBhcyBkZXRlcm1pbmVkXG4vLyBieSAhIWd1YXJkLlxuLy8gYXNzZXJ0Lm9rKGd1YXJkLCBtZXNzYWdlX29wdCk7XG4vLyBUaGlzIHN0YXRlbWVudCBpcyBlcXVpdmFsZW50IHRvIGFzc2VydC5lcXVhbCh0cnVlLCAhIWd1YXJkLFxuLy8gbWVzc2FnZV9vcHQpOy4gVG8gdGVzdCBzdHJpY3RseSBmb3IgdGhlIHZhbHVlIHRydWUsIHVzZVxuLy8gYXNzZXJ0LnN0cmljdEVxdWFsKHRydWUsIGd1YXJkLCBtZXNzYWdlX29wdCk7LlxuXG5mdW5jdGlvbiBvayh2YWx1ZSwgbWVzc2FnZSkge1xuICBpZiAoIXZhbHVlKSBmYWlsKHZhbHVlLCB0cnVlLCBtZXNzYWdlLCAnPT0nLCBhc3NlcnQub2spO1xufVxuYXNzZXJ0Lm9rID0gb2s7XG5cbi8vIDUuIFRoZSBlcXVhbGl0eSBhc3NlcnRpb24gdGVzdHMgc2hhbGxvdywgY29lcmNpdmUgZXF1YWxpdHkgd2l0aFxuLy8gPT0uXG4vLyBhc3NlcnQuZXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZXF1YWwgPSBmdW5jdGlvbiBlcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT0gZXhwZWN0ZWQpIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJz09JywgYXNzZXJ0LmVxdWFsKTtcbn07XG5cbi8vIDYuIFRoZSBub24tZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIGZvciB3aGV0aGVyIHR3byBvYmplY3RzIGFyZSBub3QgZXF1YWxcbi8vIHdpdGggIT0gYXNzZXJ0Lm5vdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2Vfb3B0KTtcblxuYXNzZXJ0Lm5vdEVxdWFsID0gZnVuY3Rpb24gbm90RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoYWN0dWFsID09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnIT0nLCBhc3NlcnQubm90RXF1YWwpO1xuICB9XG59O1xuXG4vLyA3LiBUaGUgZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGEgZGVlcCBlcXVhbGl0eSByZWxhdGlvbi5cbi8vIGFzc2VydC5kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuZGVlcEVxdWFsID0gZnVuY3Rpb24gZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIGZhbHNlKSkge1xuICAgIGZhaWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSwgJ2RlZXBFcXVhbCcsIGFzc2VydC5kZWVwRXF1YWwpO1xuICB9XG59O1xuXG5hc3NlcnQuZGVlcFN0cmljdEVxdWFsID0gZnVuY3Rpb24gZGVlcFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHRydWUpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnZGVlcFN0cmljdEVxdWFsJywgYXNzZXJ0LmRlZXBTdHJpY3RFcXVhbCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIF9kZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgc3RyaWN0LCBtZW1vcykge1xuICAvLyA3LjEuIEFsbCBpZGVudGljYWwgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBhcyBkZXRlcm1pbmVkIGJ5ID09PS5cbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0J1ZmZlcihhY3R1YWwpICYmIGlzQnVmZmVyKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBjb21wYXJlKGFjdHVhbCwgZXhwZWN0ZWQpID09PSAwO1xuXG4gIC8vIDcuMi4gSWYgdGhlIGV4cGVjdGVkIHZhbHVlIGlzIGEgRGF0ZSBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgRGF0ZSBvYmplY3QgdGhhdCByZWZlcnMgdG8gdGhlIHNhbWUgdGltZS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzRGF0ZShhY3R1YWwpICYmIHV0aWwuaXNEYXRlKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBhY3R1YWwuZ2V0VGltZSgpID09PSBleHBlY3RlZC5nZXRUaW1lKCk7XG5cbiAgLy8gNy4zIElmIHRoZSBleHBlY3RlZCB2YWx1ZSBpcyBhIFJlZ0V4cCBvYmplY3QsIHRoZSBhY3R1YWwgdmFsdWUgaXNcbiAgLy8gZXF1aXZhbGVudCBpZiBpdCBpcyBhbHNvIGEgUmVnRXhwIG9iamVjdCB3aXRoIHRoZSBzYW1lIHNvdXJjZSBhbmRcbiAgLy8gcHJvcGVydGllcyAoYGdsb2JhbGAsIGBtdWx0aWxpbmVgLCBgbGFzdEluZGV4YCwgYGlnbm9yZUNhc2VgKS5cbiAgfSBlbHNlIGlmICh1dGlsLmlzUmVnRXhwKGFjdHVhbCkgJiYgdXRpbC5pc1JlZ0V4cChleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gYWN0dWFsLnNvdXJjZSA9PT0gZXhwZWN0ZWQuc291cmNlICYmXG4gICAgICAgICAgIGFjdHVhbC5nbG9iYWwgPT09IGV4cGVjdGVkLmdsb2JhbCAmJlxuICAgICAgICAgICBhY3R1YWwubXVsdGlsaW5lID09PSBleHBlY3RlZC5tdWx0aWxpbmUgJiZcbiAgICAgICAgICAgYWN0dWFsLmxhc3RJbmRleCA9PT0gZXhwZWN0ZWQubGFzdEluZGV4ICYmXG4gICAgICAgICAgIGFjdHVhbC5pZ25vcmVDYXNlID09PSBleHBlY3RlZC5pZ25vcmVDYXNlO1xuXG4gIC8vIDcuNC4gT3RoZXIgcGFpcnMgdGhhdCBkbyBub3QgYm90aCBwYXNzIHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0JyxcbiAgLy8gZXF1aXZhbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSA9PS5cbiAgfSBlbHNlIGlmICgoYWN0dWFsID09PSBudWxsIHx8IHR5cGVvZiBhY3R1YWwgIT09ICdvYmplY3QnKSAmJlxuICAgICAgICAgICAgIChleHBlY3RlZCA9PT0gbnVsbCB8fCB0eXBlb2YgZXhwZWN0ZWQgIT09ICdvYmplY3QnKSkge1xuICAgIHJldHVybiBzdHJpY3QgPyBhY3R1YWwgPT09IGV4cGVjdGVkIDogYWN0dWFsID09IGV4cGVjdGVkO1xuXG4gIC8vIElmIGJvdGggdmFsdWVzIGFyZSBpbnN0YW5jZXMgb2YgdHlwZWQgYXJyYXlzLCB3cmFwIHRoZWlyIHVuZGVybHlpbmdcbiAgLy8gQXJyYXlCdWZmZXJzIGluIGEgQnVmZmVyIGVhY2ggdG8gaW5jcmVhc2UgcGVyZm9ybWFuY2VcbiAgLy8gVGhpcyBvcHRpbWl6YXRpb24gcmVxdWlyZXMgdGhlIGFycmF5cyB0byBoYXZlIHRoZSBzYW1lIHR5cGUgYXMgY2hlY2tlZCBieVxuICAvLyBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nIChha2EgcFRvU3RyaW5nKS4gTmV2ZXIgcGVyZm9ybSBiaW5hcnlcbiAgLy8gY29tcGFyaXNvbnMgZm9yIEZsb2F0KkFycmF5cywgdGhvdWdoLCBzaW5jZSBlLmcuICswID09PSAtMCBidXQgdGhlaXJcbiAgLy8gYml0IHBhdHRlcm5zIGFyZSBub3QgaWRlbnRpY2FsLlxuICB9IGVsc2UgaWYgKGlzVmlldyhhY3R1YWwpICYmIGlzVmlldyhleHBlY3RlZCkgJiZcbiAgICAgICAgICAgICBwVG9TdHJpbmcoYWN0dWFsKSA9PT0gcFRvU3RyaW5nKGV4cGVjdGVkKSAmJlxuICAgICAgICAgICAgICEoYWN0dWFsIGluc3RhbmNlb2YgRmxvYXQzMkFycmF5IHx8XG4gICAgICAgICAgICAgICBhY3R1YWwgaW5zdGFuY2VvZiBGbG9hdDY0QXJyYXkpKSB7XG4gICAgcmV0dXJuIGNvbXBhcmUobmV3IFVpbnQ4QXJyYXkoYWN0dWFsLmJ1ZmZlciksXG4gICAgICAgICAgICAgICAgICAgbmV3IFVpbnQ4QXJyYXkoZXhwZWN0ZWQuYnVmZmVyKSkgPT09IDA7XG5cbiAgLy8gNy41IEZvciBhbGwgb3RoZXIgT2JqZWN0IHBhaXJzLCBpbmNsdWRpbmcgQXJyYXkgb2JqZWN0cywgZXF1aXZhbGVuY2UgaXNcbiAgLy8gZGV0ZXJtaW5lZCBieSBoYXZpbmcgdGhlIHNhbWUgbnVtYmVyIG9mIG93bmVkIHByb3BlcnRpZXMgKGFzIHZlcmlmaWVkXG4gIC8vIHdpdGggT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKSwgdGhlIHNhbWUgc2V0IG9mIGtleXNcbiAgLy8gKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksIGVxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeVxuICAvLyBjb3JyZXNwb25kaW5nIGtleSwgYW5kIGFuIGlkZW50aWNhbCAncHJvdG90eXBlJyBwcm9wZXJ0eS4gTm90ZTogdGhpc1xuICAvLyBhY2NvdW50cyBmb3IgYm90aCBuYW1lZCBhbmQgaW5kZXhlZCBwcm9wZXJ0aWVzIG9uIEFycmF5cy5cbiAgfSBlbHNlIGlmIChpc0J1ZmZlcihhY3R1YWwpICE9PSBpc0J1ZmZlcihleHBlY3RlZCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0gZWxzZSB7XG4gICAgbWVtb3MgPSBtZW1vcyB8fCB7YWN0dWFsOiBbXSwgZXhwZWN0ZWQ6IFtdfTtcblxuICAgIHZhciBhY3R1YWxJbmRleCA9IG1lbW9zLmFjdHVhbC5pbmRleE9mKGFjdHVhbCk7XG4gICAgaWYgKGFjdHVhbEluZGV4ICE9PSAtMSkge1xuICAgICAgaWYgKGFjdHVhbEluZGV4ID09PSBtZW1vcy5leHBlY3RlZC5pbmRleE9mKGV4cGVjdGVkKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vcy5hY3R1YWwucHVzaChhY3R1YWwpO1xuICAgIG1lbW9zLmV4cGVjdGVkLnB1c2goZXhwZWN0ZWQpO1xuXG4gICAgcmV0dXJuIG9iakVxdWl2KGFjdHVhbCwgZXhwZWN0ZWQsIHN0cmljdCwgbWVtb3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzQXJndW1lbnRzKG9iamVjdCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdCkgPT0gJ1tvYmplY3QgQXJndW1lbnRzXSc7XG59XG5cbmZ1bmN0aW9uIG9iakVxdWl2KGEsIGIsIHN0cmljdCwgYWN0dWFsVmlzaXRlZE9iamVjdHMpIHtcbiAgaWYgKGEgPT09IG51bGwgfHwgYSA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IG51bGwgfHwgYiA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcbiAgLy8gaWYgb25lIGlzIGEgcHJpbWl0aXZlLCB0aGUgb3RoZXIgbXVzdCBiZSBzYW1lXG4gIGlmICh1dGlsLmlzUHJpbWl0aXZlKGEpIHx8IHV0aWwuaXNQcmltaXRpdmUoYikpXG4gICAgcmV0dXJuIGEgPT09IGI7XG4gIGlmIChzdHJpY3QgJiYgT2JqZWN0LmdldFByb3RvdHlwZU9mKGEpICE9PSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYikpXG4gICAgcmV0dXJuIGZhbHNlO1xuICB2YXIgYUlzQXJncyA9IGlzQXJndW1lbnRzKGEpO1xuICB2YXIgYklzQXJncyA9IGlzQXJndW1lbnRzKGIpO1xuICBpZiAoKGFJc0FyZ3MgJiYgIWJJc0FyZ3MpIHx8ICghYUlzQXJncyAmJiBiSXNBcmdzKSlcbiAgICByZXR1cm4gZmFsc2U7XG4gIGlmIChhSXNBcmdzKSB7XG4gICAgYSA9IHBTbGljZS5jYWxsKGEpO1xuICAgIGIgPSBwU2xpY2UuY2FsbChiKTtcbiAgICByZXR1cm4gX2RlZXBFcXVhbChhLCBiLCBzdHJpY3QpO1xuICB9XG4gIHZhciBrYSA9IG9iamVjdEtleXMoYSk7XG4gIHZhciBrYiA9IG9iamVjdEtleXMoYik7XG4gIHZhciBrZXksIGk7XG4gIC8vIGhhdmluZyB0aGUgc2FtZSBudW1iZXIgb2Ygb3duZWQgcHJvcGVydGllcyAoa2V5cyBpbmNvcnBvcmF0ZXNcbiAgLy8gaGFzT3duUHJvcGVydHkpXG4gIGlmIChrYS5sZW5ndGggIT09IGtiLmxlbmd0aClcbiAgICByZXR1cm4gZmFsc2U7XG4gIC8vdGhlIHNhbWUgc2V0IG9mIGtleXMgKGFsdGhvdWdoIG5vdCBuZWNlc3NhcmlseSB0aGUgc2FtZSBvcmRlciksXG4gIGthLnNvcnQoKTtcbiAga2Iuc29ydCgpO1xuICAvL35+fmNoZWFwIGtleSB0ZXN0XG4gIGZvciAoaSA9IGthLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgaWYgKGthW2ldICE9PSBrYltpXSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvL2VxdWl2YWxlbnQgdmFsdWVzIGZvciBldmVyeSBjb3JyZXNwb25kaW5nIGtleSwgYW5kXG4gIC8vfn5+cG9zc2libHkgZXhwZW5zaXZlIGRlZXAgdGVzdFxuICBmb3IgKGkgPSBrYS5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGtleSA9IGthW2ldO1xuICAgIGlmICghX2RlZXBFcXVhbChhW2tleV0sIGJba2V5XSwgc3RyaWN0LCBhY3R1YWxWaXNpdGVkT2JqZWN0cykpXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIDguIFRoZSBub24tZXF1aXZhbGVuY2UgYXNzZXJ0aW9uIHRlc3RzIGZvciBhbnkgZGVlcCBpbmVxdWFsaXR5LlxuLy8gYXNzZXJ0Lm5vdERlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3REZWVwRXF1YWwgPSBmdW5jdGlvbiBub3REZWVwRXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZSkge1xuICBpZiAoX2RlZXBFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBmYWxzZSkpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICdub3REZWVwRXF1YWwnLCBhc3NlcnQubm90RGVlcEVxdWFsKTtcbiAgfVxufTtcblxuYXNzZXJ0Lm5vdERlZXBTdHJpY3RFcXVhbCA9IG5vdERlZXBTdHJpY3RFcXVhbDtcbmZ1bmN0aW9uIG5vdERlZXBTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChfZGVlcEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIHRydWUpKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnbm90RGVlcFN0cmljdEVxdWFsJywgbm90RGVlcFN0cmljdEVxdWFsKTtcbiAgfVxufVxuXG5cbi8vIDkuIFRoZSBzdHJpY3QgZXF1YWxpdHkgYXNzZXJ0aW9uIHRlc3RzIHN0cmljdCBlcXVhbGl0eSwgYXMgZGV0ZXJtaW5lZCBieSA9PT0uXG4vLyBhc3NlcnQuc3RyaWN0RXF1YWwoYWN0dWFsLCBleHBlY3RlZCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQuc3RyaWN0RXF1YWwgPSBmdW5jdGlvbiBzdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlKSB7XG4gIGlmIChhY3R1YWwgIT09IGV4cGVjdGVkKSB7XG4gICAgZmFpbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlLCAnPT09JywgYXNzZXJ0LnN0cmljdEVxdWFsKTtcbiAgfVxufTtcblxuLy8gMTAuIFRoZSBzdHJpY3Qgbm9uLWVxdWFsaXR5IGFzc2VydGlvbiB0ZXN0cyBmb3Igc3RyaWN0IGluZXF1YWxpdHksIGFzXG4vLyBkZXRlcm1pbmVkIGJ5ICE9PS4gIGFzc2VydC5ub3RTdHJpY3RFcXVhbChhY3R1YWwsIGV4cGVjdGVkLCBtZXNzYWdlX29wdCk7XG5cbmFzc2VydC5ub3RTdHJpY3RFcXVhbCA9IGZ1bmN0aW9uIG5vdFN0cmljdEVxdWFsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgaWYgKGFjdHVhbCA9PT0gZXhwZWN0ZWQpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsIG1lc3NhZ2UsICchPT0nLCBhc3NlcnQubm90U3RyaWN0RXF1YWwpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSB7XG4gIGlmICghYWN0dWFsIHx8ICFleHBlY3RlZCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZXhwZWN0ZWQpID09ICdbb2JqZWN0IFJlZ0V4cF0nKSB7XG4gICAgcmV0dXJuIGV4cGVjdGVkLnRlc3QoYWN0dWFsKTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgaWYgKGFjdHVhbCBpbnN0YW5jZW9mIGV4cGVjdGVkKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBJZ25vcmUuICBUaGUgaW5zdGFuY2VvZiBjaGVjayBkb2Vzbid0IHdvcmsgZm9yIGFycm93IGZ1bmN0aW9ucy5cbiAgfVxuXG4gIGlmIChFcnJvci5pc1Byb3RvdHlwZU9mKGV4cGVjdGVkKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBleHBlY3RlZC5jYWxsKHt9LCBhY3R1YWwpID09PSB0cnVlO1xufVxuXG5mdW5jdGlvbiBfdHJ5QmxvY2soYmxvY2spIHtcbiAgdmFyIGVycm9yO1xuICB0cnkge1xuICAgIGJsb2NrKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBlcnJvciA9IGU7XG4gIH1cbiAgcmV0dXJuIGVycm9yO1xufVxuXG5mdW5jdGlvbiBfdGhyb3dzKHNob3VsZFRocm93LCBibG9jaywgZXhwZWN0ZWQsIG1lc3NhZ2UpIHtcbiAgdmFyIGFjdHVhbDtcblxuICBpZiAodHlwZW9mIGJsb2NrICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJibG9ja1wiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBleHBlY3RlZCA9PT0gJ3N0cmluZycpIHtcbiAgICBtZXNzYWdlID0gZXhwZWN0ZWQ7XG4gICAgZXhwZWN0ZWQgPSBudWxsO1xuICB9XG5cbiAgYWN0dWFsID0gX3RyeUJsb2NrKGJsb2NrKTtcblxuICBtZXNzYWdlID0gKGV4cGVjdGVkICYmIGV4cGVjdGVkLm5hbWUgPyAnICgnICsgZXhwZWN0ZWQubmFtZSArICcpLicgOiAnLicpICtcbiAgICAgICAgICAgIChtZXNzYWdlID8gJyAnICsgbWVzc2FnZSA6ICcuJyk7XG5cbiAgaWYgKHNob3VsZFRocm93ICYmICFhY3R1YWwpIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdNaXNzaW5nIGV4cGVjdGVkIGV4Y2VwdGlvbicgKyBtZXNzYWdlKTtcbiAgfVxuXG4gIHZhciB1c2VyUHJvdmlkZWRNZXNzYWdlID0gdHlwZW9mIG1lc3NhZ2UgPT09ICdzdHJpbmcnO1xuICB2YXIgaXNVbndhbnRlZEV4Y2VwdGlvbiA9ICFzaG91bGRUaHJvdyAmJiB1dGlsLmlzRXJyb3IoYWN0dWFsKTtcbiAgdmFyIGlzVW5leHBlY3RlZEV4Y2VwdGlvbiA9ICFzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgIWV4cGVjdGVkO1xuXG4gIGlmICgoaXNVbndhbnRlZEV4Y2VwdGlvbiAmJlxuICAgICAgdXNlclByb3ZpZGVkTWVzc2FnZSAmJlxuICAgICAgZXhwZWN0ZWRFeGNlcHRpb24oYWN0dWFsLCBleHBlY3RlZCkpIHx8XG4gICAgICBpc1VuZXhwZWN0ZWRFeGNlcHRpb24pIHtcbiAgICBmYWlsKGFjdHVhbCwgZXhwZWN0ZWQsICdHb3QgdW53YW50ZWQgZXhjZXB0aW9uJyArIG1lc3NhZ2UpO1xuICB9XG5cbiAgaWYgKChzaG91bGRUaHJvdyAmJiBhY3R1YWwgJiYgZXhwZWN0ZWQgJiZcbiAgICAgICFleHBlY3RlZEV4Y2VwdGlvbihhY3R1YWwsIGV4cGVjdGVkKSkgfHwgKCFzaG91bGRUaHJvdyAmJiBhY3R1YWwpKSB7XG4gICAgdGhyb3cgYWN0dWFsO1xuICB9XG59XG5cbi8vIDExLiBFeHBlY3RlZCB0byB0aHJvdyBhbiBlcnJvcjpcbi8vIGFzc2VydC50aHJvd3MoYmxvY2ssIEVycm9yX29wdCwgbWVzc2FnZV9vcHQpO1xuXG5hc3NlcnQudGhyb3dzID0gZnVuY3Rpb24oYmxvY2ssIC8qb3B0aW9uYWwqL2Vycm9yLCAvKm9wdGlvbmFsKi9tZXNzYWdlKSB7XG4gIF90aHJvd3ModHJ1ZSwgYmxvY2ssIGVycm9yLCBtZXNzYWdlKTtcbn07XG5cbi8vIEVYVEVOU0lPTiEgVGhpcyBpcyBhbm5veWluZyB0byB3cml0ZSBvdXRzaWRlIHRoaXMgbW9kdWxlLlxuYXNzZXJ0LmRvZXNOb3RUaHJvdyA9IGZ1bmN0aW9uKGJsb2NrLCAvKm9wdGlvbmFsKi9lcnJvciwgLypvcHRpb25hbCovbWVzc2FnZSkge1xuICBfdGhyb3dzKGZhbHNlLCBibG9jaywgZXJyb3IsIG1lc3NhZ2UpO1xufTtcblxuYXNzZXJ0LmlmRXJyb3IgPSBmdW5jdGlvbihlcnIpIHsgaWYgKGVycikgdGhyb3cgZXJyOyB9O1xuXG52YXIgb2JqZWN0S2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIChvYmopIHtcbiAgdmFyIGtleXMgPSBbXTtcbiAgZm9yICh2YXIga2V5IGluIG9iaikge1xuICAgIGlmIChoYXNPd24uY2FsbChvYmosIGtleSkpIGtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTtcbiIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG4vLyBjYWNoZWQgZnJvbSB3aGF0ZXZlciBnbG9iYWwgaXMgcHJlc2VudCBzbyB0aGF0IHRlc3QgcnVubmVycyB0aGF0IHN0dWIgaXRcbi8vIGRvbid0IGJyZWFrIHRoaW5ncy4gIEJ1dCB3ZSBuZWVkIHRvIHdyYXAgaXQgaW4gYSB0cnkgY2F0Y2ggaW4gY2FzZSBpdCBpc1xuLy8gd3JhcHBlZCBpbiBzdHJpY3QgbW9kZSBjb2RlIHdoaWNoIGRvZXNuJ3QgZGVmaW5lIGFueSBnbG9iYWxzLiAgSXQncyBpbnNpZGUgYVxuLy8gZnVuY3Rpb24gYmVjYXVzZSB0cnkvY2F0Y2hlcyBkZW9wdGltaXplIGluIGNlcnRhaW4gZW5naW5lcy5cblxudmFyIGNhY2hlZFNldFRpbWVvdXQ7XG52YXIgY2FjaGVkQ2xlYXJUaW1lb3V0O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2V0VGltb3V0KCkge1xuICAgIHRocm93IG5ldyBFcnJvcignc2V0VGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuZnVuY3Rpb24gZGVmYXVsdENsZWFyVGltZW91dCAoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdjbGVhclRpbWVvdXQgaGFzIG5vdCBiZWVuIGRlZmluZWQnKTtcbn1cbihmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBzZXRUaW1lb3V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjYWNoZWRTZXRUaW1lb3V0ID0gZGVmYXVsdFNldFRpbW91dDtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjbGVhclRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGNsZWFyVGltZW91dDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZENsZWFyVGltZW91dCA9IGRlZmF1bHRDbGVhclRpbWVvdXQ7XG4gICAgfVxufSAoKSlcbmZ1bmN0aW9uIHJ1blRpbWVvdXQoZnVuKSB7XG4gICAgaWYgKGNhY2hlZFNldFRpbWVvdXQgPT09IHNldFRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIC8vIGlmIHNldFRpbWVvdXQgd2Fzbid0IGF2YWlsYWJsZSBidXQgd2FzIGxhdHRlciBkZWZpbmVkXG4gICAgaWYgKChjYWNoZWRTZXRUaW1lb3V0ID09PSBkZWZhdWx0U2V0VGltb3V0IHx8ICFjYWNoZWRTZXRUaW1lb3V0KSAmJiBzZXRUaW1lb3V0KSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICByZXR1cm4gc2V0VGltZW91dChmdW4sIDApO1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICAvLyB3aGVuIHdoZW4gc29tZWJvZHkgaGFzIHNjcmV3ZWQgd2l0aCBzZXRUaW1lb3V0IGJ1dCBubyBJLkUuIG1hZGRuZXNzXG4gICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfSBjYXRjaChlKXtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIFdoZW4gd2UgYXJlIGluIEkuRS4gYnV0IHRoZSBzY3JpcHQgaGFzIGJlZW4gZXZhbGVkIHNvIEkuRS4gZG9lc24ndCB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbChudWxsLCBmdW4sIDApO1xuICAgICAgICB9IGNhdGNoKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3JcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRTZXRUaW1lb3V0LmNhbGwodGhpcywgZnVuLCAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG59XG5mdW5jdGlvbiBydW5DbGVhclRpbWVvdXQobWFya2VyKSB7XG4gICAgaWYgKGNhY2hlZENsZWFyVGltZW91dCA9PT0gY2xlYXJUaW1lb3V0KSB7XG4gICAgICAgIC8vbm9ybWFsIGVudmlyb21lbnRzIGluIHNhbmUgc2l0dWF0aW9uc1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIC8vIGlmIGNsZWFyVGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZENsZWFyVGltZW91dCA9PT0gZGVmYXVsdENsZWFyVGltZW91dCB8fCAhY2FjaGVkQ2xlYXJUaW1lb3V0KSAmJiBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICByZXR1cm4gY2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dChtYXJrZXIpO1xuICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0ICB0cnVzdCB0aGUgZ2xvYmFsIG9iamVjdCB3aGVuIGNhbGxlZCBub3JtYWxseVxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZENsZWFyVGltZW91dC5jYWxsKG51bGwsIG1hcmtlcik7XG4gICAgICAgIH0gY2F0Y2ggKGUpe1xuICAgICAgICAgICAgLy8gc2FtZSBhcyBhYm92ZSBidXQgd2hlbiBpdCdzIGEgdmVyc2lvbiBvZiBJLkUuIHRoYXQgbXVzdCBoYXZlIHRoZSBnbG9iYWwgb2JqZWN0IGZvciAndGhpcycsIGhvcGZ1bGx5IG91ciBjb250ZXh0IGNvcnJlY3Qgb3RoZXJ3aXNlIGl0IHdpbGwgdGhyb3cgYSBnbG9iYWwgZXJyb3IuXG4gICAgICAgICAgICAvLyBTb21lIHZlcnNpb25zIG9mIEkuRS4gaGF2ZSBkaWZmZXJlbnQgcnVsZXMgZm9yIGNsZWFyVGltZW91dCB2cyBzZXRUaW1lb3V0XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwodGhpcywgbWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cbn1cbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IHJ1blRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIHJ1bkNsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIHJ1blRpbWVvdXQoZHJhaW5RdWV1ZSk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucHJlcGVuZE9uY2VMaXN0ZW5lciA9IG5vb3A7XG5cbnByb2Nlc3MubGlzdGVuZXJzID0gZnVuY3Rpb24gKG5hbWUpIHsgcmV0dXJuIFtdIH1cblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCJpZiAodHlwZW9mIE9iamVjdC5jcmVhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgLy8gaW1wbGVtZW50YXRpb24gZnJvbSBzdGFuZGFyZCBub2RlLmpzICd1dGlsJyBtb2R1bGVcbiAgbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpbmhlcml0cyhjdG9yLCBzdXBlckN0b3IpIHtcbiAgICBjdG9yLnN1cGVyXyA9IHN1cGVyQ3RvclxuICAgIGN0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckN0b3IucHJvdG90eXBlLCB7XG4gICAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogY3RvcixcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0gZWxzZSB7XG4gIC8vIG9sZCBzY2hvb2wgc2hpbSBmb3Igb2xkIGJyb3dzZXJzXG4gIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaW5oZXJpdHMoY3Rvciwgc3VwZXJDdG9yKSB7XG4gICAgY3Rvci5zdXBlcl8gPSBzdXBlckN0b3JcbiAgICB2YXIgVGVtcEN0b3IgPSBmdW5jdGlvbiAoKSB7fVxuICAgIFRlbXBDdG9yLnByb3RvdHlwZSA9IHN1cGVyQ3Rvci5wcm90b3R5cGVcbiAgICBjdG9yLnByb3RvdHlwZSA9IG5ldyBUZW1wQ3RvcigpXG4gICAgY3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yXG4gIH1cbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gaXNCdWZmZXIoYXJnKSB7XG4gIHJldHVybiBhcmcgJiYgdHlwZW9mIGFyZyA9PT0gJ29iamVjdCdcbiAgICAmJiB0eXBlb2YgYXJnLmNvcHkgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLmZpbGwgPT09ICdmdW5jdGlvbidcbiAgICAmJiB0eXBlb2YgYXJnLnJlYWRVSW50OCA9PT0gJ2Z1bmN0aW9uJztcbn0iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIGZvcm1hdFJlZ0V4cCA9IC8lW3NkaiVdL2c7XG5leHBvcnRzLmZvcm1hdCA9IGZ1bmN0aW9uKGYpIHtcbiAgaWYgKCFpc1N0cmluZyhmKSkge1xuICAgIHZhciBvYmplY3RzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIG9iamVjdHMucHVzaChpbnNwZWN0KGFyZ3VtZW50c1tpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0cy5qb2luKCcgJyk7XG4gIH1cblxuICB2YXIgaSA9IDE7XG4gIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICB2YXIgbGVuID0gYXJncy5sZW5ndGg7XG4gIHZhciBzdHIgPSBTdHJpbmcoZikucmVwbGFjZShmb3JtYXRSZWdFeHAsIGZ1bmN0aW9uKHgpIHtcbiAgICBpZiAoeCA9PT0gJyUlJykgcmV0dXJuICclJztcbiAgICBpZiAoaSA+PSBsZW4pIHJldHVybiB4O1xuICAgIHN3aXRjaCAoeCkge1xuICAgICAgY2FzZSAnJXMnOiByZXR1cm4gU3RyaW5nKGFyZ3NbaSsrXSk7XG4gICAgICBjYXNlICclZCc6IHJldHVybiBOdW1iZXIoYXJnc1tpKytdKTtcbiAgICAgIGNhc2UgJyVqJzpcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYXJnc1tpKytdKTtcbiAgICAgICAgfSBjYXRjaCAoXykge1xuICAgICAgICAgIHJldHVybiAnW0NpcmN1bGFyXSc7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB4O1xuICAgIH1cbiAgfSk7XG4gIGZvciAodmFyIHggPSBhcmdzW2ldOyBpIDwgbGVuOyB4ID0gYXJnc1srK2ldKSB7XG4gICAgaWYgKGlzTnVsbCh4KSB8fCAhaXNPYmplY3QoeCkpIHtcbiAgICAgIHN0ciArPSAnICcgKyB4O1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgKz0gJyAnICsgaW5zcGVjdCh4KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHN0cjtcbn07XG5cblxuLy8gTWFyayB0aGF0IGEgbWV0aG9kIHNob3VsZCBub3QgYmUgdXNlZC5cbi8vIFJldHVybnMgYSBtb2RpZmllZCBmdW5jdGlvbiB3aGljaCB3YXJucyBvbmNlIGJ5IGRlZmF1bHQuXG4vLyBJZiAtLW5vLWRlcHJlY2F0aW9uIGlzIHNldCwgdGhlbiBpdCBpcyBhIG5vLW9wLlxuZXhwb3J0cy5kZXByZWNhdGUgPSBmdW5jdGlvbihmbiwgbXNnKSB7XG4gIC8vIEFsbG93IGZvciBkZXByZWNhdGluZyB0aGluZ3MgaW4gdGhlIHByb2Nlc3Mgb2Ygc3RhcnRpbmcgdXAuXG4gIGlmIChpc1VuZGVmaW5lZChnbG9iYWwucHJvY2VzcykpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gZXhwb3J0cy5kZXByZWNhdGUoZm4sIG1zZykuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKHByb2Nlc3Mubm9EZXByZWNhdGlvbiA9PT0gdHJ1ZSkge1xuICAgIHJldHVybiBmbjtcbiAgfVxuXG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gZGVwcmVjYXRlZCgpIHtcbiAgICBpZiAoIXdhcm5lZCkge1xuICAgICAgaWYgKHByb2Nlc3MudGhyb3dEZXByZWNhdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobXNnKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvY2Vzcy50cmFjZURlcHJlY2F0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUudHJhY2UobXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IobXNnKTtcbiAgICAgIH1cbiAgICAgIHdhcm5lZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9XG5cbiAgcmV0dXJuIGRlcHJlY2F0ZWQ7XG59O1xuXG5cbnZhciBkZWJ1Z3MgPSB7fTtcbnZhciBkZWJ1Z0Vudmlyb247XG5leHBvcnRzLmRlYnVnbG9nID0gZnVuY3Rpb24oc2V0KSB7XG4gIGlmIChpc1VuZGVmaW5lZChkZWJ1Z0Vudmlyb24pKVxuICAgIGRlYnVnRW52aXJvbiA9IHByb2Nlc3MuZW52Lk5PREVfREVCVUcgfHwgJyc7XG4gIHNldCA9IHNldC50b1VwcGVyQ2FzZSgpO1xuICBpZiAoIWRlYnVnc1tzZXRdKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoJ1xcXFxiJyArIHNldCArICdcXFxcYicsICdpJykudGVzdChkZWJ1Z0Vudmlyb24pKSB7XG4gICAgICB2YXIgcGlkID0gcHJvY2Vzcy5waWQ7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgbXNnID0gZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignJXMgJWQ6ICVzJywgc2V0LCBwaWQsIG1zZyk7XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWJ1Z3Nbc2V0XSA9IGZ1bmN0aW9uKCkge307XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWJ1Z3Nbc2V0XTtcbn07XG5cblxuLyoqXG4gKiBFY2hvcyB0aGUgdmFsdWUgb2YgYSB2YWx1ZS4gVHJ5cyB0byBwcmludCB0aGUgdmFsdWUgb3V0XG4gKiBpbiB0aGUgYmVzdCB3YXkgcG9zc2libGUgZ2l2ZW4gdGhlIGRpZmZlcmVudCB0eXBlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gcHJpbnQgb3V0LlxuICogQHBhcmFtIHtPYmplY3R9IG9wdHMgT3B0aW9uYWwgb3B0aW9ucyBvYmplY3QgdGhhdCBhbHRlcnMgdGhlIG91dHB1dC5cbiAqL1xuLyogbGVnYWN5OiBvYmosIHNob3dIaWRkZW4sIGRlcHRoLCBjb2xvcnMqL1xuZnVuY3Rpb24gaW5zcGVjdChvYmosIG9wdHMpIHtcbiAgLy8gZGVmYXVsdCBvcHRpb25zXG4gIHZhciBjdHggPSB7XG4gICAgc2VlbjogW10sXG4gICAgc3R5bGl6ZTogc3R5bGl6ZU5vQ29sb3JcbiAgfTtcbiAgLy8gbGVnYWN5Li4uXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDMpIGN0eC5kZXB0aCA9IGFyZ3VtZW50c1syXTtcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPj0gNCkgY3R4LmNvbG9ycyA9IGFyZ3VtZW50c1szXTtcbiAgaWYgKGlzQm9vbGVhbihvcHRzKSkge1xuICAgIC8vIGxlZ2FjeS4uLlxuICAgIGN0eC5zaG93SGlkZGVuID0gb3B0cztcbiAgfSBlbHNlIGlmIChvcHRzKSB7XG4gICAgLy8gZ290IGFuIFwib3B0aW9uc1wiIG9iamVjdFxuICAgIGV4cG9ydHMuX2V4dGVuZChjdHgsIG9wdHMpO1xuICB9XG4gIC8vIHNldCBkZWZhdWx0IG9wdGlvbnNcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5zaG93SGlkZGVuKSkgY3R4LnNob3dIaWRkZW4gPSBmYWxzZTtcbiAgaWYgKGlzVW5kZWZpbmVkKGN0eC5kZXB0aCkpIGN0eC5kZXB0aCA9IDI7XG4gIGlmIChpc1VuZGVmaW5lZChjdHguY29sb3JzKSkgY3R4LmNvbG9ycyA9IGZhbHNlO1xuICBpZiAoaXNVbmRlZmluZWQoY3R4LmN1c3RvbUluc3BlY3QpKSBjdHguY3VzdG9tSW5zcGVjdCA9IHRydWU7XG4gIGlmIChjdHguY29sb3JzKSBjdHguc3R5bGl6ZSA9IHN0eWxpemVXaXRoQ29sb3I7XG4gIHJldHVybiBmb3JtYXRWYWx1ZShjdHgsIG9iaiwgY3R4LmRlcHRoKTtcbn1cbmV4cG9ydHMuaW5zcGVjdCA9IGluc3BlY3Q7XG5cblxuLy8gaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9BTlNJX2VzY2FwZV9jb2RlI2dyYXBoaWNzXG5pbnNwZWN0LmNvbG9ycyA9IHtcbiAgJ2JvbGQnIDogWzEsIDIyXSxcbiAgJ2l0YWxpYycgOiBbMywgMjNdLFxuICAndW5kZXJsaW5lJyA6IFs0LCAyNF0sXG4gICdpbnZlcnNlJyA6IFs3LCAyN10sXG4gICd3aGl0ZScgOiBbMzcsIDM5XSxcbiAgJ2dyZXknIDogWzkwLCAzOV0sXG4gICdibGFjaycgOiBbMzAsIDM5XSxcbiAgJ2JsdWUnIDogWzM0LCAzOV0sXG4gICdjeWFuJyA6IFszNiwgMzldLFxuICAnZ3JlZW4nIDogWzMyLCAzOV0sXG4gICdtYWdlbnRhJyA6IFszNSwgMzldLFxuICAncmVkJyA6IFszMSwgMzldLFxuICAneWVsbG93JyA6IFszMywgMzldXG59O1xuXG4vLyBEb24ndCB1c2UgJ2JsdWUnIG5vdCB2aXNpYmxlIG9uIGNtZC5leGVcbmluc3BlY3Quc3R5bGVzID0ge1xuICAnc3BlY2lhbCc6ICdjeWFuJyxcbiAgJ251bWJlcic6ICd5ZWxsb3cnLFxuICAnYm9vbGVhbic6ICd5ZWxsb3cnLFxuICAndW5kZWZpbmVkJzogJ2dyZXknLFxuICAnbnVsbCc6ICdib2xkJyxcbiAgJ3N0cmluZyc6ICdncmVlbicsXG4gICdkYXRlJzogJ21hZ2VudGEnLFxuICAvLyBcIm5hbWVcIjogaW50ZW50aW9uYWxseSBub3Qgc3R5bGluZ1xuICAncmVnZXhwJzogJ3JlZCdcbn07XG5cblxuZnVuY3Rpb24gc3R5bGl6ZVdpdGhDb2xvcihzdHIsIHN0eWxlVHlwZSkge1xuICB2YXIgc3R5bGUgPSBpbnNwZWN0LnN0eWxlc1tzdHlsZVR5cGVdO1xuXG4gIGlmIChzdHlsZSkge1xuICAgIHJldHVybiAnXFx1MDAxYlsnICsgaW5zcGVjdC5jb2xvcnNbc3R5bGVdWzBdICsgJ20nICsgc3RyICtcbiAgICAgICAgICAgJ1xcdTAwMWJbJyArIGluc3BlY3QuY29sb3JzW3N0eWxlXVsxXSArICdtJztcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gc3RyO1xuICB9XG59XG5cblxuZnVuY3Rpb24gc3R5bGl6ZU5vQ29sb3Ioc3RyLCBzdHlsZVR5cGUpIHtcbiAgcmV0dXJuIHN0cjtcbn1cblxuXG5mdW5jdGlvbiBhcnJheVRvSGFzaChhcnJheSkge1xuICB2YXIgaGFzaCA9IHt9O1xuXG4gIGFycmF5LmZvckVhY2goZnVuY3Rpb24odmFsLCBpZHgpIHtcbiAgICBoYXNoW3ZhbF0gPSB0cnVlO1xuICB9KTtcblxuICByZXR1cm4gaGFzaDtcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRWYWx1ZShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMpIHtcbiAgLy8gUHJvdmlkZSBhIGhvb2sgZm9yIHVzZXItc3BlY2lmaWVkIGluc3BlY3QgZnVuY3Rpb25zLlxuICAvLyBDaGVjayB0aGF0IHZhbHVlIGlzIGFuIG9iamVjdCB3aXRoIGFuIGluc3BlY3QgZnVuY3Rpb24gb24gaXRcbiAgaWYgKGN0eC5jdXN0b21JbnNwZWN0ICYmXG4gICAgICB2YWx1ZSAmJlxuICAgICAgaXNGdW5jdGlvbih2YWx1ZS5pbnNwZWN0KSAmJlxuICAgICAgLy8gRmlsdGVyIG91dCB0aGUgdXRpbCBtb2R1bGUsIGl0J3MgaW5zcGVjdCBmdW5jdGlvbiBpcyBzcGVjaWFsXG4gICAgICB2YWx1ZS5pbnNwZWN0ICE9PSBleHBvcnRzLmluc3BlY3QgJiZcbiAgICAgIC8vIEFsc28gZmlsdGVyIG91dCBhbnkgcHJvdG90eXBlIG9iamVjdHMgdXNpbmcgdGhlIGNpcmN1bGFyIGNoZWNrLlxuICAgICAgISh2YWx1ZS5jb25zdHJ1Y3RvciAmJiB2YWx1ZS5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgPT09IHZhbHVlKSkge1xuICAgIHZhciByZXQgPSB2YWx1ZS5pbnNwZWN0KHJlY3Vyc2VUaW1lcywgY3R4KTtcbiAgICBpZiAoIWlzU3RyaW5nKHJldCkpIHtcbiAgICAgIHJldCA9IGZvcm1hdFZhbHVlKGN0eCwgcmV0LCByZWN1cnNlVGltZXMpO1xuICAgIH1cbiAgICByZXR1cm4gcmV0O1xuICB9XG5cbiAgLy8gUHJpbWl0aXZlIHR5cGVzIGNhbm5vdCBoYXZlIHByb3BlcnRpZXNcbiAgdmFyIHByaW1pdGl2ZSA9IGZvcm1hdFByaW1pdGl2ZShjdHgsIHZhbHVlKTtcbiAgaWYgKHByaW1pdGl2ZSkge1xuICAgIHJldHVybiBwcmltaXRpdmU7XG4gIH1cblxuICAvLyBMb29rIHVwIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QuXG4gIHZhciBrZXlzID0gT2JqZWN0LmtleXModmFsdWUpO1xuICB2YXIgdmlzaWJsZUtleXMgPSBhcnJheVRvSGFzaChrZXlzKTtcblxuICBpZiAoY3R4LnNob3dIaWRkZW4pIHtcbiAgICBrZXlzID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModmFsdWUpO1xuICB9XG5cbiAgLy8gSUUgZG9lc24ndCBtYWtlIGVycm9yIGZpZWxkcyBub24tZW51bWVyYWJsZVxuICAvLyBodHRwOi8vbXNkbi5taWNyb3NvZnQuY29tL2VuLXVzL2xpYnJhcnkvaWUvZHd3NTJzYnQodj12cy45NCkuYXNweFxuICBpZiAoaXNFcnJvcih2YWx1ZSlcbiAgICAgICYmIChrZXlzLmluZGV4T2YoJ21lc3NhZ2UnKSA+PSAwIHx8IGtleXMuaW5kZXhPZignZGVzY3JpcHRpb24nKSA+PSAwKSkge1xuICAgIHJldHVybiBmb3JtYXRFcnJvcih2YWx1ZSk7XG4gIH1cblxuICAvLyBTb21lIHR5cGUgb2Ygb2JqZWN0IHdpdGhvdXQgcHJvcGVydGllcyBjYW4gYmUgc2hvcnRjdXR0ZWQuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHZhbHVlKSkge1xuICAgICAgdmFyIG5hbWUgPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZSgnW0Z1bmN0aW9uJyArIG5hbWUgKyAnXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICAgIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBjdHguc3R5bGl6ZShSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpLCAncmVnZXhwJyk7XG4gICAgfVxuICAgIGlmIChpc0RhdGUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoRGF0ZS5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSksICdkYXRlJyk7XG4gICAgfVxuICAgIGlmIChpc0Vycm9yKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICB2YXIgYmFzZSA9ICcnLCBhcnJheSA9IGZhbHNlLCBicmFjZXMgPSBbJ3snLCAnfSddO1xuXG4gIC8vIE1ha2UgQXJyYXkgc2F5IHRoYXQgdGhleSBhcmUgQXJyYXlcbiAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgYXJyYXkgPSB0cnVlO1xuICAgIGJyYWNlcyA9IFsnWycsICddJ107XG4gIH1cblxuICAvLyBNYWtlIGZ1bmN0aW9ucyBzYXkgdGhhdCB0aGV5IGFyZSBmdW5jdGlvbnNcbiAgaWYgKGlzRnVuY3Rpb24odmFsdWUpKSB7XG4gICAgdmFyIG4gPSB2YWx1ZS5uYW1lID8gJzogJyArIHZhbHVlLm5hbWUgOiAnJztcbiAgICBiYXNlID0gJyBbRnVuY3Rpb24nICsgbiArICddJztcbiAgfVxuXG4gIC8vIE1ha2UgUmVnRXhwcyBzYXkgdGhhdCB0aGV5IGFyZSBSZWdFeHBzXG4gIGlmIChpc1JlZ0V4cCh2YWx1ZSkpIHtcbiAgICBiYXNlID0gJyAnICsgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZGF0ZXMgd2l0aCBwcm9wZXJ0aWVzIGZpcnN0IHNheSB0aGUgZGF0ZVxuICBpZiAoaXNEYXRlKHZhbHVlKSkge1xuICAgIGJhc2UgPSAnICcgKyBEYXRlLnByb3RvdHlwZS50b1VUQ1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgfVxuXG4gIC8vIE1ha2UgZXJyb3Igd2l0aCBtZXNzYWdlIGZpcnN0IHNheSB0aGUgZXJyb3JcbiAgaWYgKGlzRXJyb3IodmFsdWUpKSB7XG4gICAgYmFzZSA9ICcgJyArIGZvcm1hdEVycm9yKHZhbHVlKTtcbiAgfVxuXG4gIGlmIChrZXlzLmxlbmd0aCA9PT0gMCAmJiAoIWFycmF5IHx8IHZhbHVlLmxlbmd0aCA9PSAwKSkge1xuICAgIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgYnJhY2VzWzFdO1xuICB9XG5cbiAgaWYgKHJlY3Vyc2VUaW1lcyA8IDApIHtcbiAgICBpZiAoaXNSZWdFeHAodmFsdWUpKSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSwgJ3JlZ2V4cCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY3R4LnN0eWxpemUoJ1tPYmplY3RdJywgJ3NwZWNpYWwnKTtcbiAgICB9XG4gIH1cblxuICBjdHguc2Vlbi5wdXNoKHZhbHVlKTtcblxuICB2YXIgb3V0cHV0O1xuICBpZiAoYXJyYXkpIHtcbiAgICBvdXRwdXQgPSBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKTtcbiAgfSBlbHNlIHtcbiAgICBvdXRwdXQgPSBrZXlzLm1hcChmdW5jdGlvbihrZXkpIHtcbiAgICAgIHJldHVybiBmb3JtYXRQcm9wZXJ0eShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXksIGFycmF5KTtcbiAgICB9KTtcbiAgfVxuXG4gIGN0eC5zZWVuLnBvcCgpO1xuXG4gIHJldHVybiByZWR1Y2VUb1NpbmdsZVN0cmluZyhvdXRwdXQsIGJhc2UsIGJyYWNlcyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0UHJpbWl0aXZlKGN0eCwgdmFsdWUpIHtcbiAgaWYgKGlzVW5kZWZpbmVkKHZhbHVlKSlcbiAgICByZXR1cm4gY3R4LnN0eWxpemUoJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnKTtcbiAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgIHZhciBzaW1wbGUgPSAnXFwnJyArIEpTT04uc3RyaW5naWZ5KHZhbHVlKS5yZXBsYWNlKC9eXCJ8XCIkL2csICcnKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcXFxcIi9nLCAnXCInKSArICdcXCcnO1xuICAgIHJldHVybiBjdHguc3R5bGl6ZShzaW1wbGUsICdzdHJpbmcnKTtcbiAgfVxuICBpZiAoaXNOdW1iZXIodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnbnVtYmVyJyk7XG4gIGlmIChpc0Jvb2xlYW4odmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnJyArIHZhbHVlLCAnYm9vbGVhbicpO1xuICAvLyBGb3Igc29tZSByZWFzb24gdHlwZW9mIG51bGwgaXMgXCJvYmplY3RcIiwgc28gc3BlY2lhbCBjYXNlIGhlcmUuXG4gIGlmIChpc051bGwodmFsdWUpKVxuICAgIHJldHVybiBjdHguc3R5bGl6ZSgnbnVsbCcsICdudWxsJyk7XG59XG5cblxuZnVuY3Rpb24gZm9ybWF0RXJyb3IodmFsdWUpIHtcbiAgcmV0dXJuICdbJyArIEVycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbHVlKSArICddJztcbn1cblxuXG5mdW5jdGlvbiBmb3JtYXRBcnJheShjdHgsIHZhbHVlLCByZWN1cnNlVGltZXMsIHZpc2libGVLZXlzLCBrZXlzKSB7XG4gIHZhciBvdXRwdXQgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSB2YWx1ZS5sZW5ndGg7IGkgPCBsOyArK2kpIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkodmFsdWUsIFN0cmluZyhpKSkpIHtcbiAgICAgIG91dHB1dC5wdXNoKGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsXG4gICAgICAgICAgU3RyaW5nKGkpLCB0cnVlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dC5wdXNoKCcnKTtcbiAgICB9XG4gIH1cbiAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgIGlmICgha2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgb3V0cHV0LnB1c2goZm9ybWF0UHJvcGVydHkoY3R4LCB2YWx1ZSwgcmVjdXJzZVRpbWVzLCB2aXNpYmxlS2V5cyxcbiAgICAgICAgICBrZXksIHRydWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3V0cHV0O1xufVxuXG5cbmZ1bmN0aW9uIGZvcm1hdFByb3BlcnR5KGN0eCwgdmFsdWUsIHJlY3Vyc2VUaW1lcywgdmlzaWJsZUtleXMsIGtleSwgYXJyYXkpIHtcbiAgdmFyIG5hbWUsIHN0ciwgZGVzYztcbiAgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodmFsdWUsIGtleSkgfHwgeyB2YWx1ZTogdmFsdWVba2V5XSB9O1xuICBpZiAoZGVzYy5nZXQpIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbR2V0dGVyL1NldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzdHIgPSBjdHguc3R5bGl6ZSgnW0dldHRlcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoZGVzYy5zZXQpIHtcbiAgICAgIHN0ciA9IGN0eC5zdHlsaXplKCdbU2V0dGVyXScsICdzcGVjaWFsJyk7XG4gICAgfVxuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkodmlzaWJsZUtleXMsIGtleSkpIHtcbiAgICBuYW1lID0gJ1snICsga2V5ICsgJ10nO1xuICB9XG4gIGlmICghc3RyKSB7XG4gICAgaWYgKGN0eC5zZWVuLmluZGV4T2YoZGVzYy52YWx1ZSkgPCAwKSB7XG4gICAgICBpZiAoaXNOdWxsKHJlY3Vyc2VUaW1lcykpIHtcbiAgICAgICAgc3RyID0gZm9ybWF0VmFsdWUoY3R4LCBkZXNjLnZhbHVlLCBudWxsKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0ciA9IGZvcm1hdFZhbHVlKGN0eCwgZGVzYy52YWx1ZSwgcmVjdXJzZVRpbWVzIC0gMSk7XG4gICAgICB9XG4gICAgICBpZiAoc3RyLmluZGV4T2YoJ1xcbicpID4gLTEpIHtcbiAgICAgICAgaWYgKGFycmF5KSB7XG4gICAgICAgICAgc3RyID0gc3RyLnNwbGl0KCdcXG4nKS5tYXAoZnVuY3Rpb24obGluZSkge1xuICAgICAgICAgICAgcmV0dXJuICcgICcgKyBsaW5lO1xuICAgICAgICAgIH0pLmpvaW4oJ1xcbicpLnN1YnN0cigyKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHIgPSAnXFxuJyArIHN0ci5zcGxpdCgnXFxuJykubWFwKGZ1bmN0aW9uKGxpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnICAgJyArIGxpbmU7XG4gICAgICAgICAgfSkuam9pbignXFxuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gY3R4LnN0eWxpemUoJ1tDaXJjdWxhcl0nLCAnc3BlY2lhbCcpO1xuICAgIH1cbiAgfVxuICBpZiAoaXNVbmRlZmluZWQobmFtZSkpIHtcbiAgICBpZiAoYXJyYXkgJiYga2V5Lm1hdGNoKC9eXFxkKyQvKSkge1xuICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgbmFtZSA9IEpTT04uc3RyaW5naWZ5KCcnICsga2V5KTtcbiAgICBpZiAobmFtZS5tYXRjaCgvXlwiKFthLXpBLVpfXVthLXpBLVpfMC05XSopXCIkLykpIHtcbiAgICAgIG5hbWUgPSBuYW1lLnN1YnN0cigxLCBuYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICduYW1lJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBuYW1lLnJlcGxhY2UoLycvZywgXCJcXFxcJ1wiKVxuICAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxcXFwiL2csICdcIicpXG4gICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oXlwifFwiJCkvZywgXCInXCIpO1xuICAgICAgbmFtZSA9IGN0eC5zdHlsaXplKG5hbWUsICdzdHJpbmcnKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZSArICc6ICcgKyBzdHI7XG59XG5cblxuZnVuY3Rpb24gcmVkdWNlVG9TaW5nbGVTdHJpbmcob3V0cHV0LCBiYXNlLCBicmFjZXMpIHtcbiAgdmFyIG51bUxpbmVzRXN0ID0gMDtcbiAgdmFyIGxlbmd0aCA9IG91dHB1dC5yZWR1Y2UoZnVuY3Rpb24ocHJldiwgY3VyKSB7XG4gICAgbnVtTGluZXNFc3QrKztcbiAgICBpZiAoY3VyLmluZGV4T2YoJ1xcbicpID49IDApIG51bUxpbmVzRXN0Kys7XG4gICAgcmV0dXJuIHByZXYgKyBjdXIucmVwbGFjZSgvXFx1MDAxYlxcW1xcZFxcZD9tL2csICcnKS5sZW5ndGggKyAxO1xuICB9LCAwKTtcblxuICBpZiAobGVuZ3RoID4gNjApIHtcbiAgICByZXR1cm4gYnJhY2VzWzBdICtcbiAgICAgICAgICAgKGJhc2UgPT09ICcnID8gJycgOiBiYXNlICsgJ1xcbiAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIG91dHB1dC5qb2luKCcsXFxuICAnKSArXG4gICAgICAgICAgICcgJyArXG4gICAgICAgICAgIGJyYWNlc1sxXTtcbiAgfVxuXG4gIHJldHVybiBicmFjZXNbMF0gKyBiYXNlICsgJyAnICsgb3V0cHV0LmpvaW4oJywgJykgKyAnICcgKyBicmFjZXNbMV07XG59XG5cblxuLy8gTk9URTogVGhlc2UgdHlwZSBjaGVja2luZyBmdW5jdGlvbnMgaW50ZW50aW9uYWxseSBkb24ndCB1c2UgYGluc3RhbmNlb2ZgXG4vLyBiZWNhdXNlIGl0IGlzIGZyYWdpbGUgYW5kIGNhbiBiZSBlYXNpbHkgZmFrZWQgd2l0aCBgT2JqZWN0LmNyZWF0ZSgpYC5cbmZ1bmN0aW9uIGlzQXJyYXkoYXIpIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkoYXIpO1xufVxuZXhwb3J0cy5pc0FycmF5ID0gaXNBcnJheTtcblxuZnVuY3Rpb24gaXNCb29sZWFuKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Jvb2xlYW4nO1xufVxuZXhwb3J0cy5pc0Jvb2xlYW4gPSBpc0Jvb2xlYW47XG5cbmZ1bmN0aW9uIGlzTnVsbChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gbnVsbDtcbn1cbmV4cG9ydHMuaXNOdWxsID0gaXNOdWxsO1xuXG5mdW5jdGlvbiBpc051bGxPclVuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PSBudWxsO1xufVxuZXhwb3J0cy5pc051bGxPclVuZGVmaW5lZCA9IGlzTnVsbE9yVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuZXhwb3J0cy5pc051bWJlciA9IGlzTnVtYmVyO1xuXG5mdW5jdGlvbiBpc1N0cmluZyhhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnO1xufVxuZXhwb3J0cy5pc1N0cmluZyA9IGlzU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1N5bWJvbChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdzeW1ib2wnO1xufVxuZXhwb3J0cy5pc1N5bWJvbCA9IGlzU3ltYm9sO1xuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuZXhwb3J0cy5pc1VuZGVmaW5lZCA9IGlzVW5kZWZpbmVkO1xuXG5mdW5jdGlvbiBpc1JlZ0V4cChyZSkge1xuICByZXR1cm4gaXNPYmplY3QocmUpICYmIG9iamVjdFRvU3RyaW5nKHJlKSA9PT0gJ1tvYmplY3QgUmVnRXhwXSc7XG59XG5leHBvcnRzLmlzUmVnRXhwID0gaXNSZWdFeHA7XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuZXhwb3J0cy5pc09iamVjdCA9IGlzT2JqZWN0O1xuXG5mdW5jdGlvbiBpc0RhdGUoZCkge1xuICByZXR1cm4gaXNPYmplY3QoZCkgJiYgb2JqZWN0VG9TdHJpbmcoZCkgPT09ICdbb2JqZWN0IERhdGVdJztcbn1cbmV4cG9ydHMuaXNEYXRlID0gaXNEYXRlO1xuXG5mdW5jdGlvbiBpc0Vycm9yKGUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0KGUpICYmXG4gICAgICAob2JqZWN0VG9TdHJpbmcoZSkgPT09ICdbb2JqZWN0IEVycm9yXScgfHwgZSBpbnN0YW5jZW9mIEVycm9yKTtcbn1cbmV4cG9ydHMuaXNFcnJvciA9IGlzRXJyb3I7XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuZXhwb3J0cy5pc0Z1bmN0aW9uID0gaXNGdW5jdGlvbjtcblxuZnVuY3Rpb24gaXNQcmltaXRpdmUoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IG51bGwgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdib29sZWFuJyB8fFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ251bWJlcicgfHxcbiAgICAgICAgIHR5cGVvZiBhcmcgPT09ICdzdHJpbmcnIHx8XG4gICAgICAgICB0eXBlb2YgYXJnID09PSAnc3ltYm9sJyB8fCAgLy8gRVM2IHN5bWJvbFxuICAgICAgICAgdHlwZW9mIGFyZyA9PT0gJ3VuZGVmaW5lZCc7XG59XG5leHBvcnRzLmlzUHJpbWl0aXZlID0gaXNQcmltaXRpdmU7XG5cbmV4cG9ydHMuaXNCdWZmZXIgPSByZXF1aXJlKCcuL3N1cHBvcnQvaXNCdWZmZXInKTtcblxuZnVuY3Rpb24gb2JqZWN0VG9TdHJpbmcobykge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pO1xufVxuXG5cbmZ1bmN0aW9uIHBhZChuKSB7XG4gIHJldHVybiBuIDwgMTAgPyAnMCcgKyBuLnRvU3RyaW5nKDEwKSA6IG4udG9TdHJpbmcoMTApO1xufVxuXG5cbnZhciBtb250aHMgPSBbJ0phbicsICdGZWInLCAnTWFyJywgJ0FwcicsICdNYXknLCAnSnVuJywgJ0p1bCcsICdBdWcnLCAnU2VwJyxcbiAgICAgICAgICAgICAgJ09jdCcsICdOb3YnLCAnRGVjJ107XG5cbi8vIDI2IEZlYiAxNjoxOTozNFxuZnVuY3Rpb24gdGltZXN0YW1wKCkge1xuICB2YXIgZCA9IG5ldyBEYXRlKCk7XG4gIHZhciB0aW1lID0gW3BhZChkLmdldEhvdXJzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRNaW51dGVzKCkpLFxuICAgICAgICAgICAgICBwYWQoZC5nZXRTZWNvbmRzKCkpXS5qb2luKCc6Jyk7XG4gIHJldHVybiBbZC5nZXREYXRlKCksIG1vbnRoc1tkLmdldE1vbnRoKCldLCB0aW1lXS5qb2luKCcgJyk7XG59XG5cblxuLy8gbG9nIGlzIGp1c3QgYSB0aGluIHdyYXBwZXIgdG8gY29uc29sZS5sb2cgdGhhdCBwcmVwZW5kcyBhIHRpbWVzdGFtcFxuZXhwb3J0cy5sb2cgPSBmdW5jdGlvbigpIHtcbiAgY29uc29sZS5sb2coJyVzIC0gJXMnLCB0aW1lc3RhbXAoKSwgZXhwb3J0cy5mb3JtYXQuYXBwbHkoZXhwb3J0cywgYXJndW1lbnRzKSk7XG59O1xuXG5cbi8qKlxuICogSW5oZXJpdCB0aGUgcHJvdG90eXBlIG1ldGhvZHMgZnJvbSBvbmUgY29uc3RydWN0b3IgaW50byBhbm90aGVyLlxuICpcbiAqIFRoZSBGdW5jdGlvbi5wcm90b3R5cGUuaW5oZXJpdHMgZnJvbSBsYW5nLmpzIHJld3JpdHRlbiBhcyBhIHN0YW5kYWxvbmVcbiAqIGZ1bmN0aW9uIChub3Qgb24gRnVuY3Rpb24ucHJvdG90eXBlKS4gTk9URTogSWYgdGhpcyBmaWxlIGlzIHRvIGJlIGxvYWRlZFxuICogZHVyaW5nIGJvb3RzdHJhcHBpbmcgdGhpcyBmdW5jdGlvbiBuZWVkcyB0byBiZSByZXdyaXR0ZW4gdXNpbmcgc29tZSBuYXRpdmVcbiAqIGZ1bmN0aW9ucyBhcyBwcm90b3R5cGUgc2V0dXAgdXNpbmcgbm9ybWFsIEphdmFTY3JpcHQgZG9lcyBub3Qgd29yayBhc1xuICogZXhwZWN0ZWQgZHVyaW5nIGJvb3RzdHJhcHBpbmcgKHNlZSBtaXJyb3IuanMgaW4gcjExNDkwMykuXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB3aGljaCBuZWVkcyB0byBpbmhlcml0IHRoZVxuICogICAgIHByb3RvdHlwZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHN1cGVyQ3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiB0byBpbmhlcml0IHByb3RvdHlwZSBmcm9tLlxuICovXG5leHBvcnRzLmluaGVyaXRzID0gcmVxdWlyZSgnaW5oZXJpdHMnKTtcblxuZXhwb3J0cy5fZXh0ZW5kID0gZnVuY3Rpb24ob3JpZ2luLCBhZGQpIHtcbiAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgYWRkIGlzbid0IGFuIG9iamVjdFxuICBpZiAoIWFkZCB8fCAhaXNPYmplY3QoYWRkKSkgcmV0dXJuIG9yaWdpbjtcblxuICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFkZCk7XG4gIHZhciBpID0ga2V5cy5sZW5ndGg7XG4gIHdoaWxlIChpLS0pIHtcbiAgICBvcmlnaW5ba2V5c1tpXV0gPSBhZGRba2V5c1tpXV07XG4gIH1cbiAgcmV0dXJuIG9yaWdpbjtcbn07XG5cbmZ1bmN0aW9uIGhhc093blByb3BlcnR5KG9iaiwgcHJvcCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7XG59XG4iLCIvLyDjgavjgoPjg7zjgpNcclxuXHJcbmxldCBDYXRNYXRoID0ge307XHJcblxyXG4vKipcclxuICogYWRkcyBhIHR3byB2ZWNcclxuICogQHBhcmFtIHthcnJheX0gYSAtIHZlY1xyXG4gKiBAcGFyYW0ge2FycmF5fSBiIC0gdmVjXHJcbiAqL1xyXG5DYXRNYXRoLnZlY0FkZCA9ICggYSwgYiApID0+IGEubWFwKCAoIGUsIGkgKSA9PiBlICsgYltpXSApO1xyXG5cclxuLyoqXHJcbiAqIHN1YnN0cmFjdHMgYSB2ZWMgZnJvbSBhbiBhbm90aGVyIHZlY1xyXG4gKiBAcGFyYW0ge2FycmF5fSBhIC0gdmVjXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGIgLSB2ZWNcclxuICovXHJcbkNhdE1hdGgudmVjU3ViID0gKCBhLCBiICkgPT4gYS5tYXAoICggZSwgaSApID0+IGUgLSBiW2ldICk7XHJcblxyXG4vKipcclxuICogcmV0dXJucyBhIGNyb3NzIG9mIHR3byB2ZWMzc1xyXG4gKiBAcGFyYW0ge2FycmF5fSBhIC0gdmVjM1xyXG4gKiBAcGFyYW0ge2FycmF5fSBiIC0gdmVjM1xyXG4gKi9cclxuQ2F0TWF0aC52ZWMzQ3Jvc3MgPSAoIGEsIGIgKSA9PiBbXHJcbiAgYVsxXSAqIGJbMl0gLSBhWzJdICogYlsxXSxcclxuICBhWzJdICogYlswXSAtIGFbMF0gKiBiWzJdLFxyXG4gIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF1cclxuXTtcclxuXHJcbi8qKlxyXG4gKiBzY2FsZXMgYSB2ZWMgYnkgc2NhbGFyXHJcbiAqIEBwYXJhbSB7bnVtYmVyfSBzIC0gc2NhbGFyXHJcbiAqIEBwYXJhbSB7YXJyYXl9IHYgLSB2ZWNcclxuICovXHJcbkNhdE1hdGgudmVjU2NhbGUgPSAoIHMsIHYgKSA9PiB2Lm1hcCggZSA9PiBlICogcyApO1xyXG5cclxuLyoqXHJcbiAqIHJldHVybnMgbGVuZ3RoIG9mIGEgdmVjXHJcbiAqIEBwYXJhbSB7YXJyYXl9IHYgLSB2ZWNcclxuICovXHJcbkNhdE1hdGgudmVjTGVuZ3RoID0gdiA9PiBNYXRoLnNxcnQoIHYucmVkdWNlKCAoIHAsIGMgKSA9PiBwICsgYyAqIGMsIDAuMCApICk7XHJcblxyXG4vKipcclxuICogbm9ybWFsaXplcyBhIHZlY1xyXG4gKiBAcGFyYW0ge2FycmF5fSB2IC0gdmVjXHJcbiAqL1xyXG5DYXRNYXRoLnZlY05vcm1hbGl6ZSA9IHYgPT4gQ2F0TWF0aC52ZWNTY2FsZSggMS4wIC8gQ2F0TWF0aC52ZWNMZW5ndGgoIHYgKSwgdiApO1xyXG5cclxuLyoqXHJcbiAqIGFwcGxpZXMgdHdvIG1hdDRzXHJcbiAqIEBwYXJhbSB7YXJyYXl9IGEgLSBtYXQ0XHJcbiAqIEBwYXJhbSB7YXJyYXl9IGIgLSBtYXQ0XHJcbiAqL1xyXG5DYXRNYXRoLm1hdDRBcHBseSA9ICggYSwgYiApID0+IHtcclxuICByZXR1cm4gW1xyXG4gICAgYVsgMF0gKiBiWyAwXSArIGFbIDRdICogYlsgMV0gKyBhWyA4XSAqIGJbIDJdICsgYVsxMl0gKiBiWyAzXSxcclxuICAgIGFbIDFdICogYlsgMF0gKyBhWyA1XSAqIGJbIDFdICsgYVsgOV0gKiBiWyAyXSArIGFbMTNdICogYlsgM10sXHJcbiAgICBhWyAyXSAqIGJbIDBdICsgYVsgNl0gKiBiWyAxXSArIGFbMTBdICogYlsgMl0gKyBhWzE0XSAqIGJbIDNdLFxyXG4gICAgYVsgM10gKiBiWyAwXSArIGFbIDddICogYlsgMV0gKyBhWzExXSAqIGJbIDJdICsgYVsxNV0gKiBiWyAzXSxcclxuXHJcbiAgICBhWyAwXSAqIGJbIDRdICsgYVsgNF0gKiBiWyA1XSArIGFbIDhdICogYlsgNl0gKyBhWzEyXSAqIGJbIDddLFxyXG4gICAgYVsgMV0gKiBiWyA0XSArIGFbIDVdICogYlsgNV0gKyBhWyA5XSAqIGJbIDZdICsgYVsxM10gKiBiWyA3XSxcclxuICAgIGFbIDJdICogYlsgNF0gKyBhWyA2XSAqIGJbIDVdICsgYVsxMF0gKiBiWyA2XSArIGFbMTRdICogYlsgN10sXHJcbiAgICBhWyAzXSAqIGJbIDRdICsgYVsgN10gKiBiWyA1XSArIGFbMTFdICogYlsgNl0gKyBhWzE1XSAqIGJbIDddLFxyXG5cclxuICAgIGFbIDBdICogYlsgOF0gKyBhWyA0XSAqIGJbIDldICsgYVsgOF0gKiBiWzEwXSArIGFbMTJdICogYlsxMV0sXHJcbiAgICBhWyAxXSAqIGJbIDhdICsgYVsgNV0gKiBiWyA5XSArIGFbIDldICogYlsxMF0gKyBhWzEzXSAqIGJbMTFdLFxyXG4gICAgYVsgMl0gKiBiWyA4XSArIGFbIDZdICogYlsgOV0gKyBhWzEwXSAqIGJbMTBdICsgYVsxNF0gKiBiWzExXSxcclxuICAgIGFbIDNdICogYlsgOF0gKyBhWyA3XSAqIGJbIDldICsgYVsxMV0gKiBiWzEwXSArIGFbMTVdICogYlsxMV0sXHJcbiAgICBcclxuICAgIGFbIDBdICogYlsxMl0gKyBhWyA0XSAqIGJbMTNdICsgYVsgOF0gKiBiWzE0XSArIGFbMTJdICogYlsxNV0sXHJcbiAgICBhWyAxXSAqIGJbMTJdICsgYVsgNV0gKiBiWzEzXSArIGFbIDldICogYlsxNF0gKyBhWzEzXSAqIGJbMTVdLFxyXG4gICAgYVsgMl0gKiBiWzEyXSArIGFbIDZdICogYlsxM10gKyBhWzEwXSAqIGJbMTRdICsgYVsxNF0gKiBiWzE1XSxcclxuICAgIGFbIDNdICogYlsxMl0gKyBhWyA3XSAqIGJbMTNdICsgYVsxMV0gKiBiWzE0XSArIGFbMTVdICogYlsxNV1cclxuICBdO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIHRyYW5zcG9zZSBhIG1hdDRcclxuICogQHBhcmFtIHthcnJheX0gbSAtIG1hdDRcclxuICovXHJcbkNhdE1hdGgubWF0NFRyYW5zcG9zZSA9IG0gPT4gW1xyXG4gIG1bIDBdLG1bIDRdLG1bIDhdLG1bMTJdLFxyXG4gIG1bIDFdLG1bIDVdLG1bIDldLG1bMTNdLFxyXG4gIG1bIDJdLG1bIDZdLG1bMTBdLG1bMTRdLFxyXG4gIG1bIDNdLG1bIDddLG1bMTFdLG1bMTVdXHJcbl07XHJcblxyXG4vKipcclxuICogcmV0dXJucyBhbiBpbmRlbnRpdHkgbWF0NFxyXG4gKi9cclxuQ2F0TWF0aC5tYXQ0SWRlbnRpdHkgPSAoKSA9PiBbMSwwLDAsMCwwLDEsMCwwLDAsMCwxLDAsMCwwLDAsMV07XHJcblxyXG5DYXRNYXRoLm1hdDRUcmFuc2xhdGUgPSAoIHYgKSA9PiBbMSwwLDAsMCwwLDEsMCwwLDAsMCwxLDAsdlswXSx2WzFdLHZbMl0sMV07XHJcblxyXG5DYXRNYXRoLm1hdDRTY2FsZSA9ICggdiApID0+IFtcclxuICB2WzBdLDAsMCwwLFxyXG4gIDAsdlsxXSwwLDAsXHJcbiAgMCwwLHZbMl0sMCxcclxuICAwLDAsMCwxXHJcbl07XHJcblxyXG5DYXRNYXRoLm1hdDRTY2FsZVhZWiA9ICggcyApID0+IFtcclxuICBzLDAsMCwwLFxyXG4gIDAscywwLDAsXHJcbiAgMCwwLHMsMCxcclxuICAwLDAsMCwxXHJcbl07XHJcblxyXG5DYXRNYXRoLm1hdDRSb3RhdGVYID0gKCB0ICkgPT4gW1xyXG4gIDEsMCwwLDAsXHJcbiAgMCxNYXRoLmNvcyh0KSwtTWF0aC5zaW4odCksMCxcclxuICAwLE1hdGguc2luKHQpLE1hdGguY29zKHQpLDAsXHJcbiAgMCwwLDAsMVxyXG5dO1xyXG5cclxuQ2F0TWF0aC5tYXQ0Um90YXRlWSA9ICggdCApID0+IFtcclxuICBNYXRoLmNvcyh0KSwwLE1hdGguc2luKHQpLDAsXHJcbiAgMCwxLDAsMCxcclxuICAtTWF0aC5zaW4odCksMCxNYXRoLmNvcyh0KSwwLFxyXG4gIDAsMCwwLDFcclxuXTtcclxuXHJcbkNhdE1hdGgubWF0NFJvdGF0ZVogPSAoIHQgKSA9PiBbXHJcbiAgTWF0aC5jb3ModCksLU1hdGguc2luKHQpLDAsMCxcclxuICBNYXRoLnNpbih0KSxNYXRoLmNvcyh0KSwwLDAsXHJcbiAgMCwwLDEsMCxcclxuICAwLDAsMCwxXHJcbl07XHJcblxyXG5DYXRNYXRoLm1hdDRMb29rQXQgPSAoIHBvcywgdGFyLCBhaXIsIHJvdCApID0+IHtcclxuICBsZXQgZGlyID0gQ2F0TWF0aC52ZWNOb3JtYWxpemUoIENhdE1hdGgudmVjU3ViKCB0YXIsIHBvcyApICk7XHJcbiAgbGV0IHNpZCA9IENhdE1hdGgudmVjTm9ybWFsaXplKCBDYXRNYXRoLnZlYzNDcm9zcyggZGlyLCBhaXIgKSApO1xyXG4gIGxldCB0b3AgPSBDYXRNYXRoLnZlYzNDcm9zcyggc2lkLCBkaXIgKTtcclxuICBzaWQgPSBDYXRNYXRoLnZlY0FkZChcclxuICAgIENhdE1hdGgudmVjU2NhbGUoIE1hdGguY29zKCByb3QgKSwgc2lkICksXHJcbiAgICBDYXRNYXRoLnZlY1NjYWxlKCBNYXRoLnNpbiggcm90ICksIHRvcCApXHJcbiAgKTtcclxuICB0b3AgPSBDYXRNYXRoLnZlYzNDcm9zcyggc2lkLCBkaXIgKTtcclxuXHJcbiAgcmV0dXJuIFtcclxuICAgIHNpZFswXSwgdG9wWzBdLCBkaXJbMF0sIDAuMCxcclxuICAgIHNpZFsxXSwgdG9wWzFdLCBkaXJbMV0sIDAuMCxcclxuICAgIHNpZFsyXSwgdG9wWzJdLCBkaXJbMl0sIDAuMCxcclxuICAgIC0gc2lkWzBdICogcG9zWzBdIC0gc2lkWzFdICogcG9zWzFdIC0gc2lkWzJdICogcG9zWzJdLFxyXG4gICAgLSB0b3BbMF0gKiBwb3NbMF0gLSB0b3BbMV0gKiBwb3NbMV0gLSB0b3BbMl0gKiBwb3NbMl0sXHJcbiAgICAtIGRpclswXSAqIHBvc1swXSAtIGRpclsxXSAqIHBvc1sxXSAtIGRpclsyXSAqIHBvc1syXSxcclxuICAgIDEuMFxyXG4gIF07XHJcbn07XHJcblxyXG5DYXRNYXRoLm1hdDRQZXJzcGVjdGl2ZSA9ICggZm92LCBhc3BlY3QsIG5lYXIsIGZhciApID0+IHtcclxuICBsZXQgcCA9IDEuMCAvIE1hdGgudGFuKCBmb3YgKiBNYXRoLlBJIC8gMzYwLjAgKTtcclxuICBsZXQgZCA9IGZhciAvICggZmFyIC0gbmVhciApO1xyXG4gIHJldHVybiBbXHJcbiAgICBwIC8gYXNwZWN0LCAwLjAsIDAuMCwgMC4wLFxyXG4gICAgMC4wLCBwLCAwLjAsIDAuMCxcclxuICAgIDAuMCwgMC4wLCBkLCAxLjAsXHJcbiAgICAwLjAsIDAuMCwgLW5lYXIgKiBkLCAwLjBcclxuICBdO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ2F0TWF0aDsiLCJpbXBvcnQgUGF0aCBmcm9tICcuL2dsY2F0LXBhdGgnO1xuXG5jb25zdCBnbHNsaWZ5ID0gcmVxdWlyZSggJ2dsc2xpZnknICk7XG5cbmxldCByZXF1aXJlZEZpZWxkcyA9ICggb2JqZWN0LCBuYW5pdGhlZnVjaywgZmllbGRzICkgPT4ge1xuICBmaWVsZHMubWFwKCBmaWVsZCA9PiB7XG4gICAgaWYgKCB0eXBlb2Ygb2JqZWN0WyBmaWVsZCBdID09PSBcInVuZGVmaW5lZFwiICkge1xuICAgICAgdGhyb3cgXCJHTENhdC1QYXRoOiBcIiArIGZpZWxkICsgXCIgaXMgcmVxdWlyZWQgZm9yIFwiICsgbmFuaXRoZWZ1Y2s7XG4gICAgfVxuICB9ICk7XG59O1xuXG5sZXQgUGF0aEdVSSA9IGNsYXNzIGV4dGVuZHMgUGF0aCB7XG4gIGNvbnN0cnVjdG9yKCBnbENhdCwgcGFyYW1zICkge1xuICAgIHN1cGVyKCBnbENhdCwgcGFyYW1zICk7XG4gICAgbGV0IGl0ID0gdGhpcztcblxuICAgIHJlcXVpcmVkRmllbGRzKCBwYXJhbXMsIFwicGFyYW1zXCIsIFtcbiAgICAgIFwiY2FudmFzXCIsXG4gICAgICBcImVsXCJcbiAgICBdICk7XG5cbiAgICBpdC5ndWkgPSB7IHBhcmVudDogaXQucGFyYW1zLmVsIH07XG5cbiAgICBpdC5ndWkuaW5mbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoIFwic3BhblwiICk7XG4gICAgaXQuZ3VpLnBhcmVudC5hcHBlbmRDaGlsZCggaXQuZ3VpLmluZm8gKTtcbiAgICBcbiAgICBpdC5ndWkucmFuZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCBcImlucHV0XCIgKTtcbiAgICBpdC5ndWkucmFuZ2UudHlwZSA9IFwicmFuZ2VcIjtcbiAgICBpdC5ndWkucmFuZ2UubWluID0gMDtcbiAgICBpdC5ndWkucmFuZ2UubWF4ID0gMDtcbiAgICBpdC5ndWkucmFuZ2Uuc3RlcCA9IDE7XG4gICAgaXQuZ3VpLnBhcmVudC5hcHBlbmRDaGlsZCggaXQuZ3VpLnJhbmdlICk7XG5cbiAgICBpdC50aW1lTGlzdCA9IG5ldyBBcnJheSggMzAgKS5maWxsKCAwICk7XG4gICAgaXQudGltZUxpc3RJbmRleCA9IDA7XG4gICAgaXQudG90YWxGcmFtZXMgPSAwO1xuICAgIGl0LmZwcyA9IDA7XG4gICAgaXQuY3VycmVudEluZGV4ID0gMDtcbiAgICBpdC52aWV3TmFtZSA9IFwiXCI7XG4gICAgaXQudmlld0luZGV4ID0gMDtcblxuICAgIGxldCBnbCA9IGdsQ2F0LmdsO1xuICAgIGxldCB2Ym9RdWFkID0gZ2xDYXQuY3JlYXRlVmVydGV4YnVmZmVyKCBbIC0xLCAtMSwgMSwgLTEsIC0xLCAxLCAxLCAxIF0gKTtcbiAgICBpdC5hZGQoIHtcbiAgICAgIF9fUGF0aEd1aVJldHVybjoge1xuICAgICAgICB3aWR0aDogaXQucGFyYW1zLmNhbnZhcy53aWR0aCxcbiAgICAgICAgaGVpZ2h0OiBpdC5wYXJhbXMuY2FudmFzLmhlaWdodCxcbiAgICAgICAgdmVydDogXCJhdHRyaWJ1dGUgdmVjMiBwO3ZvaWQgbWFpbigpe2dsX1Bvc2l0aW9uPXZlYzQocCwwLDEpO31cIixcbiAgICAgICAgZnJhZzogXCJwcmVjaXNpb24gaGlnaHAgZmxvYXQ7dW5pZm9ybSB2ZWMyIHI7dW5pZm9ybSBzYW1wbGVyMkQgczt2b2lkIG1haW4oKXtnbF9GcmFnQ29sb3I9dGV4dHVyZTJEKHMsZ2xfRnJhZ0Nvb3JkLnh5L3IpO31cIixcbiAgICAgICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5PTkUgXSxcbiAgICAgICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMS4wIF0sXG4gICAgICAgIGZ1bmM6ICggX3AsIHBhcmFtcyApID0+IHtcbiAgICAgICAgICBnbC52aWV3cG9ydCggMCwgMCwgaXQucGFyYW1zLmNhbnZhcy53aWR0aCwgaXQucGFyYW1zLmNhbnZhcy5oZWlnaHQgKTtcbiAgICAgICAgICBnbENhdC51bmlmb3JtMmZ2KCAncicsIFsgaXQucGFyYW1zLmNhbnZhcy53aWR0aCwgaXQucGFyYW1zLmNhbnZhcy5oZWlnaHQgXSApO1xuICAgIFxuICAgICAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzJywgcGFyYW1zLmlucHV0LCAwICk7XG4gICAgICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICB9ICk7XG4gIH1cblxuICBiZWdpbigpIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgaXQuY3VycmVudEluZGV4ID0gMDtcbiAgfVxuXG4gIGVuZCgpIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgaXQuZ3VpLnJhbmdlLm1heCA9IE1hdGgubWF4KCBpdC5ndWkucmFuZ2UubWF4LCBpdC5jdXJyZW50SW5kZXggKTtcbiAgICBpdC5jdXJyZW50SW5kZXggPSAwO1xuXG4gICAgbGV0IG5vdyA9ICtuZXcgRGF0ZSgpICogMUUtMztcbiAgICBpdC50aW1lTGlzdFsgaXQudGltZUxpc3RJbmRleCBdID0gbm93O1xuICAgIGl0LnRpbWVMaXN0SW5kZXggPSAoIGl0LnRpbWVMaXN0SW5kZXggKyAxICkgJSBpdC50aW1lTGlzdC5sZW5ndGg7XG4gICAgaXQuZnBzID0gKFxuICAgICAgKCBpdC50aW1lTGlzdC5sZW5ndGggLSAxIClcbiAgICAgIC8gKCBub3cgLSBpdC50aW1lTGlzdFsgaXQudGltZUxpc3RJbmRleCBdIClcbiAgICApLnRvRml4ZWQoIDEgKTtcbiAgICBcbiAgICBpdC50b3RhbEZyYW1lcyArKztcblxuICAgIGl0Lmd1aS5pbmZvLmlubmVyVGV4dCA9IChcbiAgICAgIFwiUGF0aDogXCIgKyBpdC52aWV3TmFtZSArIFwiIChcIiArIGl0LnZpZXdJbmRleCArIFwiKVxcblwiXG4gICAgICArIGl0LmZwcyArIFwiIEZQU1xcblwiXG4gICAgICArIGl0LnRvdGFsRnJhbWVzICsgXCIgZnJhbWVzXFxuXCJcbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCBuYW1lLCBwYXJhbXMgKSB7XG4gICAgbGV0IGl0ID0gdGhpcztcbiAgICBcbiAgICBpdC5jdXJyZW50SW5kZXggKys7XG4gICAgbGV0IHZpZXcgPSBwYXJzZUludCggaXQuZ3VpLnJhbmdlLnZhbHVlICk7XG5cbiAgICBpZiAoIGl0LmN1cnJlbnRJbmRleCA8PSB2aWV3IHx8IHZpZXcgPT09IDAgKSB7XG4gICAgICBpdC52aWV3TmFtZSA9IHZpZXcgPT09IDAgPyBcIipGdWxsKlwiIDogbmFtZTtcbiAgICAgIGl0LnZpZXdJbmRleCA9IGl0LmN1cnJlbnRJbmRleDtcblxuICAgICAgc3VwZXIucmVuZGVyKCBuYW1lLCBwYXJhbXMgKTtcblxuICAgICAgaWYgKCBpdC5jdXJyZW50SW5kZXggPT09IHZpZXcgKSB7XG4gICAgICAgIGxldCB0ID0gKFxuICAgICAgICAgIHBhcmFtcyAmJiBwYXJhbXMudGFyZ2V0XG4gICAgICAgICAgPyBwYXJhbXMudGFyZ2V0XG4gICAgICAgICAgOiBpdC5wYXRoc1sgbmFtZSBdLmZyYW1lYnVmZmVyXG4gICAgICAgICk7XG4gICAgICAgIGlmICggdCApIHtcbiAgICAgICAgICBsZXQgaSA9IHQudGV4dHVyZXMgPyB0LnRleHR1cmVzWyAwIF0gOiB0LnRleHR1cmU7XG4gICAgICAgICAgaWYgKCBpdC5wYXJhbXMuc3RyZXRjaCApIHtcbiAgICAgICAgICAgIHN1cGVyLnJlbmRlciggXCJfX1BhdGhHdWlSZXR1cm5cIiwge1xuICAgICAgICAgICAgICB0YXJnZXQ6IGl0Lm51bGxGYixcbiAgICAgICAgICAgICAgaW5wdXQ6IGksXG4gICAgICAgICAgICAgIHdpZHRoOiBpdC5wYXJhbXMuY2FudmFzLndpZHRoLFxuICAgICAgICAgICAgICBoZWlnaHQ6IGl0LnBhcmFtcy5jYW52YXMuaGVpZ2h0XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0LnBhcmFtcy5jYW52YXMud2lkdGggPSAoIHBhcmFtcyA/IHBhcmFtcy53aWR0aCA6IDAgKSB8fCBpdC5wYXRoc1sgbmFtZSBdLndpZHRoIHx8IGl0LnBhcmFtcy53aWR0aDtcbiAgICAgICAgICAgIGl0LnBhcmFtcy5jYW52YXMuaGVpZ2h0ID0gKCBwYXJhbXMgPyBwYXJhbXMuaGVpZ2h0IDogMCApIHx8IGl0LnBhdGhzWyBuYW1lIF0uaGVpZ2h0IHx8IGl0LnBhcmFtcy5oZWlnaHQ7XG4gICAgICAgICAgICBzdXBlci5yZW5kZXIoIFwiX19QYXRoR3VpUmV0dXJuXCIsIHtcbiAgICAgICAgICAgICAgdGFyZ2V0OiBpdC5udWxsRmIsXG4gICAgICAgICAgICAgIGlucHV0OiBpXG4gICAgICAgICAgICB9ICk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBQYXRoR1VJOyIsImNvbnN0IGdsc2xpZnkgPSByZXF1aXJlKCAnZ2xzbGlmeScgKTtcblxubGV0IHJlcXVpcmVkRmllbGRzID0gKCBvYmplY3QsIG5hbml0aGVmdWNrLCBmaWVsZHMgKSA9PiB7XG4gIGZpZWxkcy5tYXAoIGZpZWxkID0+IHtcbiAgICBpZiAoIHR5cGVvZiBvYmplY3RbIGZpZWxkIF0gPT09IFwidW5kZWZpbmVkXCIgKSB7XG4gICAgICB0aHJvdyBcIkdMQ2F0LVBhdGg6IFwiICsgZmllbGQgKyBcIiBpcyByZXF1aXJlZCBmb3IgXCIgKyBuYW5pdGhlZnVjaztcbiAgICB9XG4gIH0gKTtcbn07XG5cbmxldCBQYXRoID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvciggZ2xDYXQsIHBhcmFtcyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgaXQuZ2xDYXQgPSBnbENhdDtcbiAgICBpdC5nbCA9IGdsQ2F0LmdsO1xuXG4gICAgaXQucGF0aHMgPSB7fTtcbiAgICBpdC5nbG9iYWxGdW5jID0gKCkgPT4ge307XG4gICAgaXQucGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICB9XG5cbiAgYWRkKCBwYXRocyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgZm9yICggbGV0IG5hbWUgaW4gcGF0aHMgKSB7XG4gICAgICBsZXQgcGF0aCA9IHBhdGhzWyBuYW1lIF07XG4gICAgICByZXF1aXJlZEZpZWxkcyggcGF0aCwgXCJwYXRoIG9iamVjdFwiLCBbXG4gICAgICAgIFwid2lkdGhcIixcbiAgICAgICAgXCJoZWlnaHRcIixcbiAgICAgICAgXCJ2ZXJ0XCIsXG4gICAgICAgIFwiZnJhZ1wiLFxuICAgICAgICBcImJsZW5kXCIsXG4gICAgICAgIFwiZnVuY1wiXG4gICAgICBdICk7XG4gICAgICBpdC5wYXRoc1sgbmFtZSBdID0gcGF0aDtcblxuICAgICAgaWYgKCB0eXBlb2YgcGF0aC5kZXB0aFRlc3QgPT09IFwidW5kZWZpbmVkXCIgKSB7IHBhdGguZGVwdGhUZXN0ID0gdHJ1ZTsgfVxuICAgICAgXG4gICAgICBpZiAoIHBhdGguZnJhbWVidWZmZXIgKSB7XG4gICAgICAgIGlmICggcGF0aC5kcmF3YnVmZmVycyApIHtcbiAgICAgICAgICBwYXRoLmZyYW1lYnVmZmVyID0gaXQuZ2xDYXQuY3JlYXRlRHJhd0J1ZmZlcnMoIHBhdGgud2lkdGgsIHBhdGguaGVpZ2h0LCBwYXRoLmRyYXdidWZmZXJzICk7XG4gICAgICAgIH0gZWxzZSBpZiAoIHBhdGguZmxvYXQgKSB7XG4gICAgICAgICAgcGF0aC5mcmFtZWJ1ZmZlciA9IGl0LmdsQ2F0LmNyZWF0ZUZsb2F0RnJhbWVidWZmZXIoIHBhdGgud2lkdGgsIHBhdGguaGVpZ2h0ICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGF0aC5mcmFtZWJ1ZmZlciA9IGl0LmdsQ2F0LmNyZWF0ZUZyYW1lYnVmZmVyKCBwYXRoLndpZHRoLCBwYXRoLmhlaWdodCApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBwYXRoLnByb2dyYW0gPSBpdC5nbENhdC5jcmVhdGVQcm9ncmFtKCBwYXRoLnZlcnQsIHBhdGguZnJhZyApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlciggbmFtZSwgcGFyYW1zICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG4gXG4gICAgbGV0IHBhdGggPSBpdC5wYXRoc1sgbmFtZSBdO1xuICAgIGlmICggIXBhdGggKSB7IHRocm93IFwiR0xDYXQtUGF0aDogVGhlIHBhdGggY2FsbGVkIFwiICsgbmFtZSArIFwiIGlzIG5vdCBkZWZpbmVkIVwiOyB9XG5cbiAgICBpZiAoICFwYXJhbXMgKSB7IHBhcmFtcyA9IHt9OyB9XG4gICAgcGFyYW1zLmZyYW1lYnVmZmVyID0gdHlwZW9mIHBhcmFtcy50YXJnZXQgIT09IFwidW5kZWZpbmVkXCIgPyBwYXJhbXMudGFyZ2V0LmZyYW1lYnVmZmVyIDogcGF0aC5mcmFtZWJ1ZmZlciA/IHBhdGguZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgOiBudWxsO1xuXG4gICAgbGV0IHdpZHRoID0gcGFyYW1zLndpZHRoIHx8IHBhdGgud2lkdGg7XG4gICAgbGV0IGhlaWdodCA9IHBhcmFtcy5oZWlnaHQgfHwgcGF0aC5oZWlnaHQ7XG4gICAgXG4gICAgaXQuZ2wudmlld3BvcnQoIDAsIDAsIHdpZHRoLCBoZWlnaHQgKTtcbiAgICBpdC5nbENhdC51c2VQcm9ncmFtKCBwYXRoLnByb2dyYW0gKTtcbiAgICBpdC5nbC5iaW5kRnJhbWVidWZmZXIoIGl0LmdsLkZSQU1FQlVGRkVSLCBwYXJhbXMuZnJhbWVidWZmZXIgKTtcbiAgICBpZiAoIGl0LnBhcmFtcy5kcmF3YnVmZmVycyApIHtcbiAgICAgIGl0LmdsQ2F0LmRyYXdCdWZmZXJzKCBwYXRoLmRyYXdidWZmZXJzID8gcGF0aC5kcmF3YnVmZmVycyA6IHBhcmFtcy5mcmFtZWJ1ZmZlciA9PT0gbnVsbCA/IFsgaXQuZ2wuQkFDSyBdIDogWyBpdC5nbC5DT0xPUl9BVFRBQ0hNRU5UMCBdICk7XG4gICAgfVxuICAgIGl0LmdsLmJsZW5kRnVuYyggLi4ucGF0aC5ibGVuZCApO1xuICAgIGlmICggcGF0aC5jbGVhciApIHsgaXQuZ2xDYXQuY2xlYXIoIC4uLnBhdGguY2xlYXIgKTsgfVxuICAgIHBhdGguZGVwdGhUZXN0ID8gaXQuZ2wuZW5hYmxlKCBpdC5nbC5ERVBUSF9URVNUICkgOiBpdC5nbC5kaXNhYmxlKCBpdC5nbC5ERVBUSF9URVNUICk7XG4gXG4gICAgaXQuZ2xDYXQudW5pZm9ybTJmdiggJ3Jlc29sdXRpb24nLCBbIHdpZHRoLCBoZWlnaHQgXSApO1xuICAgIGl0Lmdsb2JhbEZ1bmMoIHBhdGgsIHBhcmFtcyApO1xuICAgIHBhdGguZnVuYyggcGF0aCwgcGFyYW1zICk7XG4gIH1cblxuICByZXNpemUoIG5hbWUsIHdpZHRoLCBoZWlnaHQgKSB7XG4gICAgbGV0IGl0ID0gdGhpcztcblxuICAgIGxldCBwYXRoID0gaXQucGF0aHNbIG5hbWUgXTtcblxuICAgIHBhdGgud2lkdGggPSB3aWR0aDtcbiAgICBwYXRoLmhlaWdodCA9IGhlaWdodDtcblxuICAgIGlmICggcGF0aC5mcmFtZWJ1ZmZlciApIHtcbiAgICAgIGlmICggaXQucGFyYW1zLmRyYXdidWZmZXJzICYmIHBhdGguZHJhd2J1ZmZlcnMgKSB7XG4gICAgICAgIHBhdGguZnJhbWVidWZmZXIgPSBpdC5nbENhdC5jcmVhdGVEcmF3QnVmZmVycyggcGF0aC53aWR0aCwgcGF0aC5oZWlnaHQsIHBhdGguZHJhd2J1ZmZlcnMgKTtcbiAgICAgIH0gZWxzZSBpZiAoIHBhdGguZmxvYXQgKSB7XG4gICAgICAgIGl0LmdsQ2F0LnJlc2l6ZUZsb2F0RnJhbWVidWZmZXIoIHBhdGguZnJhbWVidWZmZXIsIHBhdGgud2lkdGgsIHBhdGguaGVpZ2h0ICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpdC5nbENhdC5yZXNpemVGcmFtZWJ1ZmZlciggcGF0aC5mcmFtZWJ1ZmZlciwgcGF0aC53aWR0aCwgcGF0aC5oZWlnaHQgKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZiBwYXRoLm9ucmVzaXplID09PSBcImZ1bmN0aW9uXCIgKSB7XG4gICAgICBwYXRoLm9ucmVzaXplKCBwYXRoLCB3aWR0aCwgaGVpZ2h0ICk7XG4gICAgfVxuICB9XG5cbiAgc2V0R2xvYmFsRnVuYyggZnVuYyApIHsgdGhpcy5nbG9iYWxGdW5jID0gZnVuYzsgfVxuXG4gIGZiKCBuYW1lICkge1xuICAgIGlmICggIXRoaXMucGF0aHNbIG5hbWUgXSApIHsgdGhyb3cgXCJnbGNhdC1wYXRoLmZiOiBwYXRoIGNhbGxlZCBcIiArIG5hbWUgKyBcIiBpcyBub3QgZGVmaW5lZFwiOyB9XG4gICAgaWYgKCAhdGhpcy5wYXRoc1sgbmFtZSBdLmZyYW1lYnVmZmVyICkgeyB0aHJvdyBcImdsY2F0LXBhdGguZmI6IHRoZXJlIGlzIG5vIGZyYW1lYnVmZmVyIGZvciB0aGUgcGF0aCBcIiArIG5hbWU7IH1cblxuICAgIHJldHVybiB0aGlzLnBhdGhzWyBuYW1lIF0uZnJhbWVidWZmZXI7XG4gIH1cbn07XG5cblBhdGgubnVsbEZiID0geyBmcmFtZWJ1ZmZlcjogbnVsbCB9O1xuXG5leHBvcnQgZGVmYXVsdCBQYXRoOyIsImxldCBHTENhdCA9IGNsYXNzIHtcblx0Y29uc3RydWN0b3IoIF9nbCApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXG5cdFx0aXQuZ2wgPSBfZ2w7XG4gICAgbGV0IGdsID0gaXQuZ2w7XG5cblx0ICBnbC5lbmFibGUoIGdsLkRFUFRIX1RFU1QgKTtcblx0ICBnbC5kZXB0aEZ1bmMoIGdsLkxFUVVBTCApO1xuXHQgIGdsLmVuYWJsZSggZ2wuQkxFTkQgKTtcblx0ICBnbC5ibGVuZEZ1bmMoIGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSApO1xuXG5cdFx0aXQuZXh0ZW5zaW9ucyA9IHt9O1xuXG5cdFx0aXQuY3VycmVudFByb2dyYW0gPSBudWxsO1xuXHR9XG5cblx0Z2V0RXh0ZW5zaW9uKCBfbmFtZSwgX3Rocm93ICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG4gICAgbGV0IGdsID0gaXQuZ2w7XG5cblx0XHRpZiAoIHR5cGVvZiBfbmFtZSA9PT0gXCJvYmplY3RcIiAmJiBfbmFtZS5pc0FycmF5KCkgKSB7XG5cdFx0XHRyZXR1cm4gX25hbWUuZXZlcnkoIG5hbWUgPT4gaXQuZ2V0RXh0ZW5zaW9uKCBuYW1lLCBfdGhyb3cgKSApO1xuXHRcdH0gZWxzZSBpZiAoIHR5cGVvZiBfbmFtZSA9PT0gXCJzdHJpbmdcIiApIHtcblx0XHRcdGlmICggaXQuZXh0ZW5zaW9uc1sgX25hbWUgXSApIHtcblx0XHRcdFx0cmV0dXJuIGl0LmV4dGVuc2lvbnNbIF9uYW1lIF07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpdC5leHRlbnNpb25zWyBfbmFtZSBdID0gZ2wuZ2V0RXh0ZW5zaW9uKCBfbmFtZSApO1xuXHRcdFx0XHRpZiAoIGl0LmV4dGVuc2lvbnNbIF9uYW1lIF0gKSB7XG5cdFx0XHRcdFx0cmV0dXJuIGl0LmV4dGVuc2lvbnNbIF9uYW1lIF07XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKCBfdGhyb3cgKSB7XG5cdFx0XHRcdFx0XHR0aHJvdyBjb25zb2xlLmVycm9yKCBcIlRoZSBleHRlbnNpb24gXFxcIlwiICsgX25hbWUgKyBcIlxcXCIgaXMgbm90IHN1cHBvcnRlZFwiICk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuICEhKCBpdC5leHRlbnNpb25zWyBfbmFtZSBdICk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93IFwiR0xDYXQuZ2V0RXh0ZW5zaW9uOiBfbmFtZSBtdXN0IGJlIHN0cmluZyBvciBhcnJheVwiXG5cdFx0fVxuXHR9XG5cblx0Y3JlYXRlUHJvZ3JhbSggX3ZlcnQsIF9mcmFnLCBfb25FcnJvciApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGVycm9yO1xuXHRcdGlmICggdHlwZW9mIF9vbkVycm9yID09PSAnZnVuY3Rpb24nICkge1xuXHRcdFx0ZXJyb3IgPSBfb25FcnJvcjtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZXJyb3IgPSAoIF9zdHIgKSA9PiB7IGNvbnNvbGUuZXJyb3IoIF9zdHIgKTsgfVxuXHRcdH1cblxuXHRcdGxldCB2ZXJ0ID0gZ2wuY3JlYXRlU2hhZGVyKCBnbC5WRVJURVhfU0hBREVSICk7XG5cdFx0Z2wuc2hhZGVyU291cmNlKCB2ZXJ0LCBfdmVydCApO1xuXHRcdGdsLmNvbXBpbGVTaGFkZXIoIHZlcnQgKTtcblx0XHRpZiAoICFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoIHZlcnQsIGdsLkNPTVBJTEVfU1RBVFVTICkgKSB7XG5cdFx0XHRlcnJvciggZ2wuZ2V0U2hhZGVySW5mb0xvZyggdmVydCApICk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRsZXQgZnJhZyA9IGdsLmNyZWF0ZVNoYWRlciggZ2wuRlJBR01FTlRfU0hBREVSICk7XG5cdFx0Z2wuc2hhZGVyU291cmNlKCBmcmFnLCBfZnJhZyApO1xuXHRcdGdsLmNvbXBpbGVTaGFkZXIoIGZyYWcgKTtcblx0XHRpZiAoICFnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoIGZyYWcsIGdsLkNPTVBJTEVfU1RBVFVTICkgKSB7XG5cdFx0XHRlcnJvciggZ2wuZ2V0U2hhZGVySW5mb0xvZyggZnJhZyApICk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRsZXQgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcblx0XHRnbC5hdHRhY2hTaGFkZXIoIHByb2dyYW0sIHZlcnQgKTtcblx0XHRnbC5hdHRhY2hTaGFkZXIoIHByb2dyYW0sIGZyYWcgKTtcblx0XHRnbC5saW5rUHJvZ3JhbSggcHJvZ3JhbSApO1xuXHRcdGlmICggZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlciggcHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMgKSApIHtcblx0ICAgIHByb2dyYW0ubG9jYXRpb25zID0ge307XG5cdFx0XHRyZXR1cm4gcHJvZ3JhbTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZXJyb3IoIGdsLmdldFByb2dyYW1JbmZvTG9nKCBwcm9ncmFtICkgKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxuXG5cdHVzZVByb2dyYW0oIF9wcm9ncmFtICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRnbC51c2VQcm9ncmFtKCBfcHJvZ3JhbSApO1xuXHRcdGl0LmN1cnJlbnRQcm9ncmFtID0gX3Byb2dyYW07XG5cdH1cblxuXHRjcmVhdGVWZXJ0ZXhidWZmZXIoIF9hcnJheSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdCAgbGV0IGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXG5cdFx0aWYgKCBfYXJyYXkgKSB7IGl0LnNldFZlcnRleGJ1ZmZlciggYnVmZmVyLCBfYXJyYXkgKTsgfVxuXG5cdCAgcmV0dXJuIGJ1ZmZlcjtcblx0fVxuXG5cdHNldFZlcnRleGJ1ZmZlciggX2J1ZmZlciwgX2FycmF5ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0ICBnbC5iaW5kQnVmZmVyKCBnbC5BUlJBWV9CVUZGRVIsIF9idWZmZXIgKTtcblx0ICBnbC5idWZmZXJEYXRhKCBnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoIF9hcnJheSApLCBnbC5TVEFUSUNfRFJBVyApO1xuXHQgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgbnVsbCApO1xuXG5cdCAgX2J1ZmZlci5sZW5ndGggPSBfYXJyYXkubGVuZ3RoO1xuXHR9XG5cblx0Y3JlYXRlSW5kZXhidWZmZXIoIF9hcnJheSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdCAgbGV0IGJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuXG5cdCAgZ2wuYmluZEJ1ZmZlciggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIGJ1ZmZlciApO1xuXHQgIGdsLmJ1ZmZlckRhdGEoIGdsLkVMRU1FTlRfQVJSQVlfQlVGRkVSLCBuZXcgSW50MTZBcnJheSggX2FycmF5ICksIGdsLlNUQVRJQ19EUkFXICk7XG5cdCAgZ2wuYmluZEJ1ZmZlciggZ2wuRUxFTUVOVF9BUlJBWV9CVUZGRVIsIG51bGwgKTtcblxuXHQgIGJ1ZmZlci5sZW5ndGggPSBfYXJyYXkubGVuZ3RoO1xuXHQgIHJldHVybiBidWZmZXI7XG5cdH1cblxuXHRnZXRBdHRyaWJMb2NhdGlvbiggX25hbWUgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbjtcblx0ICBpZiAoIGl0LmN1cnJlbnRQcm9ncmFtLmxvY2F0aW9uc1sgX25hbWUgXSApIHtcblx0ICAgIGxvY2F0aW9uID0gaXQuY3VycmVudFByb2dyYW0ubG9jYXRpb25zWyBfbmFtZSBdO1xuXHQgIH0gZWxzZSB7XG5cdCAgICBsb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKCBpdC5jdXJyZW50UHJvZ3JhbSwgX25hbWUgKTtcblx0ICAgIGl0LmN1cnJlbnRQcm9ncmFtLmxvY2F0aW9uc1sgX25hbWUgXSA9IGxvY2F0aW9uO1xuXHQgIH1cblxuXHRcdHJldHVybiBsb2NhdGlvbjtcblx0fVxuXG5cdGF0dHJpYnV0ZSggX25hbWUsIF9idWZmZXIsIF9zdHJpZGUsIF9kaXYgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGlmICggX2RpdiApIHtcblx0XHRcdGl0LmdldEV4dGVuc2lvbiggXCJBTkdMRV9pbnN0YW5jZWRfYXJyYXlzXCIsIHRydWUgKTtcblx0XHR9XG5cblx0ICBsZXQgbG9jYXRpb24gPSBpdC5nZXRBdHRyaWJMb2NhdGlvbiggX25hbWUgKTtcblxuXHQgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgX2J1ZmZlciApO1xuXHQgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KCBsb2NhdGlvbiApO1xuXHQgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoIGxvY2F0aW9uLCBfc3RyaWRlLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDAgKTtcblxuXHRcdGxldCBleHQgPSBpdC5nZXRFeHRlbnNpb24oIFwiQU5HTEVfaW5zdGFuY2VkX2FycmF5c1wiICk7XG5cdFx0aWYgKCBleHQgKSB7XG5cdFx0XHRsZXQgZGl2ID0gX2RpdiB8fCAwO1xuXHRcdFx0ZXh0LnZlcnRleEF0dHJpYkRpdmlzb3JBTkdMRSggbG9jYXRpb24sIGRpdiApO1xuXHRcdH1cblxuXHQgIGdsLmJpbmRCdWZmZXIoIGdsLkFSUkFZX0JVRkZFUiwgbnVsbCApO1xuXHR9XG5cblx0Z2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdCAgbGV0IGxvY2F0aW9uO1xuXG5cdCAgaWYgKCBpdC5jdXJyZW50UHJvZ3JhbS5sb2NhdGlvbnNbIF9uYW1lIF0gKSB7XG5cdFx0XHRsb2NhdGlvbiA9IGl0LmN1cnJlbnRQcm9ncmFtLmxvY2F0aW9uc1sgX25hbWUgXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0bG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oIGl0LmN1cnJlbnRQcm9ncmFtLCBfbmFtZSApO1xuXHRcdFx0aXQuY3VycmVudFByb2dyYW0ubG9jYXRpb25zWyBfbmFtZSBdID0gbG9jYXRpb247XG5cdFx0fVxuXG5cdCAgcmV0dXJuIGxvY2F0aW9uO1xuXHR9XG5cblx0dW5pZm9ybTFpKCBfbmFtZSwgX3ZhbHVlICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgbG9jYXRpb24gPSBpdC5nZXRVbmlmb3JtTG9jYXRpb24oIF9uYW1lICk7XG5cdFx0Z2wudW5pZm9ybTFpKCBsb2NhdGlvbiwgX3ZhbHVlICk7XG5cdH1cblxuXHR1bmlmb3JtMWYoIF9uYW1lLCBfdmFsdWUgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbiA9IGl0LmdldFVuaWZvcm1Mb2NhdGlvbiggX25hbWUgKTtcblx0XHRnbC51bmlmb3JtMWYoIGxvY2F0aW9uLCBfdmFsdWUgKTtcblx0fVxuXG5cdHVuaWZvcm0yZnYoIF9uYW1lLCBfdmFsdWUgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbiA9IGl0LmdldFVuaWZvcm1Mb2NhdGlvbiggX25hbWUgKTtcblx0XHRnbC51bmlmb3JtMmZ2KCBsb2NhdGlvbiwgX3ZhbHVlICk7XG5cdH1cblxuXHR1bmlmb3JtM2Z2KCBfbmFtZSwgX3ZhbHVlICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgbG9jYXRpb24gPSBpdC5nZXRVbmlmb3JtTG9jYXRpb24oIF9uYW1lICk7XG5cdFx0Z2wudW5pZm9ybTNmdiggbG9jYXRpb24sIF92YWx1ZSApO1xuXHR9XG5cblx0dW5pZm9ybTRmdiggX25hbWUsIF92YWx1ZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gaXQuZ2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApO1xuXHRcdGdsLnVuaWZvcm00ZnYoIGxvY2F0aW9uLCBfdmFsdWUgKTtcblx0fVxuXG5cdHVuaWZvcm1NYXRyaXg0ZnYoIF9uYW1lLCBfdmFsdWUsIF90cmFuc3Bvc2UgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCBsb2NhdGlvbiA9IGl0LmdldFVuaWZvcm1Mb2NhdGlvbiggX25hbWUgKTtcblx0XHRnbC51bmlmb3JtTWF0cml4NGZ2KCBsb2NhdGlvbiwgX3RyYW5zcG9zZSB8fCBmYWxzZSwgX3ZhbHVlICk7XG5cdH1cblxuXHR1bmlmb3JtQ3ViZW1hcCggX25hbWUsIF90ZXh0dXJlLCBfbnVtYmVyICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRsZXQgbG9jYXRpb24gPSBpdC5nZXRVbmlmb3JtTG9jYXRpb24oIF9uYW1lICk7XG5cdCAgZ2wuYWN0aXZlVGV4dHVyZSggZ2wuVEVYVFVSRTAgKyBfbnVtYmVyICk7XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIF90ZXh0dXJlICk7XG5cdCAgZ2wudW5pZm9ybTFpKCBsb2NhdGlvbiwgX251bWJlciApO1xuXHR9XG5cblx0dW5pZm9ybVRleHR1cmUoIF9uYW1lLCBfdGV4dHVyZSwgX251bWJlciApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IGxvY2F0aW9uID0gaXQuZ2V0VW5pZm9ybUxvY2F0aW9uKCBfbmFtZSApO1xuXHQgIGdsLmFjdGl2ZVRleHR1cmUoIGdsLlRFWFRVUkUwICsgX251bWJlciApO1xuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfdGV4dHVyZSApO1xuXHQgIGdsLnVuaWZvcm0xaSggbG9jYXRpb24sIF9udW1iZXIgKTtcblx0fVxuXG5cdGNyZWF0ZVRleHR1cmUoKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGxldCB0ZXh0dXJlID0gZ2wuY3JlYXRlVGV4dHVyZSgpO1xuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCB0ZXh0dXJlICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBnbC5MSU5FQVIgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFXzJELCBnbC5URVhUVVJFX01JTl9GSUxURVIsIGdsLkxJTkVBUiApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UgKTtcblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXG5cdFx0cmV0dXJuIHRleHR1cmU7XG5cdH1cblxuXHR0ZXh0dXJlRmlsdGVyKCBfdGV4dHVyZSwgX2ZpbHRlciApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF90ZXh0dXJlICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NQUdfRklMVEVSLCBfZmlsdGVyICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV8yRCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBfZmlsdGVyICk7XG5cdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblx0fVxuXG5cdHRleHR1cmVXcmFwKCBfdGV4dHVyZSwgX3dyYXAgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfdGV4dHVyZSApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9TLCBfd3JhcCApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfMkQsIGdsLlRFWFRVUkVfV1JBUF9ULCBfd3JhcCApO1xuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cdH1cblxuXHRzZXRUZXh0dXJlKCBfdGV4dHVyZSwgX2ltYWdlICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX3RleHR1cmUgKTtcblx0XHRnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBfaW1hZ2UgKTtcblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXHR9XG5cblx0c2V0VGV4dHVyZUZyb21BcnJheSggX3RleHR1cmUsIF93aWR0aCwgX2hlaWdodCwgX2FycmF5ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgX3RleHR1cmUgKTtcblx0XHRnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBfd2lkdGgsIF9oZWlnaHQsIDAsIGdsLlJHQkEsIGdsLlVOU0lHTkVEX0JZVEUsIG5ldyBVaW50OEFycmF5KCBfYXJyYXkgKSApO1xuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cdH1cblxuXHRzZXRUZXh0dXJlRnJvbUZsb2F0QXJyYXkoIF90ZXh0dXJlLCBfd2lkdGgsIF9oZWlnaHQsIF9hcnJheSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0aXQuZ2V0RXh0ZW5zaW9uKCBcIk9FU190ZXh0dXJlX2Zsb2F0XCIsIHRydWUgKTtcblxuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfdGV4dHVyZSApO1xuXHRcdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIF93aWR0aCwgX2hlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuRkxPQVQsIG5ldyBGbG9hdDMyQXJyYXkoIF9hcnJheSApICk7XG5cdFx0aWYgKCAhaXQuZ2V0RXh0ZW5zaW9uKCBcIk9FU190ZXh0dXJlX2Zsb2F0X2xpbmVhclwiICkgKSB7IGl0LnRleHR1cmVGaWx0ZXIoIF90ZXh0dXJlLCBnbC5ORUFSRVNUICk7IH1cblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXHR9XG5cblx0Y29weVRleHR1cmUoIF90ZXh0dXJlLCBfd2lkdGgsIF9oZWlnaHQgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfdGV4dHVyZSApO1xuXHRcdGdsLmNvcHlUZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCAwLCAwLCBfd2lkdGgsIF9oZWlnaHQsIDAgKTtcblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXHR9XG5cblx0Y3JlYXRlQ3ViZW1hcCggX2FycmF5T2ZJbWFnZSApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0Ly8gb3JkZXIgOiBYKywgWC0sIFkrLCBZLSwgWissIFotXG5cdFx0bGV0IHRleHR1cmUgPSBnbC5jcmVhdGVUZXh0dXJlKCk7XG5cblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgdGV4dHVyZSApO1xuXHRcdGZvciAoIGxldCBpID0gMDsgaSA8IDY7IGkgKysgKSB7XG5cdFx0XHRnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFX0NVQkVfTUFQX1BPU0lUSVZFX1ggKyBpLCAwLCBnbC5SR0JBLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBfYXJyYXlPZkltYWdlWyBpIF0gKTtcblx0XHR9XG5cdFx0Z2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9NSU5fRklMVEVSLCBnbC5MSU5FQVIgKTtcblx0ICBnbC50ZXhQYXJhbWV0ZXJpKCBnbC5URVhUVVJFX0NVQkVfTUFQLCBnbC5URVhUVVJFX01BR19GSUxURVIsIGdsLkxJTkVBUiApO1xuXHQgIGdsLnRleFBhcmFtZXRlcmkoIGdsLlRFWFRVUkVfQ1VCRV9NQVAsIGdsLlRFWFRVUkVfV1JBUF9TLCBnbC5DTEFNUF9UT19FREdFICk7XG5cdCAgZ2wudGV4UGFyYW1ldGVyaSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgZ2wuVEVYVFVSRV9XUkFQX1QsIGdsLkNMQU1QX1RPX0VER0UgKTtcblx0XHRnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV9DVUJFX01BUCwgbnVsbCApO1xuXG5cdFx0cmV0dXJuIHRleHR1cmU7XG5cdH1cblxuXHRjcmVhdGVGcmFtZWJ1ZmZlciggX3dpZHRoLCBfaGVpZ2h0ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0ICBsZXQgZnJhbWVidWZmZXIgPSB7fTtcblx0XHRmcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG5cdCAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgKTtcblxuXHRcdGZyYW1lYnVmZmVyLmRlcHRoID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKCk7XG5cdFx0Z2wuYmluZFJlbmRlcmJ1ZmZlciggZ2wuUkVOREVSQlVGRkVSLCBmcmFtZWJ1ZmZlci5kZXB0aCApO1xuXHRcdGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoIGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfQ09NUE9ORU5UMTYsIF93aWR0aCwgX2hlaWdodCApO1xuXHQgIGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCBmcmFtZWJ1ZmZlci5kZXB0aCApO1xuXG5cdFx0ZnJhbWVidWZmZXIudGV4dHVyZSA9IGl0LmNyZWF0ZVRleHR1cmUoKTtcblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgZnJhbWVidWZmZXIudGV4dHVyZSApO1xuXHQgIGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIF93aWR0aCwgX2hlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuVU5TSUdORURfQllURSwgbnVsbCApO1xuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBudWxsICk7XG5cblx0ICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRCggZ2wuRlJBTUVCVUZGRVIsIGdsLkNPTE9SX0FUVEFDSE1FTlQwLCBnbC5URVhUVVJFXzJELCBmcmFtZWJ1ZmZlci50ZXh0dXJlLCAwICk7XG5cdCAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgbnVsbCApO1xuXG5cdCAgcmV0dXJuIGZyYW1lYnVmZmVyO1xuXHR9XG5cblx0cmVzaXplRnJhbWVidWZmZXIoIF9mcmFtZWJ1ZmZlciwgX3dpZHRoLCBfaGVpZ2h0ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBfZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgKTtcblxuXHRcdGdsLmJpbmRSZW5kZXJidWZmZXIoIGdsLlJFTkRFUkJVRkZFUiwgX2ZyYW1lYnVmZmVyLmRlcHRoICk7XG5cdFx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZSggZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgX3dpZHRoLCBfaGVpZ2h0ICk7XG5cdFx0Z2wuYmluZFJlbmRlcmJ1ZmZlciggZ2wuUkVOREVSQlVGRkVSLCBudWxsICk7XG5cdFx0XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIF9mcmFtZWJ1ZmZlci50ZXh0dXJlICk7XG5cdFx0Z2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgX3dpZHRoLCBfaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5VTlNJR05FRF9CWVRFLCBudWxsICk7XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblx0XHRcblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBudWxsICk7XG5cdH1cblxuXHRjcmVhdGVGbG9hdEZyYW1lYnVmZmVyKCBfd2lkdGgsIF9oZWlnaHQgKSB7XG5cdFx0bGV0IGl0ID0gdGhpcztcblx0XHRsZXQgZ2wgPSBpdC5nbDtcblxuXHRcdGl0LmdldEV4dGVuc2lvbiggXCJPRVNfdGV4dHVyZV9mbG9hdFwiLCB0cnVlICk7XG5cblx0ICBsZXQgZnJhbWVidWZmZXIgPSB7fTtcblx0XHRmcmFtZWJ1ZmZlci5mcmFtZWJ1ZmZlciA9IGdsLmNyZWF0ZUZyYW1lYnVmZmVyKCk7XG5cdCAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgKTtcblxuXHRcdGZyYW1lYnVmZmVyLmRlcHRoID0gZ2wuY3JlYXRlUmVuZGVyYnVmZmVyKCk7XG5cdFx0Z2wuYmluZFJlbmRlcmJ1ZmZlciggZ2wuUkVOREVSQlVGRkVSLCBmcmFtZWJ1ZmZlci5kZXB0aCApO1xuXHRcdGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoIGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfQ09NUE9ORU5UMTYsIF93aWR0aCwgX2hlaWdodCApO1xuXHQgIGdsLmZyYW1lYnVmZmVyUmVuZGVyYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgZ2wuREVQVEhfQVRUQUNITUVOVCwgZ2wuUkVOREVSQlVGRkVSLCBmcmFtZWJ1ZmZlci5kZXB0aCApO1xuXG5cdFx0ZnJhbWVidWZmZXIudGV4dHVyZSA9IGl0LmNyZWF0ZVRleHR1cmUoKTtcblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgZnJhbWVidWZmZXIudGV4dHVyZSApO1xuXHQgIGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIF93aWR0aCwgX2hlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuRkxPQVQsIG51bGwgKTtcblx0XHRpZiAoICFpdC5nZXRFeHRlbnNpb24oIFwiT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyXCIgKSApIHsgaXQudGV4dHVyZUZpbHRlciggZnJhbWVidWZmZXIudGV4dHVyZSwgZ2wuTkVBUkVTVCApOyB9XG5cdCAgZ2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblxuXHQgIGdsLmZyYW1lYnVmZmVyVGV4dHVyZTJEKCBnbC5GUkFNRUJVRkZFUiwgZ2wuQ09MT1JfQVRUQUNITUVOVDAsIGdsLlRFWFRVUkVfMkQsIGZyYW1lYnVmZmVyLnRleHR1cmUsIDAgKTtcblx0ICBnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBudWxsICk7XG5cblx0ICByZXR1cm4gZnJhbWVidWZmZXI7XG5cdH1cblxuXHRyZXNpemVGbG9hdEZyYW1lYnVmZmVyKCBfZnJhbWVidWZmZXIsIF93aWR0aCwgX2hlaWdodCApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgX2ZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyICk7XG5cblx0XHRnbC5iaW5kUmVuZGVyYnVmZmVyKCBnbC5SRU5ERVJCVUZGRVIsIF9mcmFtZWJ1ZmZlci5kZXB0aCApO1xuXHRcdGdsLnJlbmRlcmJ1ZmZlclN0b3JhZ2UoIGdsLlJFTkRFUkJVRkZFUiwgZ2wuREVQVEhfQ09NUE9ORU5UMTYsIF93aWR0aCwgX2hlaWdodCApO1xuXHRcdGdsLmJpbmRSZW5kZXJidWZmZXIoIGdsLlJFTkRFUkJVRkZFUiwgbnVsbCApO1xuXHRcdFxuXHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfZnJhbWVidWZmZXIudGV4dHVyZSApO1xuXHRcdGdsLnRleEltYWdlMkQoIGdsLlRFWFRVUkVfMkQsIDAsIGdsLlJHQkEsIF93aWR0aCwgX2hlaWdodCwgMCwgZ2wuUkdCQSwgZ2wuRkxPQVQsIG51bGwgKTtcblx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXHRcdFxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIG51bGwgKTtcblx0fVxuXG5cdGNyZWF0ZURyYXdCdWZmZXJzKCBfd2lkdGgsIF9oZWlnaHQsIF9udW1EcmF3QnVmZmVycyApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0aXQuZ2V0RXh0ZW5zaW9uKCAnT0VTX3RleHR1cmVfZmxvYXQnLCB0cnVlICk7XG5cdFx0bGV0IGV4dCA9IGl0LmdldEV4dGVuc2lvbiggJ1dFQkdMX2RyYXdfYnVmZmVycycsIHRydWUgKTtcblxuXHRcdGlmICggZXh0Lk1BWF9EUkFXX0JVRkZFUlNfV0VCR0wgPCBfbnVtRHJhd0J1ZmZlcnMgKSB7XG5cdFx0XHR0aHJvdyBcImNyZWF0ZURyYXdCdWZmZXJzOiBNQVhfRFJBV19CVUZGRVJTX1dFQkdMIGlzIFwiICsgZXh0Lk1BWF9EUkFXX0JVRkZFUlNfV0VCR0w7XG5cdFx0fVxuXG5cdFx0bGV0IGZyYW1lYnVmZmVyID0ge307XG5cdFx0ZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgPSBnbC5jcmVhdGVGcmFtZWJ1ZmZlcigpO1xuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIGZyYW1lYnVmZmVyLmZyYW1lYnVmZmVyICk7XG5cblx0XHRmcmFtZWJ1ZmZlci5kZXB0aCA9IGdsLmNyZWF0ZVJlbmRlcmJ1ZmZlcigpO1xuXHRcdGdsLmJpbmRSZW5kZXJidWZmZXIoIGdsLlJFTkRFUkJVRkZFUiwgZnJhbWVidWZmZXIuZGVwdGggKTtcblx0XHRnbC5yZW5kZXJidWZmZXJTdG9yYWdlKCBnbC5SRU5ERVJCVUZGRVIsIGdsLkRFUFRIX0NPTVBPTkVOVDE2LCBfd2lkdGgsIF9oZWlnaHQgKTtcblx0XHRnbC5mcmFtZWJ1ZmZlclJlbmRlcmJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIGdsLkRFUFRIX0FUVEFDSE1FTlQsIGdsLlJFTkRFUkJVRkZFUiwgZnJhbWVidWZmZXIuZGVwdGggKTtcblxuXHRcdGZyYW1lYnVmZmVyLnRleHR1cmVzID0gW107XG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgX251bURyYXdCdWZmZXJzOyBpICsrICkge1xuXHRcdFx0ZnJhbWVidWZmZXIudGV4dHVyZXNbIGkgXSA9IGl0LmNyZWF0ZVRleHR1cmUoKTtcblx0XHQgIGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBmcmFtZWJ1ZmZlci50ZXh0dXJlc1sgaSBdICk7XG5cdFx0XHRnbC50ZXhJbWFnZTJEKCBnbC5URVhUVVJFXzJELCAwLCBnbC5SR0JBLCBfd2lkdGgsIF9oZWlnaHQsIDAsIGdsLlJHQkEsIGdsLkZMT0FULCBudWxsICk7XG5cdFx0XHRpZiAoICFpdC5nZXRFeHRlbnNpb24oIFwiT0VTX3RleHR1cmVfZmxvYXRfbGluZWFyXCIgKSApIHsgaXQudGV4dHVyZUZpbHRlciggZnJhbWVidWZmZXIudGV4dHVyZXNbIGkgXSwgZ2wuTkVBUkVTVCApOyB9XG5cdFx0ICBnbC5iaW5kVGV4dHVyZSggZ2wuVEVYVFVSRV8yRCwgbnVsbCApO1xuXG5cdFx0ICBnbC5mcmFtZWJ1ZmZlclRleHR1cmUyRCggZ2wuRlJBTUVCVUZGRVIsIGV4dC5DT0xPUl9BVFRBQ0hNRU5UMF9XRUJHTCArIGksIGdsLlRFWFRVUkVfMkQsIGZyYW1lYnVmZmVyLnRleHR1cmVzWyBpIF0sIDAgKTtcblx0XHR9XG5cblx0XHRsZXQgc3RhdHVzID0gZ2wuY2hlY2tGcmFtZWJ1ZmZlclN0YXR1cyggZ2wuRlJBTUVCVUZGRVIgKTtcblx0XHRpZiAoIHN0YXR1cyAhPT0gZ2wuRlJBTUVCVUZGRVJfQ09NUExFVEUgKSB7XG5cdFx0XHR0aHJvdyBcImNyZWF0ZURyYXdCdWZmZXJzOiBnbC5jaGVja0ZyYW1lYnVmZmVyU3RhdHVzKCBnbC5GUkFNRUJVRkZFUiApIHJldHVybnMgXCIgKyBzdGF0dXM7XG5cdFx0fVxuXHRcdGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIG51bGwgKTtcblxuXHRcdHJldHVybiBmcmFtZWJ1ZmZlcjtcblx0fVxuXG5cdHJlc2l6ZURyYXdCdWZmZXJzKCBfZnJhbWVidWZmZXIsIF93aWR0aCwgaGVpZ2h0ICkge1xuXHRcdGxldCBpdCA9IHRoaXM7XG5cdFx0bGV0IGdsID0gaXQuZ2w7XG5cblx0XHRnbC5iaW5kRnJhbWVidWZmZXIoIGdsLkZSQU1FQlVGRkVSLCBfZnJhbWVidWZmZXIuZnJhbWVidWZmZXIgKTtcblxuXHRcdGdsLmJpbmRSZW5kZXJidWZmZXIoIGdsLlJFTkRFUkJVRkZFUiwgX2ZyYW1lYnVmZmVyLmRlcHRoICk7XG5cdFx0Z2wucmVuZGVyYnVmZmVyU3RvcmFnZSggZ2wuUkVOREVSQlVGRkVSLCBnbC5ERVBUSF9DT01QT05FTlQxNiwgX3dpZHRoLCBfaGVpZ2h0ICk7XG5cdFx0Z2wuYmluZFJlbmRlcmJ1ZmZlciggZ2wuUkVOREVSQlVGRkVSLCBudWxsICk7XG5cdFx0XG5cdFx0Zm9yICggbGV0IGkgPSAwOyBpIDwgX2ZyYW1lYnVmZmVyLnRleHR1cmVzLmxlbmd0aDsgaSArKyApIHtcblx0XHRcdGdsLmJpbmRUZXh0dXJlKCBnbC5URVhUVVJFXzJELCBfZnJhbWVidWZmZXIudGV4dHVyZXNbIGkgXSApO1xuXHRcdFx0Z2wudGV4SW1hZ2UyRCggZ2wuVEVYVFVSRV8yRCwgMCwgZ2wuUkdCQSwgX3dpZHRoLCBfaGVpZ2h0LCAwLCBnbC5SR0JBLCBnbC5GTE9BVCwgbnVsbCApO1xuXHRcdFx0Z2wuYmluZFRleHR1cmUoIGdsLlRFWFRVUkVfMkQsIG51bGwgKTtcblx0XHR9XG5cdFx0XG5cdFx0Z2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgbnVsbCApO1xuXHR9XG5cblx0ZHJhd0J1ZmZlcnMoIF9udW1EcmF3QnVmZmVycyApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXHRcdFxuXHRcdGxldCBleHQgPSBpdC5nZXRFeHRlbnNpb24oIFwiV0VCR0xfZHJhd19idWZmZXJzXCIsIHRydWUgKTtcblxuXHRcdGxldCBhcnJheSA9IFtdO1xuXHRcdGlmICggdHlwZW9mIF9udW1EcmF3QnVmZmVycyA9PT0gXCJudW1iZXJcIiApIHtcblx0XHRcdGZvciAoIGxldCBpID0gMDsgaSA8IF9udW1EcmF3QnVmZmVyczsgaSArKyApIHtcblx0XHRcdFx0YXJyYXkucHVzaCggZXh0LkNPTE9SX0FUVEFDSE1FTlQwX1dFQkdMICsgaSApO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRhcnJheSA9IGFycmF5LmNvbmNhdCggX251bURyYXdCdWZmZXJzICk7XG5cdFx0fVxuXHRcdGV4dC5kcmF3QnVmZmVyc1dFQkdMKCBhcnJheSApO1xuXHR9XG5cblx0Y2xlYXIoIF9yLCBfZywgX2IsIF9hLCBfZCApIHtcblx0XHRsZXQgaXQgPSB0aGlzO1xuXHRcdGxldCBnbCA9IGl0LmdsO1xuXG5cdFx0bGV0IHIgPSBfciB8fCAwLjA7XG5cdFx0bGV0IGcgPSBfZyB8fCAwLjA7XG5cdFx0bGV0IGIgPSBfYiB8fCAwLjA7XG5cdFx0bGV0IGEgPSB0eXBlb2YgX2EgPT09ICdudW1iZXInID8gX2EgOiAxLjA7XG5cdFx0bGV0IGQgPSB0eXBlb2YgX2QgPT09ICdudW1iZXInID8gX2QgOiAxLjA7XG5cblx0ICBnbC5jbGVhckNvbG9yKCByLCBnLCBiLCBhICk7XG5cdCAgZ2wuY2xlYXJEZXB0aCggZCApO1xuXHQgIGdsLmNsZWFyKCBnbC5DT0xPUl9CVUZGRVJfQklUIHwgZ2wuREVQVEhfQlVGRkVSX0JJVCApO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHTENhdDtcbiIsImxldCBzdGVwID0gKCBfb2JqICkgPT4ge1xuICBsZXQgb2JqID0gX29iajtcbiAgbGV0IGNvdW50ID0gLTE7XG5cbiAgbGV0IGZ1bmMgPSAoKSA9PiB7XG4gICAgY291bnQgKys7XG4gICAgaWYgKCB0eXBlb2Ygb2JqWyBjb3VudCBdID09PSAnZnVuY3Rpb24nICkge1xuICAgICAgb2JqWyBjb3VudCBdKCBmdW5jICk7XG4gICAgfVxuICB9O1xuICBmdW5jKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBzdGVwO1xuIiwibGV0IFR3ZWFrID0gY2xhc3Mge1xuICBjb25zdHJ1Y3RvciggX2VsICkge1xuICAgIGxldCBpdCA9IHRoaXM7XG5cbiAgICBpdC5wYXJlbnQgPSBfZWw7XG4gICAgaXQudmFsdWVzID0ge307XG4gICAgaXQuZWxlbWVudHMgPSB7fTtcbiAgfVxuXG4gIGJ1dHRvbiggX25hbWUsIF9wcm9wcyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgbGV0IHByb3BzID0gX3Byb3BzIHx8IHt9O1xuXG4gICAgaWYgKCB0eXBlb2YgaXQudmFsdWVzWyBfbmFtZSBdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgaXQucGFyZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblxuICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lucHV0JyApO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApO1xuICAgICAgaW5wdXQudHlwZSA9ICdidXR0b24nO1xuICAgICAgaW5wdXQudmFsdWUgPSBfbmFtZTtcblxuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciggJ2NsaWNrJywgKCkgPT4ge1xuICAgICAgICBpdC52YWx1ZXNbIF9uYW1lIF0gPSB0cnVlO1xuICAgICAgfSApO1xuXG4gICAgICBpdC5lbGVtZW50c1sgX25hbWUgXSA9IHtcbiAgICAgICAgZGl2OiBkaXYsXG4gICAgICAgIGlucHV0OiBpbnB1dFxuICAgICAgfTtcbiAgICB9XG5cbiAgICBsZXQgdGVtcHZhbHVlID0gaXQudmFsdWVzWyBfbmFtZSBdO1xuICAgIGl0LnZhbHVlc1sgX25hbWUgXSA9IGZhbHNlO1xuICAgIGlmICggdHlwZW9mIHByb3BzLnNldCA9PT0gJ2Jvb2xlYW4nICkge1xuICAgICAgaXQudmFsdWVzWyBfbmFtZSBdID0gcHJvcHMuc2V0O1xuICAgIH1cblxuICAgIHJldHVybiB0ZW1wdmFsdWU7XG4gIH1cblxuICBjaGVja2JveCggX25hbWUsIF9wcm9wcyApIHtcbiAgICBsZXQgaXQgPSB0aGlzO1xuXG4gICAgbGV0IHByb3BzID0gX3Byb3BzIHx8IHt9O1xuXG4gICAgbGV0IHZhbHVlO1xuXG4gICAgaWYgKCB0eXBlb2YgaXQudmFsdWVzWyBfbmFtZSBdID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgIHZhbHVlID0gcHJvcHMudmFsdWUgfHwgZmFsc2U7XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgaXQucGFyZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblxuICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZCggbmFtZSApO1xuICAgICAgbmFtZS5pbm5lclRleHQgPSBfbmFtZTtcblxuICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lucHV0JyApO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApO1xuICAgICAgaW5wdXQudHlwZSA9ICdjaGVja2JveCc7XG4gICAgICBpbnB1dC5jaGVja2VkID0gdmFsdWU7XG5cbiAgICAgIGl0LmVsZW1lbnRzWyBfbmFtZSBdID0ge1xuICAgICAgICBkaXY6IGRpdixcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgaW5wdXQ6IGlucHV0XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSA9IGl0LmVsZW1lbnRzWyBfbmFtZSBdLmlucHV0LmNoZWNrZWQ7XG4gICAgfVxuXG4gICAgaWYgKCB0eXBlb2YgcHJvcHMuc2V0ID09PSAnYm9vbGVhbicgKSB7XG4gICAgICB2YWx1ZSA9IHByb3BzLnNldDtcbiAgICB9XG5cbiAgICBpdC5lbGVtZW50c1sgX25hbWUgXS5pbnB1dC5jaGVja2VkID0gdmFsdWU7XG4gICAgaXQudmFsdWVzWyBfbmFtZSBdID0gdmFsdWU7XG5cbiAgICByZXR1cm4gaXQudmFsdWVzWyBfbmFtZSBdO1xuICB9XG5cbiAgcmFuZ2UoIF9uYW1lLCBfcHJvcHMgKSB7XG4gICAgbGV0IGl0ID0gdGhpcztcblxuICAgIGxldCBwcm9wcyA9IF9wcm9wcyB8fCB7fTtcblxuICAgIGxldCB2YWx1ZTtcblxuICAgIGlmICggdHlwZW9mIGl0LnZhbHVlc1sgX25hbWUgXSA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICBsZXQgbWluID0gcHJvcHMubWluIHx8IDAuMDtcbiAgICAgIGxldCBtYXggPSBwcm9wcy5tYXggfHwgMS4wO1xuICAgICAgbGV0IHN0ZXAgPSBwcm9wcy5zdGVwIHx8IDAuMDAxO1xuICAgICAgdmFsdWUgPSBwcm9wcy52YWx1ZSB8fCBtaW47XG5cbiAgICAgIGxldCBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnZGl2JyApO1xuICAgICAgaXQucGFyZW50LmFwcGVuZENoaWxkKCBkaXYgKTtcblxuICAgICAgbGV0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcbiAgICAgIGRpdi5hcHBlbmRDaGlsZCggbmFtZSApO1xuICAgICAgbmFtZS5pbm5lclRleHQgPSBfbmFtZTtcblxuICAgICAgbGV0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCggJ2lucHV0JyApO1xuICAgICAgZGl2LmFwcGVuZENoaWxkKCBpbnB1dCApO1xuICAgICAgaW5wdXQudHlwZSA9ICdyYW5nZSc7XG4gICAgICBpbnB1dC52YWx1ZSA9IHZhbHVlO1xuICAgICAgaW5wdXQubWluID0gbWluO1xuICAgICAgaW5wdXQubWF4ID0gbWF4O1xuICAgICAgaW5wdXQuc3RlcCA9IHN0ZXA7XG5cbiAgICAgIGxldCB2YWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnc3BhbicgKTtcbiAgICAgIHZhbC5pbm5lclRleHQgPSB2YWx1ZS50b0ZpeGVkKCAzICk7XG4gICAgICBkaXYuYXBwZW5kQ2hpbGQoIHZhbCApO1xuICAgICAgaW5wdXQuYWRkRXZlbnRMaXN0ZW5lciggJ2lucHV0JywgKCBfZXZlbnQgKSA9PiB7XG4gICAgICAgIGxldCB2YWx1ZSA9IHBhcnNlRmxvYXQoIGlucHV0LnZhbHVlICk7XG4gICAgICAgIHZhbC5pbm5lclRleHQgPSB2YWx1ZS50b0ZpeGVkKCAzICk7XG4gICAgICB9ICk7XG5cbiAgICAgIGl0LmVsZW1lbnRzWyBfbmFtZSBdID0ge1xuICAgICAgICBkaXY6IGRpdixcbiAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgaW5wdXQ6IGlucHV0LFxuICAgICAgICB2YWw6IHZhbFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgPSBwYXJzZUZsb2F0KCBpdC5lbGVtZW50c1sgX25hbWUgXS5pbnB1dC52YWx1ZSApO1xuICAgIH1cblxuICAgIGlmICggdHlwZW9mIHByb3BzLnNldCA9PT0gJ251bWJlcicgKSB7XG4gICAgICB2YWx1ZSA9IHByb3BzLnNldDtcbiAgICB9XG5cbiAgICBpdC52YWx1ZXNbIF9uYW1lIF0gPSB2YWx1ZTtcbiAgICBpdC5lbGVtZW50c1sgX25hbWUgXS5pbnB1dC52YWx1ZSA9IHZhbHVlO1xuXG4gICAgcmV0dXJuIGl0LnZhbHVlc1sgX25hbWUgXTtcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IFR3ZWFrO1xuIiwibGV0IHNlZWQ7XG5sZXQgeG9yc2hpZnQgPSAoIF9zZWVkICkgPT4ge1xuICBzZWVkID0gX3NlZWQgfHwgc2VlZCB8fCAxO1xuICBzZWVkID0gc2VlZCBeICggc2VlZCA8PCAxMyApO1xuICBzZWVkID0gc2VlZCBeICggc2VlZCA+Pj4gMTcgKTtcbiAgc2VlZCA9IHNlZWQgXiAoIHNlZWQgPDwgNSApO1xuICByZXR1cm4gc2VlZCAvIE1hdGgucG93KCAyLCAzMiApICsgMC41O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgeG9yc2hpZnQ7XG4iLCJpbXBvcnQgeG9yc2hpZnQgZnJvbSAnLi9saWIveG9yc2hpZnQnO1xuaW1wb3J0IEdMQ2F0IGZyb20gJy4vbGliL2dsY2F0JztcbmltcG9ydCBDYXRNYXRoIGZyb20gJy4vbGliL2NhdG1hdGgnO1xuaW1wb3J0IFBhdGggZnJvbSAnLi9saWIvZ2xjYXQtcGF0aC1ndWknO1xuaW1wb3J0IHN0ZXAgZnJvbSAnLi9saWIvc3RlcCc7XG5pbXBvcnQgVHdlYWsgZnJvbSAnLi9saWIvdHdlYWsnO1xuXG5pbXBvcnQgb2N0YWhlZHJvbiBmcm9tICcuL29jdGFoZWRyb24nO1xuaW1wb3J0IG1vbml0b3JSZWNvdmVyIGZyb20gJy4vbW9uaXRvci1yZWNvdmVyJztcbmltcG9ydCB7IGZhaWwgfSBmcm9tICdhc3NlcnQnO1xuXG5jb25zdCBnbHNsaWZ5ID0gcmVxdWlyZSggJ2dsc2xpZnknICk7XG5cbi8vIC0tLS0tLVxuXG54b3JzaGlmdCggMzQ3ODk1MDE3NDU4OTA2ICk7XG5cbmNvbnN0IGNsYW1wID0gKCBfdmFsdWUsIF9taW4sIF9tYXggKSA9PiBNYXRoLm1pbiggTWF0aC5tYXgoIF92YWx1ZSwgX21pbiApLCBfbWF4ICk7XG5jb25zdCBzYXR1cmF0ZSA9ICggX3ZhbHVlICkgPT4gY2xhbXAoIF92YWx1ZSwgMC4wLCAxLjAgKTtcblxuLy8gLS0tLS0tXG5cbmxldCBmcmFtZXMgPSAyMDA7XG5sZXQgYXV0b21hdG9uID0gbmV3IEF1dG9tYXRvbigge1xuICBndWk6IGRpdkF1dG9tYXRvbixcbiAgZnBzOiBmcmFtZXMsXG4gIGRhdGE6IGBcbiAge1wicmV2XCI6MjAxNzA0MTgsXCJsZW5ndGhcIjoxLFwicmVzb2x1dGlvblwiOjEwMDAsXCJwYXJhbXNcIjp7XCJjYW1lcmFSb3RcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjowLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NTAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19XSxcImZvY3VzXCI6W3tcInRpbWVcIjowLFwidmFsdWVcIjoxLjg0OTAwMjUxMTE2MDcxMyxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuMDc5NTEwNzAzMzYzOTE0MzcsXCJ2YWx1ZVwiOjE2LjMxNzc3OTEyNzc1Njc1LFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6ODcuNTEsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuMjU4OTE5NDY5OTI4NjQ0MjMsXCJ2YWx1ZVwiOjUuNjg0NjU1MzIxMjEyMDQxLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6ODcuNTEsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuNDkyMzU0NzQwMDYxMTYyMSxcInZhbHVlXCI6OS40MjgxOTMwNDY5MzMxMjgsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo4Ny41MSxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC43OTgxNjUxMzc2MTQ2Nzg5LFwidmFsdWVcIjo2LjExMDEzNTgyOTM3Nzc2MSxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjg3LjUxLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjoyLjU3NzU1MTk0MTc4NjUyNCxcIm1vZGVcIjoyLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwiY2FtZXJhWFwiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6MS41ODAyNjQ0ODY1ODUzNDYsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjgzMTgwNDI4MTM0NTU2NTcsXCJ2YWx1ZVwiOjkuODE5MDYzMzkxNDE3MzQxLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6MTgsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOi0xMS44MzczNjg5NTE1MjUwMSxcIm1vZGVcIjo1LFwicGFyYW1zXCI6e1wiZ3Jhdml0eVwiOjQyMCxcImJvdW5jZVwiOjAuM30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwiY2FtZXJhWVwiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjIuMTE3Nzg2Mjk4NzI2MjgsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo4LFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19XSxcImNhbWVyYVpcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjM4LjM0OTY5MDYwNjY1Nzk2LFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC4yNTc5MDAxMDE5MzY3OTkyLFwidmFsdWVcIjoxMy4xNTM0OTE4MjExNDAwNjIsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo1MDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuODI5NDU5NzM0OTY0MzIyLFwidmFsdWVcIjo0LjMyODM5MTU0NDI0MjU1ODUsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjoyOC4zNixcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MSxcInZhbHVlXCI6LTkuOTAyNDE2NzA1NTUzMDE3LFwibW9kZVwiOjUsXCJwYXJhbXNcIjp7XCJncmF2aXR5XCI6MTEwLjA4NixcImJvdW5jZVwiOjAuM30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwiY2FtZXJhVFhcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjowLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NTAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOlt7XCJ2ZWxvY2l0eVwiOjB9LGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwiY2FtZXJhVFlcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjowLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NTAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOlt7XCJ2ZWxvY2l0eVwiOjB9LGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwiY2FtZXJhVFpcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjowLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJtb3NoVGhyZXNob2xkXCI6W3tcInRpbWVcIjowLFwidmFsdWVcIjowLjk1ODkzNzAzODE3MzU2NjcsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjA3ODQ5MTMzNTM3MjA2OTM3LFwidmFsdWVcIjowLjAwNDc2MTkwNDc2MTkwNDc0NSxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjc1MDAuMDQyLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjA5Mjc2MjQ4NzI1NzkwMDExLFwidmFsdWVcIjotMC4wMjM4MDk1MjM4MDk1MjM4MzYsXCJtb2RlXCI6MixcInBhcmFtc1wiOnt9LFwibW9kc1wiOlt7XCJ2ZWxvY2l0eVwiOjB9LGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuNTE3ODM4OTM5ODU3Mjg4NSxcInZhbHVlXCI6MCxcIm1vZGVcIjoyLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W3tcInZlbG9jaXR5XCI6MH0sZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC43NTczOTA0MTc5NDA4NzY3LFwidmFsdWVcIjowLjI2NTQzNjk1MzU5MDAyOTQsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjoyNDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjEuNDEyMzU4MjI1NDU2MzA2LFwibW9kZVwiOjUsXCJwYXJhbXNcIjp7XCJncmF2aXR5XCI6MzEsXCJib3VuY2VcIjowLjN9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19XSxcInJlY292ZXJCYXJcIjpbe1widGltZVwiOjAsXCJ2YWx1ZVwiOjAuMjA5NTIzODA5NTIzODA5NTYsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjA1NzA4NDYwNzU0MzMyMzE0LFwidmFsdWVcIjowLjIxNDI4NTcxNDI4NTcxNDIsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjE1MDg2NjQ2Mjc5MzA2ODI4LFwidmFsdWVcIjoxLjAxOTA0NzYxOTA0NzYxOSxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjQzMDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuOTAwMTAxOTM2Nzk5MTg0NSxcInZhbHVlXCI6MCxcIm1vZGVcIjowLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjAuMDQ3NjE5MDQ3NjE5MDQ3NjcsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19XSxcInJlY292ZXJDbG9zZVwiOlt7XCJ0aW1lXCI6MCxcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuMjIyMjIyMjIyMjIyMjIyMixcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuNTgzMDc4NDkxMzM1MzcyLFwidmFsdWVcIjowLjk5NTIzODA5NTIzODA5NTEsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjo1ODAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjkwMTEyMTMwNDc5MTAyOTYsXCJ2YWx1ZVwiOjEsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjowLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6MjkwMDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX1dLFwiY2lyY2xlUmFkaXVzXCI6W3tcInRpbWVcIjowLFwidmFsdWVcIjowLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC4xMDkwNzIzNzUxMjc0MjEsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjowLjg5Nzk4MDYzMjAwODE1NDksXCJ2YWx1ZVwiOjAuNTM4NjcxODc0OTk5OTk5NyxcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjMwMDAsXCJkYW1wXCI6MX0sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjEsXCJ2YWx1ZVwiOjAsXCJtb2RlXCI6NCxcInBhcmFtc1wiOntcInJhdGVcIjoxMzAwMCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfV0sXCJjaXJjbGVTcGluXCI6W3tcInRpbWVcIjowLFwidmFsdWVcIjowLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC4wNjkzMTcwMjM0NDU0NjM4MSxcInZhbHVlXCI6MCxcIm1vZGVcIjoxLFwicGFyYW1zXCI6e30sXCJtb2RzXCI6W2ZhbHNlLGZhbHNlLGZhbHNlLGZhbHNlXX0se1widGltZVwiOjAuNDg4Mjc3MjY4MDkzNzgxODYsXCJ2YWx1ZVwiOjEuNzE4NDE1MTc4NTcxNDI3MixcIm1vZGVcIjo0LFwicGFyYW1zXCI6e1wicmF0ZVwiOjkzLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19LHtcInRpbWVcIjoxLFwidmFsdWVcIjoyLjAzMTMzMzcwNTM1NzE0MjUsXCJtb2RlXCI6MSxcInBhcmFtc1wiOnt9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19XSxcIm1ldGFiYWxsUmFkaXVzXCI6W3tcInRpbWVcIjowLFwidmFsdWVcIjotMC45MjE0Mjg1NzE0Mjg1NzE1LFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC4xNTU5NjMzMDI3NTIyOTM2LFwidmFsdWVcIjotMC44Nzk3NjE5MDQ3NjE5MDQ2LFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC4zMjAwODE1NDk0MzkzNDc2LFwidmFsdWVcIjoxLFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NTgwMCxcImRhbXBcIjoxfSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MC44Nzg2OTUyMDg5NzA0MzgzLFwidmFsdWVcIjoxLFwibW9kZVwiOjEsXCJwYXJhbXNcIjp7fSxcIm1vZHNcIjpbZmFsc2UsZmFsc2UsZmFsc2UsZmFsc2VdfSx7XCJ0aW1lXCI6MSxcInZhbHVlXCI6LTIuNzc1Njg3MDgxNDczMjA4LFwibW9kZVwiOjQsXCJwYXJhbXNcIjp7XCJyYXRlXCI6NTAwLFwiZGFtcFwiOjF9LFwibW9kc1wiOltmYWxzZSxmYWxzZSxmYWxzZSxmYWxzZV19XX0sXCJndWlcIjp7XCJzbmFwXCI6e1wiZW5hYmxlXCI6ZmFsc2UsXCJicG1cIjpcIjYwXCIsXCJvZmZzZXRcIjpcIjBcIn19fVxuYFxufSApO1xubGV0IGF1dG8gPSBhdXRvbWF0b24uYXV0bztcblxuLy8gLS0tLS0tXG5cbmxldCB3aWR0aCA9IDQwMDtcbmxldCBoZWlnaHQgPSA0MDA7XG5jYW52YXMud2lkdGggPSB3aWR0aDtcbmNhbnZhcy5oZWlnaHQgPSBoZWlnaHQ7XG5cbmxldCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCAnd2ViZ2wnICk7XG5sZXQgZ2xDYXQgPSBuZXcgR0xDYXQoIGdsICk7XG5nbENhdC5nZXRFeHRlbnNpb24oIFwiT0VTX3RleHR1cmVfZmxvYXRcIiwgdHJ1ZSApO1xuZ2xDYXQuZ2V0RXh0ZW5zaW9uKCBcIk9FU190ZXh0dXJlX2Zsb2F0X2xpbmVhclwiLCB0cnVlICk7XG5nbENhdC5nZXRFeHRlbnNpb24oIFwiRVhUX2ZyYWdfZGVwdGhcIiwgdHJ1ZSApO1xuZ2xDYXQuZ2V0RXh0ZW5zaW9uKCBcIldFQkdMX2RyYXdfYnVmZmVyc1wiLCB0cnVlICk7XG5cbmxldCBnbENhdFBhdGggPSBuZXcgUGF0aCggZ2xDYXQsIHtcbiAgZHJhd2J1ZmZlcnM6IHRydWUsXG4gIGVsOiBkaXZQYXRoLFxuICBjYW52YXM6IGNhbnZhcyxcbiAgc3RyZXRjaDogdHJ1ZVxufSApO1xuXG4vLyAtLS0tLS1cblxubGV0IHR3ZWFrID0gbmV3IFR3ZWFrKCBkaXZUd2VhayApO1xuXG4vLyAtLS0tLS1cblxubGV0IHRvdGFsRnJhbWVzID0gMDtcbmxldCBpbml0ID0gdHJ1ZTtcblxuLy8gLS0tLS0tXG5cbmxldCB2Ym9RdWFkID0gZ2xDYXQuY3JlYXRlVmVydGV4YnVmZmVyKCBbIC0xLCAtMSwgMSwgLTEsIC0xLCAxLCAxLCAxIF0gKTtcbmxldCB2Ym9RdWFkVVYgPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoIFsgMCwgMCwgMSwgMCwgMCwgMSwgMSwgMSBdICk7XG5sZXQgdmJvUXVhZDMgPSBnbENhdC5jcmVhdGVWZXJ0ZXhidWZmZXIoIFsgLTEsIC0xLCAwLCAxLCAtMSwgMCwgLTEsIDEsIDAsIDEsIDEsIDAgXSApO1xuXG5sZXQgb2N0ID0gb2N0YWhlZHJvbiggMSApO1xubGV0IHRleHR1cmVPY3RQb3MgPSBnbENhdC5jcmVhdGVUZXh0dXJlKCk7XG5nbENhdC5zZXRUZXh0dXJlRnJvbUZsb2F0QXJyYXkoIHRleHR1cmVPY3RQb3MsIG9jdC5wb3MubGVuZ3RoIC8gNCwgMSwgb2N0LnBvcyApO1xubGV0IHRleHR1cmVPY3ROb3IgPSBnbENhdC5jcmVhdGVUZXh0dXJlKCk7XG5nbENhdC5zZXRUZXh0dXJlRnJvbUZsb2F0QXJyYXkoIHRleHR1cmVPY3ROb3IsIG9jdC5wb3MubGVuZ3RoIC8gNCwgMSwgb2N0Lm5vciApO1xuXG5sZXQgcGFydGljbGVQaXhlbHMgPSAzO1xubGV0IHBhcnRpY2xlc1NxcnQgPSAxMjg7XG5sZXQgcGFydGljbGVzID0gcGFydGljbGVzU3FydCAqIHBhcnRpY2xlc1NxcnQ7XG5sZXQgdmVydHNQZXJQYXJ0aWNsZSA9IG9jdC5wb3MubGVuZ3RoIC8gNDtcblxubGV0IHZib1BhcnRpY2xlID0gZ2xDYXQuY3JlYXRlVmVydGV4YnVmZmVyKCAoICgpID0+IHtcbiAgbGV0IHJldCA9IFtdO1xuICBmb3IgKCBsZXQgaSA9IDA7IGkgPCBwYXJ0aWNsZXNTcXJ0ICogcGFydGljbGVzU3FydCAqIHZlcnRzUGVyUGFydGljbGU7IGkgKysgKSB7XG4gICAgbGV0IGl4ID0gTWF0aC5mbG9vciggaSAvIHZlcnRzUGVyUGFydGljbGUgKSAlIHBhcnRpY2xlc1NxcnQ7XG4gICAgbGV0IGl5ID0gTWF0aC5mbG9vciggaSAvIHBhcnRpY2xlc1NxcnQgLyB2ZXJ0c1BlclBhcnRpY2xlICk7XG4gICAgbGV0IGl6ID0gaSAlIHZlcnRzUGVyUGFydGljbGU7XG4gICAgXG4gICAgcmV0LnB1c2goIGl4ICogcGFydGljbGVQaXhlbHMgKTtcbiAgICByZXQucHVzaCggaXkgKTtcbiAgICByZXQucHVzaCggaXogKTtcbiAgfVxuICByZXR1cm4gcmV0O1xufSApKCkgKTtcblxuLy8gLS0tLS0tXG5cbmxldCB0ZXh0dXJlUmFuZG9tU2l6ZSA9IDI1NjtcblxubGV0IHRleHR1cmVSYW5kb21VcGRhdGUgPSAoIF90ZXggKSA9PiB7XG4gIGdsQ2F0LnNldFRleHR1cmVGcm9tQXJyYXkoIF90ZXgsIHRleHR1cmVSYW5kb21TaXplLCB0ZXh0dXJlUmFuZG9tU2l6ZSwgKCAoKSA9PiB7XG4gICAgbGV0IGxlbiA9IHRleHR1cmVSYW5kb21TaXplICogdGV4dHVyZVJhbmRvbVNpemUgKiA0O1xuICAgIGxldCByZXQgPSBuZXcgVWludDhBcnJheSggbGVuICk7XG4gICAgZm9yICggbGV0IGkgPSAwOyBpIDwgbGVuOyBpICsrICkge1xuICAgICAgcmV0WyBpIF0gPSBNYXRoLmZsb29yKCB4b3JzaGlmdCgpICogMjU2LjAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSApKCkgKTtcbn07XG5cbmxldCB0ZXh0dXJlUmFuZG9tU3RhdGljID0gZ2xDYXQuY3JlYXRlVGV4dHVyZSgpO1xuZ2xDYXQudGV4dHVyZVdyYXAoIHRleHR1cmVSYW5kb21TdGF0aWMsIGdsLlJFUEVBVCApO1xudGV4dHVyZVJhbmRvbVVwZGF0ZSggdGV4dHVyZVJhbmRvbVN0YXRpYyApO1xuXG5sZXQgdGV4dHVyZVJhbmRvbSA9IGdsQ2F0LmNyZWF0ZVRleHR1cmUoKTtcbmdsQ2F0LnRleHR1cmVXcmFwKCB0ZXh0dXJlUmFuZG9tLCBnbC5SRVBFQVQgKTtcblxubGV0IHRleHR1cmVNb25pdG9yUmVjb3ZlciA9IGdsQ2F0LmNyZWF0ZVRleHR1cmUoKTtcbmdsQ2F0LnNldFRleHR1cmUoIHRleHR1cmVNb25pdG9yUmVjb3ZlciwgbW9uaXRvclJlY292ZXIgKTtcblxuLy8gLS0tLS0tXG5cbmxldCBmcmFtZWJ1ZmZlcnNHYXVzcyA9IFtcbiAgZ2xDYXQuY3JlYXRlRmxvYXRGcmFtZWJ1ZmZlciggd2lkdGggLyA0LCBoZWlnaHQgLyA0ICksXG4gIGdsQ2F0LmNyZWF0ZUZsb2F0RnJhbWVidWZmZXIoIHdpZHRoIC8gNCwgaGVpZ2h0IC8gNCApLFxuICBnbENhdC5jcmVhdGVGbG9hdEZyYW1lYnVmZmVyKCB3aWR0aCAvIDQsIGhlaWdodCAvIDQgKVxuXTtcblxubGV0IGZyYW1lYnVmZmVyUHJlRG9mID0gZ2xDYXQuY3JlYXRlRmxvYXRGcmFtZWJ1ZmZlciggd2lkdGgsIGhlaWdodCApO1xuXG5sZXQgZnJhbWVidWZmZXJNb3Rpb25QcmV2ID0gZ2xDYXQuY3JlYXRlRnJhbWVidWZmZXIoIHdpZHRoLCBoZWlnaHQgKTtcbmxldCBmcmFtZWJ1ZmZlck1vdGlvbk1vc2ggPSBnbENhdC5jcmVhdGVGcmFtZWJ1ZmZlciggd2lkdGgsIGhlaWdodCApO1xuXG4vLyAtLS0tLS1cblxubGV0IHJlbmRlckEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnYScgKTtcblxubGV0IHNhdmVGcmFtZSA9ICgpID0+IHtcbiAgcmVuZGVyQS5ocmVmID0gY2FudmFzLnRvRGF0YVVSTCggJ2ltYWdlL2pwZWcnICk7XG4gIHJlbmRlckEuZG93bmxvYWQgPSAoICcwMDAwJyArIHRvdGFsRnJhbWVzICkuc2xpY2UoIC01ICkgKyAnLmpwZyc7XG4gIHJlbmRlckEuY2xpY2soKTtcbn07XG5cbi8vIC0tLS0tLVxuXG5sZXQgbW91c2VYID0gMC4wO1xubGV0IG1vdXNlWSA9IDAuMDtcblxuLy8gLS0tLS0tXG5cbmxldCBjYW1lcmFQb3MgPSBbIDAuMCwgMC4wLCAwLjAgXTtcbmxldCBjYW1lcmFUYXIgPSBbIDAuMCwgMC4wLCAwLjAgXTtcbmxldCBjYW1lcmFSb3QgPSAwLjA7XG5sZXQgY2FtZXJhRm92ID0gOTAuMDtcblxubGV0IGNhbWVyYU5lYXIgPSAwLjAxO1xubGV0IGNhbWVyYUZhciA9IDEwMC4wO1xuXG5sZXQgbGlnaHRQb3MgPSBbIDEwLjAsIDEwLjAsIDEwLjAgXTtcblxubGV0IG1hdFA7XG5sZXQgbWF0VjtcbmxldCBtYXRQTDtcbmxldCBtYXRWTDtcblxubGV0IHVwZGF0ZU1hdHJpY2VzID0gKCkgPT4ge1xuICBtYXRQID0gQ2F0TWF0aC5tYXQ0UGVyc3BlY3RpdmUoIGNhbWVyYUZvdiwgd2lkdGggLyBoZWlnaHQsIGNhbWVyYU5lYXIsIGNhbWVyYUZhciApO1xuICBtYXRWID0gQ2F0TWF0aC5tYXQ0TG9va0F0KCBjYW1lcmFQb3MsIGNhbWVyYVRhciwgWyAwLjAsIDEuMCwgMC4wIF0sIGNhbWVyYVJvdCApO1xuXG4gIG1hdFBMID0gQ2F0TWF0aC5tYXQ0UGVyc3BlY3RpdmUoIDcwLjAsIDEuMCwgY2FtZXJhTmVhciwgY2FtZXJhRmFyICk7XG4gIG1hdFZMID0gQ2F0TWF0aC5tYXQ0TG9va0F0KCBsaWdodFBvcywgY2FtZXJhVGFyLCBbIDAuMCwgMS4wLCAwLjAgXSwgMC4wICk7XG59O1xudXBkYXRlTWF0cmljZXMoKTtcblxuLy8gLS0tLS0tXG5cbmxldCBiZ0NvbG9yID0gWyAwLjQsIDAuNCwgMC40LCAxLjAgXTtcblxuLy8gLS0tLS0tXG5cbmdsQ2F0UGF0aC5zZXRHbG9iYWxGdW5jKCAoKSA9PiB7XG4gIGdsQ2F0LnVuaWZvcm0xaSggJ2luaXQnLCBpbml0ICk7XG4gIGdsQ2F0LnVuaWZvcm0xZiggJ3RpbWUnLCBhdXRvbWF0b24udGltZSApO1xuICBnbENhdC51bmlmb3JtMWYoICdkZWx0YVRpbWUnLCBhdXRvbWF0b24uZGVsdGFUaW1lICk7XG4gIGdsQ2F0LnVuaWZvcm0zZnYoICdjYW1lcmFQb3MnLCBjYW1lcmFQb3MgKTtcbiAgZ2xDYXQudW5pZm9ybTFmKCAnY2FtZXJhUm90JywgY2FtZXJhUm90ICk7XG4gIGdsQ2F0LnVuaWZvcm0xZiggJ2NhbWVyYUZvdicsIGNhbWVyYUZvdiApO1xuICBnbENhdC51bmlmb3JtMWYoICdjYW1lcmFOZWFyJywgY2FtZXJhTmVhciApO1xuICBnbENhdC51bmlmb3JtMWYoICdjYW1lcmFGYXInLCBjYW1lcmFGYXIgKTtcbiAgZ2xDYXQudW5pZm9ybTNmdiggJ2xpZ2h0UG9zJywgbGlnaHRQb3MgKTtcbiAgZ2xDYXQudW5pZm9ybTFmKCAncGFydGljbGVzU3FydCcsIHBhcnRpY2xlc1NxcnQgKTtcbiAgZ2xDYXQudW5pZm9ybTFmKCAncGFydGljbGVQaXhlbHMnLCBwYXJ0aWNsZVBpeGVscyApO1xuICBnbENhdC51bmlmb3JtMWYoICdmcmFtZScsIGF1dG9tYXRvbi5mcmFtZSAlIGZyYW1lcyApO1xuICBnbENhdC51bmlmb3JtMWYoICdmcmFtZXMnLCBmcmFtZXMgKTtcbiAgZ2xDYXQudW5pZm9ybTFmKCAndmVydHNQZXJQYXJ0aWNsZScsIHZlcnRzUGVyUGFydGljbGUgKTtcbiAgZ2xDYXQudW5pZm9ybU1hdHJpeDRmdiggJ21hdFAnLCBtYXRQICk7XG4gIGdsQ2F0LnVuaWZvcm1NYXRyaXg0ZnYoICdtYXRWJywgbWF0ViApO1xuICBnbENhdC51bmlmb3JtTWF0cml4NGZ2KCAnbWF0UEwnLCBtYXRQTCApO1xuICBnbENhdC51bmlmb3JtTWF0cml4NGZ2KCAnbWF0VkwnLCBtYXRWTCApO1xuICBnbENhdC51bmlmb3JtNGZ2KCAnYmdDb2xvcicsIGJnQ29sb3IgKTtcbn0gKTtcblxuZ2xDYXRQYXRoLmFkZCgge1xuICByZXR1cm46IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvcmV0dXJuLmZyYWcnICksXG4gICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5PTkUgXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAxLjAgXSxcbiAgICBmdW5jOiAoIF9wLCBwYXJhbXMgKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoICdwJywgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyMCcsIHBhcmFtcy5pbnB1dCwgMCApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG5cbiAg44GT44KT44Gr44Gh44GvOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9xdWFkLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL2JnLmZyYWcnICksXG4gICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5PTkUgXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAxLjAgXSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBkcmF3YnVmZmVyczogMixcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoICdwJywgdmJvUXVhZCwgMiApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG5cbiAgcGFydGljbGVzQ29tcHV0ZVJldHVybjoge1xuICAgIHdpZHRoOiBwYXJ0aWNsZXNTcXJ0ICogcGFydGljbGVQaXhlbHMsXG4gICAgaGVpZ2h0OiBwYXJ0aWNsZXNTcXJ0LFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9xdWFkLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL3JldHVybi5mcmFnJyApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuT05FIF0sXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMC4wIF0sXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZmxvYXQ6IHRydWUsXG4gICAgZnVuYzogKCkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAndGV4dHVyZScsIGdsQ2F0UGF0aC5mYiggXCJwYXJ0aWNsZXNDb21wdXRlXCIgKS50ZXh0dXJlLCAwICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcblxuICBwYXJ0aWNsZXNDb21wdXRlOiB7XG4gICAgd2lkdGg6IHBhcnRpY2xlc1NxcnQgKiBwYXJ0aWNsZVBpeGVscyxcbiAgICBoZWlnaHQ6IHBhcnRpY2xlc1NxcnQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvcGFydGljbGVzLWNvbXB1dGUuZnJhZycgKSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLk9ORSBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDAuMCBdLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGZsb2F0OiB0cnVlLFxuICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3RleHR1cmVSZXR1cm4nLCBnbENhdFBhdGguZmIoIFwicGFydGljbGVzQ29tcHV0ZVJldHVyblwiICkudGV4dHVyZSwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICd0ZXh0dXJlUmFuZG9tJywgdGV4dHVyZVJhbmRvbSwgMSApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG4gIFxuICBwYXJ0aWNsZXNTaGFkb3c6IHtcbiAgICB3aWR0aDogMTAyNCxcbiAgICBoZWlnaHQ6IDEwMjQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3BhcnRpY2xlcy1yZW5kZXIudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvcGFydGljbGVzLXNoYWRvdy5mcmFnJyApLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGZsb2F0OiB0cnVlLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDEuMCBdLFxuICAgIGJsZW5kOiBbIGdsLlNSQ19BTFBIQSwgZ2wuT05FX01JTlVTX1NSQ19BTFBIQSBdLFxuICAgIGZ1bmM6ICgpID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3Z1dicsIHZib1BhcnRpY2xlLCAzICk7XG4gICAgICBnbENhdC51bmlmb3JtTWF0cml4NGZ2KCAnbWF0VicsIG1hdFZMICk7XG4gICAgICBnbENhdC51bmlmb3JtTWF0cml4NGZ2KCAnbWF0UCcsIG1hdFBMICk7XG4gICAgICBnbENhdC51bmlmb3JtMmZ2KCAncmVzb2x1dGlvblBjb21wdXRlJywgWyBwYXJ0aWNsZXNTcXJ0ICogcGFydGljbGVQaXhlbHMsIHBhcnRpY2xlc1NxcnQgXSApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICd0ZXh0dXJlUGNvbXB1dGUnLCBnbENhdFBhdGguZmIoIFwicGFydGljbGVzQ29tcHV0ZVwiICkudGV4dHVyZSwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICd0ZXh0dXJlT2N0UG9zJywgdGV4dHVyZU9jdFBvcywgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICd0ZXh0dXJlT2N0Tm9yJywgdGV4dHVyZU9jdE5vciwgMyApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVTLCAwLCBwYXJ0aWNsZXMgKiB2ZXJ0c1BlclBhcnRpY2xlICk7XG4gICAgfVxuICB9LFxuICBcbiAgcGFydGljbGVzUmVuZGVyOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9wYXJ0aWNsZXMtcmVuZGVyLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL3BhcnRpY2xlcy1yZW5kZXIuZnJhZycgKSxcbiAgICBkcmF3YnVmZmVyczogMixcbiAgICBibGVuZDogWyBnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEgXSxcbiAgICBmdW5jOiAoKSA9PiB7XG4gICAgICBnbENhdC5hdHRyaWJ1dGUoICd2dXYnLCB2Ym9QYXJ0aWNsZSwgMyApO1xuICAgICAgZ2xDYXQudW5pZm9ybTJmdiggJ3Jlc29sdXRpb25QY29tcHV0ZScsIFsgcGFydGljbGVzU3FydCAqIHBhcnRpY2xlUGl4ZWxzLCBwYXJ0aWNsZXNTcXJ0IF0gKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAndGV4dHVyZVBjb21wdXRlJywgZ2xDYXRQYXRoLmZiKCBcInBhcnRpY2xlc0NvbXB1dGVcIiApLnRleHR1cmUsIDAgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAndGV4dHVyZVNoYWRvdycsIGdsQ2F0UGF0aC5mYiggXCJwYXJ0aWNsZXNTaGFkb3dcIiApLnRleHR1cmUsIDEgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAndGV4dHVyZU9jdFBvcycsIHRleHR1cmVPY3RQb3MsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAndGV4dHVyZU9jdE5vcicsIHRleHR1cmVPY3ROb3IsIDMgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFUywgMCwgcGFydGljbGVzICogdmVydHNQZXJQYXJ0aWNsZSApO1xuICAgIH1cbiAgfSxcbiAgXG4gIGdhdXNzOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9xdWFkLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL2dhdXNzLmZyYWcnICksXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMS4wIF0sXG4gICAgdGVtcEZiOiBnbENhdC5jcmVhdGVGbG9hdEZyYW1lYnVmZmVyKCB3aWR0aCwgaGVpZ2h0ICksXG4gICAgYmxlbmQ6IFsgZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBIF0sXG4gICAgZnVuYzogKCBwYXRoLCBwYXJhbXMgKSA9PiB7XG4gICAgICBpZiAoIHBhcmFtcy53aWR0aCAmJiBwYXJhbXMuaGVpZ2h0ICkge1xuICAgICAgICBnbENhdC5yZXNpemVGbG9hdEZyYW1lYnVmZmVyKCBwYXRoLnRlbXBGYiwgcGFyYW1zLndpZHRoLCBwYXJhbXMuaGVpZ2h0ICk7XG4gICAgICB9XG5cbiAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIHBhdGgudGVtcEZiLmZyYW1lYnVmZmVyICk7XG4gICAgICBnbENhdC5jbGVhciggLi4ucGF0aC5jbGVhciApO1xuXG4gICAgICBnbENhdC5hdHRyaWJ1dGUoICdwJywgdmJvUXVhZCwgMiApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyMCcsIHBhcmFtcy5pbnB1dCwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFmKCAndmFyJywgcGFyYW1zLnZhciApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFpKCAnaXNWZXJ0JywgMCApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICAgIFxuICAgICAgZ2wuYmluZEZyYW1lYnVmZmVyKCBnbC5GUkFNRUJVRkZFUiwgcGFyYW1zLmZyYW1lYnVmZmVyICk7XG5cbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXIwJywgcGF0aC50ZW1wRmIudGV4dHVyZSwgMCApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFmKCAndmFyJywgcGFyYW1zLnZhciApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFpKCAnaXNWZXJ0JywgMSApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG4gIFxuICBkb2Y6IHtcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgdmVydDogZ2xzbGlmeSggJy4vc2hhZGVyL3F1YWQudmVydCcgKSxcbiAgICBmcmFnOiBnbHNsaWZ5KCAnLi9zaGFkZXIvZG9mLmZyYWcnICksXG4gICAgYmxlbmQ6IFsgZ2wuU1JDX0FMUEhBLCBnbC5PTkVfTUlOVVNfU1JDX0FMUEhBIF0sXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMC4wIF0sXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZmxvYXQ6IHRydWUsXG4gICAgZnVuYzogKCBfcCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm0xZiggJ2ZvY3VzJywgYXV0byggJ2ZvY3VzJyApICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXJEcnknLCBwYXJhbXMuZHJ5LCAwICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXJQcmVEb2YnLCBwYXJhbXMucHJlZG9mLCAxICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXJEZXB0aCcsIHBhcmFtcy5kZXB0aCwgMiApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG4gIFxuICBcIkdvd3JvY2sgLSBibG9vbVwiOiB7XG4gICAgd2lkdGg6IHdpZHRoIC8gNC4wLFxuICAgIGhlaWdodDogaGVpZ2h0IC8gNC4wLFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9xdWFkLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL2Jsb29tLmZyYWcnICksXG4gICAgYmxlbmQ6IFsgZ2wuT05FLCBnbC5PTkUgXSxcbiAgICBjbGVhcjogWyAwLjAsIDAuMCwgMC4wLCAwLjAgXSxcbiAgICB0ZW1wRmI6IGdsQ2F0LmNyZWF0ZUZsb2F0RnJhbWVidWZmZXIoIHdpZHRoIC8gNC4wLCBoZWlnaHQgLyA0LjAgKSxcbiAgICBmcmFtZWJ1ZmZlcjogdHJ1ZSxcbiAgICBmbG9hdDogdHJ1ZSxcbiAgICBmdW5jOiAoIF9wLCBwYXJhbXMgKSA9PiB7XG4gICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCAzOyBpICsrICkge1xuICAgICAgICBsZXQgZ2F1c3NWYXIgPSBbIDUuMCwgMTUuMCwgNDAuMCBdWyBpIF07XG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIF9wLnRlbXBGYi5mcmFtZWJ1ZmZlciApO1xuICAgICAgICBnbENhdC5jbGVhciggLi4uX3AuY2xlYXIgKTtcblxuICAgICAgICBnbENhdC5hdHRyaWJ1dGUoICdwJywgdmJvUXVhZCwgMiApO1xuICAgICAgICBnbENhdC51bmlmb3JtMWkoICdpc1ZlcnQnLCBmYWxzZSApO1xuICAgICAgICBnbENhdC51bmlmb3JtMWYoICdnYXVzc1ZhcicsIGdhdXNzVmFyICk7XG4gICAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlcjAnLCBwYXJhbXMuaW5wdXQsIDAgKTtcbiAgICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICAgICAgXG4gICAgICAgIGdsLmJpbmRGcmFtZWJ1ZmZlciggZ2wuRlJBTUVCVUZGRVIsIHBhcmFtcy5mcmFtZWJ1ZmZlciApO1xuXG4gICAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICAgIGdsQ2F0LnVuaWZvcm0xaSggJ2lzVmVydCcsIHRydWUgKTtcbiAgICAgICAgZ2xDYXQudW5pZm9ybTFmKCAnZ2F1c3NWYXInLCBnYXVzc1ZhciApO1xuICAgICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXIwJywgX3AudGVtcEZiLnRleHR1cmUsIDAgKTtcbiAgICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyRHJ5JywgcGFyYW1zLmlucHV0LCAxICk7XG4gICAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBcbiAgYmxvb21GaW5hbGl6ZToge1xuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB2ZXJ0OiBnbHNsaWZ5KCAnLi9zaGFkZXIvcXVhZC52ZXJ0JyApLFxuICAgIGZyYWc6IGdsc2xpZnkoICcuL3NoYWRlci9ibG9vbS1maW5hbGl6ZS5mcmFnJyApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuT05FIF0sXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMC4wIF0sXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZmxvYXQ6IHRydWUsXG4gICAgZnVuYzogKCBfcCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlckRyeScsIHBhcmFtcy5kcnksIDAgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlcldldCcsIHBhcmFtcy53ZXQsIDEgKTtcbiAgICAgIGdsLmRyYXdBcnJheXMoIGdsLlRSSUFOR0xFX1NUUklQLCAwLCA0ICk7XG4gICAgfVxuICB9LFxuICBcbiAg44GK44Gf44GP44Gv44GZ44GQ44Od44K544OI44Ko44OV44Kn44Kv44OI44KS5oy/44GZOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9xdWFkLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL3Bvc3QuZnJhZycgKSxcbiAgICBibGVuZDogWyBnbC5PTkUsIGdsLk9ORSBdLFxuICAgIGNsZWFyOiBbIDAuMCwgMC4wLCAwLjAsIDAuMCBdLFxuICAgIGZyYW1lYnVmZmVyOiB0cnVlLFxuICAgIGZ1bmM6ICggX3AsIHBhcmFtcyApID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXIwJywgcGFyYW1zLmlucHV0LCAwICk7XG4gICAgICBnbC5kcmF3QXJyYXlzKCBnbC5UUklBTkdMRV9TVFJJUCwgMCwgNCApO1xuICAgIH1cbiAgfSxcblxuICBtb25pdG9yOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9xdWFkLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL21vbml0b3IuZnJhZycgKSxcbiAgICBibGVuZDogWyBnbC5TUkNfQUxQSEEsIGdsLk9ORV9NSU5VU19TUkNfQUxQSEEgXSxcbiAgICBkZXB0aFRlc3Q6IGZhbHNlLFxuICAgIGZ1bmM6ICggX3AsIHBhcmFtcyApID0+IHtcbiAgICAgIGdsQ2F0LmF0dHJpYnV0ZSggJ3AnLCB2Ym9RdWFkLCAyICk7XG4gICAgICBnbENhdC51bmlmb3JtMWYoICdyZWNvdmVyQmFyJywgYXV0byggXCJyZWNvdmVyQmFyXCIgKSApO1xuICAgICAgZ2xDYXQudW5pZm9ybTFmKCAncmVjb3ZlckNsb3NlJywgYXV0byggXCJyZWNvdmVyQ2xvc2VcIiApICk7XG4gICAgICBnbENhdC51bmlmb3JtMWYoICdjaXJjbGVSYWRpdXMnLCBhdXRvKCBcImNpcmNsZVJhZGl1c1wiICkgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm0xZiggJ2NpcmNsZVNwaW4nLCBhdXRvKCBcImNpcmNsZVNwaW5cIiApICk7XG4gICAgICBnbENhdC51bmlmb3JtMWYoICdtZXRhYmFsbFJhZGl1cycsIGF1dG8oIFwibWV0YWJhbGxSYWRpdXNcIiApICk7XG4gICAgICBnbENhdC51bmlmb3JtVGV4dHVyZSggJ3NhbXBsZXJNb25pdG9yUmVjb3ZlcicsIHRleHR1cmVNb25pdG9yUmVjb3ZlciwgMCApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG5cbiAgbW90aW9uOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9xdWFkLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL21vdGlvbi5mcmFnJyApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuT05FIF0sXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMC4wIF0sXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZmxvYXQ6IHRydWUsXG4gICAgZnVuYzogKCBfcCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlcjAnLCBwYXJhbXMuaW5wdXQsIDAgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlclAnLCBwYXJhbXMucHJldiwgMSApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG5cbiAgbW90aW9uU2VsOiB7XG4gICAgd2lkdGg6IHdpZHRoLFxuICAgIGhlaWdodDogaGVpZ2h0LFxuICAgIHZlcnQ6IGdsc2xpZnkoICcuL3NoYWRlci9xdWFkLnZlcnQnICksXG4gICAgZnJhZzogZ2xzbGlmeSggJy4vc2hhZGVyL21vdGlvbnNlbC5mcmFnJyApLFxuICAgIGJsZW5kOiBbIGdsLk9ORSwgZ2wuT05FIF0sXG4gICAgY2xlYXI6IFsgMC4wLCAwLjAsIDAuMCwgMC4wIF0sXG4gICAgZnJhbWVidWZmZXI6IHRydWUsXG4gICAgZmxvYXQ6IHRydWUsXG4gICAgZnVuYzogKCBfcCwgcGFyYW1zICkgPT4ge1xuICAgICAgZ2xDYXQuYXR0cmlidXRlKCAncCcsIHZib1F1YWQsIDIgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm0xZiggJ3RocmVzaG9sZCcsIDAuMSAqIGF1dG8oIFwibW9zaFRocmVzaG9sZFwiICkgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlckRyeScsIHBhcmFtcy5kcnksIDAgKTtcbiAgICAgIGdsQ2F0LnVuaWZvcm1UZXh0dXJlKCAnc2FtcGxlck1vc2gnLCBwYXJhbXMubW9zaCwgMSApO1xuICAgICAgZ2xDYXQudW5pZm9ybVRleHR1cmUoICdzYW1wbGVyTW90aW9uJywgZ2xDYXRQYXRoLmZiKCBcIm1vdGlvblwiICkudGV4dHVyZSwgMiApO1xuICAgICAgZ2wuZHJhd0FycmF5cyggZ2wuVFJJQU5HTEVfU1RSSVAsIDAsIDQgKTtcbiAgICB9XG4gIH0sXG59ICk7XG5cbi8vIC0tLS0tLVxuXG5sZXQgdXBkYXRlVUkgPSAoKSA9PiB7XG4gIGxldCBub3cgPSBuZXcgRGF0ZSgpO1xuICBsZXQgZGVhZGxpbmUgPSBuZXcgRGF0ZSggMjAxOCwgMCwgMTksIDAsIDAgKTtcblxuICBkaXZDb3VudGRvd24uaW5uZXJUZXh0ID0gXCJEZWFkbGluZTogXCIgKyBNYXRoLmZsb29yKCAoIGRlYWRsaW5lIC0gbm93ICkgLyAxMDAwICk7XG59O1xuXG4vLyAtLS0tLS1cblxubGV0IHVwZGF0ZSA9ICgpID0+IHtcbiAgaWYgKCBhdXRvbWF0b24udGltZSA9PT0gMCApIHsgeG9yc2hpZnQoIDM0NzE4OTA1NzgyOTA1NiApOyB9XG5cbiAgaWYgKCAhdHdlYWsuY2hlY2tib3goICdwbGF5JywgeyB2YWx1ZTogdHJ1ZSB9ICkgKSB7XG4gICAgc2V0VGltZW91dCggdXBkYXRlLCAxMCApO1xuICAgIHJldHVybjtcbiAgfVxuICBcbiAgdGV4dHVyZVJhbmRvbVVwZGF0ZSggdGV4dHVyZVJhbmRvbSApO1xuXG4gIHVwZGF0ZVVJKCk7XG5cbiAgdXBkYXRlTWF0cmljZXMoKTtcbiAgXG4gIGF1dG9tYXRvbi51cGRhdGUoKTtcblxuICBjYW1lcmFQb3MgPSBbXG4gICAgYXV0byggXCJjYW1lcmFYXCIgKSxcbiAgICBhdXRvKCBcImNhbWVyYVlcIiApLFxuICAgIGF1dG8oIFwiY2FtZXJhWlwiIClcbiAgXTtcbiAgY2FtZXJhVGFyID0gW1xuICAgIGF1dG8oIFwiY2FtZXJhVFhcIiApLFxuICAgIGF1dG8oIFwiY2FtZXJhVFlcIiApLFxuICAgIGF1dG8oIFwiY2FtZXJhVFpcIiApXG4gIF1cbiAgY2FtZXJhUm90ID0gYXV0byggXCJjYW1lcmFSb3RcIiApO1xuXG4gIGdsQ2F0UGF0aC5iZWdpbigpO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwi44GT44KT44Gr44Gh44GvXCIgKTtcblxuICAvLyBnbENhdFBhdGgucmVuZGVyKCBcIm1vbml0b3JcIiwgeyB0YXJnZXQ6IGdsQ2F0UGF0aC5mYiggXCLjgZPjgpPjgavjgaHjga9cIiApIH0gKTtcblxuICBnbENhdFBhdGgucmVuZGVyKCBcInBhcnRpY2xlc0NvbXB1dGVSZXR1cm5cIiApO1xuICBnbENhdFBhdGgucmVuZGVyKCBcInBhcnRpY2xlc0NvbXB1dGVcIiApO1xuICBnbENhdFBhdGgucmVuZGVyKCBcInBhcnRpY2xlc1NoYWRvd1wiICk7XG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicGFydGljbGVzUmVuZGVyXCIsIHtcbiAgICB0YXJnZXQ6IGdsQ2F0UGF0aC5mYiggXCLjgZPjgpPjgavjgaHjga9cIiApXG4gIH0gKTtcblxuICBnbENhdFBhdGgucmVuZGVyKCBcImdhdXNzXCIsIHtcbiAgICB0YXJnZXQ6IGZyYW1lYnVmZmVyUHJlRG9mLFxuICAgIGlucHV0OiBnbENhdFBhdGguZmIoIFwi44GT44KT44Gr44Gh44GvXCIgKS50ZXh0dXJlc1sgMCBdLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICB2YXI6IDUuMFxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJkb2ZcIiwge1xuICAgIGRyeTogZ2xDYXRQYXRoLmZiKCBcIuOBk+OCk+OBq+OBoeOBr1wiICkudGV4dHVyZXNbIDAgXSxcbiAgICBwcmVkb2Y6IGZyYW1lYnVmZmVyUHJlRG9mLnRleHR1cmUsXG4gICAgZGVwdGg6IGdsQ2F0UGF0aC5mYiggXCLjgZPjgpPjgavjgaHjga9cIiApLnRleHR1cmVzWyAxIF1cbiAgfSApO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwiR293cm9jayAtIGJsb29tXCIsIHtcbiAgICBpbnB1dDogZnJhbWVidWZmZXJQcmVEb2YudGV4dHVyZSxcbiAgfSApO1xuICBnbENhdFBhdGgucmVuZGVyKCBcImJsb29tRmluYWxpemVcIiwge1xuICAgIGRyeTogZ2xDYXRQYXRoLmZiKCBcImRvZlwiICkudGV4dHVyZSxcbiAgICB3ZXQ6IGdsQ2F0UGF0aC5mYiggXCJHb3dyb2NrIC0gYmxvb21cIiApLnRleHR1cmVcbiAgfSApO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwi44GK44Gf44GP44Gv44GZ44GQ44Od44K544OI44Ko44OV44Kn44Kv44OI44KS5oy/44GZXCIsIHtcbiAgICBpbnB1dDogZ2xDYXRQYXRoLmZiKCBcImJsb29tRmluYWxpemVcIiApLnRleHR1cmVcbiAgfSApO1xuXG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwibW9uaXRvclwiLCB7XG4gICAgdGFyZ2V0OiBnbENhdFBhdGguZmIoIFwi44GK44Gf44GP44Gv44GZ44GQ44Od44K544OI44Ko44OV44Kn44Kv44OI44KS5oy/44GZXCIgKVxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJtb3Rpb25cIiwge1xuICAgIGlucHV0OiBnbENhdFBhdGguZmIoIFwi44GK44Gf44GP44Gv44GZ44GQ44Od44K544OI44Ko44OV44Kn44Kv44OI44KS5oy/44GZXCIgKS50ZXh0dXJlLFxuICAgIHByZXY6IGZyYW1lYnVmZmVyTW90aW9uUHJldi50ZXh0dXJlXG4gIH0gKTtcbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJtb3Rpb25TZWxcIiwge1xuICAgIGRyeTogZ2xDYXRQYXRoLmZiKCBcIuOBiuOBn+OBj+OBr+OBmeOBkOODneOCueODiOOCqOODleOCp+OCr+ODiOOCkuaMv+OBmVwiICkudGV4dHVyZSxcbiAgICBtb3NoOiBmcmFtZWJ1ZmZlck1vdGlvbk1vc2gudGV4dHVyZVxuICB9ICk7XG4gIGdsQ2F0UGF0aC5yZW5kZXIoIFwicmV0dXJuXCIsIHtcbiAgICB0YXJnZXQ6IGZyYW1lYnVmZmVyTW90aW9uTW9zaCxcbiAgICBpbnB1dDogZ2xDYXRQYXRoLmZiKCBcIm1vdGlvblNlbFwiICkudGV4dHVyZSxcbiAgICB3aWR0aDogd2lkdGgsXG4gICAgaGVpZ2h0OiBoZWlnaHRcbiAgfSApO1xuICBnbENhdFBhdGgucmVuZGVyKCBcInJldHVyblwiLCB7XG4gICAgdGFyZ2V0OiBnbENhdFBhdGgubnVsbEZiLFxuICAgIGlucHV0OiBnbENhdFBhdGguZmIoIFwibW90aW9uU2VsXCIgKS50ZXh0dXJlLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLnJlbmRlciggXCJyZXR1cm5cIiwge1xuICAgIHRhcmdldDogZnJhbWVidWZmZXJNb3Rpb25QcmV2LFxuICAgIGlucHV0OiBnbENhdFBhdGguZmIoIFwi44GK44Gf44GP44Gv44GZ44GQ44Od44K544OI44Ko44OV44Kn44Kv44OI44KS5oy/44GZXCIgKS50ZXh0dXJlLFxuICAgIHdpZHRoOiB3aWR0aCxcbiAgICBoZWlnaHQ6IGhlaWdodFxuICB9ICk7XG5cbiAgZ2xDYXRQYXRoLmVuZCgpO1xuXG4gIGluaXQgPSBmYWxzZTtcblxuICBpZiAoIHR3ZWFrLmNoZWNrYm94KCAnc2F2ZScsIHsgdmFsdWU6IGZhbHNlIH0gKSApIHtcbiAgICBzYXZlRnJhbWUoKTtcbiAgfVxuICBcbiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCB1cGRhdGUgKTtcbn07XG5cbi8vIC0tLS0tLVxuXG5zdGVwKCB7XG4gIDA6ICggZG9uZSApID0+IHtcbiAgICB1cGRhdGUoKTtcbiAgfVxufSApO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lciggJ2tleWRvd24nLCAoIF9lICkgPT4ge1xuICBpZiAoIF9lLndoaWNoID09PSAyNyApIHtcbiAgICB0d2Vhay5jaGVja2JveCggJ3BsYXknLCB7IHNldDogZmFsc2UgfSApO1xuICB9XG59ICk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCAnbW91c2Vtb3ZlJywgZXZlbnQgPT4ge1xuICBtb3VzZVggPSBldmVudC5jbGllbnRYO1xuICBtb3VzZVkgPSBldmVudC5jbGllbnRZO1xufSApOyIsImxldCBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCAnY2FudmFzJyApO1xyXG5sZXQgY2FudmFzU2l6ZSA9IDEwMjQ7XHJcbmNhbnZhcy53aWR0aCA9IGNhbnZhc1NpemU7XHJcbmNhbnZhcy5oZWlnaHQgPSBjYW52YXNTaXplO1xyXG5cclxubGV0IGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dCggJzJkJyApO1xyXG5jb250ZXh0LnRleHRBbGlnbiA9ICdjZW50ZXInO1xyXG5jb250ZXh0LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xyXG5jb250ZXh0LmZvbnQgPSAnOTAwICcgKyBjYW52YXNTaXplIC8gMjAuMCArICdweCBUaW1lcyBOZXcgUm9tYW4nO1xyXG5cclxuY29udGV4dC5maWxsU3R5bGUgPSAnIzAwMCc7XHJcbmNvbnRleHQuZmlsbFJlY3QoIDAsIDAsIGNhbnZhc1NpemUsIGNhbnZhc1NpemUgKTtcclxuXHJcbmNvbnRleHQuZmlsbFN0eWxlID0gJyNmZmYnO1xyXG5jb250ZXh0LmZpbGxUZXh0KFxyXG4gIFwiUiAgRSAgQyAgTyAgViAgRSAgUiAgSSAgTiAgR1wiLFxyXG4gIGNhbnZhc1NpemUgLyAyLFxyXG4gIGNhbnZhc1NpemUgLyAyXHJcbik7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjYW52YXM7XHJcbiIsImxldCBvY3RhaGVkcm9uID0gKCBfZGl2ICkgPT4ge1xuICBsZXQgcG9zID0gW107XG4gIGxldCBub3IgPSBbXTtcblxuICBmb3IgKCBsZXQgaWkgPSAwOyBpaSA8IDI7IGlpICsrICkge1xuICAgIGZvciAoIGxldCBpcSA9IDA7IGlxIDwgNDsgaXEgKysgKSB7XG4gICAgICBmb3IgKCBsZXQgaXkgPSAwOyBpeSA8IF9kaXYgKyAxOyBpeSArKyApIHtcbiAgICAgICAgZm9yICggbGV0IGl4ID0gMDsgaXggPCBpeSArIDE7IGl4ICsrICkge1xuICAgICAgICAgIGxldCBsYXQwID0gKCBpaSAqIDIuMCArIGl5IC8gKCBfZGl2ICsgMSApICkgKiBNYXRoLlBJIC8gMi4wO1xuICAgICAgICAgIGxldCBsYXQxID0gKCBpaSAqIDIuMCArICggaXkgKyAxICkgLyAoIF9kaXYgKyAxICkgKSAqIE1hdGguUEkgLyAyLjA7XG5cbiAgICAgICAgICBsZXQgbG9uMCA9ICggaWkgKiAyLjAgLSAxLjAgKSAqICggKCBpeCAtIDEgKSAvIE1hdGgubWF4KCAxLCBpeSApICsgaXEgKSAqIE1hdGguUEkgLyAyLjA7XG4gICAgICAgICAgbGV0IGxvbjEgPSAoIGlpICogMi4wIC0gMS4wICkgKiAoIGl4IC8gKCBpeSArIDEgKSArIGlxICkgKiBNYXRoLlBJIC8gMi4wO1xuICAgICAgICAgIGxldCBsb24yID0gKCBpaSAqIDIuMCAtIDEuMCApICogKCBpeCAvIE1hdGgubWF4KCAxLCBpeSApICsgaXEgKSAqIE1hdGguUEkgLyAyLjA7XG4gICAgICAgICAgbGV0IGxvbjMgPSAoIGlpICogMi4wIC0gMS4wICkgKiAoICggaXggKyAxICkgLyAoIGl5ICsgMSApICsgaXEgKSAqIE1hdGguUEkgLyAyLjA7XG5cbiAgICAgICAgICBpZiAoIGl4ICE9PSAwICkge1xuICAgICAgICAgICAgbGV0IHgxID0gTWF0aC5zaW4oIGxhdDAgKSAqIE1hdGguY29zKCBsb24wICk7IHBvcy5wdXNoKCB4MSApO1xuICAgICAgICAgICAgbGV0IHkxID0gTWF0aC5jb3MoIGxhdDAgKTsgcG9zLnB1c2goIHkxICk7XG4gICAgICAgICAgICBsZXQgejEgPSBNYXRoLnNpbiggbGF0MCApICogTWF0aC5zaW4oIGxvbjAgKTsgcG9zLnB1c2goIHoxICk7XG4gICAgICAgICAgICBwb3MucHVzaCggMS4wICk7XG5cbiAgICAgICAgICAgIGxldCB4MiA9IE1hdGguc2luKCBsYXQxICkgKiBNYXRoLmNvcyggbG9uMSApOyBwb3MucHVzaCggeDIgKTtcbiAgICAgICAgICAgIGxldCB5MiA9IE1hdGguY29zKCBsYXQxICk7IHBvcy5wdXNoKCB5MiApO1xuICAgICAgICAgICAgbGV0IHoyID0gTWF0aC5zaW4oIGxhdDEgKSAqIE1hdGguc2luKCBsb24xICk7IHBvcy5wdXNoKCB6MiApO1xuICAgICAgICAgICAgcG9zLnB1c2goIDEuMCApO1xuXG4gICAgICAgICAgICBsZXQgeDMgPSBNYXRoLnNpbiggbGF0MCApICogTWF0aC5jb3MoIGxvbjIgKTsgcG9zLnB1c2goIHgzICk7XG4gICAgICAgICAgICBsZXQgeTMgPSBNYXRoLmNvcyggbGF0MCApOyBwb3MucHVzaCggeTMgKTtcbiAgICAgICAgICAgIGxldCB6MyA9IE1hdGguc2luKCBsYXQwICkgKiBNYXRoLnNpbiggbG9uMiApOyBwb3MucHVzaCggejMgKTtcbiAgICAgICAgICAgIHBvcy5wdXNoKCAxLjAgKTtcblxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBsZXQgeCA9IHgxICsgeDIgKyB4MztcbiAgICAgICAgICAgICAgbGV0IHkgPSB5MSArIHkyICsgeTM7XG4gICAgICAgICAgICAgIGxldCB6ID0gejEgKyB6MiArIHozO1xuICAgICAgICAgICAgICBsZXQgbCA9IE1hdGguc3FydCggeCAqIHggKyB5ICogeSArIHogKiB6ICk7XG5cbiAgICAgICAgICAgICAgZm9yICggbGV0IGkgPSAwOyBpIDwgMzsgaSArKyApIHtcbiAgICAgICAgICAgICAgICBub3IucHVzaCggeCAvIGwgKTtcbiAgICAgICAgICAgICAgICBub3IucHVzaCggeSAvIGwgKTtcbiAgICAgICAgICAgICAgICBub3IucHVzaCggeiAvIGwgKTtcbiAgICAgICAgICAgICAgICBub3IucHVzaCggMS4wICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICB7XG4gICAgICAgICAgICBsZXQgeDEgPSBNYXRoLnNpbiggbGF0MCApICogTWF0aC5jb3MoIGxvbjIgKTsgcG9zLnB1c2goIHgxICk7XG4gICAgICAgICAgICBsZXQgeTEgPSBNYXRoLmNvcyggbGF0MCApOyBwb3MucHVzaCggeTEgKTtcbiAgICAgICAgICAgIGxldCB6MSA9IE1hdGguc2luKCBsYXQwICkgKiBNYXRoLnNpbiggbG9uMiApOyBwb3MucHVzaCggejEgKTtcbiAgICAgICAgICAgIHBvcy5wdXNoKCAxLjAgKTtcblxuICAgICAgICAgICAgbGV0IHgyID0gTWF0aC5zaW4oIGxhdDEgKSAqIE1hdGguY29zKCBsb24xICk7IHBvcy5wdXNoKCB4MiApO1xuICAgICAgICAgICAgbGV0IHkyID0gTWF0aC5jb3MoIGxhdDEgKTsgcG9zLnB1c2goIHkyICk7XG4gICAgICAgICAgICBsZXQgejIgPSBNYXRoLnNpbiggbGF0MSApICogTWF0aC5zaW4oIGxvbjEgKTsgcG9zLnB1c2goIHoyICk7XG4gICAgICAgICAgICBwb3MucHVzaCggMS4wICk7XG5cbiAgICAgICAgICAgIGxldCB4MyA9IE1hdGguc2luKCBsYXQxICkgKiBNYXRoLmNvcyggbG9uMyApOyBwb3MucHVzaCggeDMgKTtcbiAgICAgICAgICAgIGxldCB5MyA9IE1hdGguY29zKCBsYXQxICk7IHBvcy5wdXNoKCB5MyApO1xuICAgICAgICAgICAgbGV0IHozID0gTWF0aC5zaW4oIGxhdDEgKSAqIE1hdGguc2luKCBsb24zICk7IHBvcy5wdXNoKCB6MyApO1xuICAgICAgICAgICAgcG9zLnB1c2goIDEuMCApO1xuXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGxldCB4ID0geDEgKyB4MiArIHgzO1xuICAgICAgICAgICAgICBsZXQgeSA9IHkxICsgeTIgKyB5MztcbiAgICAgICAgICAgICAgbGV0IHogPSB6MSArIHoyICsgejM7XG4gICAgICAgICAgICAgIGxldCBsID0gTWF0aC5zcXJ0KCB4ICogeCArIHkgKiB5ICsgeiAqIHogKTtcblxuICAgICAgICAgICAgICBmb3IgKCBsZXQgaSA9IDA7IGkgPCAzOyBpICsrICkge1xuICAgICAgICAgICAgICAgIG5vci5wdXNoKCB4IC8gbCApO1xuICAgICAgICAgICAgICAgIG5vci5wdXNoKCB5IC8gbCApO1xuICAgICAgICAgICAgICAgIG5vci5wdXNoKCB6IC8gbCApO1xuICAgICAgICAgICAgICAgIG5vci5wdXNoKCAxLjAgKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgcG9zOiBwb3MsXG4gICAgbm9yOiBub3JcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IG9jdGFoZWRyb247Il19
