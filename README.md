To setup project: 

`git clone git@github.com:wichopy/React-Codenames.git`

`cd React-Codenames`

`npm install; cd server; npm install`

The client app is written in React/Apollo and can be run in the root folder. 
The server runs on Express/GraphQL and is run in the `/server` folder.
JWT is used for auth, so make sure you rename the `.env_sample` file to `.env` and make up your own secret.
May need to globally install nodemon and babel-cli (not node-babel) with `npm install -g nodemon babel-cli`.

To run the client and server, run `npm start` in:
  - one terminal window in the root folder (./) of this repo:
  - another terminal window in the server folder (./server) of this repo:
