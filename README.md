# SPA test project
## Description

Specifics:
- Simple SPA page using Vanilla JS, database and PHP with no frameworks
- Operations list (income/expense) with last 10 entities
- Possibility to create new operation
- Possibility to view/delete specific operation
- Access to functions only for authorized users

Back-end: 
- PHP 8.1 (no frameworks)
- MySQL 8
- Docker

Front-end:
- Vanilla JavaScript
- Tailwind CSS

## Setup process
1. Create and enter the folder we want to use for this project
2. Clone the project into the folder with:
    
    `git clone git@github.com:ionov-e/spa-php-finance.git .`
3. Copy and rename copy of **.env.example** to **.end**
4. `composer install`
5. `docker compose up -d`
6. `chmod 775 logs/`
7. `sudo chown :www-data logs`
8. Visit http://localhost:55000/finance.php
9. You can login with **test** both as login and password. Or register a new user

