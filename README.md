# M7011E

## Installation

This project has been developed with NodeJS version 10.16.0, if you use any other version, we cannot guarantee that it works correctly.

Guide on how to install NodeJS on your system can be found [here](https://nodejs.org/en/download/package-manager/).

The database used in this project is MongoDB, specifically version 4.0.3 Community.

Guide on how to install MongoDB on your system can be found [here](https://docs.mongodb.com/manual/installation/).

First, clone the repository

```
git clone https://github.com/Aundron/M7011E.git
```

Change into the `M7011E` folder

then run

```
npm install
```

then change into the `M7011E/frontend` folder and run

```
npm install
```
again.

## Configuration

In the root folder (`M7011E`), there's a `config.json` file:

```json
{
    "db_path": "",
    "session_max_age": 86400000,
    "powerplant_startup_time": 20000,
    "powerplant_max_production": 1000,
    "powerplant_buffer_cap": 5000,
    "household_buffer_cap": 200,
    "household_production_efficiency": 0.5,
    "simulator_hour_length": 10000,
    "cors_origin": "",
    "server_port": 8081
}
```

In `db_path`, fill in your path to your MongoDB database.
In `cors_origin` fill in your server address (For example, `http://localhost:3000` or `http://130.240.200.92`)

In `M7011E/frontend/src/index.js` on row 8

```javascript
axios.defaults.baseURL = 'http://localhost:8081/api/';
```

and in `/M7011E/frontend/components/image.js` on row 61:

```javascript
<img className="image" src={"http://localhost:8081/householdImages/" + this.props.source} alt={this.props.alt} />
```

This is the path to the express server, if you change `server_port` in `config.json`, you need to change that here as well.

## Running
