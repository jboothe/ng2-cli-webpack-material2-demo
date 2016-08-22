import { CliMtrl20822Page } from './app.po';

describe('cli-mtrl2-0822 App', function() {
  let page: CliMtrl20822Page;

  beforeEach(() => {
    page = new CliMtrl20822Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
