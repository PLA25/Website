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
Open your terminal in the Website/Source folder (or use the terminal you just used) and run the following command.
```sh
$ npm start
```
Wait for the server to start and visit localhost:3000 or YOUR_DOMAIN_OR_IP:3000 in your webbrowser.
Fill in all the information on the page and press the SAVE CONFIG button.
Your Planet key can be found on the planet.com website, for more information about how to find your API key [click here](https://support.planet.com/hc/en-us/articles/212318178-What-is-my-API-key-)

Now wait for the server to reboot and press the Click Me! button.

### Step 3: Configure the database
This will happen automatically when you start-up the system for the first time.

Yep, it's that easy!
If you ever lose access to the system, just delete the config document from the database and the default users will be back in the system.

### Step 4: Starting the system
In the webbrowser login using the credentials.

| Username | Password | about |
| ------ | ------ | ------ |
| admin | admin | This is the admin account! |
| user | user | This is the default user. |

### Step 5: Security
Change the admin and user Password in the My Account panel!

## Development
This project in maintained by the following awesome people:
- [mvegter](https://github.com/mvegter)
- [Snidjers](https://github.com/Snidjers)
- [JoeyBlankendaal](https://github.com/JoeyBlankendaal)
- [Briadark](https://github.com/Briadark)
- [ThomAat2](https://github.com/ThomAat2)
- [rico-snoek](https://github.com/rico-snoek)
