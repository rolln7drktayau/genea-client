import { ComponentFixture, TestBed } from '@angular/core/testing';

import { memoriesComponent } from './memories.component';

describe('memoriesComponent', () => {
  let component: memoriesComponent;
  let fixture: ComponentFixture<memoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [memoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(memoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
