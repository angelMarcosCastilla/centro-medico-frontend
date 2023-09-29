export const listRoles = {
  tomografia: ['T', 'DT'],
  admisión: ['A'],
  triaje: ['T'],
  radiologia: ['R', 'DR'],
  laboratorio: ['L', 'DL'],
  informes: ['L'],
  servicios: ['L'],
  plantillas: ['L'],
  pagos: ['A']
}

export const redirectRoles = {
  A: '/admision',
  L: '/laboratorio',
  R: '/rayosx',
  T: '/tomografia',
  E:"/externalmodule"
}

export const mapRoles = {
  A: 'Admisión',
  L: 'Laboratorio',
  R: 'Radiologia',
  T: 'Tomografia',
  E: 'ExternalModule'
}
