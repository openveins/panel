interface JWTPayload {
    sub: string;
    username: string;
    email: string;
    role: string;
    exp: number;
    iat: number;
}

function isTokenExpired(token: string){
    const payload = parseJWT(token);
    if(!payload?.exp) return true;
    return payload.exp * 1000 < Date.now();
}

function parseJWT(token: string): JWTPayload | null{
    try{
        const base = token.split(".")[1]
        const json = atob(base);
        return JSON.parse(json);
    }catch(e){
        return null;
    }
}

export {isTokenExpired, parseJWT};