$('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', '../../../../rv-styles.css'));

$.getScript('../../../../rv-main.js', function () {
    RZ.mapAdded.subscribe(mapi => {

        //SETUP:
        // JSON snippet to be added as a ConfigLayer
        const layerJSON = {
            "id": "0",
            "name": "Liquids Pipeline",
            "layerType": "esriFeature",
            "state": {
                "visibility": true
            },
            "url": "http://geoappext.nrcan.gc.ca/arcgis/rest/services/NACEI/energy_infrastructure_of_north_america_en/MapServer/3"
        };

        let setAttrib = false;
        let setAttribs = false;
        let remAttrib = false;
        let remAttribs = false;

        //add config layer to map
        mapi.layers.addLayer(layerJSON);

        mapi.layers.layerAdded.subscribe(layer => {

            let attributesGone = false;

            if (layer.id === '0') {
                // set the config layer to a constant for ease of use
                const configLayer = mapi.layers.getLayersById('0')[0];

                // subscribe to attributes added
                configLayer.attributesAdded.subscribe(l => {
                    console.log('Attributes added');
                    document.getElementById("FetchAttributes").style.backgroundColor = "#00FF00";
                    configLayer.getAttributes();

                    //enables ability to set attributes/get attributes for already downloaded attributes.
                    if (!attributesGone) {
                        document.getElementById("SetAttribute").disabled = false;
                        document.getElementById("SetAllAttributes").disabled = false;
                        document.getElementById("GetAllAttributes").disabled = false;
                        document.getElementById("GetAttribute").disabled = false;
                        document.getElementById("RemoveAttribute").disabled = false;
                        document.getElementById("RemoveAllAttributes").disabled = false;
                    }
                });

                // subscribe to attributes changed
                configLayer.attributesChanged.subscribe(l => {
                    console.log('Attributes changed');
                    if (setAttrib === true) {
                        document.getElementById("SetAttribute").style.backgroundColor = "#00FF00";
                    }

                    if (setAttribs === true) {
                        document.getElementById("SetAllAttributes").style.backgroundColor = "#00FF00";
                    }
                });


                // download attributes
                document.getElementById("FetchAttributes").onclick = function () {
                    configLayer.fetchAttributes();
                }

                // change attribute of OID 1
                document.getElementById("SetAttribute").onclick = function () {
                    setAttrib = true;
                    configLayer.setAttributes(1, 'Country', 'new Country');
                    //disable after attribute is set, so user can't set again.
                    document.getElementById("SetAttribute").disabled = true;
                }

                // change multiple attributes of OID 2
                document.getElementById("SetAllAttributes").onclick = function () {
                    setAttrib = false;
                    setAttribs = true;
                    configLayer.setAttributes(2, { Country: 'Country is new', OBJECTID: -1 });
                    //disable after attribute is set, so user can't set again.
                    document.getElementById("SetAllAttributes").disabled = true;
                }

                //get OID5 attribute
                document.getElementById("GetAttribute").onclick = function () {
                    document.getElementById("output").innerHTML = " ";
                    document.getElementById("output").innerHTML = configLayer.getAttributes(5)["Pipeline"];
                }

                //get all attributes in layer
                document.getElementById("GetAllAttributes").onclick = function () {
                    document.getElementById("output").innerHTML = " ";
                    for (let attrib of configLayer.getAttributes()) {
                        document.getElementById("output").innerHTML += attrib["Pipeline"] + "\\\n";
                    }
                }

                //subscribe to attributes removed
                configLayer.attributesRemoved.subscribe(l => {
                    console.log('Attributes removed');

                    if (remAttrib) {
                        // confirm attribute for OID 5 removed, but others still persist
                        if (configLayer.getAttributes(5) === undefined && configLayer.getAttributes(10) !== undefined) {
                            document.getElementById("RemoveAttribute").style.backgroundColor = "#00FF00";
                        }
                        else {
                            console.log("Test failed because attribute was not removed successfully, or removed wrong attribute")
                            document.getElementById("RemoveAttribute").style.backgroundColor = "#cd0000";
                        }
                    }

                    if (remAttribs) {
                        // confirm previously present attribute was removed, and attributes list is now empty
                        if (configLayer.getAttributes(10) === undefined && configLayer.getAttributes().length === 0) {
                            document.getElementById("RemoveAllAttributes").style.backgroundColor = "#00FF00";
                        }
                        else {
                            console.log("Test failed because attributes were not removed successfully")
                            document.getElementById("RemoveAllAttributes").style.backgroundColor = "#cd0000";
                        }
                    }
                });

                //remove single attribute (OID5)
                document.getElementById("RemoveAttribute").onclick = function () {
                    document.getElementById("GetAttribute").disabled = true;
                    document.getElementById("RemoveAttribute").disabled = true;
                    // remove single attribute field of layer whose attributes are already downloaded
                    attributesGone = true;
                    remAttrib = true;
                    configLayer.removeAttributes(5);
                }

                //remove all attributes
                document.getElementById("RemoveAllAttributes").onclick = function () {
                    // remove single attribute field of layer whose attributes are already downloaded
                    document.getElementById("GetAllAttributes").disabled = true;
                    document.getElementById("RemoveAttribute").disabled = true;
                    document.getElementById("GetAttribute").disabled = true;
                    document.getElementById("RemoveAllAttributes").disabled = true;
                    document.getElementById("SetAttribute").disabled = true;
                    document.getElementById("SetAllAttributes").disabled = true;
                    attributesGone = true;
                    remAttrib = false;
                    remAttribs = true;
                    configLayer.removeAttributes();
                }

            }

        });
    });

    $('#main').append(`
        <div id="fgpmap" style="height:700px; width:70%; margin-left:10px" class="column" rv-langs='["en-CA", "fr-CA"]' rv-service-endpoint="http://section917.cloudapp.net:8000/""></div>
    `);

    const mapInstance = new RZ.Map(document.getElementById('fgpmap'), '../../../config.rcs.[lang].json');
});
