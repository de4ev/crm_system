import { Component, OnInit } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>\n',
})
export class AppComponent implements OnInit{
  constructor(
    private auth: AuthService
  ) {}
  ngOnInit() {
    const potentialToken = localStorage.getItem('authToken');
    if (potentialToken != null) {
      this.auth.setToken(potentialToken)
    }
  }
}
