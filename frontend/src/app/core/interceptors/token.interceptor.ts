import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

export const tokenInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    if (req.url.includes('/login') || req.url.includes('/register')) {
        return next(req);
    }

    const tokenKey = "MDD_token";
    const authReq = req.clone({
        setHeaders: {
            Authorization: `Bearer ${localStorage.getItem(tokenKey)}`
        }
    })
    return next(authReq)
}
