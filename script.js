document.addEventListener("DOMContentLoaded", function () {
    //HTML inputs
    let mapWidthInput = document.getElementById("mapwidth_input");

    let newPinButton = document.getElementById("newpin_button");
    let deletePinButton = document.getElementById("deletepin_button");
    let pinNameInput = document.getElementById("pinname_input");
    let pinTypeInput = document.getElementById("pintype_input");
    let pinFloorInput = document.getElementById("pinfloor_input");


    let edgeOnInput = document.getElementById("edge_on_input");
    let selectingParentInput = document.getElementById("selecting_parent_input");
    let edgeTrailInput = document.getElementById("edge_trail_input");
    let currEdgesSelect = document.getElementById("current_edges_select");
    let newEdgesSelect = document.getElementById("new_edges_select");
    let deleteCurrEdgeButton = document.getElementById("delete_current_edge_button");
    let addNewEdgeButton = document.getElementById("add_all_new_edge_button");
    let deleteNewEdgeButton = document.getElementById("delete_new_edge_button");

    let printButton = document.getElementById("print_button");


    //Map elements
    let mapWrapper = document.getElementById("map_wrapper");
    let mapPathsSVG = document.getElementById("map_paths");
    let mapImage = document.getElementById("map_floorplan");

    //Info Square Elements
    let imgDimensionInfo = this.getElementById("imgdimension_info");
    let pinCoordInfo = this.getElementById("pincoord_info");
    let pinTypeInfo = this.getElementById("pintype_info");
    let pinNameInfo = this.getElementById("pinname_info");

    //Console
    let consoleArea = this.getElementById("console");
    let floorDataInput = this.getElementById("floordata_input");

    //Edit Mode: pin_maker, edge_maker
    let mode = "pin_placement"


    class pin {
        constructor(name, type, floor){
            this.pinName = name;
            this.pinType = type;
            this.pinFloor = floor
            this.pinElement = this.createPinHTMLElement();
            this.pinNeighbors = new Set();
        }

        loadAttributes(name, type, floor, xPosition, yPosition){
            this.pinName = name;
            this.pinType = type;
            this.pinFloor = floor
            this.pinElement = this.createPinHTMLElement(xPosition, yPosition);
            this.pinNeighbors = new Set();
        }

        createPinHTMLElement() {
            let newPinElement = document.createElement("div");
            newPinElement.classList.add("pin");

            //Adds an event listener that returns a reference to the whole pin object.
            newPinElement.addEventListener("click", () => {
                pinManagment.prevFocusedPin = pinManagment.focusedPin;

                if (edgeOnInput.checked == false){ //Node Editing Mode
                    pinManagment.focusedPin = this;
                    updateInfoSquare();
                } else { //Edge Editing Mode
                    if (selectingParentInput.checked){
                        pinManagment.focusedPin = this;
                        updateInfoSquare();
                        loadCurrentpinNeighbors();
                    } else {
                        addToNewEdges(this);
                    }
                }
            });
    
            return newPinElement;
        }

        createPinHTMLElement(xPosition, yPosition) {
            let newPinElement = document.createElement("div");
            newPinElement.classList.add("pin");
            newPinElement.style.left = xPosition;
            newPinElement.style.top = yPosition;

            //Adds an event listener that returns a reference to the whole pin object.
            newPinElement.addEventListener("click", () => {
                pinManagment.prevFocusedPin = pinManagment.focusedPin;

                if (edgeOnInput.checked == false){ //Node Editing Mode
                    pinManagment.focusedPin = this;
                    updateInfoSquare();
                } else { //Edge Editing Mode
                    if (selectingParentInput.checked){
                        pinManagment.focusedPin = this;
                        updateInfoSquare();
                        loadCurrentpinNeighbors();
                    } else {
                        addToNewEdges(this);
                    }
                }
            });
    
            return newPinElement;
        }

        getIntYPosition() {
            return parseInt(this.pinElement.style.top) || 0;
        }

        getIntYCenterPosition(){
            let yPos = parseInt(this.pinElement.style.top) || 0;
            return yPos + (parseInt(this.pinElement.clientHeight)/2);
        }

        getIntXPosition() {
            return parseInt(this.pinElement.style.left) || 0;
        }

        getIntXCenterPosition(){
            let xPos = parseInt(this.pinElement.style.left) || 0;
            return xPos + (parseInt(this.pinElement.clientWidth)/2);
        }


        pinToJSON() {
            let temp = {
                name: this.pinName,
                type: this.pinType,
                floor: this.pinFloor,
                xPosition: this.pinElement.style.left,
                yPosition: this.pinElement.style.top,
                edges: Array.from(this.pinNeighbors)
            }

            return JSON.stringify(temp);
        }
    }

    const pinManagment = {
        pinMap: new Map(),
        focusedPin: null,
        prevFocusedPin: null,
        numPathPins: 11000,

        clearMap: function(){
            this.pinMap.forEach((pinObj, name) => {
                this.removePin(pinObj);
            })

            clearMapPaths();
        },

        removePin: function (pin) {
            if (pin == null){
                return;
            }

            pin.pinNeighbors.forEach((otherPin) => {
                this.removeEdge(pin, pinManagment.pinMap.get(otherPin));
            });

            mapWrapper.removeChild(pin.pinElement);
            this.pinMap.delete(pin.pinName);
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
            this.prevFocusedPin = this.focusedPin;
            this.focusedPin = newPin;
            return true;
        },

        setMaxPathID: function (pin) {
            let max = 10999;

            this.pinMap.forEach((pinObj, name) => {
                if (pinObj.pinType == "Path"){
                    if (parseInt(name) > max){
                        max = parseInt(name);
                    }
                }

            })

            this.numPathPins = max + 1;
        },

        //for loading from json file
        addPin: function (name, type, floor, xPosition, yPosition){
            if (name == null || name == ""){
                return false;
            }

            if (type == null || type == ""){
                return false;
            }

            if (floor == null || floor == ""){
                return false;
            }

            if (this.pinMap.has(name)){
                return false;
            }

            let newPin = new pin(name, type, floor);
            newPin.loadAttributes(name, type, floor, xPosition, yPosition);

            mapWrapper.appendChild(newPin.pinElement);
            this.pinMap.set(name, newPin);
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

            let newPin = new pin(this.numPathPins.toString(), pinType, pinFloor);

            mapWrapper.appendChild(newPin.pinElement);
            this.pinMap.set(this.numPathPins.toString(), newPin);
            this.prevFocusedPin = this.focusedPin;
            this.focusedPin = newPin;
            this.numPathPins++;

            return true;
        },

        addEdge: function (pin1, pin2){
            if (pin1 != null && pin2 != null){
                pin1.pinNeighbors.add(pin2.pinName);
                pin2.pinNeighbors.add(pin1.pinName);
            }
        },

        removeEdge: function (pin1, pin2){
            if (pin1 != null && pin2 != null){
                pin1.pinNeighbors.delete(pin2.pinName);
                pin2.pinNeighbors.delete(pin1.pinName);
            }
        },

        //For loading Edges from JSON
        addEdges: function (name, neighbors){
            if (name != null && neighbors != null){
                let pinObj = this.pinMap.get(name);

                neighbors.forEach((name) => {
                    pinObj.pinNeighbors.add(name);
                })
            }
        },

        //only need x ratio for this to work
        scalePins: function(oldImageX, newImageX){
            let ratio = newImageX/oldImageX;
            
            this.pinMap.forEach((pinObj, name) => {
                console.log(ratio);
                pinObj.pinElement.style.width = (parseInt(pinObj.pinElement.style.width) * ratio) + "px";
                pinObj.pinElement.style.height = (parseInt(pinObj.pinElement.style.height) * ratio) + "px";
                pinObj.pinElement.style.top = (parseInt(pinObj.pinElement.style.top) * ratio) + "px";
                pinObj.pinElement.style.left = (parseInt(pinObj.pinElement.style.left) * ratio) + "px";
            });

            drawPaths();
        },

        printJSON: function(){
            consoleArea.value += "[";
            this.pinMap.forEach((pinObj, name) => {
                consoleArea.value += pinObj.pinToJSON() + ",";
            })
            consoleArea.value += "]";
        }
    };

    //Creates event for pin placement.
    mapWrapper.addEventListener("click", function(e){
        if (e.target != mapPathsSVG){
            return;
        }

        if (edgeOnInput.checked){
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

        newLine.setAttribute("x1", pin1.getIntXCenterPosition());
        newLine.setAttribute("y1", pin1.getIntYCenterPosition());
        newLine.setAttribute("x2", pin2.getIntXCenterPosition());
        newLine.setAttribute("y2", pin2.getIntYCenterPosition());
        newLine.setAttribute("stroke", "black");

        mapPathsSVG.appendChild(newLine);
    }

    function clearMapPaths(){
        while (mapPathsSVG.firstChild != null){
            mapPathsSVG.removeChild(mapPathsSVG.lastChild);
        }
    }

    function drawPaths(){
        clearMapPaths();

        pinManagment.pinMap.forEach((pin, name) => {
            pin.pinNeighbors.forEach((otherPinName) => {
                addLine(pin, pinManagment.pinMap.get(otherPinName));
            })
        });

    }

    function createPinOption(pinName){
        let pinOption = document.createElement("option");
        
        pinOption.textContent = pinName;
        pinOption.setAttribute("value", pinName);

        return pinOption;
    }

    function addToNewEdges(pin){
        if (edgeOnInput.checked == false){
            return;
        }

        let pinOption = createPinOption(pin.pinName);
        newEdgesSelect.appendChild(pinOption);
    }

    function loadCurrentpinNeighbors(){
        if (edgeOnInput.checked == false){
            return;
        }

        if (pinManagment.focusedPin == null){
            return;
        }

        while (newEdgesSelect.firstChild != null){
            newEdgesSelect.removeChild(newEdgesSelect.lastChild);
        }

        while (currEdgesSelect.firstChild != null){
            currEdgesSelect.removeChild(currEdgesSelect.lastChild);
        }

        let pin = pinManagment.focusedPin;

        pin.pinNeighbors.forEach((otherPin) => {
            let pinOption = createPinOption(otherPin);
            currEdgesSelect.appendChild(pinOption)
        });;
    }

    async function fetchData(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                pinManagment.clearMap();

                data.forEach((pinObj) => {
                    pinManagment.addPin(pinObj.name, pinObj.type, pinObj.floor, pinObj.xPosition, pinObj.yPosition);
                })

                pinManagment.setMaxPathID();

                data.forEach((pinObj) => {
                    pinManagment.addEdges(pinObj.name, pinObj.edges);
                })

                drawPaths();
            })
            .catch((error) => console.error("Error loading JSON file", error));
    }

    deleteCurrEdgeButton.addEventListener("click", function(e){
        if (currEdgesSelect.value == ''){
            return;
        }

        let pin1 = pinManagment.focusedPin;
        let pin2 = pinManagment.pinMap.get(currEdgesSelect.value);

        pinManagment.removeEdge(pin1, pin2);
        loadCurrentpinNeighbors();
        drawPaths();
    })

    addNewEdgeButton.addEventListener("click", function(e){
        let options = newEdgesSelect.children;

        for (let i = 0; i < options.length; i++){
            pinManagment.addEdge(pinManagment.focusedPin, pinManagment.pinMap.get(options[i].value));
        }

        drawPaths();
        loadCurrentpinNeighbors();
    })

    printButton.addEventListener("click", function(e){
        pinManagment.printJSON();
    })
    

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

        if (edgeTrailInput.checked){
            pinManagment.addEdge(pinManagment.focusedPin, pinManagment.prevFocusedPin);
        }

        updateInfoSquare();
    })

    deletePinButton.addEventListener("click", function(e){
        let toDelete = pinManagment.focusedPin;

        if (toDelete == null){
            return;
        }

        pinManagment.removePin(pinManagment.focusedPin);
        drawPaths();
        pinManagment.focusedPin = null;
    })

    mapWidthInput.addEventListener("keyup", function(e){
        if (e.key == "Enter"){
            pinManagment.scalePins(parseInt(mapImage.style.width), parseInt(mapWidthInput.value));
            mapImage.style.width = mapWidthInput.value + "px";
            mapPathsSVG.style.width = mapWidthInput.value + "px";
            mapPathsSVG.style.height = mapImage.offsetHeight + "px";
            imgDimensionInfo.textContent = `|Img Dimensions| x:  ${mapWrapper.clientWidth}, y:  ${mapWrapper.clientHeight}`
        }
    })

    floorDataInput.addEventListener("keydown", function(e){
        if (floorDataInput.value == '' || floorDataInput.value == null){
            return;
        }

        if (e.key == "Enter"){
            fetchData(floorDataInput.value);
        }
    })

})
