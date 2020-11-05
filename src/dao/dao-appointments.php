<?php

require_once __DIR__.'/database-classmate.php';
require_once __DIR__.'/../models/appointment.php';
require_once __DIR__.'/../models/booked-appointment.php';

class DAOAppointment {
    static function getAppointments(string $pollId, bool $booked): ?array {
        $appointments = array();

        if($booked){
            $query = "SELECT * FROM appointments WHERE POLL LIKE :pid AND PARENT IS NOT NULL ORDER BY START ASC;";
        }
        else{
            $query = "SELECT * FROM appointments WHERE POLL LIKE :pid AND PARENT IS NULL ORDER BY START ASC;";
        }        
        $parameters = array(array('name' => ":pid", 'value' => $pollId, 'type' => "string"));
        $results = null;

        $db = DatabaseSite::getInstance();

        if($db->get($query, $results, $parameters)){
            foreach($results as $result){
                if($booked){
                    $appointment = new BookedAppointment($result);
                }
                else{
                    $appointment = new Appointment($result);
                }
                $appointments[] = $appointment->toArray();
            };
            return $appointments;
        }
        return null;
    }

    static function getAllAppointments(string $pollId): ?array {
        $appointments = array();

        $query = "SELECT * FROM appointments WHERE POLL LIKE :pid ORDER BY START ASC;";       
        $parameters = array(array('name' => ":pid", 'value' => $pollId, 'type' => "string"));
        $results = null;

        $db = DatabaseSite::getInstance();

        if($db->get($query, $results, $parameters)){
            foreach($results as $result){
                $appointment = new BookedAppointment($result);
                $appointments[] = $appointment->toArray();
            };
            return $appointments;
        }
        return null;
    }

    static function book(BookedAppointment $appointment): ?BookedAppointment {
        $query = "UPDATE appointments SET PARENT = :parent, PARENT_EMAIL = :email WHERE ID = :id;";
        $parameters = array(
            array('name' => ':id', 'value' => $appointment->getId(), 'type' => 'int'),
            array('name' => ':parent', 'value' => $appointment->getParentName(), 'type' => 'string'),
            array('name' => ':email', 'value' => $appointment->getParentEmail(), 'type' => 'string')
        );

        $db = DatabaseSite::getInstance();
        if($db->execute($query, $parameters)){
            return $appointment;
        }
        return null;
    }

    static function add(string $poll, BookedAppointment $appointment): ?BookedAppointment {
        $query = "INSERT INTO appointments (POLL, START, END) VALUES (:poll, :start, :end);";
        $parameters = array(
            array('name' => ':poll', 'value' => $poll, 'type' => 'string'),
            array('name' => ':start', 'value' => $appointment->getStart()->format("Y-m-d H:i:s"), 'type' => 'string'),
            array('name' => ':end', 'value' => $appointment->getEnd()->format("Y-m-d H:i:s"), 'type' => 'string')
        );

        $db = DatabaseSite::getInstance();
        if($db->execute($query, $parameters)){
            return $appointment;
        }
        return null;
    }

    static function edit(BookedAppointment $appointment): ?BookedAppointment {
        $query = "UPDATE appointments SET START = :start, END = :end WHERE ID = :id;";
        $parameters = array(
            array('name' => ':id', 'value' => $appointment->getId(), 'type' => 'int'),
            array('name' => ':start', 'value' => $appointment->getStart()->format("Y-m-d H:i:s"), 'type' => 'string'),
            array('name' => ':end', 'value' => $appointment->getEnd()->format("Y-m-d H:i:s"), 'type' => 'string')
        );

        $db = DatabaseSite::getInstance();
        if($db->execute($query, $parameters)){
            return $appointment;
        }
        return null;
    }

    static function delete(int $id): bool {
        $query = "DELETE FROM appointments WHERE ID = :id;";
        $parameters = array(
            array('name' => ':id', 'value' => $id, 'type' => 'int'),
        );

        $db = DatabaseSite::getInstance();
        if($db->execute($query, $parameters)){
            return true;
        }
        return false;
    }
}