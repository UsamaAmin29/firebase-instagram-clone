import { Inject, Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import { Auth } from 'firebase/auth';
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";

import { Router } from "@angular/router";
import { AuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { VerifyEmailComponent } from 'src/app/Auth/verify-email/verify-email.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { user } from 'rxfire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userData: any; // Save logged in user data
  public userProfile: any; // Save logged in user data
  // Auth: any;
  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone, // NgZone service to remove outside scope warning
    // public Auth: Auth,
  ) {
    /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      if (user) {

        this.userData = user;
        this.afs.doc(`users/${user?.uid}`).ref.get().then((data) => {
          this.userProfile = data.data();
        });
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user') || '');
      } else {
        localStorage.setItem('user', '');
        JSON.parse(localStorage.getItem('user') || '');
      }
    })
  }

  LoadFunction(result: any) {
    this.afs.doc(`users/${result.user?.uid}`).ref.get().then((data) => {
      this.userProfile = data.data();

    });
  }
  // Sign in with email/password
  SignIn(email: string, password: string) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
        this.SetUserData(result.user);
        this.afs.doc(`users/${result.user?.uid}`).ref.get().then((data) => {
          this.userProfile = data.data();
        });
      }).catch((error) => {
        window.alert(error.message)
      })
  }
  // Sign up with email/password
  SignUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
        this.SetUserData(result.user);
        window.alert("Varification Email Sended.");
      }).catch((error) => {
        window.alert(error.message)
      })
  }
  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser.then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verify-email']);
      })
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail: string) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      })
  }

  // get isLoggedIn(): boolean {
  //   const user = JSON.parse(localStorage.getItem('user'));
  //   return (user !== null && user.emailVerified !== false) ? true : false;
  // }


  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return (user !== null && user.emailVerified !== false) ? true : false;
  }
  // Sign in with Google
  GoogleAuth() {
    return this.AuthLogin(new GoogleAuthProvider());
  }
  // Auth logic to run auth providers
  AuthLogin(provider: AuthProvider) {
    return this.afAuth.signInWithPopup(provider)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigate(['feeds']);
        });
        this.SetUserData(result.user);
        this.afs.doc(`users/${result.user?.uid}`).ref.get().then((data) => {
          this.userProfile = data.data();
        });
      }).catch((error) => {
        window.alert(error)
      })
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user: any) {

    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    }

    userRef.set(userData, {
      merge: true
    });
  }


  EditUserData(name: string, displayName: string, phone: string, address: string, education: string, country: string, state: string, region: string) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${this.userData.uid}`);
    this.userProfile.fullName = name;
    this.userProfile.displayName = displayName;
    this.userProfile.phoneNumber = phone;
    this.userProfile.address = address;
    this.userProfile.education = education;
    this.userProfile.country = country;
    this.userProfile.state = state;
    this.userProfile.region = region;
    return userRef.set(this.userProfile, {
      merge: true
    })

  }

  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);

    })
  }
}