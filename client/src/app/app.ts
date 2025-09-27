import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private http = inject(HttpClient)
  protected readonly title = signal('Heart Beat');
  protected users = signal<any>([]);

  async ngOnInit(): Promise<void> {
    this.users.set(await this.getUsers())
  }

  async getUsers() {
    try{
      return lastValueFrom(this.http.get('https://localhost:7289/api/users')); 
    } catch (error){
      console.log(error);
      throw error;
    }
  }
}
