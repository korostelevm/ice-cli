# ice cli
Micro application framework for serverless full stack applications on AWS.


## Quick Start

```shell
npm i @coldlambda/ice-cli -g
ice
```

## Project Structure
- frontend
- backend
- local dev environment
- deployment

### Javascript
```bash
.
├── README.md
├── api.yaml
├── app.local.js
├── deploy.sh
├── package.json 
├── service 
│   ├── app.js
│   ├── models
│   │   ├── models.js
│   │   └── users.js
│   ├── package.json
│   ├── public
│   └── service.js
├── template-api.yaml
├── template-static-infra.yaml
├── template-version-pointer.yaml
└── vue
    ├── babel.config.js
    ├── package.json
    ├── public
    │   └── index.html
    ├── src
    │   ├── App.vue
    │   ├── components
    │   │   ├── Menu.vue
    │   │   └── _globals.js
    │   └── main.js
    ├── vue.config.js
    └── webpack.config.js
```

### Ruby
```bash

.
├── api.yaml
├── deploy.sh
├── service
│   ├── Gemfile
│   └── service.rb
├── template-api.yaml
├── template-static-infra.yaml
├── template-version-pointer.yaml
└── vue
    ├── babel.config.js
    ├── package.json
    ├── public
    │   └── index.html
    ├── src
    │   ├── App.vue
    │   ├── components
    │   │   ├── Menu.vue
    │   │   └── _globals.js
    │   └── main.js
    ├── vue.config.js
    └── webpack.config.js
```