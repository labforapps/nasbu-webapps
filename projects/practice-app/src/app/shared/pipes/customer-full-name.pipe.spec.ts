import { CustomerFullNamePipe } from './customer-full-name.pipe';

describe('CustomerFullNamePipe', () => {
  it('create an instance', () => {
    const pipe = new CustomerFullNamePipe();
    expect(pipe).toBeTruthy();
  });
});
