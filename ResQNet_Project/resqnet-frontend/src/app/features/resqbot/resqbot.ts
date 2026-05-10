import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-resqbot',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './resqbot.html',
  styleUrl: './resqbot.css'
})
export class ResqbotComponent {
  messages: Message[] = [
    {
      role: 'assistant',
      content: 'আমি ResQBot 🤖 — আপনার দুর্যোগ সহায়তা AI। কিভাবে সাহায্য করতে পারি?'
    }
  ];
  userInput = '';
  loading = false;
  error = '';

  // Config — API key 
  provider = '';
  apiKey = '';

  @ViewChild('chatBox') chatBox!: ElementRef;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {
    this.loadConfig();
  }

  sendMessage() {
    if (!this.userInput.trim() || this.loading) return;

    const userMsg = this.userInput.trim();
    this.userInput = '';
    this.error = '';

    this.messages.push({ role: 'user', content: userMsg });
    this.loading = true;
    this.cdr.detectChanges();
    this.scrollToBottom();

    const history = this.messages.slice(0, -1).map(m => ({
      role: m.role,
      content: m.content
    }));

    this.http.post<{ reply: string }>(`${environment.apiUrl}/resqbot/chat`, {
      provider: this.provider,
      apiKey: this.apiKey,
      message: userMsg,
      history: history
    }).subscribe({
      next: (res) => {
        this.messages.push({ role: 'assistant', content: res.reply });
        this.loading = false;
        this.cdr.detectChanges();
        this.scrollToBottom();
      },
      error: () => {
        this.error = 'Connection failed. Try again.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatBox) {
        this.chatBox.nativeElement.scrollTop = this.chatBox.nativeElement.scrollHeight;
      }
    }, 100);
  }

  onEnter(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  configSaved = false;

  saveConfig() {
    localStorage.setItem('resqbot_provider', this.provider);
    localStorage.setItem('resqbot_key', this.apiKey);
    this.configSaved = true;
    setTimeout(() => { this.configSaved = false; this.cdr.detectChanges(); }, 2000);
    this.cdr.detectChanges();
  }

  loadConfig() {
    const provider = localStorage.getItem('resqbot_provider');
    const key = localStorage.getItem('resqbot_key');
    if (provider) this.provider = provider;
    if (key) this.apiKey = key;
  }
}