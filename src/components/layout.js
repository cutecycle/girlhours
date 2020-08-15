import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import logo from "../img/skyprint.svg"

let divstyle = {
    width: "1em",
    "padding-right": "0.2em"
}
let grandstyle = {
    "font-family": "Cabin",
    width: "100%"
}
export default ({ children }) => <div style={grandstyle}>
    <link href="https://fonts.googleapis.com/css?family=Cabin&display=swap" rel="stylesheet" rel="preload" as="style"/> 
    <div>
        <h1>
            <img src={logo} style={divstyle}/>
            girlhours.info
        </h1>
    </div>
    {children}
</div>
