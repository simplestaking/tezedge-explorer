const isOcaml = (data) => data.settingsNode.activeNode.id.includes('ocaml');

describe('SYSTEM RESOURCES', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 2000 });
    cy.wait(1000);
  });

  it('[SYSTEM RESOURCES] should perform get resources request successfully', () => {
    cy.window()
      .its('store')
      .then((store) => {
        store.subscribe(data => {
          if (!isOcaml(store)) {
            const nodeId = data.settingsNode.activeNode.id.includes('ocaml') ? 'ocaml' : 'tezedge';
            cy.intercept('GET', '/resources/' + nodeId).as('getSystemResources');

            cy.visit(Cypress.config().baseUrl + '/#/resources/system', { timeout: 2000 });
            cy.wait(1000);
            cy.wait('@getSystemResources').its('response.statusCode').should('eq', 200);
          }
        });
      });
  });

  it('[SYSTEM RESOURCES] should parse tezedge RPC response successfully', () => {
    cy.wait(1000)
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.subscribe(store => {
              const ocaml = store.settingsNode.activeNode.id.includes('ocaml');
              if (!ocaml) {
                cy.wrap(store.resources.systemResources.colorScheme.domain).should('have.length', 7);

                if (!ocaml) {
                  cy.wrap(store.resources.systemResources.cpu).should('have.length', 3);
                  cy.wrap(store.resources.systemResources.cpu[0].name).should('eq', 'TOTAL');
                  cy.wrap(store.resources.systemResources.cpu[1].name).should('eq', 'NODE');
                  cy.wrap(store.resources.systemResources.cpu[2].name).should('eq', 'PROTOCOL RUNNERS');
                  cy.wrap(store.resources.systemResources.memory).should('have.length', 3);
                  cy.wrap(store.resources.systemResources.memory[0].name).should('eq', 'TOTAL');
                  cy.wrap(store.resources.systemResources.memory[1].name).should('eq', 'NODE');
                  cy.wrap(store.resources.systemResources.memory[2].name).should('eq', 'PROTOCOL RUNNERS');
                  cy.wrap(store.resources.systemResources.storage).should('have.length', 7);
                  cy.wrap(store.resources.systemResources.storage[0].name).should('eq', 'TOTAL');
                  cy.wrap(store.resources.systemResources.storage[1].name).should('eq', 'BLOCK STORAGE');
                  cy.wrap(store.resources.systemResources.storage[2].name).should('eq', 'CONTEXT IRMIN');
                  cy.wrap(store.resources.systemResources.storage[3].name).should('eq', 'DEBUGGER');
                  cy.wrap(store.resources.systemResources.storage[4].name).should('eq', 'CONTEXT ACTIONS');
                  cy.wrap(store.resources.systemResources.storage[5].name).should('eq', 'CONTEXT MERKLE ROCKS DB');
                  cy.wrap(store.resources.systemResources.storage[6].name).should('eq', 'MAIN DB');
                  cy.wrap(store.resources.systemResources.xTicksValues.length > 0).should('eq', true);
                  cy.wrap(store.resources.systemResources.resourcesSummary.cpu).should('have.length', 3);
                  cy.wrap(store.resources.systemResources.resourcesSummary.memory).should('have.length', 3);
                  cy.wrap(store.resources.systemResources.resourcesSummary.storage).should('have.length', 7);
                  cy.wrap(store.resources.systemResources.resourcesSummary.timestamp).should('not.eq', undefined);
                } else {
                  cy.wrap(store.resources.systemResources.cpu).should('have.length', 1);
                  cy.wrap(store.resources.systemResources.cpu[0].name).should('eq', 'NODE');
                  cy.wrap(store.resources.systemResources.memory).should('have.length', 3);
                  cy.wrap(store.resources.systemResources.memory[0].name).should('eq', 'TOTAL');
                  cy.wrap(store.resources.systemResources.memory[1].name).should('eq', 'NODE');
                  cy.wrap(store.resources.systemResources.memory[2].name).should('eq', 'VALIDATORS');
                }
              }
            });
          });
      });
  });

  it('[SYSTEM RESOURCES] should display charts', () => {
    cy.wait(1000)
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.subscribe(store => {
              if (!isOcaml(store)) {
                store.select('resources')
                  .subscribe(() => {
                    cy.get('.resource-category-block')
                      .its('length')
                      .should(value => expect(value).to.equal(3));
                    cy.get('app-tezedge-line-chart')
                      .its('length')
                      .should(value => expect(value).to.equal(3));
                  });
              }
            });
          });
      });
  });

  it('[SYSTEM RESOURCES] should display tooltip on chart when hovering on it', () => {
    cy.wait(1000)
      .then(() => {
        cy.window()
          .its('store')
          .then((store) => {
            store.subscribe(store => {
              if (!isOcaml(store)) {
                store.select('resources')
                  .subscribe(() => {
                    cy.get('.tooltip-area')
                      .its(2)
                      .trigger('mousemove')
                      .then(() => {
                        cy.wait(1000);
                        cy.get('.ngx-charts-tooltip-content').should(value => expect(value).to.not.equal(undefined));
                      });
                  });
              }
            });
          });
      });
  });

});
