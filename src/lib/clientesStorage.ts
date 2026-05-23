export function salvarClientes(clientes: any[]) {
  localStorage.setItem("clientes", JSON.stringify(clientes));
}

export function buscarClientes() {
  const clientes = localStorage.getItem("clientes");

  return clientes ? JSON.parse(clientes) : [];
}