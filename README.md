# moonshot
Screenshots of web with Selenium.

Just specify a list websites to capture, and at which window resolutions for each. Full-page screenshots are supported.

Etymology: *Selenium* comes from the Greek *selēnē* (*σελήνη*) meaning *moon*. We take *shot*s of screens. Hence, *moon*-*shot*, or *moonshot*. 

There are many tools based purely on [PhantomJS], which unfortunately hasn't been great at rendering web fonts.
By using Selenium, we can get screenshots from any supported browser that look exactly as they would appear to real users.

## Install

```sh
npm i --save moonshot
```

## Use

```
var moonshot = require('moonshot');
moonshot([
 ['google.com', [[1280,800],[1024,768],[800,600],[320,480]]],
 ['andrz.me', [[1280,800],[1024,768],[800,600],[320,480]]]
]);
```

[phantomjs]: http://phantomjs.org/
