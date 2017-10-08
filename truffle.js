var DefaultBuilder = require("truffle-default-builder");

module.exports = {
 build: new DefaultBuilder({
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ]
  }),
  deploy: [
      "EthBay"
	     ],
   networks: {
	development: {
    host: "localhost",
    port: 8545,
    network_id: "*",
    from: "0xaeaab61c85b4f4838d0c3066f008d34382f40973"
  }
}
};
