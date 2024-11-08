import { Component, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
  styleUrl: './error-messages.component.css'
})
export class ErrorMessagesComponent {
  errorMessages: Map<string, string> = new Map<string, string>();
  successMessages: Map<string, string> = new Map<string, string>();
  infoMessages: Map<string, string> = new Map<string, string>();
}


