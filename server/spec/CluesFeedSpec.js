import CluesFeed from '../Controllers/CluesFeed'

describe('Clues Feed Controller', () => {
  const clue = {
    hint: 'boat',
    associated: 2,
    team: 'Blue',
  }
  const clue2 = {
    hint: 'monkey',
    associated: 1,
    team: 'Red',
  }
  it('can add clues to the feed', () => {
    expect(CluesFeed.addToCluesFeed([], clue)).toEqual([clue])
  })

  it('can add clues to the top of the feed', () => {
    expect(CluesFeed.addToCluesFeed([clue], clue2)).toEqual([clue2, clue])
  })
})
