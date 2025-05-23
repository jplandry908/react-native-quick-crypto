/**
 * Tests are based on Node.js tests
 * https://github.com/nodejs/node/blob/main/test/parallel/test-crypto-hmac.js
 */

import { Buffer } from '@craftzdog/react-native-buffer';
import crypto, { createHmac, type Encoding } from 'react-native-quick-crypto';
import { assert, expect } from 'chai';
import { test } from '../util';

const SUITE = 'hmac';

test(SUITE, 'createHmac with valid algorithm', () => {
  expect(() => {
    createHmac('sha256', 'key');
  }).to.not.throw();
});

test(SUITE, 'createHmac with invalid algorithm', () => {
  expect(() => {
    createHmac('sha123', 'key');
  }).to.throw(/Unknown HMAC algorithm: sha123/);
});

test(SUITE, 'createHmac with null algorithm', () => {
  // @ts-expect-error bad algorithm
  expect(() => createHmac(null)).to.throw(
    /Algorithm must be a non-empty string/,
  );
});

test(SUITE, 'createHmac with null key', () => {
  // @ts-expect-error bad key
  expect(() => createHmac('sha1', null)).to.throw(
    /Key must not be null or undefined/,
  );
});

test(SUITE, 'createHmac with empty key', () => {
  expect(() => {
    crypto.createHmac('sha1', '');
  }).to.not.throw();
});

test(SUITE, 'digest as hex', () => {
  const hmac = createHmac('sha256', 'key');
  hmac.update('some data');
  const digest = hmac.digest('hex');
  expect(digest).to.equal(
    '01add3f98ce4d49403d98362a046c6cca2c79d778426282c53e4f628f648c12b',
  );
});

test(SUITE, 'digest as base64', () => {
  const hmac = createHmac('sha256', 'key');
  hmac.update('some data');
  const digest = hmac.digest('base64');
  expect(digest).to.equal('Aa3T+Yzk1JQD2YNioEbGzKLHnXeEJigsU+T2KPZIwSs=');
});

test(SUITE, 'multiple updates', () => {
  const hmac = createHmac('sha256', 'key');
  hmac.update('some');
  hmac.update(' data');
  const digest = hmac.digest('hex');
  expect(digest).to.equal(
    '01add3f98ce4d49403d98362a046c6cca2c79d778426282c53e4f628f648c12b',
  );
});

test(SUITE, 'Buffer key', () => {
  const key = Buffer.from('key');
  const hmac = createHmac('sha256', key);
  hmac.update('some data');
  const digest = hmac.digest('hex');
  expect(digest).to.equal(
    '01add3f98ce4d49403d98362a046c6cca2c79d778426282c53e4f628f648c12b',
  );
});

test(SUITE, 'ArrayBuffer key', () => {
  const key = new ArrayBuffer(3);
  const view = new Uint8Array(key);
  view[0] = 'k'.charCodeAt(0);
  view[1] = 'e'.charCodeAt(0);
  view[2] = 'y'.charCodeAt(0);
  const hmac = createHmac('sha256', key);
  hmac.update('some data');
  const digest = hmac.digest('hex');
  expect(digest).to.equal(
    '01add3f98ce4d49403d98362a046c6cca2c79d778426282c53e4f628f648c12b',
  );
});

test(SUITE, 'digest - segfault', () => {
  const hmac = createHmac('sha256', 'key');
  expect(() => {
    hmac.digest({
      toString: () => {
        throw new Error('segfault');
      },
    } as unknown as Encoding);
  }).to.throw();
});

function testHmac(
  title: string,
  algo: string,
  key: string | Buffer,
  data: string | Buffer,
  expected: string,
) {
  test(SUITE, title, () => {
    const hmac = createHmac(algo, key);
    hmac.update(data);
    const digest = hmac.digest('hex');
    expect(digest).to.equal(expected);
  });
}

