import "./idea-inbox";
import "./memo-input-widget";
import "./memo-output-widget";

// Material Icon Load.
// This should be done in shadow DOM (idea-inbox-widget), but not work.
// This method is copy of [mwc-icon][mwcicon_ref]
// [mwcicon_ref]:https://github.com/material-components/material-components-web-components/blob/master/packages/icon/src/mwc-icon-font.ts
const fontEl = document.createElement("link");
fontEl.rel = "stylesheet";
fontEl.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
document.head!.appendChild(fontEl);
