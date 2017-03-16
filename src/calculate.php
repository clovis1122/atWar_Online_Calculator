<?php

class unit{
    private $attack;
    private $defense;
    private $critical;
    private $hp;
    private $maxHP;
    private $amount;
    private $maxAmount;
    private $alive;

    public function __construct($_unit) {
        $this->attack = $_unit[0];
        $this->defense = $_unit[1];
        $this->hp = $this->maxHP = $_unit[2];
        $this->critical = $_unit[3]/100;
        $this->amount = $this->maxAmount = $_unit[4];
        $this->alive = True;
    }

    public function damaged($value)
    {
        $this->hp -= $value;

        while ($this->hp <= 0 && $this->alive){
            $this->hp += $this->maxHP;
            $this->amount -= 1;
            $this->alive = ($this->amount > 0);
        }

    }

    /**
     * @return bool
     */
    public function isAlive(): bool
    {
        return $this->alive;
    }

    public function attackRoll($multiplier){
        $roll = $this->calculateRoll($this->attack,$multiplier);

        if (mt_rand()/mt_getrandmax() < $this->critical){
            $roll += $this->attack;
        }
        return $roll;
    }
    public function defenseRoll($multiplier){
        $roll = $this->calculateRoll($this->defense,$multiplier);
        if (mt_rand()/mt_getrandmax() < $this->critical){
            $roll += $this->defense;
        }
        return $roll;
    }

    /**
     * @return mixed
     */
    public function getAmount()
    {
        return $this->amount;
    }
    /**
     * @return mixed
     */
    public function getHp()
    {
        return $this->hp;
    }

    public function restore(){
        $this->alive = True;
        $this->hp = $this->maxHP;
        $this->amount = $this->maxAmount;
    }

    public function calculateRoll($max, $multiplier){

        if ($multiplier < 1){
            $value = 1;
            for ($value=1;$value < $max-1; $value++){
                if (mt_rand()/mt_getrandmax()> $multiplier){
                    break;
                }
            }

            if (($value == $max) && mt_rand()/mt_getrandmax() >= $multiplier){
                return $this->calculateRoll($max,$multiplier);
            }

            return $value;
        }
        return rand(1,$max);
    }

    public function getAttackBonus(){
        return (($this->attack * $this->amount) +  $this->amount);
    }
    public function getDefenseBonus(){
        return (($this->defense * $this->amount) +  $this->amount);
    }
}

class stack{
    private $id;
    private $units;
    private $status;
    private $currentStatus;
    private $victories;
    private $alive;

    public function __construct($_stack) {
        $this->id = $_stack[0];
        $this->victories = 0;
        $this->status = $this->currentStatus = (bool)($_stack[1]);
        $this->units = array();
        $this->alive = true;

        for ($i = 1; $i < count($_stack); $i++){
            array_push($this->units,new unit($_stack[$i]));
        }
    }

    public function getVictories(){
        return $this->victories;
    }

    public function addVictory(){
        $this->victories++;
    }

    public function isActive() : bool{

    }

}

//BATTLE FUNCTIONS

function battle_step_0($attackingArmy,$army,$loop){


}

function battle_step_1($attacker, $defender){
//CALCULATE BATTLE STACKING BONUS; CALCULATE ROLLS;
}

function battle_step_2($attacker,$defender){

//DEAL DAMAGE

}


//END OF BATTLE FUNCTIONS


function createStackFromJSON(&$attackingArmy,$defendingArmy) : array{
    //CREATE STACKS

    $armies = [];

    for ($i = 0; $i < count($attackingArmy); $i++){
        array_push($armies,new stack($attackingArmy[$i]));
    }

    $attackingArmy = $armies;
    array_push($armies,new stack($defendingArmy));

    return $armies;
}



if (empty($_GET["attackingArmy"]) || empty($_GET["defendingArmy"])){
    echo "<p>Wrong data entered </p>";

} else {

    $attackingArmy = json_decode($_GET["attackingArmy"],true);
    $defendingArmy = json_decode($_GET["defendingArmy"],true);

    $armies = createStackFromJSON($attackingArmy,$defendingArmy);

    echo "<p>" . var_dump($attackingArmy). "</p>";

    // battle_step_0($attackingArmy,$army,1000);

}


?>