<?php
//used to load our env variables 
// install Composer from  https://getcomposer.org/download/
// note: please run: ' composer require vlucas/phpdotenv ' in terminal
// article referenced: https://udoyhasan.medium.com/what-is-an-env-file-and-how-to-use-an-env-file-in-php-4e146358cca6

require_once __DIR__.'/vendor/autoload.php';

use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);

$dotenv->load();

// only include in the config.php 
