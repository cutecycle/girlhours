import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import logo from "../img/skyprint.svg"


export default ({ children }) => <div>
    <div><img src={ logo }/><h1>girlhours.info</h1></div>
    {children}
</div>
