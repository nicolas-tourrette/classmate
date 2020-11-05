<?php

class Appointment {
    protected int $id;
    protected DateTime $start;
    protected DateTime $end;

    public function getId(): int { return $this->id; }

    public function getStart(): DateTime { return $this->start; }
    public function setStart(DateTime $start){ $this->start = $start; }

    public function getEnd(): DateTime { return $this->end; }
    public function setEnd(DateTime $end){ $this->end = $end; }

    public function __construct(array $data = null){
        $this->id = 0;
        $this->start = new DateTime();
        $this->end = new DateTime();

        $this->fromArray($data);
    }

    public function fromArray(?array $data){
        if($data){
            $this->id = isset($data['ID']) ? $data['ID'] : $this->id;
            if(isset($data['START'])){
				if(is_string($data['START'])){
					$data['START'] = new DateTime(preg_replace('/\(.*$/', '', $data["START"]));
				}
                $this->start = $data['START'];
            }
            if(isset($data['END'])){
				if(is_string($data['END'])){
					$data['END'] = new DateTime(preg_replace('/\(.*$/', '', $data["END"]));
				}
                $this->end = $data['END'];
            }
        }
    }

    public function toArray(): array {
        return array(
            'id' => $this->id,
            'start' => $this->start,
            'end' => $this->end,
        );
    }
}