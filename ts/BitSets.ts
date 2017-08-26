/**
 * BitSet exception type
 *
 * @export
 * @class BitSetException
 * @implements {Error}
 */
export class BitSetException implements Error {
    public name: string = "BitSetException";
    public message: string = "";

    constructor(m: string) {
        this.message = m;
    }

    public toString(): string {
        return "{" + this.name + ": " + this.message + "}";
    }
}

/**
 * BitSet serialize method type
 *
 * @export
 * @enum {number}
 */
export enum BitSetSerializeType {
    OneZero, // 01 encoded string
    Hex, // hex encoded string
    Base64, // base64 encoded string
}

/**
 * BitSet - the bitset data structure that compactly stores bits.
 *
 * @export
 * @class BitSet
 */
export class BitSet {
    private buf: Uint8Array;
    private len: number;

    /**
     * Creates an instance of BitSet with specified number of bits.
     *
     * @param {number} o (description)
     */
    constructor(o: number);
    /**
     * Creates an instance of BitSet from BitSet object.
     *
     * @param {BitSet} o (description)
     */
    constructor(o: BitSet);
    /**
     * Creates an instance of BitSet from Buffer object.
     *
     * @param {Buffer} o (description)
     */
    constructor(o: Buffer);
    /**
     * Creates an instance of BitSet from ArryBuffer object.
     *
     * @param {ArrayBuffer} o (description)
     */
    constructor(o: ArrayBuffer);
    /**
     * Creates an instance of BitSet from Uint8Array object.
     *
     * @param {Uint8Array} o (description)
     */
    constructor(o: Uint8Array);
    constructor(o: any) {
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
            throw new BitSetException(`Constructor for type: '${typeof o}' is not implemented!`);
        }
    }

    /**
     * Get reference to underlying buffer with internal representation of data.
     *
     * @returns Uint8Array
     */
    public buffer(): Uint8Array {
        return this.buf;
    }

    /**
     * Create a new BitSet object based on uint32 bit value passed as number.
     *
     * @param  {number} o
     * @returns BitSet
     */
    public static create32bit(o: number): BitSet {
        let n = (o & 0xFFFFFFFF)>>>0;
        let r = new BitSet(32);
        r.buf[0] = ((n >>> 0) & 0xFF);
        r.buf[1] = ((n >>> 8) & 0xFF);
        r.buf[2] = ((n >>> 16) & 0xFF);
        r.buf[3] = ((n >>> 24) & 0xFF);
        return r;
    }

    /**
     * Create a new BitSet object based on uint16 bit value passed as number.
     *
     * @param  {number} o
     * @returns BitSet
     */
    public static create16bit(o: number): BitSet {
        let n = (o & 0xFFFF)>>>0;
        let r = new BitSet(16);
        r.buf[0] = ((n >>> 0) & 0xFF);
        r.buf[1] = ((n >>> 8) & 0xFF);
        return r;
    }

    /**
     * Create a new BitSet object based on uint8 bit value passed as number.
     *
     * @param  {number} o
     * @returns BitSet
     */
    public static create8bit(o: number): BitSet {
        let r = new BitSet(8);
        r.buf[0] = o & 0xFF;
        return r;
    }

    /**
     * Private helper method for initialization.
     *
     * @param  {Uint8Array} o
     * @returns void
     */
    private init(o: Uint8Array): void {
        this.assertLEN(o.length * 8);
        this.len = o.length * 8;
        this.buf = new Uint8Array(o.length);
        for (let i = 0; i < o.length; i++)
            this.buf[i] = o[i];
    }

    /**
     * Check the size of this and b are equal to perform operations.
     *
     * @param  {BitSet} b
     * @returns void
     */
    private assertEQ(b: BitSet): void {
        if (this.len !== b.len)
            throw new BitSetException('Length of two BitSet objects not equal!');
    }

    /**
     * Check the size of new BitSet.
     * Warning: the size of BitSet has to be multiply of 8
     *
     * @param  {number} l in bits
     * @returns void
     */
    private assertLEN(l: number): void {
        if (l === undefined)
            throw new BitSetException('Length of BitSet not defined!');
        if (l <= 0)
            throw new BitSetException('Length of BitSet has to be greater than zero!');
        if (l !== (l | 0))
            throw new BitSetException('Length of BitSet has to be an integer value!');
        if (l % 8 !== 0)
            throw new BitSetException('Length of BitSet have to be the multiply of 8 bit!');
    }

    /**
     * Check index n is in range of BitSet.
     *
     * @param  {number} n
     * @returns void
     */
    private assertIDX(n: number): void {
        if (n != (n | 0))
            throw new BitSetException('Index has to be an integer value!');
        if (n < 0)
            throw new BitSetException("Index out of range: index has to be greater than 0!");
        if (n >= this.len)
            throw new BitSetException("Index out of range: index has to be lower than length!");
    }

    /**
     * Create a copy of BitSet.
     *
     * @returns BitSet
     */
    public clone(): BitSet {
        return new BitSet(this);
    }

    /**
     * Change size of the BitSet.
     *
     * @param  {number} l in bits
     * @returns BitSet
     */
    public resize(l: number): BitSet {
        this.assertLEN(l);
        if (this.len !== l) {
            let tmpb: Uint8Array = new Uint8Array(((l + 7) / 8) | 0);
            let tbuf: Uint8Array = this.buf;
            for (let i = 0; (i < this.buf.length) && (i < tmpb.length); i++)
                tmpb[i] = tbuf[i];
            this.buf = tmpb;
            this.len = l;
        }

        return this;
    }

    /**
     * Create a new BitSet by copy range of bits: <s,e>.
     * Params s and e can be any, but total number of bits have to be
     * a multiply of 8 bits. If e is not given, it is assumed to be to the end.
     *
     * @param  {number} s
     * @param  {number} e?
     * @returns BitSet
     */
    public range(s: number, e?: number): BitSet {
        if (e === undefined)
            e = this.len - 1;

        this.assertIDX(s);
        this.assertIDX(e);

        let l = e - s + 1;
        if (l % 8 !== 0)
            throw new BitSetException('Range has to be multiply of 8 bits!');

        let r = new BitSet(l);
        for (let i = s, idx = 0; i <= e; i++ , idx++)
            if (this.isset(i) === true)
                r.set(idx);

        return null;
    }

    /**
     * Size in bits of BitSet
     *
     * @returns number
     */
    public length(): number {
        return this.len;
    }

    /**
     * Set selected bit, if bit not selected set every bit in buffer.
     * If s is not given all bits are set to 1.
     * If s is given but not e, one selected bit is set to 1
     * If s is given and e, all bits in range <s,e> are set to 1
     *
     * @param  {number} s?
     * @param  {number} e?
     * @returns BitSet
     */
    public set(s?: number, e?: number): BitSet {
        if (s !== undefined) {
            this.assertIDX(s);
            if (e == undefined) {
                this.buf[(s / 8) | 0] |= (0x01 << (s % 8));
            }
            else {
                this.assertIDX(e);
                for (let i = s; i <= e; i++)
                    this.buf[(i / 8) | 0] |= (0x01 << (i % 8));
            }
        }
        else
            this.buf.fill(0xFF);

        return this;
    }

    /**
     * Unset selected bit, if bit not selected unset every bit in buffer
     * If s is not given all bits are set to 0.
     * If s is given but not e, one selected bit is set to 0
     * If s is given and e, all bits in range <s,e> are set to 0
     *
     * @param  {number} s?
     * @param  {number} e?
     * @returns BitSet
     */
    public unset(s?: number, e?: number): BitSet {
        if (s !== undefined) {
            this.assertIDX(s);
            if (e == undefined) {
                this.buf[s / 8] &= ~(0x01 << (s % 8));
            }
            else {
                this.assertIDX(e);
                for (let i = s; i <= e; i++)
                    this.buf[i / 8] &= ~(0x01 << (i % 8));
            }
        }
        else
            this.buf.fill(0);

        return this;
    }

    /**
     * Logical operator AND.
     *
     * @param  {BitSet} b
     * @returns BitSet
     */
    public and(b: BitSet): BitSet {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            tbuf[i] &= bbuf[i];

        return this;
    }

    /**
     * Logical operator OR.
     *
     * @param  {BitSet} b
     * @returns BitSet
     */
    public or(b: BitSet): BitSet {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            tbuf[i] |= bbuf[i];

        return this;
    }

    /**
     * Logical operator XOR.
     *
     * @param  {BitSet} b
     * @returns BitSet
     */
    public xor(b: BitSet): BitSet {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            tbuf[i] ^= bbuf[i];

        return this;
    }

    /**
     * Logical operator NAND.
     *
     * @param  {BitSet} b
     * @returns BitSet
     */
    public nand(b: BitSet): BitSet {
        return this.and(b).not();
    }

    /**
     * Logical operator NOR.
     *
     * @param  {BitSet} b
     * @returns BitSet
     */
    public nor(b: BitSet): BitSet {
        return this.or(b).not();
    }

    /**
     * Check the b is equal to BitSet.
     *
     * @param  {BitSet} b
     * @returns boolean
     */
    public equal(b: BitSet): boolean {
        this.assertEQ(b);

        let tbuf = this.buf;
        let tlen = tbuf.length;
        let bbuf = b.buf;

        for (let i = 0; i < tlen; i++)
            if (tbuf[i] !== bbuf[i])
                return false;

        return true;
    }

    /**
     * Logical operator NOT.
     *
     * @returns BitSet
     */
    public not(): BitSet {
        let tbuf = this.buf;
        let tlen = tbuf.length;

        for (let i = 0; i < tlen; i++)
            tbuf[i] = ~tbuf[i];

        return this;
    }

    /**
     * Check if is selected bit is set.
     * If bit not selected check if any bit is set.
     *
     * @param  {number} n?
     * @returns boolean
     */
    public isset(n?: number): boolean {
        if (n === undefined) {
            let tbuf = this.buf;
            let l: number = tbuf.length;
            for (let i = 0; i < l; i++)
                if (tbuf[i] !== 0)
                    return true;
            return false;
        }
        this.assertIDX(n);
        return (this.buf[(n / 8) | 0] & (0x01 << (n % 8))) === 0 ? false : true;
    }

    /**
     * Shift the buffer left (if n is positive) or right (if n is negative).
     *
     * @param  {number} n?
     * @returns BitSet
     */
    public shift(n?: number): BitSet {
        if (n === undefined)
            n = 1;
        if (n === 0)
            return this;

        let tbuf = this.buf;
        let tlen = tbuf.length;

        let nbytes = ((n > 0 ? n : -n) / 8) | 0;
        let nbits = ((n > 0 ? n : -n) % 8);

        if (n > 0) { // shift left
            if (nbytes > 0) {
                for (let i = tlen - 1; i >= 0; i--) {
                    if ((i - nbytes) >= 0)
                        tbuf[i] = tbuf[i - nbytes];
                    else
                        tbuf[i] = 0;
                }
            }

            if (nbits > 0) {
                let m: number[] = [0x00, 0x80, 0xC0, 0xE0, 0xF0, 0xF8, 0xFC, 0xFE];
                let r: number = 0;
                for (let i = 0; i < tlen; i++) {
                    let rtmp = (tbuf[i] & m[nbits]) >>> (8 - nbits);
                    tbuf[i] <<= nbits;
                    tbuf[i] |= r;
                    r = rtmp;
                }
            }
        }
        else { // shift right
            if (nbytes > 0) {
                let ibytes = 0;
                for (; ibytes < (tlen - nbytes); ibytes++)
                    tbuf[ibytes] = tbuf[ibytes + nbytes];
                for (; ibytes < tlen; ibytes++)
                    tbuf[ibytes] = 0x00;
            }

            if (nbits > 0) {
                let m: number[] = [0x00, 0x01, 0x03, 0x07, 0x0F, 0x1F, 0x3F, 0x7F];
                let r: number = 0;
                for (let i = tlen - 1; i >= 0; i--) {
                    let rtmp = (tbuf[i] & m[nbits]) << (8 - nbits);
                    tbuf[i] >>>= nbits;
                    tbuf[i] |= r;
                    r = rtmp;
                }
            }
        }

        return this;
    }

    /**
     * Stringify BitSet object with selected algorithm, if not selected use
     * 01 (ZeroOne) algorithm without prefix.
     *
     * @param  {BitSet} b
     * @param  {BitSetSerializeType} t?
     * @returns string
     */
    public static stringify(b: BitSet, t?: BitSetSerializeType): string {
        let l: number = b.len;
        let s: number = b.buf.length;
        let ret: string = "";

        if ((t === undefined) || (t === BitSetSerializeType.OneZero)) {
            if (t === BitSetSerializeType.OneZero)
                ret = `BitSet:01(${l}):`;
            for (let i = l - 1; i >= 0; i--) {
                if (b.isset(i) === true)
                    ret += "1";
                else
                    ret += "0";
            }
            return ret;
        }

        if (t === BitSetSerializeType.Hex) {
            let a: string[] = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
            ret = `BitSet:HEX(${l}):`;
            for (let i = s - 1; i >= 0; i--)
                ret += a[(b.buf[i] >>> 4) | 0] + a[(b.buf[i] & 0x0F) | 0];
            return ret;
        }

        if (t === BitSetSerializeType.Base64)
            return `BitSet:BASE64(${l}):` + (new Buffer(b.buf).toString('base64'));

        return null;
    }

    /**
     * Parse OneZero format with or without prefix and
     * return new BitSet object. Throw exception on error.
     *
     * @param  {string} s
     * @returns BitSet
     */
    private static parseOneZero(s: string): BitSet {
        let l = s.length;
        let ss = s;

        if (s.indexOf("BitSet:01") === 0) {
            let myRe = /^BitSet:01\((\d+)\):([01]+)/g;
            let r = myRe.exec(s);
            if (r === null)
                throw new BitSetException('Parse OneZero format (prefixed) failed - syntax error!');
            l = parseInt(r[1]);
            if (r[2].length !== l)
                throw new BitSetException('Parse OneZero format (prefixed) failed - length mismatch!');
            ss = r[2];
        }

        let b: BitSet = new BitSet(l);
        for (let i = 0; i < l; i++) {
            if (ss.charAt(i) === "1")
                b.set(l - i - 1);
            else if (ss.charAt(i) !== "0")
                throw new BitSetException("Parse OneZero format failed zero-one string expected - syntax error!");
        }

        return b;
    }

    /**
     * Parse Base64 format and return new BitSet object.
     * Throw exception on error.
     *
     * @param  {string} s
     * @returns BitSet
     */
    private static parseBase64(s: string): BitSet {
        if (s.indexOf("BitSet:BASE64") !== 0)
            throw new BitSetException('Parse BASE64 format failed - no BitSet:BASE64 prefix!');

        let myRe = /^BitSet:BASE64\((\d+)\):(.+)/g;
        let r = myRe.exec(s);
        if (r === null)
            throw new BitSetException('Parse BASE64 format failed - syntax error!');
        let l = parseInt(r[1]);

        if ((l % 8) !== 0)
            throw new BitSetException('Parse BASE64 format failed - length has to be a multiply of 8!');

        var btmp = new Buffer(r[2], 'base64');
        if (l != btmp.length * 8)
            throw new BitSetException('Parse BASE64 format failed - length mismatch! ');

        let b: BitSet = new BitSet((btmp.length * 8) | 0);
        b.buf = new Uint8Array(btmp);

        return b;
    }

    /**
     * Parse Hex format and return new BitSet object.
     * Throw exception on error.
     *
     * @param  {string} s
     * @returns BitSet
     */
    private static parseHex(s: string): BitSet {
        if (s.indexOf("BitSet:HEX") !== 0)
            throw new BitSetException('Parse HEX format failed - no BitSet:HEX prefix!');

        let myRe = /^BitSet:HEX\((\d+)\):([0-9A-F]+)/g;
        let r = myRe.exec(s);
        if (r === null)
            throw new BitSetException('Parse HEX format failed - syntax error!');
        let l = parseInt(r[1]);

        if ((l % 8) !== 0)
            throw new BitSetException('Parse HEX format failed - length has to be a multiply of 8!');

        if (r[2].length !== l / 4)
            throw new BitSetException('Parse HEX format failed - length mismatch! ');

        let b: BitSet = new BitSet(l | 0);

        for (let idx = 0, i = 0; i < r[2].length; i += 2, idx++)
            b.buf[b.buf.length - idx - 1] = parseInt(r[2].substr(i, 2), 16);

        return b;
    }

    /**
     * Parse string and create new BitSet object.
     * Throw exception on error.
     *
     * @param  {string} s
     * @returns BitSet
     */
    public static parse(s: string): BitSet {
        if (s.indexOf("BitSet:HEX") === 0)
            return BitSet.parseHex(s);

        if (s.indexOf("BitSet:BASE64") === 0)
            return BitSet.parseBase64(s);

        return BitSet.parseOneZero(s);
    }
}
