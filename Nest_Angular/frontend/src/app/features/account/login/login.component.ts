import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, ReactiveFormsModule, MatButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  fb = inject(NonNullableFormBuilder);
  registerForm = this.fb.group({
    email: this.fb.control('', [Validators.required, Validators.email]),
    senha: this.fb.control('', [
      Validators.required, 
      Validators.minLength(8)
    ]),
  });

}
