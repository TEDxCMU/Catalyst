
import crypto from 'crypto';

export function emailToUserId(email) {
    let key = "" + process.env.EMAIL_TO_ID_SECRET
    const hmac = crypto.createHmac('sha1', key);
    hmac.update(email);
    const result = hmac.digest('hex');
    return result;
}

