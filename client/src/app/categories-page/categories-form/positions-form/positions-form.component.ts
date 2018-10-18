import { Component, OnInit, Input } from '@angular/core';
import { PositionService } from 'src/app/shared/services/positions.service';
import { Position } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit {

  positions: Position[] = []
  loading = false

  @Input('categoryId') categoryId: string;
  constructor(
    private positionService: PositionService
  ) { }

  ngOnInit() {
    this.loading = true
    this.positionService.fetch(this.categoryId)
      .subscribe(
        positions => {
          this.positions = positions
          this.loading = false
        })
  }
}
