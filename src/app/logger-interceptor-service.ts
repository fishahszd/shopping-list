import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export class LoggerInterceptorService implements HttpInterceptor {
    
    //interceptor for logging http messages
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("REST request: \n url: " + req.url + "\n method: " + req.method + "\n body: " + JSON.stringify(req.body)) ;
        return next.handle(req).pipe(
            tap(event => {
                if (event instanceof HttpResponse) {
                    console.log("REST response: \n status: " + event.status + ",\n body: " + JSON.stringify(event.body));
                }
            })
        );
    }
    
}