import { MaterialInstance } from 'src/app/shared/classes/material.service';
import { ElementRef } from "@angular/core";

declare var M

export interface MaterialInstance {
    open?(): void
    close?(): void
    destroy?(): void
}

export interface MaterialDatePicker extends MaterialInstance {
    date?: Date
}

export class MaterialService {
    static toast(message: string) {
        M.toast({html: message})
    }

    static initializeFloatingButton(ref: ElementRef) {
        M.FloatingActionButton.init(ref.nativeElement)
    }
    static updateTextInputs() {
        M.updateTextFields()
    }
    static initModal(modalRef: ElementRef): MaterialInstance {
        return M.Modal.init(modalRef.nativeElement)
    }
    static initTooltip(tooltipRef: ElementRef): MaterialInstance {
        return M.Tooltip.init(tooltipRef.nativeElement)
    }
    static initDatePicker(datePickerpRef: ElementRef, onClose: () => void): MaterialDatePicker {
        return M.Datepicker.init(datePickerpRef.nativeElement, {
            format: 'dd.mm.yyyy',
            showClearBtn: true,
            onClose
        })
    }
    static initTapTarget(tapTargetRef: ElementRef): MaterialInstance {
        return M.TapTarget.init(tapTargetRef.nativeElement)
    }
}