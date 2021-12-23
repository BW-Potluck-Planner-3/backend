describe('Sanity', () => {
  it('is fine', () => {
    expect(true).not.toBe(false)
  })
})
describe('Node', () => {
  it('is in the testing environment', async () => {
    expect(process.env.NODE_ENV).toBe('testing')
  })
})
