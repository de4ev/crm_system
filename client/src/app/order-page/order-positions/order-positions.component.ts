import { Component, OnInit } from '@angular/core';
import { PositionService } from '../../shared/services/positions.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { Position } from '../../shared/interfaces';
import { switchMap, map } from 'rxjs/operators';
import { OrderService } from '../order.service';
import { MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.css']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>

  constructor(
    private positionService: PositionService,
    private orderService: OrderService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            return this.positionService.fetch(params['id'])
          }
        ),
        map((positions: Position[]) => {
          return positions.map(position => {
            position.quantity = 1
            return position
          })
        })

      )
  }
  addToOrder(position: Position) {
    this.orderService.add(position)
    MaterialService.toast(`Добавлено x${position.quantity}`)
  }
 
}
