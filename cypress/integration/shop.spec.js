describe('创建店铺', () => {
  before(() => {
    cy.viewport('iphone-x')
  })
  it('创建第一个店铺', () => {
    cy.loginNewUser()
    cy.server()
    cy.route('GET', '/api/v1/shop?**').as('shops')
    cy.visit('#/admin/shops')
    cy.wait('@shops').its('status').should('be', 200)
    cy.contains('创建新的店铺').should('exist').click()
    cy.get('input[placeholder="* 店铺名称"]').type('My Shop 1')
    cy.get('input[placeholder="* 店铺描述"]').type('专门卖前端书籍')
    cy.contains('提交').should('exist').click()
    cy.contains('创建成功').should('exist')
    cy.contains('确定').click()
    cy.mutate(['/shop', 1, 10])
    cy.contains('My Shop 1').should('exist')
  })
  xit('创建第一个中文店铺', () => {
    cy.loginNewUser()
    cy.server()
    cy.route('GET', '/api/v1/shop?**').as('shops')
    cy.visit('#/admin/shops')
    cy.wait('@shops').its('status').should('be', 200)
    cy.contains('创建新的店铺').should('exist').click()
    cy.get('input[placeholder="* 店铺名称"]').type('小明的店铺1')
    cy.get('input[placeholder="* 店铺描述"]').type('专门卖前端书籍')
    cy.contains('提交').should('exist').click()
    cy.contains('创建成功').should('exist')
    cy.contains('确定').click()
    cy.mutate(['/shop', 1, 10])
    cy.contains('小明的店铺1').should('exist')
  })
})