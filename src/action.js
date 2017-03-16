//Adds an unit to the stack troops container

function addUnit(stackName) {
    var row = document.createElement("TR");
    for (var iterator = 1;iterator < 6; iterator++) {
        var value;

        if (iterator < 4) {
            //Validate and enter attack, defense and HP
            value = document.getElementById(stackName + "Attributes").rows[iterator].cells[1].children[0].value;
            if (validateAttribute(value,1,150)) {
                row.insertCell(-1).innerHTML = value;
                continue;
            } else {
                document.getElementById(stackName + "Attributes").rows[iterator].cells[1].children[0].focus();
                break;
            }
        }
        else if (iterator == 4) {
            //Validate critical
            value = document.getElementById(stackName + "Attributes").rows[iterator].cells[1].children[0].value;
            if (validateAttribute(value,0,100)) {
                row.insertCell(-1).innerHTML = value;
                continue;
            } else {
                document.getElementById(stackName + "Attributes").rows[iterator].cells[1].children[0].focus();
                break;
            }
        }
        else {
            //Validate amount

            value = document.getElementById(stackName + "Attributes").rows[iterator].cells[1].children[0].value;

            if (validateAttribute(value,1,5000)) {
                row.insertCell(-1).innerHTML = value;
                document.getElementById(stackName + "Troops").appendChild(row);
            } else {
                document.getElementById(stackName + "Attributes").rows[iterator].cells[1].children[0].focus();
            }

        }
    }
}

//Clears the stack troops container

function clearStack(stackName){
    var oldbody = document.getElementById(stackName + "Troops");
    var table = oldbody.parentNode;
    var newbody = document.createElement('tbody');

    newbody.id = stackName+ "Troops";

    table.removeChild(oldbody);
    table.appendChild(newbody);
}

//Clear all the attributes of the stack

function clearValues(stackName){
    for (var iterator = 1;iterator < 6; iterator++) {
        document.getElementById(stackName + "Attributes").rows[iterator].cells[1].children[0].value = "";
    }
    clearStack(stackName);
}

function changeStatus(stackName) {
    /*
     0 = disable
     1 = attack
     2 = defense
     */

    var status = (document.getElementById(stackName + "Attributes").rows[0].cells[1].children[0].value == 0);
    if (status){
        clearValues(stackName);
    }

    for (var i = 1; i < 6; i++) {
        document.getElementById(stackName + "Attributes").rows[i].cells[1].children[0].disabled = status;
    }
    document.getElementById(stackName + "Attributes").rows[6].cells[0].children[0].disabled = status;
    document.getElementById(stackName + "Attributes").rows[6].cells[1].children[0].disabled = status;
}

function validateAttribute(value,min,max){
    if (value == "") {
        alert("This value can't be empty");
        return false;
    } else if (isNaN(value)) {
        alert("This value is not a number");
        return false;
    } else if (value < min || value > max) {
        alert("This value must be between "+ min+ " and "+max);
        return false;
    } return true;
}


function validateDefender(){
    var defender = -1;

    for (var i=1; i < 5; i++){

        var status = document.getElementById("stack" + i + "Attributes").rows[0].cells[1].children[0].value;
        if (status == 2){
            if (defender == -1){
                defender = i;
            } else{
                defender = 0;
            }
        }
    }

    return defender;
}

function createStack (stackName,i) {
    var jsonstack = [];
    jsonstack.push(i);

    stackName = stackName + i;

    for (var i = 0, row; row = document.getElementById(stackName + "Troops").rows[i]; i++) {
        var jsonunit = [];
        for (var iterator = 0; iterator < 5; iterator++) {
            jsonunit.push(row.cells[iterator].innerHTML);
        }
        jsonstack.push(jsonunit);
    }
    return jsonstack;
}

function getResult() {

    //Validate defender; create defender stack

    var def = validateDefender();

    if (!def){
        alert("Error: more than one defender found.");
        return;
    }


    var attackingArmy = [];
    var defendingArmy;

    for (var i=1; i < 5; i++){
        if (i == def){
            defendingArmy = createStack("stack", i);
        } else{
            var status = (document.getElementById("stack" + i + "Attributes").rows[0].cells[1].children[0].value);
            if  (Number(status)){
                attackingArmy.push(createStack("stack", i));
            }
        }
    }

    //Convert the data into JSON and send it to the server. Once available, show the results from the servers.

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("result").innerHTML = this.responseText;
        }
    };

    xhttp.open("GET", "calculate.php?attackingArmy="+JSON.stringify(attackingArmy) +"&defendingArmy=" +
        JSON.stringify(defendingArmy), true);

    xhttp.send();
}