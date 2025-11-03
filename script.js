document.addEventListener("DOMContentLoaded", function () {
    //HTML Input Elements
    let mapWidthInput = document.getElementById("mapwidth_input");
    let newPinButton = document.getElementById("newpin_button");
    let pinNameInput = document.getElementById("pinname_input");
    let pinTypeInput = document.getElementById("pintype_input");
    let pinFloorInput = document.getElementById("pinfloor_input");

    //Map elements
    let mapWrapper = document.getElementById("map_wrapper");
    let mapPathsSVG = document.getElementById("map_paths");
    let mapImage = document.getElementById("map_floorplan");

    //Info Square Elements
    let imgDimensionInfo = this.getElementById("imgdimension_info");
    let pinCoordInfo = this.getElementById("pincoord_info");
    let pinTypeInfo = this.getElementById("pintype_info");
    let pinNameInfo = this.getElementById("pinname_info");


    class pin {
        constructor(name, type, floor){
            this.pinName = name;
            this.pinType = type;
            this.pinFloor = floor
            this.pinElement = this.createPinHTMLElement();
        }

        createPinHTMLElement() {
            let newPinElement = document.createElement("div");
            newPinElement.classList.add("pin");

            //Adds an event listener that returns a reference to the whole pin object.
            newPinElement.addEventListener("click", () => {
                pinManagment.focusedPin = this;
                updateInfoSquare();
            });
    
            return newPinElement;
        }

        getIntYPosition() {
            return parseInt(this.pinElement.style.top) || 0;
        }

        getIntXPosition() {
            return parseInt(this.pinElement.style.left) || 0;
        }

        toString() {
            return `${this.pinName},${this.pinType},${this.getIntXPosition()},${this.getIntYPosition()}`;
        }
    }

    const pinManagment = {
        pinMap: new Map(),
        focusedPin: null,
        numPathPins: 0,

        removePin: function (pinName) {
            if (this.pinMap.has(pinName)){
                document.removeChild(this.pinMap.get(pinName));
                this.pinMap.delete(pinName);
            }
        },

        addPin: function (pinName, pinType, pinFloor){
            if (pinName == null || pinName == ""){
                return false;
            }

            if (pinType == null || pinType == ""){
                return false;
            }

            if (pinFloor == null || pinFloor == ""){
                return false;
            }

            if (this.pinMap.has(pinName)){
                return false;
            }

            let newPin = new pin(pinName, pinType, pinFloor);

            mapWrapper.appendChild(newPin.pinElement);
            this.pinMap.set(pinName, newPin);
            this.focusedPin = newPin;
            return true;
        },

        addPathPin: function (pinType, pinFloor){
            if (pinType == null || pinType == ""){
                return false;
            }

            if (pinFloor == null || pinFloor == ""){
                return false;
            }

            let newPin = new pin(this.numPathPins, pinType, pinFloor);

            mapWrapper.appendChild(newPin.pinElement);
            this.pinMap.set(this.numPathPins, newPin);
            this.focusedPin = newPin;
            this.numPathPins++;
            return true;
        }
    };

    //Creates event for pin placement.
    mapWrapper.addEventListener("click", function(e){
        if (e.target != mapPathsSVG){
            return;
        }

        if (pinManagment.focusedPin != null){
            let pinElement = pinManagment.focusedPin.pinElement;

            //Places center of pin at position clicked
            let pinXCenter = parseInt(pinElement.clientWidth) / 2;
            let pinYCenter = parseInt(pinElement.clientHeight) / 2;
            pinElement.style.left = e.offsetX - pinXCenter  + "px";
            pinElement.style.top = e.offsetY - pinYCenter + "px";

            drawPaths();
            updateInfoSquare(pinManagment.focusedPin);
        }
    })

    function updateInfoSquare(){
        let pin = pinManagment.focusedPin;

        pinCoordInfo.textContent = `|Pin Coords| x: ${pin.getIntXPosition()}, y: ${pin.getIntYPosition()}`
        pinTypeInfo.textContent = `|Pin Type| ${pin.pinType}`;
        pinNameInfo.textContent = `|Pin Name| ${pin.pinName}`;
    }

    function addLine(pin1, pin2){
        let newLine = document.createElementNS("http://www.w3.org/2000/svg", "line")

        mapPathsSVG.to

        newLine.setAttribute("x1", pin1.getIntXPosition());
        newLine.setAttribute("y1", pin1.getIntYPosition());
        newLine.setAttribute("x2", pin2.getIntXPosition());
        newLine.setAttribute("y2", pin2.getIntYPosition());
        newLine.setAttribute("stroke", "black");

        mapPathsSVG.appendChild(newLine);
    }

    function clearMapPaths(){
        while (mapPathsSVG.firstChild != null){
            mapPathsSVG.removeChild(mapPathsSVG.lastChild);
            console.log("removed");
        }
    }

    function drawPaths(){
        clearMapPaths();

        pinManagment.pinMap.forEach((value, key) => {
            pinManagment.pinMap.forEach((value2, key2) => {
                if (value != value2){
                    addLine(value, value2);
                }
            }) 
        });

        console.log(mapPathsSVG.children);
    }

    //Creates a new pin if non existent or focuses pin if it already exists.
    newPinButton.addEventListener("click", function(e){
        let successful = false;

        if (pinTypeInput.value == "Path"){
            successful= pinManagment.addPathPin(pinTypeInput.value, pinFloorInput.value);
        } else {
            successful= pinManagment.addPin(pinNameInput.value, pinTypeInput.value, pinFloorInput.value);
        }

        if (!successful){
            return;
        }

        drawPaths();
        updateInfoSquare();
    })

    mapWidthInput.addEventListener("keyup", function(e){
        if (e.key == "Enter"){
            mapWrapper.style.width = mapWidthInput.value + "px";
            imgDimensionInfo.textContent = `|Img Dimensions| x:  ${mapWrapper.clientWidth}, y:  ${mapWrapper.clientHeight}`
        }
    })
})
