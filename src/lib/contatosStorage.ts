export function salvarContatos(contatos: any[]) {
  localStorage.setItem('contatos', JSON.stringify(contatos));
}

export function buscarContatos() {
  const contatos = localStorage.getItem('contatos');

  return contatos ? JSON.parse(contatos) : [];
}