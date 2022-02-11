import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/login/login.component';
import { ResetComponent } from './Auth/reset/reset.component';
import { SignupComponent } from './Auth/signup/signup.component';
import { VerifyEmailComponent } from './Auth/verify-email/verify-email.component';
import { EditProfileComponent } from './Components/edit-profile/edit-profile.component';
import { OtherUsersComponent } from './Components/other-users/other-users.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { FeedsComponent } from './feeds/feeds.component';

const routes: Routes = [
  { path: '',   redirectTo: '/sign-in', pathMatch: 'full' },
  { path: 'sign-in', component: LoginComponent },
  { path: 'forgot-password', component: ResetComponent },
  { path: 'register-user', component: SignupComponent },
  { path: 'verify-email-address', component: VerifyEmailComponent },
  { path: 'feeds', component: FeedsComponent},
  { path: 'user-profile', component: UserProfileComponent},
  { path: 'other-users', component: OtherUsersComponent},
  { path: 'edit-profile', component: EditProfileComponent}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
