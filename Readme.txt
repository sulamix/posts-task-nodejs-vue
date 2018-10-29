install:
npm
mysql:
sudo apt-get update
sudo apt-get install mysql-server (use 'root' as the user name and '123456' as password)

Open mysql terminal to create the database:
/usr/bin/mysql -u root -p
use 'elad_kimaia_dev' for the database name

* Note: You can change the app default DB configuration in /db/config.json at 'development' section

# some useful mysql console commands :
UPDATE mysql.user SET Password = PASSWORD('123456') WHERE User = 'root';
CREATE DATABASE `elad_kimaia_dev` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;
CREATE SCHEMA `elad_kimaia_dev` DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci ;

To run the app:
npm install
npm run build
nmp start

Navigate to http://localhost:4000
