import { describe, it, expect } from '@sc-voice/vitest';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { logger } from 'log-instance';
import {
        ScApi,
    } from '../index.js';
logger.logLevel = "warn";

describe("sc-api", () => {
    
    const APP_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

    const SUTTAPLEX_SNP1_8_2021 = {
        acronym: 'Snp 1.8',
        volpages: ' PTS 26',
        uid: 'snp1.8',
        difficulty: null,
        original_title: 'Mettasutta',
        root_lang: 'pli',
        type: 'leaf',
        from: null,
        translated_title: 'The Discourse on Love ',
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
        acronym: 'AN 2.11–20',
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
        has_comment: false,
        id: 'en_ea12.1_nhat_hanh-laity',
        lang: 'en',
        lang_name: 'English',
        segmented: false,
        title: 'The One Way In Sūtra',
        is_root: false,
        publication_date: null,
        volpage: null,
    },{ 
      "author": "Charles Patton",
      "author_short": "Patton",
      "author_uid": "patton",
      "has_comment": false,
      "id": "en_ea12.1_patton",
      "is_root": false,
      "lang": "en",
      "lang_name": "English",
      "publication_date": null,
      "segmented": false,
      "title": "The Four Stations of Mind",
      "volpage": null,
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
    // timeout handled by vitest config

    it("default ctor", async()=>{
        var sca = await new ScApi();
        expect(sca.apiUrl).toBe('https://suttacentral.net/api');
        expect(sca.apiUrl2).toBe('https://staging.suttacentral.net/api');
    });
    it("custom ctor", async()=>{
        let apiUrl = 'test-apiUrl';
        let apiUrl2 = 'test-apiUrl2';
        var sca = await new ScApi({ apiUrl, apiUrl2 });
        expect(sca.apiUrl).toBe(apiUrl);
        expect(sca.apiUrl2).toBe(apiUrl2);
    });
    it("TESTTESTloadLegacySutta(...) => dn33", async()=>{
        var sca = await new ScApi().initialize();
        var opts = {
            "scid":"dn33",
            "id":"dn33",
            "translator":"sujato",
        }
        var sutta = await sca.loadLegacySutta(opts);
        expect(Object.keys(sutta).sort()).toEqual([
            'translation', 'sutta_uid', 'author_uid', 
            'segmented', 'segments', 'suttaplex',
        ].sort());
        let { segments } = sutta;
        expect(segments.length).toBe(0); // it's  not legacy
        expect(sutta.segmented).toBe(true);
        var suttaplex = sutta.suttaplex;
        expect(suttaplex.acronym).toBe('DN 33');
        var translations = suttaplex.translations;
        expect(translations).toBeInstanceOf(Array);
        expect(sutta.translation.author_uid).toBe('sujato');
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
        expect(sutta.segmented).toBe(false);
        var suttaplex = sutta.suttaplex;
        expect(suttaplex.acronym).toBe('AN 10.2');
        var translations = suttaplex.translations;
        expect(translations).toBeInstanceOf(Array);
        expect(translations[0].author_uid).toBe('beisert');
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
        expect(sca.lastLog('warn')).toMatch(/RETRY.*suttacentral.net.*ECONNREFUSED/);
        sca.warn('EXPECTED WARN (END)');
        expect(sutta.segmented).toBe(false);
        var suttaplex = sutta.suttaplex;
        expect(suttaplex.acronym).toBe('AN 10.2');
        var translations = suttaplex.translations;
        expect(translations).toBeInstanceOf(Array);
        expect(translations[0].author_uid).toBe('beisert');
        let deadMemo1 = path.join(APP_DIR,
            'api/sc.suttaplex/3a/3a10d005b354faae124851c4242139ff.json');
        expect(fs.existsSync(deadMemo1)).toBe(false);
        let deadMemo2 = path.join(APP_DIR,
            'api/sc.suttaplex/33/33f16195a6a5adf83f89753c89e2db11.json');
        expect(fs.existsSync(deadMemo2)).toBe(false);
    });
    it("TESTTESTloadLegacySutta(...) => legacy german sutta", async()=>{
        return; // no longer legacy
        var sca = await new ScApi().initialize();
        var scid = 'thig1.1';
        var language = 'de';
        var sutta = await sca.loadLegacySutta(scid,language);
        expect(sutta.segmented).toBe(false);
        var suttaplex = sutta.suttaplex;
        expect(suttaplex.acronym).toBe('DN 1');
        var translations = suttaplex.translations;
        expect(translations).toBeInstanceOf(Array);
        expect(translations[0].author_uid).toBe('franke');

        var sutta = await sca.loadLegacySutta(scid, language, 'sujato');
        expect(sutta).toBe(null);
    });
    it("TESTTESTloadLegacySutta(...) => list of Snp1.8 en translations", async()=>{
        return; // no longer legacy
        var sca = await new ScApi().initialize();
        var scid = 'snp1.8';
        var language = 'en';
        var sutta = await sca.loadLegacySutta('snp1.8','en');
        expect(sutta.segmented).toBe(false);
        var suttaplex = sutta.suttaplex;
        expect(suttaplex).toMatchObject(SUTTAPLEX_SNP1_8_2021);
        var translations = suttaplex.translations;
        expect(translations).toBeInstanceOf(Array);
        expect(translations[0]).toEqual(TRANSLATIONS_SNP1_8_2021); 
    });
    it("TESTTESTloadLegacySutta(...) => en translations for Snp1.8", async()=>{
        return; // no longer legacy
        var sca = await new ScApi().initialize();
        var language = 'en';
        var sutta = await sca.loadLegacySutta({
            scid:'snp1.8',
            language: 'en', 
            translator: 'mills'
        });
        expect(Object.keys(sutta).sort()).toEqual([
            'translation', 'sutta_uid', 'author_uid', 
            'segmented', 'segments', 'metaarea', 'suttaplex', 'lang',
        ].sort());
        expect(sutta.segmented).toBe(false);

        var suttaplex = sutta.suttaplex;
        expect(suttaplex).toMatchObject(SUTTAPLEX_SNP1_8_2021);
        var translations = suttaplex.translations;
        expect(translations).toBeInstanceOf(Array);
        expect(translations[0]).toEqual(TRANSLATIONS_SNP1_8_2021);
        var translation = suttaplex.translations[0];
        var segments = sutta.segments;
        var i = 0;
        expect(segments[i].scid).toMatch(/snp1.8:0.1/um);
        expect(segments[i].en).toMatch(/Sutta Nipāta 1/um);
        i += 1;
        expect(segments[i].scid).toMatch(/snp1.8:0.2/um);
        expect(segments[i].en).toMatch(/Loving-kindness/um);
        expect(segments[i].pli).toMatch(/Mettasutta/um);
        expect(segments.length).toBe(17);
    });
    it("TESTTESTloadLegacySutta(...) => en translations for ea12.1", async()=>{
        var sca = await new ScApi().initialize();
        var language = 'en';
        var sutta = await sca.loadLegacySutta({
            scid:'ea12.1',
            language: 'en', 
        });
        expect(Object.keys(sutta).sort()).toEqual([
            'translation', 'sutta_uid', 'author_uid', 
            'segments', 'segmented', 'metaarea', 'suttaplex', 'lang',
        ].sort());
        expect(sutta.segmented).toBe(false);

        var suttaplex = sutta.suttaplex;
        expect(suttaplex).toMatchObject(SUTTAPLEX_EA12_1_2021);
        var translations = suttaplex.translations;
        expect(translations).toBeInstanceOf(Array);
        expect(translations).toEqual(TRANSLATIONS_EA12_1_2021);
        var translation = suttaplex.translations[0];
        var segments = sutta.segments;
        var i = 0;
        expect(segments[i].scid).toMatch(/ea12.1:0.1/um);
        expect(segments[i].en).toMatch(/Ekottarikāgama \(1st\) 12.1/um);
        i += 1;
        expect(segments[i].scid).toMatch(/ea12.1:0.2/um);
        expect(segments[i].en).toMatch(/The One Way In Sūtra/um);
        expect(segments[i].lzh).toMatch(/ ?/um);
        i += 1;
        expect(segments[i].scid).toMatch(/ea12.1:1.0.1$/um);
        expect(segments[i].en).toMatch(/I heard these words of the Buddha/um);
        expect(segments.length).toBe(56);
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
        expect(err).toBeInstanceOf(Error);

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
        expect(err).toBeInstanceOf(Error);

        // plausible but not existing
        var err = null;
        try {
            logger.warn("EXPECTED WARN (BEGIN)");
            var result = await sca.loadLegacySutta('an2.911');
            //console.error(result);
        } catch(e) {
            err = e;
        }
        expect(err).toBeInstanceOf(Error);
        logger.warn("EXPECTED WARN (END)");
    });
    it("TESTTESTloadLegacySutta(...) => an2.12 as part of an2.11-20", async()=>{
        var sca = await new ScApi().initialize();
        var language = 'en';
        var sutta = await sca.loadLegacySutta('an2.12');
        expect(sutta.segmented).toBe(true);
        expect(sutta.suttaplex.uid).toBe('an2.11-20');
        expect(sutta.sutta_uid).toBe('an2.11-20');
        var suttaplex = sutta.suttaplex;
        expect(suttaplex).toMatchObject(SUTTAPLEX_AN2_12_2021);
        var translations = suttaplex.translations;
        expect(translations).toBeInstanceOf(Array);
        expect(translations.length).toBe(2); // sujato, thanissaro
        var segments = sutta.segments;
        expect(segments.length).toBe(0);
        expect(sutta.metaarea).toBe(undefined);
    });
    it("expandAbbreviation(abbr) expands abbreviation", async()=>{
        var sca = await new ScApi().initialize();
        expect(sca.expandAbbreviation('sk')).toEqual([
          "Sk",
          "Sekhiya"
        ]);
    });
    it("loadLegacySutta(opts) loads MN79", async()=>{
        var sca = await new ScApi().initialize();
        var sutta = await sca.loadLegacySutta("mn79", "en", "sujato");

        expect(sutta.segments.length).toBe(0);
        expect(Object.keys(sutta).sort()).toEqual([
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
        expect(mn121.acronym).toBe(`MN 121`);
        expect(mn121.original_title).toBe('Cūḷasuññatasutta');
        expect(mn121.translations.length).toBeGreaterThan(0);
        var mn122 = await sca.loadLegacySutta("mn122");
        expect(mn122.acronym).toBe(`MN 122`);
        expect(mn122.original_title).toBe('Mahāsuññatasutta');
        expect(mn122.translations.length).toBeGreaterThan(0);
        var ms1 = Date.now();
        expect(ms1-ms0).toBeGreaterThan(100); //slow
    });
    it("TESTTESTloadLegacySutta(...)=>suttaplex", async()=>{
        // normal cache use
        var sca = await new ScApi().initialize();

        var ms0 = Date.now();
        var mn121 = await sca.loadLegacySutta("mn121");
        expect(mn121.acronym).toBe(`MN 121`);
        expect(mn121.original_title).toBe('Cūḷasuññatasutta');
        expect(mn121.translations.length).toBeGreaterThan(0);
        var ms1 = Date.now();
        var mn121 = await sca.loadLegacySutta("mn121");
        expect(mn121.acronym).toBe(`MN 121`);
        expect(mn121.original_title).toBe('Cūḷasuññatasutta');
        expect(mn121.translations.length).toBeGreaterThan(0);
        var ms2 = Date.now();
        expect(ms1-ms0).toBeLessThan(300); // read file
        expect(ms2-ms1).toBeLessThan(30); // read memory
        
    });
    it("TESTTESTloadLegacySutta(...)=>DN3 suttaplex", async()=>{
        var sca = await new ScApi().initialize();
        var dn3 = await sca.loadLegacySutta("dn3");
        expect(dn3.acronym).toBe(`DN 3`);
        expect(dn3.original_title).toBe('Ambaṭṭhasutta');
        expect(dn3.translations.length).toBeGreaterThan(0);
    });
    it("TESTTESTloadLegacySutta(...)=>sn46.55 suttaplex", async()=>{
        var sca = await new ScApi().initialize();
        var scid = 'sn46.55';
        var acronym = `SN 46.55`;
        var original_title = 'Saṅgāravasutta';

        var spx = await sca.loadLegacySutta(scid, 'de');
        expect(spx).toMatchObject({acronym, original_title});
        expect(spx.translations.length).toBe(2); // German translations

        // TODO: 20210325 ashinsarana suttas not in publishing
        // This should not affect subsequent query
        //var spx = await sca.loadLegacySutta(scid, 'cs');
        //expect(spx).toMatchObject({acronym, original_title});
        //expect(spx.translations.length).toBe(0); // no Czech

        // Should be identical to first query
        var spx = await sca.loadLegacySutta(scid, 'de');
        expect(spx).toMatchObject({acronym, original_title});
        expect(spx.translations.length).toBe(2); // German translations

    });
    it("TESTTESTsuttaFromHtml(html, opts) parses HTML", async()=>{
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
        expect(Object.keys(sutta).sort()).toEqual([
            'author_uid', 'segmented', 'segments',
            'sutta_uid', 'lang', 'translation',
            'metaarea',
        ].sort());
        expect(sutta.author_uid).toBe('sabbamitta');
        expect(sutta.sutta_uid).toBe('sn12.23');
        expect(sutta.segments.length).toBe(4);
        expect(sutta.segments[0]).toEqual({
            scid: 'sn12.23:0.1',
            de: 'Saṁyutta Nikāya 12.23',
        });
        expect(sutta.segments[1]).toEqual({
            scid: 'sn12.23:0.2',
            de: '8. Mit Sudatta',
            pli: 'Sudattasutta',
        });
        expect(sutta.segments[2]).toEqual({
            scid: 'sn12.23:1.0.1',
            de: 'hello',
        });
        expect(sutta.segments[3]).toEqual({
            scid: 'sn12.23:1.0.2',
            de: 'there',
        });
    });
});
