"use strict";
// jwk-to-pem & jsonwebtoken
// https://github.com/Brightspace/node-jwk-to-pem
// JWK(JSONオブジェクト) -> PEMオブジェクト
//
// import jwkToPem from 'jwk-to-pem';
// import jwt = require('jsonwebtoken');
//
// 1. JWKSエンドポイントよりJWK取得 with kid
//   const jwk = { kty: 'EC', crv: 'P-256', x: '...', y: '...' },
// 2. JWK(JSONオブジェクト)を署名用公開鍵(PEM)に変換
//   const pem = jwkToPem(jwk);
// 3. トークンの署名検証
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = require("jsonwebtoken");
const jwk_to_pem_1 = __importDefault(require("jwk-to-pem"));
const BEARER_PREFIX = "Bearer ";
const JWKS_ENDPOINT = "http://localhost:8888/jwks";
// const buildIAMPolicy = (effect: string): PolicyDocument => {
//   return {
//     Version: "2012-10-17",
//     Statement: [
//       {
//         Action: "execute-api:Invoke",
//         Effect: effect,
//         Resource: "*",
//       },
//     ],
//   };
// };
// jwt.verify(token, pem);
const authHandler = (
//   event: APIGatewayTokenAuthorizerEvent
event) => __awaiter(void 0, void 0, void 0, function* () {
    const token = event.queryStringParameters.token;
    // "Bearer "除去してトークン文字列取得。
    if (!token) {
        throw Error("Authorization token not found.");
    }
    const encodedToken = event.queryStringParameters.token.substring(BEARER_PREFIX.length);
    // トークン文字列 -> JWTオブジェクト変換
    const decodedJwt = (0, jsonwebtoken_1.decode)(token, {
        complete: true,
    });
    if (!decodedJwt) {
        throw new Error("Invalid JWT token");
    }
    // JWKSエンドポイントよりJWK(JSONオブジェクト取得)
    const jwks = yield axios_1.default.get(JWKS_ENDPOINT);
    const kid = decodedJwt.header.kid;
    // JWK取得
    const publicKeyJwk = jwks.data.keys.find((key) => key.kid === kid);
    // JWK -> PEM
    const publicKeyPem = (0, jwk_to_pem_1.default)(publicKeyJwk);
    // 署名検証 (complete: true で header,payload,signature全て取得)
    const decoded = (0, jsonwebtoken_1.verify)(token, publicKeyPem, {
        algorithms: ["RS256"],
        complete: true,
    });
    console.log(decoded);
});
exports.default = authHandler;
//# sourceMappingURL=authHandler.js.map