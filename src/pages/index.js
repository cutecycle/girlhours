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
            <p><a href="https://hachyderm.io/@cutecycle" rel="me">@cutecycle</a></p>
            <p><a href="https://github.com/cutecycle">cutecycle</a></p>
            <h2>wip</h2>
            <ul>
                
                <li>SPIA-23f1a02835c14a9e6e0c6053ff3c73392ed92f46de195e634e9020236ca828e4  </li>
            <li>SPIA-baee898713c2b5731241155befa3b0319cbcd09b53dfb6632e3aa9afd51c50f2</li>
               
            </ul>
            <h2>now playing</h2>
            <ul>
                <li>disgaea 7</li>
                <li>touhou lotus labyrinth R</li>
                <li>yggdra union</li>
                <li>phantom brave 2</li>
    <li>bright blades</li>
      
            </ul>
        </div>
    </html>