const wikipedia = [
  {
    key: 'key',
    data: 'The quick brown fox jumps over the lazy dog',
    hmac: {
      md5: '80070713463e7749b90c2dc24911e275',
      sha1: 'de7c9b85b8b78aa6bc8a7a36f70a90701c9db4d9',
      sha256:
        'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8',
    },
  },
  {
    key: 'key',
    data: '',
    hmac: {
      md5: '63530468a04e386459855da0063b6596',
      sha1: 'f42bb0eeb018ebbd4597ae7213711ec60760843f',
      sha256:
        '5d5d139563c95b5967b9bd9a8c9b233a9dedb45072794cd232dc1b74832607d0',
    },
  },
  {
    key: '',
    data: 'The quick brown fox jumps over the lazy dog',
    hmac: {
      md5: 'ad262969c53bc16032f160081c4a07a0',
      sha1: '2ba7f707ad5f187c412de3106583c3111d668de8',
      sha256:
        'fb011e6154a19b9a4c767373c305275a5a69e8b68b0b4c9200c383dced19a416',
    },
  },
  {
    key: '',
    data: '',
    hmac: {
      md5: '74e6f7298a9c2d168935f58c001bad88',
      sha1: 'fbdb1d1b18aa6c08324b7d64b71fb76370690e1d',
      sha256:
        'b613679a0814d9ec772f95d778c35fc5ff1697c493715653c6c712144292c5ad',
    },
  },
];

for (const { key, data, hmac } of wikipedia) {
  for (const algo in hmac)
    testHmac(
      `Wikipedia case - algo:'${algo}' key:'${key}' data:'${data}'`,
      algo,
      key,
      data,
      hmac[algo as keyof typeof hmac],
    );
}

/**
 * Test HMAC-SHA-* (RFC-4231 Test Cases)
 * @see https://datatracker.ietf.org/doc/html/rfc4231
 */
