import { describe, it, expect } from '@sc-voice/vitest';
import { logger } from 'log-instance';
logger.logLevel = 'warn';
import { SuttaCentralId } from '../index.js';

describe("sutta-central-id", function() {

    it("SuttaCentralId(scid) is ctor", function() {
        // sutta id
        var scid = new SuttaCentralId('mn1');
        expect(scid).toBeInstanceOf(SuttaCentralId);
        expect(scid.toString()).toBe('mn1');

        // segment id
        var scid = new SuttaCentralId('mn1:2.3.4');
        expect(scid).toBeInstanceOf(SuttaCentralId);
        expect(scid.toString()).toBe('mn1:2.3.4');

        // default ctor
        var scid = new SuttaCentralId();
        expect(scid).toBeInstanceOf(SuttaCentralId);
        expect(scid.toString()).toBe(null);
    });
    it("normalizeSuttaId(id) returns normalized sutta_uid", async()=>{
        expect(SuttaCentralId.normalizeSuttaId('an2.12')).toBe('an2.11-20');
        expect(SuttaCentralId.normalizeSuttaId('an1.21-30')).toBe('an1.21-30');
        expect(SuttaCentralId.normalizeSuttaId('AN 1.21-30')).toBe('an1.21-30');
        expect(SuttaCentralId.normalizeSuttaId(' AN  1.21-30 ')).toBe('an1.21-30');
        expect(SuttaCentralId.normalizeSuttaId('An 1.21-30')).toBe('an1.21-30');
        expect(SuttaCentralId.normalizeSuttaId('Ds 1.1')).toBe('ds1.1');
        expect(SuttaCentralId.normalizeSuttaId('fear')).toBe(null);
        expect(SuttaCentralId.normalizeSuttaId('root of suffering')).toBe(null);
        expect(SuttaCentralId.normalizeSuttaId('1986')).toBe(null);
        expect(SuttaCentralId.normalizeSuttaId(' 1986')).toBe(null);
    });
    it("compareLow(a,b) compares sutta file names", function(){
        var cmp = SuttaCentralId.compareLow;

        // misc
        expect(cmp('an1.1', 'an2.11-20')).toBe(-1);
        expect(cmp('an1.1', 'an2.011-20')).toBe(-1);
        expect(cmp('an1.100', 'an2.11-20')).toBe(-1);
        expect(cmp('an1.100', 'an2.011-020')).toBe(-1);
        expect(cmp('an2.1', 'an2.11-20')).toBe(-10);
        expect(cmp('an2.1', 'an2.011-020')).toBe(-10);
        expect(cmp('an2.5', 'an2.11-20')).toBe(-6);
        expect(cmp('an2.10', 'an2.11-20')).toBe(-1);
        expect(cmp('an2.11', 'an2.11-20')).toBe(0);
        expect(cmp('an2.21', 'an2.11-20')).toBe(10);
        expect(cmp('an2.100', 'an2.11-20')).toBe(89);
        expect(cmp('an3.1', 'an2.11-20')).toBe(1);
        expect(cmp('an3.1', 'an2.011-020')).toBe(1);
        expect(cmp('an1', 'dn2')).toBe(-1);
        expect(cmp('an9.1', 'dn2')).toBe(-1);
        expect(cmp('dn2', 'mn1')).toBe(-1);
        expect(cmp('an2.1-10', 'an2.11-20')).toBe(-10);

        // Standalone
        expect(cmp('mn33', 'mn33')).toBe(0);
        expect(cmp('mn33', 'mn34')).toBe(-1);
        expect(cmp('mn34', 'mn33')).toBe(1);

        // collection
        expect(cmp( 'sn/en/sujato/sn22.1', 'an/en/sujato/an22.1')).toBe(1);
        expect(cmp( 'an/en/sujato/an22.1', 'sn/en/sujato/sn22.1')).toBe(-1);
        expect(cmp( 'xx/en/sujato/sn22.1', 'xx/en/sujato/an22.1')).toBe(1);
        expect(cmp( 'xx/en/sujato/an22.1', 'xx/en/sujato/sn22.1')).toBe(-1);

        // major number
        expect(cmp( 'sn/en/sujato/sn29.1', 'sn/en/sujato/sn22.1')).toBe(7);
        expect(cmp( 'sn/en/sujato/sn22.1', 'sn/en/sujato/sn29.1')).toBe(-7);

        // subchapter numbering
        expect(cmp( 'sn/en/sujato/sn30.1', 'sn/en/sujato/sn30.2')).toBe(-1);
        expect(cmp( 'sn/en/sujato/sn29.1', 'sn/en/sujato/sn29.10')).toBe(-9);
        expect(cmp( 'sn/en/sujato/sn29.10', 'sn/en/sujato/sn29.1')).toBe(9);
        expect(cmp( 'sn/en/sujato/sn29.1', 'sn/en/sujato/sn29.11-20')).toBe(-10);
        expect(cmp( 'sn/en/sujato/sn29.11-20', 'sn/en/sujato/sn29.1')).toBe(10);
        expect(cmp( 'sn/en/sujato/sn29.10', 'sn/en/sujato/sn29.11-20')).toBe(-1);
        expect(cmp( 'sn/en/sujato/sn29.11-20', 'sn/en/sujato/sn29.10')).toBe(1);

        // ranges
        expect(cmp('sn29.11-20', 'sn29.11-20')).toBe(0);
        expect(cmp('sn29.11-20', 'sn29.10')).toBe(1);
        expect(cmp('sn29.11-20', 'sn29.11')).toBe(0);
        expect(cmp('sn29.11-20', 'sn29.12')).toBe(-1);
        expect(cmp('sn29.21', 'sn29.20')).toBe(1);
        expect(cmp('sn29.21', 'sn29.21')).toBe(0);
        expect(cmp('sn29.21', 'sn29.22')).toBe(-1);

        expect(cmp("an1.1-10", "an1.1-10")).toBe(0);
        expect(cmp("an1.1", "an1.1-10")).toBe(0);
        expect(cmp("an1.10", "an1.1-10")).toBe(9);

    });
    it("compareHigh(a,b) compares sutta file names", function(){
        var cmp = SuttaCentralId.compareHigh;

        // misc
        expect(cmp('an1.1', 'an2.11-20')).toBe(-1);
        expect(cmp('an1.1', 'an2.011-20')).toBe(-1);
        expect(cmp('an1.100', 'an2.11-20')).toBe(-1);
        expect(cmp('an1.100', 'an2.011-020')).toBe(-1);
        expect(cmp('an2.1', 'an2.11-20')).toBe(-19);
        expect(cmp('an2.1', 'an2.011-020')).toBe(-19);
        expect(cmp('an2.5', 'an2.11-20')).toBe(-15);
        expect(cmp('an2.10', 'an2.11-20')).toBe(-10);
        expect(cmp('an2.11', 'an2.11-20')).toBe(-9);
        expect(cmp('an2.21', 'an2.11-20')).toBe(1);
        expect(cmp('an2.100', 'an2.11-20')).toBe(80);
        expect(cmp('an3.1', 'an2.11-20')).toBe(1);
        expect(cmp('an3.1', 'an2.011-020')).toBe(1);
        expect(cmp('an1', 'dn2')).toBe(-1);
        expect(cmp('an9.1', 'dn2')).toBe(-1);
        expect(cmp('dn2', 'mn1')).toBe(-1);
        expect(cmp('an2.1-10', 'an2.11-20')).toBe(-10);

        // Standalone
        expect(cmp('mn33', 'mn33')).toBe(0);
        expect(cmp('mn33', 'mn34')).toBe(-1);
        expect(cmp('mn34', 'mn33')).toBe(1);

        // collection
        expect(cmp( 'sn/en/sujato/sn22.1', 'an/en/sujato/an22.1')).toBe(1);
        expect(cmp( 'an/en/sujato/an22.1', 'sn/en/sujato/sn22.1')).toBe(-1);
        expect(cmp( 'xx/en/sujato/sn22.1', 'xx/en/sujato/an22.1')).toBe(1);
        expect(cmp( 'xx/en/sujato/an22.1', 'xx/en/sujato/sn22.1')).toBe(-1);

        // major number
        expect(cmp( 'sn/en/sujato/sn29.1', 'sn/en/sujato/sn22.1')).toBe(7);
        expect(cmp( 'sn/en/sujato/sn22.1', 'sn/en/sujato/sn29.1')).toBe(-7);

        // subchapter numbering
        expect(cmp( 'sn/en/sujato/sn30.1', 'sn/en/sujato/sn30.2')).toBe(-1);
        expect(cmp( 'sn/en/sujato/sn29.1', 'sn/en/sujato/sn29.10')).toBe(-9);
        expect(cmp( 'sn/en/sujato/sn29.10', 'sn/en/sujato/sn29.1')).toBe(9);
        expect(cmp( 'sn/en/sujato/sn29.1', 'sn/en/sujato/sn29.11-20')).toBe(-19);
        expect(cmp( 'sn/en/sujato/sn29.11-20', 'sn/en/sujato/sn29.1')).toBe(19);
        expect(cmp( 'sn/en/sujato/sn29.10', 'sn/en/sujato/sn29.11-20')).toBe(-10);
        expect(cmp( 'sn/en/sujato/sn29.11-20', 'sn/en/sujato/sn29.10')).toBe(10);

        // ranges
        expect(cmp('sn29.11-20', 'sn29.11-20')).toBe(0);
        expect(cmp('sn29.11-20', 'sn29.10')).toBe(10);
        expect(cmp('sn29.11-20', 'sn29.11')).toBe(9);
        expect(cmp('sn29.11-20', 'sn29.12')).toBe(8);
        expect(cmp('sn29.21', 'sn29.20')).toBe(1);
        expect(cmp('sn29.21', 'sn29.21')).toBe(0);
        expect(cmp('sn29.21', 'sn29.22')).toBe(-1);

        expect(cmp("an1.1-10", "an1.1-10")).toBe(0);
        expect(cmp("an1.1", "an1.1-10")).toBe(-9);
        expect(cmp("an1.10", "an1.1-10")).toBe(0);

    });
    it("sutta return sutta id", function() {
        var scid = new SuttaCentralId();
        expect(scid.sutta).toBe(null);

        var scid = new SuttaCentralId('mn1');
        expect(scid.sutta).toBe('mn1');

        var scid = new SuttaCentralId('mn1:2.3.4');
        expect(scid.sutta).toBe('mn1');
    });
    it("parent returns parent SuttaCentralId", function() {
        var scid = new SuttaCentralId('mn1');
        expect(scid.parent).toBeInstanceOf(SuttaCentralId);
        expect(scid.parent.scid).toBe(null);

        var scid = new SuttaCentralId('mn1:2.');
        expect(scid.parent).toBeInstanceOf(SuttaCentralId);
        expect(scid.parent.scid).toBe('mn1:');

        var scid = new SuttaCentralId('mn1:2.3.4');
        expect(scid.parent).toBeInstanceOf(SuttaCentralId);
        expect(scid.parent.scid).toBe('mn1:2.3.');
    });
    it("scidRegExp(pat) creates a wildcard pattern for finding scids", function() {
        // should be same as Linux file wildcards
        expect(SuttaCentralId.scidRegExp('mn1:2.3')).toEqual(/mn1:2\.3/);
        expect(SuttaCentralId.scidRegExp('mn1:2.*')).toEqual(/mn1:2\..*/);
        expect(SuttaCentralId.scidRegExp('mn1:2.?')).toEqual(/mn1:2\../);
        expect(SuttaCentralId.scidRegExp('mn1:[2-3].*')).toEqual(/mn1:[2-3]\..*/);
        expect(SuttaCentralId.scidRegExp('^mn1:2.3')).toEqual(/\^mn1:2\.3/);
        expect(SuttaCentralId.scidRegExp('mn1:2.3$')).toEqual(/mn1:2\.3\$/);
    });
    it("groups returns array of groups", function() {
        var scid = new SuttaCentralId('mn1:2.3.4');
        expect(scid.groups).toEqual(['2','3','4']);
        var scid = new SuttaCentralId('mn1');
        expect(scid.groups).toEqual(null);
    });

});
