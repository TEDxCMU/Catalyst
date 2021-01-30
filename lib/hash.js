
import crypto from 'crypto';

export function usernameToId(username) {
    let key = "" + process.env.USER_TO_ID_SECRET;
    const hmac = crypto.createHmac('sha1', key);
    hmac.update(username);
    const result = hmac.digest('hex');
    return result;
}

