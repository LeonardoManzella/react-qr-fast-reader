# react-qr-fast-reader
Faster qr reader implementation library than react-qr-reader using jsQR to decode images

<p align="center">
  <img al width="300" height="380" alt="Lib logo" src="./qr-reader-logo.png" style="width: 300px !important;" />
</p>

# React QR Reader [![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)](https://opensource.org/licenses/MIT) 


## Install

You can install this library via NPM or YARN.

### NPM

```bash
npm i react-qr-fast-reader
```

### YARN

```bash
yarn add react-qr-fast-reader
```

## Usage

The usage is really simple:

```javascript
import React, { useState } from 'react';
import { QrReader } from 'react-qr-fast-reader';

const Test = (props) => {
  const [data, setData] = useState('No result');

  const handleScan = (data) => {
    if (data) {
      setData(data);
    }
  };

  const handleError = (err) => console.error(err);

  return (
    <>
      <QrReader
        onScan={handleScan}
        onError={handleError}
        style={{ width: '100%' }}
      />
      <p>{data}</p>
    </>
  );
};
```

## Props

### Events

| Prop    | Argument | Description                                                                                                                                             |
| ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| onScan  | `result` | Scan event handler. Called every scan with the decoded value or `null` if no QR code was found.                                                         |
| onError | `Error`  | Called when an error occurs.                                                                                                                            |
| onLoad  | `object` | Called when the component is ready for use. Object properties are `stream`: [MediaStream](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) |

### Options

| Prop                  | Type                    | Default                  | Description                                                                                                                                                       |
| --------------------- | ----------------------- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| facingMode            | `user` or `environment` | `environment`            | Specify which camera should be used (if available).                                                                                                               |
| resolution            | number                  | `600`                    | The resolution of the video (or image in legacyMode). Larger resolution will increase the accuracy but it will also slow down the processing time.                |
| style                 | a valid React style     | none                     | Styling for the container element. **Warning** The preview will always keep its 1:1 aspect ratio.                                                                 |
| className             | string                  | none                     | ClassName for the container element.                                                                                                                              |
| showViewFinder        | boolean                 | `true`                   | Show or hide the build in view finder. See demo                                                                                                                   |
| constraints           | object                  | `null`                   | Use custom camera constraints that the override default behavior. [MediaTrackConstraints](https://developer.mozilla.org/en-US/docs/Web/API/MediaTrackConstraints) |
| debug                 | boolean                 | `null`                   | Enable debug logs to see what's going on inside the component                                                                                                     |
| viewFinderColor       | string                  | `'rgba(255, 0, 0, 0.5)'` | Change viewFinder color for SVG Path                                                                                                                              |
| viewFinderStrokeWidth | string                  | `'5'`                    | Change viewFinder width for SVG Path                                                                                                                              |

## Tested platforms

- Chrome Mac OS & Android
- Firefox Mac OS & Android
- Safari Mac OS & IOS

## Issues

Please, open an [issue](https://github.com/LeonardoManzella/react-qr-fast-reader/issues) following one of the issues templates. We will do our best to fix them.

## Contributing

If you want to contribute to this project see [contributing](https://github.com/LeonardoManzella/react-qr-fast-reader/blob/master/CONTRIBUTING.md) for more information.

## License

Distributed under the **MIT license**. See [LICENSE](https://github.com/LeonardoManzella/react-qr-fast-reader/blob/master/LICENSE) for more information.
