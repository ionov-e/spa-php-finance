# Simple SPA
## Description

**Specifics**:
- Simple SPA page
- Front is written in Vanilla JS. Styled using Tailwind CSS
- Backend is run in Docker container (Nginx, PHP with no frameworks, MySQL)
- Operations list (income/expense) with last 10 entities
- Possibility to create new operation
- Possibility to view/delete specific operation
- For unauthorized users access is restricted except for login and register
- Some basic security safeguards (SQL injections, etc)
- Database is prefilled with some operations and test user for instant usage

**Back-end**: 
- PHP 8.1 (no frameworks)
- MySQL 8
- Nginx
- Docker

**Front-end**:
- Vanilla JavaScript
- All HTML is generated only by JS - no pre-written HTML whatsoever
- Tailwind CSS

## Setup process
1. Create a folder we want to use for this project
2. Enter inside created folder using terminal
3. Clone the project into the chosen folder with:
   ```sh
   git clone git@github.com:ionov-e/spa-php-finance.git .
   ```
4. Builds and runs containers
   ```sh
   docker compose up -d
   ```
5. Allow for Monolog library to make log files
   ```sh
   chmod 777 logs/
   ```
6. Enters PHP container CLI
   ```sh
   docker run -it spa-php-finance-php-fpm-1 bash
   ```
7. In the opened PHP container CLI run this to install libraries (you can exit this CLI after successful run)
   ```sh
   composer install
   ```
8. Visit http://localhost:55000/finance.php
9. You can log in with **test** both as login and password. Or register a new user
10. When you end - don't forget to stop Docker containers with command:
    ```sh
    docker compose stop
    ```

### DB connection:
* **Host**: localhost
* **Port**: 55002
* **User** & **password**: user

## Appearance

![login](docs/images/001.png)
![register](docs/images/002.png)
![list](docs/images/010.png)
![new_form](docs/images/011-.png)
![single](docs/images/012.png)