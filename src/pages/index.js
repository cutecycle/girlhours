import React from "react"
import Header from "../components/layout"
import logo from "../img/skyprint.svg"
let grandstyle = {
    "font-family": "Cabin",
    width: "100%"
}
let divstyle = {

    width: "1em",
    "font-family": "Cabin",
    "padding-right": "0.2em"
}
export default () =>
    <html>
        <head style={grandstyle}>
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link href="https://fonts.googleapis.com/css2?family=Cabin:wght@400&display=swap" rel="stylesheet" />

        </head>
        <h1 style={grandstyle}>
            <img src={logo} style={divstyle} />
            nina reynolds
        </h1>


        <div style={grandstyle}>
            <p>creator</p>
            <p><a href="https://twitter.com/_cutecycle">@_cutecycle</a></p>
            <p><a href="https://github.com/cutecycle">cutecycle</a></p>
            <h2>goals</h2>
            <ul>
                <li>SPIA-1 (game: c++ + unreal 4 + mlpack + jupyter)</li>
               
            </ul>
            <h2>now playing</h2>
            <ul>
                <li>crypt of the necrodancer</li>
                <li>atelier: mysterious dx</li>
<li>guilty gear xrd</li>
<li>tales of Symphonia</li>
      
            </ul>
        </div>
    </html>
