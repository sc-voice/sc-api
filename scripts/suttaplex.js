#!/usr/bin/env node

const should = require("should");
const fs = require('fs');
const path = require('path');
const { logger } = require('log-instance');
logger.logLevel = 'warn';
const {
    ScApi,
    SuttaCentralId,
} = require('../index');

const [arg0,arg1, suid, lang, author] = process.argv;

const STAGING = 'https://staging.suttacentral.net/api';
const PRODUCTION = 'https://suttacentral.net/api';

(async function() { try {
    var sca = await new ScApi({
        readMem: false,
        apiUrl: PRODUCTION,
        readFile: false,
    }).initialize();
    var res = await sca.loadSuttaplexJson(suid, lang, author);
    console.log(JSON.stringify(res));
} catch(e) {
    logger.error(e);
}})();
