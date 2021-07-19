import { Component, ElementRef, ViewChild } from "@angular/core";
import { animationFrameScheduler, defer, interval } from "rxjs";
import { endWith, map, takeWhile } from "rxjs/operators";
@Component({
  selector: "app-root",
  template: `
    <div #app id="app">
      <img
        #ditto
        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png"
        alt="pikachu"
      />
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent {
  @ViewChild("app", { static: true, read: ElementRef })
  divEl!: ElementRef<HTMLDivElement>;
  @ViewChild("ditto", { static: true, read: ElementRef })
  dittoEl!: ElementRef<HTMLImageElement>;
  title = "animationScheduler";

  animationPerSecond$ = defer(() => {
    const scheduler = animationFrameScheduler;
    const dateNow = scheduler.now();
    return interval(1000 / 60, animationFrameScheduler).pipe(
      map((_) => scheduler.now() - dateNow)
    );
  });

  duration$ = this.animationPerSecond$;

  ngOnInit(): void {
    this.distance(500, 2500).subscribe((distance) => {
      const dittoEl = this.dittoEl.nativeElement;
      dittoEl.style.transform = `translate3D(${distance}px,0px,0px)`;
    });
  }

  duration(ms: number) {
    return this.animationPerSecond$.pipe(
      map((ems) => this.easeInOutBack(ems / ms)),
      takeWhile((t) => t <= 1),
      endWith(1)
    );
  }

  distance(pixel: number, duration = 1000) {
    return this.duration(duration).pipe(map((percent) => percent * pixel));
  }

  easeInOutBack(x: number): number {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;

    return x < 0.5
      ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2
      : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
  }
}
