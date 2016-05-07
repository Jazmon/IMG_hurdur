# IMG_hurdur

## How to test the app
### Setup web server and enviroment locally
* install mongodb
* install node version >=6
* clone repo `git clone git@github.com:Jazmon/IMG_hurdur.git && cd $_`
* if data folder is not present in the project folder, create one
* start mongodb locally `mongod --dbpath "./data"`
* in a different terminal start `nodemon`

### Setup data to webserver
* create account `curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -d 'email=foo@bar.com&password=foobar' "http://localhost:8000/auth/signup"`
* navigate to `http://localhost:8000/` in a browser and login with created credentials
* navigate to `http://localhost:8000/form` in a browser and send picture(s)


### Set app urls in android project
* find each `192.168.0.100` and replace with your own ip
* build & run
* easy and simple. /s 
