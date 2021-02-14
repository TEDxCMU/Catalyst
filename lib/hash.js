import crypto from 'crypto';

export function random(){
    return crypto.randomBytes(16).toString('hex');
}

export function encrypt(text){
    const cipher = crypto.createCipheriv('aes-256-ctr', process.env.HASH_KEY.toString(), Buffer.from(process.env.HASH_IV, 'hex'));
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex');
}

export function decrypt(hash){
    const decipher = crypto.createDecipheriv('aes-256-ctr', process.env.HASH_KEY.toString(), Buffer.from(process.env.HASH_IV, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    return decrpyted.toString();
}