#!/usr/bin/env node

const should = require("should");
const fs = require('fs');
const path = require('path');
const { logger } = require('log-instance');
const {
    ScApi,
    SuttaCentralId,

} = require('../index');

const STAGING = 'http://staging.suttacentral.net/api';
const PRODUCTION = 'http://suttacentral.net/api';

(async function() { try {
    var sca = await new ScApi({
        readMem: false,
        apiUrl: PRODUCTION,
        readFile: false,
    }).initialize();
    let i = 0;
    for (let f of SuttaCentralId.supportedSuttas) {
        await new Promise(r=>setTimeout(()=>r(), 2*1000));
        await sca.loadSuttaplexJson(f);
    }
} catch(e) {
    logger.error(e);
}})();
