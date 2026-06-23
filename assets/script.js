/* ===================================================
   PORTFÓLIO — CATAS
   Arquivo de comportamento (JavaScript).
   Tudo aqui é genérico: a mesma função cuida da seção
   "Galeria" e da seção "Catas", então criar uma 3ª
   seção no futuro é só repetir o padrão no HTML.
   =================================================== */

const modelo = document.getElementById('modelo-cartao');

/* ---------- menu mobile ---------- */
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
navToggle.addEventListener('click', () => navLinks.classList.toggle('aberto'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('aberto'))
);

/* ---------- foto de perfil ---------- */
const fotoPerfil = document.getElementById('foto-perfil');
const fotoPerfilImg = document.getElementById('foto-perfil-img');
const iconeCamera = document.getElementById('icone-camera');
const inputFotoPerfil = document.getElementById('input-foto-perfil');
const CHAVE_FOTO = 'portfolio-foto-perfil';

fotoPerfil.addEventListener('click', () => inputFotoPerfil.click());

inputFotoPerfil.addEventListener('change', (e) => {
  const arquivo = e.target.files[0];
  if (!arquivo) return;
  const leitor = new FileReader();
  leitor.onload = (ev) => {
    definirFotoPerfil(ev.target.result);
    try { localStorage.setItem(CHAVE_FOTO, ev.target.result); } catch (err) {}
  };
  leitor.readAsDataURL(arquivo);
});

function definirFotoPerfil(src) {
  fotoPerfilImg.src = src;
  fotoPerfilImg.style.display = 'block';
  iconeCamera.style.display = 'none';
}

(function carregarFotoPerfil() {
  try {
    const salva = localStorage.getItem(CHAVE_FOTO);
    if (salva) definirFotoPerfil(salva);
  } catch (e) {}
})();

/* ====================================================
   GALERIAS GENÉRICAS
   Cada galeria da página (Galeria, Catas, ou outra que
   você criar) é controlada por um "iniciarGaleria",
   passando o id do container e o id do input de arquivo.
   Cada uma salva seus dados com uma chave própria, então
   não se misturam.
   ==================================================== */

function iniciarGaleria(idGaleria, idInputArquivo, chaveStorage) {
  const galeria = document.getElementById(idGaleria);
  const inputArquivo = document.getElementById(idInputArquivo);

  if (!galeria || !inputArquivo) return;

  function salvar() {
    const itens = [...galeria.querySelectorAll('.cartao')].map(c => ({
      src: c.querySelector('img').src,
      titulo: c.querySelector('.campo-titulo').value,
      texto: c.querySelector('.campo-texto').value
    }));
    try {
      localStorage.setItem(chaveStorage, JSON.stringify(itens));
    } catch (e) { /* armazenamento indisponível, segue sem salvar */ }
  }

  function criarCartao({ src, titulo, texto } = {}) {
    const node = modelo.content.cloneNode(true);
    const cartao = node.querySelector('.cartao');
    const img = cartao.querySelector('img');
    const campoTitulo = cartao.querySelector('.campo-titulo');
    const campoTexto = cartao.querySelector('.campo-texto');
    const faixaTitulo = cartao.querySelector('.faixa-titulo');
    const faixaTexto = cartao.querySelector('.faixa-texto');
    const removerBtn = cartao.querySelector('.remover');

    if (src) { img.src = src; }

    function atualizarFaixa() {
      faixaTitulo.textContent = campoTitulo.value || 'Sem título';
      faixaTexto.textContent = campoTexto.value || '';
    }

    campoTitulo.value = titulo || '';
    campoTexto.value = texto || '';
    atualizarFaixa();

    campoTitulo.addEventListener('input', () => { atualizarFaixa(); salvar(); });
    campoTexto.addEventListener('input', () => { atualizarFaixa(); salvar(); });

    removerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cartao.remove();
      salvar();
    });

    galeria.appendChild(cartao);
  }

  function criarCartaoAdicionar() {
    const div = document.createElement('div');
    div.className = 'cartao cartao-add';
    div.innerHTML = `
      <div class="img-area">
        <div class="placeholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>Adicionar imagem</span>
        </div>
      </div>`;
    div.addEventListener('click', () => inputArquivo.click());
    galeria.appendChild(div);
    return div;
  }

  function recolocarCartaoAdicionar() {
    const existente = galeria.querySelector('.cartao-add');
    if (existente) existente.remove();
    criarCartaoAdicionar();
  }

  inputArquivo.addEventListener('change', (e) => {
    const arquivos = [...e.target.files];
    arquivos.forEach(arquivo => {
      const leitor = new FileReader();
      leitor.onload = (ev) => {
        criarCartao({ src: ev.target.result, titulo: '', texto: '' });
        recolocarCartaoAdicionar();
        salvar();
      };
      leitor.readAsDataURL(arquivo);
    });
    inputArquivo.value = '';
  });

  function carregar() {
    let itens = [];
    try {
      itens = JSON.parse(localStorage.getItem(chaveStorage) || '[]');
    } catch (e) { itens = []; }
    itens.forEach(item => criarCartao(item));
    criarCartaoAdicionar();
  }

  carregar();
}

/* registra cada galeria da página — adicione uma linha
   aqui se criar uma nova seção com sua própria grade */
iniciarGaleria('galeria', 'input-arquivo', 'portfolio-itens');
iniciarGaleria('galeria-catas', 'input-arquivo-catas', 'portfolio-itens-catas');

/* ---------- título e bio editáveis ---------- */
const navMarca = document.querySelector('.nav-marca');
['titulo', 'bio'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  const chave = 'portfolio-' + id;
  const salvo = localStorage.getItem(chave);
  if (salvo) el.innerText = salvo;
  el.addEventListener('input', () => {
    localStorage.setItem(chave, el.innerText);
    if (id === 'titulo' && navMarca) navMarca.textContent = el.innerText;
  });
});
if (navMarca && document.getElementById('titulo')) {
  navMarca.textContent = document.getElementById('titulo').innerText;
}
