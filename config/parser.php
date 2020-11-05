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
        return $this->config[0]["database"];
    }

    public function getAuthConfig(): array {
        return $this->config[1]["authentication"];
    }

    public function getMailerConfig(): array {
        return $this->config[2]["mailer"];
    }
}