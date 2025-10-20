﻿import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {inject} from '@angular/core';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';


export abstract class BaseService<T> {
  protected httpOptions = { headers: new HttpHeaders({'Content-Type': 'application/json'})};
  protected serverBaseUrl: string =  `${environment.serverBaseUrl}`;


  protected resourceEndpoint: string = '/resources';


  protected http: HttpClient = inject(HttpClient);


  protected handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error(`An error occurred: ${error.error.message}`);
    } else {
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }


  protected resourcePath(): string {
    return `${this.serverBaseUrl}${this.resourceEndpoint}`;
  }


  public create(resource: T): Observable<T> {
    return this.http.post<T>(this.resourcePath(), JSON.stringify(resource), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


  public delete(id: any): Observable<any> {
    return this.http.delete(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


  public update(id: any, resource: T): Observable<T> {
    return this.http.put<T>(`${this.resourcePath()}/${id}`, JSON.stringify(resource), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }


  public getAll(): Observable<Array<T>> {
    return this.http.get<Array<T>>(this.resourcePath(), this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }

  public getByParm(param:string,value: any): Observable<T[]> {
    return this.http.get<T[]>(`${this.resourceEndpoint}?${param}=${value}`)
  }
  public getById(id: any): Observable<T> {
    return this.http.get<T>(`${this.resourcePath()}/${id}`, this.httpOptions)
      .pipe(retry(2), catchError(this.handleError));
  }
}
