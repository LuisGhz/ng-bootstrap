import {async, TestBed, ComponentFixture} from '@angular/core/testing';

import {Component} from '@angular/core';

import {NgbHighlight} from './highlight';
import {NgbTypeaheadModule} from './index';


/**
 * Get generated innerHtml without HTML comments and Angular debug attributes
 */
function highlightHtml(fixture) {
  const elms = fixture.nativeElement.children[0].childNodes;
  let elm;
  let result = '';
  let nodeName;

  for (let i = 0; i < elms.length; i++) {
    elm = elms[i];

    if (elm.nodeType === Node.ELEMENT_NODE) {
      nodeName = elm.nodeName.toLowerCase();
      result += `<${nodeName} class="${elm.className}">${elm.textContent}</${nodeName}>`;
    } else if (elm.nodeType === Node.TEXT_NODE) {
      result += elm.wholeText;
    }
  }

  return result;
}

function createTestComponentFixture(html: string): ComponentFixture<TestComponent> {
  TestBed.overrideComponent(TestComponent, {set: {template: html}});
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();
  return fixture;
}

describe('ngb-highlight', () => {

  beforeEach(() => {
    TestBed.overrideModule(NgbTypeaheadModule, {set: {exports: [NgbHighlight]}});
    TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbTypeaheadModule]});
  });

  it('should render highlighted text when there is one match', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight result="foo bar baz" term="bar"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">bar</span> baz');
     }));

  it('should render highlighted text when there are multiple matches', async(() => {
       const fixture =
           createTestComponentFixture('<ngb-highlight result="foo bar baz bar foo" term="bar"></ngb-highlight>');

       expect(highlightHtml(fixture))
           .toBe('foo <span class="ngb-highlight">bar</span> baz <span class="ngb-highlight">bar</span> foo');
     }));

  it('should render highlighted text when there is a match at the beginning', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight result="bar baz" term="bar"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe('<span class="ngb-highlight">bar</span> baz');
     }));

  it('should render highlighted text when there is a match at the end', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight result="bar baz" term="baz"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe('bar <span class="ngb-highlight">baz</span>');
     }));

  it('should render highlighted text when there is a case-insensitive match', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight result="foo bAR baz" term="bar"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">bAR</span> baz');
     }));

  it('should render highlighted text with special characters', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight result="foo (bAR baz" term="(BAR"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe('foo <span class="ngb-highlight">(bAR</span> baz');
     }));

  it('should render highlighted text for stringified non-string args', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight [result]="123" term="2"></ngb-highlight>');
       fixture.detectChanges();
       expect(highlightHtml(fixture)).toBe('1<span class="ngb-highlight">2</span>3');
     }));

  it('should behave reasonably for blank result', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight [result]="null" term="2"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe('');
     }));

  it('should not convert null result to string', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight [result]="null" term="null"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe('');
     }));

  it('should properly detect matches in 0 result', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight [result]="0" term="0"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe(`<span class="ngb-highlight">0</span>`);
     }));

  it('should not higlight anything for blank term', async(() => {
       const fixture = createTestComponentFixture('<ngb-highlight result="1null23" [term]="null"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe('1null23');
     }));

  it('should not higlight anything for blank term', async(() => {
       const fixture = createTestComponentFixture(`<ngb-highlight result="123" [term]="''"></ngb-highlight>`);

       expect(highlightHtml(fixture)).toBe('123');
     }));

  it('should properly higlight zeros', async(() => {
       const fixture = createTestComponentFixture(`<ngb-highlight result="0123" [term]="0"></ngb-highlight>`);

       expect(highlightHtml(fixture)).toBe('<span class="ngb-highlight">0</span>123');
     }));

  it('should support custom highlight class', async(() => {
       const fixture =
           createTestComponentFixture('<ngb-highlight result="123" [term]="2" highlightClass="my"></ngb-highlight>');

       expect(highlightHtml(fixture)).toBe('1<span class="my">2</span>3');
     }));
});


@Component({selector: 'test-cmp', template: ''})
class TestComponent {
}