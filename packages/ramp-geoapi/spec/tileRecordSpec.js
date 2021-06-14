/* jshint jasmine: true */
'use strict';

const tileRecordModule = require('../src/layer/layerRec/tileRecord.js');

// A class that mocks the Extent class
class FakeExtent {
    constructor(height, width) {
        if (height) {
            this._height = height;
        } else {
            this._height = 1;
        }

        if (width) {
            this._width = width;
        } else {
            this._width = 1;
        }
    }

    getWidth() {
        return this._width;
    }
}

// A class that mocks the layer class from Esri
class FakeLayer {
    constructor(id) {
        this._id = id;
    }

    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;
    }
}

// A class that mocks the events module from geoApi
class FakeGeoApiEvents {
    constructor() {}

    wrapEvents() {}
}

// A class that mocks the SpatialReference class
class FakeSpatialReference {
    constructor() {}
}

// A class that mocks the proj module from geoApi
class FakeGeoApiProj {
    constructor() {}

    localProjectExtent() {
        return {
            x0: 0,
            x1: 1,
            y0: 0,
            y2: 2,
            sr: new FakeSpatialReference(),
        };
    }
}

// A class that mocks the map module from geoApi
class FakeGeoApiMap {
    constructor() {}

    Extent(x0, y0) {
        return new FakeExtent(x0, y0);
    }
}

// A class that mocks the symbology module from geoApi
class FakeGeoApiSymbology {
    constructor() {}

    generatePlaceholderSymbology() {}
}

// A class that mocks the object pointing to geoApi
class ApiRef {
    constructor() {
        this._events = new FakeGeoApiEvents();
        this._proj = new FakeGeoApiProj();
        this._map = new FakeGeoApiMap();
        this._symbology = new FakeGeoApiSymbology();
    }

    get symbology() {
        return this._symbology;
    }
    get events() {
        return this._events;
    }
    get proj() {
        return this._proj;
    }
    get Map() {
        return this._map;
    }

    set symbology(val) {
        this._symbology = val;
    }
    set events(val) {
        this._events = val;
    }
    set proj(val) {
        this._proj = val;
    }
    set Map(val) {
        this._map = val;
    }
}

// A class that mocks the state class
class State {
    constructor() {
        this._opacity = '1';
        this._visibility = '2';
    }

    get opacity() {
        return this._opacity;
    }
    get visibility() {
        return this._visibility;
    }

    set opacity(val) {
        this._opacity = val;
    }
    set visibility(val) {
        this._visibility = val;
    }
}

// A class that mocks the configutation layer class
class Config {
    constructor(extent, state) {
        if (extent) {
            this._extent = extent;
        } else {
            this._extent = new FakeExtent();
        }
        if (state) {
            this._state = state;
        } else {
            this._state = new State();
        }
    }

    get extent() {
        return this._extent;
    }
    get state() {
        return this._state;
    }

    set extent(val) {
        this._extent = val;
    }
    set state(val) {
        this._state = val;
    }
}

// A class that mocks the pre-constructed layer
class EsriLayer {
    constructor() {
        this._url = 'www.esriLayer.io';
    }

    get url() {
        return this._url;
    }
}

describe('tileRecord', () => {
    let tileRecord;
    const FakeLayerObject = new FakeLayer('113');
    const apiRef = new ApiRef();
    const config = new Config();
    const esriLayer = new EsriLayer();

    beforeEach(() => {
        tileRecord = tileRecordModule();
    });

    it('should create a tileRecord object', () => {
        const tileRecordObject = new tileRecord.TileRecord(FakeLayerObject, apiRef, config, esriLayer);

        expect(tileRecordObject).not.toBe(undefined);
    });
});
