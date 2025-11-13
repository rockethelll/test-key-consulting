export const environment = {
  production: true,

  regionsUrl: (nom?: string) =>
    `https://geo.api.gouv.fr/regions${
      nom ? `?nom=${encodeURIComponent(nom)}` : ''
    }`,

  departementsUrl: (codeRegion: string) =>
    `https://geo.api.gouv.fr/regions/${codeRegion}/departements`,

  municipalitesUrl: (codeDepartement: string) =>
    `https://geo.api.gouv.fr/departements/${codeDepartement}/communes`,
};
