
## Global Dependencies

Make sure the following are installed:

* [node.js](http://nodejs.org)
* [Git](http://git-scm.com/download/)

and then run the following in the terminal:

    $ sudo npm install -g grunt-cli

## Setup

    $ Clone this repo in your local computer
    $ npm install
    $ grunt build

### Request Mapper

The extension and installation instructions are on GitHub:

https://github.com/aputinski/request-mapper

The following RegEx / URL pairs can be used in the options page of the extension

RegEx | URL
--- | ---
`.*\/resource\/.*\/your_assets\/js/` | https://localhost/js/
`.*\/resource\/.*\/your_assets\/styles/` | https://localhost/styles/
`.*\/resource\/.*\/your_assets\/templates/` | https://localhost/templates/

## SSL

In order for the Request Mapper plugin to work with force.com, the local versions must be accessed via SSL.

In the app directory, run the following commands in the terminal.

When prompted for "common name" enter `secure.yourapp.dev`

    $ mkdir ssl && cd ssl
    $ openssl genrsa -des3 -out server.key 1024
    $ openssl req -new -key server.key -out server.csr
    $ openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
    $ cp server.key server.tmp
    $ openssl rsa -in server.tmp -out server.key

Once you have created self signed certificate

    $ cd ../
    $ sudo node app.js

This will start a nodejs server on port 443 which can be accessed at [https://localhost]()

Make sure to open [https://localhost]() in Chrome and click the **"Proceed Anyway"** button

## Grunt

Running `grunt watch` will automatically build JS/CSS upon saving and refresh the first tab in Chrome Canary
