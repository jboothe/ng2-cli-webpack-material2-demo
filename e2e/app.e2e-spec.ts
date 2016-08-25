import { SuperappPage } from './app.po';

describe('superapp App', function() {
  let page: SuperappPage;

  beforeEach(() => {
    page = new SuperappPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
