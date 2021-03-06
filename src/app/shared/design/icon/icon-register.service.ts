import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Injectable({
  providedIn: 'root'
})
export class IconRegisterService {

  private readonly icons = [
    'folder',
    'chevron-right',
    'arrow-left',
    'arrow-around',
    'arrow-expanded',
    'rust',
    'cpp',
    'foreign-system',
    'fuzzing',
    'local',
    'remote',
  ];

  constructor(private iconRegistry: MatIconRegistry,
              private sanitizer: DomSanitizer) { }

  loadIcons(): void {
    this.icons.forEach(icon => {
      this.iconRegistry.addSvgIcon(icon, this.sanitizer.bypassSecurityTrustResourceUrl(`assets/icon/${icon}.svg`));
    });
  }
}
