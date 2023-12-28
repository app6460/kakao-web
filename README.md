[![npm version](https://badge.fury.io/js/kakao-web.svg)](https://www.npmjs.com/package/kakao-web)
[![License](https://img.shields.io/github/license/app6460/kakao-web)](/LICENSE)
# KakaoWeb
Kakao web auth api client   
카카오 웹 로그인 구현

## Install
```
npm i --save kakao-web
```

## Usage
### Login
```typescript
import { AuthApiClient } from 'kakao-web';

const apiClient = AuthApiClient.create({
    serviceURL: 'https://example.com',
});

async function main() {
    const res = await apiClient.login({
        email: 'email@example.com',
        password: 'password',
    });

    console.log(res);
}

main();
```

### Login with two-step verification
```typescript
import { AuthApiClient, LoginStatus } from 'kakao-web';

const apiClient = AuthApiClient.create({
    serviceURL: 'https://example.com',
});

async function main() {
    const res = await apiClient.login({
        email: 'email@example.com',
        password: 'password',
    });

    if (res.response.status === LoginStatus.TWO_FACTOR) {
        console.log('need two-step verification');
        
        const { token, expireSeconds } = await apiClient.sendTwoFactor('tms');
        console.log('token: ', token);

        const loop = setInterval(async () => {
            const { response, cookieJar } = await apiClient.verifyTwoFactor('tms', {
                token,
            });

            if (response.status === LoginStatus.SUCCESS) {
                console.log('success!');
                console.log(cookieJar);

                process.exit(0);
            } else {
                console.error(`error with status ${response.status}`);

                process.exit(1);
            }
        }, 1000);

        setTimeout(() => {
            clearInterval(loop);
            console.log('timeout!');

            process.exit(1);
        }, expireSeconds * 1000);
    } else if (res.response.status === LoginStatus.SUCCESS) {
        console.log(res);
    }
}

main()
```
