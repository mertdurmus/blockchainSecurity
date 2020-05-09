import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChainComponent } from './chain/chain.component';
import { RegisterComponent } from './register/register.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { MiningComponent } from './mining/mining.component';
import { LoginComponent } from './login/login.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { RouteguardService } from './services/routeguard.service';

const routes: Routes = [
  {path: 'chain', component: ChainComponent},
  {path: 'sign', component: RegisterComponent},
  {path: 'transaction', component: NewTransactionComponent},
  {path: 'mining', component: MiningComponent,  canActivate: [RouteguardService]},
  {path: 'login', component: LoginComponent},
  {path: 'main', component: MainmenuComponent },
  {path: '', redirectTo: 'main', pathMatch: 'full'}

  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
