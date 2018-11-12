import { Component, Input, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Order } from '../../shared/interfaces';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements AfterViewInit, OnDestroy {

  constructor() {}

  
  @Input() orders: Order[]
  @ViewChild('modal') modalRef: ElementRef
  
  modal: MaterialInstance
  selectedOrder: Order
  
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)    
  }

  ngOnDestroy() {
    this.modal.destroy()
  }

  selectOrder(order: Order) {
    this.selectedOrder = order
    this.modal.open()
  }

  closeModal() {
    this.modal.close()
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, item) => {
      return total += item.quantity * item.cost
    }, 0) 
  }
}
