<?php

class ConfigLoader{
    private string $env;
    private array $config;

    public function __construct(){
        // Env = [dev | test | prod]
        $this->env = "dev";
        $this->config = array();

        $this->config = $this->loadConfig($this->env.".env.json");
    }

    private function loadConfig(string $configFilePath): array {
        $configFile = file_get_contents($configFilePath, true);
        return json_decode($configFile, true);
    }

    public function getDatabaseConfig(): array {
        return $this->config["database"];
    }

    public function getAuthConfig(): array {
        return $this->config["authentication"];
    }

    public function getMailerConfig(): array {
        return $this->config["mailer"];
    }
}