const rfc4231 = [
  {
    key: Buffer.from('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b', 'hex'),
    data: Buffer.from('4869205468657265', 'hex'), // 'Hi There'
    hmac: {
      sha224: '896fb1128abbdf196832107cd49df33f47b4b1169912ba4f53684b22',
      sha256:
        'b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c' + '2e32cff7',
      sha384:
        'afd03944d84895626b0825f4ab46907f15f9dadbe4101ec682aa034c' +
        '7cebc59cfaea9ea9076ede7f4af152e8b2fa9cb6',
      sha512:
        '87aa7cdea5ef619d4ff0b4241a1d6cb02379f4e2ce4ec2787ad0b305' +
        '45e17cdedaa833b7d6b8a702038b274eaea3f4e4be9d914eeb61f170' +
        '2e696c203a126854',
    },
  },
  {
    key: Buffer.from('4a656665', 'hex'), // 'Jefe'
    data: Buffer.from(
      '7768617420646f2079612077616e7420666f72206e6f74686' + '96e673f',
      'hex',
    ), // 'what do ya want for nothing?'
    hmac: {
      sha224: 'a30e01098bc6dbbf45690f3a7e9e6d0f8bbea2a39e6148008fd05e44',
      sha256:
        '5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b9' + '64ec3843',
      sha384:
        'af45d2e376484031617f78d2b58a6b1b9c7ef464f5a01b47e42ec373' +
        '6322445e8e2240ca5e69e2c78b3239ecfab21649',
      sha512:
        '164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7' +
        'ea2505549758bf75c05a994a6d034f65f8f0e6fdcaeab1a34d4a6b4b' +
        '636e070a38bce737',
    },
  },
  {
    key: Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: Buffer.from(
      'ddddddddddddddddddddddddddddddddddddddddddddddddd' +
        'ddddddddddddddddddddddddddddddddddddddddddddddddddd',
      'hex',
    ),
    hmac: {
      sha224: '7fb3cb3588c6c1f6ffa9694d7d6ad2649365b0c1f65d69d1ec8333ea',
      sha256:
        '773ea91e36800e46854db8ebd09181a72959098b3ef8c122d9635514' + 'ced565fe',
      sha384:
        '88062608d3e6ad8a0aa2ace014c8a86f0aa635d947ac9febe83ef4e5' +
        '5966144b2a5ab39dc13814b94e3ab6e101a34f27',
      sha512:
        'fa73b0089d56a284efb0f0756c890be9b1b5dbdd8ee81a3655f83e33' +
        'b2279d39bf3e848279a722c806b485a47e67c807b946a337bee89426' +
        '74278859e13292fb',
    },
  },
  {
    key: Buffer.from(
      '0102030405060708090a0b0c0d0e0f10111213141516171819',
      'hex',
    ),
    data: Buffer.from(
      'cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdc' +
        'dcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd',
      'hex',
    ),
    hmac: {
      sha224: '6c11506874013cac6a2abc1bb382627cec6a90d86efc012de7afec5a',
      sha256:
        '82558a389a443c0ea4cc819899f2083a85f0faa3e578f8077a2e3ff4' + '6729665b',
      sha384:
        '3e8a69b7783c25851933ab6290af6ca77a9981480850009cc5577c6e' +
        '1f573b4e6801dd23c4a7d679ccf8a386c674cffb',
      sha512:
        'b0ba465637458c6990e5a8c5f61d4af7e576d97ff94b872de76f8050' +
        '361ee3dba91ca5c11aa25eb4d679275cc5788063a5f19741120c4f2d' +
        'e2adebeb10a298dd',
    },
  },
  {
    key: Buffer.from('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c', 'hex'),
    // 'Test With Truncation'
    data: Buffer.from('546573742057697468205472756e636174696f6e', 'hex'),
    hmac: {
      sha224: '0e2aea68a90c8d37c988bcdb9fca6fa8',
      sha256: 'a3b6167473100ee06e0c796c2955552b',
      sha384: '3abf34c3503b2a23a46efc619baef897',
      sha512: '415fad6271580a531d4179bc891d87a6',
    },
    truncate: true,
  },
  {
    key: Buffer.from(
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaa',
      'hex',
    ),
    // 'Test Using Larger Than Block-Size Key - Hash Key First'
    data: Buffer.from(
      '54657374205573696e67204c6172676572205468616e20426' +
        'c6f636b2d53697a65204b6579202d2048617368204b657920' +
        '4669727374',
      'hex',
    ),
    hmac: {
      sha224: '95e9a0db962095adaebe9b2d6f0dbce2d499f112f2d2b7273fa6870e',
      sha256:
        '60e431591ee0b67f0d8a26aacbf5b77f8e0bc6213728c5140546040f' + '0ee37f54',
      sha384:
        '4ece084485813e9088d2c63a041bc5b44f9ef1012a2b588f3cd11f05' +
        '033ac4c60c2ef6ab4030fe8296248df163f44952',
      sha512:
        '80b24263c7c1a3ebb71493c1dd7be8b49b46d1f41b4aeec1121b0137' +
        '83f8f3526b56d037e05f2598bd0fd2215d6a1e5295e64f73f63f0aec' +
        '8b915a985d786598',
    },
  },
  {
    key: Buffer.from(
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaa',
      'hex',
    ),
    // 'This is a test using a larger than block-size key and a larger ' +
    // 'than block-size data. The key needs to be hashed before being ' +
    // 'used by the HMAC algorithm.'
    data: Buffer.from(
      '5468697320697320612074657374207573696e672061206c6' +
        '172676572207468616e20626c6f636b2d73697a65206b6579' +
        '20616e642061206c6172676572207468616e20626c6f636b2' +
        'd73697a6520646174612e20546865206b6579206e65656473' +
        '20746f20626520686173686564206265666f7265206265696' +
        'e6720757365642062792074686520484d414320616c676f72' +
        '6974686d2e',
      'hex',
    ),
    hmac: {
      sha224: '3a854166ac5d9f023f54d517d0b39dbd946770db9c2b95c9f6f565d1',
      sha256:
        '9b09ffa71b942fcb27635fbcd5b0e944bfdc63644f0713938a7f5153' + '5c3a35e2',
      sha384:
        '6617178e941f020d351e2f254e8fd32c602420feb0b8fb9adccebb82' +
        '461e99c5a678cc31e799176d3860e6110c46523e',
      sha512:
        'e37b6a775dc87dbaa4dfa9f96e5e3ffddebd71f8867289865df5a32d' +
        '20cdc944b6022cac3c4982b10d5eeb55c3e4de15134676fb6de04460' +
        '65c97440fa8c6a58',
    },
  },
];

for (let i = 0, l = rfc4231.length; i < l; i++) {
  for (const hash in rfc4231[i]!.hmac) {
    test(SUITE, `HMAC-${hash} RFC-4231 case ${i + 1}`, () => {
      const str = crypto.createHmac(hash, rfc4231[i]!.key);
      str.end(rfc4231[i]!.data);
      let strRes = str.read().toString('hex');
      let actual = crypto
        .createHmac(hash, rfc4231[i]!.key)
        .update(rfc4231[i]!.data)
        .digest('hex');
      if (rfc4231[i]!.truncate) {
        actual = actual.substr(0, 32); // first 128 bits == 32 hex chars
        strRes = strRes.substr(0, 32);
      }
      const expected = (rfc4231[i]!.hmac as Record<string, string>)[hash];
      expect(actual).to.be.eql(expected);
      expect(actual).to.be.eql(strRes);
    });
  }
}

/**
 * Test HMAC-MD5/SHA1 (RFC-2202 Test Cases)
 * @see https://datatracker.ietf.org/doc/html/rfc2202
 */
