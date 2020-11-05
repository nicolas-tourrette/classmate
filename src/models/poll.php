<?php

require_once __DIR__.'/appointment.php';

class Poll {
    private string $id;
    private string $name;
    private bool $active;
    private array $appointments;

    public function getId(): string { return $this->id; }

    public function getName(): string { return $this->name; }
    public function setName(string $name) { $this->name = $name; }

    public function getActive(): bool { return $this->active; }
    public function setActive(bool $active) { $this->active = $active; }

    public function getAppointments(): array { return $this->appointments; }
    public function setAppointments(array $appointments) { $this->appointments = $appointments; }

    public function __construct(array $data = null){
        $this->id = "";
        $this->name = "";
        $this->active = true;
        $this->appointments = array();

        $this->fromArray($data);
    }

    public function fromArray(?array $data){
        if($data){
            $this->id = isset($data["ID"]) ? $data["ID"] : $this->id;
            $this->name = isset($data["NAME"]) ? $data["NAME"] : $this->name;
            $this->active = isset($data["ACTIVE"]) ? $data["ACTIVE"] : $this->active;
            $this->appointments = isset($data["appointments"]) ? $data["appointments"] : $this->appointments;
        }
    }

    public function toArray(): array {
        return array(
            'id' => $this->id,
            'name' => $this->name,
            'active' => $this->active,
            'appointments' => $this->appointments 
        );
    }
}