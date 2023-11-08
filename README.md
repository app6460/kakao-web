[![npm version](https://badge.fury.io/js/kakao-web.svg)](https://www.npmjs.com/package/kakao-web)
[![License](https://img.shields.io/github/license/app6460/kakao-web)](/LICENSE)
# KakaoWeb
Kakao web auth api client   
카카오 웹 로그인 구현

## Install
```
npm i --save kakao-web
```

## Example
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
