context('NETWORK', () => {
  beforeEach(() => {
    cy.visit(Cypress.config().baseUrl);
    cy.wait(1000);
    cy.intercept('GET', '/v2/p2p?node_name=*').as('getNetworkRequest');
    cy.wait(1000);
    cy.visit(Cypress.config().baseUrl + '/#/network', { timeout: 10000 });
    cy.wait(1000);
  });

  it('[NETWORK] should perform network request successfully', () => {
    cy.wait(1000).then(() => {
      cy.get('@getNetworkRequest').its('response.statusCode').should('eq', 200);
    });
  });

  it('[NETWORK] should create rows for the virtual scroll table', () => {
    cy.get('.virtual-scroll-container')
      .find('.virtualScrollRow')
      .should('be.visible');
  });

  it('[NETWORK] should change the value of the virtual scroll element when scrolling', () => {
    let beforeScrollValue;

    cy.wait(1000)
      .then(() => {
        cy.get('.stop-stream').click();

        cy.window()
          .its('store')
          .then((store) => {
            store.select('networkAction')
              .subscribe((data) => {
                if (!data.stream) {
                  cy.get('.virtual-scroll-container .virtualScrollRow.used')
                    .last()
                    .find('.date-time')
                    .then(($span) => {
                      beforeScrollValue = $span.text().trim();
                    });

                  cy.wait(500);
                  cy.get('.virtual-scroll-container').scrollTo('top');

                  cy.get('.virtual-scroll-container .virtualScrollRow.used')
                    .last()
                    .find('.date-time')
                    .should(($span) => {
                      expect($span.text()).to.not.equal(beforeScrollValue);
                    });
                } else {
                  cy.get('.stop-stream').click();
                }
              });
          });
      });
  });

  it('[NETWORK] should fill the last row of the table with the last value received', () => {
    cy.wait(1000).then(() => {
      cy.get('.stop-stream').click();

      cy.window()
        .its('store')
        .then((store) => {
          store.select('networkAction').subscribe((data) => {
            if (!data.stream) {
              const lastRecord = data.entities[data.ids[data.ids.length - 1]];
              cy.get('.virtual-scroll-container .virtualScrollRow.used')
                .last()
                .find('.network-action-table-address')
                .should((span) => {
                  expect(span.text().trim()).to.equal(lastRecord.remote_addr);
                });
            } else {
              cy.get('.stop-stream').click();
            }
          });
        });
    });
  });

  it('[NETWORK] should fill the right details part with the message of the clicked row - the second last record in our case', () => {
    cy.wait(1000)
      .then(() => {
        cy.get('.stop-stream')
          .then(element => {
            element.click();
          });

        cy.window()
          .its('store')
          .then((store) => {
            store.subscribe(data => {
              if (!data.settingsNode.activeNode.id.includes('ocaml')) {
                store.select('networkAction')
                  .subscribe((data) => {
                    if (!data.stream) {
                      cy.get('.virtual-scroll-container .virtualScrollRow.used')
                        .eq(-2).trigger('click');
                      cy.get('.ngx-json-viewer').should('be.visible');

                    } else {
                      cy.get('.stop-stream').click();
                    }
                  });
              }
            });
          });
      });
  });
});
