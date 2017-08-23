"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BitSetException = (function () {
    function BitSetException(m) {
        this.name = "BitSetException";
        this.message = "";
        this.message = m;
    }
    BitSetException.prototype.toString = function () {
        return "{" + this.name + ": " + this.message + "}";
    };
    return BitSetException;
}());
exports.BitSetException = BitSetException;
var BitSetSerializeType;
(function (BitSetSerializeType) {
    BitSetSerializeType[BitSetSerializeType["OneZero"] = 0] = "OneZero";
    BitSetSerializeType[BitSetSerializeType["Hex"] = 1] = "Hex";
    BitSetSerializeType[BitSetSerializeType["Base64"] = 2] = "Base64";
})(BitSetSerializeType = exports.BitSetSerializeType || (exports.BitSetSerializeType = {}));
var BitSet = (function () {
    function BitSet(o) {
        if (o === undefined)
            throw new BitSetException("Constructor for 'undefined' is not implemented!");
        if (typeof o === 'number') {
            this.assertLEN(o);
            this.buf = new Uint8Array((o + 7) / 8 | 0);
            this.len = o;
        }
        else if (o instanceof BitSet) {
            this.init(o.buf);
            this.len = o.len;
        }
        else if (o instanceof Buffer) {
            this.init(new Uint8Array(o));
        }
        else if (o instanceof ArrayBuffer) {
            this.init(new Uint8Array(o));
        }
        else if (o instanceof Uint8Array) {
            this.init(o);
        }
        else {
            throw new BitSetException("Constructor for type: '" + typeof o + "' is not implemented!");
        }
    }
    BitSet.prototype.buffer = function () {
        return this.buf;
    };
    BitSet.create32bit = function (o) {
        var n = (o & 0xFFFFFFFF) >>> 0;
        var r = new BitSet(32);
        r.buf[0] = ((n >>> 0) & 0xFF);
        r.buf[1] = ((n >>> 8) & 0xFF);
        r.buf[2] = ((n >>> 16) & 0xFF);
        r.buf[3] = ((n >>> 24) & 0xFF);
        return r;
    };
    BitSet.create16bit = function (o) {
        var n = (o & 0xFFFF) >>> 0;
        var r = new BitSet(16);
        r.buf[0] = ((n >>> 0) & 0xFF);
        r.buf[1] = ((n >>> 8) & 0xFF);
        return r;
    };
    BitSet.create8bit = function (o) {
        var r = new BitSet(8);
        r.buf[0] = o & 0xFF;
        return r;
    };
    BitSet.prototype.init = function (o) {
        this.assertLEN(o.length * 8);
        this.len = o.length * 8;
        this.buf = new Uint8Array(o.length);
        for (var i = 0; i < o.length; i++)
            this.buf[i] = o[i];
    };
    BitSet.prototype.assertEQ = function (b) {
        if (this.len !== b.len)
            throw new BitSetException('Length of two BitSet objects not equal!');
    };
    BitSet.prototype.assertLEN = function (l) {
        if (l === undefined)
            throw new BitSetException('Length of BitSet not defined!');
        if (l <= 0)
            throw new BitSetException('Length of BitSet has to be greater than zero!');
        if (l !== (l | 0))
            throw new BitSetException('Length of BitSet has to be an integer value!');
        if (l % 8 !== 0)
            throw new BitSetException('Length of BitSet have to be the multiply of 8 bit!');
    };
    BitSet.prototype.assertIDX = function (n) {
        if (n != (n | 0))
            throw new BitSetException('Index has to be an integer value!');
        if (n < 0)
            throw new BitSetException("Index out of range: index has to be greater than 0!");
        if (n >= this.len)
            throw new BitSetException("Index out of range: index has to be lower than length!");
    };
    BitSet.prototype.clone = function () {
        return new BitSet(this);
    };
    BitSet.prototype.resize = function (l) {
        this.assertLEN(l);
        if (this.len !== l) {
            var tmpb = new Uint8Array(((l + 7) / 8) | 0);
            var tbuf = this.buf;
            for (var i = 0; (i < this.buf.length) && (i < tmpb.length); i++)
                tmpb[i] = tbuf[i];
            this.buf = tmpb;
            this.len = l;
        }
        return this;
    };
    BitSet.prototype.range = function (s, e) {
        if (e === undefined)
            e = this.len - 1;
        this.assertIDX(s);
        this.assertIDX(e);
        var l = e - s + 1;
        if (l % 8 !== 0)
            throw new BitSetException('Range has to be multiply of 8 bits!');
        var r = new BitSet(l);
        for (var i = s, idx = 0; i <= e; i++, idx++)
            if (this.isset(i) === true)
                r.set(idx);
        return null;
    };
    BitSet.prototype.length = function () {
        return this.len;
    };
    BitSet.prototype.set = function (s, e) {
        if (s !== undefined) {
            this.assertIDX(s);
            if (e == undefined) {
                this.buf[(s / 8) | 0] |= (0x01 << (s % 8));
            }
            else {
                this.assertIDX(e);
                for (var i = s; i <= e; i++)
                    this.buf[(i / 8) | 0] |= (0x01 << (i % 8));
            }
        }
        else
            this.buf.fill(0xFF);
        return this;
    };
    BitSet.prototype.unset = function (s, e) {
        if (s !== undefined) {
            this.assertIDX(s);
            if (e == undefined) {
                this.buf[s / 8] &= ~(0x01 << (s % 8));
            }
            else {
                this.assertIDX(e);
                for (var i = s; i <= e; i++)
                    this.buf[i / 8] &= ~(0x01 << (i % 8));
            }
        }
        else
            this.buf.fill(0);
        return this;
    };
    BitSet.prototype.and = function (b) {
        this.assertEQ(b);
        var tbuf = this.buf;
        var tlen = tbuf.length;
        var bbuf = b.buf;
        for (var i = 0; i < tlen; i++)
            tbuf[i] &= bbuf[i];
        return this;
    };
    BitSet.prototype.or = function (b) {
        this.assertEQ(b);
        var tbuf = this.buf;
        var tlen = tbuf.length;
        var bbuf = b.buf;
        for (var i = 0; i < tlen; i++)
            tbuf[i] |= bbuf[i];
        return this;
    };
    BitSet.prototype.xor = function (b) {
        this.assertEQ(b);
        var tbuf = this.buf;
        var tlen = tbuf.length;
        var bbuf = b.buf;
        for (var i = 0; i < tlen; i++)
            tbuf[i] ^= bbuf[i];
        return this;
    };
    BitSet.prototype.nand = function (b) {
        return this.and(b).not();
    };
    BitSet.prototype.nor = function (b) {
        return this.or(b).not();
    };
    BitSet.prototype.equal = function (b) {
        this.assertEQ(b);
        var tbuf = this.buf;
        var tlen = tbuf.length;
        var bbuf = b.buf;
        for (var i = 0; i < tlen; i++)
            if (tbuf[i] !== bbuf[i])
                return false;
        return true;
    };
    BitSet.prototype.not = function () {
        var tbuf = this.buf;
        var tlen = tbuf.length;
        for (var i = 0; i < tlen; i++)
            tbuf[i] = ~tbuf[i];
        return this;
    };
    BitSet.prototype.isset = function (n) {
        if (n === undefined) {
            var tbuf = this.buf;
            var l = tbuf.length;
            for (var i = 0; i < l; i++)
                if (tbuf[i] !== 0)
                    return true;
            return false;
        }
        this.assertIDX(n);
        return (this.buf[(n / 8) | 0] & (0x01 << (n % 8))) === 0 ? false : true;
    };
    BitSet.prototype.shift = function (n) {
        if (n === undefined)
            n = 1;
        if (n === 0)
            return this;
        var tbuf = this.buf;
        var tlen = tbuf.length;
        var nbytes = ((n > 0 ? n : -n) / 8) | 0;
        var nbits = ((n > 0 ? n : -n) % 8);
        if (n > 0) {
            if (nbytes > 0) {
                for (var i = tlen - 1; i >= 0; i--) {
                    if ((i - nbytes) >= 0)
                        tbuf[i] = tbuf[i - nbytes];
                    else
                        tbuf[i] = 0;
                }
            }
            if (nbits > 0) {
                var m = [0x00, 0x80, 0xC0, 0xE0, 0xF0, 0xF8, 0xFC, 0xFE];
                var r = 0;
                for (var i = 0; i < tlen; i++) {
                    var rtmp = (tbuf[i] & m[nbits]) >>> (8 - nbits);
                    tbuf[i] <<= nbits;
                    tbuf[i] |= r;
                    r = rtmp;
                }
            }
        }
        else {
            if (nbytes > 0) {
                var ibytes = 0;
                for (; ibytes < (tlen - nbytes); ibytes++)
                    tbuf[ibytes] = tbuf[ibytes + nbytes];
                for (; ibytes < tlen; ibytes++)
                    tbuf[ibytes] = 0x00;
            }
            if (nbits > 0) {
                var m = [0x00, 0x01, 0x03, 0x07, 0x0F, 0x1F, 0x3F, 0x7F];
                var r = 0;
                for (var i = tlen - 1; i >= 0; i--) {
                    var rtmp = (tbuf[i] & m[nbits]) << (8 - nbits);
                    tbuf[i] >>>= nbits;
                    tbuf[i] |= r;
                    r = rtmp;
                }
            }
        }
        return this;
    };
    BitSet.stringify = function (b, t) {
        var l = b.len;
        var s = b.buf.length;
        var ret = "";
        if ((t === undefined) || (t === BitSetSerializeType.OneZero)) {
            if (t === BitSetSerializeType.OneZero)
                ret = "BitSet:01(" + l + "):";
            for (var i = l - 1; i >= 0; i--) {
                if (b.isset(i) === true)
                    ret += "1";
                else
                    ret += "0";
            }
            return ret;
        }
        if (t === BitSetSerializeType.Hex) {
            var a = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
            ret = "BitSet:HEX(" + l + "):";
            for (var i = s - 1; i >= 0; i--)
                ret += a[(b.buf[i] >>> 4) | 0] + a[(b.buf[i] & 0x0F) | 0];
            return ret;
        }
        if (t === BitSetSerializeType.Base64)
            return "BitSet:BASE64(" + l + "):" + (new Buffer(b.buf).toString('base64'));
        return null;
    };
    BitSet.parseOneZero = function (s) {
        var l = s.length;
        var ss = s;
        if (s.indexOf("BitSet:01") === 0) {
            var myRe = /^BitSet:01\((\d+)\):([01]+)/g;
            var r = myRe.exec(s);
            if (r === null)
                throw new BitSetException('Parse OneZero format (prefixed) failed - syntax error!');
            l = parseInt(r[1]);
            if (r[2].length !== l)
                throw new BitSetException('Parse OneZero format (prefixed) failed - length mismatch!');
            ss = r[2];
        }
        var b = new BitSet(l);
        for (var i = 0; i < l; i++) {
            if (ss.charAt(i) === "1")
                b.set(l - i - 1);
            else if (ss.charAt(i) !== "0")
                throw new BitSetException("Parse OneZero format failed zero-one string expected - syntax error!");
        }
        return b;
    };
    BitSet.parseBase64 = function (s) {
        if (s.indexOf("BitSet:BASE64") !== 0)
            throw new BitSetException('Parse BASE64 format failed - no BitSet:BASE64 prefix!');
        var myRe = /^BitSet:BASE64\((\d+)\):(.+)/g;
        var r = myRe.exec(s);
        if (r === null)
            throw new BitSetException('Parse BASE64 format failed - syntax error!');
        var l = parseInt(r[1]);
        if ((l % 8) !== 0)
            throw new BitSetException('Parse BASE64 format failed - length has to be a multiply of 8!');
        var btmp = new Buffer(r[2], 'base64');
        if (l != btmp.length * 8)
            throw new BitSetException('Parse BASE64 format failed - length mismatch! ');
        var b = new BitSet((btmp.length * 8) | 0);
        b.buf = new Uint8Array(btmp);
        return b;
    };
    BitSet.parseHex = function (s) {
        if (s.indexOf("BitSet:HEX") !== 0)
            throw new BitSetException('Parse HEX format failed - no BitSet:HEX prefix!');
        var myRe = /^BitSet:HEX\((\d+)\):([0-9A-F]+)/g;
        var r = myRe.exec(s);
        if (r === null)
            throw new BitSetException('Parse HEX format failed - syntax error!');
        var l = parseInt(r[1]);
        if ((l % 8) !== 0)
            throw new BitSetException('Parse HEX format failed - length has to be a multiply of 8!');
        if (r[2].length !== l / 4)
            throw new BitSetException('Parse HEX format failed - length mismatch! ');
        var b = new BitSet(l | 0);
        for (var idx = 0, i = 0; i < r[2].length; i += 2, idx++)
            b.buf[b.buf.length - idx - 1] = parseInt(r[2].substr(i, 2), 16);
        return b;
    };
    BitSet.parse = function (s) {
        if (s.indexOf("BitSet:HEX") === 0)
            return BitSet.parseHex(s);
        if (s.indexOf("BitSet:BASE64") === 0)
            return BitSet.parseBase64(s);
        return BitSet.parseOneZero(s);
    };
    return BitSet;
}());
exports.BitSet = BitSet;
