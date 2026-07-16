import { Component } from '@angular/core';
import { TranslatePipe } from '../../../core/pipes/translate.pipe';
import { PLATFORM_ASSETS } from '../ai-platform.model';

@Component({
  selector: 'app-platform-clusters',
  imports: [TranslatePipe],
  templateUrl: './platform-clusters.html',
  styleUrl: './platform-clusters.scss',
})
export class PlatformClusters {
  readonly mapImage = PLATFORM_ASSETS.clusterMap;
  readonly progress = 82;
}
