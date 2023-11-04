export const listRoles = {
  admision: ['A'],
  triaje: ['TR'],
  tomografia: ['T', 'DT'],
  radiologia: ['R', 'DR'],
  laboratorio: ['L', 'DL'],
  informes: ['A'],
  plantillas: ['L'],
  pagosconvenio: ['A'],
  reembolsos: ['A'],
  servicios: ['A'],
  reportes: ['A'],
  mantenimiento: ['A']
}

export const redirectRoles = {
  A: '/admision',
  L: '/laboratorio',
  R: '/rayosx',
  T: '/tomografia',
  E: '/externalmodule',
  TR: '/triaje'
}

export const mapRoles = {
  A: 'Admisión',
  L: 'Laboratorio',
  R: 'Radiologia',
  T: 'Tomografia',
  E: 'ExternalModule',
  TR: 'Triaje'
}
