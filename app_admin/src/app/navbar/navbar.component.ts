import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css'],
    standalone: true,
    imports: [NgIf, RouterLink]
})
export class NavbarComponent implements OnInit {
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) { }

    ngOnInit() { }

    public getHomeRoute(): string {
        return this.isLoggedIn() ? '/list-trips' : '/';  
    }

    public isLoggedIn(): boolean {
        return this.authenticationService.isLoggedIn();
    }

    public onLogout(): void {
        this.authenticationService.logout();
        this.router.navigate(['/']);
    }
}