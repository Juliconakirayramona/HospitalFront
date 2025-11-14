import { inject, Injectable } from '@angular/core'; 
import { environment } from '../../../../environments/environments'; 
import { HttpClient } from '@angular/common/http'; import { Observable, pipe, tap } from 'rxjs'; 
import { Router } from '@angular/router';
export interface LoginRequest { 
    email: string; 
    password: string;

 } export interface UserResponse { 
    id_user: string; // UUID 
    username: string; 
    email: string; 
    rol_user: string;  active: boolean; 

} export interface LoginResponse { 

    access_token: string; 
    token_type: string;  
    user: UserResponse; 
} @Injectable({ providedIn: 'root', }) 

export class Auth { 
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl; 

    constructor(private router: Router) {}


    login(payload: LoginRequest): Observable<LoginResponse> { 
        return this.http .post<LoginResponse>(`${this.baseUrl}/auth/login`, payload).pipe( 
            tap((res) => { 
                // Guardar token y datos de usuario (¡cuidado con SSR!) 
                localStorage.setItem('access_token', res.access_token); 
                localStorage.setItem('user', JSON.stringify(res.user)); }) ); 
            } 
            
        logout() { 
            localStorage.removeItem('access_token'); 
            localStorage.removeItem('user'); 
            this.router.navigate(['/login']);
        } 
        getToken(): string | null 
            { return localStorage.getItem('access_token'); 

            } 
        getUser(): any { 
                const raw = localStorage.getItem('user'); 
                return raw ? JSON.parse(raw) : null; 
            } 
        isLoggedIn(): boolean { 
            return !!this.getToken(); 
        } 
}