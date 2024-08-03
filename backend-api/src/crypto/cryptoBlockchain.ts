import * as crypto from 'node:crypto';
import fs from 'fs';
import dotenv from "dotenv";
dotenv.config();

class CryptoBlockchain {
    KEY: Buffer;
    IV: Buffer;
    keyLength: number;
    algorithm = 'aes-256-cbc'; //Using AES encryption

    constructor(KEY_VAR, IV_VAR) {
        this.KEY = Buffer.from(KEY_VAR || '', 'hex');
        this.IV = Buffer.from(IV_VAR || '', 'hex');
        this.keyLength = 32;
        // console.log("KEY: ", this.key);
    }

    public generateSecret(): void {
        // Generate a random 256-bit (32-byte) key
        const SECRET_KEY = crypto.randomBytes(this.keyLength);
        const HEX_KEY = SECRET_KEY.toString('hex');

        const IV = crypto.randomBytes(this.keyLength / 2);
        const HEX_IV = IV.toString('hex');

        fs.writeFileSync('secret.key', HEX_KEY);
        console.log("Secret key has been written to 'secret.key' file.");
        console.log("KEY: ", HEX_KEY);
        console.log("IV: ", HEX_IV);
    }

    public generateIdentifier(length: number): string {
        const secretKey = crypto.randomBytes(length);
        const base64Key = secretKey.toString('base64');
        return base64Key;
    }

    // Use the key to encrypt data.
    public encryptData(data: string) {
        let cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.KEY), this.IV);
        let encrypted = cipher.update(data);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { IV: this.IV.toString('hex'), CIPHER_TEXT: encrypted.toString('hex') };
    }

    // Use the key to decrypt data.
    public decryptData(encryptedData): string {
        // console.log("EncryptedData: ", encryptedData);
        
        let IV = Buffer.from(encryptedData.IV, 'hex');
        let encryptedText = Buffer.from(encryptedData.CIPHER_TEXT, 'hex');
        let decipher = crypto.createDecipheriv(this.algorithm, Buffer.from(this.KEY), IV);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
}

export default CryptoBlockchain;
