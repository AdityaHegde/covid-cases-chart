import "./styles.less";

import * as React from "react";
import * as ReactDOM from "react-dom";
import { App } from "./App";

const div = document.createElement("div");
document.body.appendChild(div);

ReactDOM.render(
  <App />, div,
);
