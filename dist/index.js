"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const rlp_encoder_1 = require("@zoltu/rlp-encoder");
const js_sha3_1 = require("js-sha3");
const elliptic_1 = require("elliptic");
const bignumber_1 = require("@ethersproject/bignumber");
const secp256k1 = new elliptic_1.ec('secp256k1');
function arrayFromNumber(value) {
    return arrayFromHexString(value.toString(16));
}
function arrayFromHexString(value) {
    const normalized = (value.length % 2) ? `0${value}` : value;
    const bytes = [];
    for (let i = 0; i < normalized.length; i += 2) {
        bytes.push(Number.parseInt(`${normalized[i]}${normalized[i + 1]}`, 16));
    }
    return new Uint8Array(bytes);
}
function generate(bytecode, config) {
    const nonce = new Uint8Array(0);
    const gasPrice = arrayFromHexString(bignumber_1.BigNumber.from(config.gasPrice).toHexString().slice(2));
    const gasLimit = arrayFromNumber(config.gasLimit);
    const to = new Uint8Array(0);
    const value = new Uint8Array(0);
    const data = arrayFromHexString(bytecode.slice(2));
    const v = arrayFromNumber(27);
    const r = arrayFromHexString('2222222222222222222222222222222222222222222222222222222222222222');
    const s = arrayFromHexString('2222222222222222222222222222222222222222222222222222222222222222');
    const unsignedEncodedTransaction = rlp_encoder_1.rlpEncode([nonce, gasPrice, gasLimit, to, value, data]);
    const signedEncodedTransaction = rlp_encoder_1.rlpEncode([nonce, gasPrice, gasLimit, to, value, data, v, r, s]);
    const hashedSignedEncodedTransaction = new Uint8Array(js_sha3_1.keccak256.arrayBuffer(unsignedEncodedTransaction));
    const signerAddress = arrayFromHexString(js_sha3_1.keccak256(secp256k1.recoverPubKey(hashedSignedEncodedTransaction, { r: r, s: s }, 0).encode('array').slice(1)).slice(-40));
    const contractAddress = arrayFromHexString(js_sha3_1.keccak256(rlp_encoder_1.rlpEncode([signerAddress, nonce])).slice(-40));
    return {
        signerAddress: signerAddress.reduce((x, y) => x += y.toString(16).padStart(2, '0'), '0x'),
        transaction: signedEncodedTransaction.reduce((x, y) => x += y.toString(16).padStart(2, '0'), '0x'),
        address: contractAddress.reduce((x, y) => x += y.toString(16).padStart(2, '0'), '0x')
    };
}
exports.generate = generate;
// example  from https://github.com/Arachnid/deterministic-deployment-proxy/
// console.log(
// 	generate(
// 		"0x604580600e600039806000f350fe7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe03601600081602082378035828234f58015156039578182fd5b8082525050506014600cf3",
// 		{
// 			gasPrice: '100000000000',
// 			gasLimit: 100000
// 		}
// 	)
// );
//# sourceMappingURL=index.js.map