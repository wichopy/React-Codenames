Express uses ES6, need babel-node in order to run:
    `npm install -g babel-cli`

If subscriptions aren't working, there was a breaking change in graphql ^0.11.1
Using 0.10.5 fixed the problem.

Run cp .env_sample .env after cloning the repo.
