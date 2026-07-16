import {
  Component,
  ElementRef,
  HostListener,
  Input,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';

export interface ContactSelectOption {
  id: string;
  labelKey: string;
  descriptionKey: string;
}

@Component({
  selector: 'app-contact-select',
  imports: [TranslatePipe],
  templateUrl: './contact-select.html',
  styleUrl: './contact-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContactSelect),
      multi: true,
    },
  ],
})
export class ContactSelect implements ControlValueAccessor {
  private readonly host = inject(ElementRef<HTMLElement>);

  @Input({ required: true }) options: ContactSelectOption[] = [];
  @Input({ required: true }) placeholderKey!: string;
  @Input() id = '';
  @Input() labelledBy = '';

  readonly open = signal(false);
  readonly disabled = signal(false);
  readonly value = signal('');
  readonly activeIndex = signal(-1);

  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  get selectedOption(): ContactSelectOption | undefined {
    return this.options.find((option) => option.id === this.value());
  }

  get listboxId(): string {
    return `${this.id || 'contact-select'}-listbox`;
  }

  get valueLabelId(): string {
    return `${this.id || 'contact-select'}-value`;
  }

  get triggerLabelledBy(): string | null {
    if (!this.labelledBy) {
      return null;
    }

    return `${this.labelledBy} ${this.valueLabelId}`;
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  toggle(): void {
    if (this.disabled()) {
      return;
    }

    if (this.open()) {
      this.close();
      return;
    }

    this.openPanel();
  }

  openPanel(): void {
    if (this.disabled() || this.open()) {
      return;
    }

    const selectedIndex = this.options.findIndex((option) => option.id === this.value());
    this.activeIndex.set(selectedIndex >= 0 ? selectedIndex : 0);
    this.open.set(true);
  }

  close(): void {
    if (!this.open()) {
      return;
    }

    this.open.set(false);
    this.activeIndex.set(-1);
    this.onTouched();
  }

  selectOption(option: ContactSelectOption): void {
    this.value.set(option.id);
    this.onChange(option.id);
    this.close();
  }

  optionId(index: number): string {
    return `${this.listboxId}-option-${index}`;
  }

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.disabled()) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!this.open()) {
          this.openPanel();
          if (event.key === 'ArrowUp') {
            this.activeIndex.set(this.options.length - 1);
          }
        } else {
          this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
        }
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!this.open()) {
          this.openPanel();
        } else {
          this.selectActive();
        }
        break;
      case 'Escape':
        if (this.open()) {
          event.preventDefault();
          this.close();
        }
        break;
      case 'Tab':
        this.close();
        break;
      case 'Home':
        if (this.open()) {
          event.preventDefault();
          this.activeIndex.set(0);
        }
        break;
      case 'End':
        if (this.open()) {
          event.preventDefault();
          this.activeIndex.set(this.options.length - 1);
        }
        break;
      default:
        break;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.open()) {
      return;
    }

    if (!this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  private moveActive(delta: number): void {
    const count = this.options.length;
    if (count === 0) {
      return;
    }

    const current = this.activeIndex();
    const next = current < 0 ? 0 : (current + delta + count) % count;
    this.activeIndex.set(next);
  }

  private selectActive(): void {
    const index = this.activeIndex();
    const option = this.options[index];
    if (option) {
      this.selectOption(option);
    }
  }
}
