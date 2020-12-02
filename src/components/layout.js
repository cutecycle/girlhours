import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import logo from "../img/skyprint.svg"

let divstyle = {
    width: "1em",
    "font-family": "Cabin",
    "padding-right": "0.2em"
}
let grandstyle = {
    "font-family": "Cabin",
    width: "100%"
}
export default ({ children }) = <div>
    <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cabin:wght@500&display=swap" rel="stylesheet" />
    </head>
    <div>
        <h1>
            <img src={logo} style={divstyle} />
            nina reynolds
        </h1>
    </div>
    {children}
</div>
