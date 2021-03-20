(function(exports) {
    const fs = require('fs');
    const path = require('path');
    const http = require('http');
    const https = require('https');
    const Definitions = require('./definitions');
    const SuttaCentralId = require('./sutta-central-id');
    const { Memoizer, GuidStore, Files } = require('memo-again');
    const { MerkleJson } = require('merkle-json');
    const LOCAL = Files.LOCAL_DIR;
    const EXPANSION_PATH = path.join(LOCAL, 'expansion.json');
    const UID_EXPANSION_PATH = path.join(LOCAL, 'uid_expansion.json');
    const DEFAULT_LANGUAGE = 'en';
    const DEFAULT_API_URL = 'https://suttacentral.net/api';
    const DEFAULT_API2_URL = 'https://staging.suttacentral.net/api';
    const UID_EXPANSION_URL = 'https://raw.githubusercontent.com/'+
        'suttacentral/sc-data/master/misc/uid_expansion.json';
    const ANY_LANGUAGE = '*';
    const ANY_TRANSLATOR = '*';
    const PO_SUFFIX_LENGTH = '.po'.length;
    const { logger } = require('log-instance');
    const APP_DIR = path.join(__dirname, '..');
    const API_DIR = path.join(APP_DIR, 'api');

    var singleton;

    var httpMonitor = 0;
    var DAY_SECONDS = 24*60*60;
    var scapi_instances = 0;

    class ScApi {
        constructor(opts={}) {
            (opts.logger || logger).logInstance(this, opts);
            scapi_instances++;
            this.name = opts.name || `ScApi@${scapi_instances}`;
            this.language = opts.language || DEFAULT_LANGUAGE;
            this.translator = opts.translator;
            this.expansion = opts.expansion || [{}];
            this.memoizer = opts.memoizer || new Memoizer({
                storeName: 'scapi_memo',
                storePath: API_DIR,
                readFile: opts.readFile,
                writeFile: opts.writeFile,
                writeMem: opts.writeMem,
                logger: this,
            });
            this.apiStore = opts.apiStore || new GuidStore({
                type: 'ApiStore',
                suffix: '.json',
                storeName: 'api',
            });
            this.apiCacheSeconds = opts.apiCacheSeconds || 7*DAY_SECONDS;
            this.mj = new MerkleJson({
                hashTag: 'guid',
            });
            this.apiUrl = opts.apiUrl || DEFAULT_API_URL;
            this.apiUrl2 = opts.apiUrl2 || DEFAULT_API2_URL;
        }

        static loadJson(url) {
            singleton = singleton || new ScApi({name:'ScApi@singleton'});
            return singleton.loadJson(url);
        }

        async loadJson(url) { try {
            var guid = this.mj.hash({
                method: 'get',
                url,
            });
            var cachedPath = this.apiStore.guidPath(guid);
            var stat = fs.existsSync(cachedPath) && fs.statSync(cachedPath);
            var age = stat && (Date.now() - stat.ctimeMs)/1000 || 
                this.apiCacheSeconds;
            if (age < this.apiCacheSeconds) {
                var result = JSON.parse(await fs.promises.readFile(cachedPath));
                this.debug(`ScApi.loadJson(${url}) => cached:${guid}`);
            } else {
                var result = await this.loadJsonRest(url);
                fs.writeFileSync(cachedPath, JSON.stringify(result,null,2));
                this.log(`loadJson(${url}) => fresh:${guid}`);
            }
            return result;
        } catch (e) {
            this.warn(`loadJson(${url})`,e);
            throw e;
        }}

        async loadJsonRest(url) { 
            let {
                name,
                apiUrl,
                apiUrl2,
                memoizer,
            } = this;
            try {
                if (/suttaplex/.test(url)) {
                    let that = this;
                    let suttaplex = async u=>{
                        return await that.loadJsonRestMaybe(u);
                    }
                    if (!this.memo_suttaplex) {
                        this.memo_suttaplex = memoizer.memoize(suttaplex, 'sc');
                    }
                    return await this.memo_suttaplex(url);
                } else {
                    return await this.loadJsonRestMaybe(url);
                }
            } catch(e) {
                if (apiUrl2) {
                    let writeFile = memoizer.writeFile;
                    let url2 = url.replace(apiUrl, apiUrl2);
                    this.warn(`loadJsonRest(RETRY) ${url2}`, e.message);
                    try {
                        memoizer.writeFile = false; // don't cache apiUrl2 data
                        return await this.loadJsonRestMaybe(url2);
                    } catch(e) {
                        this.warn(`loadJsonRest(URL2-FAILED) ${url2}`, e.message);
                        throw(e);
                    } finally {
                        memoizer.writeFile = writeFile;
                    }
                } else {
                    this.warn(`loadJsonRest(FAILED) ${url}`, e.message);
                }
                throw e;
            }
        } 

        loadJsonRestMaybe(url) {
            var that = this;
            var pbody = (resolve, reject) => { try {
                let result;
                let httpx = url.startsWith('https') ? https : http;
                if (++httpMonitor > 2) {
                    // We are overwhelming SuttaCentralApi
                    // implement throttling using Queue 
                    // (see abstract-tts.js)
                    that.warn(`ScApi.loadJsonRestMaybe() `+
                        `httpMonitor:${httpMonitor} ${url}`);
                }
                that.info(`loadJsonRestMaybe() ${url}`);
                var req = httpx.get(url, res => {
                    httpMonitor--;
                    const { statusCode } = res;
                    const contentType = res.headers['content-type'];

                    let error;
                    if (statusCode !== 200) {
                        error = new Error(`Request Failed.\n` +
                                          `Status Code: ${statusCode}`);
                    } else if (/^application\/json/.test(contentType)) {
                        // OK
                    } else if (/^text\/plain/.test(contentType)) {
                        // OK
                    } else {
                        error = new Error(
                            `Invalid content-type:${contentType}\n` +
                            `Expected application/json for url:${url}`);
                    }
                    if (error) {
                        // consume response data to free up memory
                        res.resume(); 
                        reject(error);
                        return;
                    }

                    res.setEncoding('utf8');
                    let rawData = '';
                    res.on('data', (chunk) => { rawData += chunk; });
                    res.on('end', () => {
                        try {
                            result = JSON.parse(rawData);
                            that.info(`loadJsonRestMaybe()`,
                                `${url} => ${rawData.length}C`);
                            resolve(result);
                        } catch (e) {
                            reject(e);
                        }
                    });
                }).on('error', (e) => {
                    that.warn(`loadJsonRestMaybe(ERROR)`, e.message);
                    httpMonitor--;
                    reject(e);
                }).on('timeout', (e) => {
                    that.warn(`loadJsonRestMaybe(TIMEOUT)`, e.message);
                    req.abort();
                    reject(e);
                });
            } catch(e) {
                reject(e);
            }};
            return new Promise(pbody);
        }

        static async loadUidExpansion(url=UID_EXPANSION_URL) { try {
            if (fs.existsSync(UID_EXPANSION_PATH)) {
                return JSON.parse(await fs.promises.readFile(UID_EXPANSION_PATH));
            } else {
                var res = await ScApi.loadJson(url);
                logger.info(`${url}`);
                fs.writeFileSync(UID_EXPANSION_PATH, JSON.stringify(res,null,2));
                return res;
            }
        } catch(e) {
            logger.error(`${url} ${e.message}`);
            throw e;
        }}

        static async loadExpansion(apiUrl=DEFAULT_API_URL) { try {
            var url = `${apiUrl}/expansion`;
            if (fs.existsSync(EXPANSION_PATH)) {
                let buf= await fs.promises.readFile(EXPANSION_PATH);
                return JSON.parse(buf);
            } else {
                var res = await ScApi.loadJson(url);
                logger.info(`${url}`);
                fs.writeFileSync(EXPANSION_PATH, JSON.stringify(res,null,2));
                return res;
            }
        } catch(e) {
            logger.error(`${url}`, e);
            throw e;
        }}

        async initialize() { try {
            if (this.initialized === false) {
                throw new Error("initialize() in progress");
            }
            if (this.initialized === true) {
                return this;
            }
            this.initialized = false;
            this.log(`initialize() apiUrl:${this.apiUrl}`);
            this.expansion = await ScApi.loadExpansion(this.apiUrl);
            this.uid_expansion = await ScApi.loadUidExpansion();
            this.initialized = true;
            return this;
        } catch(e) {
            this.warn(e);
            throw e;
        }}

        expandAbbreviation(abbr) {
            if (!this.initialized) {
                throw new Error('initialize() must be called');
            }
            return this.expansion[0][abbr];
        }

        suttaFromHtml(html, opts={}) {
            if (!this.initialized) {
                throw new Error('initialize() must be called');
            }
            var lang = opts.lang || 'en';
            var author_uid = opts.author_uid || 'sujato';
            this.info(`suttaFromHtml(${JSON.stringify(opts)})`);
            var apiText = Object.assign({
                lang,
                uid: "uid?",
            }, opts);
            apiText.translation = Object.assign({
                title: "title?",
                text: html,
                lang,
                author_uid,
            }, opts.translation);
            apiText.suttaplex = Object.assign({
                uid: "suttaplex.uid?",
                root_lang: "pli",
                original_title: "suttaplex.original_title?",
            }, opts.suttaplex);
            return this.suttaFromApiText(apiText);
        }

        suttaFromApiText(apiJson) {
            if (!this.initialized) {
                throw new Error('initialize() must be called');
            }
            var {
                translation,
                segmented,
                suttaplex,
            } = apiJson;
            var lang = translation.lang;
            var uid = suttaplex.uid;
            var author_uid = translation.author_uid;
            var html = translation.text.trim();

            var debug = 0;
            var msStart = Date.now();
            var resultAside = (/<aside/um).exec(html);
            if (resultAside) {
                let start = html.indexOf('>', resultAside.index)+1;
                let end = html.indexOf('</aside', start);
                var metaarea = html.substring(start, end);
                let reAside = new RegExp('<aside[^]*</aside>', 'gum');
                html = html.replace(reAside, '');
            } else {
                var metaArea = '';
            }

            var iH = html.match(/<h[0-9]/um);
            var iP = html.indexOf('<p');
            if (iH >= 0) {
                html = html.replace(/[^]*?(<h[0-9][^>]*)>/um, '$1');
            } else {
                html = html.replace(/[^]*?<p[^>]*>/um, '<p>');
            }
            html = html.replace(/<\/?div[^>]*>\n*/gum,'');
            html = html.replace(/<\/?blockquote[^>]*>\n*/gum,'');
            html = html.replace(/<\/?br[^>]*>\n*/gum,' ');

            var ipLast = html.lastIndexOf('</p>');
            var pEnd = '</p>';
            var ipEnd = html.lastIndexOf(pEnd);
            ipEnd >= 0 && (html = html.substring(0, ipEnd+pEnd.length));
            var lines = html.split('\n');

            var debug1 = 0;
            var debug2 = debug1 + 10;
            if (debug) {
                lines.slice(debug1, debug2).forEach((l,i) => {
                    var head = l.substring(0,40);
                    var tail = l.substring(l.length-10);
                    console.log(`${i+debug1} ${head}...${tail}"`)
                });
            }

            var section = 1;
            if (html.indexOf('id="sc') >= 0) {
            } else {
            }
            var id = '.0';
            var textSegments = lines.map((line,i) => {
                if (line.indexOf('id="sc') > 0) {
                    id = line.replace(/.*"sc([0-9]+)[^]*/u,'.$1');
                }
                if (i) {
                    section = line.match(/^<h[2-9]/u) ? section+1 : section;
                }
                var scid = `${uid}:${section}${id}.${i+1}`;
                line = line.replace(/<\/?[^>]*>/gu,'');
                return {
                    scid,
                    [lang]: line,
                }
            });

            if (debug) {
                console.log('elapsed', 
                    ((Date.now() - msStart)/1000).toFixed(3));
                textSegments.slice(debug1, debug2).forEach((seg,i) => {
                    var l = seg.en;
                    var len = Math.min(20,l.length/2-1);
                    console.log(`${i+debug1} ${seg.scid} "` +
                        l.substring(0,len)+
                        '...'+
                        `${l.substring(seg.en.length-len)}"`)
                });
            }

            var collId = uid.replace(/[0-9.-]+/u, '');
            var collNum = uid.replace(/[a-z]*/iu, '');
            var collNames = this.expandAbbreviation(collId);
            var collName = collNames && collNames[collNames.length-1];
            var headerSegments = [{
                scid:`${uid}:0.1`,
                [lang]: `${collName || collId} ${collNum}`,
            },{
                scid:`${uid}:0.2`,
                [lang]: `${translation.title}`,
                [suttaplex.root_lang]: `${suttaplex.original_title}`,
            }];
            var segments = headerSegments.concat(textSegments);
            var suttaRef = `${uid}/${lang}/${author_uid}`;
            this.info(`suttaFromApiText(${suttaRef}) `+
                `segs:${segments.length}`);
            return {
                author_uid,
                sutta_uid: uid,
                lang,
                segmented,
                metaarea,
                segments,
                translation,
            };
        }

        normalizeScid(id) { // DEPRECATED
            if (id == null) {
                throw new Error('Sutta reference identifier is required');
            }
            var scid = SuttaCentralId.normalizeSuttaId(id);
            if (scid == null) {
                throw new Error(`Keyword search is not yet implemented:${id}`);
            }
            return {
                support: Definitions.SUPPORT_LEVELS.Legacy,
                scid,
            };
        }

        async loadSuttaJson(id, language, translator) { try {
            var {
                scid,
                support,
            } = this.normalizeScid({
                scid: id,
                language,
                translator,
            });
            var apiSuttas = `${this.apiUrl}/suttas`;
            var request = `${apiSuttas}/${scid}`;
            if (translator && translator !== ANY_TRANSLATOR) {
                request += `/${translator}`;
            }
            if (language && language !== ANY_LANGUAGE) {
                request += `?lang=${language}`;
            }
            this.debug(`loadSuttaJson() ${request}`);

            var result = await this.loadJson(request);
            result.support = support;
            var suttaplex = result.suttaplex;
            var translations = suttaplex && suttaplex.translations;
            if (translations == null || translations.length === 0) {
                throw new Error(`loadSuttaJson() no sutta found for id:${scid}`);
            }
            if (translations && language && language !== ANY_LANGUAGE) {
                suttaplex.translations = 
                    translations.filter(t => t.lang === language);
            }
            return result;
        } catch(e) {
            this.warn(`loadSuttaJson()`, {id,language,translator}, e);
            throw e;
        }}

        async loadSuttaplexJson(scid, lang, author_uid) { try {
            let that = this;
            let sutta_uid = SuttaCentralId.normalizeSuttaId(scid);
            let request = `${this.apiUrl}/suttaplex/${sutta_uid}`;
            let result = await that.loadJsonRest(request);
            var splx = JSON.parse(JSON.stringify(result[0])); // copy
            if (!splx) {
                throw new Error(`loadSuttaplexJson() no suttaplex`);
            }
            var translations = splx && splx.translations;
            if (translations == null || translations.length === 0) {
                throw new Error(`loadSuttaplexJson() no translations`);
            }
            if (lang || author_uid) {
                splx.translations = 
                    translations.filter(t => 
                        (!lang || lang === ANY_LANGUAGE || t.lang === lang)
                        &&
                        (!author_uid || t.author_uid === author_uid)
                    );
                translations.sort((a,b) => {
                    if (a.segmented === b.segmented) {
                        return (a.author_uid||'').localeCompare(b.author_uid||'');
                    }
                    return a.segmented ? 1 : -1;
                });
                this.debug(`ScApi.loadSuttaplexJson`+
                    `(${scid}, ${lang}, ${author_uid}) `+
                    `${JSON.stringify(splx,null,2)}`);
            }
            return splx;
        } catch(e) {
            this.warn(`loadSuttaplexJson()`, {scid, lang, author_uid}, e);
            throw e;
        }}

        async loadSutta(...args) { try {
            if (typeof args[0] === "string") {
                var opts = {
                    scid: args[0],
                    language: args[1] || this.language,
                    translator: args[2] || this.translator,
                }
            } else {
                opts = args[0];
            }
            var sutta_uid = SuttaCentralId.normalizeSuttaId(opts.scid);
            var language = opts.language;
            var author_uid = opts.translator;
            var suttaplex = await this.loadSuttaplexJson(
                sutta_uid, language, author_uid);
            var translations = suttaplex.translations;
            if (translations == null || translations.length == 0) {
                this.log(`loadSutta(${sutta_uid},${language}) => no translations`);
                return null;
            }

            author_uid = translations[0].author_uid;
            var result = await this.loadSuttaJson(sutta_uid, language, author_uid);
            if (result.translation == null && translations.length>0) {
                var trans = translations.filter(t=>t.segmented)[0];
                if (trans == null) {
                    this.info([
                        `loadSutta() ${sutta_uid}/${language}/${author_uid}`,
                        `=> legacy unsegmented text`,
                    ].join(' '));
                    trans = translations[0];
                }
                var {
                    author_uid,
                    lang,
                } = trans;

                var uid = result.suttaplex.uid;
                // multiple translations found, using first
                var result = await 
                    this.loadSuttaJson(uid, lang, author_uid);
            }
            var translation = result.translation;
            if (translation) {
                var author_uid = translation.author_uid;
                if (translation.text) {
                    var sutta = this.suttaFromApiText(result);
                } else {
                    var rootStrings = result.root_text.strings || {};
                    var segObj = {};
                    console.log(JSON.stringify(result.rootText, null,2));
                    Object.keys(rootStrings).forEach(scid => {
                        segObj[scid] = segObj[scid] || { scid };
                        segObj[scid].pli = rootStrings[scid];
                        segObj[scid].en = "";
                    });
                    var transStrings = translation.strings || {};
                    Object.keys(transStrings).forEach(scid => {
                        segObj[scid] = segObj[scid] || { scid };
                        var text = transStrings[scid];
                        text = text.replace(/<\/?i>/gum, '');
                        segObj[scid][translation.lang] = text;
                    });
                    var segments = Object.keys(segObj)
                        .map(scid => segObj[scid]);
                    var sutta = {
                        sutta_uid: result.suttaplex.uid,
                        segmented: result.segmented,
                        segments,
                        translation,
                    };
                }
                sutta.author_uid = translation.author_uid;
                sutta.suttaplex = result.suttaplex;
                return sutta;
            } else { // no unique translation 
                return result;
            }
        } catch(e) {
            this.warn(`loadSutta() args:`, JSON.stringify(args), e);
            throw e;
        }}
        
    }

    module.exports = exports.ScApi = ScApi;
})(typeof exports === "object" ? exports : (exports = {}));

