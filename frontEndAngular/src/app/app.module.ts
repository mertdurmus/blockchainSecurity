import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChainComponent } from './chain/chain.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { NewTransactionComponent } from './new-transaction/new-transaction.component';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { BlockService } from './services/block.service';
import { MiningComponent } from './mining/mining.component';
import { UserService } from './services/user.service';
import { LoginComponent } from './login/login.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';

@NgModule({
  declarations: [
    AppComponent,
    ChainComponent,
    RegisterComponent,
    NewTransactionComponent,
    MiningComponent,
    LoginComponent,
    MainmenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [BlockService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
