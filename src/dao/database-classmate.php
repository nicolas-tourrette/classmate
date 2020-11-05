<?php

require_once __DIR__.'/database.php';

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
        parent::__construct('localhost', 'classmate', 'username', 'password');
		parent::connect();
	}

    public static function getInstance()
    {
        if(is_null(self::$handle))
            self::$handle = new DatabaseSite();

        return self::$handle;
    }
}