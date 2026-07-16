import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-animated-counter',
  template: `<span>{{ displayValue() }}</span>`,
})
export class AnimatedCounter implements OnChanges {
  @Input({ required: true }) value = 0;
  @Input() format: 'number' | 'percent' = 'number';
  @Input() durationMs = 700;

  readonly displayValue = signal('0');

  private frameId: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if ('value' in changes || 'format' in changes) {
      this.animateTo(this.value);
    }
  }

  private animateTo(target: number): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
    }

    const start = performance.now();
    const from = this.parseCurrentValue();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / this.durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (target - from) * eased;
      this.displayValue.set(this.formatValue(current));

      if (progress < 1) {
        this.frameId = requestAnimationFrame(tick);
      } else {
        this.frameId = null;
        this.displayValue.set(this.formatValue(target));
      }
    };

    this.frameId = requestAnimationFrame(tick);
  }

  private parseCurrentValue(): number {
    const raw = this.displayValue().replace(/[^\d.-]/g, '');
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private formatValue(value: number): string {
    if (this.format === 'percent') {
      const decimals = Number.isInteger(value) ? 0 : 1;
      return `${value.toFixed(decimals)}%`;
    }

    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(
      Math.round(value),
    );
  }
}
