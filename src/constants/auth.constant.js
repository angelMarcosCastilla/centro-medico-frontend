export const listRoles = {
  tomografia: ['T', 'DT', 'R', 'DR'],
  admisión: ['A'],
  triaje: ['T'],
  radiologia: ['R', 'DR'],
  laboratorio: ['L', 'DL'],
  servicios: ['L'],
  plantillas: ['L'],
  pagos: ['A']
}

export const redirectRoles = {
  A: '/admision',
  L: '/laboratorio',
  R: '/rayosx',
  T: '/tomografia'
}

export const mapRoles = {
  A: 'Admisión',
  L: 'Laboratorio',
  R: 'Radiologia',
  T: 'Tomografia'
}
