import { Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { PositionService } from 'src/app/shared/services/positions.service';
import { Position } from 'src/app/shared/interfaces';
import { MaterialService, MaterialInstance } from '../../../shared/classes/material.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.css']
})
export class PositionsFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('categoryId') categoryId: string;
  @ViewChild('modal') modalRef: ElementRef;

  positions: Position[] = []
  loading = false
  modal: MaterialInstance
  form: FormGroup

  constructor(private positionService: PositionService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)])
    })
    this.loading = true
    this.positionService.fetch(this.categoryId)
      .subscribe(
        positions => {
          this.positions = positions
          this.loading = false
        })
  }
  ngAfterViewInit() {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  onSelectPosition(position: Position) {
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onAddPosition() {
    this.form.reset({name: '', cost: 1})
    this.modal.open()
    MaterialService.updateTextInputs()
  }

  onCancel() {
    this.modal.close()
  }

  onSubmit() {
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }
    this.positionService.create(newPosition).subscribe(
      position => {
        MaterialService.toast('Позиция создана')
        this.positions.push(position)
      },
      error => {
        this.form.enable()
        MaterialService.toast(error.error.message)
      },
      () => {
        this.modal.close()
        this.form.reset({name: '', cost: 1})
        this.form.enable()
      }
    )
  }

  onDeletePosition() {

  }

  ngOnDestroy() {
    this.modal.destroy()
  }
}
