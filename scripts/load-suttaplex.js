#!/usr/bin/env node

const should = require("should");
const fs = require('fs');
const path = require('path');
const { logger } = require('log-instance');
const {
    ScApi,
    SuttaCentralId,

} = require('../index');

const argv = process.argv;
const prefix = argv[2];

const STAGING = 'https://staging.suttacentral.net/api';
const PRODUCTION = 'https://suttacentral.net/api';

(async function() { try {
    var sca = await new ScApi({
        readMem: false,
        apiUrl: PRODUCTION,
        readFile: false,
    }).initialize();
    let i = 0;
    sca.logLevel = 'warn';
    for (let f of SuttaCentralId.supportedSuttas) {
        if (!prefix || f.startsWith(prefix)) {
            //await new Promise(r=>setTimeout(()=>r(), 1*100));
            logger.info(`loadSuttaplexJson`, f);
            await sca.loadSuttaplexJson(f);
        }
    }
} catch(e) {
    logger.error(e);
}})();
