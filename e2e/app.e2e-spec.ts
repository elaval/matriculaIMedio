import { MatriculaIMedioPage } from './app.po';

describe('matricula-imedio App', () => {
  let page: MatriculaIMedioPage;

  beforeEach(() => {
    page = new MatriculaIMedioPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
