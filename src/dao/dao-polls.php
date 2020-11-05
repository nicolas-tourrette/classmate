<?php

require_once __DIR__.'/database-classmate.php';
require_once __DIR__.'/dao-appointments.php';
require_once __DIR__.'/../models/poll.php';

class DAOPolls {
    static function getPollNames(): ?array {
        $polls = array();

        $query = "SELECT * FROM polls;";
        $parameters = array();
        $results = null;

        $db = DatabaseSite::getInstance();

        if($db->get($query, $results, $parameters)){
            foreach($results as $result){
                $polls[] = array_change_key_case($result, CASE_LOWER);
            }
            
            return $polls;
        }
        return null;
    }

    static function getPollById(string $id): ?Poll {
        $poll = new Poll;
        $query = "SELECT * FROM polls WHERE ID LIKE :pid;";
        $parameters = array(array('name' => ":pid", 'value' => $id, 'type' => "string"));
        $results = null;

        $db = DatabaseSite::getInstance();

        if($db->get($query, $results, $parameters)){
            foreach($results as $result){
                $result["appointments"] = DAOAppointment::getAllAppointments($id);
                $poll = new Poll($result);
            }
            return $poll;
        }
        return null;
    }

    static function addPoll(Poll $poll): ?Poll {
        var_dump($poll);
        $query = "INSERT INTO polls VALUES (:id, :name, :active);";
        $parameters = array(
            array('name' => ':id', 'value' => $poll->getId(), 'type' => 'string'),
            array('name' => ':name', 'value' => $poll->getName(), 'type' => 'string'),
            array('name' => ':active', 'value' => $poll->getActive(), 'type' => 'boolean')
        );

        $db = DatabaseSite::getInstance();
        if($db->execute($query, $parameters)){
            return $poll;
        }
        return null;
    }

    static function savePoll(Poll $poll): ?Poll {
        $query = "UPDATE polls SET NAME = :name, ACTIVE = :active WHERE ID = :id;";
        $parameters = array(
            array('name' => ':id', 'value' => $poll->getId(), 'type' => 'string'),
            array('name' => ':name', 'value' => $poll->getName(), 'type' => 'string'),
            array('name' => ':active', 'value' => $poll->getActive(), 'type' => 'bool')
        );

        $db = DatabaseSite::getInstance();
        if($db->execute($query, $parameters)){
            return $poll;
        }
        return null;
    }
}