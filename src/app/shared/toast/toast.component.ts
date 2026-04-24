import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div id="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast">{{ toast.text }}</div>
      }
    </div>
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);
}
