import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RouteguardService {

  constructor(private router: Router, private service: UserService) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    if (this.service.isUserLoggedIn()) {
      return true;
    }
    // Sayfalara yetkisiz giriş yapılmak istenirse login e yönlendirilecek
    this.router.navigate(['login']);
    return false;

  }
  
}
