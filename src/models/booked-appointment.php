<?php

class BookedAppointment extends Appointment {
    private string $parentName;
    private string $parentEmail;

    public function getParentName(): string { return $this->parentName; }

    public function getParentEmail(): string { return $this->parentEmail; }

    public function __construct(array $data = null) {
        $this->parentName = "";
        $this->parentEmail = "";
        parent::__construct($data);

        $this->fromArray($data);
    }

    public function fromArray(?array $data){
        if($data){
            Appointment::fromArray($data);
            $this->parentName = isset($data['PARENT']) ? $data['PARENT'] : $this->parentName;
            $this->parentEmail = isset($data['PARENT_EMAIL']) ? $data['PARENT_EMAIL'] : $this->parentEmail;
        }
    }

    public function toArray(): array {
        return array(
            'id' => $this->id,
            'start' => $this->start,
            'end' => $this->end,
            'parent' => $this->parentName,
            'email' => $this->parentEmail
        );
    }
}