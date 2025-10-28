document.addEventListener('DOMContentLoaded', function () {
    const pinManagment = {
        pinMap: new Map(),
        focusedPin: null,
    };

    //HTML Input Elements
    var mapWidthInput = document.getElementById("mapwidth_input");
    var newPinButton = document.getElementById("newpin_button");
    var pinNameInput = document.getElementById("pinname_input");
    var pinTypeInput = document.getElementById("pintype_input");

    //Map element
    var mapWrapper = document.getElementById("map_wrapper");

    //Info Square Elements
    var imgDimensionInfo = this.getElementById("imgdimension_info");
    var pinCoordInfo = this.getElementById("pincoord_info");
    var pinTypeInfo = this.getElementById("pintype_info");
    var pinNameInfo = this.getElementById("pinname_info");

    //Creates event for pin placement.
    mapWrapper.addEventListener('click', function(e){
        if (pinManagment.focusedPin != null){
            var pinElement = pinManagment.focusedPin.pinElement;

            //Places center of pin at position clicked
            var pinXCenter = parseInt(pinElement.clientWidth) / 2;
            var pinYCenter = parseInt(pinElement.clientHeight) / 2;
            pinElement.style.left = e.offsetX - pinXCenter  + 'px';
            pinElement.style.top = e.offsetY - pinYCenter + 'px';

            updateInfoSquare(pinManagment.focusedPin);
        }
    })

    function updateInfoSquare(pin){
        pinCoordInfo.textContent = `|Pin Coords| x: ${pin.getIntXPosition()}, y: ${pin.getIntYPosition()}`
        pinTypeInfo.textContent = `|Pin Type| ${pin.pinType}`;
        pinNameInfo.textContent = `|Pin Name| ${pin.pinName}`;
    }

    //Creates the html element for the pin and sets the focus.
    function createPinHTMLElement(){
        var newPin = document.createElement('div');
        newPin.classList.add('pin');

        newPin.addEventListener('click', function(e){
            pinManagment.focusedPin = this;
        })

        mapWrapper.appendChild(newPin);
        return newPin;
    }

    //Creates the data structure for storing all pin information
    function createPinObject(){
        return {
            pinElement: createPinHTMLElement(),
            pinName: pinNameInput.value,
            pinType: pinTypeInput.value,

            getIntYPosition: function () {
                return parseInt(this.pinElement.style.left);
            },

            getIntXPosition: function () {
                return parseInt(this.pinElement.style.top);
            },

            toString: function () {
                return `${this.pinName},${this.pinType},${this.getIntXPosition()},${this.getIntYPosition()}`;
            }
        }

    }

    //Creates a new pin if non existent or focuses pin if it already exists.
    newPinButton.addEventListener('click', function(e){
        if (pinNameInput.value == ''){
            return;
        }

        if (pinManagment.pinMap.has(pinNameInput.value)){
            pinManagment.focusedPin = nodeManagement.pinMap.get(pinNameInput.value);
            return;
        }

        var newPin = createPinObject();
        pinManagment.pinMap.set(newPin.pinName, newPin);
    })

    mapWidthInput.addEventListener('keyup', function(e){
        if (e.key == "Enter"){
            mapWrapper.style.width = mapWidthInput.value + "px";
            imgDimensionInfo.textContent = `|Img Dimensions| x:  ${mapWrapper.clientWidth}, y:  ${mapWrapper.clientHeight}`
        }
    })
})
