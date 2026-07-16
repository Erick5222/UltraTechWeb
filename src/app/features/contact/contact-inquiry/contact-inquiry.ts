import { Component } from '@angular/core';
import { ContactSidebar } from '../contact-sidebar/contact-sidebar';
import { ContactForm } from '../contact-form/contact-form';

@Component({
  selector: 'app-contact-inquiry',
  imports: [ContactSidebar, ContactForm],
  templateUrl: './contact-inquiry.html',
  styleUrl: './contact-inquiry.scss',
})
export class ContactInquiry {}
