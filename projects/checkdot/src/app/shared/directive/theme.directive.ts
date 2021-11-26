import { AfterViewInit, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Directive({
  selector: '[appTheme]'
})
export class ThemeDirective implements AfterViewInit {

  @Input("dark") public darkClasses: Array<string>;
  @Input("light") public lightClasses: Array<string>;

  @Input("appTheme") public containsCondition: string;

  constructor(public renderer: Renderer2, public element: ElementRef, public themeService: ThemeService) {
  }

  ngAfterViewInit(): void {
    this.themeService.$theme.subscribe((theme) => {
      if (this.containsCondition === 'true'
        && [...this.darkClasses, ... this.lightClasses].map(x => this.element.nativeElement.classList.contains(x)).reduce((a, b) => a + (b ? 1 : 0), 0) === 0) {
        return ;
      }
      if (theme === 'dark') {
        this.darkClasses.forEach(x => {
          this.element.nativeElement.classList.add(x);
        });
        this.lightClasses.forEach(x => {
          this.element.nativeElement.classList.remove(x);
        });
      } else {
        this.lightClasses.forEach(x => {
          this.element.nativeElement.classList.add(x);
        });
        this.darkClasses.forEach(x => {
          this.element.nativeElement.classList.remove(x);
        });
      }
    });
  }

  

}
