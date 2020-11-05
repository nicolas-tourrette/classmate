<?php

require_once __DIR__.'/database.php';
require_once __DIR__.'/../../config/parser.php';

/**
 * Database connector
 */
class DatabaseSite extends DataBase
{
    private static $handle = null;
	/**
	 * Constructeur
	 */
	protected function __construct()
	{
        $parser = new ConfigLoader();
        parent::__construct('localhost', 'classmate', $parser->getDatabaseConfig()["username"], $parser->getDatabaseConfig()["password"]);
		parent::connect();
	}

    public static function getInstance()
    {
        if(is_null(self::$handle))
            self::$handle = new DatabaseSite();

        return self::$handle;
    }
}