import crypto from 'crypto';
import { BigNumber } from 'ethers';
import { poseidon1, poseidon2, poseidon3, poseidon4 } from 'poseidon-lite';

export const FIELD_SIZE = BigNumber.from(
    '21888242871839275222246405745257275088548364400416034343698204186575808495617',
);

export function poseidonHash(items: any[]): BigNumber {
    if (items.length === 1) return BigNumber.from(poseidon1([items[0]]));
    if (items.length === 2) return BigNumber.from(poseidon2([items[0], items[1]]));
    if (items.length === 3) return BigNumber.from(poseidon3([items[0], items[1], items[2]]));
    if (items.length === 4) return BigNumber.from(poseidon4([items[0], items[1], items[2], items[3]]));
    throw new Error(`Unsupported poseidon input length: ${items.length}`);
}

export const poseidonHash2 = (a: any, b: any) => poseidonHash([a, b]);

/** Generate random number of specified byte length */
export const randomBN = (nbytes = 31) => BigNumber.from(crypto.randomBytes(nbytes));

/** BigNumber to hex string of specified length */
export function toFixedHex(number: any, length = 32): string {
    let result =
        '0x' +
        (number instanceof Buffer
            ? number.toString('hex')
            : BigNumber.from(number).toHexString().replace('0x', '')
        ).padStart(length * 2, '0');
    if (result.indexOf('-') > -1) {
        result = '-' + result.replace('-', '');
    }
    return result;
}

/** Convert value into buffer of specified byte length */
export const toBuffer = (value: any, length: number) =>
    Buffer.from(
        BigNumber.from(value)
            .toHexString()
            .slice(2)
            .padStart(length * 2, '0'),
        'hex',
    );
