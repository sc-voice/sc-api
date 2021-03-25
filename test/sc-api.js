(typeof describe === 'function') && describe("sc-api", function() {
    const should = require("should");
    const fs = require('fs');
    const path = require('path');
    const { logger } = require('log-instance');
    logger.logLevel = "warn";
    const {
        ScApi,
    } = require('../index');
    const APP_DIR = path.join(__dirname, '..');

    const SUTTAPLEX_SNP1_8_2021 = {
        acronym: 'Snp 1.8',
        volpages: 'Snp 25',
        uid: 'snp1.8',
        difficulty: null,
        original_title: 'Mettasutta',
        root_lang: 'pli',
        type: 'leaf',
        from: null,
        translated_title: 'Loving-kindness',
        parallel_count: 1,
        biblio: null,
    };
    const SUTTAPLEX_SNP1_8 = {
        acronym: 'Snp 1.8',
        volpages: 'Snp 25',
        uid: 'snp1.8',
        blurb: null,
        difficulty: null,
        original_title: 'Metta Sutta',
        root_lang: 'pli',
        type: 'text',
        from: null,
        translated_title: 'Loving-kindness',
        parallel_count: 1,
        biblio: null,
        num: 8,
    };
    const SUTTAPLEX_AN2_12_2021 = {
        acronym: null,
        uid: 'an2.11-20',
        blurb: null,
        difficulty: null,
        original_title: 'Adhikaraṇavagga',
        root_lang: 'pli',
        type: 'leaf',
        from: null,
        translated_title: 'Disciplinary Issues ',
        parallel_count: 7,
        biblio: null,
    };
    const SUTTAPLEX_AN2_12 = {
        acronym: null,
        volpages: null,
        uid: 'an2.11-20',
        blurb: null,
        difficulty: null,
        original_title: 'Adhikaraṇa Vagga',
        root_lang: 'pli',
        type: 'text',
        from: null,
        translated_title: '',
        parallel_count: 7,
        biblio: null,
        num: 1,
    };
    const SUTTAPLEX_AN2_12_2019 = {
        acronym: null,
        volpages: {
            'pts-vp-pli1ed': 'AN i 53',
        },
        uid: 'an2.11-20',
        blurb: null,
        difficulty: null,
        original_title: 'Adhikaraṇa Vagga',
        root_lang: 'pli',
        type: 'text',
        from: null,
        translated_title: '',
        parallel_count: 7,
        biblio: null,
        num: 1,
    };
    const SUTTAPLEX_EA12_1_2021 = {
        acronym: 'EA 12.1',
        volpages: 'T ii 568a01',
        uid: 'ea12.1',
        blurb: null,
        difficulty: null,
        original_title: '?',
        root_lang: 'lzh',
        type: 'leaf',
        from: null,
        translated_title: 'The One Way In Sūtra',
        parallel_count: 8,
        biblio: null,
    };
    const SUTTAPLEX_EA12_1 = {
        acronym: 'EA 12.1//T 125.12.1',
        volpages: 'T ii 568a01',
        uid: 'ea12.1',
        blurb: null,
        difficulty: null,
        original_title: ' ?',
        root_lang: 'lzh',
        type: 'text',
        from: null,
        translated_title: 'The One Way In Sūtra',
        parallel_count: 8,
        biblio: null,
        num: 96,
    };
    const TRANSLATIONS_SNP1_8_2021 = {
        author: 'Laurence Khantipalo Mills',
        author_short: 'Mills',
        author_uid: 'mills',
        id: 'en_snp1.8_mills',
        lang: 'en',
        lang_name: 'English',
        segmented: false,
        title: 'Loving-kindness',
        is_root: false,
        publication_date: "2015",
        volpage: null,
    };
    const TRANSLATIONS_SNP1_8 = [{
        author: 'Laurence Khantipalo Mills',
        author_short: 'Mills',
        author_uid: 'mills',
        id: 'en_snp1.8_mills',
        lang: 'en',
        lang_name: 'English',
        segmented: false,
        title: 'Loving-kindness',
    }];
    const TRANSLATIONS_SNP1_8_2019 = [{
        author: 'Laurence Khantipalo Mills',
        author_short: 'Mills',
        author_uid: 'mills',
        id: 'en_snp1.8_mills',
        lang: 'en',
        lang_name: 'English',
        segmented: false,
        title: 'Loving-kindness',
        is_root: false,
        publication_date: "2015",
        volpage: null,
    }];
    const TRANSLATIONS_EA12_1_2021 = [{
        author: 'Thích Nhất Hạnh, Annabel Laity',
        author_short: 'Nhất Hạnh …',
        author_uid: 'nhat_hanh-laity',
        id: 'en_ea12.1_nhat_hanh-laity',
        lang: 'en',
        lang_name: 'English',
        segmented: false,
        title: 'The One Way In Sūtra',
        is_root: false,
        publication_date: null,
        volpage: null,
    }];
    const TRANSLATIONS_EA12_1 = [{
        author: 'Thích Nhất Hạnh, Annabel Laity',
        author_short: 'Nhất Hạnh …',
        author_uid: 'nhat_hanh-laity',
        id: 'en_ea12.1_nhat_hanh-laity',
        lang: 'en',
        lang_name: 'English',
        segmented: false,
        title: 'The One Way In Sūtra',
    }];
    const TRANSLATIONS_EA12_1_2019 = [{
        author: 'Thích Nhất Hạnh, Annabel Laity',
        author_short: 'Nhất Hạnh …',
        author_uid: 'nhat_hanh-laity',
        id: 'en_ea12.1_nhat_hanh-laity',
        lang: 'en',
        lang_name: 'English',
        segmented: false,
        title: 'The One Way In Sūtra',
        is_root: false,
        publication_date: null,
        volpage: null,
    }];
    const DEADSERVER = {
        apiUrl: 'https://127.0.0.1:911/api',
        readFile: false, // avoid cached response for worst case test
    };
    this.timeout(10*1000);

    it("default ctor", async()=>{
        var sca = await new ScApi();
        should(sca.apiUrl).equal('https://suttacentral.net/api');
        should(sca.apiUrl2).equal('https://staging.suttacentral.net/api');
    });
    it("custom ctor", async()=>{
        let apiUrl = 'test-apiUrl';
        let apiUrl2 = 'test-apiUrl2';
        var sca = await new ScApi({ apiUrl, apiUrl2 });
        should(sca.apiUrl).equal(apiUrl);
        should(sca.apiUrl2).equal(apiUrl2);
    });
    it("TESTTESTloadLegacySutta(...) => dn33", async()=>{
        var sca = await new ScApi().initialize();
        var opts = {
            "scid":"dn33",
            "id":"dn33",
            "translator":"sujato",
        }
        var sutta = await sca.loadLegacySutta(opts);
        should.deepEqual(Object.keys(sutta).sort(), [
            'translation', 'sutta_uid', 'author_uid', 
            'segmented', 'segments', 'suttaplex',
        ].sort());
        let { segments } = sutta;
        should(segments.length).equal(0); // it's  not legacy
        should.deepEqual(sutta.segmented, true);
        var suttaplex = sutta.suttaplex;
        should(suttaplex.acronym).equal('DN 33');
        var translations = suttaplex.translations;
        should(translations).instanceOf(Array);
        should(sutta.translation.author_uid).equal('sujato');
    });
    it("TESTTESTloadLegacySutta(...) => an10.2/pt/beisert", async()=>{
        var sca = await new ScApi().initialize();
        var opts = {
            "scid":"an10.2",
            "language":"pt",
            "id":"an10.2",
            "translator":"beisert",
        }
        var sutta = await sca.loadLegacySutta(opts);
        should.deepEqual(sutta.segmented, false);
        var suttaplex = sutta.suttaplex;
        should(suttaplex.acronym).equal('AN 10.2');
        var translations = suttaplex.translations;
        should(translations).instanceOf(Array);
        should(translations[0].author_uid).equal('beisert');
    });
    it("loadLegacySutta(...) => deadserver an10.2/pt/beisert", async()=>{
        var sca = await new ScApi(DEADSERVER).initialize();
        sca.logLevel = 'warn';
        var opts = {
            "scid":"an10.2",
            "language":"pt",
            "id":"an10.2",
            "translator":"beisert",
        }
        sca.warn('EXPECTED WARN (BEGIN)');
        var sutta = await sca.loadLegacySutta(opts);
        should(sca.lastLog('warn')).match(/RETRY.*suttacentral.net.*ECONNREFUSED/);
        sca.warn('EXPECTED WARN (END)');
        should.deepEqual(sutta.segmented, false);
        var suttaplex = sutta.suttaplex;
        should(suttaplex.acronym).equal('AN 10.2');
        var translations = suttaplex.translations;
        should(translations).instanceOf(Array);
        should(translations[0].author_uid).equal('beisert');
        let deadMemo1 = path.join(APP_DIR,
            'api/sc.suttaplex/3a/3a10d005b354faae124851c4242139ff.json');
        should(fs.existsSync(deadMemo1)).equal(false);
        let deadMemo2 = path.join(APP_DIR,
            'api/sc.suttaplex/33/33f16195a6a5adf83f89753c89e2db11.json');
        should(fs.existsSync(deadMemo2)).equal(false);
    });
    it("loadLegacySutta(...) => legacy german sutta", async()=>{
        var sca = await new ScApi().initialize();
        var scid = 'dn1';
        var language = 'de';
        var sutta = await sca.loadLegacySutta(scid,language);
        should.deepEqual(sutta.segmented, false);
        var suttaplex = sutta.suttaplex;
        should(suttaplex.acronym).equal('DN 1');
        var translations = suttaplex.translations;
        should(translations).instanceOf(Array);
        should(translations[0].author_uid).equal('franke');

        var sutta = await sca.loadLegacySutta(scid, language, 'sujato');
        should(sutta).equal(null);
    });
    it("loadLegacySutta(...) => list of Snp1.8 en translations", async()=>{
        var sca = await new ScApi().initialize();
        var scid = 'snp1.8';
        var language = 'en';
        var sutta = await sca.loadLegacySutta('snp1.8','en');
        should.deepEqual(sutta.segmented, false);
        var suttaplex = sutta.suttaplex;
        should(suttaplex).properties(SUTTAPLEX_SNP1_8_2021);
        var translations = suttaplex.translations;
        should(translations).instanceOf(Array);
        should.deepEqual(translations[0], TRANSLATIONS_SNP1_8_2021); 
    });
    it("TESTTESTloadLegacySutta(...) => en translations for Snp1.8", async()=>{
        var sca = await new ScApi().initialize();
        var language = 'en';
        var sutta = await sca.loadLegacySutta({
            scid:'snp1.8',
            language: 'en', 
            translator: 'mills'
        });
        should.deepEqual(Object.keys(sutta).sort(), [
            'translation', 'sutta_uid', 'author_uid', 
            'segmented', 'segments', 'metaarea', 'suttaplex', 'lang',
        ].sort());
        should.deepEqual(sutta.segmented, false);

        var suttaplex = sutta.suttaplex;
        should(suttaplex).properties(SUTTAPLEX_SNP1_8_2021);
        var translations = suttaplex.translations;
        should(translations).instanceOf(Array);
        should.deepEqual(translations[0], TRANSLATIONS_SNP1_8_2021);
        var translation = suttaplex.translations[0];
        var segments = sutta.segments;
        var i = 0;
        should(segments[i].scid).match(/snp1.8:0.1/um);
        should(segments[i].en).match(/Sutta Nipāta 1/um);
        i += 1;
        should(segments[i].scid).match(/snp1.8:0.2/um);
        should(segments[i].en).match(/Loving-kindness/um);
        should(segments[i].pli).match(/Mettasutta/um);
        should(segments.length).equal(17);
    });
    it("loadLegacySutta(...) => en translations for ea12.1", async()=>{
        var sca = await new ScApi().initialize();
        var language = 'en';
        var sutta = await sca.loadLegacySutta({
            scid:'ea12.1',
            language: 'en', 
        });
        should.deepEqual(Object.keys(sutta).sort(), [
            'translation', 'sutta_uid', 'author_uid', 
            'segments', 'segmented', 'metaarea', 'suttaplex', 'lang',
        ].sort());
        should.deepEqual(sutta.segmented, false);

        var suttaplex = sutta.suttaplex;
        should(suttaplex).properties(SUTTAPLEX_EA12_1_2021);
        var translations = suttaplex.translations;
        should(translations).instanceOf(Array);
        should.deepEqual(translations, TRANSLATIONS_EA12_1_2021);
        var translation = suttaplex.translations[0];
        var segments = sutta.segments;
        var i = 0;
        should(segments[i].scid).match(/ea12.1:0.1/um);
        should(segments[i].en).match(/Ekottarikāgama \(1st\) 12.1/um);
        i += 1;
        should(segments[i].scid).match(/ea12.1:0.2/um);
        should(segments[i].en).match(/The One Way In Sūtra/um);
        should(segments[i].lzh).match(/ ?/um);
        i += 1;
        should(segments[i].scid).match(/ea12.1:1.0.1$/um);
        should(segments[i].en).match(/I heard these words of the Buddha/um);
        should(segments.length).equal(56);
    });
    it("loadLegacySutta(opts) returns Error if sutta not found", async()=>{
        var sca = await new ScApi().initialize();

        // implausible sutta
        var err = null;
        try {
            logger.warn("EXPECTED WARNING (BEGIN)");
            var result = await sca.loadLegacySutta('nonsense-sutta-id');
            console.error(result);
        } catch(e) {
            err = e;
        }
        logger.warn("EXPECTED WARNING (END)");
        should(err).instanceOf(Error);

        // plausible but not existing
        var err = null;
        try {
            logger.warn("EXPECTED WARN (BEGIN)");
            var result = await sca.loadLegacySutta('mn911');
            console.error(result);
        } catch(e) {
            err = e;
        }
        logger.warn("EXPECTED WARN (END)");
        should(err).instanceOf(Error);

        // plausible but not existing
        var err = null;
        try {
            logger.warn("EXPECTED WARN (BEGIN)");
            var result = await sca.loadLegacySutta('an2.911');
            //console.error(result);
        } catch(e) {
            err = e;
        }
        should(err).instanceOf(Error);
        logger.warn("EXPECTED WARN (END)");
    });
    it("loadLegacySutta(...) => an2.12 as part of an2.11-20", async()=>{
        var sca = await new ScApi().initialize();
        var language = 'en';
        var sutta = await sca.loadLegacySutta('an2.12');
        should.deepEqual(sutta.segmented, true);
        should(sutta.suttaplex.uid).equal('an2.11-20');
        should(sutta.sutta_uid).equal('an2.11-20');
        var suttaplex = sutta.suttaplex;
        should(suttaplex).properties(SUTTAPLEX_AN2_12_2021);
        var translations = suttaplex.translations;
        should(translations).instanceOf(Array);
        should(translations.length).equal(2); // sujato, thanissaro
        var segments = sutta.segments;
        should(segments.length).equal(0);
        should(sutta.metaarea).equal(undefined);
    });
    it("expandAbbreviation(abbr) expands abbreviation", async()=>{
        var sca = await new ScApi().initialize();
        should.deepEqual(sca.expandAbbreviation('sk'), [
          "Sk",
          "Sekhiya"
        ]);
    });
    it("loadLegacySutta(opts) loads MN79", async()=>{
        var sca = await new ScApi().initialize();
        var sutta = await sca.loadLegacySutta("mn79", "en", "sujato");

        should(sutta.segments.length).equal(0);
        should.deepEqual(Object.keys(sutta).sort(), [
            'translation', 'sutta_uid', 'author_uid', 
            'segmented', 'segments', 'suttaplex', 
        ].sort());
    });
    it("TESTTESTloadLegacySutta(...)=>refreshes api folder", async()=>{
        // Force writing of api cache
        var sca = await new ScApi({
            readMem: false,
            readFile: false,
        }).initialize();

        var ms0 = Date.now();
        var mn121 = await sca.loadLegacySutta("mn121");
        should(mn121.acronym).equal(`MN 121`);
        should(mn121.original_title).equal('Cūḷasuññatasutta');
        should(mn121.translations.length).above(0);
        var mn122 = await sca.loadLegacySutta("mn122");
        should(mn122.acronym).equal(`MN 122`);
        should(mn122.original_title).equal('Mahāsuññatasutta');
        should(mn122.translations.length).above(0);
        var ms1 = Date.now();
        should(ms1-ms0).above(150); //slow
    });
    it("TESTTESTloadLegacySutta(...)=>suttaplex", async()=>{
        // normal cache use
        var sca = await new ScApi().initialize();

        var ms0 = Date.now();
        var mn121 = await sca.loadLegacySutta("mn121");
        should(mn121.acronym).equal(`MN 121`);
        should(mn121.original_title).equal('Cūḷasuññatasutta');
        should(mn121.translations.length).above(0);
        var ms1 = Date.now();
        var mn121 = await sca.loadLegacySutta("mn121");
        should(mn121.acronym).equal(`MN 121`);
        should(mn121.original_title).equal('Cūḷasuññatasutta');
        should(mn121.translations.length).above(0);
        var ms2 = Date.now();
        should(ms1-ms0).below(300); // read file
        should(ms2-ms1).below(30); // read memory
        
    });
    it("TESTTESTloadLegacySutta(...)=>DN3 suttaplex", async()=>{
        var sca = await new ScApi().initialize();
        var dn3 = await sca.loadLegacySutta("dn3");
        should(dn3.acronym).equal(`DN 3`);
        should(dn3.original_title).equal('Ambaṭṭhasutta');
        should(dn3.translations.length).above(0);
    });
    it("TESTTESTloadLegacySutta(...)=>sn46.55 suttaplex", async()=>{
        var sca = await new ScApi().initialize();
        var scid = 'sn46.55';
        var acronym = `SN 46.55`;
        var original_title = 'Saṅgāravasutta';

        var spx = await sca.loadLegacySutta(scid, 'de');
        should(spx).properties({acronym, original_title});
        should(spx.translations.length).equal(2); // German translations

        // TODO: 20210325 ashinsarana suttas not in publishing
        // This should not affect subsequent query
        //var spx = await sca.loadLegacySutta(scid, 'cs');
        //should(spx).properties({acronym, original_title});
        //should(spx.translations.length).equal(0); // no Czech

        // Should be identical to first query
        var spx = await sca.loadLegacySutta(scid, 'de');
        should(spx).properties({acronym, original_title});
        should(spx.translations.length).equal(2); // German translations

    });
    it("suttaFromHtml(html, opts) parses HTML", async()=>{
        var sca = await new ScApi().initialize();
        var text = [
            'hello',
            'there\n',
        ].join('\n');
        var sutta = sca.suttaFromHtml(text, {
            uid: 'sn12.23',
            suttaplex: {
                uid: 'sn12.23',
                original_title: 'Sudattasutta',
            },
            translation: {
                title: '8. Mit Sudatta',
                author_uid: 'sabbamitta',
                lang: 'de',
            },
        });
        should.deepEqual(Object.keys(sutta).sort(), [
            'author_uid', 'segmented', 'segments',
            'sutta_uid', 'lang', 'translation',
            'metaarea',
        ].sort());
        should(sutta.author_uid).equal('sabbamitta');
        should(sutta.sutta_uid).equal('sn12.23');
        should(sutta.segments.length).equal(4);
        should.deepEqual(sutta.segments[0], {
            scid: 'sn12.23:0.1',
            de: 'Saṃyutta Nikāya 12.23',
        });
        should.deepEqual(sutta.segments[1], {
            scid: 'sn12.23:0.2',
            de: '8. Mit Sudatta',
            pli: 'Sudattasutta',
        });
        should.deepEqual(sutta.segments[2], {
            scid: 'sn12.23:1.0.1',
            de: 'hello',
        });
        should.deepEqual(sutta.segments[3], {
            scid: 'sn12.23:1.0.2',
            de: 'there',
        });
    });
})
