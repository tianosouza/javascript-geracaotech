function abrirModal () {
  overlay.classList.add('active');
  criarTarefa.classList.add('active');
}

function fecharModal () {
  overlay.classList.remove('active');
  criarTarefa.classList.remove('active');
}

function buscarTarefas () {
  fetch('http://localhost:3000/tarefas')
    .then(res => res.json())
    .then(res => {
      inserirtarefas(res);
    })
}

buscarTarefas();

function inserirtarefas (trarefas) {
  if (trarefas.length > 0) {
    lista.innerHTML = '';
    trarefas.map (tarefa => {
      lista.innerHTML += `
        <li>
          <h5>${tarefa.titulo}</h5>
          <p>${tarefa.descricao}</p>
          <div class="actions">
            <box-icon name='pencil' size="sm" onclick="editarTarefa(${tarefa.id})" title="Editar tarefa"></box-icon>
            <box-icon name='trash' size="sm" onclick="deletarTarefa(${tarefa.id})" title="Excluir tarefa"></box-icon>
          </div>
        </li>
      `;
    })
  } else {
    lista.innerHTML = `     
        <h6>Nenhuma tarefa registrada</h6>
    `;
  }
}

function novaTarefa () {
  event.preventDefault();
  fetch('http://localhost:3000/tarefas', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      titulo: titulo.value,
      descricao: descricao.value
    })    
  })
  .then(res => res.json())
  .then(res => {
    fecharModal();
    buscarTarefas();
    let form = document.querySelector('form');
    form.reset();
  })
}

function deletarTarefa (id) {
  fetch(`http://localhost:3000/tarefas/${id}`, {
    method: 'DELETE'
  })
  .then(res => res.json())
  .then(res => {
    alert('Tarefa deletada com sucesso!');
    buscarTarefas();
  })
  .catch(err => console.log(err))
}

function pesquisarTarefa () {
  let lis = document.querySelectorAll('ul li');
  if (busca.value.length > 0) {
    lis.forEach(li => {
      console.log('li', li.textContent);
      if (!li.textContent.includes(busca.value)) {
        li.classList.add('oculto');
      } else {
        li.classList.remove('oculto');
      }
    })
  } else {
    lis.forEach(li => {
      li.classList.remove('oculto');
    })
  }
}

function editarTarefa (id) {
  abrirModal();
  fetch(`http://localhost:3000/tarefas/${id}`)
    .then(res => res.json())
    .then(res => {
      titulo.value = res.titulo;
      descricao.value = res.descricao;
      btn.innerHTML = 'Atualizar tarefa';
      btn.setAttribute('onclick', `atualizarTarefa(${id})`);
  })
}

function atualizarTarefa (id) {
  event.preventDefault();
  fetch(`http://localhost:3000/tarefas/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      titulo: titulo.value,
      descricao: descricao.value
    })
  })
  .then(res => res.json())
  .then(res => {
    fecharModal();
    buscarTarefas();
    let form = document.querySelector('form');
    form.reset();
  })
}