/**
 * @module urlParse
 * @memberof core-lux
 */

// FIXME: this module is probably a bad idea long-term but for the short-term
// it'll have to be Ok.

function queryToObject(search) {

  return search
    ? search
      .split('&')
      .reduce(queryToObjectReduce, {})
    : {};
}

function queryToObjectReduce(acc, p) {
  const [key, val] = p.split('=');

  acc[key] = /,/.test(val)
    ? val.split(',').map(toValue)
    : toValue(val);

  return acc;
}

function toValue(valueInQuestion) {
  switch (true) {
    case valueInQuestion === 'false':
      return false;
    case valueInQuestion === 'true':
      return true;
    default:
      return valueInQuestion;
  }
}

/**
 * Parse the parts of a URL into an object for use.
 *
 * @param  {string} str - The URL to parse.
 *
 * @return {object} - The parsed URL represented as an object conforming to the
 * diagram in the description; and from https://nodejs.org/dist/latest-v7.x/docs/api/url.html
 * (Source).
 *
 * @description
 * ```
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │                                  href                                     │
 * ├──────────┬┬─────────┬─────────────────┬───────────────────────────┬───────┤
 * │ protocol ││  auth   │      host       │           path            │ hash  │
 * │          ││         ├──────────┬──────┼──────────┬────────────────┤       │
 * │          ││         │ hostname │ port │ pathname │     search     │       │
 * │          ││         │          │      │          ├─┬──────────────┤       │
 * │          ││         │          │      │          │ │    query     │       │
 * "  http:   // usr:pwd @ host.com : 8080   /p/a/t/h  ?  query=string   #hash "
 * │          ││         │          │      │          │ │              │       │
 * └──────────┴┴─────────┴──────────┴──────┴──────────┴─┴──────────────┴───────┘
 * (all spaces in the "" are purely for formatting)
 * ```
 */
function urlParse(url) {
  const firstGroup = result => (result && result[1] ? result[1] : '');

  const str = `${url}`;

  const auth = firstGroup(str.match(/\/\/([^@]*?)@/));
  const hash = firstGroup(str.match(/(#.*)?$/));
  const protocol = firstGroup(str.match(/^([^:]+:)/));

  const hostAndPath = str
    .replace(RegExp(`^${protocol}//${auth}${auth ? '@' : ''}`), '')
    .replace(hash, '');

  const host = firstGroup(hostAndPath.match(/(.*?)(?:[?/#]|$)/));
  const path = hostAndPath.replace(host, '');

  const [pathname, query = ''] = path.split('?');
  const [hostname, port = ''] = host.split(':');

  const param = queryToObject(query);

  return {
    auth,
    hash,
    host,
    hostname,
    param,
    path,
    pathname,
    port,
    protocol,
    query,
    search: query ? `?${query}` : '',
  };
}

export default urlParse;
