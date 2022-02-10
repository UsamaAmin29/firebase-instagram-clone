import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { ResetComponent } from './Auth/reset/reset.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { VerifyEmailComponent } from './Auth/verify-email/verify-email.component';
import { FeedsComponent } from './feeds/feeds.component';

const routes: Routes = [
  { path: '',   redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: LoginComponent },
  { path: 'forgot-password', component: ResetComponent },
  { path: 'register-user', component: SignupComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'feeds', component: FeedsComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
