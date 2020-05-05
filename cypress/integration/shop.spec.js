describe('创建店铺', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.server()
    cy.route('GET', '/api/v1/shop?**').as('shops')
    cy.route('GET', '/api/v1/goods?**').as('goods')
    cy.route('POST', '/api/v1/goods').as('createGoods')
    cy.route('PATCH', '/api/v1/shop/**').as('updateShop')
    cy.route('GET', '/api/v1/shop/**').as('getShop')
    cy.route('DELETE', '/api/v1/shop/**').as('deleteShop')
  })
  const createShop = () => {
    cy.visit('#/admin/shops')
    cy.wait('@shops').its('status').should('be', 200)
    cy.contains('创建新的店铺').should('exist').click()
    cy.get('input[placeholder="* 店铺名称"]').type('小明的店铺1')
    cy.get('input[placeholder="* 店铺描述"]').type('专门卖前端书籍')
    cy.contains('提交').should('exist').click()
    cy.contains('创建成功').should('exist')
    cy.contains('确定').click()
    cy.mutate(['/shop', 1, 10])
    return cy.wait('@shops').then(xhr => {
      shopId = xhr.response.body.data[0].id
      assert.isNumber(shopId)
      return shopId
    })
  }
  it('创建第一个店铺', () => {
    cy.loginByTel()
    createShop().as('shopId')
    cy.contains('小明的店铺1').should('exist').click()
    cy.wait('@goods').its('status').should('be', 200)
    cy.contains('创建新的商品').should('exist').click()
    cy.get('input[placeholder="* 标题"]').type('你不知道的 JavaScript（上册）')
    cy.get('input[placeholder="* 价格"]').type('99')
    cy.get('input[placeholder="* 库存"]').type('1')
    cy.get('input[placeholder="副标题"]').type('一本不错的前端书籍')
    cy.get('input[placeholder="详细描述"]').type('目录如下第一章第二章第三章')
    cy.get('input[placeholder="图片"]').type('http://img10.360buyimg.com/popWaterMark/jfs/t1108/313/654026725/44660/cb489070/55388400N4a99b6e5.jpg')
    cy.contains('提交').click()
    cy.wait('@createGoods').its('status').should('be', 201)
    cy.contains('确定').click()
    cy.wait('@goods').its('status').should('be', 200)
    cy.get('h3').contains('你不知道的 JavaScript（上册）').should('exist')
    cy.get('span').contains(/^99$/).should('exist')
    cy.contains('设置').click()
    cy.get('input').eq(0).clear().type('换个名字')
    cy.contains('保存').click()
    cy.wait('@updateShop').its('status').should('be', 200)
    cy.contains('确定').click()
    cy.contains('删除店铺').click()
    cy.wait('@deleteShop').its('status').should('be', 200)
    cy.contains('确定').click()
    cy.hash().should('eq', '#/admin/shops')
    cy.contains('尚未创建店铺').should('exist')
    // 注销
    cy.contains('个人').click()
    cy.contains('登出').click()
    cy.contains('确定').click()
  })
})
