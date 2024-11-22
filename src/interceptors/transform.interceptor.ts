// src/interceptors/transform.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  export interface Response<T> {
    data: T;
    meta?: any;
  }
  
  @Injectable()
  export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Observable<Response<T>> {

      const httpContext = context.switchToHttp();
      const request = httpContext.getRequest();

      console.log('Incoming request details:', {
        url: request.url,
        method: request.method,
        params: request.params,
        query: request.query,
        body: request.body,
      });
      
      return next.handle().pipe(
        map(response => {
          console.log('Interceptor: After handler execution, raw response:', response);
          if (response?.data && response?.meta) {
            console.log('Structured response detected, returning as-is.');
            return response;
          }
          console.log('No meta or data detected, wrapping response in default structure.')
          return {
            data: response || null, // Safely handle null/undefined responses
            meta: null,
          };
        }),
      );
    }
  }