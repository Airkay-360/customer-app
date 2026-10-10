import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerService, Customer } from './customer'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html' 
})
// Changed from AppComponent to App to match your main.ts file
export class App implements OnInit {
  customerService = inject(CustomerService);
  customers: Customer[] = [];
  
  currentCustomer: Customer = this.getEmptyCustomer();
  isEditing = false;

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(data => this.customers = data);
  }

  saveCustomer() {
    if (this.isEditing && this.currentCustomer.id) {
      this.customerService.updateCustomer(this.currentCustomer.id, this.currentCustomer).subscribe(() => {
        this.loadCustomers();
        this.resetForm();
      });
    } else {
      this.customerService.createCustomer(this.currentCustomer).subscribe(() => {
        this.loadCustomers();
        this.resetForm();
      });
    }
  }

  editCustomer(customer: Customer) {
    this.currentCustomer = { ...customer };
    this.isEditing = true;
  }

  deleteCustomer(id: number | undefined) {
    if (id) {
      this.customerService.deleteCustomer(id).subscribe(() => this.loadCustomers());
    }
  }

  resetForm() {
    this.currentCustomer = this.getEmptyCustomer();
    this.isEditing = false;
  }

  getEmptyCustomer(): Customer {
    return { name: '', address_line_1: '', address_line_2: '', city: '', state: '', zip: '' };
  }
}