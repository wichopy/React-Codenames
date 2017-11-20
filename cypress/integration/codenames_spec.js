import gameboard from '../pages/gameboard'

describe('Codenames', () => {
  it('can create a spymaster password', () => {
    cy.visit(gameboard.url)

    cy.get(gameboard.children.createPassword).type('password')
    cy.get(gameboard.children.createPasswordButton).click()

    cy.get(gameboard.children.spymasterLogin).type('password')
    cy.get(gameboard.children.spymasterLoginButton).click()

    cy.get(gameboard.children.cluesAdderText).should('be.visible')
  })
})
