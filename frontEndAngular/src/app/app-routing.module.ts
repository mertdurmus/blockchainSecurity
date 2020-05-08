import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChainComponent } from './chain/chain.component';
import { RegisterComponent } from './register/register.component';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { MiningComponent } from './mining/mining.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path: 'chain', component: ChainComponent},
  {path: 'sign', component: RegisterComponent},
  {path: 'transaction', component: NewTransactionComponent},
  {path: 'mining', component: MiningComponent},
  {path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
