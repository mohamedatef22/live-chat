import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree,Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(private _router:Router){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):boolean | UrlTree {
      // if(!localStorage.getItem('token')){
      //   this._router.navigate(['/'],{queryParams:{returnedFrom:route.url}})
      //   return false
      // }
      const user = JSON.parse(sessionStorage.getItem('user'));
      if(!user.type){
        this._router.navigate(['/home'],{queryParams:{notAuth:true}})
        return false
      }
      
    return true;
  }
  
}
