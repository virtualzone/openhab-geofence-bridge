# openHAB Geofence Bridge
This is a small HTTP server written in JavaScript/NodeJS which acts as a bridge between Geofence applications (such as Geofency or Geofancy for iOS) and your openHAB installation.

* Trigger a switch item when entering/leaving your geofence area
* Check the status of your Basic UI

## Installation
Run the following commands:
```
git clone ...
cd openhab-geofence-bridge
npm install
npm start
```

## Configuration
Create a file named ```config.json``` like this:

```
{
    "host": "192.168.178.20",
    "protocol": "https",
    "port": 443,
    "path": "/",
    "auth": "username:password",
    "item": "PresenceItem",
    "statusCheckString": "Some String to Check for",
    "bridgePort": 8080
}
```

## URLs
* /enter (POST) = Set ```item``` to ON
* /exit (POST) = Set ```item``` to OFF
* /status (GET) = Check if ```statusCheckString``` is present in Basic UI

## Docker container
You can use the following command to start up a docker container, mount your config file and expose port 8080:

```
docker run \
    -p 8080:8080 \
    -v "$PWD/config.json:/usr/src/app/config.json" \
    virtualzone/openhab-geofence-bridge
```