const rfc2202_md5 = [
  {
    key: Buffer.from('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b', 'hex'),
    data: 'Hi There',
    hmac: '9294727a3638bb1c13f48ef8158bfc9d',
  },
  {
    key: 'Jefe',
    data: 'what do ya want for nothing?',
    hmac: '750c783e6ab0b503eaa86e310a5db738',
  },
  {
    key: Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: Buffer.from(
      'ddddddddddddddddddddddddddddddddddddddddddddddddd' +
        'ddddddddddddddddddddddddddddddddddddddddddddddddddd',
      'hex',
    ),
    hmac: '56be34521d144c88dbb8c733f0e8b3f6',
  },
  {
    key: Buffer.from(
      '0102030405060708090a0b0c0d0e0f10111213141516171819',
      'hex',
    ),
    data: Buffer.from(
      'cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdc' +
        'dcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd' +
        'cdcdcdcdcd',
      'hex',
    ),
    hmac: '697eaf0aca3a3aea3a75164746ffaa79',
  },
  {
    key: Buffer.from('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c', 'hex'),
    data: 'Test With Truncation',
    hmac: '56461ef2342edc00f9bab995690efd4c',
  },
  {
    key: Buffer.from(
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaa',
      'hex',
    ),
    data: 'Test Using Larger Than Block-Size Key - Hash Key First',
    hmac: '6b1ab7fe4bd7bf8f0b62e6ce61b9d0cd',
  },
  {
    key: Buffer.from(
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaa',
      'hex',
    ),
    data:
      'Test Using Larger Than Block-Size Key and Larger Than One ' +
      'Block-Size Data',
    hmac: '6f630fad67cda0ee1fb1f562db3aa53e',
  },
];

for (let i = 0, l = rfc2202_md5.length; i < l; i++) {
  const { key, data, hmac } = rfc2202_md5[i]!;
  testHmac(`HMAC-MD5 RFC-2202 MD5 test case ${i + 1}`, 'md5', key, data, hmac);
}

/**
 * Test HMAC-SHA1 (RFC-2202 Test Cases)
 * @see https://datatracker.ietf.org/doc/html/rfc2202
 */
const rfc2202_sha1 = [
  {
    key: Buffer.from('0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b', 'hex'),
    data: 'Hi There',
    hmac: 'b617318655057264e28bc0b6fb378c8ef146be00',
  },
  {
    key: 'Jefe',
    data: 'what do ya want for nothing?',
    hmac: 'effcdf6ae5eb2fa2d27416d5f184df9c259a7c79',
  },
  {
    key: Buffer.from('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'hex'),
    data: Buffer.from(
      'ddddddddddddddddddddddddddddddddddddddddddddd' +
        'ddddddddddddddddddddddddddddddddddddddddddddd' +
        'dddddddddd',
      'hex',
    ),
    hmac: '125d7342b9ac11cd91a39af48aa17b4f63f175d3',
  },
  {
    key: Buffer.from(
      '0102030405060708090a0b0c0d0e0f10111213141516171819',
      'hex',
    ),
    data: Buffer.from(
      'cdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdc' +
        'dcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcdcd' +
        'cdcdcdcdcd',
      'hex',
    ),
    hmac: '4c9007f4026250c6bc8414f9bf50c86c2d7235da',
  },
  {
    key: Buffer.from('0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c', 'hex'),
    data: 'Test With Truncation',
    hmac: '4c1a03424b55e07fe7f27be1d58bb9324a9a5a04',
  },
  {
    key: Buffer.from(
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaa',
      'hex',
    ),
    data: 'Test Using Larger Than Block-Size Key - Hash Key First',
    hmac: 'aa4ae5e15272d00e95705637ce8a3b55ed402112',
  },
  {
    key: Buffer.from(
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
        'aaaaaaaaaaaaaaaaaaaaaa',
      'hex',
    ),
    data:
      'Test Using Larger Than Block-Size Key and Larger Than One ' +
      'Block-Size Data',
    hmac: 'e8e99d0f45237d786d6bbaa7965c7808bbff1a91',
  },
];

for (let i = 0, l = rfc2202_sha1.length; i < l; i++) {
  const { key, data, hmac } = rfc2202_sha1[i]!;
  testHmac(
    `HMAC-SHA1 RFC-2202 SHA1 test case ${i + 1}`,
    'sha1',
    key,
    data,
    hmac,
  );
}

test(SUITE, 'digest with ucs2 encoding', () => {
  assert.strictEqual(
    crypto.createHmac('sha256', 'w00t').digest('ucs2'),
    crypto.createHmac('sha256', 'w00t').digest().toString('ucs2'),
  );
});
