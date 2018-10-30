install:
npm
mysql:
sudo apt-get update
sudo apt-get install mysql-server (use 'root' as the user name and '123456' as password)

Open mysql terminal to create the database:
/usr/bin/mysql -u root -p
use 'elad_kimaia_dev' for the database name

To run the app:
npm install
npm run build
nmp start

Navigate to http://localhost:4000
