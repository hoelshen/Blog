# 加密 json

## 加密算法

```js
export function createCharCode(count: number) {
  let code = "";
  for (let i = 0; i < count; i++) {
    code += String.fromCharCode(i);
  }
  return code;
}

const KEY_ALGORITHM = ["A", "E", "S", "-", "G", "C", "M"].join("");
const ALGORITHM_TYPE = ["S", "H", "A", "-", "2", "5", "6"].join("");
async function generateSymmetricKey(
  algorithm: string,
  key?: string
): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key || createCharCode(31));
  const hash = await window.crypto.subtle.digest(algorithm, keyData);

  return window.crypto.subtle.importKey(
    "raw",
    hash,
    { name: KEY_ALGORITHM, length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptText(plainText: string): Promise<string> {
  const key = await generateSymmetricKey(ALGORITHM_TYPE);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: KEY_ALGORITHM,
      iv: iv,
    },
    key,
    new TextEncoder().encode(plainText)
  );

  const encryptedArray = new Uint8Array(encryptedBuffer);
  const fullArray = new Uint8Array(iv.byteLength + encryptedArray.byteLength);
  fullArray.set(iv, 0);
  fullArray.set(encryptedArray, iv.byteLength);
  return bufferToBase64(fullArray.buffer);
}

export async function decryptText(encryptedBase64: string): Promise<string> {
  const key = await generateSymmetricKey(ALGORITHM_TYPE);
  const fullArray = base64ToBuffer(encryptedBase64);
  const iv = fullArray.slice(0, 12);
  const encryptedBytes = fullArray.slice(12);

  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: KEY_ALGORITHM,
      iv: iv,
    },
    key,
    encryptedBytes
  );

  return new TextDecoder().decode(decryptedData);
}
```
