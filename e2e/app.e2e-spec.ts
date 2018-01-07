import { LemonchaPage } from './app.po';

describe('lemoncha App', () => {
  let page: LemonchaPage;

  beforeEach(() => {
    page = new LemonchaPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
