# Pollution Detection System
PDS is a Open Source, mobile-ready Pollution Detection System which uses the Planet.com API.

## How to install

### Step 1: Clone the repository and install the dependencies
Step 1 can be done in two different ways.

Method 1:
```sh
$ git clone https://github.com/PLA25/Website.git
$ cd Website/Source
$ npm install
```

Method 2:
Download the zip file from [here](https://github.com/PLA25/Website/archive/master.zip), extract the files and open the folder Website-master/Source.
Open your terminal on the location of the folder.
```sh
$ npm install
```

### Step 2: Configure the system
In the repository you just cloned, make sure you are in the Website/Source folder and edit the config.js.example file.
After you have filled in the information save the file as config.js in the same folder.
Your Planet key can be found on the planet.com website, for more information about how to find your API key [click here](https://support.planet.com/hc/en-us/articles/212318178-What-is-my-API-key-)

### Step 3: Configure the database
TO DO!
This step will be included in an upcoming release.

### Step 4: Starting the system
Yet again, make sure that you are in the Website/Source folder and execute the following command:
```sh
$ npm start
```
Navigate to http://localhost:3000 and login using the credentials.

| Username | Password | about |
| ------ | ------ | ------ |
| admin | admin | This is the admin account! |
| user | user | This is the default user. |

### Step 5: Security
Change the admin and user Password in the admin panel!

## Development
This project in maintained by the following awesome people:
- [mvegter](https://github.com/mvegter)
- [Snidjers](https://github.com/Snidjers)
- [JoeyBlankendaal](https://github.com/JoeyBlankendaal)
- [Briadark](https://github.com/Briadark)
- [ThomAat2](https://github.com/ThomAat2)
- [rico-snoek](https://github.com/rico-snoek)
