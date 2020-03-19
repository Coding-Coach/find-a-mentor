import { generate, prefix } from '../titleGenerator';

const USA = 'United States';
jest.mock('svg-country-flags/countries.json', () => ({
  USA: 'United States',
}));

const tag = 'javascript';
const name = 'John Doe';
const country = 'USA';

describe.only('title generator', () => {
  it('should be only prefix by default', () => {
    const title = generate({});

    expect(title).toBe(`${prefix}`);
  });

  it('should be mentor name if supplied', () => {
    const title = generate({
      tag,
      name,
      country,
    });

    expect(title).toBe(`${prefix} | ${name}`);
  });

  it(`should be country's mentors if country supplied`, () => {
    const title = generate({
      country,
    });

    expect(title).toBe(`${prefix} | mentors from ${USA}`);
  });

  it(`should be tag's mentors if country supplied`, () => {
    const title = generate({
      tag,
    });

    expect(title).toBe(`${prefix} | ${tag} mentors`);
  });

  it(`should country's mentors if country supplied`, () => {
    const title = generate({
      country,
      tag,
    });

    expect(title).toBe(`${prefix} | ${tag} mentors from ${USA}`);
  });
});
