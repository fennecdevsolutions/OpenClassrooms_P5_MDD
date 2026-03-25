import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from "@angular/platform-browser";


/**
 * Finds a DebugElement by data-testid
 */
export const getByTestId = (fixture: ComponentFixture<any>, testId: string): DebugElement =>
    fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));

/**
 * Finds all DebugElement by data-testid
 */
export const getAllByTestId = (fixture: ComponentFixture<any>, testId: string): DebugElement[] =>
    fixture.debugElement.queryAll(By.css(`[data-testid="${testId}"]`));

/**
 * Finds a NativeElement by data-testid
 */
export const getElementByTestId = <T extends HTMLElement>(fixture: ComponentFixture<any>, testId: string): T =>
    getByTestId(fixture, testId)?.nativeElement;