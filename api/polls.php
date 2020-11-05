<?php

require_once __DIR__.'/../src/dao/dao-polls.php';

header("Content-Type: application/json");

if(isset($_GET["action"])){
    switch ($_GET["action"]) {
        case 'getPoll':
            if(isset($_GET["id"])){
                $poll = DAOPolls::getPollById($_GET["id"]);
                if($poll !== null){
                    echo json_encode($poll->toArray());
                }
                else{
                    throw new Exception("Error.");
                }
            }
            else{
                throw new Exception("Error.");
            }
            break;
        
        case 'getPollNames':
            echo json_encode(DAOPolls::getPollNames());
            break;

        case 'add':
            if(isset($_POST["data"])){
                $data = json_decode($_POST["data"], true);
                $poll = new Poll($data["poll"]);
                $poll = DAOPolls::addPoll($poll);
                echo json_encode(array('id' => $poll->getId()));
            }
            else{
                throw new Exception("Error.");
            }
            break;

        case 'save':
            if(isset($_POST["data"])){
                $data = json_decode($_POST["data"], true);
                $poll = new Poll($data["poll"]);
                $poll = DAOPolls::savePoll($poll);
                echo json_encode(array('id' => $poll->getId()));
            }
            else{
                throw new Exception("Error.");
            }
            break;

        case 'activate':
            if(isset($_POST["data"])){
                $data = json_decode($_POST["data"], true);
                $poll = DAOPolls::getPollById($data["poll"]);
                $poll->setActive($data["active"]);
                $poll = DAOPolls::savePoll($poll);
                echo json_encode(array('id' => $poll->getId()));
            }
            else{
                throw new Exception("Error.");
            }
            break;

        default:
            throw new Exception("Specified action is unknown.");
            break;
    }
}
else{
    throw new Exception("You have not specified any action.");
}