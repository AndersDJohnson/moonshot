# moonshot
Screenshots of web with Selenium.

Just specify a list websites to capture, and at which window resolutions for each. Full-page screenshots are supported.

Etymology: Moonshot uses [Selenium] to take screen***shot***s. The eponymous word *selenium* comes from the Greek *selēnē* (*σελήνη*) meaning *moon*. Hence  *moonshot*, a word which also means a project proposing a radical solution to a huge problem using breakthrough technology.<sup>[1](http://whatis.techtarget.com/definition/moonshot)</sup>

There are many tools based purely on [PhantomJS] ([html2png][], [pageres][]), which unfortunately hasn't been great at rendering web fonts.
By using Selenium, we can get screenshots from any supported browser that look exactly as they would appear to real users.

## Install

```sh
npm i --save moonshot
```

## Use

```js
var moonshot = require('moonshot');
moonshot([
 ['google.com', [
   // a couple of ways to specify resolutions:
   [1280,800], '800x600', /* width only */ '320', {width: 1024, height: 768}
 ]],
 ['andrz.me', [ /* ... */ ] ]
]);
```

[selenium]: http://www.seleniumhq.org/
[phantomjs]: http://phantomjs.org/
[pageres]: https://github.com/sindresorhus/pageres
[html2png]: https://github.com/eugeneware/html2png
