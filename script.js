        // Produtos disponíveis das marcas Nike, Adidas e Olympikus
        const products = [
          // Nike
          { id: 1, name: "Nike Air Force 1", price: 799.90, brand: "Nike" },
          { id: 2, name: "Nike Air Max 90", price: 899.90, brand: "Nike" },
          { id: 3, name: "Nike Revolution 6", price: 399.90, brand: "Nike" },
          { id: 4, name: "Nike Dunk Low", price: 699.90, brand: "Nike" },

          // Adidas
          { id: 5, name: "Adidas Ultraboost", price: 999.90, brand: "Adidas" },
          { id: 6, name: "Adidas Superstar", price: 499.90, brand: "Adidas" },
          { id: 7, name: "Adidas NMD R1", price: 799.90, brand: "Adidas" },
          { id: 8, name: "Adidas Stan Smith", price: 449.90, brand: "Adidas" },

          // Olympikus
          { id: 9, name: "Olympikus Corre 3", price: 299.90, brand: "Olympikus" },
          { id: 10, name: "Olympikus Attack", price: 349.90, brand: "Olympikus" },
          { id: 11, name: "Olympikus Vintage", price: 279.90, brand: "Olympikus" },
          { id: 12, name: "Olympikus Esporte", price: 199.90, brand: "Olympikus" }
      ];

      // Adicionar item ao formulário
      document.getElementById('add-item').addEventListener('click', function () {
          const container = document.getElementById('items-container');
          const itemCount = container.children.length + 1;

          const itemDiv = document.createElement('div');
          itemDiv.className = 'item-row';
          itemDiv.innerHTML = `
              <div>
                  <label>Item ${itemCount}</label>
                  <select class="product-select" required>
                      <option value="">Selecione o produto</option>
                      <optgroup label="Nike">
                          ${products.filter(p => p.brand === "Nike").map(p =>
              `<option value="${p.id}" data-price="${p.price}">${p.name} - R$ ${p.price.toFixed(2)}</option>`
          ).join('')}
                      </optgroup>
                      <optgroup label="Adidas">
                          ${products.filter(p => p.brand === "Adidas").map(p =>
              `<option value="${p.id}" data-price="${p.price}">${p.name} - R$ ${p.price.toFixed(2)}</option>`
          ).join('')}
                      </optgroup>
                      <optgroup label="Olympikus">
                          ${products.filter(p => p.brand === "Olympikus").map(p =>
              `<option value="${p.id}" data-price="${p.price}">${p.name} - R$ ${p.price.toFixed(2)}</option>`
          ).join('')}
                      </optgroup>
                  </select>
              </div>
              <div>
                  <label>Quantidade</label>
                  <input type="number" class="quantity" min="1" value="1" required>
              </div>
              <div>
                  <label>Valor Unit.</label>
                  <input type="text" class="price" readonly>
              </div>
              <div>
                  <label>Total</label>
                  <input type="text" class="item-total" readonly>
              </div>
              <div>
                  <button type="button" class="remove-item" style="background-color: #95a5a6;">Remover</button>
              </div>
          `;

          container.appendChild(itemDiv);

          // Atualizar preços quando selecionar produto
          const select = itemDiv.querySelector('.product-select');
          const priceInput = itemDiv.querySelector('.price');
          const quantityInput = itemDiv.querySelector('.quantity');
          const totalInput = itemDiv.querySelector('.item-total');

          select.addEventListener('change', function () {
              if (this.value) {
                  const selectedOption = this.options[this.selectedIndex];
                  const price = parseFloat(selectedOption.getAttribute('data-price'));
                  priceInput.value = price.toFixed(2);
                  updateItemTotal();
              } else {
                  priceInput.value = '';
                  totalInput.value = '';
              }
          });

          quantityInput.addEventListener('input', updateItemTotal);

          function updateItemTotal() {
              if (priceInput.value && quantityInput.value) {
                  const total = parseFloat(priceInput.value) * parseInt(quantityInput.value);
                  totalInput.value = total.toFixed(2);
              }
          }

          // Remover item
          itemDiv.querySelector('.remove-item').addEventListener('click', function () {
              container.removeChild(itemDiv);
              // Renumerar itens
              const items = container.querySelectorAll('.item-row');
              items.forEach((item, index) => {
                  item.querySelector('label').textContent = `Item ${index + 1}`;
              });
          });
      });

      // Gerar documento
      document.getElementById('generate-doc').addEventListener('click', function () {
          // Validar formulário
          const clientName = document.getElementById('client-name').value;
          const clientDoc = document.getElementById('client-doc').value;
          const orderDate = document.getElementById('order-date').value;

          if (!clientName || !clientDoc || !orderDate) {
              alert('Preencha todos os campos obrigatórios!');
              return;
          }

          const items = document.querySelectorAll('.item-row');
          if (items.length === 0) {
              alert('Adicione pelo menos um item ao pedido!');
              return;
          }

          // Preencher documento
          document.getElementById('doc-client-name').textContent = clientName;
          document.getElementById('doc-client-doc').textContent = clientDoc;
          document.getElementById('doc-signature-name').textContent = clientName;

          // Formatar data
          const dateObj = new Date(orderDate);
          const formattedDate = dateObj.toLocaleDateString('pt-BR');
          document.getElementById('doc-date').textContent = formattedDate;

          // Gerar número de nota fiscal aleatório
          const randomNumber = Math.floor(Math.random() * 1000) + 1;
          document.getElementById('doc-number').textContent = randomNumber.toString().padStart(3, '0');

          // Adicionar itens
          const itemsTable = document.getElementById('doc-items').querySelector('tbody');
          itemsTable.innerHTML = '';

          let total = 0;
          items.forEach((item, index) => {
              const productSelect = item.querySelector('.product-select');
              const selectedOption = productSelect.options[productSelect.selectedIndex];
              const productName = selectedOption.text.split(' - ')[0];
              const quantity = item.querySelector('.quantity').value;
              const price = item.querySelector('.price').value;
              const itemTotal = item.querySelector('.item-total').value;

              total += parseFloat(itemTotal);

              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${index + 1}</td>
                  <td>${productName}</td>
                  <td>${quantity}</td>
                  <td>R$ ${parseFloat(price).toFixed(2)}</td>
                  <td>R$ ${parseFloat(itemTotal).toFixed(2)}</td>
              `;
              itemsTable.appendChild(row);
          });

          document.getElementById('doc-total').textContent = `R$ ${total.toFixed(2)}`;
          document.getElementById('doc-observations').textContent = document.getElementById('observations').value;

          // Mostrar documento
          document.getElementById('document').style.display = 'block';
      });

      // Imprimir documento (somente o conteúdo da nota fiscal)
      document.getElementById('print-doc').addEventListener('click', function () {
          const originalContents = document.body.innerHTML;
          const printContents = document.getElementById('document').innerHTML;

          document.body.innerHTML = printContents;
          window.print();
          document.body.innerHTML = originalContents;
          document.getElementById('document').style.display = 'block';
      });

      // Baixar PDF completo
      document.getElementById('download-pdf').addEventListener('click', function () {
          const element = document.getElementById('document');
          const opt = {
              margin: 10,
              filename: `nota_fiscal_heliocentrism_${document.getElementById('doc-number').textContent}.pdf`,
              image: { type: 'jpeg', quality: 0.98 },
              html2canvas: {
                  scale: 2,
                  scrollY: 0,
                  windowHeight: document.getElementById('document').scrollHeight
              },
              jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };

          // Criar clone do elemento para evitar problemas com o display
          const clone = element.cloneNode(true);
          clone.style.display = 'block';
          document.body.appendChild(clone);

          html2pdf().set(opt).from(clone).save().then(() => {
              document.body.removeChild(clone);
          });
      });

      // Definir data atual como padrão
      document.getElementById('order-date').valueAsDate = new Date();

      // Adicionar primeiro item automaticamente
      document.getElementById('add-item').click();